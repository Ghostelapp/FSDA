import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEmailFormat,
  getPasswordStrength,
  authenticateUserCredentials,
  validateAndCreateUser,
  canSwitchToUser,
  canResetUserPassword,
  sanitizeImportedUser,
  createGuestUser,
  isGuestUser,
  checkProtectedRouteAccess,
  getRecommendedAuthorizedDomains,
  classifyGoogleAuthError,
  classifyEmailAuthError,
  resolveFirebaseAuthDomain,
  shouldPreferGoogleRedirectAuth,
  shouldFallbackPopupErrorToRedirect,
} from './authValidation';
import { User } from '../types';

const MOCK_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Administrator (Zordon)',
    email: 'zordonzordon1@gmail.com',
    role: 'admin',
    status: 'active',
    antiBotVerified: true,
    xp: 9999,
    level: 10,
    streakDays: 45,
    lastActiveDate: '2026-10-20',
    weeklyGoalMinutes: 300,
    weeklySpentMinutes: 280,
    completedLessons: ['html-1'],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: true,
    streakFreezes: 5,
    createdAt: '2026-09-01',
  },
  {
    id: 'u-1',
    name: 'Anna Nowak',
    email: 'anna@akademia.pl',
    password: 'Secret123!',
    role: 'student',
    status: 'active',
    antiBotVerified: true,
    xp: 450,
    level: 2,
    streakDays: 5,
    lastActiveDate: '2026-10-20',
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 90,
    completedLessons: ['html-1'],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 5,
    maxLives: 5,
    isPro: false,
    streakFreezes: 1,
    createdAt: '2026-10-01',
  },
  {
    id: 'u-banned',
    name: 'Spam Bot',
    email: 'bot@spam.pl',
    password: 'botpassword',
    role: 'student',
    status: 'banned',
    banReason: 'Automatyczny skrypt spamujący.',
    antiBotVerified: false,
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: '2026-10-01',
    weeklyGoalMinutes: 180,
    weeklySpentMinutes: 0,
    completedLessons: [],
    completedProjects: [],
    quizScores: {},
    unlockedBadges: [],
    savedCode: {},
    lives: 0,
    maxLives: 5,
    isPro: false,
    streakFreezes: 0,
    createdAt: '2026-10-01',
  },
];

test('validateEmailFormat validates correct and incorrect email addresses', () => {
  assert.equal(validateEmailFormat('student@example.com'), true);
  assert.equal(validateEmailFormat('  zordonzordon1@gmail.com  '), true);
  assert.equal(validateEmailFormat('invalid-email'), false);
  assert.equal(validateEmailFormat('missing@domain'), false);
  assert.equal(validateEmailFormat(''), false);
});

test('getPasswordStrength scores weak, medium, and strong passwords', () => {
  assert.equal(getPasswordStrength('').score, 0);
  assert.equal(getPasswordStrength('abc').score, 1);
  assert.equal(getPasswordStrength('haslo123').score, 2);
  assert.equal(getPasswordStrength('SilneHaslo2026!').score, 3);
});

test('authenticateUserCredentials succeeds with valid student email and password', () => {
  const res = authenticateUserCredentials(MOCK_USERS, '  ANNA@akademia.pl ', 'Secret123!');
  assert.equal(res.success, true);
  assert.equal(res.user?.id, 'u-1');
  assert.equal(res.user?.role, 'student');
  assert.ok(res.user?.lastLoginAt);
});

test('authenticateUserCredentials blocks password login to administrator account', () => {
  const adminAttempt = authenticateUserCredentials(MOCK_USERS, 'zordonzordon1@gmail.com', 'admin123');
  assert.equal(adminAttempt.success, false);
  assert.ok(adminAttempt.error?.includes('Google Firebase Auth'));
});

test('authenticateUserCredentials rejects empty or wrong password', () => {
  const emptyPass = authenticateUserCredentials(MOCK_USERS, 'anna@akademia.pl', '');
  assert.equal(emptyPass.success, false);
  assert.ok(emptyPass.error?.includes('hasło'));

  const wrongPass = authenticateUserCredentials(MOCK_USERS, 'anna@akademia.pl', 'wrongpass');
  assert.equal(wrongPass.success, false);
  assert.ok(wrongPass.error?.includes('Nieprawidłowe hasło'));
});

test('authenticateUserCredentials blocks banned accounts with reason', () => {
  const banned = authenticateUserCredentials(MOCK_USERS, 'bot@spam.pl', 'botpassword');
  assert.equal(banned.success, false);
  assert.ok(banned.error?.includes('zablokowane'));
  assert.ok(banned.error?.includes('Automatyczny skrypt'));
});

test('validateAndCreateUser registers new verified student and blocks self-registration as admin', () => {
  const duplicate = validateAndCreateUser(MOCK_USERS, {
    name: 'Anna Druga',
    email: 'ANNA@akademia.pl',
    password: 'password123',
    role: 'student',
    antiBotPassed: true,
  });
  assert.equal(duplicate.success, false);
  assert.ok(duplicate.error?.includes('już istnieje'));

  const adminEscalation = validateAndCreateUser(MOCK_USERS, {
    name: 'Haker Admin',
    email: 'hacker@fullstack.pl',
    password: 'SafePassword99!',
    role: 'admin',
    antiBotPassed: true,
  });
  assert.equal(adminEscalation.success, false);
  assert.ok(adminEscalation.error?.includes('Administratora jest zablokowana'));

  const valid = validateAndCreateUser(MOCK_USERS, {
    name: 'Karol Kowalski',
    email: 'karol@fullstack.pl',
    password: 'SafePassword99!',
    role: 'student',
    antiBotPassed: true,
    antiBotScore: 100,
    bio: 'Pasjonat TypeScriptu',
  });
  assert.equal(valid.success, true);
  assert.equal(valid.user?.email, 'karol@fullstack.pl');
  assert.equal(valid.user?.role, 'student');
  assert.equal(valid.user?.status, 'active');
  assert.equal(valid.user?.antiBotVerified, true);
});

test('canSwitchToUser allows active student accounts and blocks switching to admin or banned accounts', () => {
  const guest = createGuestUser();
  assert.equal(canSwitchToUser(MOCK_USERS[1], guest, false).allowed, true);

  // Guest or student cannot switch to admin
  const adminSwitchAsGuest = canSwitchToUser(MOCK_USERS[0], guest, false);
  assert.equal(adminSwitchAsGuest.allowed, false);
  assert.ok(adminSwitchAsGuest.error?.includes('Google Firebase OAuth'));

  const adminSwitchAsStudent = canSwitchToUser(MOCK_USERS[0], MOCK_USERS[1], true);
  assert.equal(adminSwitchAsStudent.allowed, false);

  // Verified admin can stay on admin
  const adminSwitchAsAdmin = canSwitchToUser(MOCK_USERS[0], MOCK_USERS[0], true);
  assert.equal(adminSwitchAsAdmin.allowed, true);

  const blocked = canSwitchToUser(MOCK_USERS[2], guest, false);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.error?.includes('zablokowane'));
});

test('canResetUserPassword blocks public password reset for administrator account', () => {
  assert.equal(canResetUserPassword(MOCK_USERS[1]).allowed, true);
  const adminReset = canResetUserPassword(MOCK_USERS[0]);
  assert.equal(adminReset.allowed, false);
  assert.ok(adminReset.error?.includes('Administratora'));
});

test('sanitizeImportedUser strips admin privileges when imported by guest or student', () => {
  const guest = createGuestUser();
  const maliciousBackup: User = {
    ...MOCK_USERS[0],
    id: 'user-admin',
    email: 'zordonzordon1@gmail.com',
    role: 'admin',
  };
  const sanitized = sanitizeImportedUser(maliciousBackup, guest, false);
  assert.equal(sanitized.role, 'student');
  assert.notEqual(sanitized.id, 'user-admin');
  assert.notEqual(sanitized.email, 'zordonzordon1@gmail.com');
});

test('createGuestUser returns a clean unauthenticated guest profile', () => {
  const guest = createGuestUser();
  assert.equal(guest.id, 'user-guest');
  assert.equal(guest.role, 'student');
  assert.equal(guest.xp, 0);
});

test('isGuestUser identifies unauthenticated and guest users accurately', () => {
  const guest = createGuestUser();
  assert.equal(isGuestUser(guest, false), true);
  assert.equal(isGuestUser(guest, true), true);
  assert.equal(isGuestUser(MOCK_USERS[1], false), true);
  assert.equal(isGuestUser(MOCK_USERS[1], true), false);
  assert.equal(isGuestUser(null, true), true);
});

test('checkProtectedRouteAccess blocks guests from AdminPanelView and protected routes', () => {
  const guest = createGuestUser();
  const resUnauth = checkProtectedRouteAccess(guest, false, { requiredRole: 'admin', allowGuests: false });
  assert.equal(resUnauth.allowed, false);
  assert.equal(resUnauth.reason, 'guest_blocked');
  assert.ok(resUnauth.title?.includes('Zablokowany dla Gości'));

  // Even if guest spoofed role='admin', isGuestUser blocks them with guest_blocked
  const spoofedGuest: User = { ...guest, role: 'admin' };
  const resSpoofed = checkProtectedRouteAccess(spoofedGuest, true, { requiredRole: 'admin' });
  assert.equal(resSpoofed.allowed, false);
  assert.equal(resSpoofed.reason, 'guest_blocked');
});

test('checkProtectedRouteAccess blocks non-admin students from AdminPanelView and allows verified admin', () => {
  const student = MOCK_USERS[1];
  const studentAccess = checkProtectedRouteAccess(student, true, { requiredRole: 'admin', allowGuests: false });
  assert.equal(studentAccess.allowed, false);
  assert.equal(studentAccess.reason, 'insufficient_role');
  assert.ok(studentAccess.title?.includes('Administratora'));

  // Student is allowed when requiredRole is 'student' and allowGuests is false
  const studentRouteAccess = checkProtectedRouteAccess(student, true, { requiredRole: 'student', allowGuests: false });
  assert.equal(studentRouteAccess.allowed, true);

  // Banned user is blocked with account_inactive
  const bannedAccess = checkProtectedRouteAccess(MOCK_USERS[2], true, { requiredRole: 'student' });
  assert.equal(bannedAccess.allowed, false);
  assert.equal(bannedAccess.reason, 'account_inactive');

  // Verified admin is allowed into AdminPanelView
  const adminAccess = checkProtectedRouteAccess(MOCK_USERS[0], true, { requiredRole: 'admin', allowGuests: false });
  assert.equal(adminAccess.allowed, true);
});

test('getRecommendedAuthorizedDomains includes both apex and www variants cleanly', () => {
  assert.deepEqual(getRecommendedAuthorizedDomains('fsda.tech'), ['fsda.tech', 'www.fsda.tech']);
  assert.deepEqual(getRecommendedAuthorizedDomains('www.fsda.tech'), ['www.fsda.tech', 'fsda.tech']);
  assert.deepEqual(getRecommendedAuthorizedDomains('app.fsda.tech'), ['app.fsda.tech']);
  assert.deepEqual(getRecommendedAuthorizedDomains('localhost'), ['localhost']);
});

test('classifyGoogleAuthError classifies unauthorized-domain, popup-blocked, closed, and network errors', () => {
  const domainErrPl = classifyGoogleAuthError(
    { code: 'auth/unauthorized-domain', message: 'Firebase: Error (auth/unauthorized-domain).' },
    'fsda.tech',
    'pl'
  );
  assert.equal(domainErrPl.code, 'unauthorized-domain');
  assert.equal(domainErrPl.isDomainConfigIssue, true);
  assert.equal(domainErrPl.recommendEmailAuth, true);
  assert.deepEqual(domainErrPl.recommendedDomains, ['fsda.tech', 'www.fsda.tech']);
  assert.equal(domainErrPl.userMessage.includes('poniżej'), false);

  const domainErrEn = classifyGoogleAuthError(
    { code: 'auth/unauthorized-domain' },
    'fsda.tech',
    'en'
  );
  assert.equal(domainErrEn.code, 'unauthorized-domain');
  assert.ok(domainErrEn.userMessage.includes('fsda.tech'));

  const popupBlocked = classifyGoogleAuthError({ code: 'auth/popup-blocked' }, 'fsda.tech', 'pl');
  assert.equal(popupBlocked.code, 'popup-blocked');
  assert.equal(popupBlocked.isDomainConfigIssue, false);
  assert.equal(popupBlocked.recommendEmailAuth, true);

  const popupClosed = classifyGoogleAuthError({ code: 'auth/popup-closed-by-user' }, 'fsda.tech', 'pl');
  assert.equal(popupClosed.code, 'popup-closed');
  assert.equal(popupClosed.recommendEmailAuth, false);

  const netErr = classifyGoogleAuthError(new Error('auth/network-request-failed'), 'fsda.tech', 'en');
  assert.equal(netErr.code, 'network');
  assert.equal(netErr.recommendEmailAuth, true);

  const opNotAllowed = classifyGoogleAuthError({ code: 'auth/operation-not-allowed' }, 'fsda.tech', 'pl');
  assert.equal(opNotAllowed.code, 'operation-not-allowed');
  assert.equal(opNotAllowed.isProviderConfigIssue, true);

  const configNotFound = classifyGoogleAuthError({ code: 'auth/configuration-not-found' }, 'fsda.tech', 'pl');
  assert.equal(configNotFound.code, 'configuration-not-found');
  assert.equal(configNotFound.isProviderConfigIssue, true);
});

test('classifyEmailAuthError classifies provider config, credentials, weak password, and rate-limit errors', () => {
  const providerDisabled = classifyEmailAuthError({ code: 'auth/operation-not-allowed' }, 'fsda.tech', 'pl');
  assert.equal(providerDisabled.code, 'operation-not-allowed');
  assert.equal(providerDisabled.isProviderConfigIssue, true);
  assert.ok(providerDisabled.userMessage.includes('Email/Password'));

  const configNotFound = classifyEmailAuthError({ code: 'auth/configuration-not-found' }, 'fsda.tech', 'pl');
  assert.equal(configNotFound.code, 'configuration-not-found');
  assert.equal(configNotFound.isProviderConfigIssue, true);
  assert.ok(configNotFound.userMessage.includes('Get started'));

  const alreadyInUse = classifyEmailAuthError({ code: 'auth/email-already-in-use' }, 'fsda.tech', 'en');
  assert.equal(alreadyInUse.code, 'email-already-in-use');
  assert.equal(alreadyInUse.isProviderConfigIssue, false);

  const invalidCred = classifyEmailAuthError({ code: 'auth/invalid-credential' }, 'fsda.tech', 'pl');
  assert.equal(invalidCred.code, 'invalid-credential');

  const weakPass = classifyEmailAuthError({ code: 'auth/weak-password' }, 'fsda.tech', 'pl');
  assert.equal(weakPass.code, 'weak-password');

  const tooMany = classifyEmailAuthError({ code: 'auth/too-many-requests' }, 'fsda.tech', 'en');
  assert.equal(tooMany.code, 'too-many-requests');

  const domainErr = classifyEmailAuthError({ code: 'auth/unauthorized-domain' }, 'fsda.tech', 'pl');
  assert.equal(domainErr.code, 'unauthorized-domain');
  assert.equal(domainErr.isDomainConfigIssue, true);
  assert.ok(domainErr.userMessage.includes('fsda.tech'));
});

test('resolveFirebaseAuthDomain switches to same-origin proxy on https://fsda.tech and preserves default elsewhere', () => {
  assert.equal(
    resolveFirebaseAuthDomain({
      defaultAuthDomain: 'fsda-1d673.firebaseapp.com',
      hostname: 'fsda.tech',
      protocol: 'https:',
    }),
    'fsda.tech'
  );
  assert.equal(
    resolveFirebaseAuthDomain({
      defaultAuthDomain: 'fsda-1d673.firebaseapp.com',
      hostname: 'www.fsda.tech',
      protocol: 'https:',
    }),
    'www.fsda.tech'
  );
  assert.equal(
    resolveFirebaseAuthDomain({
      defaultAuthDomain: 'fsda-1d673.firebaseapp.com',
      hostname: 'localhost',
      protocol: 'http:',
    }),
    'fsda-1d673.firebaseapp.com'
  );
  assert.equal(
    resolveFirebaseAuthDomain({
      envAuthDomain: 'custom.auth.domain',
      defaultAuthDomain: 'fsda-1d673.firebaseapp.com',
      hostname: 'fsda.tech',
      protocol: 'https:',
    }),
    'custom.auth.domain'
  );
});

test('shouldPreferGoogleRedirectAuth and shouldFallbackPopupErrorToRedirect choose redirect for mobile TWA and blocked popups', () => {
  assert.equal(
    shouldPreferGoogleRedirectAuth({ isInstalledMobileApp: true, userAgent: 'Mozilla/5.0 Chrome/130' }),
    true
  );
  assert.equal(
    shouldPreferGoogleRedirectAuth({
      isInstalledMobileApp: false,
      userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-A505FN; wv) AppleWebKit/537.36',
    }),
    true
  );
  assert.equal(
    shouldPreferGoogleRedirectAuth({
      isInstalledMobileApp: false,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0',
    }),
    false
  );

  assert.equal(shouldFallbackPopupErrorToRedirect({ code: 'auth/popup-blocked' }), true);
  assert.equal(
    shouldFallbackPopupErrorToRedirect({ code: 'auth/operation-not-supported-in-this-environment' }),
    true
  );
  assert.equal(shouldFallbackPopupErrorToRedirect({ code: 'auth/popup-closed-by-user' }), false);
});

test('classifyGoogleAuthError handles missing initial state and redirect_uri_mismatch', () => {
  const stateErr = classifyGoogleAuthError(
    new Error('Unable to process request due to missing initial state. storage-partitioned browser'),
    'fsda.tech',
    'pl'
  );
  assert.equal(stateErr.code, 'missing-initial-state');
  assert.equal(stateErr.recommendEmailAuth, true);

  const uriErr = classifyGoogleAuthError(
    new Error('Error 400: redirect_uri_mismatch'),
    'fsda.tech',
    'pl'
  );
  assert.equal(uriErr.code, 'redirect-uri-mismatch');
  assert.equal(uriErr.isDomainConfigIssue, true);
  assert.ok(uriErr.recommendedDomains.includes('https://fsda.tech/__/auth/handler'));
});
