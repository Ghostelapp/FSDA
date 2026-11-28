import { SITE_BASE_URL } from './publicRoutes';

export type GuideCategory =
  | 'Ścieżka Kariery'
  | 'Frontend'
  | 'JavaScript & TypeScript'
  | 'Backend & Bazy Danych'
  | 'Bezpieczeństwo & DevOps';

export const GUIDE_CATEGORIES: readonly GuideCategory[] = [
  'Ścieżka Kariery',
  'Frontend',
  'JavaScript & TypeScript',
  'Backend & Bazy Danych',
  'Bezpieczeństwo & DevOps',
] as const;

export interface GuideCodeSnippet {
  title: string;
  language: string;
  code: string;
  caption?: string;
}

export interface GuideComparisonTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface GuideSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
  codeSnippet?: GuideCodeSnippet;
  table?: GuideComparisonTable;
}

export interface GuideFaqItem {
  question: string;
  answer: string;
}

export interface EditorialGuide {
  slug: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  metaDescription: string;
  category: GuideCategory;
  categoryEn: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  authorRole: string;
  level: 'Początkujący' | 'Średniozaawansowany' | 'Zaawansowany';
  levelEn: 'Beginner' | 'Intermediate' | 'Advanced';
  leadParagraphs: string[];
  sections: GuideSection[];
  keyTakeaways: string[];
  faq: GuideFaqItem[];
  relatedLessonIds: string[];
  relatedGuideSlugs: string[];
}

export function countWordsInText(text: string): number {
  const cleaned = String(text || '')
    .replace(/[`*_#<>[\](){}|/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(' ').filter((token) => token.length > 0).length;
}

export function getGuideWordCount(guide: EditorialGuide): number {
  const chunks: string[] = [
    guide.title,
    guide.subtitle,
    ...guide.leadParagraphs,
    ...guide.keyTakeaways,
  ];

  for (const section of guide.sections) {
    chunks.push(section.heading);
    chunks.push(...section.paragraphs);
    if (section.bulletPoints) {
      chunks.push(...section.bulletPoints);
    }
    if (section.codeSnippet) {
      chunks.push(section.codeSnippet.title);
      if (section.codeSnippet.caption) {
        chunks.push(section.codeSnippet.caption);
      }
    }
    if (section.table) {
      chunks.push(section.table.caption);
      chunks.push(...section.table.headers);
      for (const row of section.table.rows) {
        chunks.push(...row);
      }
    }
  }

  for (const item of guide.faq) {
    chunks.push(item.question, item.answer);
  }

  return countWordsInText(chunks.join(' '));
}

export function estimateGuideReadingMinutes(guide: EditorialGuide): number {
  const words = getGuideWordCount(guide);
  return Math.max(6, Math.round(words / 185));
}

export function filterGuides(
  guides: readonly EditorialGuide[],
  options: { category?: string; query?: string }
): EditorialGuide[] {
  const category = (options.category || 'Wszystkie').trim();
  const q = (options.query || '').trim().toLowerCase();

  return guides.filter((guide) => {
    const matchesCategory =
      !category ||
      category === 'Wszystkie' ||
      category === 'All' ||
      guide.category === category ||
      guide.categoryEn === category;

    if (!matchesCategory) return false;
    if (!q) return true;

    const searchable = [
      guide.title,
      guide.titleEn,
      guide.subtitle,
      guide.subtitleEn,
      guide.category,
      guide.categoryEn,
      guide.metaDescription,
      ...guide.leadParagraphs,
      ...guide.sections.map((s) => s.heading),
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(q);
  });
}

export function getGuideBySlug(
  guides: readonly EditorialGuide[],
  slug: string | null | undefined
): EditorialGuide | null {
  if (!slug) return null;
  const clean = slug.trim().toLowerCase();
  return guides.find((g) => g.slug.toLowerCase() === clean) || null;
}

export function buildGuideJsonLd(guide: EditorialGuide): Record<string, unknown> {
  const canonicalUrl = `${SITE_BASE_URL}/poradniki/${encodeURIComponent(guide.slug)}`;
  const wordCount = getGuideWordCount(guide);

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.metaDescription,
    inLanguage: 'pl-PL',
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    wordCount,
    articleSection: guide.category,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    author: {
      '@type': 'Organization',
      name: guide.authorName,
      url: `${SITE_BASE_URL}/o-nas`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Full Stack Developer Academy',
      url: SITE_BASE_URL,
    },
  };
}
