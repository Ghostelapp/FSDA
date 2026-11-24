import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Lesson } from '../types';
import { AppLanguage } from '../utils/i18n';
import { BeginnerLessonAid } from '../utils/lessonReadability';
import {
  buildLessonNarrationScript,
  estimateNarrationDurationSeconds,
  filterVoicesForLanguage,
  formatNarrationTime,
  loadNarratorPreferences,
  NARRATION_RATES,
  saveNarratorPreferences,
  selectBestSpeechVoice,
  splitSegmentIntoSpeechChunks,
} from '../utils/lessonNarrator';

interface LessonAudioNarratorProps {
  lesson: Lesson;
  beginnerAid: BeginnerLessonAid;
  language: AppLanguage;
}

type PlaybackStatus = 'idle' | 'playing' | 'paused';

export const LessonAudioNarrator: React.FC<LessonAudioNarratorProps> = ({
  lesson,
  beginnerAid,
  language,
}) => {
  const isEn = language === 'en';

  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined';

  const segments = useMemo(
    () => buildLessonNarrationScript(lesson, beginnerAid, language),
    [lesson, beginnerAid, language]
  );

  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [currentChunkIdx, setCurrentChunkIdx] = useState(0);
  const [totalChunksInSegment, setTotalChunksInSegment] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [prefs, setPrefs] = useState(() => loadNarratorPreferences());

  // Refs to prevent stale closures inside SpeechSynthesisUtterance callbacks
  const playSessionRef = useRef(0);
  const statusRef = useRef<PlaybackStatus>('idle');
  const rateRef = useRef(prefs.rate);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const segmentsRef = useRef(segments);

  statusRef.current = status;
  rateRef.current = prefs.rate;
  segmentsRef.current = segments;

  const languageVoices = useMemo(
    () => filterVoicesForLanguage(availableVoices, language),
    [availableVoices, language]
  );

  const selectedVoice = useMemo(
    () =>
      selectBestSpeechVoice(
        availableVoices,
        language,
        prefs.voiceURIByLang[language]
      ),
    [availableVoices, language, prefs.voiceURIByLang]
  );

  selectedVoiceRef.current = selectedVoice;

  const totalEstimatedSeconds = useMemo(
    () =>
      segments.reduce(
        (sum, seg) => sum + estimateNarrationDurationSeconds(seg.text, prefs.rate),
        0
      ),
    [segments, prefs.rate]
  );

  // Load browser speech synthesis voices (handles async Chrome/Edge voiceschanged event)
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      try {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
          setAvailableVoices(list);
        }
      } catch {
        // Ignore browser voice enumeration quirks
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const stopSpeechEngine = useCallback(() => {
    playSessionRef.current += 1;
    if (isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel errors
      }
    }
  }, [isSupported]);

  // Cancel speech cleanly when switching lessons, language, or unmounting
  useEffect(() => {
    stopSpeechEngine();
    setStatus('idle');
    setCurrentSegmentIdx(0);
    setCurrentChunkIdx(0);
    setTotalChunksInSegment(1);
  }, [lesson.id, language, stopSpeechEngine]);

  useEffect(() => {
    return () => {
      stopSpeechEngine();
    };
  }, [stopSpeechEngine]);

  const speakFrom = useCallback(
    (segmentIndex: number, chunkIndex = 0) => {
      if (!isSupported) return;
      const allSegments = segmentsRef.current;
      if (allSegments.length === 0) return;

      const safeSegIdx = Math.max(0, Math.min(segmentIndex, allSegments.length - 1));
      const segment = allSegments[safeSegIdx];
      const chunks = splitSegmentIntoSpeechChunks(segment.text, 220);

      if (chunks.length === 0) {
        if (safeSegIdx + 1 < allSegments.length) {
          speakFrom(safeSegIdx + 1, 0);
        } else {
          setStatus('idle');
          setCurrentSegmentIdx(0);
          setCurrentChunkIdx(0);
        }
        return;
      }

      const safeChunkIdx = Math.max(0, Math.min(chunkIndex, chunks.length - 1));

      stopSpeechEngine();
      const sessionId = playSessionRef.current;

      setCurrentSegmentIdx(safeSegIdx);
      setCurrentChunkIdx(safeChunkIdx);
      setTotalChunksInSegment(chunks.length);
      setStatus('playing');

      const speakChunk = (idx: number) => {
        if (playSessionRef.current !== sessionId) return;
        const text = chunks[idx];
        if (!text) {
          if (safeSegIdx + 1 < segmentsRef.current.length) {
            speakFrom(safeSegIdx + 1, 0);
          } else {
            setStatus('idle');
            setCurrentSegmentIdx(0);
            setCurrentChunkIdx(0);
          }
          return;
        }

        setCurrentChunkIdx(idx);

        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = language === 'en' ? 'en-US' : 'pl-PL';
        utterance.rate = rateRef.current;
        utterance.pitch = 1;
        if (selectedVoiceRef.current) {
          utterance.voice = selectedVoiceRef.current;
        }

        utterance.onend = () => {
          if (playSessionRef.current !== sessionId) return;
          if (idx + 1 < chunks.length) {
            speakChunk(idx + 1);
          } else if (safeSegIdx + 1 < segmentsRef.current.length) {
            speakFrom(safeSegIdx + 1, 0);
          } else {
            setStatus('idle');
            setCurrentSegmentIdx(0);
            setCurrentChunkIdx(0);
          }
        };

        utterance.onerror = (event) => {
          if (playSessionRef.current !== sessionId) return;
          // 'interrupted' and 'canceled' happen normally on manual skip/stop
          if (event.error === 'interrupted' || event.error === 'canceled') return;
          setStatus('idle');
        };

        try {
          window.speechSynthesis.speak(utterance);
        } catch {
          setStatus('idle');
        }
      };

      speakChunk(safeChunkIdx);
    },
    [isSupported, language, stopSpeechEngine]
  );

  const handleTogglePlayPause = () => {
    if (!isSupported || segments.length === 0) return;

    if (status === 'playing') {
      try {
        window.speechSynthesis.pause();
        setStatus('paused');
      } catch {
        stopSpeechEngine();
        setStatus('paused');
      }
      return;
    }

    if (status === 'paused') {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setStatus('playing');
          return;
        }
      } catch {
        // Fallback: replay current chunk cleanly
      }
      speakFrom(currentSegmentIdx, currentChunkIdx);
      return;
    }

    speakFrom(currentSegmentIdx, 0);
  };

  const handleStop = () => {
    stopSpeechEngine();
    setStatus('idle');
    setCurrentSegmentIdx(0);
    setCurrentChunkIdx(0);
    setTotalChunksInSegment(1);
  };

  const handleStepSegment = (delta: -1 | 1) => {
    const nextIdx = currentSegmentIdx + delta;
    if (nextIdx < 0 || nextIdx >= segments.length) return;
    if (status === 'playing' || status === 'paused') {
      speakFrom(nextIdx, 0);
    } else {
      setCurrentSegmentIdx(nextIdx);
      setCurrentChunkIdx(0);
    }
  };

  const handleSelectRate = (newRate: number) => {
    const updated = { ...prefs, rate: newRate };
    setPrefs(updated);
    rateRef.current = newRate;
    saveNarratorPreferences(updated);

    if (statusRef.current === 'playing') {
      speakFrom(currentSegmentIdx, currentChunkIdx);
    }
  };

  const handleSelectVoice = (voiceURI: string) => {
    const updated = {
      ...prefs,
      voiceURIByLang: {
        ...prefs.voiceURIByLang,
        [language]: voiceURI,
      },
    };
    setPrefs(updated);
    saveNarratorPreferences(updated);

    const matched = availableVoices.find((v) => v.voiceURI === voiceURI) || null;
    selectedVoiceRef.current = matched;

    if (statusRef.current === 'playing') {
      speakFrom(currentSegmentIdx, currentChunkIdx);
    }
  };

  if (segments.length === 0) return null;

  const activeSegment = segments[currentSegmentIdx] || segments[0];
  const progressPercent =
    status === 'idle'
      ? 0
      : Math.min(
          100,
          Math.round(
            ((currentSegmentIdx + (currentChunkIdx + 0.5) / Math.max(1, totalChunksInSegment)) /
              Math.max(1, segments.length)) *
              100
          )
        );

  return (
    <section
      aria-label={isEn ? 'Audio lesson narrator' : 'Lektor audio lekcji'}
      data-testid="lesson-audio-narrator"
      data-status={status}
      className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 shadow-lg overflow-hidden"
    >
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Top Row: Title + Primary Playback Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                status === 'playing'
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
              }`}
            >
              {isSupported ? (
                <Headphones className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                <span className="font-bold text-indigo-300">
                  {isEn ? 'Audio Narrator' : 'Lektor lekcji'}
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="font-mono tabular-nums text-slate-400">
                  ~{formatNarrationTime(totalEstimatedSeconds)}
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="text-slate-400 tabular-nums">
                  {isEn
                    ? `Chapter ${currentSegmentIdx + 1}/${segments.length}`
                    : `Rozdział ${currentSegmentIdx + 1}/${segments.length}`}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {activeSegment.title}
              </p>
            </div>
          </div>

          {/* Transport Controls */}
          {isSupported ? (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleStepSegment(-1)}
                disabled={currentSegmentIdx === 0}
                aria-label={isEn ? 'Previous narration chapter' : 'Poprzedni rozdział lektora'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/80 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlayPause}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                {status === 'playing' ? (
                  <>
                    <Pause className="h-4 w-4 shrink-0" />
                    <span>{isEn ? 'Pause' : 'Wstrzymaj'}</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current shrink-0" />
                    <span>
                      {status === 'paused'
                        ? isEn
                          ? 'Resume'
                          : 'Wznów'
                        : isEn
                        ? 'Listen to lesson'
                        : 'Posłuchaj lekcji'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleStepSegment(1)}
                disabled={currentSegmentIdx >= segments.length - 1}
                aria-label={isEn ? 'Next narration chapter' : 'Następny rozdział lektora'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-950/80 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              {status !== 'idle' && (
                <button
                  type="button"
                  onClick={handleStop}
                  aria-label={isEn ? 'Stop narration' : 'Zatrzymaj lektora'}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-300 hover:bg-rose-950/50 transition-colors cursor-pointer"
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-amber-300">
              {isEn
                ? 'Your browser does not support built-in speech synthesis.'
                : 'Twoja przeglądarka nie obsługuje wbudowanego syntezatora mowy.'}
            </p>
          )}
        </div>

        {/* Progress Bar & Secondary Controls Row (Speed + Chapter/Voice Drawer Toggle) */}
        {isSupported && (
          <div className="space-y-2.5">
            <div
              role="progressbar"
              aria-label={isEn ? 'Lesson narration progress' : 'Postęp odsłuchu lekcji'}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
              className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden"
            >
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Speed Selector */}
              <div
                role="group"
                aria-label={isEn ? 'Narration speed' : 'Prędkość czytania'}
                className="inline-flex items-center gap-1"
              >
                <span className="text-[11px] font-semibold text-slate-400 mr-1">
                  {isEn ? 'Speed:' : 'Tempo:'}
                </span>
                {NARRATION_RATES.map((rateOption) => {
                  const active = prefs.rate === rateOption;
                  return (
                    <button
                      key={rateOption}
                      type="button"
                      onClick={() => handleSelectRate(rateOption)}
                      className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold transition-colors tabular-nums cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {rateOption}×
                    </button>
                  );
                })}
              </div>

              {/* Chapters & Voice Drawer Toggle */}
              <button
                type="button"
                aria-expanded={isDrawerOpen}
                onClick={() => setIsDrawerOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-indigo-500/40 transition-colors cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>{isEn ? 'Chapters & voice' : 'Rozdziały i głos'}</span>
                {isDrawerOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Chapters & Voice Selector Drawer */}
      {isSupported && isDrawerOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/50 p-4 sm:p-5 space-y-4">
          {/* Voice Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label
              htmlFor={`narrator-voice-select-${lesson.id}`}
              className="text-xs font-semibold text-slate-300 shrink-0"
            >
              {isEn ? 'Narrator voice:' : 'Głos lektora:'}
            </label>
            {languageVoices.length > 0 ? (
              <select
                id={`narrator-voice-select-${lesson.id}`}
                value={selectedVoice?.voiceURI || ''}
                onChange={(e) => handleSelectVoice(e.target.value)}
                className="w-full sm:w-auto sm:min-w-[260px] max-w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                {languageVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-slate-400">
                {isEn
                  ? 'Using system default voice for this language'
                  : 'Domyślny głos systemowy dla wybranego języka'}
              </span>
            )}
          </div>

          {/* Clickable Chapter List */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isEn
                ? 'Jump to chapter (code blocks are skipped automatically):'
                : 'Skocz do rozdziału (bloki kodu są automatycznie pomijane):'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {segments.map((seg, idx) => {
                const isCurrent = idx === currentSegmentIdx;
                const segSec = estimateNarrationDurationSeconds(seg.text, prefs.rate);
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => speakFrom(idx, 0)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      isCurrent
                        ? 'border-indigo-500/60 bg-indigo-950/40 text-indigo-200 font-semibold'
                        : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-indigo-500/40 hover:text-white'
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-mono text-[11px] text-indigo-400 mr-1.5 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      {seg.title}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 tabular-nums">
                      {formatNarrationTime(segSec)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
