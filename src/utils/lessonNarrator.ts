import { Lesson } from '../types';
import { AppLanguage } from './i18n';
import {
  BeginnerLessonAid,
  groupTheoryBlocksIntoSections,
  parseTheoryBlocks,
} from './lessonReadability';

export type NarrationSegmentKind =
  | 'intro'
  | 'analogy'
  | 'glossary'
  | 'theory'
  | 'mistakes';

export interface NarrationSegment {
  id: string;
  title: string;
  kind: NarrationSegmentKind;
  text: string;
  estimatedSeconds: number;
}

export interface VoiceDescriptor {
  voiceURI: string;
  name: string;
  lang: string;
  localService?: boolean;
  default?: boolean;
}

export interface NarratorPreferences {
  rate: number;
  voiceURIByLang: Partial<Record<AppLanguage, string>>;
}

export const NARRATION_RATES = [0.85, 1, 1.15, 1.25, 1.5] as const;
export const NARRATION_PREFS_STORAGE_KEY = 'fsda_narrator_prefs_v1';

const DEFAULT_WORDS_PER_MINUTE = 148;

/**
 * Cleans markdown, inline code, HTML tags, and decorative symbols into natural
 * spoken prose suitable for Web Speech API narration (Polish & English).
 */
export function cleanTextForNarration(raw: string, language: AppLanguage): string {
  if (!raw || !raw.trim()) return '';

  const isEn = language === 'en';
  let text = raw;

  // Remove fenced code blocks completely so the narrator doesn't read raw code noise
  text = text.replace(/```[\s\S]*?```/g, ' ');

  // Convert markdown links [label](url) -> label
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove markdown heading/list/blockquote markers at line starts
  text = text.replace(/^\s{0,3}(?:#{1,6}\s+|>\s*|[-*+]\s+)/gm, '');

  // Convert closing HTML tags like </p> or </h1> into spoken form
  text = text.replace(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g, (_m, tag: string) =>
    isEn ? ` closing ${tag} tag ` : ` znacznik zamykający ${tag} `
  );

  // Convert opening/self-closing HTML tags like <h1>, <input type="text">, <br/>
  text = text.replace(/<([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?\/?>/g, (_m, tag: string) =>
    isEn ? ` ${tag} tag ` : ` znacznik ${tag} `
  );

  // Strip inline backticks, bold/italic markers
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');

  // Replace technical arrows and pipe separators with natural pauses
  text = text.replace(/\s*(?:=>|->|→|↔|➜)\s*/g, ', ');
  text = text.replace(/\s*\|\s*/g, ', ');
  text = text.replace(/[•·]/g, ', ');

  // Remove decorative emojis / pictographs that some TTS engines spell out awkwardly
  text = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ');

  // Normalize whitespace and duplicate punctuation
  text = text.replace(/\r?\n+/g, '. ');
  text = text.replace(/\s+/g, ' ').trim();
  text = text.replace(/([.!?])\s*[.,]+/g, '$1');
  text = text.replace(/,\s*,+/g, ',');
  text = text.replace(/\s+([.,!?;:])/g, '$1');
  text = text.replace(/^[,.\s]+/, '').trim();

  if (text && !/[.!?]$/.test(text)) {
    text += '.';
  }

  return text;
}

/**
 * Estimates narration length in seconds for a spoken string at a given speed rate.
 */
export function estimateNarrationDurationSeconds(text: string, rate = 1): number {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words === 0) return 0;
  const safeRate = Number.isFinite(rate) && rate > 0.25 ? rate : 1;
  return Math.max(2, Math.round(((words / DEFAULT_WORDS_PER_MINUTE) * 60) / safeRate));
}

/**
 * Formats a duration in seconds into `m:ss` (e.g. `3:08`).
 */
export function formatNarrationTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(Number.isFinite(totalSeconds) ? totalSeconds : 0));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Builds a structured, chapter-by-chapter audio narration script for any lesson.
 * Skips code blocks and converts markdown/HTML syntax into smooth natural speech.
 */
export function buildLessonNarrationScript(
  lesson: Lesson,
  beginnerAid: BeginnerLessonAid,
  language: AppLanguage
): NarrationSegment[] {
  const isEn = language === 'en';
  const segments: NarrationSegment[] = [];

  // 1. Intro + Summary + Objectives
  const introParts: string[] = [
    cleanTextForNarration(lesson.title, language),
    cleanTextForNarration(lesson.summary, language),
  ].filter(Boolean);

  if (lesson.objectives && lesson.objectives.length > 0) {
    const objPrefix = isEn
      ? 'In this lesson you will learn:'
      : 'W tej lekcji nauczysz się:';
    const objItems = lesson.objectives
      .map((obj) => cleanTextForNarration(obj, language))
      .filter(Boolean)
      .join(' ');
    if (objItems) {
      introParts.push(`${objPrefix} ${objItems}`);
    }
  }

  const introText = introParts.join(' ').trim();
  if (introText) {
    segments.push({
      id: 'intro',
      title: isEn ? 'Introduction & goals' : 'Wprowadzenie i cele',
      kind: 'intro',
      text: introText,
      estimatedSeconds: estimateNarrationDurationSeconds(introText),
    });
  }

  // 2. Everyday life analogy
  const analogyParts = [
    isEn ? 'Everyday life analogy.' : 'Analogia z życia codziennego.',
    cleanTextForNarration(beginnerAid.analogyTitle, language),
    cleanTextForNarration(beginnerAid.analogyText, language),
  ].filter(Boolean);
  const analogyText = analogyParts.join(' ').trim();
  if (analogyText) {
    segments.push({
      id: 'analogy',
      title: isEn ? 'Everyday analogy' : 'Analogia z życia',
      kind: 'analogy',
      text: analogyText,
      estimatedSeconds: estimateNarrationDurationSeconds(analogyText),
    });
  }

  // 3. Key terms glossary
  if (beginnerAid.glossary && beginnerAid.glossary.length > 0) {
    const glossaryItems = beginnerAid.glossary
      .map((item) => {
        const term = cleanTextForNarration(item.term, language).replace(/\.$/, '');
        const def = cleanTextForNarration(item.simpleDefinition, language);
        if (!term || !def) return '';
        return `${term}: ${def}`;
      })
      .filter(Boolean);

    if (glossaryItems.length > 0) {
      const glossaryPrefix = isEn ? 'Key terms in this lesson.' : 'Słowniczek pojęć z tej lekcji.';
      const glossaryText = `${glossaryPrefix} ${glossaryItems.join(' ')}`.trim();
      segments.push({
        id: 'glossary',
        title: isEn ? 'Key terms glossary' : 'Słowniczek pojęć',
        kind: 'glossary',
        text: glossaryText,
        estimatedSeconds: estimateNarrationDurationSeconds(glossaryText),
      });
    }
  }

  // 4. Theory sections (grouped cleanly, skipping raw code blocks)
  const theoryBlocks = parseTheoryBlocks(lesson.theoryMarkdown || '');
  const theorySections = groupTheoryBlocksIntoSections(
    theoryBlocks,
    isEn ? 'Key Concepts' : 'Kluczowe zagadnienia'
  );

  theorySections.forEach((section, idx) => {
    const sectionParts: string[] = [];
    const cleanTitle = cleanTextForNarration(section.title, language);
    if (cleanTitle) {
      sectionParts.push(cleanTitle);
    }

    for (const block of section.blocks) {
      if (block.type === 'paragraph') {
        const rawParagraph = block.tokens.map((t) => t.content).join('');
        const cleaned = cleanTextForNarration(rawParagraph, language);
        if (cleaned) sectionParts.push(cleaned);
      } else if (block.type === 'ordered_list') {
        for (const item of block.items) {
          const titlePart = item.title ? item.title.map((t) => t.content).join('') : '';
          const bodyPart = item.body.map((t) => t.content).join('');
          const combined = [titlePart, bodyPart].filter(Boolean).join(': ');
          const cleaned = cleanTextForNarration(combined, language);
          if (cleaned) sectionParts.push(cleaned);
        }
      } else if (block.type === 'unordered_list') {
        for (const itemTokens of block.items) {
          const rawItem = itemTokens.map((t) => t.content).join('');
          const cleaned = cleanTextForNarration(rawItem, language);
          if (cleaned) sectionParts.push(cleaned);
        }
      }
      // Note: 'code_block' is intentionally omitted so the narrator skips raw syntax
    }

    const sectionText = sectionParts.join(' ').trim();
    if (sectionText) {
      const shortTitle =
        section.title.replace(/`+/g, '').replace(/\*\*+/g, '').trim() ||
        (isEn ? `Part ${idx + 1}` : `Część ${idx + 1}`);
      segments.push({
        id: `theory-${section.id || idx + 1}`,
        title: shortTitle,
        kind: 'theory',
        text: sectionText,
        estimatedSeconds: estimateNarrationDurationSeconds(sectionText),
      });
    }
  });

  // 5. Common mistakes recap
  if (lesson.commonMistakes && lesson.commonMistakes.length > 0) {
    const mistakeItems = lesson.commonMistakes
      .map((m) => {
        const title = cleanTextForNarration(m.mistake, language);
        const reason = cleanTextForNarration(m.whyItHappens, language);
        const fix = cleanTextForNarration(m.howToFix, language);
        return [title, reason, fix].filter(Boolean).join(' ');
      })
      .filter(Boolean);

    if (mistakeItems.length > 0) {
      const prefix = isEn
        ? 'Watch out for these common mistakes.'
        : 'Uważaj na te najczęstsze błędy.';
      const mistakesText = `${prefix} ${mistakeItems.join(' ')}`.trim();
      segments.push({
        id: 'mistakes',
        title: isEn ? 'Common mistakes' : 'Najczęstsze błędy',
        kind: 'mistakes',
        text: mistakesText,
        estimatedSeconds: estimateNarrationDurationSeconds(mistakesText),
      });
    }
  }

  return segments;
}

/**
 * Splits a narration segment into <= maxChars chunks at natural sentence boundaries.
 * Prevents Chrome/Android Web Speech API from truncating long utterances.
 */
export function splitSegmentIntoSpeechChunks(text: string, maxChars = 220): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  // Split by sentence terminators while keeping punctuation attached
  const sentences = normalized.match(/[^.!?]+(?:[.!?]+|$)/g) || [normalized];
  const chunks: string[] = [];
  let current = '';

  const flush = () => {
    const trimmed = current.trim();
    if (trimmed) chunks.push(trimmed);
    current = '';
  };

  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim();
    if (!sentence) continue;

    if (sentence.length > maxChars) {
      // Flush current buffer, then split overly long sentence by commas/spaces
      flush();
      const words = sentence.split(/\s+/);
      let piece = '';
      for (const word of words) {
        if (!piece) {
          piece = word;
        } else if (piece.length + 1 + word.length <= maxChars) {
          piece += ` ${word}`;
        } else {
          chunks.push(piece);
          piece = word;
        }
      }
      if (piece) chunks.push(piece);
      continue;
    }

    if (!current) {
      current = sentence;
    } else if (current.length + 1 + sentence.length <= maxChars) {
      current += ` ${sentence}`;
    } else {
      flush();
      current = sentence;
    }
  }

  flush();
  return chunks;
}

/**
 * Filters browser voices matching the active app language ('pl' or 'en').
 */
export function filterVoicesForLanguage<T extends VoiceDescriptor>(
  voices: T[],
  language: AppLanguage
): T[] {
  const prefix = language === 'en' ? 'en' : 'pl';
  return voices.filter((v) => (v.lang || '').toLowerCase().startsWith(prefix));
}

function scoreVoiceQuality(voice: VoiceDescriptor, language: AppLanguage): number {
  const name = (voice.name || '').toLowerCase();
  const lang = (voice.lang || '').toLowerCase();
  let score = 0;

  // Exact locale preference
  if (language === 'pl' && (lang === 'pl-pl' || lang === 'pl_pl')) score += 30;
  if (language === 'en' && (lang === 'en-us' || lang === 'en-gb')) score += 30;

  // High-quality neural / online voices in Edge, Chrome, Safari, Android
  if (name.includes('natural')) score += 60;
  if (name.includes('neural')) score += 55;
  if (name.includes('online')) score += 45;
  if (name.includes('google')) score += 40;
  if (name.includes('microsoft')) score += 30;
  if (
    language === 'pl' &&
    (name.includes('zosia') || name.includes('marek') || name.includes('paulina') || name.includes('agnieszka'))
  ) {
    score += 25;
  }
  if (
    language === 'en' &&
    (name.includes('samantha') || name.includes('aria') || name.includes('jenny') || name.includes('guy') || name.includes('daniel'))
  ) {
    score += 25;
  }
  if (voice.default) score += 5;

  return score;
}

/**
 * Picks the highest-quality available SpeechSynthesis voice for the given language,
 * honoring the user's saved voiceURI if it still exists and matches the language.
 */
export function selectBestSpeechVoice<T extends VoiceDescriptor>(
  voices: T[],
  language: AppLanguage,
  preferredVoiceURI?: string | null
): T | null {
  if (!voices || voices.length === 0) return null;

  const matching = filterVoicesForLanguage(voices, language);
  if (matching.length === 0) return null;

  if (preferredVoiceURI) {
    const preferred = matching.find((v) => v.voiceURI === preferredVoiceURI);
    if (preferred) return preferred;
  }

  return [...matching].sort(
    (a, b) => scoreVoiceQuality(b, language) - scoreVoiceQuality(a, language)
  )[0];
}

export function loadNarratorPreferences(): NarratorPreferences {
  const fallback: NarratorPreferences = { rate: 1, voiceURIByLang: {} };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(NARRATION_PREFS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<NarratorPreferences>;
    const rate =
      typeof parsed.rate === 'number' &&
      (NARRATION_RATES as readonly number[]).includes(parsed.rate)
        ? parsed.rate
        : 1;
    const voiceURIByLang =
      parsed.voiceURIByLang && typeof parsed.voiceURIByLang === 'object'
        ? parsed.voiceURIByLang
        : {};
    return { rate, voiceURIByLang };
  } catch {
    return fallback;
  }
}

export function saveNarratorPreferences(prefs: NarratorPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(NARRATION_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota errors
  }
}
