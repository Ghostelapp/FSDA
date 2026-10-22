import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Printer, Download, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const CertificateView: React.FC = () => {
  const { currentUser } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  const completedHtmlLessons = currentUser.completedLessons.filter((id) => id.startsWith('html-')).length;
  const isEligible = completedHtmlLessons >= 3 || currentUser.role === 'admin';

  const verificationCode = `FSDA-2026-${currentUser.id.slice(-4).toUpperCase()}-${currentUser.level}X`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-yellow-400 uppercase tracking-wider">
            <Award className="h-4 w-4" />
            <span>Oficjalna Certyfikacja Kompetencji</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Certyfikat Ukończenia Ścieżki Programistycznej
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Imienny, weryfikowalny certyfikat potwierdzający praktyczne umiejętności budowania aplikacji webowych.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-900/40"
          >
            <Printer className="h-4 w-4" />
            <span>Drukuj / Zapisz jako PDF</span>
          </button>
        </div>
      </div>

      {/* Eligibility Status Banner */}
      {!isEligible && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-center gap-3 text-xs text-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <span>
            Podgląd certyfikatu roboczego. Aby uzyskać status oficjalnie zatwierdzonego certyfikatu z pieczęcią, ukończ przynajmniej 3 pełne lekcje z modułu HTML5 oraz 1 projekt praktyczny.
          </span>
        </div>
      )}

      {/* Printable Certificate Canvas */}
      <div 
        ref={printRef}
        className="relative overflow-hidden rounded-3xl border-4 border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-14 text-center shadow-2xl print:border-black print:bg-white print:text-black"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 h-12 w-12 border-t-2 border-l-2 border-amber-400/60 pointer-events-none" />
        <div className="absolute top-4 right-4 h-12 w-12 border-t-2 border-r-2 border-amber-400/60 pointer-events-none" />
        <div className="absolute bottom-4 left-4 h-12 w-4 border-b-2 border-l-2 border-amber-400/60 pointer-events-none" />
        <div className="absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-amber-400/60 pointer-events-none" />

        {/* Certificate Watermark / Header */}
        <div className="space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl mb-4">
            <Award className="h-9 w-9" />
          </div>
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-amber-400">
            FULL STACK DEVELOPER ACADEMY • OFICJALNY DYPLOM
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase print:text-black">
            Certyfikat Ukończenia
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
            CERTIFICATE OF FULL STACK ENGINEERING EXCELLENCE
          </p>
        </div>

        {/* Recipient */}
        <div className="my-10 space-y-3">
          <p className="text-xs text-slate-400 italic">Niniejszym zaświadcza się, że</p>
          <div className="inline-block border-b-2 border-amber-400/60 pb-2 px-8">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 print:text-black">
              {currentUser.name}
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed pt-2">
            z sukcesem opanował(a) praktyczne fundamenty tworzenia nowoczesnych aplikacji internetowych, 
            zaliczył(a) rygorystyczne testy wiedzy technicznej oraz wykonał(a) zadania programistyczne w standardzie produkcyjnym.
          </p>
        </div>

        {/* Competencies Breakdown */}
        <div className="my-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 max-w-2xl mx-auto text-left space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 text-center">
            Zweryfikowane kompetencje inżynierskie:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Semantyka HTML5 & Dostępność WCAG 2.1 AA</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Responsywność Mobile-First & CSS Box Model</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>JavaScript ES6+ & Programowanie Asynchroniczne</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Architektura REST API & Bazy Relacyjne SQL</span>
            </div>
          </div>
        </div>

        {/* Signatures & Verification */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-8 text-xs text-slate-400">
          <div className="text-left space-y-1">
            <p className="font-semibold text-slate-200">Marek Architekt</p>
            <p className="text-[11px] text-slate-500">Główny Instruktor & Architekt Oprogramowania</p>
            <div className="font-serif italic text-sm text-indigo-400">M. Architekt</div>
          </div>

          {/* Golden Seal */}
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-400/80 bg-amber-500/10 text-amber-300 shadow-inner font-mono text-[9px] font-black uppercase text-center p-1">
              VERIFIED 2026 ACADEMY
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="font-semibold text-slate-200">Data wystawienia: {new Date().toISOString().split('T')[0]}</p>
            <p className="font-mono text-[11px] text-amber-400/80">ID: {verificationCode}</p>
            <p className="text-[10px] text-slate-500">Weryfikacja online: academy.dev/verify</p>
          </div>
        </div>

      </div>

    </div>
  );
};
