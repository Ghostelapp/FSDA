import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  initializeFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  deleteDoc,
  collection,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import firebaseAppletConfig from '../firebase-applet-config.json';
import { User, Announcement } from './types';

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

export const activeFirebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId:
    env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
  firestoreDatabaseId:
    env.VITE_FIREBASE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId,
};

// Initialize Firebase SDK with forced long-polling to prevent WebChannel RPC 'Listen' stream transport errors in iframes/proxies
export const app = initializeApp(activeFirebaseConfig);
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true,
  },
  activeFirebaseConfig.firestoreDatabaseId
);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const cloudFunctions = getFunctions(app, 'us-central1');

type CodeBundle = { html: string; css: string; js: string };

export async function verifyLessonExerciseInCloud(exerciseId: string, code: CodeBundle): Promise<void> {
  await httpsCallable(cloudFunctions, 'verifyLessonExercise')({ exerciseId, code });
}

export async function submitQuizAnswersToCloud(
  lessonId: string,
  answers: Record<string, number>
): Promise<number> {
  const result = await httpsCallable<
    { lessonId: string; answers: Record<string, number> },
    { scorePercent: number }
  >(cloudFunctions, 'submitQuizAnswers')({ lessonId, answers });
  return result.data.scorePercent;
}

export async function completeLessonInCloud(
  lessonId: string,
  answers?: Record<string, number>
): Promise<void> {
  await httpsCallable(cloudFunctions, 'completeLesson')({ lessonId, answers });
}

export async function completeProjectInCloud(projectId: string, code: CodeBundle): Promise<void> {
  await httpsCallable(cloudFunctions, 'completeProject')({ projectId, code });
}

export async function claimActivityRewardInCloud(
  rewardId?: string,
  proof?: Record<string, unknown>
): Promise<void> {
  await httpsCallable(cloudFunctions, 'claimActivityReward')({ rewardId, proof });
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
): Promise<void> {
  await httpsCallable(cloudFunctions, 'updateLives')({ action, targetUid, proof });
}

export async function setUserStatusInCloud(targetUid: string, status: string): Promise<void> {
  await httpsCallable(cloudFunctions, 'setUserStatus')({ targetUid, status });
}

export async function setUserProStatusInCloud(
  targetUid: string,
  enabled: boolean,
  plan: 'monthly' | 'yearly'
): Promise<void> {
  await httpsCallable(cloudFunctions, 'setUserProStatus')({ targetUid, enabled, plan });
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
  return {
    name: (user.name || 'Kursant Akademii').slice(0, 120),
    bio: (user.bio || 'Kursant Full Stack Developer Academy').slice(0, 600),
    avatar:
      user.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || uid)}`,
    weeklyGoalMinutes: Math.max(30, Math.min(1440, Number(user.weeklyGoalMinutes) || 180)),
    savedCode: user.savedCode && typeof user.savedCode === 'object' ? user.savedCode : {},
    updatedAt: new Date().toISOString(),
  };
}

export async function saveUserProfileToCloud(uid: string, user: User): Promise<boolean> {
  const path = `users/${uid}`;
  try {
    const profileRef = doc(db, 'users', uid);
    const payload = serializeUserForFirestore(uid, user);
    const existing = await getDoc(profileRef);
    if (existing.exists()) {
      await setDoc(profileRef, payload, { merge: true });
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
        ...payload,
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
  fallbackLocalUser?: User
): Promise<User> {
  const uid = fbUser.uid;
  const path = `users/${uid}`;
  const isAdminEmail =
    Boolean(fbUser.emailVerified) &&
    (fbUser.email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com';

  const isGuestFallback = !fallbackLocalUser || fallbackLocalUser.id === 'user-guest';

  const initialUser: User = {
    id: uid,
    name:
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
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(uid)}`,
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
    lives: 5,
    maxLives: 5,
    isPro: false,
    proPlan: null,
    streakFreezes: 0,
    bio: isAdminEmail
      ? 'Główny Administrator i Architekt Akademii Full Stack Developer (Chmura Firebase).'
      : 'Kursant Full Stack Developer Academy (Synchronizacja z chmurą Firestore).',
    createdAt: new Date().toISOString().split('T')[0],
  };

  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data() as Partial<User>;
      return {
        id: data.id || uid,
        name: data.name || fbUser.displayName || 'Kursant Google',
        email: data.email || fbUser.email || 'user@gmail.com',
        role: isAdminEmail ? 'admin' : 'student',
        status: data.status || 'active',
        antiBotVerified: true,
        antiBotScore: 100,
        avatar:
          data.avatar ||
          fbUser.photoURL ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(uid)}`,
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
        lives: typeof data.lives === 'number' ? data.lives : 5,
        maxLives: typeof data.maxLives === 'number' ? data.maxLives : 5,
        lastPracticeRewardDate: data.lastPracticeRewardDate,
        lastFlashcardRewardDate: data.lastFlashcardRewardDate,
        isPro: isAdminEmail ? true : Boolean(data.isPro),
        proPlan: isAdminEmail ? 'lifetime' : data.proPlan,
        streakFreezes: typeof data.streakFreezes === 'number' ? data.streakFreezes : 1,
        bio: data.bio || 'Zalogowano przez Google Firebase Auth (Chmura Firestore).',
        createdAt: data.createdAt || new Date().toISOString().split('T')[0],
      };
    }

    void saveUserProfileToCloud(uid, initialUser);
    return initialUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    // Do not block Google login if Firestore is temporarily in offline mode — return the authenticated user and sync in background
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
        const data = snap.data() as User;
        onUpdate({
          ...data,
          id: data.id || uid,
          completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
          completedProjects: Array.isArray(data.completedProjects) ? data.completedProjects : [],
          unlockedBadges: Array.isArray(data.unlockedBadges) ? data.unlockedBadges : [],
          claimedRewards: Array.isArray(data.claimedRewards) ? data.claimedRewards : [],
          quizScores: data.quizScores || {},
          savedCode: data.savedCode || {},
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

export async function signInWithGoogleFirebase(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFromFirebase(): Promise<void> {
  if (auth.currentUser) {
    await firebaseSignOut(auth);
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };
