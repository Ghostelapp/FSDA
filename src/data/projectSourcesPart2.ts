import { ProjectSourceFile } from '../types';

export const PROJECT_SOURCES_PART_2: Record<string, ProjectSourceFile[]> = {
  'proj-7': [
    {
      path: 'src/utils/jwt.ts',
      language: 'typescript',
      description: 'Moduł kryptograficzny generujący i weryfikujący pary tokenów Access Token (15 min) oraz Refresh Token (7 dni) w zmiennych środowiskowych.',
      code: `import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export type UserRole = 'student' | 'admin' | 'moderator';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(userId: string, tokenFamily: string): string {
  return jwt.sign({ sub: userId, family: tokenFamily }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string; family: string } {
  return jwt.verify(token, REFRESH_SECRET) as { sub: string; family: string };
}

export function hashTokenSha256(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}`,
    },
    {
      path: 'src/middleware/authMiddleware.ts',
      language: 'typescript',
      description: 'Middleware weryfikacji tokenów Bearer, kontrola ról (RBAC) oraz Rate Limiter blokujący ataki Brute-Force na logowanie.',
      code: `import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { AccessTokenPayload, UserRole, verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.' },
});

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Brak tokena autoryzacyjnego' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token wygasł lub jest nieprawidłowy' });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Brak wymaganych uprawnień do tego zasobu' });
      return;
    }
    next();
  };
}`,
    },
    {
      path: 'src/controllers/authController.ts',
      language: 'typescript',
      description: 'Kontroler logowania, rejestracji (bcrypt 12 rund), rotacji Refresh Tokenów w HttpOnly cookie oraz Token Reuse Detection.',
      code: `import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  hashTokenSha256,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

const REFRESH_COOKIE_NAME = 'sg_refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Repozytorium w produkcji zastępowane tabelami PostgreSQL (users + refresh_tokens)
interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
}
const usersByEmail = new Map<string, DbUser>();
const activeRefreshHashes = new Set<string>();
const revokedFamilies = new Set<string>();

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password || password.length < 8) {
    res.status(400).json({ error: 'Podaj poprawny e-mail oraz hasło min. 8 znaków.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (usersByEmail.has(normalizedEmail)) {
    res.status(409).json({ error: 'Konto o tym adresie już istnieje.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const newUser: DbUser = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash,
    role: 'student',
  };
  usersByEmail.set(normalizedEmail, newUser);
  res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  const user = email ? usersByEmail.get(email.trim().toLowerCase()) : undefined;

  // Stały komunikat 401 chroni przed enumeracją kont
  if (!user || !password || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: 'Nieprawidłowy e-mail lub hasło.' });
    return;
  }

  const family = crypto.randomUUID();
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken(user.id, family);
  activeRefreshHashes.add(hashTokenSha256(refreshToken));

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
  res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role } });
}

export function refresh(req: Request, res: Response): void {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: 'Brak ciasteczka sesji' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(token);
    const tokenHash = hashTokenSha256(token);

    // Wykrycie ponownego użycia zużytego Refresh Tokena (kradzież sesji)
    if (revokedFamilies.has(decoded.family) || !activeRefreshHashes.has(tokenHash)) {
      revokedFamilies.add(decoded.family);
      res.clearCookie(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);
      res.status(403).json({ error: 'Wykryto ponowne użycie tokena. Sesja unieważniona.' });
      return;
    }

    activeRefreshHashes.delete(tokenHash);
    const user = Array.from(usersByEmail.values()).find((u) => u.id === decoded.sub);
    if (!user) {
      res.status(401).json({ error: 'Konto nie istnieje' });
      return;
    }

    const nextAccess = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const nextRefresh = signRefreshToken(user.id, decoded.family);
    activeRefreshHashes.add(hashTokenSha256(nextRefresh));

    res.cookie(REFRESH_COOKIE_NAME, nextRefresh, COOKIE_OPTIONS);
    res.json({ accessToken: nextAccess });
  } catch {
    res.status(401).json({ error: 'Refresh token wygasł' });
  }
}

export function logout(req: Request, res: Response): void {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    activeRefreshHashes.delete(hashTokenSha256(token));
  }
  res.clearCookie(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);
  res.json({ ok: true });
}`,
    },
    {
      path: 'src/server.ts',
      language: 'typescript',
      description: 'Konfiguracja serwera Express z nagłówkami Helmet, CORS z obsługą credentials i chronionym panelem administratora.',
      code: `import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRateLimiter, requireAuth, requireRole } from './middleware/authMiddleware';
import { login, logout, refresh, register } from './controllers/authController';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.post('/api/auth/register', authRateLimiter, register);
app.post('/api/auth/login', authRateLimiter, login);
app.post('/api/auth/refresh', refresh);
app.post('/api/auth/logout', logout);

app.get('/api/admin/audit', requireAuth, requireRole('admin'), (_req, res) => {
  res.json({ status: 'Dostęp administracyjny zweryfikowany (RBAC)' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(\`SecureGate Auth API działa na porcie \${port}\`));`,
    },
  ],

  'proj-8': [
    {
      path: 'prisma/schema.prisma',
      language: 'prisma',
      description: 'Schemat bazy danych PostgreSQL dla bloga DevChronicle z relacjami User -> Post -> Comment oraz indeksem na polu slug.',
      code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String
  passwordHash String
  posts        Post[]
  comments     Comment[]
}

model Post {
  id        String    @id @default(cuid())
  slug      String    @unique
  title     String
  contentMd String
  published Boolean   @default(false)
  views     Int       @default(0)
  tags      String[]
  authorId  String
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([published, createdAt])
}

model Comment {
  id        String   @id @default(cuid())
  body      String
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}`,
    },
    {
      path: 'backend/src/utils/slugify.ts',
      language: 'typescript',
      description: 'Generator przyjaznych adresów URL (obsługujący polskie znaki diakrytyczne) oraz funkcja neutralizująca kod XSS w komentarzach.',
      code: `const POLISH_CHAR_MAP: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

export function createUrlSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (ch) => POLISH_CHAR_MAP[ch] || ch)
    .replace(/[^a-z0-9\\s-]/g, '')
    .trim()
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-');
}

export function sanitizeCommentHtml(rawText: string): string {
  return rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}`,
    },
    {
      path: 'backend/src/routes/posts.ts',
      language: 'typescript',
      description: 'Endpointy CRUD bloga CMS z paginacją, filtrowaniem po tagu, inkrementacją wyświetleń i kontrolą własności autora.',
      code: `import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createUrlSlug, sanitizeCommentHtml } from '../utils/slugify';

const prisma = new PrismaClient();
export const postsRouter = Router();

postsRouter.get('/posts', async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = 10;
  const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;

  const where = {
    published: true,
    ...(tag ? { tags: { has: tag } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { name: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
});

postsRouter.get('/posts/:slug', async (req, res) => {
  const post = await prisma.post.update({
    where: { slug: req.params.slug },
    data: { views: { increment: 1 } },
    include: { comments: { orderBy: { createdAt: 'desc' } } },
  });
  res.json(post);
});

postsRouter.post('/posts', async (req, res) => {
  const { title, contentMd, tags, published, authorId } = req.body;
  const slug = \`\${createUrlSlug(title)}-\${Date.now().toString(36)}\`;
  const created = await prisma.post.create({
    data: { title, contentMd, slug, tags: tags || [], published: Boolean(published), authorId },
  });
  res.status(201).json(created);
});

postsRouter.post('/posts/:slug/comments', async (req, res) => {
  const { body, authorId } = req.body;
  const safeBody = sanitizeCommentHtml(String(body || '').trim());
  if (safeBody.length < 2) {
    res.status(400).json({ error: 'Komentarz jest za krótki.' });
    return;
  }
  const post = await prisma.post.findUniqueOrThrow({ where: { slug: req.params.slug } });
  const comment = await prisma.comment.create({
    data: { body: safeBody, postId: post.id, authorId },
  });
  res.status(201).json(comment);
});`,
    },
  ],

  'proj-9': [
    {
      path: 'server/src/validators/orderSchema.ts',
      language: 'typescript',
      description: 'Walidacja koszyka w Zod oraz kalkulacja cen wyłącznie na podstawie cennika serwerowego (ochrona przed manipulacją cen w przeglądarce).',
      code: `import { z } from 'zod';

export const OrderRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, 'Koszyk nie może być pusty'),
  promoCode: z.string().trim().optional(),
  customerEmail: z.string().email('Podaj poprawny e-mail do faktury'),
});

export const PRODUCT_CATALOG_GROSZE: Record<string, { name: string; priceGrosze: number }> = {
  'course-ts': { name: 'Kurs TypeScript Pro', priceGrosze: 14900 },
  'course-node': { name: 'Node.js & PostgreSQL Architecture', priceGrosze: 19900 },
};

export function calculateTrustedTotalGrosze(
  items: { productId: string; quantity: number }[],
  promoCode?: string
): number {
  const subtotal = items.reduce((sum, item) => {
    const product = PRODUCT_CATALOG_GROSZE[item.productId];
    if (!product) throw new Error(\`Nieznany produkt: \${item.productId}\`);
    return sum + product.priceGrosze * item.quantity;
  }, 0);

  if (promoCode?.toUpperCase() === 'DEV20') {
    return Math.round(subtotal * 0.8);
  }
  return subtotal;
}`,
    },
    {
      path: 'server/src/services/stripeService.ts',
      language: 'typescript',
      description: 'Serwis tworzący bezpieczną sesję PaymentIntent po stronie serwera bez przesyłania ceny od klienta.',
      code: `import Stripe from 'stripe';
import { calculateTrustedTotalGrosze, OrderRequestSchema } from '../validators/orderSchema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function createCheckoutPaymentIntent(rawBody: unknown) {
  const parsed = OrderRequestSchema.parse(rawBody);
  const amountGrosze = calculateTrustedTotalGrosze(parsed.items, parsed.promoCode);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountGrosze,
    currency: 'pln',
    receipt_email: parsed.customerEmail,
    metadata: {
      customerEmail: parsed.customerEmail,
      itemsJson: JSON.stringify(parsed.items),
    },
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    amountGrosze,
  };
}`,
    },
    {
      path: 'server/src/webhooks/stripeWebhook.ts',
      language: 'typescript',
      description: 'Obsługa webhooka Stripe z kryptograficzną weryfikacją podpisu i idempotentną realizacją zamówienia po opłaceniu.',
      code: `import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});
const processedEvents = new Set<string>();

export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (typeof signature !== 'string') {
    res.status(400).send('Brak nagłówka stripe-signature');
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    res.status(400).send(\`Webhook Signature Error: \${(err as Error).message}\`);
    return;
  }

  // Ochrona przed podwójnym przetworzeniem tego samego webhooka
  if (processedEvents.has(event.id)) {
    res.json({ received: true, deduplicated: true });
    return;
  }
  processedEvents.add(event.id);

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.log(\`Zamówienie opłacone: \${intent.id} kwota \${intent.amount / 100} PLN\`);
    // W tym miejscu aktualizujemy status zamówienia w PostgreSQL na PAID oraz wysyłamy dostęp
  }

  res.json({ received: true });
}`,
    },
    {
      path: 'client/src/context/CartContext.tsx',
      language: 'tsx',
      description: 'Kontekst React koszyka zakupowego z trwałością LocalStorage, zmianą ilości i obsługą kodów rabatowych.',
      code: `import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  title: string;
  pricePln: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalPln: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('codemarket_cart') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('codemarket_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const totalPln = items.reduce((sum, i) => sum + i.pricePln * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalPln, addItem, removeItem, clearCart: () => setItems([]) }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart musi być użyty wewnątrz CartProvider');
  return ctx;
};`,
    },
  ],

  'proj-10': [
    {
      path: 'database/schema.sql',
      language: 'sql',
      description: 'Wielodostępny (Multi-Tenant) schemat bazy PostgreSQL z izolacją po kluczu tenant_id, subskrypcjami i zaproszeniami.',
      code: `CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan_tier TEXT NOT NULL CHECK (plan_tier IN ('FREE', 'STARTUP', 'PRO')) DEFAULT 'FREE',
  stripe_customer_id TEXT UNIQUE,
  seat_limit INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  UNIQUE (tenant_id, user_id)
);

CREATE INDEX idx_memberships_tenant ON memberships(tenant_id);

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ
);`,
    },
    {
      path: 'src/middleware/tenantMiddleware.ts',
      language: 'typescript',
      description: 'Strażnik izolacji danych Multi-Tenant uniemożliwiający użytkownikowi jednej firmy dostęp do zasobów innej organizacji.',
      code: `import { NextFunction, Request, Response } from 'express';

export type TenantRole = 'owner' | 'admin' | 'member';

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: TenantRole;
  seatLimit: number;
}

export interface TenantRequest extends Request {
  tenant?: TenantContext;
}

export function requireTenantAccess(minRole: TenantRole = 'member') {
  const roleWeight: Record<TenantRole, number> = { member: 1, admin: 2, owner: 3 };

  return (req: TenantRequest, res: Response, next: NextFunction): void => {
    const headerTenantId = req.headers['x-tenant-id'];
    if (typeof headerTenantId !== 'string' || !req.tenant) {
      res.status(403).json({ error: 'Brak kontekstu organizacji (Tenant Isolation)' });
      return;
    }

    if (req.tenant.tenantId !== headerTenantId) {
      res.status(403).json({ error: 'Naruszenie izolacji tenanta — brak dostępu.' });
      return;
    }

    if (roleWeight[req.tenant.role] < roleWeight[minRole]) {
      res.status(403).json({ error: \`Wymagana rola co najmniej: \${minRole}\` });
      return;
    }

    next();
  };
}`,
    },
    {
      path: 'src/billing/subscriptionService.ts',
      language: 'typescript',
      description: 'Egzekwowanie limitów planu subskrypcyjnego oraz synchronizacja zmian pakietów ze Stripe Billing.',
      code: `export type PlanTier = 'FREE' | 'STARTUP' | 'PRO';

export const PLAN_LIMITS: Record<PlanTier, { seats: number; projects: number }> = {
  FREE: { seats: 5, projects: 3 },
  STARTUP: { seats: 25, projects: 50 },
  PRO: { seats: 500, projects: 1000 },
};

export function assertCanInviteSeat(currentMembersCount: number, plan: PlanTier): void {
  const limit = PLAN_LIMITS[plan].seats;
  if (currentMembersCount >= limit) {
    throw new Error(\`Osiągnięto limit \${limit} miejsc w planie \${plan}. Przejdź na wyższy pakiet.\`);
  }
}

export function resolvePlanFromStripeEvent(status: string, priceTier: PlanTier): PlanTier {
  if (status === 'canceled' || status === 'unpaid') {
    return 'FREE';
  }
  return priceTier;
}`,
    },
  ],

  'proj-11': [
    {
      path: 'server/src/sockets/collabServer.ts',
      language: 'typescript',
      description: 'Serwer Socket.io z pokojami tematycznymi, buforem 50 ostatnich wiadomości, wskaźnikiem pisania (typing) oraz broadcastem rysunku Canvas.',
      code: `import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  sentAt: string;
}

const roomHistory = new Map<string, ChatMessage[]>();

export function attachCollabSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
  });

  io.on('connection', (socket: Socket) => {
    socket.on('join_room', (roomId: string, username: string) => {
      socket.join(roomId);
      const history = roomHistory.get(roomId) || [];
      socket.emit('room_history', history);
      socket.to(roomId).emit('user_presence', { username, status: 'online' });
    });

    socket.on('send_message', (payload: { roomId: string; author: string; text: string }) => {
      const msg: ChatMessage = {
        id: Date.now().toString(36),
        author: payload.author,
        text: payload.text.slice(0, 1000),
        sentAt: new Date().toISOString(),
      };
      const next = [...(roomHistory.get(payload.roomId) || []), msg].slice(-50);
      roomHistory.set(payload.roomId, next);
      io.to(payload.roomId).emit('new_message', msg);
    });

    socket.on('typing_indicator', (payload: { roomId: string; author: string; isTyping: boolean }) => {
      socket.to(payload.roomId).emit('typing_indicator', payload);
    });

    socket.on('draw_segment', (payload: { roomId: string; x0: number; y0: number; x1: number; y1: number; color: string }) => {
      socket.to(payload.roomId).emit('draw_segment', payload);
    });
  });

  return io;
}`,
    },
    {
      path: 'server/src/redis/presenceAdapter.ts',
      language: 'typescript',
      description: 'Konfiguracja adaptera Redis Pub/Sub pozwalająca skalować Socket.io na wiele serwerów bez utraty synchronizacji pokoi.',
      code: `import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server } from 'socket.io';

export async function enableRedisPubSubScaling(io: Server, redisUrl: string): Promise<void> {
  const pubClient = createClient({ url: redisUrl });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis Pub/Sub adapter dla Socket.io został podłączony.');
}`,
    },
    {
      path: 'client/src/canvas/SharedCanvas.tsx',
      language: 'tsx',
      description: 'Współdzielone płótno HTML5 Canvas w React z wysyłaniem wyłącznie różnic współrzędnych (delta) przez WebSocket.',
      code: `import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Segment {
  roomId: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
}

export const SharedCanvas: React.FC<{ roomId: string; username: string }> = ({ roomId, username }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#6366f1');

  const drawLine = (seg: Omit<Segment, 'roomId'>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(seg.x0, seg.y0);
    ctx.lineTo(seg.x1, seg.y1);
    ctx.stroke();
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:4000');
    socketRef.current = socket;

    const join = () => socket.emit('join_room', roomId, username);
    socket.on('connect', join);
    socket.on('draw_segment', (seg: Segment) => drawLine(seg));

    return () => {
      socket.disconnect();
    };
  }, [roomId, username]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1 || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x1 = e.clientX - rect.left;
    const y1 = e.clientY - rect.top;

    if (lastPos.current) {
      const seg = { roomId, x0: lastPos.current.x, y0: lastPos.current.y, x1, y1, color };
      drawLine(seg);
      socketRef.current?.emit('draw_segment', seg);
    }
    lastPos.current = { x: x1, y: y1 };
  };

  return (
    <div className="space-y-2">
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Kolor pędzla" />
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }}
        onPointerUp={() => { lastPos.current = null; }}
        onPointerMove={handlePointerMove}
        className="border border-slate-700 rounded-xl bg-white cursor-crosshair"
      />
    </div>
  );
};`,
    },
  ],

  'proj-12': [
    {
      path: 'server/src/index.ts',
      language: 'typescript',
      description: 'Produkcyjny serwer Express z kontrolą zdrowia bazy /api/health, zmiennymi środowiskowymi i bezpiecznym zamykaniem SIGTERM.',
      code: `import express from 'express';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw\`SELECT 1\`;
    res.status(200).json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unreachable' });
  }
});

const server = app.listen(PORT, () => {
  console.log(\`Capstone Production Server działa na porcie \${PORT}\`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});`,
    },
    {
      path: 'Dockerfile',
      language: 'docker',
      description: 'Wieloetapowy obraz Docker (Multi-stage build) minimalizujący rozmiar kontenera i uruchamiający aplikację jako użytkownik bez uprawnień roota.',
      code: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "dist/server/src/index.js"]`,
    },
    {
      path: 'docker-compose.yml',
      language: 'yaml',
      description: 'Orkiestracja produkcyjna kontenera aplikacji i PostgreSQL 16 z trwałym wolumenem oraz automatycznym restartem.',
      code: `services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  pg_data:`,
    },
    {
      path: '.github/workflows/ci-cd.yml',
      language: 'yaml',
      description: 'Automatyczny potok CI/CD w GitHub Actions: lint, testy jednostkowe/E2E, build oraz wdrożenie na VPS przez SSH.',
      code: `name: FullStack Capstone CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

      - name: Deploy na serwer VPS po sukcesie na gałęzi main
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/capstone
            git pull origin main
            docker compose up -d --build`,
    },
  ],
};
