#!/usr/bin/env node
/**
 * Synthesizes an energetic-but-smooth **tech** loop for the AI-voice video:
 * a driving sub-bass pulse, a fast plucky arpeggio, and a soft pad — all run
 * through a master low-pass so it stays warm, never harsh (no white-noise hats,
 * no crackle). Encoded to public/bgm-tech.mp3.
 *
 *   npm run bgm:tech
 *
 * A seamless ~16s loop; Remotion loops it quietly under the whole piece.
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SR = 44100;
const BPM = 120;
const beat = (SR * 60) / BPM;
const bar = beat * 4;
const BARS = 8;
const N = Math.floor(bar * BARS);
const buf = new Float32Array(N);

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const env = (t, dur, a, r) => (t < 0 || t > dur ? 0 : Math.min(1, t / a) * (t > dur - r ? Math.max(0, (dur - t) / r) : 1));

/** plucky bright tone (a few harmonics), used for the arpeggio */
const pluck = (start, dur, freq, amp) => {
  const s = Math.max(0, Math.floor(start));
  const e = Math.min(N, Math.floor(start + dur * SR));
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    const p = 2 * Math.PI * freq * t;
    const v = (Math.sin(p) + 0.4 * Math.sin(2 * p) + 0.2 * Math.sin(3 * p)) * Math.exp(-t * 5.5) * env(t, dur, 0.004, 0.05);
    buf[i] += v * amp;
  }
};

/** sub-bass pulse — sine with a punchy decay, gives the drive */
const sub = (start, dur, freq, amp) => {
  const s = Math.max(0, Math.floor(start));
  const e = Math.min(N, Math.floor(start + dur * SR));
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    const v = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 3.2) * env(t, dur, 0.006, 0.08);
    buf[i] += v * amp;
  }
};

/** soft detuned pad, sustained under each bar */
const pad = (start, dur, freq, amp) => {
  const s = Math.max(0, Math.floor(start));
  const e = Math.min(N, Math.floor(start + dur * SR));
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    const v = (Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * freq * 1.003 * t)) * 0.5 * env(t, dur, 0.25, 0.5);
    buf[i] += v * amp;
  }
};

// I–V–vi–IV in C, two cycles
const CHORDS = [
  [60, 64, 67],
  [55, 59, 62],
  [57, 60, 64],
  [53, 57, 60],
];

const sixteenth = beat / 4;
for (let b = 0; b < BARS; b++) {
  const chord = CHORDS[b % CHORDS.length];
  const b0 = b * bar;

  // pad: whole chord, soft
  chord.forEach((m) => pad(b0, bar / SR, midi(m), 0.05));

  // sub-bass pulse on every beat
  for (let k = 0; k < 4; k++) sub(b0 + k * beat, 0.42, midi(chord[0] - 12), 0.5);

  // fast arpeggio across the bar (16th notes), climbing chord tones
  const tones = [chord[0], chord[1], chord[2], chord[0] + 12];
  for (let s = 0; s < 16; s++) {
    const m = tones[s % tones.length] + (s >= 8 ? 12 : 0);
    pluck(b0 + s * sixteenth, 0.22, midi(m), 0.11);
  }
}

// master low-pass (warmth) + gentle saturation — no harsh highs
let lp = 0;
for (let i = 0; i < N; i++) {
  lp += 0.14 * (buf[i] - lp);
  buf[i] = Math.tanh(lp * 1.05) * 0.6;
}
// edge fades for clean looping
const f = Math.floor(0.03 * SR);
for (let i = 0; i < f; i++) {
  buf[i] *= i / f;
  buf[N - 1 - i] *= i / f;
}

// write 16-bit PCM WAV → mp3
const wav = Buffer.alloc(44 + N * 2);
wav.write("RIFF", 0); wav.writeUInt32LE(36 + N * 2, 4); wav.write("WAVE", 8);
wav.write("fmt ", 12); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22); wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28);
wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
wav.write("data", 36); wav.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) {
  const s = Math.max(-1, Math.min(1, buf[i]));
  wav.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
}
const tmp = join(root, "public", "_bgm_tech.wav");
writeFileSync(tmp, wav);
execSync(`ffmpeg -y -hide_banner -loglevel error -i "${tmp}" -ar 44100 -ac 1 -b:a 192k "${join(root, "public", "bgm-tech.mp3")}"`);
execSync(`rm -f "${tmp}"`);
console.log(`✓ tech bgm-tech.mp3 (${(N / SR).toFixed(1)}s · ${BPM} BPM · sub pulse + arp + pad · low-pass)`);
