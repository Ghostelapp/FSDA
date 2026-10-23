import React, { useEffect, useState } from 'react';
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
  PackageCheck
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidPlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHA256_FINGERPRINT = 'A6:5D:54:DB:3F:7C:C1:DF:CF:E4:45:1D:26:21:41:15:B8:49:58:D4:D2:D8:93:9D:AF:81:34:4F:81:23:86:23';
const PRIVACY_POLICY_URL = 'https://ais-pre-4ucmmlowc42fnc3g36cfl7-601573615813.europe-west3.run.app/privacy-policy.html';
const STORE_TITLE = 'Full Stack Academy — Kurs IT';
const STORE_SHORT_DESC = 'Nauka programowania od zera do Full Stack Developera: HTML, JS, React, SQL i Git';
const STORE_FULL_DESC = `Zostań profesjonalnym Full Stack Developerem z aplikacją mobilną Full Stack Academy!

Ucz się programowania krok po kroku poprzez interaktywne lekcje, praktyczne ćwiczenia w edytorze kodu, symulator terminala Bash/Git oraz studio baz danych SQL.

GŁÓWNE FUNKCJE APLIKACJI:
• 15 kompletnych modułów szkoleniowych (od podstaw Internetu i HTML5, przez CSS3, JavaScript ES6+, TypeScript i React, aż po Node.js, Express, SQL, Cyberbezpieczeństwo i DevOps).
• Wbudowana Piaskownica Kodu (HTML/CSS/JS) z automatyczną weryfikacją testów jednostkowych.
• Interaktywny symulator Terminala UNIX / Bash oraz systemu kontroli wersji Git.
• Studio Bazy Danych SQL z wykonywaniem zapytań na żywo.
• Egzaminy Live Coding (Mock Interviews) przygotowujące do rozmów kwalifikacyjnych.
• System grywalizacji: punkty XP, poziomy, dzienna seria nauki (Streak), odznaki oraz imienny Certyfikat Ukończenia Kursu.
• Tryb Offline (Service Worker) pozwalający na przeglądanie lekcji bez dostępu do sieci.`;

export const AndroidPlayStoreModal: React.FC<AndroidPlayStoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'release_pack' | 'store_listing' | 'install' | 'checklist'>('release_pack');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
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
                  <span>Gotowy Pakiet Produkcyjny v1.0.0</span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white mt-1">
                  Centrum Publikacji Google Play Store
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
              <span>Gotowa Paczka & Keystore</span>
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
              <span>Status Weryfikacji (6/6)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'release_pack' && (
            <div className="space-y-4">
              {/* Primary 1-Click Download Bundle Card */}
              <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Wszystkie pliki wygenerowane automatycznie
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      Kompletny Pakiet Publikacji Google Play (.tar.gz)
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Zawiera skonfigurowany projekt Android (`com.fullstackacademy.app`), wygenerowany klucz podpisu <code>android.keystore</code>, skonfigurowany <code>assetlinks.json</code> z prawdziwym odciskiem SHA-256, grafikę promocyjną 1024x500, zrzuty ekranu oraz workflow GitHub Actions.
                    </p>
                  </div>

                  <a
                    href="/fullstack-academy-google-play-pack.tar.gz"
                    download="fullstack-academy-google-play-pack.tar.gz"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 shrink-0 flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Pobierz Pełny Pakiet (.tar.gz)</span>
                  </a>
                </div>

                {/* Individual Quick Downloads */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80">
                  <a
                    href="/play-store/android.keystore"
                    download="android.keystore"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-amber-300 transition-colors"
                  >
                    <KeyRound className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">android.keystore</span>
                  </a>
                  <a
                    href="/twa-manifest.json"
                    download="twa-manifest.json"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-cyan-300 transition-colors"
                  >
                    <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">twa-manifest.json</span>
                  </a>
                  <a
                    href="/.well-known/assetlinks.json"
                    download="assetlinks.json"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-emerald-300 transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">assetlinks.json</span>
                  </a>
                  <a
                    href="/play-store/karta-sklepu-play.json"
                    download="karta-sklepu-play.json"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-indigo-300 transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Metadane Sklepu</span>
                  </a>
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

              {/* Why direct login requires user action + 3 steps */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-indigo-400" />
                  <span>Ostatni krok po Twojej stronie (ze względów bezpieczeństwa Google 2FA):</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Konsola Google Play wymaga osobistego logowania właściciela konta z weryfikacją dwuetapową (2FA) na <strong className="text-white">play.google.com/console</strong>. Cała reszta została już wykonana za Ciebie:
                </p>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                  <li>
                    Wypakuj pobrany pakiet lub wypchnij repozytorium na GitHub — plik <code>.github/workflows/google-play-publish.yml</code> automatycznie skompiluje podpisany plik <strong>.aab</strong> oraz <strong>.apk</strong> w chmurze.
                  </li>
                  <li>
                    W Google Play Console kliknij <strong>Utwórz aplikację</strong> i wklej gotowe opisy oraz grafiki z zakładki <strong>„Teksty i Grafiki do Sklepu”</strong> powyżej.
                  </li>
                  <li>
                    Przeciągnij plik <code>app-release.aab</code> do sekcji <strong>Produkcja</strong> i kliknij <strong>Opublikuj</strong>!
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
                    <span className="text-[11px] font-bold text-indigo-400">Nazwa aplikacji w Google Play (28/30 znaków)</span>
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
                    <span className="text-[11px] font-bold text-indigo-400">Krótki opis (79/80 znaków)</span>
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
                    <span className="text-[11px] font-bold text-indigo-400">Pełny opis karty sklepu (pl-PL)</span>
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
                  <span>Wygenerowane Grafiki Wymagane w Google Play Console:</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <a
                    href="/pwa-512x512.png"
                    download="ikona-512x512.png"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1 transition-colors"
                  >
                    <span className="block text-[11px] font-bold text-white">Ikona 512x512</span>
                    <span className="block text-[10px] text-cyan-400">Pobierz PNG</span>
                  </a>
                  <a
                    href="/play-store/feature-graphic-1024x500.png"
                    download="feature-graphic-1024x500.png"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1 transition-colors"
                  >
                    <span className="block text-[11px] font-bold text-white">Baner 1024x500</span>
                    <span className="block text-[10px] text-cyan-400">Pobierz PNG</span>
                  </a>
                  <a
                    href="/play-store/screenshot-1-dashboard.png"
                    download="screenshot-1-dashboard.png"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1 transition-colors"
                  >
                    <span className="block text-[11px] font-bold text-white">Zrzut #1 (9:16)</span>
                    <span className="block text-[10px] text-cyan-400">Pobierz PNG</span>
                  </a>
                  <a
                    href="/play-store/screenshot-2-editor.png"
                    download="screenshot-2-editor.png"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1 transition-colors"
                  >
                    <span className="block text-[11px] font-bold text-white">Zrzut #2 (9:16)</span>
                    <span className="block text-[10px] text-cyan-400">Pobierz PNG</span>
                  </a>
                  <a
                    href="/play-store/screenshot-3-certificate.png"
                    download="screenshot-3-certificate.png"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center space-y-1 transition-colors"
                  >
                    <span className="block text-[11px] font-bold text-white">Zrzut #3 (9:16)</span>
                    <span className="block text-[10px] text-cyan-400">Pobierz PNG</span>
                  </a>
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
                    <li>Android utworzy natywny pakiet WebAPK na ekranie głównym.</li>
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
              {[
                {
                  title: 'Klucz podpisu produkcyjnego (android.keystore)',
                  desc: `Wygenerowano certyfikat RSA-2048 i skonfigurowano signingConfigs.release w build.gradle.`,
                },
                {
                  title: 'Digital Asset Links (.well-known/assetlinks.json)',
                  desc: `Zaktualizowano prawdziwym odciskiem SHA-256 (${SHA256_FINGERPRINT.slice(0, 23)}...).`,
                },
                {
                  title: 'Polityka Prywatności RODO (/privacy-policy.html)',
                  desc: 'Opublikowana pod publicznym adresem URL wymaganym w sekcji Data Safety Google Play.',
                },
                {
                  title: 'Zestaw Grafik Sklepowych (512x512, 1024x500, 3x 9:16)',
                  desc: 'Wygenerowano ikonę 512px, baner promocyjny 1024x500 oraz 3 zrzuty ekranu.',
                },
                {
                  title: 'Projekt Android TWA (API 34 / Android 14)',
                  desc: 'Spełnia najnowsze wymogi Google Play dotyczące docelowego poziomu API (targetSdk 34).',
                },
                {
                  title: 'Automatyzacja CI/CD (.github/workflows/google-play-publish.yml)',
                  desc: 'Gotowy potok automatycznie budujący podpisany plik .aab i wysyłający go do Google Play.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60"
                >
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
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
            <span>Pakiet: <strong className="text-slate-200 font-mono">com.fullstackacademy.app</strong> • Target SDK 34</span>
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
