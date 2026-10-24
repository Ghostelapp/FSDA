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
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  deleteDoc,
  collection,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { User, Announcement } from './types';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
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
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Validate connection to Firestore on startup
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration. Client appears offline.');
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
  const isAdminEmail =
    (user.email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com';
  const payload: Record<string, unknown> = {
    uid,
    id: user.id || uid,
    name: (user.name || 'Kursant Akademii').slice(0, 120),
    email: (user.email || 'kursant@akademia.pl').slice(0, 254),
    role: isAdminEmail ? 'admin' : user.role === 'admin' ? 'admin' : 'student',
    status: user.status || 'active',
    xp: Math.max(0, Math.min(10000000, Number(user.xp) || 0)),
    level: Math.max(1, Math.min(1000, Number(user.level) || 1)),
    streakDays: Math.max(0, Math.min(10000, Number(user.streakDays) || 0)),
    lastActiveDate: user.lastActiveDate || new Date().toISOString().split('T')[0],
    weeklyGoalMinutes: Number(user.weeklyGoalMinutes) || 180,
    weeklySpentMinutes: Number(user.weeklySpentMinutes) || 0,
    completedLessons: Array.isArray(user.completedLessons)
      ? user.completedLessons.slice(0, 500)
      : [],
    completedProjects: Array.isArray(user.completedProjects)
      ? user.completedProjects.slice(0, 100)
      : [],
    unlockedBadges: Array.isArray(user.unlockedBadges)
      ? user.unlockedBadges.slice(0, 100)
      : [],
    claimedRewards: Array.isArray(user.claimedRewards)
      ? user.claimedRewards.slice(0, 1000)
      : [],
    quizScores: user.quizScores && typeof user.quizScores === 'object' ? user.quizScores : {},
    savedCode: user.savedCode && typeof user.savedCode === 'object' ? user.savedCode : {},
    lives: Math.max(0, Math.min(10, typeof user.lives === 'number' ? user.lives : 5)),
    maxLives: Math.max(1, Math.min(10, typeof user.maxLives === 'number' ? user.maxLives : 5)),
    isPro: Boolean(user.isPro),
    proPlan: user.proPlan || 'monthly',
    streakFreezes: Number(user.streakFreezes) || 0,
    bio: (user.bio || 'Kursant Full Stack Developer Academy').slice(0, 600),
    avatar:
      user.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || uid)}`,
    antiBotVerified: true,
    antiBotScore: 100,
    createdAt: user.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
  };

  return payload;
}

export async function saveUserProfileToCloud(uid: string, user: User): Promise<boolean> {
  const path = `users/${uid}`;
  try {
    const payload = serializeUserForFirestore(uid, user);
    await setDoc(doc(db, 'users', uid), payload, { merge: true });
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
    (fbUser.email || '').trim().toLowerCase() === 'zordonzordon1@gmail.com';

  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data() as Partial<User>;
      return {
        id: data.id || uid,
        name: data.name || fbUser.displayName || 'Kursant Google',
        email: data.email || fbUser.email || 'user@gmail.com',
        role: isAdminEmail ? 'admin' : data.role || 'student',
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
        isPro: isAdminEmail ? true : Boolean(data.isPro),
        proPlan: isAdminEmail ? 'lifetime' : data.proPlan,
        streakFreezes: typeof data.streakFreezes === 'number' ? data.streakFreezes : 1,
        bio: data.bio || 'Zalogowano przez Google Firebase Auth (Chmura Firestore).',
        createdAt: data.createdAt || new Date().toISOString().split('T')[0],
      };
    }

    // Create a brand new cloud profile (carrying over local guest progress if any)
    const initialUser: User = {
      id: uid,
      name: fbUser.displayName || fallbackLocalUser?.name || 'Kursant Akademii',
      email: fbUser.email || 'kursant@gmail.com',
      role: isAdminEmail ? 'admin' : 'student',
      status: 'active',
      antiBotVerified: true,
      antiBotScore: 100,
      avatar:
        fbUser.photoURL ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(uid)}`,
      xp: isAdminEmail ? Math.max(9999, fallbackLocalUser?.xp || 0) : fallbackLocalUser?.xp || 50,
      level: isAdminEmail ? 10 : fallbackLocalUser?.level || 1,
      streakDays: Math.max(1, fallbackLocalUser?.streakDays || 1),
      lastActiveDate: new Date().toISOString().split('T')[0],
      weeklyGoalMinutes: fallbackLocalUser?.weeklyGoalMinutes || 180,
      weeklySpentMinutes: fallbackLocalUser?.weeklySpentMinutes || 15,
      completedLessons: fallbackLocalUser?.completedLessons || ['fund-1'],
      completedProjects: fallbackLocalUser?.completedProjects || [],
      unlockedBadges: fallbackLocalUser?.unlockedBadges || ['first-step'],
      claimedRewards: fallbackLocalUser?.claimedRewards || [],
      quizScores: fallbackLocalUser?.quizScores || {},
      savedCode: fallbackLocalUser?.savedCode || {},
      lives: 5,
      maxLives: 5,
      isPro: isAdminEmail ? true : Boolean(fallbackLocalUser?.isPro),
      proPlan: isAdminEmail ? 'lifetime' : fallbackLocalUser?.proPlan,
      streakFreezes: isAdminEmail ? 5 : 1,
      bio: isAdminEmail
        ? 'Główny Administrator i Architekt Akademii Full Stack Developer (Chmura Firebase).'
        : 'Kursant Full Stack Developer Academy (Synchronizacja z chmurą Firestore).',
      createdAt: new Date().toISOString().split('T')[0],
    };

    await saveUserProfileToCloud(uid, initialUser);
    return initialUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
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
