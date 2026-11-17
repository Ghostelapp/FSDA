import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES_DATA } from '../data/modulesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { BADGES_DATA } from '../data/badgesData';
import { DEFAULT_ANNOUNCEMENTS } from '../data/defaultAnnouncements';
import { LEVEL_TIERS, calculateLevel } from './gamification';
import { CAREER_TRACKS, CAREER_TRACKS_EN, calculateStudyPlanEstimate } from './landingCalculator';
import { getBeginnerLessonAid } from './lessonReadability';
import { getPublicRouteSeoMetadata, PUBLIC_TABS } from './publicRoutes';
import {
  CATEGORY_LABELS_EN,
  LEVEL_TITLES_EN,
  formatAnnouncementCategory,
  formatCategoryLabel,
  formatDifficultyLabel,
  getLocalizedLevelTitle,
  parseLanguage,
} from './i18n';
import {
  BADGES_EN,
  CURATED_BEGINNER_AIDS_EN,
  DEFAULT_ANNOUNCEMENTS_EN,
  LESSONS_META_EN,
  MODULES_EN,
  PROJECTS_EN,
  localizeAnnouncement,
  localizeBadge,
  localizeLesson,
  localizeModule,
  localizeProject,
} from '../locales/curriculumEn';

import { LESSON_DETAILS_EN } from '../locales/lessonDetailsEn';
import { getProjectInteractiveExercise, validateExerciseCode } from './codeRunner';
import {
  buildWeeklyLeaderboard,
  evaluateDailyChallenge,
  executeSimulatedRequest,
  generateGithubPortfolioMarkdown,
  getLocalizedApiMissions,
  getLocalizedCheatSheets,
  getLocalizedDailyChallenges,
  getLocalizedEventLoopScenarios,
  getLocalizedFlashcardsDeck,
  getLocalizedSqlMissions,
  validateBackupPayload,
  validateSqlQuerySyntax,
  verifyCertificateCode,
} from './developerSimulators';
import {
  formatGithubSyncTimestamp,
  formatRelativeSyncTime,
  getGithubSyncStatusPresentation,
} from './githubService';
import { getRandomAntiBotChallenge, verifyAntiBotSubmission } from './antiBot';
import {
  checkProtectedRouteAccess,
  createGuestUser,
  getPasswordStrength,
} from './authValidation';
import {
  buildDailyGoalNotificationPayload,
  formatDurationUntilReminder,
} from './pushNotifications';

const POLISH_DIACRITIC_REGEX = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

describe('i18n & curriculum English completeness', () => {
  it('parseLanguage resolves pl/en/locale strings safely', () => {
    assert.equal(parseLanguage('en'), 'en');
    assert.equal(parseLanguage('EN-us'), 'en');
    assert.equal(parseLanguage('pl'), 'pl');
    assert.equal(parseLanguage('pl-PL'), 'pl');
    assert.equal(parseLanguage('de'), 'pl');
    assert.equal(parseLanguage(undefined), 'pl');
    assert.equal(parseLanguage(null), 'pl');
  });

  it('covers all 15 modules in MODULES_EN without Polish diacritics', () => {
    assert.equal(MODULES_DATA.length, 15);
    for (const mod of MODULES_DATA) {
      const localized = localizeModule(mod, 'en');
      const enEntry = MODULES_EN[mod.id];
      assert.ok(enEntry, `Missing MODULES_EN entry for module ${mod.id}`);
      assert.ok(localized.title.trim().length > 0);
      assert.ok(localized.description.trim().length > 0);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.title), false, `Polish char in EN module ${mod.id} title`);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.description), false, `Polish char in EN module ${mod.id} desc`);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.badgeName), false, `Polish char in EN module ${mod.id} badge`);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.displayCategory), false, `Polish char in EN category ${mod.id}`);
      assert.equal(localized.topics.length, mod.topics.length, `Topics mismatch on module ${mod.id}`);
      for (const topic of localized.topics) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(topic), false, `Polish char in EN topic of module ${mod.id}: ${topic}`);
      }
      if (localized.projectBrief) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(localized.projectBrief), false);
      }
    }
  });

  it('covers all 96 lessons in LESSONS_META_EN and localized interactive rules without Polish diacritics', () => {
    const allLessons = MODULES_DATA.flatMap((m) => m.lessons);
    assert.equal(allLessons.length, 96);
    for (const lesson of allLessons) {
      const en = LESSONS_META_EN[lesson.id];
      assert.ok(en, `Missing LESSONS_META_EN entry for lesson ${lesson.id}`);
      assert.ok(en.title.trim().length > 5, `Empty EN title for ${lesson.id}`);
      assert.ok(en.summary.trim().length > 10, `Empty EN summary for ${lesson.id}`);
      assert.equal(POLISH_DIACRITIC_REGEX.test(en.title), false, `Polish char in EN lesson ${lesson.id} title: ${en.title}`);
      assert.equal(POLISH_DIACRITIC_REGEX.test(en.summary), false, `Polish char in EN lesson ${lesson.id} summary`);

      const localized = localizeLesson(lesson, 'en');
      assert.equal(localized.title, en.title);
      assert.equal(localized.summary, en.summary);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.moduleTitle), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.interactiveExercise.title), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.interactiveExercise.task), false);
      for (const rule of localized.interactiveExercise.rules) {
        const wrapperWithoutTargetLiteral = rule.description.replace(/"[^"]*"/g, '');
        assert.equal(
          POLISH_DIACRITIC_REGEX.test(wrapperWithoutTargetLiteral),
          false,
          `Polish char in EN rule wrapper of ${lesson.id}: ${rule.description}`
        );
      }
      for (const crit of localized.completionCriteria || []) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(crit), false);
      }
    }
  });

  it('covers all featured/starter lessons deeply in LESSON_DETAILS_EN without Polish diacritics', () => {
    const featuredIds = ['html-7', 'html-10', 'html-8', 'html-1', 'css-7', 'css-2', 'js-1', 'fund-1', 'react-1', 'node-1', 'db-1'];
    for (const id of featuredIds) {
      const base = MODULES_DATA.flatMap((m) => m.lessons).find((l) => l.id === id);
      assert.ok(base, `Missing lesson ${id}`);
      assert.ok(LESSON_DETAILS_EN[id], `Missing LESSON_DETAILS_EN for ${id}`);
      const loc = localizeLesson(base, 'en');
      assert.equal(POLISH_DIACRITIC_REGEX.test(loc.theoryMarkdown), false, `Polish char in EN theoryMarkdown of ${id}`);
      for (const obj of loc.objectives) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(obj), false);
      }
      for (const hint of loc.interactiveExercise.hints) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(hint), false);
      }
      for (const q of loc.quiz) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(q.question), false);
        assert.equal(POLISH_DIACRITIC_REGEX.test(q.explanation), false);
        for (const opt of q.options) {
          assert.equal(POLISH_DIACRITIC_REGEX.test(opt), false);
        }
      }
    }
  });

  it('covers all 12 commercial projects in PROJECTS_EN without Polish diacritics', () => {
    assert.equal(PROJECTS_DATA.length, 12);
    for (const proj of PROJECTS_DATA) {
      const en = PROJECTS_EN[proj.id];
      assert.ok(en, `Missing PROJECTS_EN entry for ${proj.id}`);
      const localized = localizeProject(proj, 'en');
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.title), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.description), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.displayCategory), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized.displayDifficulty), false);
      assert.equal(localized.requirements.length, proj.requirements.length);
      assert.equal(localized.stages.length, proj.stages.length);
      for (const req of localized.requirements) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(req), false, `Polish char in project ${proj.id} req: ${req}`);
      }
      for (const st of localized.stages) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(st.title), false);
        assert.equal(POLISH_DIACRITIC_REGEX.test(st.description), false);
      }
    }
  });

  it('covers all 8 badges, 3 announcements, and 10 level titles cleanly in EN', () => {
    assert.equal(BADGES_DATA.length, 8);
    for (const badge of BADGES_DATA) {
      assert.ok(BADGES_EN[badge.id], `Missing BADGES_EN for ${badge.id}`);
      const loc = localizeBadge(badge, 'en');
      assert.equal(POLISH_DIACRITIC_REGEX.test(loc.name), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(loc.description), false);
    }

    assert.equal(DEFAULT_ANNOUNCEMENTS.length, 3);
    for (const ann of DEFAULT_ANNOUNCEMENTS) {
      assert.ok(DEFAULT_ANNOUNCEMENTS_EN[ann.id], `Missing DEFAULT_ANNOUNCEMENTS_EN for ${ann.id}`);
      const loc = localizeAnnouncement(ann, 'en');
      assert.equal(POLISH_DIACRITIC_REGEX.test(loc.title), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(loc.content), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(loc.displayCategory), false);
    }

    assert.equal(LEVEL_TIERS.length, 10);
    for (const tier of LEVEL_TIERS) {
      assert.ok(LEVEL_TITLES_EN[tier.level], `Missing LEVEL_TITLES_EN for level ${tier.level}`);
      const localized = getLocalizedLevelTitle(tier.level, tier.title, 'en');
      assert.equal(POLISH_DIACRITIC_REGEX.test(localized), false);
      assert.equal(calculateLevel(tier.minXp, 'en').title, LEVEL_TITLES_EN[tier.level]);
    }
  });

  it('localizes career tracks, beginner aids, category labels, and public SEO routes', () => {
    for (const key of Object.keys(CAREER_TRACKS) as Array<keyof typeof CAREER_TRACKS>) {
      const en = CAREER_TRACKS_EN[key];
      assert.ok(en);
      assert.equal(POLISH_DIACRITIC_REGEX.test(en.title), false);
      const est = calculateStudyPlanEstimate(120, 10, key, 'en');
      assert.equal(est.milestones.length, 4);
      for (const m of est.milestones) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(m.title), false);
        assert.equal(POLISH_DIACRITIC_REGEX.test(m.deliverable), false);
      }
    }

    for (const [id, aid] of Object.entries(CURATED_BEGINNER_AIDS_EN)) {
      assert.equal(POLISH_DIACRITIC_REGEX.test(aid.analogyTitle), false, `Polish char in curated aid ${id}`);
      assert.equal(POLISH_DIACRITIC_REGEX.test(aid.analogyText), false, `Polish char in curated aid text ${id}`);
    }

    const firstLesson = MODULES_DATA[0].lessons[0];
    const aidEn = getBeginnerLessonAid(localizeLesson(firstLesson, 'en'), 'en');
    assert.equal(POLISH_DIACRITIC_REGEX.test(aidEn.difficultySummary), false);
    assert.equal(POLISH_DIACRITIC_REGEX.test(aidEn.analogyTitle), false);

    for (const cat of Object.keys(CATEGORY_LABELS_EN)) {
      assert.equal(POLISH_DIACRITIC_REGEX.test(formatCategoryLabel(cat, 'en')), false);
    }
    assert.equal(formatDifficultyLabel('Średniozaawansowany', 'en'), 'Intermediate');
    assert.equal(formatAnnouncementCategory('Aktualizacja', 'en'), 'Update');

    for (const tab of PUBLIC_TABS) {
      const seo = getPublicRouteSeoMetadata(tab, tab === 'public_lesson' ? localizeLesson(firstLesson, 'en') : null, 'en');
      assert.equal(POLISH_DIACRITIC_REGEX.test(seo.title), false, `Polish char in EN SEO title for ${tab}`);
      assert.equal(POLISH_DIACRITIC_REGEX.test(seo.description), false, `Polish char in EN SEO desc for ${tab}`);
    }
  });

  it('localizes codeRunner project exercises and rule evaluation messages in EN', () => {
    for (const proj of PROJECTS_DATA) {
      const ex = getProjectInteractiveExercise(localizeProject(proj, 'en'), 'en');
      assert.equal(POLISH_DIACRITIC_REGEX.test(ex.title), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(ex.instructions), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(ex.task), false);
      for (const r of ex.rules) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(r.description), false);
      }
      const res = validateExerciseCode(ex, { html: '', css: '', js: '' }, 'en');
      for (const r of res.results) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(r.message || ''), false, `Polish char in codeRunner feedback: ${r.message}`);
      }
    }
  });

  it('localizes all developer simulators (API, Event Loop, SQL, Flashcards, Portfolio, Leaderboard) in EN', () => {
    const apiMissions = getLocalizedApiMissions('en');
    assert.ok(apiMissions.length >= 4);
    for (const m of apiMissions) {
      assert.equal(POLISH_DIACRITIC_REGEX.test(m.title), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(m.description), false);
    }
    const simRes = executeSimulatedRequest(
      { method: 'GET', endpoint: '/api/courses', headers: {}, bodyRaw: '' },
      'en'
    );
    assert.equal(POLISH_DIACRITIC_REGEX.test(simRes.statusText), false);

    const elScenarios = getLocalizedEventLoopScenarios('en');
    assert.ok(elScenarios.length >= 2);
    for (const sc of elScenarios) {
      assert.equal(POLISH_DIACRITIC_REGEX.test(sc.title), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(sc.description), false);
      for (const step of sc.steps) {
        assert.equal(POLISH_DIACRITIC_REGEX.test(step.explanation), false);
      }
    }

    const challenges = getLocalizedDailyChallenges('en');
    for (const ch of challenges) {
      assert.equal(POLISH_DIACRITIC_REGEX.test(ch.title), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(ch.description), false);
    }
    const chEval = evaluateDailyChallenge(challenges[0], '', 'en');
    assert.equal(POLISH_DIACRITIC_REGEX.test(chEval.error || ''), false);

    const flashcards = getLocalizedFlashcardsDeck('en');
    for (const card of flashcards) {
      assert.equal(POLISH_DIACRITIC_REGEX.test(card.question), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(card.answer), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(card.category || ''), false);
    }

    const sheets = getLocalizedCheatSheets('en');
    for (const sh of sheets) {
      assert.equal(POLISH_DIACRITIC_REGEX.test(sh.title), false);
    }

    const sqlMissions = getLocalizedSqlMissions('en');
    for (const sm of sqlMissions) {
      assert.equal(POLISH_DIACRITIC_REGEX.test(sm.title), false);
      assert.equal(POLISH_DIACRITIC_REGEX.test(sm.description), false);
    }
    const sqlErr = validateSqlQuerySyntax('INVALID SQL;', 'en');
    assert.equal(sqlErr.valid, false);
    assert.equal(POLISH_DIACRITIC_REGEX.test(sqlErr.error || ''), false);

    const guest = createGuestUser('en');
    assert.equal(POLISH_DIACRITIC_REGEX.test(guest.bio || ''), false);
    const md = generateGithubPortfolioMarkdown(guest, [], [], 'en');
    assert.equal(POLISH_DIACRITIC_REGEX.test(md), false);

    const lb = buildWeeklyLeaderboard(guest, [guest], 'en');
    assert.ok(lb.length >= 5);
    assert.equal(POLISH_DIACRITIC_REGEX.test(verifyCertificateCode('INVALID', [guest], guest, 'en').message), false);
    assert.equal(POLISH_DIACRITIC_REGEX.test(validateBackupPayload('', 'en').error || ''), false);
  });

  it('localizes githubService, antiBot, authValidation, and pushNotifications in EN', () => {
    const guest = createGuestUser('en');
    const syncPres = getGithubSyncStatusPresentation(guest.githubIntegration, 'en');
    assert.equal(POLISH_DIACRITIC_REGEX.test(syncPres.label), false);
    assert.equal(POLISH_DIACRITIC_REGEX.test(formatGithubSyncTimestamp(undefined, 'en')), false);
    assert.equal(POLISH_DIACRITIC_REGEX.test(formatRelativeSyncTime(new Date().toISOString(), Date.now(), 'en')), false);

    const challenge = getRandomAntiBotChallenge('en');
    assert.equal(POLISH_DIACRITIC_REGEX.test(challenge.question), false);
    const botRes = verifyAntiBotSubmission({
      challengeId: challenge.id,
      userAnswer: 'wrong',
      honeypotValue: '',
      sliderProgress: 50,
      timeSpentMs: 2500,
      language: 'en',
    });
    assert.equal(botRes.isHuman, false);
    assert.equal(POLISH_DIACRITIC_REGEX.test(botRes.reason || ''), false);

    assert.equal(POLISH_DIACRITIC_REGEX.test(getPasswordStrength('Ab1!', 'en').label), false);
    const guard = checkProtectedRouteAccess(null, false, { requiredRole: 'student', allowGuests: false, language: 'en' });
    assert.equal(guard.allowed, false);
    assert.equal(POLISH_DIACRITIC_REGEX.test(guard.message || ''), false);

    assert.equal(POLISH_DIACRITIC_REGEX.test(formatDurationUntilReminder(125000, 'en')), false);
    const notif = buildDailyGoalNotificationPayload({
      userName: 'Alex',
      streakDays: 3,
      todayMinutes: 10,
      dailyGoalMinutes: 20,
      nextLessonTitle: 'HTML Basics',
      language: 'en',
    });
    assert.equal(POLISH_DIACRITIC_REGEX.test(notif.title), false);
    assert.equal(POLISH_DIACRITIC_REGEX.test(notif.options.body || ''), false);
  });
});
