import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lesson } from '../types';
import { CodeEditor } from './CodeEditor';
import { CodeBlock } from './CodeBlock';
import { PostLessonQuiz } from './PostLessonQuiz';
import { 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Code, 
  HelpCircle, 
  AlertOctagon, 
  Sparkles, 
  CheckSquare, 
  Clock, 
  Award,
  ChevronRight,
  Check,
  Copy,
  Lightbulb,
  CheckCircle2,
  XCircle,
  FileText,
  Heart,
  Crown,
  Zap
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: Lesson;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({ lesson }) => {
  const { 
    currentUser, 
    completeLesson, 
    saveQuizScore, 
    saveCodeSnippet, 
    setActiveTab, 
    allLessons,
    loseLife,
    livesInfo,
    setIsLivesModalOpen,
    awardCustomXp
  } = useApp();

  const isCompleted = currentUser.completedLessons.includes(lesson.id);
  const currentLives = currentUser.isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Completed criteria checklist state
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({});
  const [showPostLessonQuiz, setShowPostLessonQuiz] = useState<boolean>(false);

  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setCheckedCriteria({});
    setShowPostLessonQuiz(false);
  }, [lesson.id]);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleEvaluateQuiz = () => {
    if (!currentUser.isPro && currentLives <= 0) {
      setIsLivesModalOpen(true);
      return;
    }

    setQuizSubmitted(true);
    let correctCount = 0;
    lesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const scorePercent = Math.round((correctCount / lesson.quiz.length) * 100);
    saveQuizScore(lesson.id, scorePercent);

    if (scorePercent < 80) {
      loseLife(`Wynik testu: ${scorePercent}%. Tracisz 1 serce! Przeanalizuj poniższe wyjaśnienia.`);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleCompleteLessonAction = () => {
    completeLesson(lesson.id, lesson.xpReward);
    setShowPostLessonQuiz(true);
    setTimeout(() => {
      document.getElementById('post-lesson-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Find previous and next lessons
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Powrót do modułów</span>
        </button>

        <div className="flex items-center gap-3">
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Lekcja Zliczona
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            +{lesson.xpReward} XP
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400 font-mono">
            <Clock className="h-3.5 w-3.5" />
            {lesson.durationMinutes} min
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <span>{lesson.moduleTitle}</span>
          <span>•</span>
          <span>Lekcja {lesson.order}</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {lesson.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          {lesson.summary}
        </p>
      </div>

      {/* SECTION 1: Cel lekcji i wymagane umiejętności */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-indigo-400">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-base font-bold text-white">1. Cel lekcji i wymagane umiejętności</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Czego się nauczysz:</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Wymagania wstępne:</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {lesson.prerequisites.map((pre, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{pre}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: Wyjaśnienie prostym językiem */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-indigo-400">
          <FileText className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white">2. Wyjaśnienie prostym językiem</h2>
        </div>
        <div className="text-slate-300 text-sm leading-relaxed space-y-3 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
          {lesson.theoryMarkdown.split('\n\n').map((paragraph, pIdx) => {
            // Process bold **text** and `code`
            const parts = paragraph.split(/(\*\*.*?\*\*|`.*?`)/g);
            return (
              <p key={pIdx} className="leading-relaxed">
                {parts.map((part, partIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={partIdx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith('`') && part.endsWith('`')) {
                    const snippet = part.slice(1, -1);
                    let colorClass = 'text-indigo-300 bg-indigo-950/50 border-indigo-500/30';
                    if (snippet.startsWith('<') && snippet.endsWith('>')) {
                      colorClass = 'text-rose-300 bg-rose-950/50 border-rose-500/30';
                    } else if (snippet.includes(':') || snippet.includes('flex') || snippet.includes('grid')) {
                      colorClass = 'text-cyan-300 bg-cyan-950/50 border-cyan-500/30';
                    } else if (snippet.startsWith('git ') || snippet.startsWith('npm ') || snippet.startsWith('cd ') || snippet.startsWith('docker ')) {
                      colorClass = 'text-emerald-300 bg-emerald-950/50 border-emerald-500/30';
                    } else if (snippet.startsWith('const ') || snippet.startsWith('let ') || snippet.includes('=>') || snippet.includes('()')) {
                      colorClass = 'text-purple-300 bg-purple-950/50 border-purple-500/30';
                    }
                    return (
                      <code key={partIdx} className={`prose-code-token font-mono ${colorClass}`}>
                        {snippet}
                      </code>
                    );
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Przykład kodu z komentarzami */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-indigo-400">
          <Code className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white">3. Przykład kodu z komentarzami</h2>
        </div>
        
        <div className="space-y-4">
          {lesson.codeExamples.map((example, idx) => (
            <div key={idx} className="space-y-2">
              <CodeBlock
                code={example.code}
                language={example.language}
                title={example.title}
                badge={example.language.toUpperCase()}
                badgeColor="indigo"
              />
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-xs text-slate-300 flex items-start gap-2">
                <span className="font-bold text-indigo-400 shrink-0">Komentarz architekta:</span>
                <span className="leading-relaxed">{example.explanation}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Wyjaśnienie kodu krok po kroku */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-indigo-400">
          <ChevronRight className="h-5 w-5" />
          <h2 className="text-lg font-bold text-white">4. Wyjaśnienie kodu krok po kroku</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lesson.stepByStepGuide.map((step) => (
            <div key={step.step} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {step.step}
                </span>
                <h3 className="text-xs font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Interaktywne ćwiczenie z wbudowanym edytorem */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-indigo-400">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white">5. Interaktywne ćwiczenie w edytorze</h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Pisz kod, uruchamiaj testy i sprawdzaj wyniki na żywo</span>
        </div>

        <CodeEditor
          exercise={lesson.interactiveExercise}
          onSuccess={() => {
            awardCustomXp(
              25,
              `Zaliczono ćwiczenie w edytorze: ${lesson.interactiveExercise.title}`,
              `exercise-${lesson.interactiveExercise.id}`
            );
          }}
          savedCode={currentUser.savedCode?.[lesson.interactiveExercise.id]}
          onSave={(code) => saveCodeSnippet(lesson.interactiveExercise.id, code)}
        />
      </section>

      {/* SECTION 6: Zadanie do samodzielnego rozwiązania */}
      <section className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-6 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <Lightbulb className="h-5 w-5" />
          <h2 className="text-base font-bold text-white">6. Zadanie do samodzielnego rozwiązania</h2>
        </div>
        <h3 className="text-sm font-bold text-slate-200">{lesson.independentTask.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{lesson.independentTask.instructions}</p>
        <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Oczekiwany rezultat:</span>
          <p className="text-slate-300">{lesson.independentTask.expectedOutcome}</p>
          <p className="text-[11px] text-amber-400 mt-1 italic">Wskazówka: {lesson.independentTask.starterHint}</p>
        </div>
      </section>

      {/* SECTION 7: Test wiedzy */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-indigo-400">
            <HelpCircle className="h-5 w-5" />
            <h2 className="text-lg font-bold text-white">7. Test wiedzy (Quiz)</h2>
          </div>
          {currentUser.quizScores?.[lesson.id] !== undefined && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Twój najlepszy wynik: {currentUser.quizScores[lesson.id]}%
            </span>
          )}
        </div>

        <div className="space-y-4">
          {lesson.quiz.map((q, qIndex) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
                <p className="text-sm font-bold text-white">
                  Pytanie {qIndex + 1}: {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = userAnswer === optIndex;
                    let optionStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800';

                    if (quizSubmitted) {
                      if (optIndex === q.correctAnswer) {
                        optionStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-rose-500/60 bg-rose-950/40 text-rose-200';
                      } else {
                        optionStyle = 'border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-indigo-500 bg-indigo-950/40 text-indigo-200 font-medium';
                    }

                    return (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, optIndex)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && optIndex === q.correctAnswer && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-rose-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="pt-2 text-xs text-slate-400 border-t border-slate-800/60 mt-3">
                    <span className="font-semibold text-slate-300">Wyjaśnienie: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Out of lives prompt if 0 lives on Free tier */}
        {!currentUser.isPro && currentLives <= 0 && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-rose-300">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500 shrink-0" />
              <div>
                <span className="font-bold">Brak serc do weryfikacji quizu!</span>
                <p className="text-[11px] text-slate-300">Odnów serce za darmo w szybkiej powtórce lub wymień XP w sklepie.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsLivesModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 transition-colors"
            >
              Uzupełnij serca (+1 ❤️)
            </button>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          {!quizSubmitted ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                onClick={handleEvaluateQuiz}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center gap-2"
              >
                <span>Zatwierdź odpowiedzi</span>
                {!currentUser.isPro && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-indigo-700/60 px-2 py-0.5 rounded-md font-mono">
                    <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
                    Koszt błędu: 1 ❤️
                  </span>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResetQuiz}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Spróbuj ponownie
            </button>
          )}

          {/* Quick hearts reminder */}
          <button
            type="button"
            onClick={() => setIsLivesModalOpen(true)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Heart className={`h-3.5 w-3.5 ${currentUser.isPro ? 'fill-amber-400 text-amber-400' : 'fill-rose-500 text-rose-500'}`} />
            <span>{currentUser.isPro ? 'Nielimitowane podejścia PRO' : `Dostępne serca: ${currentLives}/5`}</span>
          </button>
        </div>
      </section>

      {/* SECTION 8: Typowe błędy i sposób ich naprawy */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-indigo-400">
          <AlertOctagon className="h-5 w-5 text-rose-400" />
          <h2 className="text-lg font-bold text-white">8. Typowe błędy i sposób ich naprawy</h2>
        </div>
        <div className="space-y-4">
          {lesson.commonMistakes.map((mistake, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <h3 className="text-xs font-bold text-rose-400 flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 shrink-0" />
                <span>Błąd: {mistake.mistake}</span>
              </h3>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-400">Dlaczego występuje:</strong> {mistake.whyItHappens}
              </p>
              <p className="text-xs text-slate-300">
                <strong className="text-emerald-400">Jak naprawić:</strong> {mistake.howToFix}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <CodeBlock
                  code={mistake.badCode}
                  language={lesson.codeExamples[0]?.language || 'javascript'}
                  title="Błędny zapis"
                  badge="Błąd"
                  badgeColor="rose"
                  showLineNumbers={false}
                />
                <CodeBlock
                  code={mistake.goodCode}
                  language={lesson.codeExamples[0]?.language || 'javascript'}
                  title="Prawidłowy zapis"
                  badge="Poprawnie"
                  badgeColor="emerald"
                  showLineNumbers={false}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: Zadanie praktyczne */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <Award className="h-5 w-5" />
          <h2 className="text-base font-bold text-white">9. Zadanie praktyczne do wykonania lokalnie</h2>
        </div>
        <h3 className="text-sm font-bold text-white">{lesson.practicalTask.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{lesson.practicalTask.brief}</p>
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-bold text-slate-400">Kroki wykonania:</span>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
            {lesson.practicalTask.steps.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ol>
        </div>
        <div className="mt-2 text-xs text-indigo-300 bg-indigo-950/40 p-3 rounded-lg border border-indigo-900/40">
          <strong>Efekt końcowy:</strong> {lesson.practicalTask.deliverable}
        </div>
      </section>

      {/* SECTION 10: Podsumowanie i kryteria zaliczenia */}
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-6 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckSquare className="h-5 w-5" />
          <h2 className="text-base font-bold text-white">10. Podsumowanie i kryteria zaliczenia lekcji</h2>
        </div>
        
        <p className="text-xs text-slate-300">
          Zaznacz opanowane zagadnienia, aby upewnić się, że materiał został w pełni przyswojony:
        </p>

        <div className="space-y-2">
          {lesson.completionCriteria.map((crit, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer text-xs text-slate-200 select-none hover:bg-slate-800 transition-colors"
            >
              <input
                type="checkbox"
                checked={checkedCriteria[idx] || isCompleted}
                onChange={(e) => setCheckedCriteria((prev) => ({ ...prev, [idx]: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span>{crit}</span>
            </label>
          ))}
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCompleteLessonAction}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
                isCompleted
                  ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-900/40'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>
                {isCompleted
                  ? 'Lekcja zaliczona — Otwórz quiz końcowy'
                  : `Zalicz lekcję (+${lesson.xpReward} XP) i przejdź do quizu`}
              </span>
            </button>

            {!isCompleted && !showPostLessonQuiz && (
              <button
                type="button"
                onClick={() => {
                  setShowPostLessonQuiz(true);
                  setTimeout(() => {
                    document
                      .getElementById('post-lesson-quiz')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-300 text-xs font-bold transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Uruchom interaktywny quiz</span>
              </button>
            )}
          </div>

          {/* Next Lesson Button */}
          {nextLesson && (
            <button
              type="button"
              onClick={() => setActiveTab('lesson', nextLesson.id)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              <span>Następna lekcja: {nextLesson.title}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* INTERACTIVE POST-LESSON QUIZ (Appears upon completing the lesson or manual trigger) */}
      {(isCompleted || showPostLessonQuiz) && (
        <PostLessonQuiz
          lesson={lesson}
          nextLesson={nextLesson}
          onNavigateNext={() => {
            if (nextLesson) {
              setActiveTab('lesson', nextLesson.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      )}

    </div>
  );
};
