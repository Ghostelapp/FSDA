export type CareerTrackId = 'fullstack' | 'frontend' | 'backend';

export interface CareerTrackSpec {
  id: CareerTrackId;
  title: string;
  roleLabel: string;
  hoursRatio: number;
  juniorSalaryRangePln: string;
  midSalaryRangePln: string;
  coreStack: string;
  portfolioProjectsCount: number;
}

export interface StudyMilestone {
  phase: string;
  title: string;
  weekTarget: number;
  deliverable: string;
}

export interface StudyPlanEstimate {
  effectiveHours: number;
  estimatedWeeks: number;
  estimatedMonths: string;
  dailyMinutes: number;
  milestones: StudyMilestone[];
}

export const CAREER_TRACKS: Record<CareerTrackId, CareerTrackSpec> = {
  fullstack: {
    id: 'fullstack',
    title: 'Full Stack Engineer (Kompletna Ścieżka)',
    roleLabel: 'Junior / Regular Full Stack Developer',
    hoursRatio: 1.0,
    juniorSalaryRangePln: '7 500 – 11 500 zł',
    midSalaryRangePln: '14 000 – 21 000 zł',
    coreStack: 'HTML5 · CSS3 · TypeScript · React 19 · Node.js · PostgreSQL · Docker',
    portfolioProjectsCount: 12,
  },
  frontend: {
    id: 'frontend',
    title: 'Frontend & React Architect',
    roleLabel: 'Junior Frontend / React Developer',
    hoursRatio: 0.65,
    juniorSalaryRangePln: '6 800 – 10 200 zł',
    midSalaryRangePln: '13 000 – 18 500 zł',
    coreStack: 'HTML5 · CSS3 · JavaScript ES2026 · TypeScript · React 19 · Next.js · Playwright',
    portfolioProjectsCount: 8,
  },
  backend: {
    id: 'backend',
    title: 'Backend, SQL & DevOps Engineer',
    roleLabel: 'Junior Backend / Node.js Developer',
    hoursRatio: 0.7,
    juniorSalaryRangePln: '7 200 – 11 000 zł',
    midSalaryRangePln: '14 500 – 20 500 zł',
    coreStack: 'Node.js · Express · TypeScript · PostgreSQL · Prisma · JWT · Docker · CI/CD',
    portfolioProjectsCount: 8,
  },
};

export function calculateStudyPlanEstimate(
  totalCurriculumHours: number,
  weeklyHours: number,
  trackId: CareerTrackId = 'fullstack'
): StudyPlanEstimate {
  const safeWeekly = Math.max(3, Math.min(40, Math.round(weeklyHours)));
  const track = CAREER_TRACKS[trackId] || CAREER_TRACKS.fullstack;
  const effectiveHours = Math.max(40, Math.round(totalCurriculumHours * track.hoursRatio));
  const estimatedWeeks = Math.max(4, Math.ceil(effectiveHours / safeWeekly));
  const estimatedMonths = (estimatedWeeks / 4.3).toFixed(1);
  const dailyMinutes = Math.max(15, Math.round((safeWeekly * 60) / 7));

  const w1 = Math.max(1, Math.round(estimatedWeeks * 0.25));
  const w2 = Math.max(w1 + 1, Math.round(estimatedWeeks * 0.55));
  const w3 = Math.max(w2 + 1, Math.round(estimatedWeeks * 0.85));

  const milestones: StudyMilestone[] = [
    {
      phase: 'Etap 01',
      title: 'Fundamenty Web & Interaktywny UI',
      weekTarget: w1,
      deliverable: 'Pierwsze 3 responsywne strony w HTML5, CSS Flexbox/Grid i JavaScript',
    },
    {
      phase: 'Etap 02',
      title: 'Aplikacje SPA w TypeScript i React 19',
      weekTarget: w2,
      deliverable: 'Aplikacja kliencka z routingiem, hookami i integracją REST API',
    },
    {
      phase: 'Etap 03',
      title: 'Backend Node.js, Relacyjny SQL i Autoryzacja JWT',
      weekTarget: w3,
      deliverable: 'Pełny serwer API z bazą PostgreSQL, testami i konteneryzacją Docker',
    },
    {
      phase: 'Etap 04',
      title: 'Obrona Portfolio, Certyfikat SHA-256 i Rekrutacja',
      weekTarget: estimatedWeeks,
      deliverable: 'Gotowe konto GitHub, CV w standardzie ATS oraz symulacja Live Coding',
    },
  ];

  return {
    effectiveHours,
    estimatedWeeks,
    estimatedMonths,
    dailyMinutes,
    milestones,
  };
}
