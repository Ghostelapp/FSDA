import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveExercise } from '../types';
import { validateExerciseCode, generateSandboxDocument, ValidationSummary } from '../utils/codeRunner';
import { highlightCode, getLanguageDisplayName } from '../utils/syntaxHighlighter';
import { detectPrimaryExerciseTab } from '../utils/lessonReadability';
import { CodeBlock } from './CodeBlock';
import { 
  Play, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Terminal as TerminalIcon, 
  Code, 
  Layers, 
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Palette,
  Sparkles,
  Heart
} from 'lucide-react';

interface CodeEditorProps {
  exercise: InteractiveExercise;
  onSuccess?: () => void;
  onValidationChange?: (result: ValidationSummary) => void;
  savedCode?: { html: string; css: string; js: string };
  onSave?: (code: { html: string; css: string; js: string }) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  exercise,
  onSuccess,
  onValidationChange,
  savedCode,
  onSave,
}) => {
  const primaryTab = detectPrimaryExerciseTab(exercise);
  const [activeFileTab, setActiveFileTab] = useState<'html' | 'css' | 'js'>(() =>
    detectPrimaryExerciseTab(exercise)
  );
  const [activeOutputTab, setActiveOutputTab] = useState<'preview' | 'tests' | 'console'>('preview');
  const [syntaxHighlightingEnabled, setSyntaxHighlightingEnabled] = useState(true);

  const [code, setCode] = useState<{ html: string; css: string; js: string }>({
    html: savedCode?.html ?? exercise.starterCode.html,
    css: savedCode?.css ?? exercise.starterCode.css,
    js: savedCode?.js ?? exercise.starterCode.js,
  });

  const [consoleLogs, setConsoleLogs] = useState<{ type: 'log' | 'error' | 'warn'; text: string; time: string }[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationSummary | null>(null);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Synchronize if exercise changes
  useEffect(() => {
    setCode({
      html: savedCode?.html ?? exercise.starterCode.html,
      css: savedCode?.css ?? exercise.starterCode.css,
      js: savedCode?.js ?? exercise.starterCode.js,
    });
    setConsoleLogs([]);
    setValidationResult(null);
    setActiveFileTab(detectPrimaryExerciseTab(exercise));
    setActiveOutputTab('preview');
    setShowHints(false);
    setHintIndex(0);
    setShowSolutionModal(false);
    setShowResetModal(false);
  }, [exercise.id]);

  // Listen to messages from the sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'fsda-sandbox') {
        const time = new Date().toLocaleTimeString();
        setConsoleLogs((prev) => [
          ...prev.slice(-30),
          { type: event.data.type, text: event.data.data, time },
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const runCodeInSandbox = () => {
    if (iframeRef.current) {
      const doc = generateSandboxDocument(code.html, code.css, code.js);
      iframeRef.current.srcdoc = doc;
    }
  };

  // Run on mount or when code changes
  useEffect(() => {
    runCodeInSandbox();
  }, [code.html, code.css, code.js]);

  const { currentUser, loseLife, livesInfo, setIsLivesModalOpen } = useApp();
  const currentLives = currentUser.isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);

  const handleRunAndValidate = () => {
    if (!currentUser.isPro && currentLives <= 0) {
      setIsLivesModalOpen(true);
      return;
    }

    setConsoleLogs([]);
    runCodeInSandbox();
    const result = validateExerciseCode(exercise, code);
    setValidationResult(result);
    if (onValidationChange) {
      onValidationChange(result);
    }
    setActiveOutputTab('tests');

    if (onSave) {
      onSave(code);
    }

    if (result.allPassed) {
      if (onSuccess) onSuccess();
    } else {
      loseLife('Nie wszystkie testy kodu przeszły pomyślnie! Tracisz 1 serce. Przeanalizuj wyniki poniżej.');
    }
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmResetCode = () => {
    setCode({
      html: exercise.starterCode.html,
      css: exercise.starterCode.css,
      js: exercise.starterCode.js,
    });
    setValidationResult(null);
    setConsoleLogs([]);
    setShowResetModal(false);
  };

  const handleApplySolution = () => {
    setCode({
      html: exercise.solutionCode.html,
      css: exercise.solutionCode.css,
      js: exercise.solutionCode.js,
    });
    setActiveFileTab(primaryTab);
    setShowSolutionModal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enable tab key indentation (2 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = textarea.value;

      const newVal = currentVal.substring(0, start) + '  ' + currentVal.substring(end);
      setCode((prev) => ({ ...prev, [activeFileTab]: newVal }));

      // Restore cursor position after state updates
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Synchronize scroll between textarea, pre syntax layer, and line numbers
  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  const currentCodeContent = code[activeFileTab];
  const langForTab = activeFileTab === 'html' ? 'html' : activeFileTab === 'css' ? 'css' : 'javascript';
  const highlightedCode = highlightCode(currentCodeContent, langForTab);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCodeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = currentCodeContent.split('\n').length;
  const charCount = currentCodeContent.length;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col my-4">
      
      {/* Exercise Brief Header */}
      <div className="border-b border-slate-800 bg-slate-950 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Ćwiczenie Praktyczne
            </span>
            <h4 className="text-sm font-bold text-white">{exercise.title}</h4>
            <span className="text-xs text-emerald-400 font-medium">
              · Wpisz kod w zakładce: {primaryTab === 'html' ? 'index.html' : primaryTab === 'css' ? 'styles.css' : 'app.js'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-2xl leading-relaxed">{exercise.task}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hints Button */}
          {exercise.hints && exercise.hints.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-amber-300 hover:bg-slate-800 transition-colors"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              <span>Podpowiedzi ({exercise.hints.length})</span>
            </button>
          )}

          {/* Direct 1-click Insert Solution for Beginners */}
          <button
            type="button"
            onClick={handleApplySolution}
            title="Wstaw gotowy, poprawny kod wzorcowy bezpośrednio do edytora"
            className="px-2.5 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
          >
            Wstaw wzór rozwiązania
          </button>

          {/* Solution Modal Preview Button */}
          <button
            type="button"
            onClick={() => setShowSolutionModal(true)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors"
          >
            Podgląd wzorca
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            title="Resetuj do kodu początkowego"
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Run & Validate Action Button */}
          <button
            type="button"
            onClick={handleRunAndValidate}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/40"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Sprawdź kod</span>
          </button>
        </div>
      </div>

      {/* Hints Banner */}
      {showHints && exercise.hints && (
        <div className="border-b border-amber-500/20 bg-amber-950/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4" />
              Podpowiedź {hintIndex + 1} z {exercise.hints.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={hintIndex === 0}
                onClick={() => setHintIndex((i) => Math.max(0, i - 1))}
                className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 disabled:opacity-40"
              >
                Poprzednia
              </button>
              <button
                type="button"
                disabled={hintIndex >= exercise.hints.length - 1}
                onClick={() => setHintIndex((i) => Math.min(exercise.hints.length - 1, i + 1))}
                className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 disabled:opacity-40"
              >
                Następna
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            {exercise.hints[hintIndex]}
          </p>
        </div>
      )}

      {/* Editor & Output Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-h-[420px]">
        
        {/* LEFT COLUMN: Code Tabs & Interactive Syntax-Colored Editor */}
        <div className="flex flex-col bg-slate-950">
          
          {/* File Tabs & Highlight Toggle */}
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/70 px-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveFileTab('html')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeFileTab === 'html'
                    ? 'border-orange-500 text-orange-400 bg-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="h-3.5 w-3.5 text-orange-400" />
                <span>index.html</span>
                {primaryTab === 'html' && (
                  <span className="text-[10px] font-bold text-emerald-400">(Edytuj tutaj)</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveFileTab('css')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeFileTab === 'css'
                    ? 'border-cyan-500 text-cyan-400 bg-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>styles.css</span>
                {primaryTab === 'css' && (
                  <span className="text-[10px] font-bold text-emerald-400">(Edytuj tutaj)</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveFileTab('js')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeFileTab === 'js'
                    ? 'border-yellow-500 text-yellow-400 bg-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="h-3.5 w-3.5 text-yellow-400" />
                <span>app.js</span>
                {primaryTab === 'js' && (
                  <span className="text-[10px] font-bold text-emerald-400">(Edytuj tutaj)</span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Syntax Highlighting Active Pill */}
              <button
                type="button"
                onClick={() => setSyntaxHighlightingEnabled(!syntaxHighlightingEnabled)}
                title="Włącz/wyłącz kolorowanie składni w edytorze"
                className={`hidden sm:flex items-center gap-1 text-[11px] px-2 py-1 rounded transition-colors border ${
                  syntaxHighlightingEnabled
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Palette className="h-3 w-3 text-indigo-400" />
                <span>{syntaxHighlightingEnabled ? 'Kolory włączone' : 'Tryb zwykły'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCode}
                title="Kopiuj kod do schowka"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Skopiowano' : 'Kopiuj'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Workspace: Line Numbers + Overlay Syntax Highlighting */}
          <div className="relative flex-1 flex bg-slate-950 overflow-hidden min-h-[340px]">
            {/* Synchronized Line Numbers */}
            <div 
              ref={lineNumbersRef}
              className="select-none py-3 px-2 text-right text-slate-600 bg-slate-950 border-r border-slate-800/80 w-11 font-mono text-[11px] leading-relaxed shrink-0 overflow-hidden"
            >
              {currentCodeContent.split('\n').map((_, i) => (
                <div key={i} className="hover:text-slate-400">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Overlaid Code Editing Area */}
            <div className="relative flex-1 h-full min-w-0 overflow-hidden">
              {/* Syntax Highlighting Background Layer */}
              {syntaxHighlightingEnabled && (
                <pre
                  ref={preRef}
                  aria-hidden="true"
                  className="code-editor-font pointer-events-none absolute inset-0 z-0 m-0 p-3 overflow-hidden whitespace-pre border-0 bg-transparent text-slate-200 select-none"
                >
                  <code 
                    className={`language-${langForTab}`}
                    dangerouslySetInnerHTML={{ 
                      __html: highlightedCode + (currentCodeContent.endsWith('\n') ? ' ' : '') 
                    }} 
                  />
                </pre>
              )}

              {/* Foreground Interactive Textarea */}
              <textarea
                ref={textareaRef}
                value={currentCodeContent}
                onChange={(e) => setCode({ ...code, [activeFileTab]: e.target.value })}
                onKeyDown={handleKeyDown}
                onScroll={handleEditorScroll}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                className={`code-editor-font code-editor-textarea relative z-10 w-full h-full resize-none bg-transparent p-3 whitespace-pre focus:outline-none overflow-auto border-0 ${
                  syntaxHighlightingEnabled 
                    ? 'text-transparent' 
                    : 'text-slate-200'
                }`}
                placeholder={`Wpisz kod dla ${activeFileTab.toUpperCase()}...`}
              />
            </div>
          </div>

          {/* Editor Status Bar */}
          <div className="border-t border-slate-800/80 bg-slate-950 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-indigo-400 font-sans font-semibold">
                <Sparkles className="h-3 w-3" />
                {getLanguageDisplayName(langForTab)}
              </span>
              <span>•</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Ln {lineCount}, Col {charCount}</span>
              <span className="hidden sm:inline text-emerald-400">● Gotowy</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Output (Preview / Tests / Colorized Console) */}
        <div className="flex flex-col bg-slate-950/60">
          {/* Output Mode Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/70 px-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveOutputTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeOutputTab === 'preview'
                    ? 'border-indigo-500 text-indigo-400 bg-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Podgląd na żywo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveOutputTab('tests')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeOutputTab === 'tests'
                    ? 'border-indigo-500 text-indigo-400 bg-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Testy zadania</span>
                {validationResult && (
                  <span className={`text-[10px] px-1.5 rounded-full font-bold ml-1 ${
                    validationResult.allPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {validationResult.passedCount}/{validationResult.totalCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveOutputTab('console')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeOutputTab === 'console'
                    ? 'border-indigo-500 text-indigo-400 bg-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="h-3.5 w-3.5 text-amber-400" />
                <span>Konsola</span>
                {consoleLogs.length > 0 && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 rounded-full font-mono">
                    {consoleLogs.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Output Content Area */}
          <div className="flex-1 relative overflow-auto">
            {/* PREVIEW TAB */}
            <div className={`h-full w-full ${activeOutputTab === 'preview' ? 'block' : 'hidden'}`}>
              <iframe
                ref={iframeRef}
                title="Piaskownica Kodu"
                sandbox="allow-scripts allow-modals"
                className="w-full h-full min-h-[360px] bg-white border-0"
              />
            </div>

            {/* TESTS TAB */}
            {activeOutputTab === 'tests' && (
              <div className="p-4 space-y-3">
                {validationResult ? (
                  <>
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      validationResult.allPassed 
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        {validationResult.allPassed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-400" />
                        )}
                        <div>
                          <p className="text-xs font-bold">
                            {validationResult.allPassed 
                              ? 'Wszystkie testy zaliczone! Doskonała robota!' 
                              : `Zaliczono ${validationResult.passedCount} z ${validationResult.totalCount} testów`}
                          </p>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            {validationResult.allPassed 
                              ? 'Możesz przejść do podsumowania lub kolejnego etapu lekcji.' 
                              : 'Przejrzyj poniższe błędy i wprowadź wymagane poprawki w kodzie.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {validationResult.results.map((res) => (
                        <div
                          key={res.id}
                          className={`p-3 rounded-lg border text-xs transition-colors ${
                            res.passed
                              ? 'bg-emerald-950/15 border-emerald-800/40 text-emerald-300'
                              : 'bg-slate-900 border-rose-800/50 text-rose-300'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {res.passed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="font-semibold text-slate-200">{res.description}</p>
                              {res.message && !res.passed && (
                                <p className="text-[11px] text-rose-400 mt-1 font-mono bg-rose-950/40 px-2 py-1 rounded border border-rose-900/40">
                                  {res.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-300">Testy nie zostały jeszcze uruchomione</p>
                    <p className="text-[11px] text-slate-500 mt-1">Kliknij zielony przycisk "Sprawdź kod" u góry edytora.</p>
                  </div>
                )}
              </div>
            )}

            {/* CONSOLE TAB (Enhanced with Colored Token Elements) */}
            {activeOutputTab === 'console' && (
              <div className="p-3 font-mono text-xs">
                {consoleLogs.length === 0 ? (
                  <div className="py-10 text-center text-slate-500">
                    <TerminalIcon className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                    <p className="text-xs">Brak wpisów w konsoli.</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Wywołaj console.log() w pliku app.js aby zobaczyć logi.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {consoleLogs.map((log, index) => {
                      const isError = log.type === 'error';
                      const isWarn = log.type === 'warn';
                      
                      return (
                        <div
                          key={index}
                          className={`p-2.5 rounded font-mono text-[11px] flex items-start gap-2.5 ${
                            isError
                              ? 'bg-rose-950/40 text-rose-300 border border-rose-900/40'
                              : isWarn
                              ? 'bg-amber-950/40 text-amber-300 border border-amber-900/40'
                              : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                          }`}
                        >
                          <span className="text-slate-500 text-[10px] select-none pt-0.5 shrink-0">{log.time}</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            isError 
                              ? 'bg-rose-500/20 text-rose-400' 
                              : isWarn 
                              ? 'bg-amber-500/20 text-amber-400' 
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {log.type}
                          </span>
                          <span 
                            className="flex-1 break-all"
                            dangerouslySetInnerHTML={{
                              __html: highlightCode(log.text, 'javascript')
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Solution / Requirements Guidance Modal */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {validationResult?.allPassed ? (
              <>
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                  <h3 className="text-base font-bold text-white">Zadanie zaliczone — Porównaj z wzorcem architekta</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gratulacje! Samodzielnie przeszedłeś wszystkie testy automatyczne. Poniżej możesz porównać swoje rozwiązanie z wzorcowym kodem dla bieżącej zakładki:
                </p>
                <CodeBlock 
                  code={exercise.solutionCode[activeFileTab] || exercise.solutionCode.html}
                  language={langForTab}
                  title={`Wzorzec dla: ${activeFileTab.toUpperCase()}`}
                  badge="Rozwiązanie autorskie"
                  badgeColor="emerald"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSolutionModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    Zamknij
                  </button>
                  <button
                    type="button"
                    onClick={handleApplySolution}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/40"
                  >
                    Załaduj wzorzec do porównania
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-amber-400">
                  <AlertTriangle className="h-6 w-6" />
                  <h3 className="text-base font-bold text-white">Wzorzec odblokowuje się po zaliczeniu testów</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aby wyeliminować zaliczanie zadań bez ich samodzielnego wykonania, pełny kod wzorcowy jest dostępny dopiero po przejściu testów automatycznych. Skorzystaj z poniższej listy wymagań weryfikatora oraz wskazówek:
                </p>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <p className="text-xs font-bold text-indigo-300">Wymagane kryteria testów automatycznych:</p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {exercise.rules.map((r) => (
                      <li key={r.id} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-mono">•</span>
                        <span>
                          {r.description} <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[11px]">{r.target}</code>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {exercise.hints && exercise.hints.length > 0 && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-1.5">
                    <p className="text-xs font-bold text-amber-300">Wskazówki krok po kroku:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-amber-100/90">
                      {exercise.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ol>
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSolutionModal(false)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    Wracam do pisania kodu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reset Code Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <RotateCcw className="h-5 w-5" />
              <h3 className="text-base font-bold text-white">Przywrócić kod początkowy?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Wszystkie niezapisane zmiany w zakładkach HTML, CSS oraz JS dla tego ćwiczenia zostaną zastąpione kodem startowym.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={confirmResetCode}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Zresetuj kod
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
