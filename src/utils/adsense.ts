import { AdPlacementKey, AdSenseConfig, User } from '../types';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const env = (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env) || {};

export const DEFAULT_ADSENSE_CONFIG: AdSenseConfig = {
  enabled: true,
  clientId: env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-4030062340198648',
  slots: {
    dashboard: env.VITE_ADSENSE_SLOT_DASHBOARD || '1092837465',
    modules: env.VITE_ADSENSE_SLOT_MODULES || '2938475610',
    lesson: env.VITE_ADSENSE_SLOT_LESSON || '3847561029',
    sidebar: env.VITE_ADSENSE_SLOT_SIDEBAR || '4756102938',
    rewarded: env.VITE_ADSENSE_SLOT_REWARDED || '5610293847',
  },
  placements: {
    dashboard: true,
    modules: true,
    lesson: true,
    sidebar: true,
    rewarded: true,
  },
  showFallbackSponsorCard: true,
  rewardedCooldownSeconds: 45,
  maxDailyRewardedAds: 5,
};

/**
 * Validates Google AdSense Publisher Client ID format (ca-pub-XXXXXXXXXXXXXXXX).
 */
export function isValidAdSenseClientId(clientId: string): boolean {
  if (!clientId || typeof clientId !== 'string') return false;
  return /^ca-pub-\d{10,20}$/.test(clientId.trim());
}

/**
 * Validates Google AdSense Ad Unit Slot ID format (numeric string of 8-15 digits).
 */
export function isValidAdSenseSlotId(slotId: string): boolean {
  if (!slotId || typeof slotId !== 'string') return false;
  return /^\d{8,15}$/.test(slotId.trim());
}

/**
 * Determines whether Google AdSense ads should be displayed for the given user.
 * Rules:
 * 1. Global AdSense must be enabled in config (`config.enabled`).
 * 2. If a specific placement is checked (`placement`), that placement must be enabled.
 * 3. User must be authenticated and NOT a guest (`user.id !== 'user-guest'`).
 * 4. User must be on a FREE account (`user.isPro === false`) and NOT an administrator (`user.role !== 'admin'`).
 */
export function shouldShowAdsForUser(
  user: User | null | undefined,
  isAuthenticated: boolean,
  config: AdSenseConfig,
  placement?: AdPlacementKey
): boolean {
  if (!config.enabled) return false;
  if (placement && !config.placements[placement]) return false;
  if (!isAuthenticated || !user) return false;
  if (user.id === 'user-guest') return false;
  if (user.isPro) return false;
  if (user.role === 'admin') return false;
  return true;
}

/**
 * Checks whether a free-tier user can watch a Rewarded AdSense ad to earn +1 heart.
 */
export function checkRewardedAdEligibility(params: {
  user: User;
  config: AdSenseConfig;
  nowMs?: number;
  todayDateKey: string;
}): {
  allowed: boolean;
  secondsRemaining: number;
  watchedToday: number;
  remainingToday: number;
  reason?: string;
} {
  const { user, config, nowMs = Date.now(), todayDateKey } = params;

  if (user.isPro) {
    return {
      allowed: false,
      secondsRemaining: 0,
      watchedToday: 0,
      remainingToday: 0,
      reason: 'Konto PRO posiada nielimitowane serca bez konieczności oglądania reklam.',
    };
  }

  if (!config.enabled || !config.placements.rewarded) {
    return {
      allowed: false,
      secondsRemaining: 0,
      watchedToday: 0,
      remainingToday: 0,
      reason: 'Reklamy z nagrodą (Rewarded Ads) są obecnie wyłączone.',
    };
  }

  const watchedToday =
    user.lastAdRewardDate === todayDateKey ? Math.max(0, user.dailyAdRewardsCount || 0) : 0;
  const maxDaily = Math.max(1, config.maxDailyRewardedAds || 5);
  const remainingToday = Math.max(0, maxDaily - watchedToday);

  if (remainingToday <= 0) {
    return {
      allowed: false,
      secondsRemaining: 0,
      watchedToday,
      remainingToday: 0,
      reason: `Wykorzystano dzienny limit reklam z nagrodą (${maxDaily}/${maxDaily}). Odblokuj PRO lub wróć jutro!`,
    };
  }

  const cooldownSec = Math.max(5, config.rewardedCooldownSeconds || 45);
  if (user.lastAdRewardTimestamp) {
    const elapsedSec = Math.floor((nowMs - user.lastAdRewardTimestamp) / 1000);
    if (elapsedSec < cooldownSec) {
      const secondsRemaining = cooldownSec - elapsedSec;
      return {
        allowed: false,
        secondsRemaining,
        watchedToday,
        remainingToday,
        reason: `Odczekaj jeszcze ${secondsRemaining}s przed kolejną reklamą z nagrodą.`,
      };
    }
  }

  return {
    allowed: true,
    secondsRemaining: 0,
    watchedToday,
    remainingToday,
  };
}

/**
 * Generates standard IAB ads.txt entry for Google AdSense.
 */
export function generateAdsTxtContent(clientId: string): string {
  const cleanPubId = clientId.trim().replace(/^ca-/, '');
  return `google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0`;
}

/**
 * Generates HTML snippet for index.html <head> integration.
 */
export function generateAdSenseHeadSnippet(clientId: string): string {
  const cleanClient = clientId.trim();
  return `<meta name="google-adsense-account" content="${cleanClient}">\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanClient}" crossorigin="anonymous"></script>`;
}

/**
 * Dynamically injects Google AdSense script and meta tag into document.head
 * when a free-tier user is active. Reuses the static script from index.html if present.
 */
export function ensureAdSenseScriptLoaded(clientId: string): boolean {
  if (typeof document === 'undefined') return false;
  const cleanClient = clientId.trim();
  if (!isValidAdSenseClientId(cleanClient)) return false;

  // Ensure <meta name="google-adsense-account"> exists
  let metaTag = document.querySelector('meta[name="google-adsense-account"]') as HTMLMetaElement | null;
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.name = 'google-adsense-account';
    document.head.appendChild(metaTag);
  }
  metaTag.content = cleanClient;

  // Check if static or dynamic AdSense script tag already exists in head
  const targetSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanClient}`;
  const existingStaticOrDynamic = document.querySelector(
    'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
  ) as HTMLScriptElement | null;

  if (existingStaticOrDynamic) {
    if (existingStaticOrDynamic.src !== targetSrc) {
      existingStaticOrDynamic.src = targetSrc;
    }
    return true;
  }

  const script = document.createElement('script');
  script.id = 'google-adsense-sdk';
  script.async = true;
  script.src = targetSrc;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  return true;
}
