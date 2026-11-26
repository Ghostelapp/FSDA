import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CopyButton } from './CopyButton';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  FileCode2,
  Info,
  KeyRound,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  PackageCheck,
  Rocket,
  Apple
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import {
  validateAppleAssociation,
  validateAppStoreListing,
  validateAssetLinks,
  validateStoreListing,
  validateTwaManifest,
  type AppleAppSiteAssociation,
  type AppStoreListingMeta,
  type AssetLinkEntry,
  type PlayStoreListingMeta,
  type TwaManifestConfig,
} from '../utils/playStoreValidator';
import {
  downloadVerifiedAssetFile,
  downloadVerifiedExpoZip,
  downloadVerifiedIosZip,
  downloadVerifiedPlayStoreZip,
} from '../utils/playStoreDownload';

interface AndroidPlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHA256_FINGERPRINT = 'A6:5D:54:DB:3F:7C:C1:DF:CF:E4:45:1D:26:21:41:15:B8:49:58:D4:D2:D8:93:9D:AF:81:34:4F:81:23:86:23';
const PRODUCTION_HOST = 'fsda.tech';
const PRIVACY_POLICY_URL = `https://${PRODUCTION_HOST}/privacy-policy.html`;
const STORE_TITLE = 'Full Stack Academy — Kurs IT';
const STORE_SHORT_DESC = 'Nauka programowania od zera do Full Stack Developera: HTML, JS, React, SQL i Git';
const STORE_FULL_DESC = `Zostań profesjonalnym Full Stack Developerem z aplikacją mobilną Full Stack Academy!

Ucz się programowania krok po kroku poprzez Interaktywną Mapę Kursu z 96 lekcjami w 15 strefach, praktyczne ćwiczenia w edytorze kodu, symulator terminala Bash/Git, Studio REST API oraz Studio Bazy Danych SQL.

GŁÓWNE FUNKCJE APLIKACJI (WERSJA 3.0):
• Interaktywna Mapa Kursu (15 stref i 96 lekcji) z płynnymi animacjami przejść między stacjami oraz inspektorem lekcji na żywo.
• Kompletny program: od architektury Internetu, HTML5 i CSS3, przez JavaScript ES6+, Git, TypeScript i React, aż po Node.js, Express, PostgreSQL/Prisma, OAuth2/JWT, Stripe, Testy Vitest/Playwright, Docker/CI/CD, Next.js App Router i pracę w Scrum.
• Wbudowana Piaskownica Kodu (HTML/CSS/JS) z automatyczną weryfikacją testów jednostkowych i AST (288 pytań kontrolnych).
• Interaktywny symulator Terminala UNIX / Bash oraz systemu kontroli wersji Git.
• Studio Bazy Danych SQL z walidacją składni i wykonywaniem zapytań na żywo.
• Studio REST API oraz Wizualizator JavaScript Event Loop (Call Stack, Web APIs, Microtasks, Macrotasks).
• Fiszki SM-2 (Spaced Repetition), ściągi techniczne (Cheat Sheets) oraz Kreator CV programisty.
• Egzaminy Live Coding (Mock Interviews) przygotowujące do rozmów kwalifikacyjnych.
• System grywalizacji: punkty XP, ligi tygodniowe, Wyzwanie Dnia, dzienna seria nauki (Streak), odznaki oraz imienny Certyfikat Ukończenia Kursu.
• Edycja Otwarta 0 zł i tryb Offline (Service Worker) pozwalający na naukę na telefonie bez dostępu do sieci.

Dla kogo?
Kurs został zaprojektowany zarówno dla osób stawiających pierwsze kroki w branży IT, jak i początkujących programistów chcących uporządkować wiedzę i zbudować portfolio 12 projektów komercyjnych.`;

const EXPO_BUILD_COMMANDS = `# 1. Wypakuj pobrany plik fullstack-academy-expo-apk.zip i wejdź do folderu:
cd expo-mobile-app
npm install

# 2. Zaloguj się do darmowego konta Expo (https://expo.dev):
npx eas-cli login

# 3. Wygeneruj plik .APK w chmurze Expo (bez Android Studio i bez Java JDK!):
npx eas-cli build -p android --profile preview

# (Opcjonalnie) Wygeneruj plik .AAB do sklepu Google Play Console:
npx eas-cli build -p android --profile production`;

const BUILD_APK_COMMANDS = `# 1. Rozpakuj pobrane archiwum fullstack-academy-google-play-pack.zip
unzip fullstack-academy-google-play-pack.zip -d fullstack-academy-play

# 2. Opcja A — Zbuduj podpisany plik .aab i .apk przez Gradle (Android SDK 35)
cd fullstack-academy-play/android && gradle bundleRelease assembleRelease
# Wynik AAB (do Google Play): android/app/build/outputs/bundle/release/app-release.aab
# Wynik APK (na telefon):     android/app/build/outputs/apk/release/app-release.apk

# 3. Opcja B — Zbuduj przez oficjalne narzędzie Google Bubblewrap CLI
npx @bubblewrap/cli build`;

const TWA_MANIFEST_CONFIG: TwaManifestConfig = {
  packageId: 'com.fullstackacademy.app',
  host: PRODUCTION_HOST,
  name: 'Full Stack Academy',
  launcherName: 'FS Academy',
  display: 'standalone',
  themeColor: '#4F46E5',
  backgroundColor: '#020617',
  startUrl: '/app',
  iconUrl: `https://${PRODUCTION_HOST}/pwa-512x512.png`,
  maskableIconUrl: `https://${PRODUCTION_HOST}/pwa-maskable-512x512.png`,
  appVersionCode: 10,
  appVersionName: '3.2.0',
  signingKey: {
    path: './android.keystore',
    alias: 'android',
  },
  webManifestUrl: `https://${PRODUCTION_HOST}/manifest.webmanifest`,
};

const ASSET_LINKS_CONFIG: AssetLinkEntry[] = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'com.fullstackacademy.app',
      sha256_cert_fingerprints: [SHA256_FINGERPRINT],
    },
  },
];

const LISTING_META_CONFIG: PlayStoreListingMeta = {
  appId: 'com.fullstackacademy.app',
  versionName: '3.2.0',
  versionCode: 10,
  defaultLanguage: 'pl-PL',
  title: STORE_TITLE,
  shortDescription: STORE_SHORT_DESC,
  fullDescription: STORE_FULL_DESC,
  privacyPolicyUrl: PRIVACY_POLICY_URL,
  contactEmail: 'zordonzordon1@gmail.com',
  targetSdk: 36,
  minSdk: 24,
  assets: {
    icon512: '/pwa-512x512.png',
    maskable512: '/pwa-maskable-512x512.png',
    featureGraphic1024x500: '/play-store/feature-graphic-1024x500.png',
    screenshots: [
      '/play-store/screenshot-1-dashboard.png',
      '/play-store/screenshot-2-editor.png',
      '/play-store/screenshot-3-certificate.png',
    ],
  },
};

const IOS_BUILD_COMMANDS = `# 1. Wypakuj fullstack-academy-ios-app-pack.zip i wejdź do expo-mobile-app:
cd expo-mobile-app
npm install

# 2. Zaloguj się do konta Expo (https://expo.dev):
npx eas-cli login

# 3a. Opcjonalnie — build na Symulator iOS (bez płatnego Apple Developer):
npx eas-cli build -p ios --profile simulator

# 3b. Zbuduj podpisany plik .IPA do TestFlight & App Store Connect:
npx eas-cli build -p ios --profile production

# 4. Wyślij paczkę .IPA bezpośrednio do App Store Connect:
npx eas-cli submit -p ios --profile production`;

const IOS_AASA_CONFIG: AppleAppSiteAssociation = {
  applinks: {
    apps: [],
    details: [
      {
        appIDs: ['YOUR_APPLE_TEAM_ID.com.fullstackacademy.app'],
        components: [
          { '/': '/baza-wiedzy/*' },
          { '/': '/app/*' },
          { '/': '/o-nas' },
          { '/': '/kontakt' },
        ],
      },
    ],
  },
  webcredentials: {
    apps: ['YOUR_APPLE_TEAM_ID.com.fullstackacademy.app'],
  },
};

const IOS_LISTING_META_CONFIG: AppStoreListingMeta = {
  platform: 'ios',
  bundleId: 'com.fullstackacademy.app',
  version: '3.0.0',
  buildNumber: '4',
  minimumOSVersion: '15.1',
  supportsTablet: true,
  defaultLanguage: 'pl-PL',
  title: STORE_TITLE,
  subtitle: 'Nauka Kodu, React, SQL i Git',
  promotionalText:
    'Nowość v3.0: Interaktywna Mapa Kursu (15 stref, 96 lekcji) z animowanymi przejściami, edytorem kodu na żywo, terminalem Bash/Git oraz Studio SQL.',
  keywords:
    'programowanie,javascript,react,html,css,sql,git,nodejs,typescript,fullstack,kurs it,nauka kodu',
  description: STORE_FULL_DESC,
  category: 'Education',
  ageRating: '4+',
  usesNonExemptEncryption: false,
  privacyManifest: {
    tracking: false,
    accessedApiCategory: 'NSPrivacyAccessedAPICategoryUserDefaults',
    reason: 'CA92.1',
  },
  contactEmail: 'zordonzordon1@gmail.com',
  privacyPolicyUrl: PRIVACY_POLICY_URL,
  supportUrl: `https://${PRODUCTION_HOST}/kontakt`,
  assets: {
    icon1024Opaque: '/app-store/app-store-icon-1024x1024.png',
    appleTouchIcon180: '/apple-touch-icon.png',
    iphone67Screenshots: [
      '/app-store/iphone-67-1-landing.png',
      '/app-store/iphone-67-2-map.png',
      '/app-store/iphone-67-3-lesson.png',
    ],
  },
};

export const AndroidPlayStoreModal: React.FC<AndroidPlayStoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, isAuthenticated, language } = useApp();
  const isEn = language === 'en';
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'expo_apk' | 'ios_app_store' | 'release_pack' | 'store_listing' | 'install' | 'checklist'>('expo_apk');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedSuccessId, setDownloadedSuccessId] = useState<string | null>(null);

  const isAdmin = isAuthenticated && currentUser.role === 'admin';

  const auditChecks = useMemo(() => {
    const twaRes = validateTwaManifest(TWA_MANIFEST_CONFIG);
    const assetRes = validateAssetLinks(ASSET_LINKS_CONFIG, 'com.fullstackacademy.app', SHA256_FINGERPRINT);
    const listingChecks = validateStoreListing(LISTING_META_CONFIG);
    const aasaRes = validateAppleAssociation(IOS_AASA_CONFIG, 'com.fullstackacademy.app');
    const iosListingChecks = validateAppStoreListing(IOS_LISTING_META_CONFIG);

    return [
      {
        id: 'expo-eas',
        title: isEn
          ? 'Expo SDK 52 Project + EAS Build (buildType: "apk" & "app-bundle")'
          : 'Projekt Expo SDK 52 + EAS Build (buildType: "apk" & "app-bundle")',
        passed: true,
        details: isEn
          ? 'Configured expo-mobile-app (app.json, eas.json, App.tsx with Back gesture & Offline handling) for Expo EAS cloud.'
          : 'Skonfigurowano expo-mobile-app (app.json, eas.json, App.tsx z obsługą gestu Wstecz i Offline) pod chmurę Expo EAS.',
      },
      {
        id: 'twa-manifest',
        title: isEn
          ? 'TWA Manifest (twa-manifest.json) & RSA-2048 Keystore'
          : 'Manifest TWA (twa-manifest.json) & Keystore RSA-2048',
        passed: twaRes.valid,
        details: twaRes.valid
          ? isEn
            ? 'Configured com.fullstackacademy.app v3.2.0 (versionCode 10, Target SDK 36), android.keystore signature, and 4 launcher shortcuts.'
            : 'Skonfigurowano com.fullstackacademy.app v3.2.0 (versionCode 10, Target SDK 36), podpis android.keystore i 4 skróty ekranu głównego.'
          : twaRes.errors.join(' '),
      },
      {
        id: 'asset-links',
        title: 'Digital Asset Links (.well-known/assetlinks.json)',
        passed: assetRes.valid,
        details: assetRes.valid
          ? isEn
            ? `Verified SHA-256 fingerprint (${SHA256_FINGERPRINT.slice(0, 23)}...) — hides browser address bar in APK.`
            : `Zweryfikowano odcisk SHA-256 (${SHA256_FINGERPRINT.slice(0, 23)}...) — ukrywa pasek adresu przeglądarki w APK.`
          : assetRes.errors.join(' '),
      },
      {
        id: 'apple-universal-links',
        title: 'Apple Universal Links (.well-known/apple-app-site-association)',
        passed: aasaRes.valid,
        details: aasaRes.valid
          ? isEn
            ? 'Configured applinks & webcredentials for com.fullstackacademy.app (replace YOUR_APPLE_TEAM_ID before submission).'
            : 'Skonfigurowano applinks i webcredentials dla com.fullstackacademy.app (przed publikacją wpisz Apple Team ID).'
          : aasaRes.errors.join(' '),
      },
      ...listingChecks,
      ...iosListingChecks,
    ];
  }, [isEn]);

  const passedCount = auditChecks.filter((c) => c.passed).length;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !isAdmin) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownloadExpoZip = async () => {
    setDownloadingId('expo_zip');
    try {
      await downloadVerifiedExpoZip();
      setDownloadedSuccessId('expo_zip');
      setTimeout(() => setDownloadedSuccessId(null), 3000);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadZip = async () => {
    setDownloadingId('zip');
    try {
      await downloadVerifiedPlayStoreZip();
      setDownloadedSuccessId('zip');
      setTimeout(() => setDownloadedSuccessId(null), 3000);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadIosZip = async () => {
    setDownloadingId('ios_zip');
    try {
      await downloadVerifiedIosZip();
      setDownloadedSuccessId('ios_zip');
      setTimeout(() => setDownloadedSuccessId(null), 3000);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadSingle = async (
    id: string,
    url: string,
    filename: string,
    mimeType: string,
    fallbackText?: string
  ) => {
    setDownloadingId(id);
    try {
      await downloadVerifiedAssetFile(url, filename, mimeType, fallbackText);
      setDownloadedSuccessId(id);
      setTimeout(() => setDownloadedSuccessId(null), 2500);
    } finally {
      setDownloadingId(null);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative my-auto w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative shrink-0 border-b border-slate-800 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 shrink-0">
                <PackageCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  <span>
                    {isEn
                      ? 'Admin Only • Signed AAB Ready • Google Play & Apple App Store v3.2.0'
                      : 'Tylko Administrator • Gotowe AAB • Google Play & App Store v3.2.0'}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white mt-1">
                  {isEn
                    ? 'Mobile Release Center (Android APK/AAB & iOS IPA)'
                    : 'Centrum Wydań Mobilnych (Android APK/AAB & iOS App Store)'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? 'Close modal' : 'Zamknij okno'}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('expo_apk')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'expo_apk'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>{isEn ? 'Android Expo (APK)' : 'Android Expo (APK)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ios_app_store')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ios_app_store'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Apple className="h-3.5 w-3.5" />
              <span>{isEn ? 'iOS / App Store (.IPA)' : 'iOS / App Store (.IPA)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('release_pack')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'release_pack'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isEn ? 'Full Pack (.ZIP) & Keystore' : 'Pełny Pakiet (.ZIP) & Keystore'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('store_listing')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'store_listing'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{isEn ? 'Store Copy & Graphics' : 'Teksty i Grafiki do Sklepu'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('install')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'install'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>{isEn ? 'WebAPK Install' : 'Instalacja WebAPK'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'checklist'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isEn ? `Audit (${passedCount}/${auditChecks.length})` : `Audyt (${passedCount}/${auditChecks.length})`}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'expo_apk' && (
            <div className="space-y-4">
              {/* Expo Cloud APK Builder Card */}
              <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      {isEn
                        ? 'Compile .APK without Android Studio or Java JDK (Expo SDK 52 + EAS)'
                        : 'Kompilacja .APK bez Android Studio i bez Java JDK (Expo SDK 52 + EAS)'}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {isEn
                        ? 'Expo React Native Mobile Project (`fullstack-academy-expo-apk.zip`)'
                        : 'Projekt Mobilny Expo React Native (`fullstack-academy-expo-apk.zip`)'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isEn ? (
                        <>
                          Ready-to-build <strong>Expo + React Native WebView</strong> (<code>com.fullstackacademy.app</code>) project preconfigured in <code>eas.json</code> for direct <strong><code>buildType: "apk"</code></strong> (<code>preview</code>) and Play Store <strong><code>buildType: "app-bundle"</code></strong> (<code>production</code>).
                        </>
                      ) : (
                        <>
                          Gotowy projekt <strong>Expo + React Native WebView</strong> (<code>com.fullstackacademy.app</code>) skonfigurowany w pliku <code>eas.json</code> na budowanie bezpośredniego instalatora <strong><code>buildType: "apk"</code></strong> (profil <code>preview</code>) oraz paczki sklepowej <strong><code>buildType: "app-bundle"</code></strong> (profil <code>production</code>).
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadExpoZip}
                    disabled={downloadingId === 'expo_zip'}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-60 text-white text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {downloadedSuccessId === 'expo_zip' ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-200" />
                        <span>{isEn ? 'Downloaded Expo Project (.zip)!' : 'Pobrano Projekt Expo (.zip)!'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>
                          {downloadingId === 'expo_zip'
                            ? isEn
                              ? 'Preparing...'
                              : 'Przygotowywanie...'
                            : isEn
                              ? 'Download Expo Project (.zip)'
                              : 'Pobierz Projekt Expo (.zip)'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Included Expo Files Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
                    <span className="font-mono font-bold text-cyan-300 block">eas.json</span>
                    <span className="text-[10px] text-slate-400">buildType: "apk" & "aab"</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
                    <span className="font-mono font-bold text-indigo-300 block">app.json</span>
                    <span className="text-[10px] text-slate-400">com.fullstackacademy.app</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
                    <span className="font-mono font-bold text-emerald-300 block">App.tsx</span>
                    <span className="text-[10px] text-slate-400">WebView + BackButton + Offline</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
                    <span className="font-mono font-bold text-amber-300 block">assets/*.png</span>
                    <span className="text-[10px] text-slate-400">
                      {isEn ? 'Icon, Adaptive & Splash' : 'Ikona, Adaptive & Splash'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Commands to generate APK in Expo Cloud */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-cyan-400" />
                    <span>
                      {isEn
                        ? 'How to generate an .APK in Expo Cloud (3 simple terminal steps):'
                        : 'Jak wygenerować plik .APK w chmurze Expo (3 proste kroki w terminalu):'}
                    </span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(EXPO_BUILD_COMMANDS, 'expo_cmd')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedCode === 'expo_cmd' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isEn ? 'Copy commands' : 'Kopiuj komendy'}</span>
                  </button>
                </div>

                <div className="relative">
                  <CopyButton text={EXPO_BUILD_COMMANDS} className="absolute top-2.5 right-2.5 z-10" />
                  <pre className="rounded-xl bg-slate-900 p-3.5 pr-24 font-mono text-[11px] text-emerald-300 border border-slate-800 overflow-x-auto leading-relaxed">
                    {EXPO_BUILD_COMMANDS}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-0.5">
                      {isEn ? 'Step 1: Extract .zip' : 'Krok 1: Rozpakuj .zip'}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {isEn ? (
                        <>
                          Extract <code>fullstack-academy-expo-apk.zip</code> on your computer and run <code>npm install</code>.
                        </>
                      ) : (
                        <>
                          Rozpakuj <code>fullstack-academy-expo-apk.zip</code> na komputerze i uruchom <code>npm install</code>.
                        </>
                      )}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-0.5">
                      {isEn ? 'Step 2: Run EAS Build' : 'Krok 2: Uruchom EAS Build'}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {isEn ? (
                        <>
                          Run <code>npx eas-cli build -p android --profile preview</code> — Expo cloud generates the Keystore and compiles your APK.
                        </>
                      ) : (
                        <>
                          Wpisz <code>npx eas-cli build -p android --profile preview</code> — chmura Expo sama wygeneruje Keystore i skompiluje APK.
                        </>
                      )}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-0.5">
                      {isEn ? 'Step 3: Download .APK / QR Code' : 'Krok 3: Pobierz .APK / Kod QR'}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {isEn ? (
                        <>
                          After compilation you will get a direct link and QR code in the terminal to install the <code>.apk</code> on your phone!
                        </>
                      ) : (
                        <>
                          Po kompilacji otrzymasz w terminalu bezpośredni link oraz kod QR do pobrania pliku <code>.apk</code> na telefon!
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios_app_store' && (
            <div className="space-y-4">
              {/* Main iOS App Store Release Pack Card */}
              <div className="rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/60 via-slate-900 to-slate-950 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                      {isEn
                        ? 'Apple App Store Connect & TestFlight • Bundle com.fullstackacademy.app v3.0.0 (Build 4)'
                        : 'Apple App Store Connect & TestFlight • Bundle com.fullstackacademy.app v3.0.0 (Build 4)'}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {isEn
                        ? 'iOS & Apple App Store Release Pack (`fullstack-academy-ios-app-pack.zip`)'
                        : 'Pakiet Produkcyjny iOS & App Store (`fullstack-academy-ios-app-pack.zip`)'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isEn ? (
                        <>
                          Preconfigured <strong>Expo iOS WKWebView</strong> project with <strong>Privacy Manifest (CA92.1)</strong>, <code>associatedDomains</code> (<code>applinks:fsda.tech</code>), Xcode 26 Podfile fix, opaque <strong>1024×1024 RGB icon</strong>, and 3 native <strong>1290×2796 (iPhone 6.7")</strong> screenshots.
                        </>
                      ) : (
                        <>
                          Skonfigurowany projekt <strong>Expo iOS WKWebView</strong> z wymaganym przez Apple <strong>Privacy Manifest (CA92.1)</strong>, Universal Links (<code>applinks:fsda.tech</code>), poprawką Xcode Podfile, nieprzezroczystą ikoną <strong>1024×1024 RGB</strong> oraz 3 zrzutami <strong>1290×2796 (iPhone 6.7&quot;)</strong>.
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadIosZip}
                    disabled={downloadingId === 'ios_zip'}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60 text-white text-xs font-extrabold transition-all shadow-lg shadow-sky-600/30 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {downloadedSuccessId === 'ios_zip' ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-200" />
                        <span>{isEn ? 'Downloaded iOS Pack (.zip)!' : 'Pobrano Pakiet iOS (.zip)!'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>
                          {downloadingId === 'ios_zip'
                            ? isEn
                              ? 'Preparing iOS pack...'
                              : 'Pakowanie iOS .zip...'
                            : isEn
                              ? 'Download iOS Pack (.zip)'
                              : 'Pobierz Pakiet iOS (.zip)'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick single iOS downloads */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'ios_aasa',
                        '/.well-known/apple-app-site-association',
                        'apple-app-site-association',
                        'application/json',
                        JSON.stringify(IOS_AASA_CONFIG, null, 2)
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
                  >
                    {downloadedSuccessId === 'ios_aasa' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">apple-app-site-association</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'ios_meta',
                        '/app-store/karta-app-store.json',
                        'karta-app-store.json',
                        'application/json',
                        JSON.stringify(IOS_LISTING_META_CONFIG, null, 2)
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-sky-300 transition-colors cursor-pointer"
                  >
                    {downloadedSuccessId === 'ios_meta' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">karta-app-store.json</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'ios_icon1024',
                        '/app-store/app-store-icon-1024x1024.png',
                        'app-store-icon-1024x1024.png',
                        'image/png'
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-indigo-300 transition-colors cursor-pointer"
                  >
                    {downloadedSuccessId === 'ios_icon1024' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">Ikona 1024×1024 RGB</span>
                  </button>

                  <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-center text-center">
                    <span>PrivacyInfo: UserDefaults CA92.1</span>
                  </div>
                </div>
              </div>

              {/* Build .IPA via Expo EAS Cloud (without local macOS!) */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-sky-400" />
                    <span>
                      {isEn
                        ? 'Generate signed .IPA & submit to TestFlight without a Mac (Expo EAS Cloud):'
                        : 'Kompilacja podpisanego .IPA i wysyłka do TestFlight bez komputera Mac (Expo EAS Cloud):'}
                    </span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(IOS_BUILD_COMMANDS, 'ios_cmd')}
                    className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold cursor-pointer shrink-0"
                  >
                    {copiedCode === 'ios_cmd' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isEn ? 'Copy' : 'Kopiuj'}</span>
                  </button>
                </div>

                <div className="relative">
                  <CopyButton text={IOS_BUILD_COMMANDS} className="absolute top-2.5 right-2.5 z-10" />
                  <pre className="rounded-xl bg-slate-900 p-3.5 pr-24 font-mono text-[11px] text-sky-300 border border-slate-800 overflow-x-auto leading-relaxed">
                    {IOS_BUILD_COMMANDS}
                  </pre>
                </div>
              </div>

              {/* App Store Connect Metadata Quick Copy & 1290x2796 iPhone 6.7" Assets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-400">
                      {isEn ? 'Subtitle (28/30 chars)' : 'Podtytuł w App Store (28/30 znaków)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(IOS_LISTING_META_CONFIG.subtitle, 'ios_sub')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      {copiedCode === 'ios_sub' ? (isEn ? 'Copied!' : 'Skopiowano!') : isEn ? 'Copy' : 'Kopiuj'}
                    </button>
                  </div>
                  <p className="text-xs font-bold text-white">{IOS_LISTING_META_CONFIG.subtitle}</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-400">
                      {isEn ? `Keywords (${IOS_LISTING_META_CONFIG.keywords.length}/100)` : `Słowa kluczowe (${IOS_LISTING_META_CONFIG.keywords.length}/100)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(IOS_LISTING_META_CONFIG.keywords, 'ios_kw')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      {copiedCode === 'ios_kw' ? (isEn ? 'Copied!' : 'Skopiowano!') : isEn ? 'Copy' : 'Kopiuj'}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 break-all">{IOS_LISTING_META_CONFIG.keywords}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-sky-400" />
                  <span>
                    {isEn
                      ? 'Apple App Store Icon (1024×1024 RGB) & iPhone 6.7" Screenshots (1290×2796):'
                      : 'Ikona App Store (1024×1024 RGB bez alpha) & Zrzuty iPhone 6.7" (1290×2796):'}
                  </span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'ios_icon_card',
                        '/app-store/app-store-icon-1024x1024.png',
                        'app-store-icon-1024x1024.png',
                        'image/png'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/app-store/app-store-icon-1024x1024.png" alt="iOS 1024x1024 Icon" className="h-14 w-14 rounded-2xl object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">Ikona 1024×1024</span>
                    <span className="block text-[10px] text-sky-400">
                      {downloadedSuccessId === 'ios_icon_card' ? (isEn ? 'Downloaded!' : 'Pobrano!') : 'PNG RGB'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'ios_shot1',
                        '/app-store/iphone-67-1-landing.png',
                        'iphone-67-1-landing.png',
                        'image/png'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/app-store/iphone-67-1-landing.png" alt="iPhone 6.7 Landing" className="h-14 w-7 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">iPhone #1 Start</span>
                    <span className="block text-[10px] text-sky-400">
                      {downloadedSuccessId === 'ios_shot1' ? (isEn ? 'Downloaded!' : 'Pobrano!') : '1290×2796'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'ios_shot2',
                        '/app-store/iphone-67-2-map.png',
                        'iphone-67-2-map.png',
                        'image/png'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/app-store/iphone-67-2-map.png" alt="iPhone 6.7 Map" className="h-14 w-7 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">iPhone #2 Mapa</span>
                    <span className="block text-[10px] text-sky-400">
                      {downloadedSuccessId === 'ios_shot2' ? (isEn ? 'Downloaded!' : 'Pobrano!') : '1290×2796'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'ios_shot3',
                        '/app-store/iphone-67-3-lesson.png',
                        'iphone-67-3-lesson.png',
                        'image/png'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/app-store/iphone-67-3-lesson.png" alt="iPhone 6.7 Lesson" className="h-14 w-7 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">iPhone #3 Lekcja</span>
                    <span className="block text-[10px] text-sky-400">
                      {downloadedSuccessId === 'ios_shot3' ? (isEn ? 'Downloaded!' : 'Pobrano!') : '1290×2796'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'release_pack' && (
            <div className="space-y-4">
              {/* Direct Compiled & Signed Google Play .AAB + .APK Download Card */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {isEn
                        ? 'Compiled & Signed Release Artifacts • v3.2.0 (versionCode 10) • Target SDK 36 (Android 16)'
                        : 'Skompilowane i Podpisane Pliki Wydania • v3.2.0 (versionCode 10) • Target SDK 36 (Android 16)'}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {isEn
                        ? 'Ready-to-Upload Google Play Bundle (.aab) & Installer (.apk)'
                        : 'Gotowa Paczka Google Play (.aab) i Instalator (.apk)'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Signed with android.keystore (SHA-256 verified against /.well-known/assetlinks.json). Upload the .aab file directly in Google Play Console.'
                        : 'Podpisane kluczem android.keystore (SHA-256 zgodny z /.well-known/assetlinks.json). Wgraj plik .aab bezpośrednio w Google Play Console.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadSingle(
                          'signed_aab',
                          '/play-store/fullstack-academy-v3.2.0-vc10.aab',
                          'fullstack-academy-v3.2.0-vc10.aab',
                          'application/octet-stream'
                        )
                      }
                      disabled={downloadingId === 'signed_aab'}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-60 text-white text-xs font-extrabold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {downloadedSuccessId === 'signed_aab' ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-100" />
                          <span>{isEn ? 'Downloaded .AAB!' : 'Pobrano .AAB!'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>
                            {downloadingId === 'signed_aab'
                              ? isEn ? 'Downloading...' : 'Pobieranie...'
                              : isEn ? 'Download .AAB (Play Store)' : 'Pobierz .AAB (Sklep Play)'}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadSingle(
                          'signed_apk',
                          '/play-store/fullstack-academy-v3.2.0-vc10.apk',
                          'fullstack-academy-v3.2.0-vc10.apk',
                          'application/vnd.android.package-archive'
                        )
                      }
                      disabled={downloadingId === 'signed_apk'}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-60 text-slate-100 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {downloadedSuccessId === 'signed_apk' ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span>{isEn ? 'Downloaded .APK!' : 'Pobrano .APK!'}</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="h-4 w-4 text-cyan-400" />
                          <span>{isEn ? 'Download .APK' : 'Pobierz .APK'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-emerald-500/20 text-[11px]">
                  <span className="text-slate-300">
                    {isEn ? (
                      <>
                        Play Console says wrong upload key? Upload <code>upload_certificate.pem</code> in <strong>App signing → Request upload key reset</strong>.
                      </>
                    ) : (
                      <>
                        Play Console zgłasza inny klucz podpisu? Wgraj <code>upload_certificate.pem</code> w <strong>Podpisywanie aplikacji → Poproś o zresetowanie klucza przesyłania</strong>.
                      </>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'upload_pem',
                        '/play-store/upload_certificate.pem',
                        'upload_certificate.pem',
                        'application/x-pem-file'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {downloadedSuccessId === 'upload_pem' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{isEn ? 'Downloaded .PEM!' : 'Pobrano .PEM!'}</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-3.5 w-3.5" />
                        <span>{isEn ? 'Download upload_certificate.pem' : 'Pobierz upload_certificate.pem'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary 1-Click Verified ZIP Download Bundle Card */}
              <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      {isEn
                        ? 'Verified PKZIP binary archive (Expo + Android TWA + Keystore + Graphics)'
                        : 'Zweryfikowane archiwum binarne PKZIP (Expo + Android TWA + Keystore + Grafiki)'}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {isEn
                        ? 'Complete Google Play Release Pack (.zip)'
                        : 'Kompletny Pakiet Publikacji Google Play (.zip)'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isEn ? (
                        <>
                          Includes both the <code>expo-mobile-app/</code> project and native Android Studio <code>android/</code> (<code>targetSdk 36</code>), signing key <code>android.keystore</code>, <code>assetlinks.json</code>, 1024x500 feature graphic, and 9:16 screenshots.
                        </>
                      ) : (
                        <>
                          Zawiera zarówno projekt <code>expo-mobile-app/</code>, jak i natywny projekt Android Studio <code>android/</code> (<code>targetSdk 36</code>), klucz podpisu <code>android.keystore</code>, <code>assetlinks.json</code>, grafikę 1024x500 oraz zrzuty ekranu 9:16.
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    disabled={downloadingId === 'zip'}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-60 text-white text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {downloadedSuccessId === 'zip' ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-200" />
                        <span>{isEn ? 'Downloaded Pack (.zip)!' : 'Pobrano Pakiet (.zip)!'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>
                          {downloadingId === 'zip'
                            ? isEn
                              ? 'Verifying & downloading...'
                              : 'Weryfikacja i pobieranie...'
                            : isEn
                              ? 'Download Full Pack (.zip)'
                              : 'Pobierz Pełny Pakiet (.zip)'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Individual Verified Quick Downloads */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'keystore',
                        '/play-store/android.keystore',
                        'android.keystore',
                        'application/octet-stream'
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-amber-300 transition-colors cursor-pointer"
                  >
                    {downloadedSuccessId === 'keystore' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <KeyRound className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">android.keystore</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'twa',
                        '/twa-manifest.json',
                        'twa-manifest.json',
                        'application/json',
                        JSON.stringify(TWA_MANIFEST_CONFIG, null, 2)
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-cyan-300 transition-colors cursor-pointer"
                  >
                    {downloadedSuccessId === 'twa' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">twa-manifest.json</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'assetlinks',
                        '/.well-known/assetlinks.json',
                        'assetlinks.json',
                        'application/json',
                        JSON.stringify(ASSET_LINKS_CONFIG, null, 2)
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
                  >
                    {downloadedSuccessId === 'assetlinks' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">assetlinks.json</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'listing',
                        '/play-store/karta-sklepu-play.json',
                        'karta-sklepu-play.json',
                        'application/json',
                        JSON.stringify(LISTING_META_CONFIG, null, 2)
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-indigo-300 transition-colors cursor-pointer"
                  >
                    {downloadedSuccessId === 'listing' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">{isEn ? 'Store Metadata' : 'Metadane Sklepu'}</span>
                  </button>
                </div>
              </div>

              {/* Generated Signing Credentials Box */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" />
                    {isEn ? 'Generated Production Signing Key (Keystore)' : 'Wygenerowany Klucz Podpisu Produkcyjnego (Keystore)'}
                  </span>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    {isEn ? 'Linked to assetlinks.json' : 'Podpięty do assetlinks.json'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{isEn ? 'Key alias:' : 'Alias klucza:'}</span>
                    <span className="font-mono font-bold text-white">android</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{isEn ? 'Keystore / Key Password:' : 'Hasło Keystore / Klucza:'}</span>
                    <span className="font-mono font-bold text-amber-300">fullstack2026</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{isEn ? 'Certificate validity:' : 'Ważność certyfikatu:'}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {isEn ? '10,000 days (RSA 2048)' : '10 000 dni (RSA 2048)'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    {isEn ? (
                      <>
                        SHA-256 certificate fingerprint (auto-inserted into <code>/.well-known/assetlinks.json</code>):
                      </>
                    ) : (
                      <>
                        Odcisk certyfikatu SHA-256 (wpisany automatycznie do <code>/.well-known/assetlinks.json</code>):
                      </>
                    )}
                  </span>
                  <div className="rounded-xl bg-slate-900 p-2.5 font-mono text-[10px] sm:text-[11px] text-cyan-300 border border-slate-800 flex items-center justify-between gap-2">
                    <code className="break-all">{SHA256_FINGERPRINT}</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(SHA256_FINGERPRINT, 'sha256')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                      title={isEn ? 'Copy SHA-256' : 'Kopiuj SHA-256'}
                    >
                      {copiedCode === 'sha256' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* CLI Commands to build signed .apk / .aab */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-indigo-400" />
                    <span>{isEn ? 'Alternative: Build via Gradle / Bubblewrap:' : 'Alternatywa: Kompilacja przez Gradle / Bubblewrap:'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(BUILD_APK_COMMANDS, 'build_cmd')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'build_cmd' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isEn ? 'Copy commands' : 'Kopiuj polecenia'}</span>
                  </button>
                </div>
                <div className="relative">
                  <CopyButton text={BUILD_APK_COMMANDS} className="absolute top-2 right-2 z-10" />
                  <pre className="rounded-xl bg-slate-900 p-3 pr-24 font-mono text-[11px] text-emerald-300 border border-slate-800 overflow-x-auto leading-relaxed">
                    {BUILD_APK_COMMANDS}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'store_listing' && (
            <div className="space-y-4">
              {/* Privacy Policy Live Link */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-emerald-400">
                    {isEn ? 'Required by Google Play (GDPR Privacy Policy)' : 'Wymagane przez Google Play (Polityka Prywatności RODO)'}
                  </span>
                  <p className="text-xs text-slate-200 font-mono break-all mt-0.5">{PRIVACY_POLICY_URL}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(PRIVACY_POLICY_URL, 'privacy')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedCode === 'privacy' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isEn ? 'Copy URL' : 'Kopiuj URL'}</span>
                  </button>
                  <a
                    href="/privacy-policy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <span>{isEn ? 'Preview' : 'Podgląd'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Copyable Store Texts */}
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-400">
                      {isEn
                        ? `Google Play App Name (${STORE_TITLE.length}/30 chars)`
                        : `Nazwa aplikacji w Google Play (${STORE_TITLE.length}/30 znaków)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(STORE_TITLE, 'title')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'title' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isEn ? 'Copy' : 'Kopiuj'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-bold text-white">{STORE_TITLE}</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-400">
                      {isEn
                        ? `Short description (${STORE_SHORT_DESC.length}/80 chars)`
                        : `Krótki opis (${STORE_SHORT_DESC.length}/80 znaków)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(STORE_SHORT_DESC, 'short')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'short' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isEn ? 'Copy' : 'Kopiuj'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200">{STORE_SHORT_DESC}</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-400">
                      {isEn
                        ? `Full store listing description (${STORE_FULL_DESC.length}/4000 chars)`
                        : `Pełny opis karty sklepu (${STORE_FULL_DESC.length}/4000 znaków)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(STORE_FULL_DESC, 'full')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'full' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isEn ? 'Copy full description' : 'Kopiuj pełny opis'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <CopyButton text={STORE_FULL_DESC} className="absolute top-1.5 right-1.5 z-10" />
                    <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans max-h-36 overflow-y-auto leading-relaxed pr-24">
                      {STORE_FULL_DESC}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Downloadable Store Graphics */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-cyan-400" />
                  <span>
                    {isEn
                      ? 'Generated Graphics & Real 9:16 Screenshots for Google Play Console:'
                      : 'Wygenerowane Grafiki i Prawdziwe Zrzuty Ekranu 9:16 do Google Play Console:'}
                  </span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle('icon512', '/pwa-512x512.png', 'ikona-512x512.png', 'image/png')
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/pwa-512x512.png" alt="512x512 Icon" className="h-12 w-12 rounded-xl object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">{isEn ? 'Icon 512x512' : 'Ikona 512x512'}</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'icon512' ? (isEn ? 'Downloaded!' : 'Pobrano!') : isEn ? 'Download PNG' : 'Pobierz PNG'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'banner',
                        '/play-store/feature-graphic-1024x500.png',
                        'feature-graphic-1024x500.png',
                        'image/png'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/play-store/feature-graphic-1024x500.png" alt="1024x500 Banner" className="h-12 w-full rounded-lg object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">{isEn ? 'Banner 1024x500' : 'Baner 1024x500'}</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'banner' ? (isEn ? 'Downloaded!' : 'Pobrano!') : isEn ? 'Download PNG' : 'Pobierz PNG'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'shot1',
                        '/play-store/screenshot-1-dashboard.png',
                        'screenshot-1-dashboard.png',
                        'image/png'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/play-store/screenshot-1-dashboard.png" alt="Dashboard Screenshot" className="h-12 w-8 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">{isEn ? 'Shot #1 (Dashboard)' : 'Zrzut #1 (Pulpit)'}</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'shot1' ? (isEn ? 'Downloaded!' : 'Pobrano!') : isEn ? 'Download PNG' : 'Pobierz PNG'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'shot2',
                        '/play-store/screenshot-2-editor.png',
                        'screenshot-2-editor.png',
                        'image/png'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/play-store/screenshot-2-editor.png" alt="Editor Screenshot" className="h-12 w-8 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">{isEn ? 'Shot #2 (Editor)' : 'Zrzut #2 (Edytor)'}</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'shot2' ? (isEn ? 'Downloaded!' : 'Pobrano!') : isEn ? 'Download PNG' : 'Pobierz PNG'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle(
                        'shot3',
                        '/play-store/screenshot-3-certificate.png',
                        'screenshot-3-certificate.png',
                        'image/png'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/play-store/screenshot-3-certificate.png" alt="Modules Screenshot" className="h-12 w-8 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">{isEn ? 'Shot #3 (Modules)' : 'Zrzut #3 (Moduły)'}</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'shot3' ? (isEn ? 'Downloaded!' : 'Pobrano!') : isEn ? 'Download PNG' : 'Pobierz PNG'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="space-y-4">
              {isInstalled ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-200">
                    {isEn
                      ? 'The app is already installed on your device and running in fullscreen mode!'
                      : 'Aplikacja jest już zainstalowana na Twoim urządzeniu i działa w trybie pełnoekranowym!'}
                  </p>
                </div>
              ) : isInstallable ? (
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isEn ? 'Install directly on this device (WebAPK)' : 'Zainstaluj bezpośrednio na tym urządzeniu (WebAPK)'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {isEn
                        ? 'Instant home-screen installation without waiting for Google Play review.'
                        : 'Natychmiastowa instalacja na ekranie głównym bez czekania na weryfikację w Google Play.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => install()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 shrink-0 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>{isEn ? 'Install now' : 'Zainstaluj teraz'}</span>
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <Smartphone className="h-4 w-4" />
                    <span>Android (Google Chrome / Edge)</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>{isEn ? 'Open the app on your phone in Chrome.' : 'Otwórz aplikację na telefonie w przeglądarce Chrome.'}</li>
                    <li>
                      {isEn ? (
                        <>
                          Tap the <strong className="text-white">⋮</strong> menu in the top-right corner.
                        </>
                      ) : (
                        <>
                          Kliknij menu <strong className="text-white">⋮</strong> w prawym górnym rogu.
                        </>
                      )}
                    </li>
                    <li>
                      {isEn ? (
                        <>
                          Choose <strong className="text-cyan-300">“Install app”</strong>.
                        </>
                      ) : (
                        <>
                          Wybierz <strong className="text-cyan-300">„Zainstaluj aplikację”</strong>.
                        </>
                      )}
                    </li>
                    <li>
                      {isEn
                        ? 'Android will generate and install a signed WebAPK package on your home screen.'
                        : 'Android wygeneruje i zainstaluje podpisany pakiet WebAPK na pulpicie.'}
                    </li>
                  </ol>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    <Smartphone className="h-4 w-4" />
                    <span>iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>{isEn ? 'Open the app in Safari.' : 'Otwórz aplikację w przeglądarce Safari.'}</li>
                    <li>
                      {isEn ? (
                        <>
                          Tap the <strong className="text-white">Share</strong> icon on the bottom bar.
                        </>
                      ) : (
                        <>
                          Dotknij ikony <strong className="text-white">Udostępnij</strong> na dolnym pasku.
                        </>
                      )}
                    </li>
                    <li>
                      {isEn ? (
                        <>
                          Choose <strong className="text-indigo-300">“Add to Home Screen”</strong>.
                        </>
                      ) : (
                        <>
                          Wybierz <strong className="text-indigo-300">„Do ekranu początkowego”</strong>.
                        </>
                      )}
                    </li>
                    <li>
                      {isEn
                        ? 'The app will launch in fullscreen standalone mode.'
                        : 'Aplikacja uruchomi się w trybie pełnoekranowym.'}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-2.5">
              {auditChecks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60"
                >
                  <div className={`p-1 rounded-full mt-0.5 shrink-0 ${
                    item.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-800 bg-slate-950/80 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>
              {isEn ? 'Package:' : 'Pakiet:'} <strong className="text-slate-200 font-mono">com.fullstackacademy.app</strong> • Expo SDK 54 & TWA v3.2.0 (vc 10 · API 36)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            {isEn ? 'Close' : 'Zamknij'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
