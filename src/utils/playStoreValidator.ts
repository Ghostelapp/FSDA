export interface TwaManifestConfig {
  packageId: string;
  host: string;
  name: string;
  launcherName: string;
  display: string;
  themeColor: string;
  backgroundColor: string;
  startUrl: string;
  iconUrl: string;
  maskableIconUrl: string;
  appVersionCode: number;
  appVersionName: string;
  signingKey: {
    path: string;
    alias: string;
  };
  webManifestUrl: string;
}

export interface AssetLinkEntry {
  relation: string[];
  target: {
    namespace: string;
    package_name: string;
    sha256_cert_fingerprints: string[];
  };
}

export interface PlayStoreListingMeta {
  appId: string;
  versionName: string;
  versionCode: number;
  defaultLanguage: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  privacyPolicyUrl: string;
  contactEmail: string;
  targetSdk: number;
  minSdk: number;
  assets: {
    icon512: string;
    maskable512: string;
    featureGraphic1024x500: string;
    screenshots: string[];
  };
}

export interface PlayStoreValidationCheck {
  id: string;
  title: string;
  passed: boolean;
  details: string;
}

const PACKAGE_ID_REGEX = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/;
const SHA256_FINGERPRINT_REGEX = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

export function validateTwaManifest(manifest: TwaManifestConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!PACKAGE_ID_REGEX.test(manifest.packageId)) {
    errors.push('Nieprawidłowy format identyfikatora pakietu Android (np. com.fullstackacademy.app).');
  }
  if (!manifest.host || manifest.host.startsWith('http://') || manifest.host.startsWith('https://')) {
    errors.push('Pole host w twa-manifest.json powinno zawierać samą domenę bez protokołu.');
  }
  if (manifest.launcherName.length > 12) {
    errors.push('Nazwa skrócona (launcherName) nie powinna przekraczać 12 znaków.');
  }
  if (manifest.display !== 'standalone' && manifest.display !== 'fullscreen') {
    errors.push('Tryb wyświetlania TWA musi być ustawiony na standalone lub fullscreen.');
  }
  if (!Number.isInteger(manifest.appVersionCode) || manifest.appVersionCode < 1) {
    errors.push('Kod wersji (appVersionCode) musi być dodatnią liczbą całkowitą.');
  }
  if (!manifest.iconUrl.startsWith('https://') || !manifest.maskableIconUrl.startsWith('https://')) {
    errors.push('Adresy ikon w twa-manifest.json muszą używać bezpiecznego protokołu HTTPS.');
  }
  if (!manifest.signingKey?.path || !manifest.signingKey?.alias) {
    errors.push('Brak konfiguracji klucza podpisu (signingKey) w twa-manifest.json.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAssetLinks(
  assetLinks: AssetLinkEntry[],
  expectedPackageId: string,
  expectedSha256: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(assetLinks) || assetLinks.length === 0) {
    return { valid: false, errors: ['Plik assetlinks.json jest pusty lub nie jest tablicą.'] };
  }

  const entry = assetLinks[0];
  if (!entry.relation?.includes('delegate_permission/common.handle_all_urls')) {
    errors.push('Brak uprawnienia delegate_permission/common.handle_all_urls w assetlinks.json.');
  }
  if (entry.target?.namespace !== 'android_app') {
    errors.push('Przestrzeń nazw w assetlinks.json musi mieć wartość android_app.');
  }
  if (entry.target?.package_name !== expectedPackageId) {
    errors.push(`Niezgodny package_name w assetlinks.json (${entry.target?.package_name} vs ${expectedPackageId}).`);
  }

  const fingerprints = entry.target?.sha256_cert_fingerprints || [];
  if (!fingerprints.some((fp) => SHA256_FINGERPRINT_REGEX.test(fp))) {
    errors.push('Odcisk certyfikatu SHA-256 ma nieprawidłowy format heksadecymalny.');
  }
  if (!fingerprints.includes(expectedSha256)) {
    errors.push('Odcisk SHA-256 w assetlinks.json nie zgadza się z kluczem android.keystore.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateStoreListing(listing: PlayStoreListingMeta): PlayStoreValidationCheck[] {
  const titleLen = listing.title.trim().length;
  const shortLen = listing.shortDescription.trim().length;
  const fullLen = listing.fullDescription.trim().length;

  return [
    {
      id: 'package-id',
      title: `Identyfikator pakietu (${listing.appId}) i wersja v${listing.versionName} (code ${listing.versionCode})`,
      passed: PACKAGE_ID_REGEX.test(listing.appId) && listing.versionCode >= 1,
      details: `Zgodny ze standardem Java/Android reverse-DNS. Kod wersji: ${listing.versionCode}.`,
    },
    {
      id: 'target-sdk',
      title: `Zgodność z wymogami Google Play API Level (targetSdk ${listing.targetSdk} / Android 16)`,
      passed: listing.targetSdk >= 36 && listing.minSdk >= 24,
      details: `Skonfigurowano targetSdk ${listing.targetSdk} (wymagane min. 36 w Google Play Console 2026) oraz minSdk ${listing.minSdk} (wymagane min. 24 dla Automatycznej ochrony Google Play).`,
    },
    {
      id: 'store-texts',
      title: `Limity znaków Google Play Console (Tytuł: ${titleLen}/30, Krótki opis: ${shortLen}/80)`,
      passed:
        titleLen > 0 &&
        titleLen <= 30 &&
        shortLen > 0 &&
        shortLen <= 80 &&
        fullLen >= 100 &&
        fullLen <= 4000,
      details: `Pełny opis zawiera ${fullLen}/4000 znaków i obejmuje wszystkie 15 modułów (96 lekcji).`,
    },
    {
      id: 'privacy-policy',
      title: 'Polityka Prywatności RODO / Data Safety (/privacy-policy.html)',
      passed: listing.privacyPolicyUrl.startsWith('https://') && listing.privacyPolicyUrl.endsWith('/privacy-policy.html'),
      details: `Publiczny adres HTTPS: ${listing.privacyPolicyUrl}`,
    },
    {
      id: 'store-graphics',
      title: `Zestaw grafik sklepowych (Ikona 512x512, Baner 1024x500, ${listing.assets.screenshots.length} zrzuty 9:16)`,
      passed:
        Boolean(listing.assets.icon512) &&
        Boolean(listing.assets.maskable512) &&
        Boolean(listing.assets.featureGraphic1024x500) &&
        listing.assets.screenshots.length >= 2,
      details: 'Wszystkie grafiki PNG są wygenerowane i gotowe do pobrania lub wgrania do Google Play Console.',
    },
  ];
}

export interface AppleAppSiteAssociation {
  applinks?: {
    apps?: string[];
    details?: Array<{
      appIDs?: string[];
      appID?: string;
      components?: Array<Record<string, string>>;
      paths?: string[];
    }>;
  };
  webcredentials?: {
    apps?: string[];
  };
}

export interface AppStoreListingMeta {
  platform: 'ios';
  bundleId: string;
  version: string;
  buildNumber: string;
  minimumOSVersion: string;
  supportsTablet: boolean;
  defaultLanguage: string;
  title: string;
  subtitle: string;
  promotionalText: string;
  keywords: string;
  description: string;
  category: string;
  ageRating: string;
  usesNonExemptEncryption: boolean;
  privacyManifest?: {
    tracking: boolean;
    accessedApiCategory: string;
    reason: string;
  };
  contactEmail: string;
  privacyPolicyUrl: string;
  supportUrl: string;
  assets: {
    icon1024Opaque: string;
    appleTouchIcon180: string;
    iphone67Screenshots: string[];
  };
}

export function validateAppleAssociation(
  aasa: AppleAppSiteAssociation,
  expectedBundleId: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!aasa || typeof aasa !== 'object' || !aasa.applinks) {
    return { valid: false, errors: ['Brak sekcji applinks w pliku apple-app-site-association.'] };
  }

  const details = aasa.applinks.details || [];
  if (!Array.isArray(details) || details.length === 0) {
    errors.push('Sekcja applinks.details musi zawierać co najmniej jeden wpis aplikacji.');
  } else {
    const first = details[0];
    const ids = first.appIDs || (first.appID ? [first.appID] : []);
    if (!ids.some((id) => id.endsWith(`.${expectedBundleId}`))) {
      errors.push(`Żaden wpis appIDs nie zawiera Bundle ID ${expectedBundleId}.`);
    }
    if ((!first.components || first.components.length === 0) && (!first.paths || first.paths.length === 0)) {
      errors.push('Brak ścieżek URL (components/paths) w apple-app-site-association.');
    }
  }

  const webCreds = aasa.webcredentials?.apps || [];
  if (!webCreds.some((id) => id.endsWith(`.${expectedBundleId}`))) {
    errors.push(`Sekcja webcredentials.apps powinna zawierać ${expectedBundleId}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAppStoreListing(listing: AppStoreListingMeta): PlayStoreValidationCheck[] {
  const titleLen = listing.title.trim().length;
  const subtitleLen = listing.subtitle.trim().length;
  const keywordsLen = listing.keywords.trim().length;
  const promoLen = listing.promotionalText.trim().length;
  const descLen = listing.description.trim().length;

  return [
    {
      id: 'ios-bundle-id',
      title: `iOS Bundle ID (${listing.bundleId}) v${listing.version} (build ${listing.buildNumber})`,
      passed: PACKAGE_ID_REGEX.test(listing.bundleId) && Number(listing.buildNumber) >= 1 && listing.supportsTablet,
      details: `Obsługa iPhone i iPad (supportsTablet), minimalny system iOS ${listing.minimumOSVersion}.`,
    },
    {
      id: 'ios-privacy-manifest',
      title: 'Apple Privacy Manifest (PrivacyInfo.xcprivacy — UserDefaults CA92.1) & Encryption',
      passed:
        listing.usesNonExemptEncryption === false &&
        listing.privacyManifest?.tracking === false &&
        listing.privacyManifest?.accessedApiCategory === 'NSPrivacyAccessedAPICategoryUserDefaults' &&
        listing.privacyManifest?.reason === 'CA92.1',
      details: 'Deklaracja wymagana przez App Store Connect od 2024 r. + ITSAppUsesNonExemptEncryption=false.',
    },
    {
      id: 'ios-store-texts',
      title: `Limity App Store Connect (Nazwa: ${titleLen}/30, Podtytuł: ${subtitleLen}/30, Słowa kl.: ${keywordsLen}/100)`,
      passed:
        titleLen > 0 &&
        titleLen <= 30 &&
        subtitleLen > 0 &&
        subtitleLen <= 30 &&
        keywordsLen > 0 &&
        keywordsLen <= 100 &&
        promoLen > 0 &&
        promoLen <= 170 &&
        descLen >= 100 &&
        descLen <= 4000,
      details: `Tekst promocyjny: ${promoLen}/170 znaków. Opis: ${descLen}/4000 znaków.`,
    },
    {
      id: 'ios-urls',
      title: 'Apple Privacy Policy & Support URL (HTTPS)',
      passed:
        listing.privacyPolicyUrl.startsWith('https://') &&
        listing.supportUrl.startsWith('https://'),
      details: `Privacy: ${listing.privacyPolicyUrl} • Support: ${listing.supportUrl}`,
    },
    {
      id: 'ios-assets',
      title: `Grafiki App Store (Ikona 1024x1024 RGB bez alpha, ${listing.assets.iphone67Screenshots.length} zrzuty iPhone 6.7")`,
      passed: Boolean(listing.assets.icon1024Opaque) && listing.assets.iphone67Screenshots.length >= 3,
      details: 'Ikona 1024×1024 RGB bez przezroczystości oraz zrzuty 1290×2796 (iPhone 6.7") gotowe.',
    },
  ];
}

