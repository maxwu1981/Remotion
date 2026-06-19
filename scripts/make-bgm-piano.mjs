#!/usr/bin/env node
/**
 * Synthesizes a soft, pedal-sustained **piano** loop (no drums, no noise, no
 * crackle) as raw PCM and encodes it to public/bgm-piano.mp3 — a calm, warm bed
 * for the Auto-Upload tutorial. Felt-piano timbre: a few gently-decaying
 * harmonics with slight inharmonicity, soft attacks (no clicks), a long ring,
 * light room reverb, and a master low-pass so nothing is harsh.
 *
 *   npm run bgm:piano
 *
 * A seamless ~30s loop; Remotion loops it quietly under the whole piece.
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SR = 44100;
const BPM = 64;
const beat = (SR * 60) / BPM;
const bar = beat * 4;
const BARS = 8;
const N = Math.floor(bar * BARS);
const buf = new Float32Array(N);

let seed = 4242;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

// felt-piano harmonics — soft uppers so it never gets shrill
const HARM = [1, 0.32, 0.12, 0.05, 0.022];
const INHARM = 0.00045;

/** One piano note that rings and decays (sustain-pedal feel). */
const note = (start, freq, amp, decay = 1.5, dur = 3.2) => {
  const s = Math.max(0, Math.floor(start));
  const e = Math.min(N, Math.floor(start + dur * SR));
  const atk = 0.007; // soft attack, no click
  for (let i = s; i < e; i++) {
    const t = (i - s) / SR;
    let v = 0;
    for (let h = 0; h < HARM.length; h++) {
      const n = h + 1;
      const fn = freq * n * Math.sqrt(1 + INHARM * n * n);
      v += HARM[h] * Math.sin(2 * Math.PI * fn * t);
    }
    const a = Math.min(1, t / atk);
    const ring = Math.exp(-t * decay);
    const rel = t > dur - 0.25 ? Math.max(0, (dur - t) / 0.25) : 1;
    buf[i] += v * a * ring * rel * amp;
  }
};

// humanize
const jit = (ms = 14) => (rnd() * ms / 1000) * SR;
const vel = (v = 0.16) => 1 + rnd() * v - v / 2;

// I – V – vi – IV in C (calm, universally warm), held two cycles
const PROG = [
  { bass: 48, notes: [60, 64, 67], lead: 72 }, // C    : C3 · C4 E4 G4
  { bass: 43, notes: [59, 62, 67], lead: 74 }, // G    : G2 · B3 D4 G4
  { bass: 45, notes: [60, 64, 69], lead: 76 }, // Am   : A2 · C4 E4 A4
  { bass: 41, notes: [60, 65, 69], lead: 72 }, // F    : F2 · C4 F4 A4
];

for (let b = 0; b < BARS; b++) {
  const ch = PROG[b % PROG.length];
  const b0 = b * bar;

  // left hand — low root, long ring (pedal down); fifth mid-bar
  note(b0 + jit(), midi(ch.bass), 0.5 * vel(), 0.7, 3.6);
  note(b0 + beat * 2 + jit(), midi(ch.bass + 7), 0.32 * vel(), 0.8, 2.6);

  // right hand — gentle broken chord across the bar, notes overlap and ring
  const seq = [ch.notes[0], ch.notes[1], ch.notes[2], ch.notes[1]];
  seq.forEach((m, k) => {
    note(b0 + k * beat + jit(18), midi(m), 0.2 * vel(), 1.5, 3.0);
  });

  // a sparse top melody note for warmth (not every bar)
  if (b % 2 === 0) note(b0 + beat * 1.5 + jit(20), midi(ch.lead), 0.13 * vel(0.3), 2.0, 2.4);
  if (b % 4 === 3) note(b0 + beat * 3 + jit(20), midi(ch.lead - 5), 0.11 * vel(0.3), 2.0, 2.2);
}

// light room reverb — a few soft taps, no metallic comb
[[0.071, 0.2], [0.149, 0.13], [0.227, 0.08], [0.331, 0.05]].forEach(([sec, g]) => {
  const dt = Math.floor(sec * SR);
  for (let i = dt; i < N; i++) buf[i] += buf[i - dt] * g;
});

// master low-pass (warmth — removes any harsh edge) + gentle saturation
let lp = 0;
for (let i = 0; i < N; i++) {
  lp += 0.1 * (buf[i] - lp); // ~one-pole, mellow cutoff
  buf[i] = Math.tanh(lp * 0.95) * 0.6;
}

// edge fades for clean looping
const f = Math.floor(0.05 * SR);
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
const tmp = join(root, "public", "_bgm_piano.wav");
writeFileSync(tmp, wav);
execSync(`ffmpeg -y -hide_banner -loglevel error -i "${tmp}" -ar 44100 -ac 1 -b:a 192k "${join(root, "public", "bgm-piano.mp3")}"`);
execSync(`rm -f "${tmp}"`);
console.log(`✓ soft piano bgm-piano.mp3 (${(N / SR).toFixed(1)}s · ${BPM} BPM · no drums/noise · low-pass warmth)`);
