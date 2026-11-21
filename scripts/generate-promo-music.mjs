import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SAMPLE_RATE = 48000;
const DURATION_SEC = 15.0;
const TOTAL_SAMPLES = Math.round(SAMPLE_RATE * DURATION_SEC);
const BPM = 120;
const BEAT_SEC = 60 / BPM; // 0.5s
const BAR_SEC = BEAT_SEC * 4; // 2.0s

const rootDir = process.cwd();
const promoDir = path.join(rootDir, 'public', 'promo');
const targetVideos = [
  path.join(promoDir, 'fsda-promo-15s.mp4'),
  path.join(promoDir, 'fsda-promo-15s-en.mp4'),
];

const midiToHz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// Deterministic PRNG for reproducible drums & risers
let rngState = 0x5f3759df;
function rand() {
  rngState = (rngState * 1664525 + 1013904223) >>> 0;
  return (rngState / 0xffffffff) * 2 - 1;
}

// Band-limited warm supersaw-like oscillator (sum of first N harmonics with gentle rolloff)
function warmSaw(phase, harmonics = 7) {
  let sum = 0;
  for (let k = 1; k <= harmonics; k++) {
    sum += Math.sin(phase * k) / (k * (1 + 0.08 * k));
  }
  return sum * 0.62;
}

function softTriangle(phase) {
  return (
    Math.sin(phase) -
    Math.sin(phase * 3) / 9 +
    Math.sin(phase * 5) / 25
  ) * 0.85;
}

// Smooth one-pole lowpass filter helper
function applyLowPass(buf, cutoffFn) {
  let y = 0;
  const twoPiOverSr = (2 * Math.PI) / SAMPLE_RATE;
  for (let i = 0; i < buf.length; i++) {
    const fc = Math.max(40, Math.min(18000, cutoffFn(i / SAMPLE_RATE)));
    const alpha = (twoPiOverSr * fc) / (1 + twoPiOverSr * fc);
    y += alpha * (buf[i] - y);
    buf[i] = y;
  }
}

function applyHighPass(buf, cutoffHz) {
  const rc = 1 / (2 * Math.PI * cutoffHz);
  const dt = 1 / SAMPLE_RATE;
  const alpha = rc / (rc + dt);
  let y = 0;
  let prevX = 0;
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i];
    y = alpha * (y + x - prevX);
    prevX = x;
    buf[i] = y;
  }
}

// Buffers for stems (stereo)
const padL = new Float32Array(TOTAL_SAMPLES);
const padR = new Float32Array(TOTAL_SAMPLES);
const bassL = new Float32Array(TOTAL_SAMPLES);
const bassR = new Float32Array(TOTAL_SAMPLES);
const pluckL = new Float32Array(TOTAL_SAMPLES);
const pluckR = new Float32Array(TOTAL_SAMPLES);
const leadL = new Float32Array(TOTAL_SAMPLES);
const leadR = new Float32Array(TOTAL_SAMPLES);
const drumsL = new Float32Array(TOTAL_SAMPLES);
const drumsR = new Float32Array(TOTAL_SAMPLES);
const fxL = new Float32Array(TOTAL_SAMPLES);
const fxR = new Float32Array(TOTAL_SAMPLES);

// Chord timeline synced to public/promo/reel.html scenes:
// Scene 1: 0.0 - 2.6s (Hook)
// Scene 2: 2.5 - 7.5s (IDE + 80% Ready Code, +150 XP at 5.8s)
// Scene 3: 7.4 - 11.9s (6 Simulators peak energy)
// Scene 4: 11.8 - 15.0s (Metrics & CTA fsda.tech outro)
const CHORDS = [
  { start: 0.0, end: 2.0, bass: 45, notes: [57, 60, 64, 67, 71] }, // Am9
  { start: 2.0, end: 4.0, bass: 41, notes: [53, 57, 60, 64, 67] }, // Fmaj9
  { start: 4.0, end: 6.0, bass: 48, notes: [55, 60, 64, 67, 71, 74] }, // Cmaj9
  { start: 6.0, end: 8.0, bass: 43, notes: [55, 59, 62, 64, 69] }, // G6/9
  { start: 8.0, end: 9.0, bass: 45, notes: [57, 60, 64, 67, 71] }, // Am9
  { start: 9.0, end: 10.0, bass: 41, notes: [53, 57, 60, 64, 67] }, // Fmaj9
  { start: 10.0, end: 11.0, bass: 48, notes: [55, 60, 64, 67, 71, 74] }, // Cmaj9
  { start: 11.0, end: 12.0, bass: 43, notes: [55, 59, 62, 67, 69] }, // Gadd9
  { start: 12.0, end: 13.0, bass: 41, notes: [53, 57, 60, 64, 67] }, // Fmaj9 (Outro arrival)
  { start: 13.0, end: 15.0, bass: 48, notes: [48, 55, 60, 64, 67, 71, 74] }, // Cmaj9 (Final resolve)
];

// 1. Lush Stereo Warm Pad
for (const chord of CHORDS) {
  const s0 = Math.floor(chord.start * SAMPLE_RATE);
  const s1 = Math.min(TOTAL_SAMPLES, Math.floor((chord.end + 0.35) * SAMPLE_RATE));
  const dur = chord.end - chord.start;
  for (let nIdx = 0; nIdx < chord.notes.length; nIdx++) {
    const hz = midiToHz(chord.notes[nIdx]);
    const detuneL = hz * 0.9965;
    const detuneR = hz * 1.0035;
    const pan = -0.35 + (nIdx / Math.max(1, chord.notes.length - 1)) * 0.7;
    const gainL = Math.cos(((pan + 1) * Math.PI) / 4);
    const gainR = Math.sin(((pan + 1) * Math.PI) / 4);
    const phaseOffset = nIdx * 1.13;

    for (let i = s0; i < s1; i++) {
      const lt = (i - s0) / SAMPLE_RATE;
      const attack = Math.min(1, lt / 0.16);
      const release = lt > dur ? Math.max(0, 1 - (lt - dur) / 0.35) : 1;
      const env = attack * release;
      const vL = warmSaw(2 * Math.PI * detuneL * lt + phaseOffset, 5) * 0.55 + Math.sin(2 * Math.PI * hz * lt) * 0.45;
      const vR = warmSaw(2 * Math.PI * detuneR * lt + phaseOffset + 0.5, 5) * 0.55 + Math.sin(2 * Math.PI * hz * lt) * 0.45;
      const scale = (0.14 / Math.sqrt(chord.notes.length)) * env;
      padL[i] += vL * scale * gainL;
      padR[i] += vR * scale * gainR;
    }
  }
}

// Smooth dynamic filter sweep on pads matching promo energy arc
const padCutoff = (t) => {
  if (t < 2.0) return 520 + (t / 2.0) * 680; // warm rise in Hook
  if (t < 4.0) return 1200 + ((t - 2.0) / 2.0) * 1100; // opens for IDE
  if (t < 8.0) return 2100 + Math.sin((t - 4.0) * 1.5) * 350; // clear & bright
  if (t < 12.0) return 2900; // peak simulator chorus
  if (t < 13.0) return 2400; // outro hit
  return Math.max(480, 2400 - ((t - 13.0) / 2.0) * 1700); // silky close
};
applyLowPass(padL, padCutoff);
applyLowPass(padR, padCutoff);

// 2. Warm Punchy Sub + Mid Bass (plays from 2.0s to 14.2s)
const BASS_RHYTHM = [0, 0.5, 0.75, 1.25, 1.5]; // syncopated modern electro groove per 2s bar
for (const chord of CHORDS) {
  if (chord.start < 2.0) {
    // Gentle soft bass swell in Scene 1
    const s0 = Math.floor(0.25 * SAMPLE_RATE);
    const s1 = Math.floor(2.0 * SAMPLE_RATE);
    const hz = midiToHz(chord.bass);
    for (let i = s0; i < s1; i++) {
      const lt = (i - s0) / SAMPLE_RATE;
      const env = Math.min(1, lt / 0.6) * (lt > 1.55 ? Math.max(0, 1 - (lt - 1.55) / 0.2) : 1);
      const val = Math.sin(2 * Math.PI * hz * lt) * 0.16 * env;
      bassL[i] += val;
      bassR[i] += val;
    }
    continue;
  }

  const hz = midiToHz(chord.bass);
  const chordLen = chord.end - chord.start;

  if (chord.start >= 12.0) {
    // Sustained warm outro bass notes
    const s0 = Math.floor(chord.start * SAMPLE_RATE);
    const dur = chord.start >= 13.0 ? 1.8 : 0.95;
    const s1 = Math.min(TOTAL_SAMPLES, Math.floor((chord.start + dur) * SAMPLE_RATE));
    for (let i = s0; i < s1; i++) {
      const lt = (i - s0) / SAMPLE_RATE;
      const env = Math.min(1, lt / 0.02) * Math.exp(-lt * (chord.start >= 13.0 ? 1.5 : 0.9));
      const sub = Math.sin(2 * Math.PI * hz * lt);
      const mid = softTriangle(2 * Math.PI * hz * 2 * lt) * 0.28;
      const val = (sub * 0.75 + mid) * 0.26 * env;
      bassL[i] += val;
      bassR[i] += val;
    }
    continue;
  }

  const stepOffsets = chordLen >= 1.9 ? BASS_RHYTHM : [0, 0.5, 0.75];
  for (const offset of stepOffsets) {
    const t0 = chord.start + offset;
    const noteDur = offset === 0.75 ? 0.36 : 0.32;
    const s0 = Math.floor(t0 * SAMPLE_RATE);
    const s1 = Math.min(TOTAL_SAMPLES, Math.floor((t0 + noteDur) * SAMPLE_RATE));
    for (let i = s0; i < s1; i++) {
      const lt = (i - s0) / SAMPLE_RATE;
      const env = Math.min(1, lt / 0.008) * Math.exp(-lt * 5.2);
      const sub = Math.sin(2 * Math.PI * hz * lt);
      const upper = warmSaw(2 * Math.PI * hz * 2 * lt, 4) * 0.24 * Math.exp(-lt * 10);
      const val = (sub * 0.8 + upper) * 0.27 * env;
      bassL[i] += val;
      bassR[i] += val;
    }
  }
}
applyLowPass(bassL, () => 460);
applyLowPass(bassR, () => 460);

// 3. Pluck Synth Arpeggio (modern glassy Marimba/FM-pluck texture)
function addPluck(bufL, bufR, startTime, midi, velocity = 0.2, pan = 0, bright = 1.0, decay = 7.5) {
  const s0 = Math.floor(startTime * SAMPLE_RATE);
  const s1 = Math.min(TOTAL_SAMPLES, s0 + Math.floor(0.75 * SAMPLE_RATE));
  const hz = midiToHz(midi);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);

  for (let i = s0; i < s1; i++) {
    const lt = (i - s0) / SAMPLE_RATE;
    const env = Math.min(1, lt / 0.004) * Math.exp(-lt * decay);
    const modIndex = 1.45 * bright * Math.exp(-lt * 16);
    const fm = Math.sin(2 * Math.PI * hz * lt + modIndex * Math.sin(2 * Math.PI * hz * 2 * lt));
    const overtone = Math.sin(2 * Math.PI * hz * 3 * lt) * 0.14 * bright * Math.exp(-lt * 18);
    const sample = (fm * 0.86 + overtone) * velocity * env;
    bufL[i] += sample * gL;
    bufR[i] += sample * gR;
  }
}

const ARP_PATTERN = [0, 2, 4, 2, 1, 3, 4, 2]; // 8th-note melodic arp (0.25s steps)
for (const chord of CHORDS) {
  if (chord.start >= 13.0) {
    // Gentle ascending final sparkle on Cmaj9 resolve
    const finalNotes = [64, 67, 71, 72, 76];
    finalNotes.forEach((n, idx) => {
      addPluck(pluckL, pluckR, 13.0 + idx * 0.16, n, 0.16 - idx * 0.015, -0.3 + idx * 0.15, 0.85, 3.2);
    });
    break;
  }
  const stepSec = 0.25;
  const steps = Math.round((chord.end - chord.start) / stepSec);
  for (let s = 0; s < steps; s++) {
    const t = chord.start + s * stepSec;
    const idx = ARP_PATTERN[s % ARP_PATTERN.length] % chord.notes.length;
    const octaveLift = chord.start >= 8.0 && s % 4 === 2 ? 12 : 0;
    const midi = chord.notes[idx] + octaveLift;
    const vel = chord.start < 2.0 ? 0.13 : chord.start >= 8.0 ? 0.2 : 0.17;
    const bright = chord.start < 2.0 ? 0.55 : chord.start >= 8.0 ? 1.15 : 0.9;
    const pan = (s % 2 === 0 ? -0.32 : 0.32);
    addPluck(pluckL, pluckR, t, midi, vel, pan, bright, 6.8);
  }
}

// 4. Catchy Uplifting Tech Lead Melody (Scene 2 + Chorus Scene 3 + Outro Resolve)
const MELODY = [
  // Scene 2 (IDE coding groove: playful inspiring motif)
  { t: 4.0, m: 76, v: 0.21 }, // E5
  { t: 4.5, m: 74, v: 0.18 }, // D5
  { t: 4.75, m: 72, v: 0.2 }, // C5
  { t: 5.25, m: 76, v: 0.2 }, // E5
  { t: 5.75, m: 79, v: 0.23 }, // G5 — hits right on "+150 XP" pass!
  { t: 6.25, m: 76, v: 0.18 }, // E5
  { t: 6.75, m: 74, v: 0.2 }, // D5
  { t: 7.25, m: 71, v: 0.19 }, // B4
  { t: 7.5, m: 72, v: 0.2 }, // C5
  { t: 7.75, m: 74, v: 0.21 }, // D5

  // Scene 3 (Simulators high-energy anthem hook)
  { t: 8.0, m: 76, v: 0.25 }, // E5
  { t: 8.375, m: 79, v: 0.23 }, // G5
  { t: 8.75, m: 81, v: 0.25 }, // A5
  { t: 9.0, m: 79, v: 0.24 }, // G5
  { t: 9.375, m: 76, v: 0.22 }, // E5
  { t: 9.75, m: 72, v: 0.22 }, // C5
  { t: 10.0, m: 76, v: 0.25 }, // E5
  { t: 10.375, m: 79, v: 0.24 }, // G5
  { t: 10.75, m: 84, v: 0.26 }, // C6 (peak!)
  { t: 11.0, m: 83, v: 0.25 }, // B5
  { t: 11.375, m: 79, v: 0.23 }, // G5
  { t: 11.75, m: 76, v: 0.22 }, // E5

  // Scene 4 (Confident brand CTA resolve)
  { t: 12.0, m: 81, v: 0.24 }, // A5 over Fmaj9
  { t: 12.5, m: 79, v: 0.22 }, // G5
  { t: 13.0, m: 84, v: 0.24 }, // C6 over Cmaj9 (triumphant resolve!)
];

for (const note of MELODY) {
  const isLong = note.t >= 12.0;
  addPluck(leadL, leadR, note.t, note.m, note.v, 0.08, 1.15, isLong ? 2.4 : 4.2);
  // Subtle octave-down warmth body
  addPluck(leadL, leadR, note.t, note.m - 12, note.v * 0.35, -0.1, 0.5, isLong ? 2.8 : 5.0);
}

// Special subtle crystalline "+150 XP" chime at 5.80s (in key: C6 + G6)
addPluck(fxL, fxR, 5.8, 84, 0.14, -0.25, 1.3, 4.0);
addPluck(fxL, fxR, 5.86, 91, 0.12, 0.25, 1.3, 3.6);

// 5. Dotted-8th Stereo Ping-Pong Delay on Pluck + Lead
function applyStereoDelay(bufL, bufR, delaySecL, delaySecR, feedback, mix) {
  const dL = Math.floor(delaySecL * SAMPLE_RATE);
  const dR = Math.floor(delaySecR * SAMPLE_RATE);
  const wetL = new Float32Array(TOTAL_SAMPLES);
  const wetR = new Float32Array(TOTAL_SAMPLES);
  let lpL = 0;
  let lpR = 0;
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const srcL = i >= dL ? bufL[i - dL] + wetR[i - dL] * feedback : 0;
    const srcR = i >= dR ? bufR[i - dR] + wetL[i - dR] * feedback : 0;
    // Gentle warm lowpass inside delay feedback loop
    lpL += 0.22 * (srcL - lpL);
    lpR += 0.22 * (srcR - lpR);
    wetL[i] = lpL;
    wetR[i] = lpR;
  }
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    bufL[i] += wetL[i] * mix;
    bufR[i] += wetR[i] * mix;
  }
}
applyStereoDelay(pluckL, pluckR, 0.375, 0.25, 0.36, 0.34);
applyStereoDelay(leadL, leadR, 0.375, 0.5, 0.32, 0.3);

// 6. Modern Punchy Electronic Drums + Sidechain Trigger List
const kickTimes = [];

function addKick(startTime, gain = 0.62) {
  kickTimes.push(startTime);
  const s0 = Math.floor(startTime * SAMPLE_RATE);
  const len = Math.floor(0.24 * SAMPLE_RATE);
  const s1 = Math.min(TOTAL_SAMPLES, s0 + len);
  let phase = 0;
  for (let i = s0; i < s1; i++) {
    const lt = (i - s0) / SAMPLE_RATE;
    const freq = 46 + 115 * Math.exp(-lt * 38);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.min(1, lt / 0.0025) * Math.exp(-lt * 13.5);
    const click = Math.exp(-lt * 260) * Math.sin(2 * Math.PI * 1600 * lt) * 0.22;
    const raw = (Math.sin(phase) + click) * env * gain;
    const sat = Math.tanh(raw * 1.35);
    drumsL[i] += sat;
    drumsR[i] += sat;
  }
}

function addClapSnare(startTime, gain = 0.32) {
  const s0 = Math.floor(startTime * SAMPLE_RATE);
  const len = Math.floor(0.18 * SAMPLE_RATE);
  const s1 = Math.min(TOTAL_SAMPLES, s0 + len);
  const tmpL = new Float32Array(len);
  const tmpR = new Float32Array(len);
  for (let k = 0; k < len; k++) {
    const lt = k / SAMPLE_RATE;
    // Layered 3-burst clap transient + tail
    const burst =
      Math.exp(-Math.pow((lt - 0.004) / 0.006, 2)) +
      Math.exp(-Math.pow((lt - 0.013) / 0.007, 2)) +
      Math.exp(-Math.pow((lt - 0.022) / 0.009, 2)) * 0.9;
    const tail = Math.exp(-lt * 20) * 0.85;
    const env = Math.min(1.4, burst * 0.6 + tail);
    const body = Math.sin(2 * Math.PI * (185 - lt * 120) * lt) * Math.exp(-lt * 30) * 0.32;
    tmpL[k] = (rand() * env * 0.55 + body) * gain;
    tmpR[k] = (rand() * env * 0.55 + body) * gain;
  }
  applyHighPass(tmpL, 950);
  applyHighPass(tmpR, 950);
  applyLowPass(tmpL, () => 6200);
  applyLowPass(tmpR, () => 6200);
  for (let k = 0; k < len && s0 + k < TOTAL_SAMPLES; k++) {
    drumsL[s0 + k] += tmpL[k];
    drumsR[s0 + k] += tmpR[k];
  }
}

function addHat(startTime, open = false, gain = 0.14, pan = 0.18) {
  const s0 = Math.floor(startTime * SAMPLE_RATE);
  const dur = open ? 0.16 : 0.045;
  const len = Math.floor(dur * SAMPLE_RATE);
  const tmp = new Float32Array(len);
  for (let k = 0; k < len; k++) {
    const lt = k / SAMPLE_RATE;
    const env = Math.min(1, lt / 0.0015) * Math.exp(-lt * (open ? 18 : 65));
    tmp[k] = rand() * env * gain;
  }
  applyHighPass(tmp, 7200);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let k = 0; k < len && s0 + k < TOTAL_SAMPLES; k++) {
    drumsL[s0 + k] += tmp[k] * gL;
    drumsR[s0 + k] += tmp[k] * gR;
  }
}

// Schedule kicks, claps & hats across the 15s arc:
// 0.0 - 2.0s: soft atmospheric intro (light offbeat tick only at 1.0, 1.5)
addHat(1.0, false, 0.07, -0.2);
addHat(1.5, false, 0.09, 0.2);
addHat(1.75, false, 0.1, -0.15);

// 2.0 - 4.0s: pulse builds into Scene 2 IDE
for (let b = 4; b < 8; b++) {
  const t = b * BEAT_SEC;
  addKick(t, 0.48);
  addHat(t + 0.25, false, 0.11, 0.22);
}
addClapSnare(3.5, 0.22); // pickup into full drop at 4.0s

// 4.0 - 12.0s: full upbeat 4-on-the-floor groove (beats 8..23)
for (let b = 8; b < 24; b++) {
  const t = b * BEAT_SEC;
  const isChorus = b >= 16; // 8.0s+ Scene 3 peak energy
  addKick(t, isChorus ? 0.64 : 0.56);
  if (b % 2 === 1) {
    addClapSnare(t, isChorus ? 0.34 : 0.27);
  }
  // Crisp 16th-note hat groove
  addHat(t, false, isChorus ? 0.08 : 0.06, -0.18);
  addHat(t + 0.125, false, isChorus ? 0.07 : 0.05, 0.15);
  addHat(t + 0.25, isChorus && b % 2 === 1, isChorus ? 0.15 : 0.12, 0.24);
  addHat(t + 0.375, false, isChorus ? 0.09 : 0.06, -0.22);
}

// 12.0s: Confident final downbeat kick + soft snare resolve at 12.5s, then drums drop out for clean brand outro!
addKick(12.0, 0.62);
addKick(12.5, 0.4);

// 7. Smooth Risers & Shimmer Crash FX synced to Scene Cuts
function addRiser(startTime, endTime, peakGain = 0.14) {
  const s0 = Math.floor(startTime * SAMPLE_RATE);
  const s1 = Math.min(TOTAL_SAMPLES, Math.floor(endTime * SAMPLE_RATE));
  const len = s1 - s0;
  const tmpL = new Float32Array(len);
  const tmpR = new Float32Array(len);
  for (let k = 0; k < len; k++) {
    const p = k / len;
    const env = Math.pow(p, 2.2) * (p > 0.94 ? (1 - p) / 0.06 : 1);
    tmpL[k] = rand() * env * peakGain;
    tmpR[k] = rand() * env * peakGain;
  }
  applyHighPass(tmpL, 500);
  applyHighPass(tmpR, 500);
  applyLowPass(tmpL, (lt) => 600 + (lt / (endTime - startTime)) * 6800);
  applyLowPass(tmpR, (lt) => 650 + (lt / (endTime - startTime)) * 6800);
  for (let k = 0; k < len; k++) {
    fxL[s0 + k] += tmpL[k];
    fxR[s0 + k] += tmpR[k];
  }
}

function addShimmerImpact(startTime, gain = 0.15) {
  const s0 = Math.floor(startTime * SAMPLE_RATE);
  const len = Math.floor(1.4 * SAMPLE_RATE);
  const tmpL = new Float32Array(len);
  const tmpR = new Float32Array(len);
  for (let k = 0; k < len; k++) {
    const lt = k / SAMPLE_RATE;
    const env = Math.min(1, lt / 0.015) * Math.exp(-lt * 2.6);
    tmpL[k] = rand() * env * gain;
    tmpR[k] = rand() * env * gain;
  }
  applyHighPass(tmpL, 3800);
  applyHighPass(tmpR, 3800);
  applyLowPass(tmpL, () => 11500);
  applyLowPass(tmpR, () => 11500);
  for (let k = 0; k < len && s0 + k < TOTAL_SAMPLES; k++) {
    fxL[s0 + k] += tmpL[k];
    fxR[s0 + k] += tmpR[k];
  }
}

addRiser(2.8, 4.0, 0.1);
addShimmerImpact(4.0, 0.11);
addRiser(7.0, 8.0, 0.14);
addShimmerImpact(8.0, 0.14);
addRiser(11.2, 12.0, 0.12);
addShimmerImpact(12.0, 0.15);

// 8. Smooth Sidechain Ducking on Pad + Bass synced to Kick Drum
const sidechain = new Float32Array(TOTAL_SAMPLES).fill(1.0);
for (const kt of kickTimes) {
  const s0 = Math.floor(kt * SAMPLE_RATE);
  const releaseSamples = Math.floor(0.2 * SAMPLE_RATE);
  for (let k = 0; k < releaseSamples && s0 + k < TOTAL_SAMPLES; k++) {
    const p = k / releaseSamples;
    const duck = 0.42 + 0.58 * Math.pow(p, 0.65);
    if (duck < sidechain[s0 + k]) {
      sidechain[s0 + k] = duck;
    }
  }
}

// 9. Mix Bus + Clean Schroeder Stereo Reverb on melodic bus
const melodicL = new Float32Array(TOTAL_SAMPLES);
const melodicR = new Float32Array(TOTAL_SAMPLES);
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const sc = sidechain[i];
  melodicL[i] = padL[i] * sc + pluckL[i] + leadL[i] + fxL[i] * 0.9;
  melodicR[i] = padR[i] * sc + pluckR[i] + leadR[i] + fxR[i] * 0.9;
}

function addSchroederReverb(inL, inR, wetMix = 0.22) {
  const combDelaysL = [1557, 1617, 1491, 1422];
  const combDelaysR = [1580, 1640, 1514, 1445];
  const combFeedback = 0.78;
  const revL = new Float32Array(TOTAL_SAMPLES);
  const revR = new Float32Array(TOTAL_SAMPLES);

  for (let c = 0; c < 4; c++) {
    const dL = combDelaysL[c];
    const dR = combDelaysR[c];
    const bufL = new Float32Array(dL);
    const bufR = new Float32Array(dR);
    let idxL = 0;
    let idxR = 0;
    let dampL = 0;
    let dampR = 0;

    for (let i = 0; i < TOTAL_SAMPLES; i++) {
      const yL = bufL[idxL];
      dampL = yL * 0.72 + dampL * 0.28;
      bufL[idxL] = inL[i] * 0.25 + dampL * combFeedback;
      revL[i] += yL;
      idxL = (idxL + 1) % dL;

      const yR = bufR[idxR];
      dampR = yR * 0.72 + dampR * 0.28;
      bufR[idxR] = inR[i] * 0.25 + dampR * combFeedback;
      revR[i] += yR;
      idxR = (idxR + 1) % dR;
    }
  }

  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    inL[i] += revL[i] * wetMix;
    inR[i] += revR[i] * wetMix;
  }
}

addSchroederReverb(melodicL, melodicR, 0.24);

// Final stereo master mix + smooth fade-in (0.18s) & fade-out (1.1s) + gentle soft limiter
const masterL = new Float32Array(TOTAL_SAMPLES);
const masterR = new Float32Array(TOTAL_SAMPLES);
let peak = 0;

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  const sc = sidechain[i];
  const fadeIn = Math.min(1, t / 0.18);
  const fadeOut = t > 13.85 ? Math.max(0, Math.pow(1 - (t - 13.85) / 1.15, 1.5)) : 1;
  const env = fadeIn * fadeOut;

  let l = (melodicL[i] + bassL[i] * (0.65 + 0.35 * sc) + drumsL[i] * 0.92) * env;
  let r = (melodicR[i] + bassR[i] * (0.65 + 0.35 * sc) + drumsR[i] * 0.92) * env;

  // Soft analog bus saturation
  l = Math.tanh(l * 1.12);
  r = Math.tanh(r * 1.12);

  masterL[i] = l;
  masterR[i] = r;
  peak = Math.max(peak, Math.abs(l), Math.abs(r));
}

const norm = peak > 0 ? 0.92 / peak : 1;

// Write 16-bit PCM Stereo WAV to /tmp/fsda-promo-music-raw.wav
const rawWavPath = '/tmp/fsda-promo-music-raw.wav';
const dataBytes = TOTAL_SAMPLES * 4; // 2 channels * 2 bytes
const wavBuf = Buffer.alloc(44 + dataBytes);
wavBuf.write('RIFF', 0);
wavBuf.writeUInt32LE(36 + dataBytes, 4);
wavBuf.write('WAVE', 8);
wavBuf.write('fmt ', 12);
wavBuf.writeUInt32LE(16, 16); // PCM
wavBuf.writeUInt16LE(1, 20); // Linear PCM
wavBuf.writeUInt16LE(2, 22); // Stereo
wavBuf.writeUInt32LE(SAMPLE_RATE, 24);
wavBuf.writeUInt32LE(SAMPLE_RATE * 4, 28);
wavBuf.writeUInt16LE(4, 32);
wavBuf.writeUInt16LE(16, 34);
wavBuf.write('data', 36);
wavBuf.writeUInt32LE(dataBytes, 40);

let offset = 44;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const sL = Math.max(-1, Math.min(1, masterL[i] * norm));
  const sR = Math.max(-1, Math.min(1, masterR[i] * norm));
  wavBuf.writeInt16LE(Math.round(sL * 32767), offset);
  wavBuf.writeInt16LE(Math.round(sR * 32767), offset + 2);
  offset += 4;
}

fs.writeFileSync(rawWavPath, wavBuf);
console.log(`Synthesized stereo WAV (${DURATION_SEC}s @ ${SAMPLE_RATE}Hz) -> ${rawWavPath}`);

// Master WAV via ffmpeg (subtle EQ warmth + -14 LUFS loudness normalization)
const masteredWavPath = '/tmp/fsda-promo-music-mastered.wav';
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-i',
    rawWavPath,
    '-af',
    'highpass=f=32,equalizer=f=110:t=q:w=1.0:g=1.4,equalizer=f=360:t=q:w=1.1:g=-1.5,treble=g=1.5:f=8500,loudnorm=I=-14:TP=-1.5:LRA=9',
    '-ar',
    '48000',
    '-ac',
    '2',
    masteredWavPath,
  ],
  { stdio: 'inherit' }
);

// Mux mastered AAC audio into both PL & EN promo MP4 videos (preserving H.264 video stream losslessly)
for (const videoPath of targetVideos) {
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Missing promo video: ${videoPath}`);
  }
  const tmpOut = `${videoPath}.muxing.mp4`;
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      videoPath,
      '-i',
      masteredWavPath,
      '-map',
      '0:v:0',
      '-map',
      '1:a:0',
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-ar',
      '48000',
      '-ac',
      '2',
      '-shortest',
      '-movflags',
      '+faststart',
      tmpOut,
    ],
    { stdio: 'inherit' }
  );
  fs.renameSync(tmpOut, videoPath);
  console.log(`Muxed soundtrack into ${path.relative(rootDir, videoPath)}`);
}

// Cleanup temp WAV files
fs.rmSync(rawWavPath, { force: true });
fs.rmSync(masteredWavPath, { force: true });
console.log('Done! Both promo videos now include mastered 48kHz stereo AAC music.');
