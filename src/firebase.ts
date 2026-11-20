import { initializeApp } from 'firebase/app';
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  logEvent as firebaseLogEvent,
  Analytics,
} from 'firebase/analytics';
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  initializeFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  getDocFromServer,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  User,
  Announcement,
  VisitorEventRecord,
  VisitorPresenceRecord,
} from './types';
import {
  VisitorEventWritePayload,
  VisitorPresenceWritePayload,
} from './utils/visitorAnalytics';
import {
  CloudCallableResult,
  buildAdminProUpdatePayload,
  buildAdminRefillLivesPayload,
  buildAdminStatusUpdatePayload,
  classifyCloudCallableError,
  serializeUserProfileFields,
  serializeUserProgressForFirestore,
} from './utils/cloudSync';

import {
  resolveFirebaseAuthDomain,
  shouldFallbackPopupErrorToRedirect,
  shouldPreferGoogleRedirectAuth,
} from './utils/authValidation';
import { detectInstalledMobileAppRuntime } from './utils/publicRoutes';

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

const USER_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD6JohhtsGb8cVkanoIDcfmcRUiyjq7wyA',
  authDomain: 'fsda-1d673.firebaseapp.com',
  projectId: 'fsda-1d673',
  storageBucket: 'fsda-1d673.firebasestorage.app',
  messagingSenderId: '971033891347',
  appId: '1:971033891347:web:520dcba532dff9818565e6',
  measurementId: 'G-MNX8T1X154',
};

const resolvedAuthDomain = resolveFirebaseAuthDomain({
  envAuthDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  defaultAuthDomain: USER_FIREBASE_CONFIG.authDomain,
  hostname: typeof window !== 'undefined' ? window.location.hostname : undefined,
  protocol: typeof window !== 'undefined' ? window.location.protocol : undefined,
});

export const activeFirebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || USER_FIREBASE_CONFIG.apiKey,
  authDomain: resolvedAuthDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || USER_FIREBASE_CONFIG.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || USER_FIREBASE_CONFIG.storageBucket,
  messagingSenderId:
    env.VITE_FIREBASE_MESSAGING_SENDER_ID || USER_FIREBASE_CONFIG.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || USER_FIREBASE_CONFIG.appId,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || USER_FIREBASE_CONFIG.measurementId,
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || '',
};

// Initialize Firebase SDK with forced long-polling to prevent WebChannel RPC 'Listen' stream transport errors in iframes/proxies
export const app = initializeApp(activeFirebaseConfig);
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && activeFirebaseConfig.measurementId) {
  void isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore Analytics initialization errors when cookies/storage are blocked
    });
}

export function trackFirebaseEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!analytics) return;
  try {
    firebaseLogEvent(analytics, eventName, params);
  } catch {
    // Ignore non-fatal analytics dispatch errors
  }
}

export const db = activeFirebaseConfig.firestoreDatabaseId
  ? initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
        ignoreUndefinedProperties: true,
      },
      activeFirebaseConfig.firestoreDatabaseId
    )
  : initializeFirestore(app, {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,
    });
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
const cloudFunctions = getFunctions(app, 'us-central1');

type CodeBundle = { html: string; css: string; js: string };

let cloudFunctionsUnavailable = false;

async function invokeCloudCallable<TReq, TRes = unknown>(
  name: string,
  payload: TReq
): Promise<CloudCallableResult<TRes>> {
  if (cloudFunctionsUnavailable) {
    return { status: 'unavailable' };
  }
  try {
    const result = await httpsCallable<TReq, TRes>(cloudFunctions, name)(payload);
    return { status: 'ok', data: result.data };
  } catch (error) {
    const kind = classifyCloudCallableError(error);
    if (kind === 'unavailable') {
      cloudFunctionsUnavailable = true;
      return { status: 'unavailable', error };
    }
    return { status: 'rejected', error };
  }
}

export async function verifyLessonExerciseInCloud(
  exerciseId: string,
  code: CodeBundle
): Promise<CloudCallableResult<void>> {
  return invokeCloudCallable('verifyLessonExercise', { exerciseId, code });
}

export async function submitQuizAnswersToCloud(
  lessonId: string,
  answers: Record<string, number>
): Promise<CloudCallableResult<number>> {
  const res = await invokeCloudCallable<
    { lessonId: string; answers: Record<string, number> },
    { scorePercent: number }
  >('submitQuizAnswers', { lessonId, answers });
  return {
    status: res.status,
    data: res.data?.scorePercent,
    error: res.error,
  };
}

export async function completeLessonInCloud(
  lessonId: string,
  answers?: Record<string, number>
): Promise<CloudCallableResult<void>> {
  return invokeCloudCallable('completeLesson', { lessonId, answers });
}

export async function completeProjectInCloud(
  projectId: string,
  code: CodeBundle
): Promise<CloudCallableResult<void>> {
  return invokeCloudCallable('completeProject', { projectId, code });
}

export async function claimActivityRewardInCloud(
  rewardId?: string,
  proof?: Record<string, unknown>
): Promise<CloudCallableResult<void>> {
  return invokeCloudCallable('claimActivityReward', { rewardId, proof });
}

export type CloudLifeAction =
  | 'lose'
  | 'practice'
  | 'ad-reward'
  | 'buy-heart'
  | 'buy-refill'
  | 'buy-freeze'
  | 'regenerate'
  | 'admin-refill';

export async function updateLivesInCloud(
  action: CloudLifeAction,
  targetUid?: string,
  proof?: Record<string, unknown>
): Promise<CloudCallableResult<void>> {
  const callableRes = await invokeCloudCallable<
    { action: CloudLifeAction; targetUid?: string; proof?: Record<string, unknown> },
    void
  >('updateLives', { action, targetUid, proof });
  if (callableRes.status === 'ok' || callableRes.status === 'rejected') {
    return callableRes;
  }

  if (action === 'admin-refill' && targetUid) {
    const path = `users/${targetUid}`;
    try {
      await updateDoc(doc(db, 'users', targetUid), buildAdminRefillLivesPayload());
      return { status: 'ok' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return { status: 'rejected', error };
    }
  }

  return callableRes;
}

export async function setUserStatusInCloud(
  targetUid: string,
  status: string,
  banReason?: string
): Promise<CloudCallableResult<void>> {
  const callableRes = await invokeCloudCallable<{ targetUid: string; status: string }, void>(
    'setUserStatus',
    { targetUid, status }
  );
  if (callableRes.status === 'ok' || callableRes.status === 'rejected') {
    return callableRes;
  }

  const path = `users/${targetUid}`;
  try {
    await updateDoc(doc(db, 'users', targetUid), buildAdminStatusUpdatePayload(status, banReason));
    return { status: 'ok' };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { status: 'rejected', error };
  }
}

export async function setUserProStatusInCloud(
  targetUid: string,
  enabled: boolean,
  plan: 'monthly' | 'yearly' = 'yearly'
): Promise<CloudCallableResult<void>> {
  const callableRes = await invokeCloudCallable<
    { targetUid: string; enabled: boolean; plan: 'monthly' | 'yearly' },
    void
  >('setUserProStatus', { targetUid, enabled, plan });
  if (callableRes.status === 'ok' || callableRes.status === 'rejected') {
    return callableRes;
  }

  const path = `users/${targetUid}`;
  try {
    await updateDoc(doc(db, 'users', targetUid), buildAdminProUpdatePayload(enabled, plan));
    return { status: 'ok' };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return { status: 'rejected', error };
  }
}

export async function deleteUserProfileFromCloud(
  targetUid: string
): Promise<CloudCallableResult<void>> {
  const path = `users/${targetUid}`;
  try {
    await deleteDoc(doc(db, 'users', targetUid));
    return { status: 'ok' };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return { status: 'rejected', error };
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

function isTransientOfflineError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  const code = (error as { code?: string })?.code || '';
  return (
    code === 'unavailable' ||
    msg.includes('unavailable') ||
    msg.includes('client is offline') ||
    msg.includes('could not reach cloud firestore backend')
  );
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName || '',
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  if (isTransientOfflineError(error)) {
    console.warn('Firestore działa tymczasowo w trybie offline (dane zostaną zsynchronizowane automatycznie po przywróceniu połączenia):', errInfo.path);
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  }
  return errInfo;
}

// Validate connection to Firestore when authenticated
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (isTransientOfflineError(error)) {
      return false;
    }
    // Missing permissions on /test/connection means Firestore server is reachable and responding
    return true;
  }
}

/**
 * Sanitizes a User object before writing to Firestore (removes undefined fields and passwords)
 */
export function serializeUserForFirestore(uid: string, user: User): Record<string, unknown> {
  return serializeUserProfileFields(uid, user);
}

export async function saveUserProfileToCloud(uid: string, user: User): Promise<boolean> {
  const path = `users/${uid}`;
  try {
    const profileRef = doc(db, 'users', uid);
    const progressPayload = serializeUserProgressForFirestore(uid, user);
    const profileOnlyPayload = serializeUserProfileFields(uid, user);
    const existing = await getDoc(profileRef);
    if (existing.exists()) {
      try {
        await setDoc(profileRef, progressPayload, { merge: true });
      } catch (writeErr) {
        const errCode = (writeErr as { code?: string })?.code || '';
        if (errCode === 'permission-denied') {
          await setDoc(profileRef, profileOnlyPayload, { merge: true });
        } else {
          throw writeErr;
        }
      }
    } else {
      const email = (user.email || 'kursant@akademia.pl').slice(0, 254);
      const isAdminEmail = email.trim().toLowerCase() === 'zordonzordon1@gmail.com';
      await setDoc(profileRef, {
        uid,
        id: uid,
        name: (user.name || 'Kursant Akademii').slice(0, 120),
        email,
        role: isAdminEmail ? 'admin' : 'student',
        status: 'active',
        xp: 0,
        level: 1,
        streakDays: 0,
        completedLessons: [],
        completedProjects: [],
        unlockedBadges: [],
        claimedRewards: [],
        quizScores: {},
        lives: 5,
        maxLives: 5,
        isPro: false,
        streakFreezes: 0,
        weeklySpentMinutes: 0,
        createdAt: new Date().toISOString().split('T')[0],
        ...profileOnlyPayload,
      });
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function fetchOrCreateCloudUserProfile(
  fbUser: FirebaseUser,
  fallbackLocalUser?: User,
  profileOverrides?: { name?: string; bio?: string }
): Promise<User> {
  const uid = fbUser.uid;
  const path = `users/${uid}`;
  const isAdminEmail =
    Boolean(fbUser.emailVerified) &&
    (fbUser.email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com';

  const isGuestFallback = !fallbackLocalUser || fallbackLocalUser.id === 'user-guest';
  const overrideName = profileOverrides?.name?.trim();
  const overrideBio = profileOverrides?.bio?.trim();

  const initialUser: User = {
    id: uid,
    name:
      overrideName ||
      fbUser.displayName ||
      (!isGuestFallback ? fallbackLocalUser?.name : undefined) ||
      'Kursant Akademii',
    email: fbUser.email || 'kursant@gmail.com',
    role: isAdminEmail ? 'admin' : 'student',
    status: 'active',
    antiBotVerified: true,
    antiBotScore: 100,
    avatar:
      fbUser.photoURL ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(overrideName || uid)}`,
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    weeklyGoalMinutes: fallbackLocalUser?.weeklyGoalMinutes || 180,
    weeklySpentMinutes: 0,
    completedLessons: [],
    completedProjects: [],
    unlockedBadges: [],
    claimedRewards: [],
    quizScores: {},
    savedCode: fallbackLocalUser?.savedCode || {},
    githubIntegration: fallbackLocalUser?.githubIntegration,
    lives: 5,
    maxLives: 5,
    isPro: false,
    proPlan: null,
    streakFreezes: 0,
    bio: isAdminEmail
      ? 'Główny Administrator i Architekt Akademii Full Stack Developer (Chmura Firebase).'
      : overrideBio ||
        'Kursant Full Stack Developer Academy (Synchronizacja z chmurą Firestore).',
    createdAt: new Date().toISOString().split('T')[0],
  };

  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data() as Partial<User>;
      const resolvedName =
        overrideName && (!data.name || data.name === 'Kursant Akademii')
          ? overrideName
          : data.name || fbUser.displayName || overrideName || 'Kursant Google';
      const resolvedBio =
        overrideBio &&
        (!data.bio || data.bio.startsWith('Kursant Full Stack Developer Academy'))
          ? overrideBio
          : data.bio || 'Zalogowano przez Firebase Auth (Chmura Firestore).';

      const hydratedUser: User = {
        id: data.id || uid,
        name: resolvedName,
        email: data.email || fbUser.email || 'user@gmail.com',
        role: isAdminEmail ? 'admin' : 'student',
        status: data.status || 'active',
        antiBotVerified: true,
        antiBotScore: 100,
        avatar:
          data.avatar ||
          fbUser.photoURL ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(resolvedName || uid)}`,
        xp: typeof data.xp === 'number' ? data.xp : 0,
        level: typeof data.level === 'number' ? data.level : 1,
        streakDays: typeof data.streakDays === 'number' ? data.streakDays : 1,
        lastActiveDate: data.lastActiveDate || new Date().toISOString().split('T')[0],
        weeklyGoalMinutes: data.weeklyGoalMinutes || 180,
        weeklySpentMinutes: data.weeklySpentMinutes || 0,
        completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
        completedProjects: Array.isArray(data.completedProjects) ? data.completedProjects : [],
        unlockedBadges: Array.isArray(data.unlockedBadges) ? data.unlockedBadges : [],
        claimedRewards: Array.isArray(data.claimedRewards) ? data.claimedRewards : [],
        quizScores: data.quizScores || {},
        savedCode: data.savedCode || {},
        githubIntegration: data.githubIntegration || fallbackLocalUser?.githubIntegration,
        lives: typeof data.lives === 'number' ? data.lives : 5,
        maxLives: typeof data.maxLives === 'number' ? data.maxLives : 5,
        lastPracticeRewardDate: data.lastPracticeRewardDate,
        lastFlashcardRewardDate: data.lastFlashcardRewardDate,
        isPro: isAdminEmail ? true : Boolean(data.isPro),
        proPlan: isAdminEmail ? 'lifetime' : data.proPlan,
        streakFreezes: typeof data.streakFreezes === 'number' ? data.streakFreezes : 1,
        bio: resolvedBio,
        createdAt: data.createdAt || new Date().toISOString().split('T')[0],
      };

      if (resolvedName !== data.name || resolvedBio !== data.bio) {
        void saveUserProfileToCloud(uid, hydratedUser);
      }

      return hydratedUser;
    }

    await saveUserProfileToCloud(uid, initialUser);
    return initialUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    // Do not block login if Firestore is temporarily in offline mode — return the authenticated user and sync in background
    void saveUserProfileToCloud(uid, initialUser);
    return initialUser;
  }
}

export function subscribeToUserProfile(
  uid: string,
  onUpdate: (user: User) => void
): Unsubscribe {
  const path = `users/${uid}`;
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<User>;
        onUpdate({
          ...data,
          id: uid,
          name: typeof data.name === 'string' && data.name.trim() ? data.name : auth.currentUser?.displayName || 'Kursant',
          email: typeof data.email === 'string' && data.email.trim() ? data.email : auth.currentUser?.email || 'user@gmail.com',
          role: data.role === 'admin' ? 'admin' : 'student',
          status: data.status || 'active',
          antiBotVerified: data.antiBotVerified ?? true,
          xp: typeof data.xp === 'number' ? data.xp : 0,
          level: typeof data.level === 'number' ? data.level : 1,
          streakDays: typeof data.streakDays === 'number' ? data.streakDays : 0,
          streakFreezes: typeof data.streakFreezes === 'number' ? data.streakFreezes : 0,
          weeklyGoalMinutes: typeof data.weeklyGoalMinutes === 'number' ? data.weeklyGoalMinutes : 180,
          weeklySpentMinutes: typeof data.weeklySpentMinutes === 'number' ? data.weeklySpentMinutes : 0,
          lastActiveDate: data.lastActiveDate || new Date().toISOString().split('T')[0],
          createdAt: data.createdAt || new Date().toISOString().split('T')[0],
          bio: typeof data.bio === 'string' ? data.bio : '',
          isPro: Boolean(data.isPro),
          proPlan: data.proPlan ?? null,
          lives: typeof data.lives === 'number' ? data.lives : 5,
          maxLives: typeof data.maxLives === 'number' ? data.maxLives : 5,
          completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
          completedProjects: Array.isArray(data.completedProjects) ? data.completedProjects : [],
          unlockedBadges: Array.isArray(data.unlockedBadges) ? data.unlockedBadges : [],
          claimedRewards: Array.isArray(data.claimedRewards) ? data.claimedRewards : [],
          quizScores: data.quizScores || {},
          savedCode: data.savedCode || {},
          githubIntegration: data.githubIntegration,
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeToCloudAnnouncements(
  onUpdate: (announcements: Announcement[]) => void
): Unsubscribe {
  const path = 'announcements';
  return onSnapshot(
    collection(db, 'announcements'),
    (snap) => {
      if (!snap.empty) {
        const list: Announcement[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as Announcement);
        });
        list.sort((a, b) => b.date.localeCompare(a.date));
        onUpdate(list);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveAnnouncementToCloud(announcement: Announcement): Promise<boolean> {
  const path = `announcements/${announcement.id}`;
  try {
    await setDoc(doc(db, 'announcements', announcement.id), {
      id: announcement.id,
      title: announcement.title.slice(0, 200),
      content: announcement.content.slice(0, 4000),
      date: announcement.date.slice(0, 40),
      category: announcement.category,
      author: announcement.author.slice(0, 120),
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteAnnouncementFromCloud(id: string): Promise<boolean> {
  const path = `announcements/${id}`;
  try {
    await deleteDoc(doc(db, 'announcements', id));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

function toEpochMs(value: unknown, fallbackMs: number = Date.now()): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === 'object' && value !== null && 'toMillis' in value && typeof (value as { toMillis: unknown }).toMillis === 'function') {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallbackMs;
}

function parseVisitorEventSnapshot(data: Record<string, unknown>, docId: string): VisitorEventRecord {
  const device = data.deviceType === 'mobile' || data.deviceType === 'tablet' ? data.deviceType : 'desktop';
  return {
    id: typeof data.id === 'string' ? data.id : docId,
    visitorId: typeof data.visitorId === 'string' ? data.visitorId : 'anonymous',
    sessionId: typeof data.sessionId === 'string' ? data.sessionId : 'session',
    dateKey: typeof data.dateKey === 'string' ? data.dateKey : new Date().toISOString().split('T')[0],
    path: typeof data.path === 'string' ? data.path : '/',
    tab: typeof data.tab === 'string' ? data.tab : 'landing',
    referrerHost: typeof data.referrerHost === 'string' ? data.referrerHost : 'direct',
    utmSource: typeof data.utmSource === 'string' ? data.utmSource : 'none',
    deviceType: device,
    language: data.language === 'en' ? 'en' : 'pl',
    isAuthenticated: Boolean(data.isAuthenticated),
    createdAtMs: toEpochMs(data.createdAt),
  };
}

function parseVisitorPresenceSnapshot(data: Record<string, unknown>, docId: string): VisitorPresenceRecord {
  const device = data.deviceType === 'mobile' || data.deviceType === 'tablet' ? data.deviceType : 'desktop';
  return {
    sessionId: typeof data.sessionId === 'string' ? data.sessionId : docId,
    visitorId: typeof data.visitorId === 'string' ? data.visitorId : 'anonymous',
    path: typeof data.path === 'string' ? data.path : '/',
    tab: typeof data.tab === 'string' ? data.tab : 'landing',
    referrerHost: typeof data.referrerHost === 'string' ? data.referrerHost : 'direct',
    deviceType: device,
    language: data.language === 'en' ? 'en' : 'pl',
    isAuthenticated: Boolean(data.isAuthenticated),
    lastSeenMs: toEpochMs(data.lastSeen),
  };
}

export async function recordVisitorEventToCloud(payload: VisitorEventWritePayload): Promise<boolean> {
  const path = `visitor_events/${payload.id}`;
  try {
    await setDoc(doc(db, 'visitor_events', payload.id), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function upsertVisitorPresenceToCloud(payload: VisitorPresenceWritePayload): Promise<boolean> {
  const path = `visitor_presence/${payload.sessionId}`;
  try {
    await setDoc(doc(db, 'visitor_presence', payload.sessionId), {
      ...payload,
      lastSeen: serverTimestamp(),
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function fetchVisitorAnalyticsFromCloud(
  maxEvents = 1500
): Promise<{ events: VisitorEventRecord[]; presences: VisitorPresenceRecord[] }> {
  try {
    const [eventsSnap, presenceSnap] = await Promise.all([
      getDocs(query(collection(db, 'visitor_events'), orderBy('createdAt', 'desc'), limit(maxEvents))),
      getDocs(query(collection(db, 'visitor_presence'), orderBy('lastSeen', 'desc'), limit(250))),
    ]);

    const events: VisitorEventRecord[] = [];
    eventsSnap.forEach((docSnap) => {
      events.push(parseVisitorEventSnapshot(docSnap.data() as Record<string, unknown>, docSnap.id));
    });

    const presences: VisitorPresenceRecord[] = [];
    presenceSnap.forEach((docSnap) => {
      presences.push(parseVisitorPresenceSnapshot(docSnap.data() as Record<string, unknown>, docSnap.id));
    });

    return { events, presences };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'visitor_events');
    throw error;
  }
}

export function subscribeVisitorAnalyticsForAdmin(
  onEvents: (events: VisitorEventRecord[]) => void,
  onPresence: (presences: VisitorPresenceRecord[]) => void,
  onError?: (err: unknown) => void,
  maxEvents = 1500
): Unsubscribe {
  const eventsQuery = query(
    collection(db, 'visitor_events'),
    orderBy('createdAt', 'desc'),
    limit(maxEvents)
  );
  const presenceQuery = query(
    collection(db, 'visitor_presence'),
    orderBy('lastSeen', 'desc'),
    limit(250)
  );

  const unsubEvents = onSnapshot(
    eventsQuery,
    (snap) => {
      const list: VisitorEventRecord[] = [];
      snap.forEach((docSnap) => {
        list.push(parseVisitorEventSnapshot(docSnap.data() as Record<string, unknown>, docSnap.id));
      });
      onEvents(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'visitor_events');
      onError?.(error);
    }
  );

  const unsubPresence = onSnapshot(
    presenceQuery,
    (snap) => {
      const list: VisitorPresenceRecord[] = [];
      snap.forEach((docSnap) => {
        list.push(parseVisitorPresenceSnapshot(docSnap.data() as Record<string, unknown>, docSnap.id));
      });
      onPresence(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'visitor_presence');
      onError?.(error);
    }
  );

  return () => {
    unsubEvents();
    unsubPresence();
  };
}

export async function clearVisitorTelemetryByAdmin(
  eventIds: string[],
  presenceIds: string[]
): Promise<number> {
  const targets: { col: 'visitor_events' | 'visitor_presence'; id: string }[] = [
    ...eventIds.map((id) => ({ col: 'visitor_events' as const, id })),
    ...presenceIds.map((id) => ({ col: 'visitor_presence' as const, id })),
  ];

  let deleted = 0;
  try {
    for (let i = 0; i < targets.length; i += 400) {
      const chunk = targets.slice(i, i + 400);
      const batch = writeBatch(db);
      for (const item of chunk) {
        batch.delete(doc(db, item.col, item.id));
      }
      await batch.commit();
      deleted += chunk.length;
    }
    return deleted;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'visitor_events');
    throw error;
  }
}

export function subscribeAllUsersForAdmin(
  onUpdate: (users: User[]) => void
): Unsubscribe {
  const path = 'users';
  return onSnapshot(
    query(collection(db, 'users'), limit(500)),
    (snap) => {
      const usersList: User[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as Partial<User>;
        usersList.push({
          id: docSnap.id,
          name: data.name || 'Kursant Google',
          email: data.email || 'user@gmail.com',
          role: data.role === 'admin' ? 'admin' : 'student',
          status: data.status || 'active',
          antiBotVerified: true,
          antiBotScore: 100,
          avatar: data.avatar,
          xp: typeof data.xp === 'number' ? data.xp : 0,
          level: typeof data.level === 'number' ? data.level : 1,
          streakDays: typeof data.streakDays === 'number' ? data.streakDays : 0,
          lastActiveDate: data.lastActiveDate || new Date().toISOString().split('T')[0],
          weeklyGoalMinutes: typeof data.weeklyGoalMinutes === 'number' ? data.weeklyGoalMinutes : 180,
          weeklySpentMinutes: typeof data.weeklySpentMinutes === 'number' ? data.weeklySpentMinutes : 0,
          completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
          completedProjects: Array.isArray(data.completedProjects) ? data.completedProjects : [],
          unlockedBadges: Array.isArray(data.unlockedBadges) ? data.unlockedBadges : [],
          claimedRewards: Array.isArray(data.claimedRewards) ? data.claimedRewards : [],
          quizScores: data.quizScores || {},
          savedCode: data.savedCode || {},
          githubIntegration: data.githubIntegration,
          lives: typeof data.lives === 'number' ? data.lives : 5,
          maxLives: typeof data.maxLives === 'number' ? data.maxLives : 5,
          isPro: Boolean(data.isPro),
          proPlan: data.proPlan ?? null,
          streakFreezes: typeof data.streakFreezes === 'number' ? data.streakFreezes : 0,
          bio: data.bio || '',
          createdAt: data.createdAt || new Date().toISOString().split('T')[0],
        });
      });
      onUpdate(usersList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export type GoogleSignInResult =
  | { status: 'signed-in'; user: FirebaseUser }
  | { status: 'redirecting' };

const GOOGLE_REDIRECT_PENDING_KEY = 'fsda_google_redirect_pending_ts_v1';
const GOOGLE_REDIRECT_PENDING_TTL_MS = 3 * 60 * 1000;

export function markGoogleRedirectPending(): void {
  if (typeof window === 'undefined') return;
  const now = String(Date.now());
  try {
    window.sessionStorage.setItem(GOOGLE_REDIRECT_PENDING_KEY, now);
  } catch {
    // ignore storage quota/privacy errors
  }
  try {
    window.localStorage.setItem(GOOGLE_REDIRECT_PENDING_KEY, now);
  } catch {
    // ignore storage quota/privacy errors
  }
}

export function isGoogleRedirectPending(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw =
      window.sessionStorage.getItem(GOOGLE_REDIRECT_PENDING_KEY) ||
      window.localStorage.getItem(GOOGLE_REDIRECT_PENDING_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts >= 0 && Date.now() - ts <= GOOGLE_REDIRECT_PENDING_TTL_MS;
  } catch {
    return false;
  }
}

export function clearGoogleRedirectPending(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
  } catch {
    // ignore
  }
  try {
    window.localStorage.removeItem(GOOGLE_REDIRECT_PENDING_KEY);
  } catch {
    // ignore
  }
}

export function buildVerifiedFallbackUser(fbUser: FirebaseUser): User {
  const email = (fbUser.email || '').trim().toLowerCase();
  const isAdminEmail = email === 'zordonzordon1@gmail.com';
  const displayName = fbUser.displayName || (email ? email.split('@')[0] : 'Kursant');
  const today = new Date().toISOString().split('T')[0];
  return {
    id: fbUser.uid,
    name: displayName,
    email: fbUser.email || 'user@gmail.com',
    role: isAdminEmail ? 'admin' : 'student',
    status: 'active',
    antiBotVerified: true,
    antiBotScore: 100,
    avatar:
      fbUser.photoURL ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName || fbUser.uid)}`,
    xp: 0,
    level: 1,
    streakDays: 1,
    lastActiveDate: today,
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 0,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    claimedRewards: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: isAdminEmail,
    proPlan: isAdminEmail ? 'lifetime' : undefined,
    streakFreezes: 1,
    bio: 'Zalogowano przez Google Firebase Auth.',
    createdAt: today,
  };
}

export async function signInWithGoogleFirebase(): Promise<GoogleSignInResult> {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    // Non-fatal: continue with default persistence when browser blocks local persistence API
  }

  const win = typeof window !== 'undefined'
    ? (window as unknown as { ReactNativeWebView?: unknown; __FSDA_MOBILE_APP__?: boolean })
    : undefined;
  const hasReactNativeWebView = Boolean(
    win && (typeof win.ReactNativeWebView !== 'undefined' || win.__FSDA_MOBILE_APP__ === true)
  );

  const preferRedirect = shouldPreferGoogleRedirectAuth({
    isInstalledMobileApp: detectInstalledMobileAppRuntime(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    hasReactNativeWebView,
  });

  if (preferRedirect) {
    markGoogleRedirectPending();
    await signInWithRedirect(auth, googleProvider);
    return { status: 'redirecting' };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    clearGoogleRedirectPending();
    return { status: 'signed-in', user: result.user };
  } catch (err) {
    if (shouldFallbackPopupErrorToRedirect(err)) {
      markGoogleRedirectPending();
      await signInWithRedirect(auth, googleProvider);
      return { status: 'redirecting' };
    }
    throw err;
  }
}

export async function resolveGoogleRedirectSignIn(): Promise<FirebaseUser | null> {
  try {
    const result = await getRedirectResult(auth);
    clearGoogleRedirectPending();
    return result?.user ?? null;
  } catch (err) {
    clearGoogleRedirectPending();
    throw err;
  }
}

export async function signUpWithEmailFirebase(
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && displayName.trim()) {
    try {
      await updateProfile(result.user, { displayName: displayName.trim() });
    } catch {
      // ignore non-fatal displayName update error; Firestore keeps authoritative profile name
    }
  }
  return result.user;
}

export async function signInWithEmailFirebase(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function sendPasswordResetFirebase(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function updateFirebaseUserProfile(updates: {
  displayName?: string;
  newPassword?: string;
}): Promise<void> {
  const current = auth.currentUser;
  if (!current) return;
  if (updates.displayName && updates.displayName.trim() && updates.displayName.trim() !== current.displayName) {
    await updateProfile(current, { displayName: updates.displayName.trim() });
  }
  if (updates.newPassword && updates.newPassword.trim().length >= 6) {
    await updatePassword(current, updates.newPassword.trim());
  }
}

export async function signOutFromFirebase(): Promise<void> {
  if (auth.currentUser) {
    await firebaseSignOut(auth);
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };
