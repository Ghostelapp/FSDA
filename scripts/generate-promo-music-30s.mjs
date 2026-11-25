/**
 * Procedural Stereo Commercial Tech Anthem Synthesizer & Mastering Pipeline (30s)
 * Generates a fresh 30.0s, 124 BPM stereo soundtrack in E minor / G major
 * synced to all 6 scenes of public/promo/reel-30s.html, masters to -14 LUFS,
 * and muxes 192kbps 48kHz stereo AAC audio into PL & EN MP4 promo reels.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SAMPLE_RATE = 48000;
const DURATION_S = 30.0;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_S);
const BPM = 124;
const BEAT_S = 60 / BPM; // 0.4838709677s
const STEP_S = BEAT_S / 4; // 16th note = 0.1209677s
const BAR_S = BEAT_S * 4; // 1.93548387s

const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

// Deterministic PRNG for clean, repeatable hi-hats, claps & risers
let rngState = 0x9e3779b9;
function rand() {
  rngState = (rngState ^ (rngState << 13)) >>> 0;
  rngState = (rngState ^ (rngState >>> 17)) >>> 0;
  rngState = (rngState ^ (rngState << 5)) >>> 0;
  return (rngState / 0xffffffff) * 2 - 1;
}

function midiToHz(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function addStereo(idx, sample, pan = 0, gain = 1) {
  if (idx < 0 || idx >= TOTAL_SAMPLES) return;
  const p = clamp(pan, -1, 1);
  const gL = Math.cos(((p + 1) * Math.PI) / 4) * gain;
  const gR = Math.sin(((p + 1) * Math.PI) / 4) * gain;
  left[idx] += sample * gL;
  right[idx] += sample * gR;
}

// Band-limited-ish soft saw / triangle helpers
function softSaw(phase) {
  const f = phase - Math.floor(phase);
  const raw = 2 * f - 1;
  return raw - 0.28 * Math.sin(2 * Math.PI * f);
}

// Em9 -> Cmaj9 -> Gmaj9 -> D6/9 (bright uplifting commercial tech progression)
const CHORDS = [
  { root: 40, notes: [52, 59, 62, 66, 67, 71] }, // Em9
  { root: 36, notes: [48, 55, 59, 62, 64, 67] }, // Cmaj9
  { root: 43, notes: [55, 62, 66, 69, 71, 74] }, // Gmaj9
  { root: 38, notes: [50, 57, 59, 64, 66, 69] }, // D6/9
];

function getChordAtBar(barIdx) {
  // Resolve firmly to Gmaj9 / Em9 on final outro
  if (barIdx >= 14) return CHORDS[2];
  return CHORDS[barIdx % 4];
}

// Track kick times for smooth sidechain pumping
const kickTimes = [];

function synthKick(startS, amp = 0.78) {
  kickTimes.push(startS);
  const startIdx = Math.floor(startS * SAMPLE_RATE);
  const dur = 0.24;
  const len = Math.floor(dur * SAMPLE_RATE);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const idx = startIdx + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    const freq = 46 + 128 * Math.exp(-t * 34);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.exp(-t * 15.5) * Math.min(1, t / 0.0025);
    const click = Math.exp(-t * 220) * 0.45 * Math.sin(2 * Math.PI * 1900 * t);
    const body = Math.tanh(Math.sin(phase) * 1.45) * env;
    const s = (body + click) * amp;
    left[idx] += s;
    right[idx] += s;
  }
}

function synthSnareClap(startS, amp = 0.42, bright = true) {
  const startIdx = Math.floor(startS * SAMPLE_RATE);
  const dur = 0.22;
  const len = Math.floor(dur * SAMPLE_RATE);
  let lp = 0;
  let hp = 0;
  for (let i = 0; i < len; i++) {
    const idx = startIdx + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    const n = rand();
    // Dual-burst clap envelope
    const burst =
      Math.exp(-t * 28) +
      (t > 0.011 ? 0.65 * Math.exp(-(t - 0.011) * 32) : 0) +
      (t > 0.023 ? 0.55 * Math.exp(-(t - 0.023) * 20) : 0);
    lp += 0.36 * (n - lp);
    hp = n - lp;
    const tone = Math.sin(2 * Math.PI * (195 - 50 * t) * t) * Math.exp(-t * 24) * 0.32;
    const s = ((bright ? hp : lp) * 0.42 * burst + tone) * amp;
    addStereo(idx, s, (i % 2 === 0 ? 0.08 : -0.08), 1);
  }
}

function synthHat(startS, open = false, amp = 0.18, pan = 0.14) {
  const startIdx = Math.floor(startS * SAMPLE_RATE);
  const dur = open ? 0.19 : 0.055;
  const len = Math.floor(dur * SAMPLE_RATE);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const idx = startIdx + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * (open ? 18 : 65)) * Math.min(1, t / 0.0012);
    const n = rand();
    const metal =
      Math.sin(2 * Math.PI * 6350 * t) * 0.18 +
      Math.sin(2 * Math.PI * 8420 * t) * 0.16 +
      (n - prev) * 0.68;
    prev = n;
    addStereo(idx, metal * env * amp, pan, 1);
  }
}

function synthPluck(startS, midi, durS, amp = 0.18, pan = 0, brightness = 0.5) {
  const startIdx = Math.floor(startS * SAMPLE_RATE);
  const len = Math.floor(durS * SAMPLE_RATE);
  const hz = midiToHz(midi);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const idx = startIdx + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    const env = Math.min(1, t / 0.004) * Math.exp(-t * (4.8 / Math.max(0.2, durS)));
    const osc =
      0.55 * softSaw(hz * t) +
      0.32 * softSaw(hz * 1.003 * t + 0.17) +
      0.22 * Math.sin(2 * Math.PI * hz * 2 * t);
    const cutoff = clamp(0.06 + brightness * 0.55 * Math.exp(-t * 9), 0.04, 0.72);
    lp += cutoff * (osc - lp);
    addStereo(idx, lp * env * amp, pan, 1);
  }
}

function synthLeadNote(startS, midi, durS, amp = 0.16, pan = 0) {
  const startIdx = Math.floor(startS * SAMPLE_RATE);
  const len = Math.floor((durS + 0.18) * SAMPLE_RATE);
  const hz = midiToHz(midi);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const idx = startIdx + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    const vib = 1 + 0.003 * Math.sin(2 * Math.PI * 5.6 * t) * Math.min(1, t / 0.12);
    const attack = Math.min(1, t / 0.012);
    const release = t > durS ? Math.exp(-(t - durS) * 12) : 1;
    const env = attack * release;
    const s1 = softSaw(hz * vib * t);
    const s2 = softSaw(hz * vib * 1.005 * t + 0.31);
    const s3 = Math.sin(2 * Math.PI * hz * vib * 0.5 * t) * 0.3;
    const raw = (s1 + s2) * 0.38 + s3;
    lp += 0.24 * (raw - lp);
    addStereo(idx, lp * env * amp, pan, 1);
  }
}

function synthBassNote(startS, midi, durS, amp = 0.32, punch = 1) {
  const startIdx = Math.floor(startS * SAMPLE_RATE);
  const len = Math.floor(durS * SAMPLE_RATE);
  const hz = midiToHz(midi);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const idx = startIdx + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    const attack = Math.min(1, t / 0.006);
    const tail = t > durS - 0.03 ? clamp((durS - t) / 0.03, 0, 1) : 1;
    const env = attack * tail;
    const sub = Math.sin(2 * Math.PI * hz * t) * 0.68;
    const growl = softSaw(hz * 2 * t) * 0.34;
    const cut = 0.08 + 0.22 * punch * Math.exp(-t * 11);
    lp += cut * (growl - lp);
    const s = Math.tanh((sub + lp) * 1.15) * env * amp;
    left[idx] += s;
    right[idx] += s;
  }
}

function synthRiser(startS, durS, amp = 0.22) {
  const startIdx = Math.floor(startS * SAMPLE_RATE);
  const len = Math.floor(durS * SAMPLE_RATE);
  let lp = 0;
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const idx = startIdx + i;
    if (idx >= TOTAL_SAMPLES) break;
    const p = i / len;
    const env = Math.pow(p, 2.3) * (1 - Math.pow(p, 28));
    const n = rand();
    const cut = 0.02 + 0.55 * p * p;
    lp += cut * (n - lp);
    const sweepHz = 180 + 1350 * p * p;
    phase += (2 * Math.PI * sweepHz) / SAMPLE_RATE;
    const s = (lp * 0.72 + Math.sin(phase) * 0.22) * env * amp;
    addStereo(idx, s, Math.sin(p * Math.PI * 3) * 0.45, 1);
  }
}

function synthImpact(startS, amp = 0.5) {
  const startIdx = Math.floor(startS * SAMPLE_RATE);
  const dur = 0.85;
  const len = Math.floor(dur * SAMPLE_RATE);
  let phase = 0;
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const idx = startIdx + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    const freq = 38 + 90 * Math.exp(-t * 6.5);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const sub = Math.sin(phase) * Math.exp(-t * 3.8);
    lp += 0.14 * (rand() - lp);
    const air = lp * Math.exp(-t * 5.2) * 0.45;
    const s = (sub * 0.75 + air) * amp * Math.min(1, t / 0.005);
    left[idx] += s;
    right[idx] += s;
  }
}

// Sparkling crystalline XP Chime (for Scene 3 +180 XP toast at 13.8s)
function synthXpChime(startS) {
  const notes = [76, 83, 86, 91, 95]; // E5, B5, D6, G6, B6
  notes.forEach((m, i) => {
    const t0 = startS + i * 0.068;
    const startIdx = Math.floor(t0 * SAMPLE_RATE);
    const len = Math.floor(0.75 * SAMPLE_RATE);
    const hz = midiToHz(m);
    for (let k = 0; k < len; k++) {
      const idx = startIdx + k;
      if (idx >= TOTAL_SAMPLES) break;
      const t = k / SAMPLE_RATE;
      const env = Math.min(1, t / 0.003) * Math.exp(-t * 5.2);
      const tone =
        Math.sin(2 * Math.PI * hz * t) * 0.65 +
        Math.sin(2 * Math.PI * hz * 2 * t) * 0.25 * Math.exp(-t * 8) +
        Math.sin(2 * Math.PI * hz * 3 * t) * 0.1 * Math.exp(-t * 14);
      addStereo(idx, tone * env * 0.17, -0.4 + i * 0.2, 1);
    }
  });
}

// Subtle mechanical code typing clicks (Scene 3, 10.3s - 13.1s)
function synthKeyClicks() {
  for (let t = 10.15; t <= 13.05; t += 0.115) {
    if (Math.abs(t - 11.42) < 0.18) continue; // brief pause between line 1 & line 2
    const startIdx = Math.floor(t * SAMPLE_RATE);
    const len = Math.floor(0.018 * SAMPLE_RATE);
    for (let i = 0; i < len; i++) {
      const idx = startIdx + i;
      if (idx >= TOTAL_SAMPLES) break;
      const sec = i / SAMPLE_RATE;
      const s = Math.sin(2 * Math.PI * 2450 * sec) * Math.exp(-sec * 240) * 0.055;
      addStereo(idx, s, ((t * 17) % 1) * 0.4 - 0.2, 1);
    }
  }
}

// 1. Continuous Lush Warm Pad (supersaw + sine harmonics, automated per scene)
console.log('Synthesizing lush pads...');
{
  const numBars = Math.ceil(DURATION_S / BAR_S);
  for (let bar = 0; bar < numBars; bar++) {
    const barStart = bar * BAR_S;
    const barEnd = Math.min(DURATION_S, (bar + 1) * BAR_S);
    const chord = getChordAtBar(bar);
    const s0 = Math.floor(barStart * SAMPLE_RATE);
    const s1 = Math.floor(barEnd * SAMPLE_RATE);
    let lpL = 0;
    let lpR = 0;
    for (let idx = s0; idx < s1; idx++) {
      const t = idx / SAMPLE_RATE;
      const local = t - barStart;
      const barDur = barEnd - barStart;
      const env = Math.min(1, local / 0.12) * Math.min(1, (barDur - local) / 0.14);

      // Dynamic scene energy curve for pad openness
      let openness = 0.16;
      let padAmp = 0.13;
      if (t < 4.0) {
        openness = 0.08 + (t / 4.0) * 0.22;
        padAmp = 0.14;
      } else if (t < 9.5) {
        openness = 0.13;
        padAmp = 0.11;
      } else if (t < 15.5) {
        openness = 0.22;
        padAmp = 0.13;
      } else if (t < 26.0) {
        openness = 0.36;
        padAmp = 0.17;
      } else {
        // Outro warm shimmer resolving cleanly
        openness = 0.32 * Math.max(0.25, 1 - (t - 26.0) / 4.2);
        padAmp = 0.18;
      }

      let sumL = 0;
      let sumR = 0;
      for (let n = 0; n < chord.notes.length; n++) {
        const hz = midiToHz(chord.notes[n]);
        const det = 1 + (n % 2 === 0 ? 0.0032 : -0.0032);
        const vL = softSaw(hz * t + n * 0.11) * 0.6 + Math.sin(2 * Math.PI * hz * t) * 0.4;
        const vR = softSaw(hz * det * t + n * 0.29) * 0.6 + Math.sin(2 * Math.PI * hz * det * t) * 0.4;
        sumL += vL;
        sumR += vR;
      }
      sumL /= chord.notes.length;
      sumR /= chord.notes.length;

      lpL += openness * (sumL - lpL);
      lpR += openness * (sumR - lpR);
      left[idx] += lpL * env * padAmp;
      right[idx] += lpR * env * padAmp;
    }
  }
}

// 2. Drums & Percussion (Scene-aware dynamic arrangement)
console.log('Synthesizing drums & percussion...');
{
  const totalSteps = Math.floor(DURATION_S / STEP_S);
  for (let step = 0; step < totalSteps; step++) {
    const t = step * STEP_S;
    if (t >= 28.4) break;
    const stepInBar = step % 16;

    // Scene 1 (0 - 4s): Gentle pulse entering at 1.93s
    if (t < 4.0) {
      if (t >= 1.9 && stepInBar % 4 === 0) synthKick(t, 0.56);
      if (t >= 1.9 && stepInBar % 2 === 0) synthHat(t, false, 0.11, step % 4 === 0 ? -0.15 : 0.18);
      continue;
    }

    // Scene 2 (4.0 - 9.5s): Smooth grooving beat (Map & Audio Narrator)
    if (t < 9.5) {
      if (stepInBar === 0 || stepInBar === 4 || stepInBar === 8 || stepInBar === 12) {
        synthKick(t, 0.68);
      }
      if (stepInBar === 4 || stepInBar === 12) {
        synthSnareClap(t, 0.28, false);
      }
      if (stepInBar % 2 === 0) {
        synthHat(t, stepInBar === 10, stepInBar % 4 === 2 ? 0.14 : 0.08, 0.2);
      }
      continue;
    }

    // Scene 3 (9.5 - 15.5s): Driving IDE groove + build-up snare roll at 14.5-15.4s
    if (t < 15.5) {
      if (t >= 14.5) {
        // Snare build-up into Scene 4 drop!
        const p = (t - 14.5) / 1.0;
        if (p < 0.55 ? step % 2 === 0 : true) {
          synthSnareClap(t, 0.18 + p * 0.28, true);
        }
      } else {
        if (stepInBar % 4 === 0) synthKick(t, 0.78);
        if (stepInBar === 4 || stepInBar === 12) synthSnareClap(t, 0.36, true);
        if (stepInBar % 2 === 0) synthHat(t, stepInBar === 6 || stepInBar === 14, 0.15, -0.16);
      }
      continue;
    }

    // Scene 4 & 5 (15.5 - 26.0s): Full anthem climax drop!
    if (t < 26.0) {
      if (t >= 25.35) {
        // Clean pre-outro fill
        if (step % 2 === 0) synthSnareClap(t, 0.34, true);
      } else {
        if (stepInBar % 4 === 0) synthKick(t, 0.86);
        if (stepInBar === 4 || stepInBar === 12) synthSnareClap(t, 0.44, true);
        synthHat(t, stepInBar === 2 || stepInBar === 10, stepInBar % 2 === 0 ? 0.17 : 0.09, step % 2 === 0 ? 0.24 : -0.22);
      }
      continue;
    }

    // Scene 6 (26.0 - 28.4s): Triumphant outro hits
    if (stepInBar === 0 || stepInBar === 4 || stepInBar === 8) {
      synthKick(t, 0.72 * Math.max(0.3, 1 - (t - 26.0) / 3.0));
    }
    if (stepInBar === 4) {
      synthSnareClap(t, 0.32, true);
    }
  }
}

// 3. Punchy Rolling Bassline
console.log('Synthesizing bassline...');
{
  const totalSteps = Math.floor(28.2 / STEP_S);
  const bassPattern = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0];
  for (let step = 0; step < totalSteps; step++) {
    const t = step * STEP_S;
    if (t < 1.9 || (t >= 14.55 && t < 15.5)) continue;
    const barIdx = Math.floor(t / BAR_S);
    const stepInBar = step % 16;
    if (!bassPattern[stepInBar]) continue;
    const chord = getChordAtBar(barIdx);
    const octaveBump = stepInBar === 10 || stepInBar === 13 ? 12 : 0;
    const energy = t < 9.5 ? 0.26 : t < 15.5 ? 0.32 : 0.38;
    synthBassNote(t, chord.root + octaveBump, STEP_S * 1.75, energy, t >= 15.5 ? 1.25 : 0.85);
  }
}

// 4. Sparkling Stereo Arpeggio Plucks
console.log('Synthesizing arpeggios & melodies...');
{
  const totalSteps = Math.floor(28.5 / STEP_S);
  const arpOrder = [0, 2, 4, 5, 4, 2, 3, 1];
  for (let step = 0; step < totalSteps; step++) {
    const t = step * STEP_S;
    if (t >= 14.7 && t < 15.5) continue;
    const barIdx = Math.floor(t / BAR_S);
    const chord = getChordAtBar(barIdx);
    const noteMidi = chord.notes[arpOrder[step % arpOrder.length]] + (step % 16 >= 12 ? 12 : 0);
    const pan = Math.sin(step * 0.72) * 0.58;
    const bright = t < 4.0 ? 0.35 + (t / 4.0) * 0.45 : t < 9.5 ? 0.45 : t < 15.5 ? 0.65 : 0.85;
    const amp = t < 9.5 ? 0.13 : t < 15.5 ? 0.15 : 0.17;
    synthPluck(t, noteMidi, STEP_S * 1.85, amp, pan, bright);
  }
}

// 5. Memorable Uplifting Lead Hook (Scenes 2, 4, 5 & Outro)
{
  // Scene 2 gentle glassy melody (4.0s - 9.0s)
  const s2Notes = [
    [4.0, 79, 0.38], [4.48, 78, 0.38], [4.97, 74, 0.72],
    [5.94, 76, 0.38], [6.42, 79, 0.38], [6.90, 83, 0.82],
    [7.87, 81, 0.38], [8.35, 79, 0.55],
  ];
  s2Notes.forEach(([t, m, d]) => synthPluck(t, m, d, 0.16, 0.18, 0.72));

  // Scene 4 & 5 anthemic wide synth lead hook (15.5s - 25.5s)
  const anthemPattern = [
    // Phrase A (4 bars)
    [0.0, 79, 0.36], [0.48, 83, 0.36], [0.96, 86, 0.62], [1.69, 83, 0.22],
    [1.93, 81, 0.36], [2.42, 79, 0.36], [2.90, 76, 0.72],
    [3.87, 79, 0.36], [4.35, 83, 0.36], [4.84, 88, 0.68], [5.56, 86, 0.22],
    [5.81, 83, 0.36], [6.29, 81, 0.45], [6.77, 78, 0.78],
  ];
  anthemPattern.forEach(([off, midi, dur]) => {
    const t = 15.5 + off;
    if (t < 25.2) {
      synthLeadNote(t, midi, dur, 0.17, -0.18);
      synthLeadNote(t + 0.012, midi + 12, dur * 0.85, 0.065, 0.28);
    }
  });
  // Second triumphant phrase leading to CTA (23.24s - 27.6s)
  const finaleLead = [
    [23.24, 79, 0.36], [23.72, 83, 0.36], [24.21, 86, 0.65], [24.94, 88, 0.36],
    [25.32, 91, 0.58], [26.0, 86, 1.35], [27.4, 83, 1.45],
  ];
  finaleLead.forEach(([t, midi, dur]) => {
    synthLeadNote(t, midi, dur, 0.17, 0.12);
    synthLeadNote(t + 0.015, midi - 12, dur, 0.08, -0.2);
  });
}

// 6. Scene-Synced Sound Design Accents (Risers, Impacts, Key Clicks, XP Chime)
console.log('Adding scene transitions & sound design...');
synthImpact(0.03, 0.52);
synthRiser(3.15, 0.85, 0.2);
synthImpact(4.0, 0.4);
synthRiser(8.6, 0.9, 0.22);
synthImpact(9.5, 0.46);
synthKeyClicks();
synthXpChime(13.8);
synthRiser(14.55, 0.95, 0.32);
synthImpact(15.5, 0.62);
synthRiser(20.65, 0.85, 0.22);
synthImpact(21.5, 0.45);
synthRiser(25.1, 0.9, 0.28);
synthImpact(26.0, 0.6);

// 7. Gentle Sidechain Pumping Ducking against Kick Hits
console.log('Applying sidechain pump & stereo reverb...');
{
  const duck = new Float32Array(TOTAL_SAMPLES).fill(1);
  const duckLen = Math.floor(0.16 * SAMPLE_RATE);
  for (const kt of kickTimes) {
    const s0 = Math.floor(kt * SAMPLE_RATE);
    for (let i = 0; i < duckLen; i++) {
      const idx = s0 + i;
      if (idx >= TOTAL_SAMPLES) break;
      const t = i / SAMPLE_RATE;
      const g = 1 - 0.34 * Math.exp(-t * 24) * Math.min(1, t / 0.004);
      if (g < duck[idx]) duck[idx] = g;
    }
  }
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    left[i] *= duck[i];
    right[i] *= duck[i];
  }
}

// 8. Clean Stereo Ping-Pong Delay + Schroeder-style Comb Reverb Tail
{
  const wetL = new Float32Array(TOTAL_SAMPLES);
  const wetR = new Float32Array(TOTAL_SAMPLES);
  const d1 = Math.floor(STEP_S * 3 * SAMPLE_RATE); // dotted 8th delay
  const d2 = Math.floor(STEP_S * 6 * SAMPLE_RATE);
  const combs = [1687, 1993, 2371, 2749];
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    let rL = 0;
    let rR = 0;
    if (i >= d1) {
      rL += right[i - d1] * 0.16;
      rR += left[i - d1] * 0.16;
    }
    if (i >= d2) {
      rL += left[i - d2] * 0.09;
      rR += right[i - d2] * 0.09;
    }
    for (let c = 0; c < combs.length; c++) {
      const tap = combs[c] + (c % 2 === 0 ? 0 : 37);
      if (i >= tap) {
        rL += (left[i - tap] + wetL[i - tap] * 0.38) * 0.09;
        rR += (right[i - tap] + wetR[i - tap] * 0.38) * 0.09;
      }
    }
    wetL[i] = rL;
    wetR[i] = rR;
  }

  // Mix dry + wet + soft limiter + clean fade-in/out
  const fadeOutStart = Math.floor(28.85 * SAMPLE_RATE);
  const fadeOutEnd = Math.floor(29.96 * SAMPLE_RATE);
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    let f = 1;
    if (i < 960) f = i / 960;
    if (i >= fadeOutStart) {
      f = clamp(1 - (i - fadeOutStart) / (fadeOutEnd - fadeOutStart), 0, 1);
      f = f * f;
    }
    left[i] = Math.tanh((left[i] + wetL[i] * 0.24) * 0.92) * f;
    right[i] = Math.tanh((right[i] + wetR[i] * 0.24) * 0.92) * f;
  }
}

// Write 16-bit PCM WAV
function writeWav(filePath, L, R, sampleRate) {
  const numSamples = L.length;
  const dataBytes = numSamples * 4; // 2 channels * 2 bytes
  const buf = Buffer.alloc(44 + dataBytes);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(2, 22); // stereo
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataBytes, 40);

  let off = 44;
  for (let i = 0; i < numSamples; i++) {
    const sL = Math.max(-1, Math.min(1, L[i]));
    const sR = Math.max(-1, Math.min(1, R[i]));
    buf.writeInt16LE(Math.round(sL * 32767), off);
    buf.writeInt16LE(Math.round(sR * 32767), off + 2);
    off += 4;
  }
  fs.writeFileSync(filePath, buf);
}

const tmpDir = '/tmp/fsda-promo-30s-audio';
fs.mkdirSync(tmpDir, { recursive: true });
const rawWav = path.join(tmpDir, 'raw-30s.wav');
const masteredM4a = path.join(tmpDir, 'mastered-30s.m4a');

writeWav(rawWav, left, right, SAMPLE_RATE);
console.log('Mastering audio to -14 LUFS AAC...');

execFileSync(
  'ffmpeg',
  [
    '-y',
    '-i',
    rawWav,
    '-af',
    'highpass=f=28,equalizer=f=280:t=q:w=1.2:g=-1.5,equalizer=f=3200:t=q:w=1.1:g=1.4,equalizer=f=10500:t=q:w=0.9:g=1.6,loudnorm=I=-14:TP=-1.2:LRA=8',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-ar',
    '48000',
    '-ac',
    '2',
    masteredM4a,
  ],
  { stdio: 'inherit' }
);

const targets = ['public/promo/fsda-promo-30s.mp4', 'public/promo/fsda-promo-30s-en.mp4'];
for (const target of targets) {
  if (!fs.existsSync(target)) {
    console.warn(`Skipping mux for missing video: ${target}`);
    continue;
  }
  const tmpOut = path.join(tmpDir, path.basename(target));
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      target,
      '-i',
      masteredM4a,
      '-map',
      '0:v:0',
      '-map',
      '1:a:0',
      '-c:v',
      'copy',
      '-c:a',
      'copy',
      '-shortest',
      '-movflags',
      '+faststart',
      tmpOut,
    ],
    { stdio: 'inherit' }
  );
  fs.copyFileSync(tmpOut, target);
  console.log(`Muxed mastered 30s audio -> ${target}`);
}

fs.rmSync(tmpDir, { recursive: true, force: true });
console.log('Done!');
