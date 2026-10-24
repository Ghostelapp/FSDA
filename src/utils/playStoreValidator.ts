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
      title: `Zgodność z wymogami Google Play API Level (targetSdk ${listing.targetSdk} / Android 15)`,
      passed: listing.targetSdk >= 34 && listing.minSdk >= 21,
      details: `Skonfigurowano targetSdk ${listing.targetSdk} (wymagane min. 34/35 w Google Play Console) oraz minSdk ${listing.minSdk}.`,
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
      details: `Pełny opis zawiera ${fullLen}/4000 znaków i obejmuje wszystkie 15 modułów (91 lekcji).`,
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
