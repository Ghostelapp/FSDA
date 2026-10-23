import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Sparkles,
  HelpCircle,
  Heart,
  Lightbulb,
  Check,
  Flame,
  BookOpen
} from 'lucide-react';

interface PostLessonQuizProps {
  lesson: Lesson;
  nextLesson: Lesson | null;
  onNavigateNext?: () => void;
}

export const PostLessonQuiz: React.FC<PostLessonQuizProps> = ({
  lesson,
  nextLesson,
  onNavigateNext,
}) => {
  const {
    currentUser,
    saveQuizScore,
    loseLife,
    livesInfo,
    setIsLivesModalOpen,
    setActiveTab,
  } = useApp();

  const questions = lesson.quiz || [];
  const currentLives = currentUser.isPro ? 5 : (livesInfo.currentLives ?? currentUser.lives ?? 5);
  const previousBestScore = currentUser.quizScores?.[lesson.id];

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, number[]>>({});
  const [hintUsed, setHintUsed] = useState(false);

  // Reset internal state whenever lesson changes
  useEffect(() => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setAnswersHistory({});
    setIsFinished(false);
    setStreak(0);
    setBestStreak(0);
    setEliminatedOptions({});
    setHintUsed(false);
  }, [lesson.id]);

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentStep];
  const progressPercent = Math.round(
    ((currentStep + (isAnswerChecked ? 1 : 0)) / questions.length) * 100
  );

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    if (eliminatedOptions[currentQuestion.id]?.includes(index)) return;
    setSelectedOption(index);
  };

  const handleUseHint = () => {
    if (hintUsed || isAnswerChecked || !currentQuestion) return;
    const wrongIndices = currentQuestion.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQuestion.correctAnswer);

    if (wrongIndices.length > 0) {
      const randomWrong = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      setEliminatedOptions((prev) => ({
        ...prev,
        [currentQuestion.id]: [...(prev[currentQuestion.id] || []), randomWrong],
      }));
      if (selectedOption === randomWrong) {
        setSelectedOption(null);
      }
      setHintUsed(true);
    }
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;

    if (!currentUser.isPro && currentLives <= 0) {
      setIsLivesModalOpen(true);
      return;
    }

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsAnswerChecked(true);
    setAnswersHistory((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedOption,
    }));

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q) => {
        const chosen =
          q.id === currentQuestion.id ? selectedOption : answersHistory[q.id];
        if (chosen === q.correctAnswer) {
          correctCount++;
        }
      });

      const scorePercent = Math.round((correctCount / questions.length) * 100);
      saveQuizScore(lesson.id, scorePercent);

      if (scorePercent < 80) {
        loseLife(
          `Wynik quizu końcowego: ${scorePercent}%. Wymagane minimum to 80% — tracisz 1 serce.`
        );
      }

      setIsFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setAnswersHistory({});
    setIsFinished(false);
    setStreak(0);
    setBestStreak(0);
    setEliminatedOptions({});
    setHintUsed(false);
  };

  // Calculate final statistics when finished
  const correctAnswersCount = questions.reduce((acc, q) => {
    return acc + (answersHistory[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);
  const finalScorePercent = Math.round((correctAnswersCount / questions.length) * 100);
  const isPassed = finalScorePercent >= 80;

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <section
      id="post-lesson-quiz"
      className="rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-6 sm:p-8 shadow-xl shadow-indigo-950/30 space-y-6 transition-all"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span>Weryfikacja wiedzy po lekcji</span>
            {previousBestScore !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">
                  Najlepszy wynik: {previousBestScore}%
                </span>
              </>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            Interaktywny Quiz Podsumowujący: {lesson.title}
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {streak > 1 && !isFinished && (
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Flame className="h-4 w-4 fill-amber-400" />
              <span>Seria: {streak}x</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsLivesModalOpen(true)}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                currentUser.isPro
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-rose-500 text-rose-500'
              }`}
            />
            <span>
              {currentUser.isPro ? 'PRO: Nielimitowane serca' : `Serca: ${currentLives}/5`}
            </span>
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Step Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">
                Pytanie {currentStep + 1} z {questions.length}
              </span>
              <span className="font-mono">{progressPercent}% ukończono</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentQuestion.question}
              </h3>

              {!isAnswerChecked && !hintUsed && currentQuestion.options.length > 2 && (
                <button
                  type="button"
                  onClick={handleUseHint}
                  title="Odrzuć jedną błędną odpowiedź"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Podpowiedź 50/50</span>
                </button>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQuestion.correctAnswer;
                const isEliminated = eliminatedOptions[currentQuestion.id]?.includes(idx);

                let buttonClass =
                  'border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-700 hover:bg-slate-800/80';
                let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';

                if (isEliminated) {
                  buttonClass =
                    'border-slate-800/40 bg-slate-950/30 text-slate-600 line-through opacity-40 cursor-not-allowed';
                  badgeClass = 'bg-slate-900 text-slate-600 border-slate-800';
                } else if (isAnswerChecked) {
                  if (isCorrectOption) {
                    buttonClass =
                      'border-emerald-500/70 bg-emerald-950/40 text-emerald-100 font-semibold';
                    badgeClass =
                      'bg-emerald-500 text-slate-950 border-emerald-400 font-bold';
                  } else if (isSelected && !isCorrectOption) {
                    buttonClass =
                      'border-rose-500/70 bg-rose-950/40 text-rose-200';
                    badgeClass = 'bg-rose-500 text-white border-rose-400 font-bold';
                  } else {
                    buttonClass =
                      'border-slate-800/50 bg-slate-950/40 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  buttonClass =
                    'border-indigo-500 bg-indigo-950/50 text-white font-medium ring-1 ring-indigo-500/50';
                  badgeClass = 'bg-indigo-600 text-white border-indigo-400 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerChecked || isEliminated}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${buttonClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-mono transition-colors ${badgeClass}`}
                      >
                        {optionLabels[idx] || idx + 1}
                      </span>
                      <span className="leading-relaxed">{optionText}</span>
                    </div>

                    {isAnswerChecked && isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerChecked && isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback & Explanation */}
            {isAnswerChecked && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 ${
                  selectedOption === currentQuestion.correctAnswer
                    ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                    : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Świetnie! To poprawna odpowiedź.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span>Niepoprawna odpowiedź. Sprawdź wyjaśnienie poniżej:</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed pl-6">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="text-xs text-slate-400">
              {!isAnswerChecked
                ? 'Wybierz jedną odpowiedź i zatwierdź wybór.'
                : currentStep < questions.length - 1
                ? 'Gotowy na kolejne pytanie?'
                : 'To było ostatnie pytanie! Zobacz podsumowanie.'}
            </div>

            {!isAnswerChecked ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleVerifyAnswer}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-950/50"
              >
                <Check className="h-4 w-4" />
                <span>Sprawdź odpowiedź</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-950/50"
              >
                <span>
                  {currentStep < questions.length - 1
                    ? 'Następne pytanie'
                    : 'Zakończ i zobacz wynik'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Summary View */
        <div className="space-y-6">
          <div
            className={`rounded-2xl border p-6 sm:p-8 text-center space-y-4 ${
              isPassed
                ? 'border-emerald-500/40 bg-emerald-950/20'
                : 'border-amber-500/40 bg-amber-950/20'
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800">
              {isPassed ? (
                <Award className="h-9 w-9 text-emerald-400" />
              ) : (
                <HelpCircle className="h-9 w-9 text-amber-400" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Wynik końcowy quizu
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {finalScorePercent}%
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Poprawne odpowiedzi:{' '}
                <strong className="text-white">
                  {correctAnswersCount} z {questions.length}
                </strong>
                {bestStreak > 1 && (
                  <>
                    {' '}
                    · Najdłuższa seria:{' '}
                    <strong className="text-amber-400">{bestStreak}x</strong>
                  </>
                )}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {isPassed
                ? 'Gratulacje! Doskonale opanowałeś materiał z tej lekcji. Twój wynik został zapisany w profilu, a kolejna lekcja czeka na Ciebie.'
                : 'Aby zaliczyć test bez utraty serca, wymagane jest minimum 80% poprawnych odpowiedzi. Przejrzyj wyjaśnienia poniżej i spróbuj jeszcze raz!'}
            </p>

            {/* Summary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-bold text-slate-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Rozwiąż ponownie</span>
              </button>

              {nextLesson ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateNext) {
                      onNavigateNext();
                    } else {
                      setActiveTab('lesson', nextLesson.id);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs sm:text-sm font-bold text-white transition-colors shadow-lg shadow-indigo-950/50"
                >
                  <span>Następna lekcja: {nextLesson.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('modules')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs sm:text-sm font-bold text-white transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Wróć do modułów</span>
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Podsumowanie odpowiedzi krok po kroku:
            </h3>
            <div className="space-y-2.5">
              {questions.map((q, idx) => {
                const userChoice = answersHistory[q.id];
                const isCorrect = userChoice === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-bold text-slate-200">
                        {idx + 1}. {q.question}
                      </span>
                      {isCorrect ? (
                        <span className="shrink-0 text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Poprawnie
                        </span>
                      ) : (
                        <span className="shrink-0 text-rose-400 font-bold flex items-center gap-1">
                          <XCircle className="h-4 w-4" /> Błąd
                        </span>
                      )}
                    </div>

                    {!isCorrect && userChoice !== undefined && (
                      <p className="text-rose-300">
                        Twoja odpowiedź: {q.options[userChoice]}
                      </p>
                    )}
                    <p className="text-emerald-300 font-medium">
                      Poprawna odpowiedź: {q.options[q.correctAnswer]}
                    </p>
                    <p className="text-slate-400 pt-1 border-t border-slate-800/60">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
