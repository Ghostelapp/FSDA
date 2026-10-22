/**
 * Anti-Bot (Anybot) Security & Human Verification Utilities
 */

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

export interface AntiBotVerificationParams {
  challengeId: string;
  userAnswer: string;
  honeypotValue: string; // should always be empty
  sliderProgress: number; // 0 to 100, should be >= 95
  timeSpentMs: number; // should be > 1200ms
}

export interface AntiBotVerificationResult {
  isHuman: boolean;
  score: number; // 0 to 100
  reason?: string;
}

/**
 * Validates whether the user is a human based on multi-factor heuristics.
 */
export function verifyAntiBotSubmission(params: AntiBotVerificationParams): AntiBotVerificationResult {
  // 1. Honeypot check: Bots routinely autofill all visible/hidden inputs
  if (params.honeypotValue && params.honeypotValue.trim().length > 0) {
    return {
      isHuman: false,
      score: 0,
      reason: 'Wykryto automatyczny skrypt (pułapka honeypot).',
    };
  }

  // 2. Minimum interaction duration: sub-800ms registration is bot behavior
  if (params.timeSpentMs < 800) {
    return {
      isHuman: false,
      score: 10,
      reason: 'Formularz został wysłany zbyt szybko (podejrzenie bota).',
    };
  }

  // 3. Human verification slider
  if (params.sliderProgress < 90) {
    return {
      isHuman: false,
      score: 30,
      reason: 'Przesuń suwak weryfikacji człowieka do prawej krawędzi.',
    };
  }

  // 4. Interactive challenge question
  const challenge = ANTI_BOT_CHALLENGES.find((c) => c.id === params.challengeId);
  if (!challenge) {
    return {
      isHuman: false,
      score: 20,
      reason: 'Nieznane wyzwanie anty-bot.',
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
      reason: 'Niepoprawna odpowiedź na pytanie weryfikacyjne anty-bot.',
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
export function getRandomAntiBotChallenge(): AntiBotChallenge {
  const index = Math.floor(Math.random() * ANTI_BOT_CHALLENGES.length);
  return ANTI_BOT_CHALLENGES[index];
}
