import React, { useState } from 'react';
import { Download, Archive, Eye, X, Copy, Check, Image as ImageIcon, Film } from 'lucide-react';

interface PromoItem {
  id: string;
  title: string;
  filename: string;
  url: string;
  description: string;
}

const PROMO_ITEMS: PromoItem[] = [
  {
    id: 'banner',
    title: '01. Baner główny + podgląd kodu React/TS',
    filename: '01-baner-glowny-fsda.jpg',
    url: '/promo/01-baner-glowny-fsda.jpg',
    description: 'Najlepszy jako pierwsze zdjęcie na Mikroblog lub miniatura Znaleziska.',
  },
  {
    id: 'simulators',
    title: '02. 6 interaktywnych symulatorów',
    filename: '02-symulatory-fsda.jpg',
    url: '/promo/02-symulatory-fsda.jpg',
    description: 'Pokazuje Terminal Bash & Git, Studio SQL (JOIN), REST API i Event Loop JS.',
  },
  {
    id: 'roadmap',
    title: '03. Ścieżka Full Stack i Baza Wiedzy',
    filename: '03-sciezka-nauki-fsda.jpg',
    url: '/promo/03-sciezka-nauki-fsda.jpg',
    description: 'Prezentuje 15 modułów, 96 lekcji i 288 pytań oraz otwarty dostęp bez logowania.',
  },
  {
    id: 'open-access',
    title: '04. Edycja Otwarta 0 zł i metodyka 80%',
    filename: '04-edycja-otwarta-fsda.jpg',
    url: '/promo/04-edycja-otwarta-fsda.jpg',
    description: 'Podkreśla brak paywalla, gotowy szkielet kodu 80% i 12 projektów do portfolio.',
  },
];

const WYKOP_MIKROBLOG_POST = `Zbudowałem po godzinach całkowicie darmową platformę do nauki programowania od zera po polsku – Full Stack Developer Academy (https://fsda.tech).

Chciałem zrobić miejsce, w którym osoba startująca od całkowitych podstaw nie odbija się od ściany teorii i suchego żargonu, tylko od razu pisze działający kod w przeglądarce.

Co udało się spiąć w środku (wszystko za 0 zł, bez paywalla i bez podpinania karty):
• 15 modułów i 96 rozbudowanych lekcji (HTML5, CSS3, JS, TypeScript, React 19, Node.js, PostgreSQL/SQL, testy, Docker, CI/CD)
• Metodyka „rusztowania 80%” – w zadaniach dostajesz działający szkielet kodu + analogię z życia + słowniczek pojęć zamiast pustego edytora
• 6 wbudowanych symulatorów bez instalowania czegokolwiek: Terminal Bash & Git, Studio SQL (JOIN), Studio REST API, Wizualizator Event Loop, Piaskownica HTML/CSS/JS oraz symulator Live Coding
• 12 projektów do portfolio, 288 pytań quizowych, 36 fiszek SM-2 i 14 wyzwań codziennych
• Otwarta Baza Wiedzy dostępna od ręki bez zakładania konta: https://fsda.tech/baza-wiedzy
• Pełna wersja PL / EN oraz tryb ciemny i jasny

Platforma utrzymuje się wyłącznie z nieinwazyjnych reklam po zalogowaniu (na starcie nie ma żadnych płatnych planów).

Chętnie przyjmę szczery feedback od wykopowych devów i osób zaczynających naukę – co warto poprawić, jakich tematów brakuje albo co zgrzyta w UX/edytorze?

#programowanie #naukaprogramowania #webdev #frontend #backend #reactjs #javascript #chwalesie #tworzenieaplikacji`;

interface PromoAssetsPanelProps {
  onClose?: () => void;
}

export const PromoAssetsPanel: React.FC<PromoAssetsPanelProps> = ({ onClose }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ title: string; filename: string; dataUrl: string } | null>(null);
  const [copiedPost, setCopiedPost] = useState(false);
  const [videoLang, setVideoLang] = useState<'pl' | 'en'>('pl');

  const downloadViaBlob = async (url: string, filename: string, id: string) => {
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
    } catch {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = url;
      fallbackLink.download = filename;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setDownloadingId(null);
    }
  };

  const openDataUrlPreview = async (item: PromoItem) => {
    setDownloadingId(item.id + '-preview');
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      setPreviewData({ title: item.title, filename: item.filename, dataUrl });
    } catch {
      setPreviewData({ title: item.title, filename: item.filename, dataUrl: item.url });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyPost = async () => {
    try {
      await navigator.clipboard.writeText(WYKOP_MIKROBLOG_POST);
      setCopiedPost(true);
      window.setTimeout(() => setCopiedPost(false), 2000);
    } catch {
      // ignore
    }
  };

  const activeVideoUrl = videoLang === 'en' ? '/promo/fsda-promo-15s-en.mp4' : '/promo/fsda-promo-15s.mp4';
  const activeVideoFilename = videoLang === 'en' ? 'fsda-promo-15s-en.mp4' : 'fsda-promo-15s.mp4';

  return (
    <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-indigo-400" />
            <span>Wideo Promo 15s (HD) oraz Grafiki Wykop / Social</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Odtwórz dynamiczne wideo 15s (edytor kodu + metodyka 80% + symulatory) lub pobierz pliki JPG / MP4 / ZIP.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void downloadViaBlob('/promo/fsda-grafiki-wykop.zip', 'fsda-grafiki-wykop.zip', 'zip')}
            disabled={downloadingId === 'zip'}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Archive className="h-4 w-4" />
            <span>{downloadingId === 'zip' ? 'Przygotowywanie ZIP...' : 'Pobierz 4 grafiki (.ZIP)'}</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span>Wróć</span>
            </button>
          )}
        </div>
      </div>

      {/* 15s Promo Video Showcase */}
      <div className="rounded-2xl border border-indigo-500/30 bg-slate-950/90 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="h-4 w-4 text-cyan-400" />
              <span>Wideo Promocyjne 15s (1280×720 HD · 30 fps · H.264 MP4)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pokazuje metodykę 80% Ready Code, animowane wpisywanie w edytorze + podgląd na żywo oraz montaż symulatorów Git, SQL i REST API.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setVideoLang('pl')}
                className={`px-2.5 py-1 rounded-md cursor-pointer ${
                  videoLang === 'pl' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                PL
              </button>
              <button
                type="button"
                onClick={() => setVideoLang('en')}
                className={`px-2.5 py-1 rounded-md cursor-pointer ${
                  videoLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={() => void downloadViaBlob(activeVideoUrl, activeVideoFilename, 'video-' + videoLang)}
              disabled={downloadingId === 'video-' + videoLang}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors cursor-pointer disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{downloadingId === 'video-' + videoLang ? 'Pobieranie...' : `Pobierz MP4 (${videoLang.toUpperCase()})`}</span>
            </button>
          </div>
        </div>

        <video
          key={activeVideoUrl}
          src={activeVideoUrl}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full max-w-4xl mx-auto rounded-xl border border-slate-800 bg-black aspect-video"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROMO_ITEMS.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden flex flex-col">
            <img
              src={item.url}
              alt={item.title}
              className="w-full aspect-video object-cover bg-slate-950"
            />
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => void downloadViaBlob(item.url, item.filename, item.id)}
                  disabled={downloadingId === item.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadingId === item.id ? 'Pobieranie...' : 'Pobierz JPG'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void openDataUrlPreview(item)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Pełny rozmiar / Zapisz ręcznie</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white">Gotowy wpis na Wykop Mikroblog</h3>
          <button
            type="button"
            onClick={() => void handleCopyPost()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            {copiedPost ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedPost ? 'Skopiowano!' : 'Kopiuj tekst'}</span>
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/70 rounded-lg p-3 border border-slate-800">
          {WYKOP_MIKROBLOG_POST}
        </pre>
      </div>

      {previewData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewData(null)}
        >
          <div
            className="max-w-4xl w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">{previewData.title}</h4>
                <p className="text-xs text-slate-400">
                  Kliknij obrazek prawym przyciskiem myszy i wybierz „Zapisz grafikę jako…” ({previewData.filename})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <img
              src={previewData.dataUrl}
              alt={previewData.title}
              className="w-full rounded-xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
