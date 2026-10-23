import React, { useState } from 'react';
import { EVENT_LOOP_SCENARIOS, EventLoopScenario } from '../utils/developerSimulators';
import {
  Play,
  SkipForward,
  RotateCcw,
  Cpu,
  Layers,
  Terminal,
  Zap,
  Clock,
} from 'lucide-react';

export const EventLoopView: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(EVENT_LOOP_SCENARIOS[0].id);
  const [stepIdx, setStepIdx] = useState<number>(0);

  const scenario: EventLoopScenario =
    EVENT_LOOP_SCENARIOS.find((s) => s.id === selectedScenarioId) || EVENT_LOOP_SCENARIOS[0];
  const currentStep = scenario.steps[stepIdx] || scenario.steps[0];
  const isLastStep = stepIdx >= scenario.steps.length - 1;

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setStepIdx(0);
  };

  const handleNextStep = () => {
    setStepIdx((prev) => Math.min(scenario.steps.length - 1, prev + 1));
  };

  const handlePrevStep = () => {
    setStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setStepIdx(0);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs font-semibold text-indigo-400">Architektura Silnika V8 & Asynchroniczność</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Wizualizator JS Event Loop
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Śledź krok po kroku jak Call Stack, Web APIs, kolejka Microtask (Promise) oraz Macrotask (setTimeout) współpracują podczas wykonywania kodu JavaScript.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {EVENT_LOOP_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                sc.id === scenario.id
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Zone Simulation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code & Playback Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{scenario.title}</span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                Krok {stepIdx + 1} / {scenario.steps.length}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{scenario.description}</p>

            {/* Code Lines with Active Highlight */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs space-y-1 overflow-x-auto">
              {scenario.codeLines.map((line, i) => {
                const lineNum = i + 1;
                const isActive = currentStep.activeLine === lineNum;
                return (
                  <div
                    key={lineNum}
                    className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg transition-colors ${
                      isActive ? 'bg-indigo-600/30 text-white font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500 select-none w-4 text-right tabular-nums">{lineNum}</span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                );
              })}
            </div>

            {/* Playback Controller */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={stepIdx === 0}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-200 transition-colors"
              >
                Poprzedni krok
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isLastStep}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold text-white transition-colors"
              >
                {isLastStep ? <Play className="h-3.5 w-3.5" /> : <SkipForward className="h-3.5 w-3.5" />}
                <span>{isLastStep ? 'Zakończono przebieg' : 'Krok dalej'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                aria-label="Resetuj symulację"
                className="p-2 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Step Explanation Box */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-300">Aktywna faza: {currentStep.phase}</span>
              <span className="font-mono text-slate-400 tabular-nums">Linia #{currentStep.activeLine}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{currentStep.explanation}</p>
          </div>
        </div>

        {/* Right: Visual Queues & Console Output (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Call Stack */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 min-h-[160px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span>Call Stack (Stos Wywołań)</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {currentStep.callStack.length} ramek
                </span>
              </div>
              <div className="space-y-1.5">
                {currentStep.callStack.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Stos jest pusty (Idle)</p>
                ) : (
                  [...currentStep.callStack].reverse().map((frame, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-2 text-xs font-mono text-cyan-200"
                    >
                      {frame}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Web APIs */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 min-h-[160px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>Web APIs (Przeglądarka)</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {currentStep.webApis.length} aktywne
                </span>
              </div>
              <div className="space-y-1.5">
                {currentStep.webApis.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Brak aktywnych timerów / żądań</p>
                ) : (
                  currentStep.webApis.map((api, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-3 py-2 text-xs font-mono text-amber-200"
                    >
                      {api}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Microtask Queue */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 min-h-[150px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span>Microtask Queue (Promise)</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">Priorytet 1</span>
              </div>
              <div className="space-y-1.5">
                {currentStep.microtaskQueue.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Kolejka mikro-zadań pusta</p>
                ) : (
                  currentStep.microtaskQueue.map((task, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-xs font-mono text-emerald-200"
                    >
                      {task}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Macrotask Queue */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 min-h-[150px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <span>Macrotask Queue (setTimeout)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Priorytet 2</span>
              </div>
              <div className="space-y-1.5">
                {currentStep.macrotaskQueue.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Kolejka makro-zadań pusta</p>
                ) : (
                  currentStep.macrotaskQueue.map((task, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-indigo-500/30 bg-indigo-950/30 px-3 py-2 text-xs font-mono text-indigo-200"
                    >
                      {task}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Console Output */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>Wyjście Konsoli (console.log)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {currentStep.consoleOutput.length} linii
              </span>
            </div>
            <div className="space-y-1 font-mono text-xs min-h-[84px]">
              {currentStep.consoleOutput.length === 0 ? (
                <p className="text-slate-500 py-2">Brak wpisów w konsoli na tym etapie.</p>
              ) : (
                currentStep.consoleOutput.map((line, idx) => (
                  <div key={idx} className="text-emerald-300 flex items-center gap-2">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span>{line}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
