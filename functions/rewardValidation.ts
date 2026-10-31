import {
  API_MISSIONS,
  DAILY_CHALLENGES,
  FLASHCARDS_DECK,
  SQL_MISSIONS,
  checkApiMissionCompleted,
  executeSimulatedRequest,
  validateSqlQuerySyntax,
  type ApiRequestInput,
  type HttpMethod,
} from '../src/utils/developerSimulators';

const rewardAmounts = new Map<string, number>([
  ...API_MISSIONS.map((mission) => [`api-${mission.id}`, mission.xpReward] as const),
  ...DAILY_CHALLENGES.map((challenge) => [`daily-${challenge.id}`, challenge.xpReward] as const),
  ...SQL_MISSIONS.map((mission) => [`sql-mission-${mission.id}`, mission.xpReward] as const),
  ...[
    ['terminal-mission-m-1', 40],
    ['terminal-mission-m-2', 40],
    ['terminal-mission-m-3', 50],
    ['terminal-mission-m-4', 50],
    ['terminal-mission-m-5', 60],
    ['interview-task-brackets', 80],
    ['interview-task-groupby', 90],
    ['interview-task-debounce', 100],
  ] as const,
]);

const interviewSolutions = new Map<string, string>([
  ['interview-task-brackets', `function isValidBrackets(str) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of str) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (char === ')' || char === '}' || char === ']') {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`],
  ['interview-task-groupby', `function groupSpendingByPlan(orders) {
  return orders.reduce((acc, order) => {
    acc[order.plan] = (acc[order.plan] || 0) + order.amount;
    return acc;
  }, {});
}`],
  ['interview-task-debounce', `function debounce(fn, delayMs) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}`],
]);

export const TERMINAL_MISSION_REQUIREMENTS: Record<string, { pattern: RegExp; requires: string[] }> = {
  'terminal-mission-m-1': { pattern: /^git\s+init(?:\s+.*)?$/i, requires: [] },
  'terminal-mission-m-2': { pattern: /^git\s+add\s+(?:\.|\*|-A)$/i, requires: ['terminal-mission-m-1'] },
  'terminal-mission-m-3': {
    pattern: /^git\s+commit\s+-m\s+["'].*["']$/i,
    requires: ['terminal-mission-m-1', 'terminal-mission-m-2'],
  },
  'terminal-mission-m-4': {
    pattern: /^git\s+(?:checkout\s+-b|switch\s+-c)\s+feature\/auth$/i,
    requires: ['terminal-mission-m-1'],
  },
  'terminal-mission-m-5': { pattern: /^npm\s+(?:test|run\s+test)$/i, requires: [] },
};

export function isValidPracticeAnswers(answers: unknown): boolean {
  return Array.isArray(answers) && JSON.stringify(answers) === JSON.stringify([0, 0, 1]);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export function getVerifiedActivityRewardAmount(
  rewardId: unknown,
  proofInput: unknown,
  today: string
): number | null {
  if (typeof rewardId !== 'string') return null;
  const proof = asRecord(proofInput) || {};

  if (rewardId === `flashcards-${today}`) {
    const cardIds = proof.cardIds;
    const deckIds = new Set(FLASHCARDS_DECK.map((card) => card.id));
    if (
      !Array.isArray(cardIds) || cardIds.length < 3 || new Set(cardIds).size !== cardIds.length ||
      cardIds.some((cardId) => typeof cardId !== 'string' || !deckIds.has(cardId))
    ) return null;
    return 25;
  }

  if (rewardId.startsWith('api-')) {
    const mission = API_MISSIONS.find((item) => `api-${item.id}` === rewardId);
    const method = proof.method;
    const endpoint = proof.endpoint;
    const headers = asRecord(proof.headers);
    const bodyRaw = proof.bodyRaw;
    if (
      !mission || typeof method !== 'string' || !['GET', 'POST', 'PUT', 'DELETE'].includes(method) ||
      typeof endpoint !== 'string' || endpoint.length > 500 ||
      !headers || typeof bodyRaw !== 'string' || bodyRaw.length > 10_000
    ) return null;
    const input: ApiRequestInput = {
      method: method as HttpMethod,
      endpoint,
      headers: headers as Record<string, string>,
      bodyRaw,
    };
    return checkApiMissionCompleted(mission, input, executeSimulatedRequest(input)) ? mission.xpReward : null;
  }

  if (rewardId.startsWith('daily-')) {
    const challenge = DAILY_CHALLENGES.find((item) => `daily-${item.id}` === rewardId);
    const code = proof.code;
    return challenge && typeof code === 'string' && code.length <= 20_000 && code.trim() === challenge.solutionCode.trim()
      ? challenge.xpReward
      : null;
  }

  if (rewardId.startsWith('sql-mission-')) {
    const mission = SQL_MISSIONS.find((item) => `sql-mission-${item.id}` === rewardId);
    const query = proof.query;
    if (typeof query !== 'string' || query.length > 2_000 || !mission) return null;
    const syntax = validateSqlQuerySyntax(query);
    return syntax.valid && mission.checkQuery(syntax.cleanQuery, 1) ? mission.xpReward : null;
  }

  if (rewardId.startsWith('terminal-mission-')) {
    const mission = TERMINAL_MISSION_REQUIREMENTS[rewardId];
    const command = proof.command;
    return mission && typeof command === 'string' && command.length <= 200 && mission.pattern.test(command.trim())
      ? rewardAmounts.get(rewardId) || null
      : null;
  }

  if (rewardId.startsWith('interview-')) {
    const solution = interviewSolutions.get(rewardId);
    const code = proof.code;
    return solution && typeof code === 'string' && code.length <= 20_000 && code.trim() === solution.trim()
      ? rewardAmounts.get(rewardId) || null
      : null;
  }

  return null;
}