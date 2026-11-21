import { ProjectSourceFile } from '../types';

export const PROJECT_SOURCES_PART_3: Record<string, ProjectSourceFile[]> = {
  // =========================================================================
  // PROJEKT 9: CodeMarket — E-Commerce Platform + Stripe Checkout & Webhooks
  // =========================================================================
  'proj-9': [
    {
      path: 'package.json',
      language: 'json',
      description: 'Konfiguracja Full-Stack E-Commerce (Express, Stripe SDK, PostgreSQL, Zod, React 19).',
      code: `{
  "name": "codemarket-ecommerce",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:server": "tsx watch server/src/index.ts",
    "dev:client": "vite",
    "build:server": "tsc -p tsconfig.json",
    "build:client": "vite build",
    "start": "node dist/server/src/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "pg": "^8.13.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "stripe": "^17.5.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/node": "^22.10.5",
    "@types/pg": "^8.11.10",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite": "^6.0.7"
  }
}`
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: 'Ścisła konfiguracja TypeScript dla serwera płatności i klienta React.',
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["server/src/**/*", "client/src/**/*"]
}`
    },
    {
      path: '.env.example',
      language: 'bash',
      description: 'Szablon zmiennych środowiskowych: baza PostgreSQL i klucze Stripe (test mode).',
      code: `PORT=4100
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codemarket
STRIPE_SECRET_KEY=sk_test_replace_with_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_replace_with_your_stripe_webhook_secret`
    },
    {
      path: 'database/schema.sql',
      language: 'sql',
      description: 'Schemat bazy PostgreSQL: produkty (ceny w groszach), zamówienia, pozycje oraz tabela idempotencji webhooków.',
      code: `CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'PLN',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email VARCHAR(255) NOT NULL,
  promo_code VARCHAR(32),
  discount_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'PLN',
  status VARCHAR(32) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0)
);

-- Tabela gwarantująca idempotencję obsługi zdarzeń Stripe
CREATE TABLE IF NOT EXISTS processed_stripe_events (
  event_id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(120) NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

INSERT INTO products (sku, name, category, description, price_cents, stock)
VALUES
  ('KEY-MECH-75', 'Klawiatura Mechaniczna Pro 75%', 'Hardware', 'Hot-swap tactile switches, aluminiowa obudowa CNC, QMK/VIA.', 54900, 18),
  ('MON-4K-27', 'Monitor IPS 27" 4K USB-C 90W', 'Hardware', 'Matryca 99% sRGB, jedno kablowe zasilanie i obraz dla laptopa.', 189900, 9),
  ('COURSE-TS-PRO', 'Architektura TypeScript & Node.js', 'Edukacja', 'Kompletny podręcznik inżynierski + repozytorium 10 projektów.', 24900, 999),
  ('DESK-MAT-XL', 'Mata Biurkowa Wool Felt XL', 'Akcesoria', 'Antypoślizgowa mata 90x40 cm redukująca hałas klawiatury.', 12900, 42)
ON CONFLICT (sku) DO NOTHING;`
    },
    {
      path: 'server/src/validators/orderSchema.ts',
      language: 'typescript',
      description: 'Walidacja Zod payloadu koszyka oraz kalkulacja rabatu (nigdy nie ufamy cenom z klienta).',
      code: `import { z } from 'zod';

export const checkoutPayloadSchema = z.object({
  customerEmail: z.string().trim().email('Podaj poprawny adres e-mail'),
  promoCode: z
    .string()
    .trim()
    .toUpperCase()
    .max(32)
    .optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Nieprawidłowy identyfikator produktu'),
        quantity: z.number().int().min(1).max(20)
      })
    )
    .min(1, 'Koszyk nie może być pusty')
    .max(30)
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;

export const PROMO_RATES: Record<string, number> = {
  DEV20: 0.2,
  WELCOME10: 0.1
};

export function calculateDiscountCents(subtotalCents: number, promoCode?: string): number {
  if (!promoCode) return 0;
  const rate = PROMO_RATES[promoCode.toUpperCase()] ?? 0;
  return Math.round(subtotalCents * rate);
}`
    },
    {
      path: 'server/src/services/stripeService.ts',
      language: 'typescript',
      description: 'Serwis Stripe Checkout: pobiera autorytatywne ceny z PostgreSQL, tworzy zamówienie i sesję płatności.',
      code: `import Stripe from 'stripe';
import { Pool } from 'pg';
import { CheckoutPayload, calculateDiscountCents } from '../validators/orderSchema.js';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion
});

interface DbProduct {
  id: string;
  name: string;
  price_cents: number;
  stock: number;
  currency: string;
}

export async function createCheckoutSessionForOrder(pool: Pool, payload: CheckoutPayload) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const productIds = payload.items.map((item) => item.productId);
    const { rows: products } = await client.query<DbProduct>(
      \`SELECT id, name, price_cents, stock, currency
       FROM products
       WHERE id = ANY($1::uuid[]) AND active = TRUE
       FOR UPDATE\`,
      [productIds]
    );

    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotalCents = 0;

    const resolvedItems = payload.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(\`Produkt \${item.productId} nie jest dostępny.\`);
      }
      if (product.stock < item.quantity) {
        throw new Error(\`Brak wystarczającej liczby sztuk produktu: \${product.name}.\`);
      }
      subtotalCents += product.price_cents * item.quantity;
      return { product, quantity: item.quantity };
    });

    const discountCents = calculateDiscountCents(subtotalCents, payload.promoCode);
    const totalCents = Math.max(0, subtotalCents - discountCents);

    const orderInsert = await client.query<{ id: string }>(
      \`INSERT INTO orders (customer_email, promo_code, discount_cents, total_cents, currency, status)
       VALUES ($1, $2, $3, $4, 'PLN', 'pending')
       RETURNING id\`,
      [payload.customerEmail, payload.promoCode ?? null, discountCents, totalCents]
    );

    const orderId = orderInsert.rows[0].id;

    for (const { product, quantity } of resolvedItems) {
      await client.query(
        \`INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
         VALUES ($1, $2, $3, $4)\`,
        [orderId, product.id, quantity, product.price_cents]
      );
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const discountFactor = subtotalCents > 0 ? totalCents / subtotalCents : 1;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: payload.customerEmail,
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: resolvedItems.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: product.currency.toLowerCase(),
          unit_amount: Math.max(100, Math.round(product.price_cents * discountFactor)),
          product_data: { name: product.name }
        }
      })),
      metadata: { orderId },
      success_url: \`\${clientUrl}/checkout/success?orderId=\${orderId}\`,
      cancel_url: \`\${clientUrl}/checkout/cancelled?orderId=\${orderId}\`
    });

    await client.query(
      'UPDATE orders SET stripe_session_id = $1 WHERE id = $2',
      [session.id, orderId]
    );

    await client.query('COMMIT');

    return {
      orderId,
      sessionId: session.id,
      checkoutUrl: session.url,
      subtotalCents,
      discountCents,
      totalCents
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}`
    },
    {
      path: 'server/src/webhooks/stripeWebhook.ts',
      language: 'typescript',
      description: 'Idempotentny handler webhooków Stripe weryfikujący podpis HMAC i aktualizujący stany magazynowe w transakcji.',
      code: `import { Request, Response } from 'express';
import { Pool } from 'pg';
import Stripe from 'stripe';
import { stripe } from '../services/stripeService.js';

export function createStripeWebhookHandler(pool: Pool) {
  return async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || typeof signature !== 'string' || !webhookSecret) {
      res.status(400).json({ error: 'Brak nagłówka stripe-signature lub klucza webhooka.' });
      return;
    }

    let event: Stripe.Event;
    try {
      // req.body jest surowym Bufferem dzięki express.raw({ type: 'application/json' })
      event = stripe.webhooks.constructEvent(req.body as Buffer, signature, webhookSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Nieprawidłowy podpis';
      res.status(400).send(\`Webhook Signature Verification Failed: \${msg}\`);
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const dedup = await client.query(
        \`INSERT INTO processed_stripe_events (event_id, event_type)
         VALUES ($1, $2)
         ON CONFLICT (event_id) DO NOTHING
         RETURNING event_id\`,
        [event.id, event.type]
      );

      if (dedup.rowCount === 0) {
        await client.query('COMMIT');
        res.status(200).json({ received: true, duplicate: true });
        return;
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await client.query(
            \`UPDATE orders
             SET status = 'paid',
                 stripe_payment_intent_id = $1,
                 paid_at = NOW()
             WHERE id = $2 AND status = 'pending'\`,
            [String(session.payment_intent || ''), orderId]
          );

          await client.query(
            \`UPDATE products p
             SET stock = GREATEST(0, p.stock - oi.quantity)
             FROM order_items oi
             WHERE oi.order_id = $1 AND oi.product_id = p.id\`,
            [orderId]
          );
        }
      } else if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
        const obj = event.data.object as { metadata?: { orderId?: string } };
        if (obj.metadata?.orderId) {
          await client.query(
            "UPDATE orders SET status = 'failed' WHERE id = $1 AND status = 'pending'",
            [obj.metadata.orderId]
          );
        }
      }

      await client.query('COMMIT');
      res.status(200).json({ received: true });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[StripeWebhook] Błąd przetwarzania:', err);
      res.status(500).json({ error: 'Błąd przetwarzania webhooka' });
    } finally {
      client.release();
    }
  };
}`
    },
    {
      path: 'server/src/index.ts',
      language: 'typescript',
      description: 'Serwer Express montujący raw-body webhook PRZED express.json(), katalog produktów i endpoint checkout.',
      code: `import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import { checkoutPayloadSchema } from './validators/orderSchema.js';
import { createCheckoutSessionForOrder } from './services/stripeService.js';
import { createStripeWebhookHandler } from './webhooks/stripeWebhook.js';

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

// KRYTYCZNE: Endpoint webhooka Stripe wymaga surowego Bufferu do weryfikacji HMAC
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  createStripeWebhookHandler(pool)
);

app.use(express.json({ limit: '64kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'degraded', database: 'disconnected' });
  }
});

app.get('/api/products', async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : null;
  const search = typeof req.query.q === 'string' ? req.query.q.trim() : null;

  const { rows } = await pool.query(
    \`SELECT id, sku, name, category, description, price_cents, currency, stock
     FROM products
     WHERE active = TRUE
       AND ($1::text IS NULL OR category = $1)
       AND ($2::text IS NULL OR name ILIKE '%' || $2 || '%' OR description ILIKE '%' || $2 || '%')
     ORDER BY created_at DESC\`,
    [category, search]
  );

  res.json({ products: rows });
});

app.post('/api/checkout', async (req, res) => {
  const parsed = checkoutPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Błąd walidacji koszyka', details: parsed.error.flatten() });
    return;
  }

  try {
    const result = await createCheckoutSessionForOrder(pool, parsed.data);
    res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nie udało się utworzyć sesji płatności';
    res.status(422).json({ error: message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  const { rows } = await pool.query(
    \`SELECT id, customer_email, promo_code, discount_cents, total_cents, currency, status, paid_at, created_at
     FROM orders WHERE id = $1\`,
    [req.params.id]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: 'Zamówienie nie zostało znalezione' });
    return;
  }

  res.json({ order: rows[0] });
});

const PORT = Number(process.env.PORT || 4100);
app.listen(PORT, () => {
  console.log(\`[CodeMarket] API nasłuchuje na porcie \${PORT}\`);
});`
    },
    {
      path: 'client/src/context/CartContext.tsx',
      language: 'tsx',
      description: 'Kontekst koszyka React z zapisem w localStorage, obsługą kodów rabatowych (DEV20 / WELCOME10) i sumowaniem.',
      code: `import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface StoreProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price_cents: number;
  currency: string;
  stock: number;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  promoCode: string;
  setPromoCode: (code: string) => void;
  addItem: (product: StoreProduct) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  itemCount: number;
}

const STORAGE_KEY = 'codemarket_cart_v1';
const PROMO_RATES: Record<string, number> = { DEV20: 0.2, WELCOME10: 0.1 };

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: StoreProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(product.stock, i.quantity + 1) }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: Math.min(i.product.stock, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotalCents = items.reduce((acc, i) => acc + i.product.price_cents * i.quantity, 0);
    const rate = PROMO_RATES[promoCode.trim().toUpperCase()] ?? 0;
    const discountCents = Math.round(subtotalCents * rate);
    return {
      subtotalCents,
      discountCents,
      totalCents: Math.max(0, subtotalCents - discountCents),
      itemCount: items.reduce((acc, i) => acc + i.quantity, 0)
    };
  }, [items, promoCode]);

  return (
    <CartContext.Provider
      value={{
        items,
        promoCode,
        setPromoCode,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        ...totals
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart musi być używany wewnątrz CartProvider');
  return ctx;
}`
    },
    {
      path: 'client/src/App.tsx',
      language: 'tsx',
      description: 'Interfejs sklepu CodeMarket: filtrowanie kategorii, koszyk boczny, kod rabatowy i przekierowanie do Stripe Checkout.',
      code: `import React, { useEffect, useState } from 'react';
import { CartProvider, StoreProduct, useCart } from './context/CartContext';

const formatPln = (cents: number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(cents / 100);

const Storefront: React.FC = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [category, setCategory] = useState<string>('ALL');
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    items,
    promoCode,
    setPromoCode,
    addItem,
    updateQuantity,
    subtotalCents,
    discountCents,
    totalCents,
    itemCount
  } = useCart();

  useEffect(() => {
    const params = category !== 'ALL' ? \`?category=\${encodeURIComponent(category)}\` : '';
    fetch(\`/api/products\${params}\`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setStatusMsg('Nie udało się załadować katalogu produktów.'));
  }, [category]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: email,
          promoCode: promoCode.trim() || undefined,
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Błąd płatności');

      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
      } else {
        setStatusMsg(\`Utworzono zamówienie #\${data.orderId}\`);
      }
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : 'Błąd sieci');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>CodeMarket — Sklep dla Developerów</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'Hardware', 'Edukacja', 'Akcesoria'].map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} type="button">
              {cat === 'ALL' ? 'Wszystkie' : cat}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {products.map((product) => (
            <article key={product.id} style={{ border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
              <small>{product.category}</small>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>{formatPln(product.price_cents)}</strong>
              <div>
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() => addItem(product)}
                >
                  {product.stock > 0 ? 'Dodaj do koszyka' : 'Wyprzedane'}
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside style={{ border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
          <h2>Koszyk ({itemCount})</h2>
          {items.map(({ product, quantity }) => (
            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>{product.name}</span>
              <span>
                <button type="button" onClick={() => updateQuantity(product.id, -1)}>-</button>
                {' '}{quantity}{' '}
                <button type="button" onClick={() => updateQuantity(product.id, 1)}>+</button>
              </span>
            </div>
          ))}

          <form onSubmit={handleCheckout} style={{ display: 'grid', gap: 10, marginTop: 16 }}>
            <input
              type="text"
              placeholder="Kod rabatowy (np. DEV20)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <input
              type="email"
              required
              placeholder="Twój adres e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>Suma częściowa: {formatPln(subtotalCents)}</div>
            {discountCents > 0 && <div>Rabat: -{formatPln(discountCents)}</div>}
            <strong>Do zapłaty: {formatPln(totalCents)}</strong>
            {statusMsg && <p role="alert">{statusMsg}</p>}
            <button type="submit" disabled={submitting || items.length === 0}>
              {submitting ? 'Przekierowywanie do Stripe...' : 'Zapłać przez Stripe'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}`
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Dokumentacja uruchomienia sklepu CodeMarket, bazy PostgreSQL oraz lokalnego tunelu Stripe CLI.',
      code: `# CodeMarket — Full-Stack E-Commerce + Stripe

Kompletna platforma sprzedażowa z walidacją cen po stronie serwera, obsługą kodów rabatowych (\`DEV20\`, \`WELCOME10\`) oraz idempotentnym przetwarzaniem webhooków Stripe.

## Uruchomienie krok po kroku

1. Skopiuj plik konfiguracyjny i uzupełnij zmienne:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
2. Zainstaluj zależności i zainicjalizuj bazę PostgreSQL:
   \`\`\`bash
   npm install
   psql "$DATABASE_URL" -f database/schema.sql
   \`\`\`
3. Uruchom serwer API i aplikację kliencką:
   \`\`\`bash
   npm run dev:server
   npm run dev:client
   \`\`\`
4. Przekieruj lokalne webhooki Stripe (Stripe CLI):
   \`\`\`bash
   stripe listen --forward-to localhost:4100/api/webhooks/stripe
   \`\`\`

## Kluczowe zabezpieczenia
- Ceny produktów i rabaty są zawsze przeliczane po stronie backendu na podstawie rekordów z bazy.
- Transakcja \`FOR UPDATE\` zabezpiecza stan magazynowy przed wyścigiem (race condition).
- Tabela \`processed_stripe_events\` gwarantuje idempotencję przy ponowieniach webhooka.`
    }
  ],

  // =========================================================================
  // PROJEKT 10: TeamSync — B2B SaaS Multi-Tenant Workspace + Billing
  // =========================================================================
  'proj-10': [
    {
      path: 'package.json',
      language: 'json',
      description: 'Zależności platformy SaaS Multi-Tenant (Express, PostgreSQL, Stripe Billing, Zod, React 19).',
      code: `{
  "name": "teamsync-b2b-saas",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:server": "tsx watch src/server.ts",
    "dev:client": "vite",
    "build": "tsc -p tsconfig.json && vite build",
    "start": "node dist/src/server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "pg": "^8.13.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "stripe": "^17.5.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/node": "^22.10.5",
    "@types/pg": "^8.11.10",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite": "^6.0.7"
  }
}`
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: 'Konfiguracja TypeScript w trybie strict dla aplikacji multi-tenant.',
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["src/**/*", "client/src/**/*"]
}`
    },
    {
      path: '.env.example',
      language: 'bash',
      description: 'Zmienne środowiskowe: PostgreSQL, Stripe Billing Portal oraz adres aplikacji.',
      code: `PORT=4200
APP_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/teamsync
STRIPE_SECRET_KEY=sk_test_replace_with_key
STRIPE_PRICE_PRO=price_pro_monthly_id
STRIPE_PRICE_ENTERPRISE=price_enterprise_monthly_id`
    },
    {
      path: 'database/schema.sql',
      language: 'sql',
      description: 'Schemat Multi-Tenant PostgreSQL: organizacje, członkostwa RBAC, zaproszenia z tokenem SHA-256 i projekty izolowane przez tenant_id.',
      code: `CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  plan VARCHAR(24) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  stripe_customer_id VARCHAR(120),
  stripe_subscription_id VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(24) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, user_id)
);

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(24) NOT NULL CHECK (role IN ('admin', 'member')),
  token_hash CHAR(64) UNIQUE NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(140) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memberships_tenant ON memberships (tenant_id);
CREATE INDEX IF NOT EXISTS idx_invitations_tenant ON invitations (tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_tenant ON workspace_projects (tenant_id);`
    },
    {
      path: 'src/middleware/tenantMiddleware.ts',
      language: 'typescript',
      description: 'Middleware izolacji tenantów: weryfikuje członkostwo użytkownika w organizacji i wymusza role RBAC.',
      code: `import { NextFunction, Request, Response } from 'express';
import { Pool } from 'pg';

export type TenantRole = 'owner' | 'admin' | 'member';
export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  plan: PlanTier;
  userId: string;
  role: TenantRole;
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

export function createTenantGuard(pool: Pool) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.header('x-user-id');
    const tenantSlug = req.params.orgSlug || req.header('x-tenant-slug');

    if (!userId || !tenantSlug) {
      res.status(401).json({ error: 'Wymagana identyfikacja użytkownika oraz organizacji (tenant).' });
      return;
    }

    const { rows } = await pool.query<{
      tenant_id: string;
      slug: string;
      plan: PlanTier;
      role: TenantRole;
    }>(
      \`SELECT o.id AS tenant_id, o.slug, o.plan, m.role
       FROM organizations o
       INNER JOIN memberships m ON m.tenant_id = o.id
       WHERE o.slug = $1 AND m.user_id = $2\`,
      [tenantSlug, userId]
    );

    if (rows.length === 0) {
      res.status(403).json({ error: 'Brak dostępu do zasobów wybranej organizacji.' });
      return;
    }

    req.tenant = {
      tenantId: rows[0].tenant_id,
      tenantSlug: rows[0].slug,
      plan: rows[0].plan,
      userId,
      role: rows[0].role
    };

    next();
  };
}

export function requireTenantRoles(allowedRoles: TenantRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.tenant || !allowedRoles.includes(req.tenant.role)) {
      res.status(403).json({ error: 'Niewystarczające uprawnienia w organizacji.' });
      return;
    }
    next();
  };
}`
    },
    {
      path: 'src/billing/subscriptionService.ts',
      language: 'typescript',
      description: 'Limity planów SaaS (Free/Pro/Enterprise), kontrola miejsc (seat quota) i integracja Stripe Billing Portal.',
      code: `import Stripe from 'stripe';
import { Pool } from 'pg';
import { PlanTier } from '../middleware/tenantMiddleware.js';

export const PLAN_LIMITS: Record<PlanTier, { maxSeats: number; maxProjects: number; label: string }> = {
  free: { maxSeats: 3, maxProjects: 3, label: 'Free (do 3 osób)' },
  pro: { maxSeats: 25, maxProjects: 50, label: 'Pro (do 25 osób)' },
  enterprise: { maxSeats: 500, maxProjects: 1000, label: 'Enterprise (bez limitu)' }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion
});

export async function getSeatUsage(pool: Pool, tenantId: string, plan: PlanTier) {
  const [{ rows: members }, { rows: pendingInvites }] = await Promise.all([
    pool.query<{ count: string }>('SELECT COUNT(*) AS count FROM memberships WHERE tenant_id = $1', [tenantId]),
    pool.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM invitations WHERE tenant_id = $1 AND accepted_at IS NULL AND expires_at > NOW()',
      [tenantId]
    )
  ]);

  const activeSeats = Number(members[0]?.count ?? 0);
  const reservedSeats = Number(pendingInvites[0]?.count ?? 0);
  const limit = PLAN_LIMITS[plan].maxSeats;

  return {
    plan,
    activeSeats,
    reservedSeats,
    usedSeats: activeSeats + reservedSeats,
    maxSeats: limit,
    canInvite: activeSeats + reservedSeats < limit
  };
}

export async function assertCanInviteSeat(pool: Pool, tenantId: string, plan: PlanTier): Promise<void> {
  const usage = await getSeatUsage(pool, tenantId, plan);
  if (!usage.canInvite) {
    throw new Error(
      \`Osiągnięto limit miejsc dla planu \${plan.toUpperCase()} (\${usage.usedSeats}/\${usage.maxSeats}). Przejdź na wyższy plan.\`
    );
  }
}

export async function createBillingPortalUrl(pool: Pool, tenantId: string): Promise<string> {
  const { rows } = await pool.query<{ stripe_customer_id: string | null }>(
    'SELECT stripe_customer_id FROM organizations WHERE id = $1',
    [tenantId]
  );

  const customerId = rows[0]?.stripe_customer_id;
  if (!customerId) {
    throw new Error('Organizacja nie posiada jeszcze aktywnego profilu rozliczeniowego Stripe.');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: \`\${process.env.APP_URL || 'http://localhost:5173'}/settings/billing\`
  });

  return portalSession.url;
}`
    },
    {
      path: 'src/routes/invitations.ts',
      language: 'typescript',
      description: 'Endpointy wysyłki i akceptacji zaproszeń zespołowych z hashowaniem tokenów SHA-256 i kontrolą limitu miejsc.',
      code: `import crypto from 'node:crypto';
import { Router } from 'express';
import { Pool } from 'pg';
import { z } from 'zod';
import { requireTenantRoles } from '../middleware/tenantMiddleware.js';
import { assertCanInviteSeat, getSeatUsage } from '../billing/subscriptionService.js';

const createInviteSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(['admin', 'member']).default('member')
});

function sha256(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function createInvitationsRouter(pool: Pool): Router {
  const router = Router();

  router.get('/seats', async (req, res) => {
    const { tenantId, plan } = req.tenant!;
    const usage = await getSeatUsage(pool, tenantId, plan);
    res.json(usage);
  });

  router.post('/invitations', requireTenantRoles(['owner', 'admin']), async (req, res) => {
    const parsed = createInviteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Nieprawidłowe dane zaproszenia', details: parsed.error.flatten() });
      return;
    }

    const { tenantId, plan, userId } = req.tenant!;
    try {
      await assertCanInviteSeat(pool, tenantId, plan);

      const rawToken = crypto.randomBytes(24).toString('hex');
      const tokenHash = sha256(rawToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const { rows } = await pool.query<{ id: string }>(
        \`INSERT INTO invitations (tenant_id, email, role, token_hash, invited_by, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id\`,
        [tenantId, parsed.data.email.toLowerCase(), parsed.data.role, tokenHash, userId, expiresAt]
      );

      res.status(201).json({
        invitationId: rows[0].id,
        email: parsed.data.email.toLowerCase(),
        role: parsed.data.role,
        inviteLink: \`\${process.env.APP_URL || 'http://localhost:5173'}/invite/\${rawToken}\`,
        expiresAt: expiresAt.toISOString()
      });
    } catch (err) {
      res.status(402).json({ error: err instanceof Error ? err.message : 'Nie można utworzyć zaproszenia' });
    }
  });

  router.post('/invitations/accept', async (req, res) => {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const userId = req.header('x-user-id');
    if (!token || !userId) {
      res.status(400).json({ error: 'Brak tokenu zaproszenia lub identyfikatora użytkownika.' });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query<{ id: string; tenant_id: string; role: string }>(
        \`SELECT id, tenant_id, role
         FROM invitations
         WHERE token_hash = $1 AND accepted_at IS NULL AND expires_at > NOW()
         FOR UPDATE\`,
        [sha256(token)]
      );

      if (rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(404).json({ error: 'Zaproszenie wygasło lub jest nieprawidłowe.' });
        return;
      }

      const invite = rows[0];
      await client.query(
        \`INSERT INTO memberships (tenant_id, user_id, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = EXCLUDED.role\`,
        [invite.tenant_id, userId, invite.role]
      );
      await client.query('UPDATE invitations SET accepted_at = NOW() WHERE id = $1', [invite.id]);
      await client.query('COMMIT');

      res.json({ joinedTenantId: invite.tenant_id, role: invite.role });
    } catch (err) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Błąd podczas akceptacji zaproszenia.' });
    } finally {
      client.release();
    }
  });

  return router;
}`
    },
    {
      path: 'src/server.ts',
      language: 'typescript',
      description: 'Serwer Express dla B2B SaaS z izolowanymi trasami /api/orgs/:orgSlug oraz zarządzaniem subskrypcją.',
      code: `import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import { z } from 'zod';
import { createTenantGuard, requireTenantRoles } from './middleware/tenantMiddleware.js';
import { createInvitationsRouter } from './routes/invitations.js';
import { createBillingPortalUrl } from './billing/subscriptionService.js';

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(helmet());
app.use(cors({ origin: process.env.APP_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '64kb' }));

const tenantGuard = createTenantGuard(pool);

app.get('/api/orgs/:orgSlug/projects', tenantGuard, async (req, res) => {
  const { rows } = await pool.query(
    \`SELECT id, name, status, created_at
     FROM workspace_projects
     WHERE tenant_id = $1
     ORDER BY created_at DESC\`,
    [req.tenant!.tenantId]
  );
  res.json({ tenant: req.tenant, projects: rows });
});

app.post('/api/orgs/:orgSlug/projects', tenantGuard, requireTenantRoles(['owner', 'admin', 'member']), async (req, res) => {
  const schema = z.object({ name: z.string().trim().min(2).max(140) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Podaj poprawną nazwę projektu (min. 2 znaki).' });
    return;
  }

  const { rows } = await pool.query(
    \`INSERT INTO workspace_projects (tenant_id, name)
     VALUES ($1, $2)
     RETURNING id, name, status, created_at\`,
    [req.tenant!.tenantId, parsed.data.name]
  );
  res.status(201).json({ project: rows[0] });
});

app.post('/api/orgs/:orgSlug/billing/portal', tenantGuard, requireTenantRoles(['owner']), async (req, res) => {
  try {
    const url = await createBillingPortalUrl(pool, req.tenant!.tenantId);
    res.json({ url });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Błąd Stripe Portal' });
  }
});

app.use('/api/orgs/:orgSlug', tenantGuard, createInvitationsRouter(pool));

const PORT = Number(process.env.PORT || 4200);
app.listen(PORT, () => {
  console.log(\`[TeamSync] SaaS API uruchomione na porcie \${PORT}\`);
});`
    },
    {
      path: 'client/src/WorkspaceDashboard.tsx',
      language: 'tsx',
      description: 'Panel organizacji B2B SaaS: przełącznik tenantów, pasek wykorzystania miejsc, formularz zaproszeń i portal subskrypcji.',
      code: `import React, { useEffect, useState } from 'react';

interface SeatUsage {
  plan: 'free' | 'pro' | 'enterprise';
  activeSeats: number;
  reservedSeats: number;
  usedSeats: number;
  maxSeats: number;
  canInvite: boolean;
}

interface WorkspaceProject {
  id: string;
  name: string;
  status: string;
}

export const WorkspaceDashboard: React.FC<{ userId: string; organizations: string[] }> = ({
  userId,
  organizations
}) => {
  const [orgSlug, setOrgSlug] = useState(organizations[0] || 'acme-corp');
  const [seats, setSeats] = useState<SeatUsage | null>(null);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'admin'>('member');
  const [feedback, setFeedback] = useState<string | null>(null);

  const authHeaders = {
    'Content-Type': 'application/json',
    'x-user-id': userId
  };

  const loadWorkspace = async (slug: string) => {
    const [seatsRes, projRes] = await Promise.all([
      fetch(\`/api/orgs/\${slug}/seats\`, { headers: authHeaders }),
      fetch(\`/api/orgs/\${slug}/projects\`, { headers: authHeaders })
    ]);
    if (seatsRes.ok) setSeats(await seatsRes.json());
    if (projRes.ok) {
      const data = await projRes.json();
      setProjects(data.projects || []);
    }
  };

  useEffect(() => {
    loadWorkspace(orgSlug);
  }, [orgSlug]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = await fetch(\`/api/orgs/\${orgSlug}/invitations\`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ email: inviteEmail, role: inviteRole })
    });
    const data = await res.json();
    if (!res.ok) {
      setFeedback(data.error || 'Błąd wysyłki zaproszenia');
      return;
    }
    setInviteEmail('');
    setFeedback(\`Zaproszenie utworzone! Link: \${data.inviteLink}\`);
    await loadWorkspace(orgSlug);
  };

  const openBillingPortal = async () => {
    const res = await fetch(\`/api/orgs/\${orgSlug}/billing/portal\`, {
      method: 'POST',
      headers: authHeaders
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.assign(data.url);
    } else {
      setFeedback(data.error || 'Brak dostępu do portalu rozliczeń.');
    }
  };

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>TeamSync B2B Workspace</h1>
          <label>
            Organizacja:{' '}
            <select value={orgSlug} onChange={(e) => setOrgSlug(e.target.value)}>
              {organizations.map((slug) => (
                <option key={slug} value={slug}>{slug}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="button" onClick={openBillingPortal}>
          Zarządzaj subskrypcją (Stripe)
        </button>
      </header>

      {seats && (
        <section style={{ border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <strong>Plan: {seats.plan.toUpperCase()}</strong>
          <p>
            Wykorzystane miejsca: {seats.usedSeats} / {seats.maxSeats} (aktywni: {seats.activeSeats}, zaproszeni: {seats.reservedSeats})
          </p>
          <progress value={seats.usedSeats} max={seats.maxSeats} style={{ width: '100%' }} />
        </section>
      )}

      <section style={{ border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <h2>Zaproś członka zespołu</h2>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: 10 }}>
          <input
            type="email"
            required
            placeholder="anna@firma.pl"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as 'member' | 'admin')}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={seats ? !seats.canInvite : false}>
            Wyślij zaproszenie
          </button>
        </form>
        {feedback && <p role="status">{feedback}</p>}
      </section>

      <section>
        <h2>Projekty organizacji ({projects.length})</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.id}>{p.name} — <em>{p.status}</em></li>
          ))}
        </ul>
      </section>
    </main>
  );
};`
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Instrukcja konfiguracji i uruchamiania platformy multi-tenant TeamSync.',
      code: `# TeamSync — B2B SaaS Multi-Tenant

Architektura SaaS z twardą izolacją danych przez \`tenant_id\`, systemem ról RBAC (\`owner\`, \`admin\`, \`member\`), limitami miejsc (seat quota) oraz integracją Stripe Billing Portal.

## Uruchomienie

1. Skopiuj \`.env.example\` do \`.env\` i skonfiguruj bazę PostgreSQL oraz klucze Stripe.
2. Utwórz strukturę bazy:
   \`\`\`bash
   psql "$DATABASE_URL" -f database/schema.sql
   \`\`\`
3. Zainstaluj zależności i uruchom aplikację:
   \`\`\`bash
   npm install
   npm run dev:server
   npm run dev:client
   \`\`\`

## Bezpieczeństwo Multi-Tenant
- Każde zapytanie SQL filtruje zasoby po \`req.tenant.tenantId\` zweryfikowanym z tabeli \`memberships\`.
- Tokeny zaproszeń są przechowywane w bazie wyłącznie w formie skrótu SHA-256.`
    }
  ],

  // =========================================================================
  // PROJEKT 11: CollabBoard — Realtime Chat & Shared Whiteboard (WebSockets)
  // =========================================================================
  'proj-11': [
    {
      path: 'package.json',
      language: 'json',
      description: 'Zależności aplikacji Realtime (Express, Socket.io, Redis Pub/Sub, React 19, Vite).',
      code: `{
  "name": "collabboard-realtime",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:server": "tsx watch server/src/index.ts",
    "dev:client": "vite",
    "build": "tsc -p tsconfig.json && vite build",
    "start": "node dist/server/src/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "ioredis": "^5.4.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite": "^6.0.7"
  }
}`
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: 'Konfiguracja TypeScript dla serwera Socket.io oraz klienta React Canvas.',
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["server/src/**/*", "client/src/**/*"]
}`
    },
    {
      path: '.env.example',
      language: 'bash',
      description: 'Konfiguracja portu WebSocket, CORS oraz opcjonalnego klastra Redis Pub/Sub.',
      code: `# Środowisko serwera CollabBoard Realtime
NODE_ENV=development
PORT=4300

# Dozwolony adres klienta React dla połączeń CORS oraz WebSocket
CLIENT_ORIGIN=http://localhost:5173

# Opcjonalny adres Redis (gdy niedostępny, aplikacja używa lokalnego magazynu pamięciowego)
REDIS_URL=redis://localhost:6379`
    },
    {
      path: 'server/src/redis/presenceAdapter.ts',
      language: 'typescript',
      description: 'Adapter obecności (Presence) i historii wiadomości wspierający Redis Pub/Sub z bezpiecznym fallbackiem pamięciowym.',
      code: `import Redis from 'ioredis';

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  text: string;
  sentAt: string;
}

export interface RoomMember {
  socketId: string;
  userId: string;
  username: string;
}

const MAX_HISTORY = 50;

export class PresenceStore {
  private redis: Redis | null = null;
  private roomsMembers = new Map<string, Map<string, RoomMember>>();
  private roomsHistory = new Map<string, ChatMessage[]>();

  constructor(redisUrl?: string) {
    if (redisUrl) {
      const client = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
      client.connect().then(() => {
        this.redis = client;
        console.log('[CollabBoard] Połączono z Redis Presence Store');
      }).catch(() => {
        console.warn('[CollabBoard] Redis niedostępny — używam lokalnego magazynu pamięciowego');
        client.disconnect();
      });
    }
  }

  async addMember(roomId: string, member: RoomMember): Promise<RoomMember[]> {
    if (!this.roomsMembers.has(roomId)) {
      this.roomsMembers.set(roomId, new Map());
    }
    this.roomsMembers.get(roomId)!.set(member.socketId, member);

    if (this.redis) {
      await this.redis.hset(\`room:\${roomId}:members\`, member.socketId, JSON.stringify(member));
    }
    return this.getMembers(roomId);
  }

  async removeMember(roomId: string, socketId: string): Promise<RoomMember[]> {
    this.roomsMembers.get(roomId)?.delete(socketId);
    if (this.redis) {
      await this.redis.hdel(\`room:\${roomId}:members\`, socketId);
    }
    return this.getMembers(roomId);
  }

  getMembers(roomId: string): RoomMember[] {
    return Array.from(this.roomsMembers.get(roomId)?.values() ?? []);
  }

  async appendMessage(roomId: string, msg: ChatMessage): Promise<void> {
    const list = this.roomsHistory.get(roomId) ?? [];
    list.push(msg);
    if (list.length > MAX_HISTORY) list.shift();
    this.roomsHistory.set(roomId, list);

    if (this.redis) {
      await this.redis.rpush(\`room:\${roomId}:messages\`, JSON.stringify(msg));
      await this.redis.ltrim(\`room:\${roomId}:messages\`, -MAX_HISTORY, -1);
    }
  }

  async getHistory(roomId: string): Promise<ChatMessage[]> {
    if (this.redis) {
      const raw = await this.redis.lrange(\`room:\${roomId}:messages\`, 0, MAX_HISTORY - 1);
      if (raw.length > 0) return raw.map((item) => JSON.parse(item) as ChatMessage);
    }
    return this.roomsHistory.get(roomId) ?? [];
  }

  async close(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}`
    },
    {
      path: 'server/src/sockets/collabServer.ts',
      language: 'typescript',
      description: 'Logika pokojów Socket.io: dołączanie, historia 50 wiadomości, wskaźnik pisania, obecność online i synchronizacja rysunków Canvas.',
      code: `import crypto from 'node:crypto';
import { Server, Socket } from 'socket.io';
import { ChatMessage, PresenceStore } from '../redis/presenceAdapter.js';

export interface StrokeSegment {
  roomId: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  width: number;
}

export function attachCollabSocketHandlers(io: Server, store: PresenceStore): void {
  io.on('connection', (socket: Socket) => {
    let activeRoomId: string | null = null;
    let activeUsername = 'Gość';

    socket.on('room:join', async (payload: { roomId: string; userId: string; username: string }) => {
      const roomId = payload.roomId.trim().slice(0, 48);
      if (!roomId) return;

      if (activeRoomId) {
        socket.leave(activeRoomId);
        const remaining = await store.removeMember(activeRoomId, socket.id);
        io.to(activeRoomId).emit('presence:update', remaining);
      }

      activeRoomId = roomId;
      activeUsername = payload.username.trim().slice(0, 32) || 'Gość';
      socket.join(roomId);

      const [members, history] = await Promise.all([
        store.addMember(roomId, {
          socketId: socket.id,
          userId: payload.userId,
          username: activeUsername
        }),
        store.getHistory(roomId)
      ]);

      socket.emit('chat:history', history);
      io.to(roomId).emit('presence:update', members);
    });

    socket.on('chat:message', async (payload: { roomId: string; userId: string; text: string }) => {
      const cleanText = payload.text.trim().slice(0, 1000);
      if (!cleanText || !activeRoomId) return;

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        roomId: activeRoomId,
        userId: payload.userId,
        username: activeUsername,
        text: cleanText,
        sentAt: new Date().toISOString()
      };

      await store.appendMessage(activeRoomId, message);
      io.to(activeRoomId).emit('chat:message', message);
    });

    socket.on('chat:typing', (isTyping: boolean) => {
      if (!activeRoomId) return;
      socket.to(activeRoomId).emit('chat:typing', {
        username: activeUsername,
        isTyping: Boolean(isTyping)
      });
    });

    socket.on('canvas:stroke', (stroke: StrokeSegment) => {
      if (!activeRoomId || stroke.roomId !== activeRoomId) return;
      socket.to(activeRoomId).emit('canvas:stroke', {
        ...stroke,
        width: Math.min(24, Math.max(1, Number(stroke.width) || 3))
      });
    });

    socket.on('canvas:clear', () => {
      if (!activeRoomId) return;
      io.to(activeRoomId).emit('canvas:clear');
    });

    socket.on('disconnect', async () => {
      if (!activeRoomId) return;
      const members = await store.removeMember(activeRoomId, socket.id);
      io.to(activeRoomId).emit('presence:update', members);
    });
  });
}`
    },
    {
      path: 'server/src/index.ts',
      language: 'typescript',
      description: 'Serwer HTTP + Express + Socket.io z endpointem /health oraz eleganckim zamykaniem SIGTERM.',
      code: `import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { PresenceStore } from './redis/presenceAdapter.js';
import { attachCollabSocketHandlers } from './sockets/collabServer.js';

const app = express();
const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin }));
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'collabboard-realtime', uptimeSec: Math.round(process.uptime()) });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin, methods: ['GET', 'POST'] },
  pingInterval: 20000,
  pingTimeout: 10000
});

const presenceStore = new PresenceStore(process.env.REDIS_URL);
attachCollabSocketHandlers(io, presenceStore);

const PORT = Number(process.env.PORT || 4300);
httpServer.listen(PORT, () => {
  console.log(\`[CollabBoard] WebSocket server nasłuchuje na porcie \${PORT}\`);
});

async function shutdown() {
  console.log('[CollabBoard] Zamykanie serwera...');
  io.close();
  await presenceStore.close();
  httpServer.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);`
    },
    {
      path: 'client/src/canvas/SharedCanvas.tsx',
      language: 'tsx',
      description: 'Współdzielona tablica HTML5 Canvas z wyborem koloru, grubości pędzla, czyszczeniem i synchronizacją przez Socket.io.',
      code: `import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface StrokePayload {
  roomId: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  width: number;
}

interface SharedCanvasProps {
  socket: Socket;
  roomId: string;
}

export const SharedCanvas: React.FC<SharedCanvasProps> = ({ socket, roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState('#38bdf8');
  const [brushWidth, setBrushWidth] = useState(4);

  const drawSegment = (seg: Omit<StrokePayload, 'roomId'>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = seg.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(seg.x0, seg.y0);
    ctx.lineTo(seg.x1, seg.y1);
    ctx.stroke();
  };

  useEffect(() => {
    const onStroke = (stroke: StrokePayload) => drawSegment(stroke);
    const onClear = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on('canvas:stroke', onStroke);
    socket.on('canvas:clear', onClear);
    return () => {
      socket.off('canvas:stroke', onStroke);
      socket.off('canvas:clear', onClear);
    };
  }, [socket]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true;
    lastPointRef.current = getCoords(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !lastPointRef.current) return;
    const next = getCoords(e);
    const seg = {
      x0: lastPointRef.current.x,
      y0: lastPointRef.current.y,
      x1: next.x,
      y1: next.y,
      color,
      width: brushWidth
    };
    drawSegment(seg);
    socket.emit('canvas:stroke', { roomId, ...seg });
    lastPointRef.current = next;
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
        <label>
          Kolor: <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Grubość ({brushWidth}px):
          <input
            type="range"
            min={1}
            max={16}
            value={brushWidth}
            onChange={(e) => setBrushWidth(Number(e.target.value))}
          />
        </label>
        <button type="button" onClick={() => socket.emit('canvas:clear')}>
          Wyczyść tablicę
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={720}
        height={440}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #334155', touchAction: 'none' }}
      />
    </div>
  );
};`
    },
    {
      path: 'client/src/App.tsx',
      language: 'tsx',
      description: 'Główny widok CollabBoard: wybór pokoju, lista użytkowników online, czat na żywo ze wskaźnikiem pisania i SharedCanvas.',
      code: `import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { SharedCanvas } from './canvas/SharedCanvas';

interface ChatMessage {
  id: string;
  username: string;
  text: string;
  sentAt: string;
}

interface RoomMember {
  socketId: string;
  username: string;
}

const ROOMS = ['architecture', 'frontend-sprint', 'design-review'];

export default function App() {
  const socket = useMemo(() => io('http://localhost:4300', { autoConnect: true }), []);
  const [userId] = useState(() => crypto.randomUUID());
  const [username, setUsername] = useState('Dev_' + Math.floor(100 + Math.random() * 900));
  const [roomId, setRoomId] = useState(ROOMS[0]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const join = () => socket.emit('room:join', { roomId, userId, username });
    join();
    socket.on('connect', join);
    socket.on('chat:history', (history: ChatMessage[]) => setMessages(history));
    socket.on('chat:message', (msg: ChatMessage) => setMessages((prev) => [...prev, msg]));
    socket.on('presence:update', (list: RoomMember[]) => setMembers(list));
    socket.on('chat:typing', (evt: { username: string; isTyping: boolean }) => {
      setTypingUser(evt.isTyping ? evt.username : null);
    });

    return () => {
      socket.off('connect', join);
      socket.off('chat:history');
      socket.off('chat:message');
      socket.off('presence:update');
      socket.off('chat:typing');
    };
  }, [socket, roomId, userId, username]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    socket.emit('chat:message', { roomId, userId, text: draft });
    socket.emit('chat:typing', false);
    setDraft('');
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: 20, fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>CollabBoard Realtime</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} aria-label="Nazwa użytkownika" />
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            {ROOMS.map((r) => <option key={r} value={r}>#{r}</option>)}
          </select>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        <SharedCanvas socket={socket} roomId={roomId} />

        <aside style={{ border: '1px solid #334155', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <strong>Online w #{roomId} ({members.length})</strong>
          <div style={{ fontSize: 13 }}>{members.map((m) => m.username).join(', ')}</div>

          <div style={{ flex: 1, minHeight: 280, maxHeight: 320, overflowY: 'auto', borderTop: '1px solid #334155', paddingTop: 8 }}>
            {messages.map((m) => (
              <div key={m.id} style={{ marginBottom: 6 }}>
                <strong>{m.username}:</strong> {m.text}
              </div>
            ))}
          </div>

          {typingUser && <small>{typingUser} pisze...</small>}

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
            <input
              value={draft}
              placeholder="Napisz wiadomość..."
              onChange={(e) => {
                setDraft(e.target.value);
                socket.emit('chat:typing', e.target.value.length > 0);
              }}
              style={{ flex: 1 }}
            />
            <button type="submit">Wyślij</button>
          </form>
        </aside>
      </div>
    </div>
  );
}`
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Dokumentacja uruchomienia aplikacji CollabBoard i skalowania z Redis.',
      code: `# CollabBoard — Realtime Chat & Shared Whiteboard

Aplikacja czasu rzeczywistego oparta o Socket.io, HTML5 Canvas oraz opcjonalny Redis Presence Store.

## Uruchomienie

1. Skopiuj \`.env.example\` do \`.env\`.
2. Zainstaluj pakiety:
   \`\`\`bash
   npm install
   \`\`\`
3. Uruchom serwer WebSocket oraz klienta React:
   \`\`\`bash
   npm run dev:server
   npm run dev:client
   \`\`\`
4. Otwórz aplikację w dwóch kartach przeglądarki, wybierz ten sam pokój i sprawdź synchronizację rysunków, czatu oraz obecności online.`
    }
  ],

  // =========================================================================
  // PROJEKT 12: Capstone Full Stack Production App (Docker + Nginx + CI/CD)
  // =========================================================================
  'proj-12': [
    {
      path: 'package.json',
      language: 'json',
      description: 'Kompletna konfiguracja projektu Capstone: Express, Prisma, Zod, JWT, React 19 oraz testy node:test.',
      code: `{
  "name": "capstone-fullstack-production",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:server": "tsx watch server/src/index.ts",
    "dev:client": "vite",
    "test": "tsx --test server/src/**/*.test.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "build": "tsc -p tsconfig.json && vite build",
    "start": "node dist/server/src/index.js"
  },
  "dependencies": {
    "@prisma/client": "^6.2.1",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "prisma": "^6.2.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite": "^6.0.7"
  }
}`
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: 'Konfiguracja TypeScript dla monorepo Capstone (backend Express + frontend React).',
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["server/src/**/*", "client/src/**/*"]
}`
    },
    {
      path: '.env.example',
      language: 'bash',
      description: 'Zmienne środowiskowe produkcji: PostgreSQL, sekret JWT, CORS i środowisko Node.',
      code: `NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://capstone:strong_password_here@postgres:5432/capstone_db
JWT_SECRET=replace_with_at_least_32_characters_random_secret
CORS_ORIGIN=https://app.example.com`
    },
    {
      path: 'prisma/schema.prisma',
      language: 'prisma',
      description: 'Schemat Prisma: użytkownicy RBAC, zasoby robocze oraz niezmienny dziennik audytowy (AuditLog).',
      code: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
}

enum ItemStatus {
  DRAFT
  IN_PROGRESS
  DEPLOYED
}

model User {
  id           String          @id @default(uuid())
  email        String          @unique
  passwordHash String
  fullName     String
  role         UserRole        @default(USER)
  items        WorkspaceItem[]
  auditLogs    AuditLog[]
  createdAt    DateTime        @default(now())
}

model WorkspaceItem {
  id          String     @id @default(uuid())
  title       String
  summary     String
  status      ItemStatus @default(DRAFT)
  ownerId     String
  owner       User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([ownerId, status])
}

model AuditLog {
  id        String   @id @default(uuid())
  actorId   String
  actor     User     @relation(fields: [actorId], references: [id], onDelete: Cascade)
  action    String
  targetId  String?
  createdAt DateTime @default(now())

  @@index([createdAt])
}`
    },
    {
      path: 'server/src/middleware/auth.ts',
      language: 'typescript',
      description: 'Uwierzytelnianie JWT Bearer oraz kontrola ról RBAC (USER / ADMIN).',
      code: `import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('Brak bezpiecznego JWT_SECRET (min. 16 znaków).');
  }
  return secret;
}

export function verifyAccessToken(token: string): AuthUser {
  return jwt.verify(token, getJwtSecret()) as AuthUser;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Wymagany nagłówek Authorization: Bearer <token>' });
    return;
  }

  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: 'Token jest nieprawidłowy lub wygasł.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Wymagane uprawnienia administratora.' });
    return;
  }
  next();
}`
    },
    {
      path: 'server/src/routes/items.ts',
      language: 'typescript',
      description: 'Walidowane przez Zod endpointy CRUD zasobów z ochroną własności (IDOR) i logiem audytowym dla administratora.',
      code: `import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

export const createItemSchema = z.object({
  title: z.string().trim().min(3, 'Tytuł musi mieć co najmniej 3 znaki').max(120),
  summary: z.string().trim().min(5, 'Opis musi mieć co najmniej 5 znaków').max(1000),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'DEPLOYED']).default('DRAFT')
});

export function canAccessItem(user: { sub: string; role: 'USER' | 'ADMIN' }, ownerId: string): boolean {
  return user.role === 'ADMIN' || user.sub === ownerId;
}

export function createItemsRouter(prisma: PrismaClient): Router {
  const router = Router();

  router.get('/', requireAuth, async (req, res) => {
    const where = req.user!.role === 'ADMIN' ? {} : { ownerId: req.user!.sub };
    const items = await prisma.workspaceItem.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ items });
  });

  router.post('/', requireAuth, async (req, res) => {
    const parsed = createItemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Błąd walidacji danych', details: parsed.error.flatten() });
      return;
    }

    const item = await prisma.workspaceItem.create({
      data: {
        ...parsed.data,
        ownerId: req.user!.sub
      }
    });

    await prisma.auditLog.create({
      data: { actorId: req.user!.sub, action: 'ITEM_CREATED', targetId: item.id }
    });

    res.status(201).json({ item });
  });

  router.delete('/:id', requireAuth, async (req, res) => {
    const existing = await prisma.workspaceItem.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Element nie istnieje.' });
      return;
    }

    if (!canAccessItem(req.user!, existing.ownerId)) {
      res.status(403).json({ error: 'Brak uprawnień do usunięcia tego zasobu.' });
      return;
    }

    await prisma.workspaceItem.delete({ where: { id: existing.id } });
    await prisma.auditLog.create({
      data: { actorId: req.user!.sub, action: 'ITEM_DELETED', targetId: existing.id }
    });

    res.status(204).send();
  });

  router.get('/admin/audit', requireAuth, requireAdmin, async (_req, res) => {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { email: true, role: true } } }
    });
    res.json({ logs });
  });

  return router;
}`
    },
    {
      path: 'server/src/index.ts',
      language: 'typescript',
      description: 'Produkcyjny punkt wejścia Express: Helmet, CORS, /api/health ze sprawdzeniem bazy, serwowanie klienta i graceful shutdown.',
      code: `import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { createItemsRouter } from './routes/items.js';

const app = express();
const prisma = new PrismaClient();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw\`SELECT 1\`;
    res.status(200).json({
      status: 'healthy',
      database: 'up',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({ status: 'unhealthy', database: 'down' });
  }
});

app.use('/api/items', createItemsRouter(prisma));

const clientDist = path.resolve(process.cwd(), 'dist/client');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = Number(process.env.PORT || 8080);
const server = app.listen(PORT, () => {
  console.log(\`[Capstone] Serwer produkcyjny uruchomiony na porcie \${PORT}\`);
});

async function gracefulShutdown(signal: string) {
  console.log(\`[Capstone] Otrzymano sygnał \${signal}, zamykanie połączeń...\`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));`
    },
    {
      path: 'server/src/routes/items.test.ts',
      language: 'typescript',
      description: 'Testy jednostkowe node:test weryfikujące walidację Zod oraz ochronę dostępu IDOR/RBAC.',
      code: `import assert from 'node:assert/strict';
import test from 'node:test';
import { canAccessItem, createItemSchema } from './items.js';

test('createItemSchema akceptuje poprawny wpis i ustawia domyślny status DRAFT', () => {
  const result = createItemSchema.safeParse({
    title: 'Wdrożenie klastra PostgreSQL',
    summary: 'Konfiguracja kopii zapasowych oraz monitoringu healthcheck.'
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.status, 'DRAFT');
  }
});

test('createItemSchema odrzuca zbyt krótki tytuł', () => {
  const result = createItemSchema.safeParse({ title: 'AB', summary: 'Poprawny opis zadania' });
  assert.equal(result.success, false);
});

test('canAccessItem blokuje dostęp innego użytkownika (IDOR), ale przepuszcza właściciela i ADMINA', () => {
  assert.equal(canAccessItem({ sub: 'user-1', role: 'USER' }, 'user-1'), true);
  assert.equal(canAccessItem({ sub: 'user-2', role: 'USER' }, 'user-1'), false);
  assert.equal(canAccessItem({ sub: 'admin-1', role: 'ADMIN' }, 'user-1'), true);
});`
    },
    {
      path: 'client/src/App.tsx',
      language: 'tsx',
      description: 'Panel klienta React dla projektu Capstone: lista zasobów, dodawanie/usuwanie wpisów oraz podgląd dziennika audytu.',
      code: `import React, { useEffect, useState } from 'react';

interface WorkspaceItem {
  id: string;
  title: string;
  summary: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'DEPLOYED';
}

interface AuditEntry {
  id: string;
  action: string;
  targetId: string | null;
  createdAt: string;
  actor: { email: string; role: string };
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('capstone_jwt') || '');
  const [tab, setTab] = useState<'items' | 'audit'>('items');
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: \`Bearer \${token}\`
  };

  const fetchItems = async () => {
    if (!token) return;
    const res = await fetch('/api/items', { headers });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
    } else {
      setError('Błąd autoryzacji — sprawdź token JWT.');
    }
  };

  const fetchAudit = async () => {
    if (!token) return;
    const res = await fetch('/api/items/admin/audit', { headers });
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs || []);
      setError(null);
    } else {
      setError('Dziennik audytu wymaga roli ADMIN.');
    }
  };

  useEffect(() => {
    if (tab === 'items') fetchItems();
    else fetchAudit();
  }, [tab, token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/items', {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, summary, status: 'IN_PROGRESS' })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Nie udało się utworzyć wpisu');
      return;
    }
    setTitle('');
    setSummary('');
    await fetchItems();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(\`/api/items/\${id}\`, { method: 'DELETE', headers });
    if (res.ok) setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Capstone Production Dashboard</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setTab('items')}>Zasoby</button>
          <button type="button" onClick={() => setTab('audit')}>Audit Log (Admin)</button>
        </div>
      </header>

      <div style={{ marginBottom: 16 }}>
        <input
          type="password"
          placeholder="Wklej token JWT Bearer"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            localStorage.setItem('capstone_jwt', e.target.value);
          }}
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      {error && <p role="alert">{error}</p>}

      {tab === 'items' ? (
        <>
          <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
            <input required minLength={3} placeholder="Tytuł wdrożenia" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea required minLength={5} placeholder="Krótki opis techniczny" value={summary} onChange={(e) => setSummary(e.target.value)} />
            <button type="submit">Dodaj zasób</button>
          </form>

          <ul style={{ display: 'grid', gap: 10, listStyle: 'none', padding: 0 }}>
            {items.map((item) => (
              <li key={item.id} style={{ border: '1px solid #334155', borderRadius: 10, padding: 14, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{item.title}</strong> <small>[{item.status}]</small>
                  <p>{item.summary}</p>
                </div>
                <button type="button" onClick={() => handleDelete(item.id)}>Usuń</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              [{new Date(log.createdAt).toLocaleString('pl-PL')}] <strong>{log.action}</strong> — {log.actor.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`
    },
    {
      path: 'Dockerfile',
      language: 'docker',
      description: 'Wielostopniowy obraz produkcyjny Node 22 Alpine z użytkownikiem bez uprawnień root i HEALTHCHECK.',
      code: `# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

USER appuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD wget -qO- http://127.0.0.1:8080/api/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server/src/index.js"]`
    },
    {
      path: 'docker-compose.yml',
      language: 'yaml',
      description: 'Orkiestracja produkcyjna: PostgreSQL 16 (z healthcheckiem), aplikacja Node.js oraz Reverse Proxy Nginx.',
      code: `services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: capstone
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-strong_password_here}
      POSTGRES_DB: capstone_db
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U capstone -d capstone_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 8080
      DATABASE_URL: postgresql://capstone:\${POSTGRES_PASSWORD:-strong_password_here}@postgres:5432/capstone_db
      JWT_SECRET: \${JWT_SECRET:-replace_with_32_char_production_secret}
    expose:
      - "8080"

  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    depends_on:
      - app
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro

volumes:
  pg_data:`
    },
    {
      path: 'nginx/default.conf',
      language: 'bash',
      description: 'Konfiguracja Reverse Proxy Nginx z kompresją gzip, nagłówkami bezpieczeństwa oraz obsługą WebSocket.',
      code: `server {
  listen 80;
  server_name _;

  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
  gzip_min_length 1024;

  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  location / {
    proxy_pass http://app:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}`
    },
    {
      path: '.github/workflows/ci-cd.yml',
      language: 'yaml',
      description: 'Pipeline GitHub Actions uruchamiający testy jednostkowe, kompilację TypeScript oraz weryfikację obrazu Docker.',
      code: `name: Capstone CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalacja zależności
        run: npm ci

      - name: Generowanie klienta Prisma
        run: npx prisma generate

      - name: Testy jednostkowe
        run: npm test

      - name: Budowanie aplikacji
        run: npm run build

      - name: Weryfikacja obrazu Docker
        run: docker build --target runner -t capstone-app:ci .`
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: 'Kompletna dokumentacja wdrożeniowa projektu dyplomowego Capstone (Docker, testy, migracje Prisma).',
      code: `# Capstone Full Stack Production App

Produkcyjna aplikacja Full-Stack przygotowana do wdrożenia kontenerowego: Express + TypeScript + Prisma + PostgreSQL 16 + React 19 + Nginx Reverse Proxy + GitHub Actions CI/CD.

## Uruchomienie lokalne z Docker Compose

\`\`\`bash
cp .env.example .env
docker compose up --build -d
\`\`\`

Po uruchomieniu aplikacja dostępna jest pod adresem \`http://localhost\`, a healthcheck pod \`http://localhost/api/health\`.

## Testy i development

\`\`\`bash
npm install
npx prisma generate
npm test
npm run dev:server
\`\`\`

## Lista kontrolna produkcji
- Wielostopniowy Dockerfile uruchamiany jako użytkownik bez uprawnień root (\`appuser\`).
- Automatyczne migracje Prisma przy starcie kontenera i graceful shutdown na \`SIGTERM\`.
- Ochrona przed IDOR i weryfikacja RBAC przetestowana w \`server/src/routes/items.test.ts\`.`
    }
  ]
};
