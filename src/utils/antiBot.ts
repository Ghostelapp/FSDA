/**
 * Anti-Bot (Anybot) Security & Human Verification Utilities
 */

import type { AppLanguage } from './i18n';

export interface AntiBotChallenge {
  id: string;
  question: string;
  hint: string;
  expectedAnswers: string[];
}

export const ANTI_BOT_CHALLENGES: AntiBotChallenge[] = [
  {
    id: 'ch-math',
    question: 'Ile wynosi 14 + 8?',
    hint: 'Wpisz samą liczbę',
    expectedAnswers: ['22'],
  },
  {
    id: 'ch-tag',
    question: 'Jaki tag zamyka znacznik <span>?',
    hint: 'Zacznij od znaku </',
    expectedAnswers: ['</span>', '/span'],
  },
  {
    id: 'ch-css',
    question: 'Wpisz trzyliterowy skrót języka kaskadowych arkuszy stylów:',
    hint: 'C..',
    expectedAnswers: ['css', 'CSS'],
  },
  {
    id: 'ch-word',
    question: 'Przepisz słowo AKADEMIA wielkimi literami:',
    hint: 'Dokładnie: AKADEMIA',
    expectedAnswers: ['AKADEMIA', 'akademia'],
  },
  {
    id: 'ch-first-arr',
    question: 'Co jest pierwszym elementem tablicy: ["HTML", "CSS", "JS"]?',
    hint: 'Podaj tekst w cudzysłowie lub bez',
    expectedAnswers: ['HTML', 'html', '"HTML"'],
  },
];

export const ANTI_BOT_CHALLENGES_EN: AntiBotChallenge[] = [
  {
    id: 'ch-math',
    question: 'What is 14 + 8?',
    hint: 'Enter only the number',
    expectedAnswers: ['22'],
  },
  {
    id: 'ch-tag',
    question: 'Which closing tag closes <span>?',
    hint: 'Start with </',
    expectedAnswers: ['</span>', '/span'],
  },
  {
    id: 'ch-css',
    question: 'Enter the 3-letter abbreviation for Cascading Style Sheets:',
    hint: 'C..',
    expectedAnswers: ['css', 'CSS'],
  },
  {
    id: 'ch-word',
    question: 'Type the word ACADEMY in capital letters:',
    hint: 'Exactly: ACADEMY',
    expectedAnswers: ['ACADEMY', 'academy', 'AKADEMIA', 'akademia'],
  },
  {
    id: 'ch-first-arr',
    question: 'What is the first element in the array ["HTML", "CSS", "JS"]?',
    hint: 'Enter with or without quotes',
    expectedAnswers: ['HTML', 'html', '"HTML"'],
  },
];

export interface AntiBotVerificationParams {
  challengeId: string;
  userAnswer: string;
  honeypotValue: string; // should always be empty
  sliderProgress: number; // 0 to 100, should be >= 95
  timeSpentMs: number; // should be > 1200ms
  language?: AppLanguage;
}

export interface AntiBotVerificationResult {
  isHuman: boolean;
  score: number; // 0 to 100
  reason?: string;
}

export function getLocalizedAntiBotChallengeById(
  challengeId: string,
  language: AppLanguage = 'pl'
): AntiBotChallenge | undefined {
  const pool = language === 'en' ? ANTI_BOT_CHALLENGES_EN : ANTI_BOT_CHALLENGES;
  return pool.find((c) => c.id === challengeId);
}

/**
 * Validates whether the user is a human based on multi-factor heuristics.
 */
export function verifyAntiBotSubmission(params: AntiBotVerificationParams): AntiBotVerificationResult {
  const isEn = params.language === 'en';

  // 1. Honeypot check: Bots routinely autofill all visible/hidden inputs
  if (params.honeypotValue && params.honeypotValue.trim().length > 0) {
    return {
      isHuman: false,
      score: 0,
      reason: isEn
        ? 'Automated script detected (honeypot trap).'
        : 'Wykryto automatyczny skrypt (pułapka honeypot).',
    };
  }

  // 2. Minimum interaction duration: sub-800ms registration is bot behavior
  if (params.timeSpentMs < 800) {
    return {
      isHuman: false,
      score: 10,
      reason: isEn
        ? 'Form submitted too quickly (suspected bot).'
        : 'Formularz został wysłany zbyt szybko (podejrzenie bota).',
    };
  }

  // 3. Human verification slider
  if (params.sliderProgress < 90) {
    return {
      isHuman: false,
      score: 30,
      reason: isEn
        ? 'Drag the human verification slider to the right edge.'
        : 'Przesuń suwak weryfikacji człowieka do prawej krawędzi.',
    };
  }

  // 4. Interactive challenge question
  const challenge =
    getLocalizedAntiBotChallengeById(params.challengeId, params.language || 'pl') ||
    ANTI_BOT_CHALLENGES.find((c) => c.id === params.challengeId);
  if (!challenge) {
    return {
      isHuman: false,
      score: 20,
      reason: isEn ? 'Unknown anti-bot challenge.' : 'Nieznane wyzwanie anty-bot.',
    };
  }

  const cleanAnswer = params.userAnswer.trim().toLowerCase();
  const isAnswerCorrect = challenge.expectedAnswers.some(
    (ans) => ans.trim().toLowerCase() === cleanAnswer
  );

  if (!isAnswerCorrect) {
    return {
      isHuman: false,
      score: 40,
      reason: isEn
        ? 'Incorrect answer to the anti-bot verification question.'
        : 'Niepoprawna odpowiedź na pytanie weryfikacyjne anty-bot.',
    };
  }

  // Human verified successfully
  let score = 100;
  if (params.timeSpentMs < 1500) score = 90;

  return {
    isHuman: true,
    score,
  };
}

/**
 * Pick a random anti-bot challenge
 */
export function getRandomAntiBotChallenge(language: AppLanguage = 'pl'): AntiBotChallenge {
  const pool = language === 'en' ? ANTI_BOT_CHALLENGES_EN : ANTI_BOT_CHALLENGES;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
