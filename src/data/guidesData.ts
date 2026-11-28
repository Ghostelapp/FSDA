import { EditorialGuide } from '../utils/guides';
import { GUIDES_PART_1 } from './guidesPart1';
import { GUIDES_PART_2 } from './guidesPart2';

export const GUIDES_DATA: EditorialGuide[] = [
  ...GUIDES_PART_1,
  ...GUIDES_PART_2,
];

export const GUIDE_SLUGS = new Set(GUIDES_DATA.map((g) => g.slug));
