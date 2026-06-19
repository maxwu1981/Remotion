#!/usr/bin/env node
/**
 * Synthesizes a warm, *humanized* Lo-Fi / chillhop loop (detuned pads, a sparse
 * Rhodes-ish melody, soft swung drums, sidechain pump, tape echo + vinyl warmth)
 * as raw PCM, then encodes it to public/bgm.mp3. Far less rigid than block sines.
 *
 *   npm run bgm
 *
 * A seamless ~25s loop; Remotion loops it quietly under the whole piece.
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SR = 44100;
const BPM = 74;
const beat = (SR * 60) / BPM;
const bar = beat * 4;
const BARS = 8;
const N = Math.floor(bar * BARS);
const buf = new Float32Array(N);

let seed = 9781;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const cents = (f, c) => f * Math.pow(2, c / 1200);

// generic ADSR-ish envelope
const env = (t, dur, a, r) => {
  if (t < 0 || t > dur) return 0;
  return Math.min(1, t / a) * (t > dur - r ? Math.max(0, (dur - t) / r) : 1);
};

/** Add a tone. type: pad | rhodes | bass. Pads/rhodes get 2 detuned oscillators. */
const tone = (start, dur, freq, amp, type) => {
  const s = Math.max(0, Math.floor(start));
  const e = Math.min(N, Math.floor(start + dur * SR));
  const det = type === "bass" ? 0 : 5 + rnd() * 3;
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    let v;
    if (type === "pad") {
      const p1 = 2 * Math.PI * freq * t;
      const p2 = 2 * Math.PI * cents(freq, det) * t;
      v = (Math.sin(p1) + Math.sin(p2) + 0.3 * Math.sin(2 * p1)) * env(t, dur, 0.14, 0.6) * 0.5;
    } else if (type === "rhodes") {
      const p = 2 * Math.PI * freq * t;
      // bell-ish: fundamental + soft FM shimmer, quick-ish decay
      v = (Math.sin(p + 1.2 * Math.sin(2 * p)) + 0.25 * Math.sin(2 * p)) *
        env(t, dur, 0.008, 0.4) * Math.exp(-t * 1.7);
    } else {
      const p = 2 * Math.PI * freq * t;
      v = (Math.sin(p) + 0.3 * Math.sin(2 * p) * Math.exp(-t * 6)) * env(t, dur, 0.02, 0.12);
    }
    buf[i] += v * amp;
  }
};

const kickEnv = new Float32Array(N); // for sidechain
const kick = (start) => {
  const dur = 0.34;
  const s = Math.floor(start);
  const e = Math.min(N, Math.floor(start + dur * SR));
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    const f = 105 * Math.exp(-t * 24) + 44;
    buf[i] += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 6.5) * 0.85;
    kickEnv[i] = Math.max(kickEnv[i], Math.exp(-t * 7));
  }
};
const noiseHit = (start, dur, amp, hp, decay) => {
  const s = Math.floor(start);
  const e = Math.min(N, Math.floor(start + dur * SR));
  let prev = 0;
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    let n = rnd();
    if (hp) { const v = n - prev; prev = n; n = v; }
    buf[i] += n * Math.exp(-t * decay) * amp;
  }
};

// humanize helpers
const jit = (ms = 16) => (rnd() * ms / 1000) * SR;
const vel = (v = 0.18) => 1 + rnd() * v - v / 2;

// I–vi–ii–V in C, jazzy 7ths
const CHORDS = [
  [60, 64, 67, 71], // Cmaj7
  [57, 60, 64, 67], // Am7
  [62, 65, 69, 72], // Dm7
  [55, 59, 62, 65], // G7
];
const PENTA = [72, 74, 76, 79, 81]; // C D E G A (one octave up)

for (let b = 0; b < BARS; b++) {
  const chord = CHORDS[Math.floor(b / 2) % CHORDS.length];
  const b0 = b * bar;

  // pads — soft swell, humanized, detuned
  chord.forEach((m, k) =>
    tone(b0 + k * 0.02 * SR + jit(20), (bar / SR) * 0.96, midi(m), 0.1 * vel(), "pad"),
  );
  // bass — root, then fifth on beat 3, warm
  tone(b0 + jit(), 0.6, midi(chord[0] - 12), 0.42 * vel(), "bass");
  tone(b0 + beat * 2 + jit(), 0.55, midi(chord[0] - 12 + 7), 0.36 * vel(), "bass");

  // sparse rhodes melody — 2 notes per bar, off the grid
  if (b % 1 === 0) {
    const n1 = PENTA[(b * 2) % PENTA.length];
    const n2 = PENTA[(b * 3 + 1) % PENTA.length];
    tone(b0 + beat * 1.5 + jit(25), 0.7, midi(n1), 0.085 * vel(0.3), "rhodes");
    if (b % 2 === 1) tone(b0 + beat * 3.25 + jit(25), 0.6, midi(n2), 0.07 * vel(0.3), "rhodes");
  }

  // drums — soft kick (1 & "and of 3"), soft clap on beat 3, swung hats
  kick(b0 + jit(8));
  kick(b0 + beat * 2.5 + jit(8));
  noiseHit(b0 + beat * 2 + jit(10), 0.14, 0.22 * vel(), false, 26); // soft clap/backbeat
  for (let h = 0; h < 8; h++) {
    if (h % 4 === 2 && rnd() > 0.4) continue; // drop some for groove
    const sw = h % 2 ? beat * 0.07 : 0;
    noiseHit(b0 + h * beat * 0.5 + sw + jit(8), 0.045, 0.07 * vel(0.4), true, 70);
  }
}

// sidechain: duck everything slightly on each kick (pump = groove)
for (let i = 0; i < N; i++) buf[i] *= 1 - 0.32 * kickEnv[i];

// tape echo (1/8-note feedback) for space
const dt = Math.floor(beat * 0.5);
for (let i = dt; i < N; i++) buf[i] += buf[i - dt] * 0.22;
const dt2 = Math.floor(beat * 0.75);
for (let i = dt2; i < N; i++) buf[i] += buf[i - dt2] * 0.12;

// vinyl crackle bed + master low-pass (warmth) + soft saturation
let lp = 0;
for (let i = 0; i < N; i++) {
  const crackle = (Math.abs(rnd()) > 0.985 ? rnd() * 0.12 : 0) + rnd() * 0.004;
  lp += 0.13 * (buf[i] + crackle - lp);
  buf[i] = Math.tanh(lp * 1.15) * 0.55;
}
// edge fades for clean looping
const f = Math.floor(0.012 * SR);
for (let i = 0; i < f; i++) { buf[i] *= i / f; buf[N - 1 - i] *= i / f; }

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
const tmp = join(root, "public", "_bgm.wav");
writeFileSync(tmp, wav);
execSync(`ffmpeg -y -hide_banner -loglevel error -i "${tmp}" -ar 44100 -ac 1 -b:a 192k "${join(root, "public", "bgm.mp3")}"`);
execSync(`rm -f "${tmp}"`);
console.log(`✓ warm lo-fi bgm.mp3 (${(N / SR).toFixed(1)}s · ${BPM} BPM · humanized + melody + echo)`);
