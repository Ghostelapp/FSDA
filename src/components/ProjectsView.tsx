import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROJECTS_DATA } from '../data/projectsData';
import { Project } from '../types';
import { CodeEditor } from './CodeEditor';
import { 
  FolderGit2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  FileCode, 
  CheckSquare, 
  ExternalLink,
  Terminal,
  Cloud,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { currentUser, completeProject, selectedProjectId, setActiveTab } = useApp();
  
  // Active selected project
  const initialProject = PROJECTS_DATA.find((p) => p.id === selectedProjectId) || PROJECTS_DATA[0];
  const [activeProject, setActiveProject] = useState<Project>(initialProject);

  const isCompleted = currentUser.completedProjects.includes(activeProject.id);

  // Completed stage checklist state
  const [completedStages, setCompletedStages] = useState<Record<string, boolean>>({});

  const toggleStage = (key: string) => {
    setCompletedStages((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCompleteProject = () => {
    completeProject(activeProject.id, activeProject.xpReward);
  };

  const difficultyColors = {
    'Początkujący': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Średniozaawansowany': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    'Zaawansowany': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Ekspert': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <FolderGit2 className="h-4 w-4" />
          <span>Ścieżka Projektowa Portfolio</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          12 Realnych Projektów Komercyjnych
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Klucz do zatrudnienia to działający kod. Każdy z poniższych projektów rozwiązuje realne problemy biznesowe,
          posiada architekturę plików, etapy realizacji, kryteria akceptacyjne oraz instrukcję wdrożenia na produkcję.
        </p>
      </div>

      {/* Main Split: Projects Selector Grid & Active Project Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Project Picker List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Wybierz projekt ({PROJECTS_DATA.length}):
          </div>
          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {PROJECTS_DATA.map((proj) => {
              const isDone = currentUser.completedProjects.includes(proj.id);
              const isSelected = activeProject.id === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProject(proj)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 shadow-md ring-1 ring-indigo-500/50'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                      #{proj.number} {proj.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[proj.difficulty]}`}>
                      {proj.difficulty}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {proj.title}
                  </h3>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {proj.estimatedHours}h
                    </span>
                    <span className="text-indigo-300 font-semibold">
                      +{proj.xpReward} XP
                    </span>
                    {isDone && (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold font-sans">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Zaliczony
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Project Detail */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6">
            
            {/* Project Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">Projekt #{activeProject.number}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[activeProject.difficulty]}`}>
                    {activeProject.difficulty}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{activeProject.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {activeProject.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 text-xs font-bold text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  +{activeProject.xpReward} XP
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  Czas realizacji: ~{activeProject.estimatedHours}h
                </span>
              </div>
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Wykorzystywane technologie:</span>
              <div className="flex flex-wrap gap-2">
                {activeProject.technologies.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-indigo-400" />
                <span>Wymagania techniczne i biznesowe:</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeProject.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* File Structure Preview */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode className="h-4 w-4 text-cyan-400" />
                <span>Wzorcowa architektura plików projektu:</span>
              </h3>
              <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs border border-slate-800 overflow-x-auto leading-relaxed">
                {activeProject.fileStructure.map((line, i) => {
                  const isFolder = line.trim().endsWith('/');
                  const isTs = line.includes('.ts') || line.includes('.tsx');
                  const isCss = line.includes('.css');
                  const isHtml = line.includes('.html');
                  const isJson = line.includes('.json');
                  const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');

                  let colorClass = 'text-slate-300';
                  if (isComment) colorClass = 'text-slate-500 italic';
                  else if (isFolder) colorClass = 'text-cyan-400 font-bold';
                  else if (isTs) colorClass = 'text-sky-400 font-medium';
                  else if (isCss) colorClass = 'text-teal-300';
                  else if (isHtml) colorClass = 'text-orange-400';
                  else if (isJson) colorClass = 'text-amber-400';

                  return (
                    <div key={i} className={`flex items-center gap-1.5 ${colorClass}`}>
                      <span>{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stages & Milestones */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-400" />
                <span>Etapy realizacji krok po kroku:</span>
              </h3>
              <div className="space-y-3">
                {activeProject.stages.map((stage) => {
                  const stageKey = `${activeProject.id}-stage-${stage.stage}`;
                  const isChecked = completedStages[stageKey] || isCompleted;

                  return (
                    <div key={stage.stage} className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[11px] font-bold text-white">
                            {stage.stage}
                          </span>
                          <h4 className="text-xs font-bold text-white">{stage.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleStage(stageKey)}
                          className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                            isChecked
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          <span>{isChecked ? 'Wykonano' : 'Oznacz jako zrobione'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{stage.description}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {stage.tasks.map((task, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            • {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Acceptance Tests */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Testy akceptacyjne (Definition of Done):</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeProject.acceptanceTests.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deployment Instructions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Cloud className="h-4 w-4" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Instrukcja wdrożenia na produkcję:</h3>
              </div>
              <div className="space-y-1.5 text-xs font-mono bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80">
                {activeProject.deployInstructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 select-none font-bold">$</span>
                    <span className="text-slate-200">
                      {inst.split(' ').map((word, wIdx) => {
                        const isCmd = wIdx === 0;
                        const isFlag = word.startsWith('-');
                        const isEnv = word.includes('=');
                        let wColor = 'text-slate-300';
                        if (isCmd) wColor = 'text-sky-400 font-semibold';
                        else if (isFlag) wColor = 'text-amber-400';
                        else if (isEnv) wColor = 'text-purple-400';
                        return <span key={wIdx} className={`${wColor} mr-1`}>{word}</span>;
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                {isCompleted 
                  ? 'Gratulacje! Ten projekt został pomyślnie dodany do Twojego dorobku.'
                  : 'Po zrealizowaniu wymagań i testów akceptacyjnych kliknij przycisk poniżej.'}
              </div>

              <button
                type="button"
                onClick={handleCompleteProject}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
                  isCompleted
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-900/40'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isCompleted ? 'Zaliczony ponownie (+0 XP)' : `Zatwierdź ukończenie projektu (+${activeProject.xpReward} XP)`}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
