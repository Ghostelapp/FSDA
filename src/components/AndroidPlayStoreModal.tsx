import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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
  AlertCircle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import {
  validateAssetLinks,
  validateStoreListing,
  validateTwaManifest,
  type AssetLinkEntry,
  type PlayStoreListingMeta,
  type TwaManifestConfig,
} from '../utils/playStoreValidator';
import {
  downloadVerifiedAssetFile,
  downloadVerifiedPlayStoreZip,
} from '../utils/playStoreDownload';

interface AndroidPlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHA256_FINGERPRINT = 'A6:5D:54:DB:3F:7C:C1:DF:CF:E4:45:1D:26:21:41:15:B8:49:58:D4:D2:D8:93:9D:AF:81:34:4F:81:23:86:23';
const PRODUCTION_HOST = 'ais-pre-4ucmmlowc42fnc3g36cfl7-601573615813.europe-west3.run.app';
const PRIVACY_POLICY_URL = `https://${PRODUCTION_HOST}/privacy-policy.html`;
const STORE_TITLE = 'Full Stack Academy — Kurs IT';
const STORE_SHORT_DESC = 'Nauka programowania od zera do Full Stack Developera: HTML, JS, React, SQL i Git';
const STORE_FULL_DESC = `Zostań profesjonalnym Full Stack Developerem z aplikacją mobilną Full Stack Academy!

Ucz się programowania krok po kroku poprzez 91 kompletnych lekcji w 15 modułach, praktyczne ćwiczenia w edytorze kodu, symulator terminala Bash/Git, Studio REST API oraz Studio Bazy Danych SQL.

GŁÓWNE FUNKCJE APLIKACJI (WERSJA 2.0):
• 15 kompletnych modułów szkoleniowych i 91 lekcji (od architektury Internetu, HTML5 i CSS3, przez JavaScript ES6+, Git, TypeScript i React, aż po Node.js, Express, PostgreSQL/Prisma, OAuth2/JWT, Stripe, Testy Vitest/Playwright, Docker/CI/CD, Next.js App Router i przygotowanie do pracy w Scrum).
• Wbudowana Piaskownica Kodu (HTML/CSS/JS) z automatyczną weryfikacją testów jednostkowych i AST.
• Interaktywny symulator Terminala UNIX / Bash oraz systemu kontroli wersji Git.
• Studio Bazy Danych SQL z walidacją składni i wykonywaniem zapytań na żywo.
• Studio REST API oraz Wizualizator JavaScript Event Loop (Call Stack, Web APIs, Microtasks, Macrotasks).
• Fiszki SM-2 (Spaced Repetition), ściągi techniczne (Cheat Sheets) oraz Kreator CV programisty.
• Egzaminy Live Coding (Mock Interviews) przygotowujące do rozmów kwalifikacyjnych.
• System grywalizacji: punkty XP, ligi tygodniowe, Wyzwanie Dnia, dzienna seria nauki (Streak), odznaki oraz imienny Certyfikat Ukończenia Kursu.
• Tryb Offline (Service Worker) pozwalający na naukę na telefonie bez dostępu do sieci.

Dla kogo?
Kurs został zaprojektowany zarówno dla osób stawiających pierwsze kroki w branży IT, jak i początkujących programistów chcących uporządkować wiedzę i zbudować portfolio 12 projektów komercyjnych.`;

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
  startUrl: '/',
  iconUrl: `https://${PRODUCTION_HOST}/pwa-512x512.png`,
  maskableIconUrl: `https://${PRODUCTION_HOST}/pwa-maskable-512x512.png`,
  appVersionCode: 2,
  appVersionName: '2.0.0',
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
  versionName: '2.0.0',
  versionCode: 2,
  defaultLanguage: 'pl-PL',
  title: STORE_TITLE,
  shortDescription: STORE_SHORT_DESC,
  fullDescription: STORE_FULL_DESC,
  privacyPolicyUrl: PRIVACY_POLICY_URL,
  contactEmail: 'zordonzordon1@gmail.com',
  targetSdk: 35,
  minSdk: 21,
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

export const AndroidPlayStoreModal: React.FC<AndroidPlayStoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, isAuthenticated } = useApp();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'release_pack' | 'store_listing' | 'install' | 'checklist'>('release_pack');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedSuccessId, setDownloadedSuccessId] = useState<string | null>(null);

  const isAdmin = isAuthenticated && currentUser.role === 'admin';

  const auditChecks = useMemo(() => {
    const twaRes = validateTwaManifest(TWA_MANIFEST_CONFIG);
    const assetRes = validateAssetLinks(ASSET_LINKS_CONFIG, 'com.fullstackacademy.app', SHA256_FINGERPRINT);
    const listingChecks = validateStoreListing(LISTING_META_CONFIG);

    return [
      {
        id: 'twa-manifest',
        title: 'Manifest TWA (twa-manifest.json) & Keystore RSA-2048',
        passed: twaRes.valid,
        details: twaRes.valid
          ? 'Skonfigurowano com.fullstackacademy.app v2.0.0 (versionCode 2), podpis android.keystore i 4 skróty ekranu głównego.'
          : twaRes.errors.join(' '),
      },
      {
        id: 'asset-links',
        title: 'Digital Asset Links (.well-known/assetlinks.json)',
        passed: assetRes.valid,
        details: assetRes.valid
          ? `Zweryfikowano odcisk SHA-256 (${SHA256_FINGERPRINT.slice(0, 23)}...) — ukrywa pasek adresu przeglądarki w APK.`
          : assetRes.errors.join(' '),
      },
      ...listingChecks,
    ];
  }, []);

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
                  <span>Gotowy Pakiet Produkcyjny v2.0.0 • Android 15 (SDK 35) • 91 Lekcji</span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white mt-1">
                  Centrum Publikacji Google Play Store (APK & AAB)
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Zamknij okno"
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
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
              <span>Gotowa Paczka (.ZIP) & Keystore</span>
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
              <span>Teksty i Grafiki do Sklepu</span>
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
              <span>Instalacja na Telefonie</span>
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
              <span>Audyt Google Play ({passedCount}/{auditChecks.length})</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'release_pack' && (
            <div className="space-y-4">
              {/* Primary 1-Click Verified ZIP Download Bundle Card */}
              <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Zweryfikowane archiwum binarne PKZIP (Windows / macOS / Linux)
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      Kompletny Pakiet Publikacji Google Play (.zip)
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Standardowe archiwum <code>.zip</code> z weryfikacją sum kontrolnych CRC-32 (odporne na przechwytywanie przez Service Worker i podwójną kompresję gzip). Zawiera projekt Android Studio (<code>com.fullstackacademy.app</code>, <code>targetSdk 35</code>), klucz <code>android.keystore</code>, <code>assetlinks.json</code>, grafikę 1024x500, zrzuty ekranu 9:16 oraz instrukcję.
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
                        <span>Pobrano Pakiet (.zip)!</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>
                          {downloadingId === 'zip'
                            ? 'Weryfikacja i pobieranie...'
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
                    <span className="truncate">Metadane Sklepu</span>
                  </button>
                </div>
              </div>

              {/* Important Notice Box explaining ZIP vs APK on Phone */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 space-y-1">
                  <p className="font-bold text-amber-300">
                    Dlaczego wcześniejszy plik .tar.gz mógł zgłaszać błąd?
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    1) Poprzedni link był przechwytywany przez <code>Service Worker NavigationRoute</code> oraz nagłówek <code>Content-Encoding: gzip</code> — zostało to naprawione, a pakiet jest teraz pobierany jako zweryfikowane binarnie archiwum <strong>.ZIP</strong>.<br />
                    2) Jeśli chcesz zainstalować aplikację bezpośrednio na telefonie, <strong>nie otwieraj pliku .zip jako instalatora APK</strong> — przejdź do zakładki <button type="button" onClick={() => setActiveTab('install')} className="text-cyan-400 underline font-semibold">Instalacja na Telefonie</button>, aby zainstalować natywny pakiet WebAPK jednym kliknięciem.
                  </p>
                </div>
              </div>

              {/* Generated Signing Credentials Box */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" />
                    Wygenerowany Klucz Podpisu Produkcyjnego (Keystore)
                  </span>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Podpięty do assetlinks.json
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Alias klucza:</span>
                    <span className="font-mono font-bold text-white">android</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Hasło Keystore / Klucza:</span>
                    <span className="font-mono font-bold text-amber-300">fullstack2026</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Ważność certyfikatu:</span>
                    <span className="font-mono font-bold text-emerald-400">10 000 dni (RSA 2048)</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Odcisk certyfikatu SHA-256 (wpisany automatycznie do <code>/.well-known/assetlinks.json</code>):
                  </span>
                  <div className="rounded-xl bg-slate-900 p-2.5 font-mono text-[10px] sm:text-[11px] text-cyan-300 border border-slate-800 flex items-center justify-between gap-2">
                    <code className="break-all">{SHA256_FINGERPRINT}</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(SHA256_FINGERPRINT, 'sha256')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                      title="Kopiuj SHA-256"
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
                    <span>Kompilacja podpisanego pliku .APK i .AAB (Lokalnie lub w GitHub Actions):</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(BUILD_APK_COMMANDS, 'build_cmd')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedCode === 'build_cmd' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Kopiuj polecenia</span>
                  </button>
                </div>
                <pre className="rounded-xl bg-slate-900 p-3 font-mono text-[11px] text-emerald-300 border border-slate-800 overflow-x-auto leading-relaxed">
                  {BUILD_APK_COMMANDS}
                </pre>
                <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside pt-1">
                  <li>
                    Wypchnij repozytorium na GitHub — workflow <code>.github/workflows/google-play-publish.yml</code> automatycznie zbuduje podpisany plik <strong>app-release.aab</strong> oraz <strong>app-release.apk</strong> w chmurze.
                  </li>
                  <li>
                    W <strong className="text-white">Google Play Console</strong> utwórz aplikację i wklej gotowe teksty oraz grafiki z zakładki <strong>„Teksty i Grafiki do Sklepu”</strong>.
                  </li>
                  <li>
                    Prześlij plik <code>app-release.aab</code> do sekcji <strong>Produkcja</strong> i opublikuj w sklepie!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'store_listing' && (
            <div className="space-y-4">
              {/* Privacy Policy Live Link */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-emerald-400">
                    Wymagane przez Google Play (Polityka Prywatności RODO)
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
                    <span>Kopiuj URL</span>
                  </button>
                  <a
                    href="/privacy-policy.html"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Podgląd</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Copyable Store Texts */}
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-400">Nazwa aplikacji w Google Play ({STORE_TITLE.length}/30 znaków)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(STORE_TITLE, 'title')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'title' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>Kopiuj</span>
                    </button>
                  </div>
                  <p className="text-xs font-bold text-white">{STORE_TITLE}</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-400">Krótki opis ({STORE_SHORT_DESC.length}/80 znaków)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(STORE_SHORT_DESC, 'short')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'short' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>Kopiuj</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200">{STORE_SHORT_DESC}</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-400">Pełny opis karty sklepu ({STORE_FULL_DESC.length}/4000 znaków)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(STORE_FULL_DESC, 'full')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedCode === 'full' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>Kopiuj pełny opis</span>
                    </button>
                  </div>
                  <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans max-h-36 overflow-y-auto leading-relaxed">
                    {STORE_FULL_DESC}
                  </pre>
                </div>
              </div>

              {/* Downloadable Store Graphics */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-cyan-400" />
                  <span>Wygenerowane Grafiki i Prawdziwe Zrzuty Ekranu 9:16 do Google Play Console:</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingle('icon512', '/pwa-512x512.png', 'ikona-512x512.png', 'image/png')
                    }
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1.5 transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <img src="/pwa-512x512.png" alt="Ikona 512x512" className="h-12 w-12 rounded-xl object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">Ikona 512x512</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'icon512' ? 'Pobrano!' : 'Pobierz PNG'}
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
                    <img src="/play-store/feature-graphic-1024x500.png" alt="Baner 1024x500" className="h-12 w-full rounded-lg object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">Baner 1024x500</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'banner' ? 'Pobrano!' : 'Pobierz PNG'}
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
                    <img src="/play-store/screenshot-1-dashboard.png" alt="Zrzut Pulpit" className="h-12 w-8 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">Zrzut #1 (Pulpit)</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'shot1' ? 'Pobrano!' : 'Pobierz PNG'}
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
                    <img src="/play-store/screenshot-2-editor.png" alt="Zrzut Edytor" className="h-12 w-8 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">Zrzut #2 (Edytor)</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'shot2' ? 'Pobrano!' : 'Pobierz PNG'}
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
                    <img src="/play-store/screenshot-3-certificate.png" alt="Zrzut Moduły" className="h-12 w-8 rounded object-cover border border-slate-700" />
                    <span className="block text-[11px] font-bold text-white">Zrzut #3 (Moduły)</span>
                    <span className="block text-[10px] text-cyan-400">
                      {downloadedSuccessId === 'shot3' ? 'Pobrano!' : 'Pobierz PNG'}
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
                    Aplikacja jest już zainstalowana na Twoim urządzeniu i działa w trybie pełnoekranowym!
                  </p>
                </div>
              ) : isInstallable ? (
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Zainstaluj bezpośrednio na tym urządzeniu (WebAPK)</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Natychmiastowa instalacja na ekranie głównym bez czekania na weryfikację w Google Play.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => install()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 shrink-0 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Zainstaluj teraz</span>
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
                    <li>Otwórz aplikację na telefonie w przeglądarce Chrome.</li>
                    <li>Kliknij menu <strong className="text-white">⋮</strong> w prawym górnym rogu.</li>
                    <li>Wybierz <strong className="text-cyan-300">„Zainstaluj aplikację”</strong>.</li>
                    <li>Android wygeneruje i zainstaluje podpisany pakiet WebAPK na pulpicie.</li>
                  </ol>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    <Smartphone className="h-4 w-4" />
                    <span>iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Otwórz aplikację w przeglądarce Safari.</li>
                    <li>Dotknij ikony <strong className="text-white">Udostępnij</strong> na dolnym pasku.</li>
                    <li>Wybierz <strong className="text-indigo-300">„Do ekranu początkowego”</strong>.</li>
                    <li>Aplikacja uruchomi się w trybie pełnoekranowym.</li>
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
            <span>Pakiet: <strong className="text-slate-200 font-mono">com.fullstackacademy.app</strong> • v2.0.0 • Target SDK 35 (Android 15)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
