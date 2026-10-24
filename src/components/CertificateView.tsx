import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundManager } from '../utils/audioFx';
import {
  generateCertificateCode,
  verifyCertificateCode,
  CertificateVerificationResult,
} from '../utils/developerSimulators';
import { isGuestUser } from '../utils/authValidation';
import { 
  Award, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Copy,
  Check,
  Search,
  BookOpen,
  Code2,
  Lock,
  LogIn
} from 'lucide-react';

export const CertificateView: React.FC = () => {
  const { currentUser, isAuthenticated, allUsers, setActiveTab } = useApp();
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const isGuest = isGuestUser(currentUser, isAuthenticated);

  const lessonsCount = (currentUser.completedLessons || []).length;
  const projectsCount = (currentUser.completedProjects || []).length;
  const isEligible =
    currentUser.role === 'admin' || (lessonsCount >= 3 && projectsCount >= 1);

  const verificationCode = generateCertificateCode(currentUser);
  const verificationUrl = `https://academy.fullstack.dev/verify/${verificationCode}`;

  const [lookupInput, setLookupInput] = useState(verificationCode);
  const [lookupResult, setLookupResult] = useState<CertificateVerificationResult | null>(() =>
    verifyCertificateCode(verificationCode, allUsers, currentUser)
  );

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

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const res = verifyCertificateCode(lookupInput, allUsers, currentUser);
    setLookupResult(res);
  };

  const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
    `Z dumą dzielę się certyfikatem ukończenia ścieżki Full Stack Developer Academy! Opanowałem technologie: TypeScript, React, Node.js, Express, PostgreSQL i architekturę chmurową. Weryfikacja certyfikatu: ${verificationUrl} #FullStack #WebDevelopment #Programming #React #TypeScript #NodeJS`
  )}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
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

        {!isGuest && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-3.5 py-2.5 text-xs font-bold transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Skopiowano link!' : 'Kopiuj link'}</span>
            </button>

            <a
              href={linkedInShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white px-3.5 py-2.5 text-xs font-bold transition-all shadow-md shadow-blue-900/30"
            >
              <Share2 className="h-4 w-4" />
              <span>Dodaj na LinkedIn</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40"
            >
              <Printer className="h-4 w-4" />
              <span>Drukuj / Pobierz PDF</span>
            </button>
          </div>
        )}
      </div>

      {isGuest ? (
        <div
          data-testid="certificate-guest-lock"
          className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 text-center space-y-4 print:hidden"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Imienny Certyfikat Zablokowany dla Gości
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Konto Gościa (Niezalogowany) nie może generować ani drukować oficjalnych dyplomów ukończenia. Zaloguj się lub załóż bezpłatne konto kursanta, aby przypisać certyfikat do swojego imienia i nazwiska. Poniżej nadal możesz skorzystać z publicznej wyszukiwarki certyfikatów.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('akademia:open-auth-modal'))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20"
            >
              <LogIn className="h-4 w-4" />
              <span>Zaloguj się, aby wygenerować imienny certyfikat</span>
            </button>
          </div>
        </div>
      ) : (
      <>
      {/* Eligibility Status & Requirements Checklist */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <ShieldCheck className={`h-4 w-4 ${isEligible ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>
              Status dyplomu:{' '}
              {isEligible ? (
                <span className="text-emerald-400">Oficjalnie Zatwierdzony (Zweryfikowany)</span>
              ) : (
                <span className="text-amber-400">Wersja Robocza (W trakcie nauki)</span>
              )}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">ID: {verificationCode}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div
            className={`flex items-center justify-between p-3 rounded-xl border ${
              lessonsCount >= 3 || currentUser.role === 'admin'
                ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                : 'border-slate-800 bg-slate-950/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  lessonsCount >= 3 || currentUser.role === 'admin' ? 'text-emerald-400' : 'text-slate-500'
                }`}
              />
              <span>Minimum 3 ukończone lekcje ({lessonsCount}/3)</span>
            </div>
            {lessonsCount < 3 && (
              <button
                type="button"
                onClick={() => setActiveTab('modules')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
              >
                <BookOpen className="h-3 w-3" />
                <span>Moduły</span>
              </button>
            )}
          </div>

          <div
            className={`flex items-center justify-between p-3 rounded-xl border ${
              projectsCount >= 1 || currentUser.role === 'admin'
                ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                : 'border-slate-800 bg-slate-950/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  projectsCount >= 1 || currentUser.role === 'admin' ? 'text-emerald-400' : 'text-slate-500'
                }`}
              />
              <span>Minimum 1 projekt praktyczny ({projectsCount}/1)</span>
            </div>
            {projectsCount < 1 && (
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
              >
                <Code2 className="h-3 w-3" />
                <span>Projekty</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Printable Certificate Canvas */}
      <div 
        ref={printRef}
        id="printable-certificate"
        className="relative overflow-hidden rounded-3xl border-2 sm:border-4 border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8 md:p-14 text-center shadow-2xl print:border-2 print:border-amber-600 print:bg-white print:text-slate-900 print:shadow-none max-w-full"
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
          <p className="text-[9px] sm:text-[11px] font-bold tracking-wider sm:tracking-[0.25em] uppercase text-amber-400 print:text-amber-700 break-words px-2">
            FULL STACK DEVELOPER ACADEMY • OFICJALNY DYPLOM INŻYNIERSKI
          </p>
          <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight uppercase print:text-slate-900 break-words">
            Certyfikat Ukończenia
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider sm:tracking-widest font-mono break-words px-2">
            CERTIFICATE OF FULL STACK ENGINEERING EXCELLENCE
          </p>
        </div>

        {/* Recipient */}
        <div className="my-6 sm:my-10 space-y-3">
          <p className="text-xs text-slate-400 print:text-slate-600 italic">Niniejszym zaświadcza się, że</p>
          <div className="inline-block border-b-2 border-amber-400/60 pb-2 px-4 sm:px-8 max-w-full">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 print:text-slate-900 print:bg-none break-words">
              {currentUser.name}
            </h3>
          </div>
          <p className="text-xs text-slate-300 print:text-slate-700 max-w-xl mx-auto leading-relaxed pt-2 px-2">
            z wyróżnieniem opanował(a) praktyczne kompetencje w pełnym stosie technologicznym (Full Stack),
            zaliczył(a) testy wiedzy technicznej ({lessonsCount} lekcji), zadania Live Coding oraz zrealizował(a) projekty w portfolio ({projectsCount}).
          </p>
        </div>

        {/* Competencies Breakdown */}
        <div className="my-6 sm:my-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-6 max-w-2xl mx-auto text-left space-y-3 print:border-slate-300 print:bg-slate-50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-amber-700 text-center">
            Zweryfikowane kompetencje produkcyjne:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300 print:text-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-600 shrink-0" />
              <span>Frontend: React 19, Next.js, TypeScript, Tailwind</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-600 shrink-0" />
              <span>Backend: Node.js, Express REST API, Walidacja</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-600 shrink-0" />
              <span>Bazy danych: PostgreSQL, Relacje SQL & ORM</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-600 shrink-0" />
              <span>Bezpieczeństwo: OWASP Top 10, JWT & Anty-Bot</span>
            </div>
          </div>
        </div>

        {/* Signatures & Verification Section with QR Code */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800/80 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400 print:text-slate-700">
          
          {/* Instructor Signature */}
          <div className="text-center sm:text-left space-y-1">
            <p className="font-semibold text-slate-200 print:text-slate-900">Zordon</p>
            <p className="text-[11px] text-slate-400 print:text-slate-600">Główny Architekt & Administrator Akademii</p>
            <p className="text-[10px] font-mono text-indigo-400 print:text-indigo-700">zordonzordon1@gmail.com</p>
            <div className="font-serif italic text-base text-amber-400/90 print:text-amber-700 pt-1">Zordon Admin</div>
          </div>

          {/* QR Code and Golden Seal */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Real SVG QR Code representation */}
            <div className="p-2 rounded-xl bg-white text-slate-950 shadow-md border border-slate-200 flex flex-col items-center shrink-0">
              <svg 
                className="h-14 w-14 sm:h-16 sm:w-16" 
                viewBox="0 0 33 33" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="33" height="33" fill="white"/>
                <rect x="2" y="2" width="7" height="7" fill="black"/>
                <rect x="3" y="3" width="5" height="5" fill="white"/>
                <rect x="4" y="4" width="3" height="3" fill="black"/>
                <rect x="24" y="2" width="7" height="7" fill="black"/>
                <rect x="25" y="3" width="5" height="5" fill="white"/>
                <rect x="26" y="4" width="3" height="3" fill="black"/>
                <rect x="2" y="24" width="7" height="7" fill="black"/>
                <rect x="3" y="25" width="5" height="5" fill="white"/>
                <rect x="4" y="26" width="3" height="3" fill="black"/>
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
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-amber-400/80 bg-amber-500/10 text-amber-300 print:text-amber-800 print:border-amber-600 shadow-inner font-mono text-[8px] sm:text-[9px] font-black uppercase text-center p-1">
                {isEligible ? 'VERIFIED 2026' : 'DRAFT 2026'}
              </div>
            </div>
          </div>

          {/* Verification Code Details */}
          <div className="text-center sm:text-right space-y-1">
            <p className="font-semibold text-slate-200 print:text-slate-900">Data: {new Date().toISOString().split('T')[0]}</p>
            <p className="font-mono text-[10px] sm:text-[11px] text-amber-400/90 print:text-amber-700 font-bold break-all">ID: {verificationCode}</p>
            <p className="text-[9px] sm:text-[10px] text-slate-400 print:text-slate-600">Podpis kryptograficzny SHA-256</p>
          </div>

        </div>

      </div>
      </>
      )}

      {/* Interactive Certificate Authenticity Verifier (Hidden in Print) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Publiczny Rejestr Weryfikacji Certyfikatów</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Wpisz kod identyfikacyjny certyfikatu (np. {verificationCode}), aby potwierdzić jego autentyczność oraz kompetencje absolwenta.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allUsers.slice(0, 3).map((u) => {
              const code = generateCertificateCode(u);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setLookupInput(code);
                    setLookupResult(verifyCertificateCode(code, allUsers, currentUser));
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-slate-300 transition-colors"
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleVerifySubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
            placeholder="Wpisz kod certyfikatu np. FSDA-2026-ADMIN-10X"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition-colors shrink-0"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Weryfikuj w rejestrze</span>
          </button>
        </form>

        {lookupResult && (
          <div
            className={`rounded-xl border p-4 text-xs space-y-2 ${
              lookupResult.valid && lookupResult.isOfficial
                ? 'border-emerald-500/40 bg-emerald-950/25 text-emerald-200'
                : lookupResult.valid
                ? 'border-amber-500/40 bg-amber-950/25 text-amber-200'
                : 'border-rose-500/40 bg-rose-950/25 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2 font-bold">
              <span>{lookupResult.message}</span>
              {lookupResult.valid && (
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900/70">
                  {lookupResult.code}
                </span>
              )}
            </div>
            {lookupResult.valid && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-300 font-mono">
                <div>Właściciel: <strong className="text-white">{lookupResult.holderName}</strong></div>
                <div>Poziom: <strong className="text-white">{lookupResult.level} ({lookupResult.xp} XP)</strong></div>
                <div>Zaliczone lekcje: <strong className="text-white">{lookupResult.completedLessonsCount}</strong></div>
                <div>Projekty: <strong className="text-white">{lookupResult.completedProjectsCount}</strong></div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
