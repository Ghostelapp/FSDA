import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Crown, 
  Check, 
  Sparkles, 
  X, 
  Shield, 
  Zap, 
  Code2, 
  FileCheck, 
  Terminal, 
  Award,
  Layers,
  ArrowRight,
  Heart,
  Lock
} from 'lucide-react';
import { isGuestUser } from '../utils/authValidation';

export const SubscriptionModal: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated,
    isSubModalOpen, 
    setIsSubModalOpen, 
    togglePro 
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');

  if (!isSubModalOpen) return null;

  const isGuest = isGuestUser(currentUser, isAuthenticated);
  const isPro = !isGuest && currentUser.isPro;

  const handleActivatePro = () => {
    if (isGuest) {
      setIsSubModalOpen(false);
      window.dispatchEvent(new CustomEvent('akademia:open-auth-modal'));
      return;
    }
    togglePro(true, billingCycle);
    setIsSubModalOpen(false);
  };

  const handleDowngrade = () => {
    togglePro(false);
    setIsSubModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Banner with gradient highlight */}
        <div className="relative px-6 pt-7 pb-6 bg-gradient-to-r from-amber-500/15 via-purple-600/15 to-indigo-600/15 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setIsSubModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">
              <Crown className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Full Stack Academy PRO
            </span>
            <span className="text-xs text-slate-400">
              Inwestycja w Twoją karierę programisty
            </span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ucz się bez limitów. Buduj portfolio szybciej.
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Zyskaj nielimitowane serca, gotowe kody wzorcowe projektów komercyjnych, ochronę serii nauki oraz certyfikat z weryfikacją portfolio.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-5 flex items-center justify-center">
            <div className="flex items-center rounded-2xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Płatność miesięczna
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`relative px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Płatność roczna</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  billingCycle === 'yearly' ? 'bg-slate-950 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  -36% TANIEJ
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Price Tag Highlight */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {billingCycle === 'yearly' ? 'Plan Roczny (rekomendowany)' : 'Plan Miesięczny'}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {billingCycle === 'yearly' ? '24,90 zł' : '39,00 zł'}
                </span>
                <span className="text-xs text-slate-400">/ miesiąc</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {billingCycle === 'yearly' 
                  ? 'Rozliczane jako 298,80 zł rocznie. Oszczędzasz 169,20 zł względem płatności miesięcznej.' 
                  : 'Elastyczna subskrypcja z możliwością anulowania w dowolnej chwili.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              {isPro ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Check className="h-4 w-4" />
                  <span>Subskrypcja PRO aktywna</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleActivatePro}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="h-4 w-4 fill-slate-950" />
                  <span>Aktywuj bezpłatny okres próbny (7 dni)</span>
                </button>
              )}
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Porównanie Planu Podstawowego i PRO
            </h3>

            <div className="rounded-2xl border border-slate-800 overflow-hidden text-xs">
              
              {/* Row 1 */}
              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-300 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  Energia i serca w nauce
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-slate-400 w-24 text-right">5 serc (regeneracja)</span>
                  <span className="font-bold text-amber-300 w-28 text-right flex items-center justify-end gap-1">
                    <Crown className="h-3.5 w-3.5" />
                    Nielimitowane
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-300 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  Ochrona serii dni nauki
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-slate-400 w-24 text-right">1 tarcza na start</span>
                  <span className="font-bold text-cyan-300 w-28 text-right">Auto-ochrona PRO</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-300 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-indigo-400" />
                  Wzorcowe kody 12 projektów
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-slate-400 w-24 text-right">Podstawowe testy</span>
                  <span className="font-bold text-indigo-300 w-28 text-right">Pełne repozytoria</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="p-3.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-300 flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-400" />
                  Certyfikat Ukończenia
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-slate-400 w-24 text-right">Standardowy PDF</span>
                  <span className="font-bold text-yellow-300 w-28 text-right">Z ID i weryfikacją QR</span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="p-3.5 bg-slate-950/60 flex items-center justify-between">
                <span className="font-semibold text-slate-300 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  Szablony DevOps & Docker
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-slate-400 w-24 text-right">Tylko poradnik</span>
                  <span className="font-bold text-emerald-300 w-28 text-right">Gotowe konfiguracje</span>
                </div>
              </div>

            </div>
          </div>

          {/* Test / Demo Switcher for Evaluation */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>Przełącznik trybu demo dla oceny platformy</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Możesz w każdej chwili przełączać konto między darmowym planem z sercami a nielimitowanym PRO.
              </p>
            </div>

            {isPro ? (
              <button
                type="button"
                onClick={handleDowngrade}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-semibold shrink-0 transition-colors"
              >
                Przełącz na Free (testuj serca)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleActivatePro}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors"
              >
                Włącz PRO natychmiast
              </button>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Gwarancja satysfakcji 14 dni lub 100% zwrot środków</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSubModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Zamknij
          </button>
        </div>

      </div>
    </div>
  );
};
