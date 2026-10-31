import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { MODULES_DATA } from '../src/data/modulesData';
import { PROJECTS_DATA } from '../src/data/projectsData';
import { getProjectInteractiveExercise, validateExerciseCode } from '../src/utils/codeRunner';
import {
  calculateLevel,
  checkBadgesToUnlock,
  updateStreak,
  XP_COST_FULL_REFILL,
  XP_COST_ONE_HEART,
  XP_COST_STREAK_FREEZE,
  HEART_REGEN_INTERVAL_MS,
} from '../src/utils/gamification';
import { Lesson, User } from '../src/types';
import {
  getVerifiedActivityRewardAmount,
  isValidPracticeAnswers,
  TERMINAL_MISSION_REQUIREMENTS,
} from './rewardValidation';

const app = initializeApp();
const database = getFirestore(app, 'ai-studio-fullstackdevelop-80d152f2-d04c-445c-9051-a2745372418c');
const lessons = MODULES_DATA.flatMap((module) => module.lessons);

type CodeBundle = { html: string; css: string; js: string };

function requireUserId(uid: string | undefined): string {
  if (!uid) throw new HttpsError('unauthenticated', 'Zaloguj się, aby zapisać postęp.');
  return uid;
}

function requireProfile(data: Record<string, unknown> | undefined): Record<string, any> {
  if (!data) throw new HttpsError('failed-precondition', 'Profil nie został jeszcze utworzony.');
  if (data.status !== 'active') throw new HttpsError('permission-denied', 'Konto nie jest aktywne.');
  return data;
}

function getUserRef(uid: string) {
  return database.collection('users').doc(uid);
}

async function requireAdmin(uid: string, token: Record<string, unknown> | undefined): Promise<void> {
  if (
    token?.email === 'zordonzordon1@gmail.com' &&
    token.email_verified === true
  ) return;
  const profile = await getUserRef(uid).get();
  if (profile.data()?.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Wymagane uprawnienia administratora.');
  }
}

function getLesson(lessonId: unknown): Lesson {
  if (typeof lessonId !== 'string') throw new HttpsError('invalid-argument', 'Nieprawidłowy identyfikator lekcji.');
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson?.interactiveExercise) throw new HttpsError('not-found', 'Nie znaleziono lekcji lub ćwiczenia.');
  return lesson;
}

function getProject(projectId: unknown) {
  if (typeof projectId !== 'string') throw new HttpsError('invalid-argument', 'Nieprawidłowy identyfikator projektu.');
  const project = PROJECTS_DATA.find((item) => item.id === projectId);
  if (!project) throw new HttpsError('not-found', 'Nie znaleziono projektu.');
  return project;
}

function validateCode(exercise: Lesson['interactiveExercise'], code: unknown): asserts code is CodeBundle {
  if (!code || typeof code !== 'object') throw new HttpsError('invalid-argument', 'Brak kodu do sprawdzenia.');
  const candidate = code as Partial<CodeBundle>;
  if (typeof candidate.html !== 'string' || typeof candidate.css !== 'string' || typeof candidate.js !== 'string') {
    throw new HttpsError('invalid-argument', 'Kod musi zawierać sekcje HTML, CSS i JavaScript.');
  }
  if (candidate.html.length + candidate.css.length + candidate.js.length > 200_000) {
    throw new HttpsError('invalid-argument', 'Kod przekracza dozwolony rozmiar.');
  }
  if (!validateExerciseCode(exercise, candidate as CodeBundle).allPassed) {
    throw new HttpsError('failed-precondition', 'Kod nie spełnia testów zadania.');
  }
}

function scoreAnswers(lesson: Lesson, answers: unknown): number {
  if (!Array.isArray(lesson.quiz) || lesson.quiz.length === 0) {
    throw new HttpsError('failed-precondition', 'Ta lekcja nie ma quizu.');
  }
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    throw new HttpsError('invalid-argument', 'Odpowiedzi quizu są nieprawidłowe.');
  }
  const submitted = answers as Record<string, unknown>;
  const expectedIds = new Set(lesson.quiz.map((question) => question.id));
  if (Object.keys(submitted).length !== expectedIds.size || Object.keys(submitted).some((id) => !expectedIds.has(id))) {
    throw new HttpsError('invalid-argument', 'Odpowiedz na każde pytanie quizu.');
  }
  const correct = lesson.quiz.filter((question) => submitted[question.id] === question.correctAnswer).length;
  return Math.round((correct / lesson.quiz.length) * 100);
}

function getNewBadges(data: Record<string, any>, changes: Partial<User>): string[] {
  const updated = { ...data, ...changes } as User;
  return checkBadgesToUnlock(updated).filter((badge) => !(data.unlockedBadges || []).includes(badge));
}

function applyXp(data: Record<string, any>, amount: number) {
  const xp = Math.max(0, Number(data.xp) || 0) + amount;
  return { xp, level: calculateLevel(xp).level };
}

export const verifyLessonExercise = onCall({ region: 'us-central1', maxInstances: 20 }, async (request) => {
  const uid = requireUserId(request.auth?.uid);
  const lesson = lessons.find((item) => item.interactiveExercise?.id === request.data?.exerciseId);
  if (!lesson?.interactiveExercise) throw new HttpsError('not-found', 'Nie znaleziono ćwiczenia.');
  validateCode(lesson.interactiveExercise, request.data?.code);

  const ref = getUserRef(uid);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const profile = requireProfile(snapshot.data());
    const verifiedExercises: string[] = profile.verifiedExercises || [];
    const rewardId = `exercise-${lesson.interactiveExercise.id}`;
    const claimedRewards: string[] = profile.claimedRewards || [];
    const alreadyVerified = verifiedExercises.includes(lesson.interactiveExercise.id);
    const alreadyClaimed = claimedRewards.includes(rewardId);
    const xpUpdate = alreadyClaimed ? {} : applyXp(profile, 25);
    const badges = getNewBadges(profile, { ...xpUpdate, claimedRewards: [...claimedRewards, rewardId] });
    transaction.update(ref, {
      verifiedExercises: alreadyVerified ? verifiedExercises : [...verifiedExercises, lesson.interactiveExercise.id],
      claimedRewards: alreadyClaimed ? claimedRewards : [...claimedRewards, rewardId],
      ...xpUpdate,
      unlockedBadges: [...(profile.unlockedBadges || []), ...badges],
      updatedAt: new Date().toISOString(),
    });
  });
  return { verified: true };
});

export const submitQuizAnswers = onCall({ region: 'us-central1', maxInstances: 20 }, async (request) => {
  const uid = requireUserId(request.auth?.uid);
  const lesson = getLesson(request.data?.lessonId);
  const scorePercent = scoreAnswers(lesson, request.data?.answers);
  const ref = getUserRef(uid);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const profile = requireProfile(snapshot.data());
    const quizScores = { ...(profile.quizScores || {}) };
    quizScores[lesson.id] = Math.max(quizScores[lesson.id] || 0, scorePercent);
    const badges = getNewBadges(profile, { quizScores });
    transaction.update(ref, {
      quizScores,
      unlockedBadges: [...(profile.unlockedBadges || []), ...badges],
      updatedAt: new Date().toISOString(),
    });
  });
  return { scorePercent };
});

export const completeLesson = onCall({ region: 'us-central1', maxInstances: 20 }, async (request) => {
  const uid = requireUserId(request.auth?.uid);
  const lesson = getLesson(request.data?.lessonId);
  const ref = getUserRef(uid);
  let scoreFromRequest: number | undefined;
  if (request.data?.answers !== undefined) scoreFromRequest = scoreAnswers(lesson, request.data.answers);

  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const profile = requireProfile(snapshot.data());
    const verifiedExercises: string[] = profile.verifiedExercises || [];
    if (!verifiedExercises.includes(lesson.interactiveExercise!.id)) {
      throw new HttpsError('failed-precondition', 'Najpierw zalicz ćwiczenie praktyczne.');
    }

    const quizScores = { ...(profile.quizScores || {}) };
    if (scoreFromRequest !== undefined) {
      quizScores[lesson.id] = Math.max(quizScores[lesson.id] || 0, scoreFromRequest);
    }
    if ((quizScores[lesson.id] || 0) < 80) {
      throw new HttpsError('failed-precondition', 'Quiz musi być zaliczony na co najmniej 80%.');
    }

    const completedLessons: string[] = profile.completedLessons || [];
    if (completedLessons.includes(lesson.id)) return;

    const xpUpdate = applyXp(profile, lesson.xpReward);
    const streak = updateStreak(
      profile.lastActiveDate || '',
      Number(profile.streakDays) || 0,
      new Date().toISOString().slice(0, 10)
    );
    const changes: Partial<User> = {
      ...xpUpdate,
      completedLessons: [...completedLessons, lesson.id],
      quizScores,
      streakDays: streak.newStreak,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      weeklySpentMinutes: (Number(profile.weeklySpentMinutes) || 0) + lesson.durationMinutes,
    };
    const badges = getNewBadges(profile, changes);
    transaction.update(ref, {
      ...changes,
      unlockedBadges: [...(profile.unlockedBadges || []), ...badges],
      updatedAt: new Date().toISOString(),
    });
  });
  return { completed: true };
});

export const completeProject = onCall({ region: 'us-central1', maxInstances: 20 }, async (request) => {
  const uid = requireUserId(request.auth?.uid);
  const project = getProject(request.data?.projectId);
  const exercise = getProjectInteractiveExercise(project);
  validateCode(exercise, request.data?.code);
  const ref = getUserRef(uid);

  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const profile = requireProfile(snapshot.data());
    const completedProjects: string[] = profile.completedProjects || [];
    const claimedRewards: string[] = profile.claimedRewards || [];
    const verifyRewardId = `project-verify-${project.id}`;
    const newlyCompleted = !completedProjects.includes(project.id);
    const newlyVerified = !claimedRewards.includes(verifyRewardId);
    const xpUpdate = applyXp(profile, (newlyCompleted ? project.xpReward : 0) + (newlyVerified ? 50 : 0));
    const changes: Partial<User> = {
      ...xpUpdate,
      completedProjects: newlyCompleted ? [...completedProjects, project.id] : completedProjects,
      claimedRewards: newlyVerified ? [...claimedRewards, verifyRewardId] : claimedRewards,
    };
    const badges = getNewBadges(profile, changes);
    transaction.update(ref, {
      ...changes,
      unlockedBadges: [...(profile.unlockedBadges || []), ...badges],
      updatedAt: new Date().toISOString(),
    });
  });
  return { completed: true };
});

export const claimActivityReward = onCall({ region: 'us-central1', maxInstances: 20 }, async (request) => {
  const uid = requireUserId(request.auth?.uid);
  const rewardId = request.data?.rewardId;
  const proof = request.data?.proof;
  const today = new Date().toISOString().slice(0, 10);
  const isDailyFlashcardReward = rewardId === `flashcards-${today}`;
  const amount = getVerifiedActivityRewardAmount(rewardId, proof, today);
  if (!amount || typeof rewardId !== 'string') {
    throw new HttpsError('permission-denied', 'Nagroda lub dowód jej ukończenia są nieprawidłowe.');
  }

  const ref = getUserRef(uid);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const profile = requireProfile(snapshot.data());
    const claimedRewards: string[] = profile.claimedRewards || [];
    if (rewardId.startsWith('terminal-mission-')) {
      const requiredMissions = TERMINAL_MISSION_REQUIREMENTS[rewardId].requires;
      if (requiredMissions.some((requiredId) => !claimedRewards.includes(requiredId))) {
        throw new HttpsError('failed-precondition', 'Najpierw zalicz wymagane misje terminala.');
      }
    }
    if (isDailyFlashcardReward) {
      if (profile.lastFlashcardRewardDate === today) return;
    } else if (claimedRewards.includes(rewardId)) {
      return;
    }

    const xpUpdate = applyXp(profile, amount);
    const nextClaims = claimedRewards.includes(rewardId) ? claimedRewards : [...claimedRewards, rewardId];
    const badges = getNewBadges(profile, { ...xpUpdate, claimedRewards: nextClaims });
    transaction.update(ref, {
      ...xpUpdate,
      claimedRewards: nextClaims,
      ...(isDailyFlashcardReward ? { lastFlashcardRewardDate: today } : {}),
      unlockedBadges: [...(profile.unlockedBadges || []), ...badges],
      updatedAt: new Date().toISOString(),
    });
  });
  return { claimed: true };
});

export const updateLives = onCall({ region: 'us-central1', maxInstances: 20 }, async (request) => {
  const uid = requireUserId(request.auth?.uid);
  const action = request.data?.action;
  const allowedActions = ['lose', 'practice', 'ad-reward', 'buy-heart', 'buy-refill', 'buy-freeze', 'regenerate', 'admin-refill'];
  if (!allowedActions.includes(action)) throw new HttpsError('invalid-argument', 'Nieobsługiwana operacja serc.');

  const targetUid = action === 'admin-refill' ? request.data?.targetUid : uid;
  if (typeof targetUid !== 'string' || targetUid.length === 0) {
    throw new HttpsError('invalid-argument', 'Nieprawidłowy identyfikator użytkownika.');
  }
  if (action === 'admin-refill') await requireAdmin(uid, request.auth?.token);
  const ref = getUserRef(targetUid);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const profile = requireProfile(snapshot.data());
    const today = new Date().toISOString().slice(0, 10);
    const now = Date.now();
    const lives = Math.max(0, Number(profile.lives) || 0);
    const maxLives = Math.max(1, Number(profile.maxLives) || 5);
    const xp = Math.max(0, Number(profile.xp) || 0);
    const changes: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    let xpDelta = 0;

    switch (action) {
      case 'lose':
        if (!profile.isPro && lives > 0) {
          changes.lives = lives - 1;
          changes.lastHeartLostTimestamp = now;
        }
        break;
      case 'admin-refill':
        changes.lives = maxLives;
        break;
      case 'regenerate': {
        if (profile.isPro) {
          changes.lives = maxLives;
          changes.lastHeartLostTimestamp = null;
          break;
        }
        const lastLost = Number(profile.lastHeartLostTimestamp) || 0;
        if (lives >= maxLives || lastLost <= 0) return;
        const recovered = Math.floor(Math.max(0, now - lastLost) / HEART_REGEN_INTERVAL_MS);
        if (recovered <= 0) return;
        const nextLives = Math.min(maxLives, lives + recovered);
        const nextTimestamp = nextLives >= maxLives
          ? null
          : lastLost + recovered * HEART_REGEN_INTERVAL_MS;
        changes.lives = nextLives;
        changes.lastHeartLostTimestamp = nextTimestamp;
        break;
      }
      case 'practice':
        if (!isValidPracticeAnswers(request.data?.proof?.answers)) {
          throw new HttpsError('failed-precondition', 'Odpowiedzi powtórki są nieprawidłowe.');
        }
        if (profile.lastPracticeRewardDate === today) return;
        changes.lastPracticeRewardDate = today;
        if (lives >= maxLives) xpDelta = 15;
        else changes.lives = lives + 1;
        break;
      case 'ad-reward': {
        throw new HttpsError('failed-precondition', 'Brak serwerowego potwierdzenia obejrzenia reklamy.');
      }
      case 'buy-heart':
        if (lives >= maxLives || xp < XP_COST_ONE_HEART) {
          throw new HttpsError('failed-precondition', 'Za mało XP lub masz już maksymalną liczbę serc.');
        }
        changes.lives = lives + 1;
        xpDelta = -XP_COST_ONE_HEART;
        break;
      case 'buy-refill':
        if (lives >= maxLives || xp < XP_COST_FULL_REFILL) {
          throw new HttpsError('failed-precondition', 'Za mało XP lub masz już pełny zapas serc.');
        }
        changes.lives = maxLives;
        xpDelta = -XP_COST_FULL_REFILL;
        break;
      case 'buy-freeze':
        if (xp < XP_COST_STREAK_FREEZE) {
          throw new HttpsError('failed-precondition', 'Za mało XP na zakup tarczy serii.');
        }
        changes.streakFreezes = (Number(profile.streakFreezes) || 0) + 1;
        xpDelta = -XP_COST_STREAK_FREEZE;
        break;
    }

    if (xpDelta !== 0) {
      const xpUpdate = applyXp(profile, xpDelta);
      changes.xp = xpUpdate.xp;
      changes.level = xpUpdate.level;
      const badges = getNewBadges(profile, xpUpdate);
      changes.unlockedBadges = [...(profile.unlockedBadges || []), ...badges];
    }
    transaction.update(ref, changes);
  });
  return { updated: true };
});

export const setUserStatus = onCall({ region: 'us-central1', maxInstances: 20 }, async (request) => {
  const uid = requireUserId(request.auth?.uid);
  await requireAdmin(uid, request.auth?.token);
  const { targetUid, status } = request.data || {};
  if (typeof targetUid !== 'string' || !['active', 'suspended', 'banned', 'pending_verification'].includes(status)) {
    throw new HttpsError('invalid-argument', 'Nieprawidłowe konto lub status.');
  }
  await getUserRef(targetUid).update({ status, updatedAt: new Date().toISOString() });
  return { updated: true };
});

export const setUserProStatus = onCall({ region: 'us-central1', maxInstances: 20 }, async (request) => {
  const uid = requireUserId(request.auth?.uid);
  await requireAdmin(uid, request.auth?.token);
  const { targetUid, enabled, plan } = request.data || {};
  if (
    typeof targetUid !== 'string' || typeof enabled !== 'boolean' ||
    !['monthly', 'yearly'].includes(plan)
  ) {
    throw new HttpsError('invalid-argument', 'Nieprawidłowe uprawnienia PRO.');
  }
  const ref = getUserRef(targetUid);
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const profile = requireProfile(snapshot.data());
    transaction.update(ref, {
      isPro: enabled,
      proPlan: enabled ? plan : null,
      lives: enabled ? 5 : Math.min(5, Number(profile.lives) || 0),
      maxLives: 5,
      updatedAt: new Date().toISOString(),
    });
  });
  return { updated: true };
});