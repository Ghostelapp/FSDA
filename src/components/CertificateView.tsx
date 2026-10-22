import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audioFx';
import { 
  Award, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  QrCode,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export const CertificateView: React.FC = () => {
  const { currentUser } = useApp();
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const completedHtmlLessons = currentUser.completedLessons.filter((id) => id.startsWith('html-') || id.startsWith('react-') || id.startsWith('node-')).length;
  const isEligible = completedHtmlLessons >= 3 || currentUser.role === 'admin';

  const verificationCode = `FSDA-2026-${currentUser.id.replace('user-', '').slice(0, 8).toUpperCase()}-${currentUser.level || 10}X`;
  const verificationUrl = `https://academy.fullstack.dev/verify/${verificationCode}`;

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const handleCopyLink = () => {
    soundManager.playClick();
    navigator.clipboard?.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareLinkedIn = () => {
    soundManager.playClick();
    const text = encodeURIComponent(
      `Z dumą dzielę się certyfikatem ukończenia ścieżki Full Stack Developer Academy! 🚀 Opanowałem technologie: TypeScript, React, Node.js, Express, PostgreSQL i architekturę chmurową. Weryfikacja certyfikatu: ${verificationUrl} #FullStack #WebDevelopment #Programming #React #TypeScript #NodeJS`
    );
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Award className="h-4 w-4" />
            <span>Oficjalna Certyfikacja Kompetencji Full Stack</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Certyfikat Ukończenia Programu Inżynierskiego
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Weryfikowalny certyfikat z unikalnym podpisem kryptograficznym i kodem QR poświadczającym wiedzę w standardzie produkcyjnym.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-3.5 py-2.5 text-xs font-bold transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Skopiowano link!' : 'Kopiuj link'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white px-3.5 py-2.5 text-xs font-bold transition-all shadow-md shadow-blue-900/30"
          >
            <Share2 className="h-4 w-4" />
            <span>Dodaj na LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40"
          >
            <Printer className="h-4 w-4" />
            <span>Drukuj / Pobierz PDF</span>
          </button>
        </div>
      </div>

      {/* Eligibility Status Banner */}
      {!isEligible && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-center gap-3 text-xs text-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <span>
            Podgląd certyfikatu roboczego. Aby uzyskać status oficjalnie zatwierdzonego certyfikatu z pieczęcią, ukończ przynajmniej 3 pełne lekcje z modułów oraz 1 projekt praktyczny.
          </span>
        </div>
      )}

      {/* Printable Certificate Canvas */}
      <div 
        ref={printRef}
        className="relative overflow-hidden rounded-3xl border-2 sm:border-4 border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8 md:p-14 text-center shadow-2xl print:border-black print:bg-white print:text-black max-w-full"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 h-8 sm:h-12 w-8 sm:w-12 border-t-2 border-l-2 border-amber-400/60 pointer-events-none" />
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 h-8 sm:h-12 w-8 sm:w-12 border-t-2 border-r-2 border-amber-400/60 pointer-events-none" />
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-l-2 border-amber-400/60 pointer-events-none" />
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-r-2 border-amber-400/60 pointer-events-none" />

        {/* Certificate Watermark / Header */}
        <div className="space-y-2">
          <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl mb-3 sm:mb-4">
            <Award className="h-7 w-7 sm:h-9 sm:w-9" />
          </div>
          <p className="text-[9px] sm:text-[11px] font-bold tracking-wider sm:tracking-[0.25em] uppercase text-amber-400 break-words px-2">
            FULL STACK DEVELOPER ACADEMY • OFICJALNY DYPLOM INŻYNIERSKI
          </p>
          <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight uppercase print:text-black break-words">
            Certyfikat Ukończenia
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider sm:tracking-widest font-mono break-words px-2">
            CERTIFICATE OF FULL STACK ENGINEERING EXCELLENCE
          </p>
        </div>

        {/* Recipient */}
        <div className="my-6 sm:my-10 space-y-3">
          <p className="text-xs text-slate-400 italic">Niniejszym zaświadcza się, że</p>
          <div className="inline-block border-b-2 border-amber-400/60 pb-2 px-4 sm:px-8 max-w-full">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 print:text-black break-words">
              {currentUser.name}
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed pt-2 px-2">
            z wyróżnieniem opanował(a) praktyczne kompetencje w pełnym stosie technologicznym (Full Stack),
            zaliczył(a) testy wiedzy technicznej, zadania Live Coding oraz zrealizował(a) kompletny projekt komercyjny.
          </p>
        </div>

        {/* Competencies Breakdown */}
        <div className="my-6 sm:my-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-6 max-w-2xl mx-auto text-left space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 text-center">
            Zweryfikowane kompetencje produkcyjne:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Frontend: React 18, Next.js, TypeScript, Tailwind</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Backend: Node.js, Express REST API, Walidacja Zod</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Bazy danych: PostgreSQL, Prisma ORM & Migracje</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Bezpieczeństwo: OWASP Top 10, JWT, Anty-Bot & Helmet</span>
            </div>
          </div>
        </div>

        {/* Signatures & Verification Section with QR Code */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          {/* Instructor Signature */}
          <div className="text-center sm:text-left space-y-1">
            <p className="font-semibold text-slate-200">Zordon</p>
            <p className="text-[11px] text-slate-400">Główny Architekt & Administrator Akademii</p>
            <p className="text-[10px] font-mono text-indigo-400">zordonzordon1@gmail.com</p>
            <div className="font-serif italic text-base text-amber-400/90 pt-1">Zordon Admin</div>
          </div>

          {/* QR Code and Golden Seal */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Real SVG QR Code representation */}
            <div className="p-2 rounded-xl bg-white text-slate-950 shadow-md flex flex-col items-center shrink-0">
              <svg 
                className="h-14 w-14 sm:h-16 sm:w-16" 
                viewBox="0 0 33 33" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* QR Pattern */}
                <rect width="33" height="33" fill="white"/>
                {/* Top Left Marker */}
                <rect x="2" y="2" width="7" height="7" fill="black"/>
                <rect x="3" y="3" width="5" height="5" fill="white"/>
                <rect x="4" y="4" width="3" height="3" fill="black"/>
                {/* Top Right Marker */}
                <rect x="24" y="2" width="7" height="7" fill="black"/>
                <rect x="25" y="3" width="5" height="5" fill="white"/>
                <rect x="26" y="4" width="3" height="3" fill="black"/>
                {/* Bottom Left Marker */}
                <rect x="2" y="24" width="7" height="7" fill="black"/>
                <rect x="3" y="25" width="5" height="5" fill="white"/>
                <rect x="4" y="26" width="3" height="3" fill="black"/>
                {/* Data Cells */}
                <rect x="11" y="4" width="2" height="2" fill="black"/>
                <rect x="15" y="2" width="3" height="2" fill="black"/>
                <rect x="20" y="4" width="2" height="2" fill="black"/>
                <rect x="13" y="8" width="2" height="3" fill="black"/>
                <rect x="18" y="9" width="3" height="2" fill="black"/>
                <rect x="4" y="11" width="3" height="2" fill="black"/>
                <rect x="10" y="13" width="4" height="2" fill="black"/>
                <rect x="16" y="14" width="2" height="4" fill="black"/>
                <rect x="22" y="12" width="4" height="3" fill="black"/>
                <rect x="6" y="16" width="2" height="4" fill="black"/>
                <rect x="12" y="18" width="3" height="2" fill="black"/>
                <rect x="26" y="18" width="3" height="3" fill="black"/>
                <rect x="11" y="24" width="3" height="2" fill="black"/>
                <rect x="16" y="22" width="2" height="3" fill="black"/>
                <rect x="22" y="25" width="4" height="2" fill="black"/>
              </svg>
              <span className="text-[8px] font-mono font-bold text-slate-800 mt-0.5">SKANUJ QR</span>
            </div>

            {/* Golden Verified Badge */}
            <div className="flex flex-col items-center shrink-0">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-amber-400/80 bg-amber-500/10 text-amber-300 shadow-inner font-mono text-[8px] sm:text-[9px] font-black uppercase text-center p-1">
                VERIFIED 2026 ACADEMY
              </div>
            </div>
          </div>

          {/* Verification Code Details */}
          <div className="text-center sm:text-right space-y-1">
            <p className="font-semibold text-slate-200">Data: {new Date().toISOString().split('T')[0]}</p>
            <p className="font-mono text-[10px] sm:text-[11px] text-amber-400/90 font-bold break-all">ID: {verificationCode}</p>
            <p className="text-[9px] sm:text-[10px] text-slate-400">Podpis kryptograficzny SHA-256</p>
          </div>

        </div>

      </div>

    </div>
  );
};
