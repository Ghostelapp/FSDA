import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GUIDES_DATA, GUIDE_SLUGS } from '../data/guidesData';
import { MODULES_DATA } from '../data/modulesData';
import {
  GUIDE_CATEGORIES,
  buildGuideJsonLd,
  countWordsInText,
  estimateGuideReadingMinutes,
  filterGuides,
  getGuideBySlug,
  getGuideWordCount,
} from './guides';

test('GUIDES_DATA contains 13 deep, original engineering guides with valid cross-references', () => {
  assert.equal(GUIDES_DATA.length, 13);
  assert.equal(GUIDE_SLUGS.size, 13);

  const validLessonIds = new Set(MODULES_DATA.flatMap((m) => m.lessons.map((l) => l.id)));
  const validCategories = new Set<string>(GUIDE_CATEGORIES);

  for (const guide of GUIDES_DATA) {
    assert.ok(guide.slug.length >= 8, `Slug too short: ${guide.slug}`);
    assert.ok(validCategories.has(guide.category), `Invalid category ${guide.category} on ${guide.slug}`);
    assert.ok(guide.sections.length >= 3, `Guide ${guide.slug} should have at least 3 sections`);
    assert.ok(guide.keyTakeaways.length >= 3, `Guide ${guide.slug} should have at least 3 key takeaways`);
    assert.ok(guide.faq.length >= 2, `Guide ${guide.slug} should have at least 2 FAQ entries`);

    const words = getGuideWordCount(guide);
    assert.ok(words >= 1000, `Guide ${guide.slug} word count (${words}) is below 1000 words`);

    const minutes = estimateGuideReadingMinutes(guide);
    assert.ok(minutes >= 5 && minutes <= 20, `Unexpected reading minutes (${minutes}) for ${guide.slug}`);

    assert.ok(guide.relatedLessonIds.length >= 2, `Guide ${guide.slug} missing relatedLessonIds`);
    for (const lessonId of guide.relatedLessonIds) {
      assert.ok(validLessonIds.has(lessonId), `Guide ${guide.slug} references missing lesson ${lessonId}`);
    }

    assert.ok(guide.relatedGuideSlugs.length >= 1, `Guide ${guide.slug} missing relatedGuideSlugs`);
    for (const relatedSlug of guide.relatedGuideSlugs) {
      assert.notEqual(relatedSlug, guide.slug, `Guide ${guide.slug} links to itself`);
      assert.ok(GUIDE_SLUGS.has(relatedSlug), `Guide ${guide.slug} references missing guide ${relatedSlug}`);
    }
  }
});

test('countWordsInText, filterGuides, and getGuideBySlug behave accurately', () => {
  assert.equal(countWordsInText('  Hello   world\nfrom   FSDA  '), 4);
  assert.equal(countWordsInText(''), 0);

  const all = filterGuides(GUIDES_DATA, { category: 'Wszystkie', query: '' });
  assert.equal(all.length, 13);

  const backend = filterGuides(GUIDES_DATA, { category: 'Backend & Bazy Danych' });
  assert.ok(backend.length >= 2);
  assert.ok(backend.every((g) => g.category === 'Backend & Bazy Danych'));

  const sqlSearch = filterGuides(GUIDES_DATA, { query: 'PostgreSQL' });
  assert.ok(sqlSearch.some((g) => g.slug === 'postgresql-indeksy-join-optymalizacja-zapytan'));

  const matched = getGuideBySlug(GUIDES_DATA, 'javascript-event-loop-async-await-kompendium');
  assert.ok(matched);
  assert.match(matched.title, /Event Loop/i);
  assert.equal(getGuideBySlug(GUIDES_DATA, 'does-not-exist'), null);
});

test('buildGuideJsonLd generates valid TechArticle structured data', () => {
  const sample = GUIDES_DATA[0];
  const jsonLd = buildGuideJsonLd(sample);
  const mainEntity = jsonLd.mainEntityOfPage as { '@type': string; '@id': string };

  assert.equal(jsonLd['@context'], 'https://schema.org');
  assert.equal(jsonLd['@type'], 'TechArticle');
  assert.equal(jsonLd.headline, sample.title);
  assert.equal(jsonLd.inLanguage, 'pl-PL');
  assert.equal(mainEntity['@type'], 'WebPage');
  assert.equal(mainEntity['@id'], `https://fsda.tech/poradniki/${sample.slug}`);
  assert.ok(Number(jsonLd.wordCount) >= 1000);
});

test('public marketing views and AdSense banner contain no coming-soon or placeholder ad notice strings', () => {
  const landingSource = fs.readFileSync(path.resolve('src/components/LandingPageView.tsx'), 'utf8');
  assert.doesNotMatch(landingSource, /W przygotowaniu|In Development|Coming Soon|Wkrótce/);

  const adBannerSource = fs.readFileSync(path.resolve('src/components/GoogleAdSenseBanner.tsx'), 'utf8');
  assert.match(adBannerSource, /if \(!shouldRender \|\| dismissedInView \|\| !hasRealSlotUnit\)/);
  assert.doesNotMatch(adBannerSource, /kolejnym etapie|future stage|Edycja Otwarta/);
});
