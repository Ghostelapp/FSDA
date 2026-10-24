export type UserRole = 'student' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending_verification' | 'banned';

export interface DailyReminderSettings {
  enabled: boolean;
  reminderTime: string; // "HH:MM" in 24h format, e.g., "18:00"
  dailyGoalMinutes: number; // e.g., 30
  daysOfWeek: number[]; // 0 (Sunday) to 6 (Saturday)
  streakProtectionAlert: boolean;
  lastNotifiedDate?: string; // "YYYY-MM-DD"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  weeklyGoalMinutes: number;
  weeklySpentMinutes: number;
  dailyGoalMinutes?: number;
  todaySpentMinutes?: number;
  lastGoalDate?: string;
  reminderSettings?: DailyReminderSettings;
  completedLessons: string[]; // lesson IDs
  completedProjects: string[]; // project IDs
  quizScores: Record<string, number>; // lessonId -> percentage score
  unlockedBadges: string[]; // badge IDs
  claimedRewards?: string[]; // unique reward IDs to prevent duplicate XP farming
  savedCode: Record<string, { html: string; css: string; js: string }>; // exerciseId -> code
  // Gamification & Subscription
  lives: number; // current hearts (0 to maxLives)
  maxLives: number; // default 5
  lastHeartLostTimestamp?: number; // epoch ms of last lost life for timer regeneration
  isPro: boolean; // whether user has active PRO subscription (unlimited lives, etc.)
  proPlan?: 'monthly' | 'yearly' | 'lifetime' | null;
  proExpiresAt?: string;
  streakFreezes: number; // shields protecting streak from resetting
  // Account Status & Anti-Bot Protection
  status: UserStatus;
  banReason?: string;
  antiBotVerified: boolean;
  antiBotScore?: number; // 0 - 100
  password?: string;
  bio?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserFilters {
  searchQuery: string;
  role: 'all' | UserRole;
  proStatus: 'all' | 'pro' | 'free';
  status: 'all' | UserStatus;
  livesStatus: 'all' | 'zero' | 'partial' | 'full';
  sortBy: 'xp_desc' | 'xp_asc' | 'streak_desc' | 'created_desc' | 'name_asc' | 'lessons_desc';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface TestRule {
  description: string;
  check: (html: string, css: string, js: string) => boolean;
}

export interface InteractiveExercise {
  id: string;
  title: string;
  instructions: string;
  task: string;
  starterCode: {
    html: string;
    css: string;
    js: string;
  };
  solutionCode: {
    html: string;
    css: string;
    js: string;
  };
  hints: string[];
  rules: {
    id: string;
    description: string;
    // Serialized rule check type for robust execution
    ruleType: 'html_contains' | 'html_tag_exists' | 'html_attr_exists' | 'css_contains' | 'js_contains';
    target: string;
    param?: string;
  }[];
}

export interface CommonMistake {
  mistake: string;
  whyItHappens: string;
  howToFix: string;
  badCode: string;
  goodCode: string;
}

export interface Lesson {
  id: string;
  moduleId: number;
  moduleTitle: string;
  title: string;
  slug: string;
  durationMinutes: number;
  xpReward: number;
  order: number;
  summary: string;
  // 10-part pedagogical structure
  objectives: string[];
  prerequisites: string[];
  theoryMarkdown: string;
  codeExamples: {
    title: string;
    language: 'html' | 'css' | 'javascript' | 'typescript' | 'tsx' | 'jsx' | 'sql' | 'bash' | 'markdown' | 'json' | 'prisma';
    code: string;
    explanation: string;
  }[];
  stepByStepGuide: {
    step: number;
    title: string;
    description: string;
    codeSnippet?: string;
  }[];
  interactiveExercise: InteractiveExercise;
  independentTask: {
    title: string;
    instructions: string;
    expectedOutcome: string;
    starterHint: string;
  };
  quiz: QuizQuestion[];
  commonMistakes: CommonMistake[];
  practicalTask: {
    title: string;
    brief: string;
    instructions?: string;
    steps: string[];
    deliverable: string;
  };
  completionCriteria: string[];
}

export interface Module {
  id: number;
  title: string;
  category: 'Podstawy' | 'Frontend' | 'Backend' | 'Bazy danych' | 'DevOps & Bezpieczeństwo' | 'Kariera';
  description: string;
  badgeName: string;
  badgeIcon: string;
  durationHours: number;
  totalXp: number;
  prerequisites: string[];
  topics: string[];
  projectBrief?: string;
  lessons: Lesson[];
}

export interface ProjectStage {
  stage: number;
  title: string;
  description: string;
  tasks: string[];
}

export interface Project {
  id: string;
  number: number;
  title: string;
  category: string;
  difficulty: 'Początkujący' | 'Średniozaawansowany' | 'Zaawansowany' | 'Ekspert';
  estimatedHours: number;
  xpReward: number;
  description: string;
  technologies: string[];
  requirements: string[];
  fileStructure: string[];
  stages: ProjectStage[];
  acceptanceTests: string[];
  deployInstructions: string[];
  starterCode?: {
    html: string;
    css: string;
    js: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'skill' | 'streak' | 'project';
  xpBonus: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Kurs' | 'Wydarzenie' | 'Aktualizacja' | 'Porada';
  author: string;
}

export interface ReviewItem {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  quizScore: number;
  lastAttempt: string;
  keyTopics: string[];
}
