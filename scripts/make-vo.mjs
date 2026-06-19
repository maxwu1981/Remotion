#!/usr/bin/env node
/**
 * Generates the voiceover track with the macOS `say` engine (free, local),
 * one mp3 per caption cue, into public/vo/<id>.mp3, and writes the measured
 * durations to src/videos/autoline/vo-manifest.json so scenes can re-time to the audio.
 *
 *   npm run vo                 # default voice
 *   VO_VOICE="Tom (Premium)" npm run vo
 *
 * `say` text is tuned for pronunciation (N-P-M, dot json, sixteen-by-nine …);
 * the on-screen captions in each scene stay clean.
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "Ava (Premium)";
const RATE = process.env.VO_RATE ? ["-r", process.env.VO_RATE] : [];

/** id → text spoken (pronunciation-tuned). Ids match each scene's CUES. */
const CUES = [
  ["s1-c1", "You recorded twenty minutes. Editing just ate two hours."],
  ["s1-c2", "Trimming dead air, re-recording every stumble. That's not creating — it's burning your life."],
  ["s1-c3", "What if you could build a fully automated video production line?"],

  ["s2-c1", "Here's the whole machine: a zero-touch automation factory."],
  ["s2-c2", "Record your raw footage, drop it in a folder, and the system takes over."],
  ["s2-c3", "It cuts the dead air, rewrites the script, and voices it with A.I."],
  ["s2-c4", "Then it renders a landscape and a vertical cut. Untouched by human hands."],

  ["s3-c0", "Five tools run this entire factory — and most are free."],
  ["s3-c1", "O-B-S Studio: your free, lossless recorder. Press record; the A.I. does the rest."],
  ["s3-c2", "Node and N-P-M: a tireless assistant that runs the whole pipeline from one command."],
  ["s3-c3", "The OpenAI A-P-I: Whisper transcribes, G-P-T rewrites the rambling into gold, and Onyx voices it."],
  ["s3-c4", "Remotion: make video like you build a web page. Animation, straight from code."],
  ["s3-c5", "And episode dot json: the memory file the system writes for you. Titles, timings, done."],

  ["s4-c1", "Step one: N-P-M run cut."],
  ["s4-c2", "The algorithm strips every pause over three seconds. Twenty minutes becomes five."],
  ["s4-c3", "Step two: N-P-M run retell."],
  ["s4-c4", "It transcribes your own voice, deletes the filler, and re-voices it in Onyx. Studio grade."],
  ["s4-c5", "No re-recording. Your stumbles, gone."],

  ["s5-c1", "Now the system writes episode dot json itself — every title and timestamp."],
  ["s5-c2", "One file describes the entire video. Zero manual input."],
  ["s5-c3", "Then one command: node render dot M-J-S."],
  ["s5-c4", "It packages a sixteen-by-nine cut for YouTube, and a nine-by-sixteen cut for Reels."],
  ["s5-c5", "Go make a cup of tea. Your video is done."],

  ["s6-c1", "Last, the bill. Editing and rendering run free, on your own machine."],
  ["s6-c2", "Re-voicing sixteen minutes of audio? Under one dollar."],
  ["s6-c3", "Two hours of your life back — for less than a cup of coffee."],
  ["s6-c4", "So what are you waiting for? Go build your first automated line."],
];

const probe = (file) =>
  parseFloat(
    execSync(
      `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`,
    )
      .toString()
      .trim(),
  );

const manifest = {};
console.log(`voice: ${VOICE}\n`);
for (const [id, text] of CUES) {
  const aiff = join("/tmp", `${id}.aiff`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("say", ["-v", VOICE, ...RATE, "-o", aiff, text]);
  execSync(
    `ffmpeg -y -hide_banner -loglevel error -i "${aiff}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`,
  );
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(7)} ${seconds.toFixed(2)}s   ${text.slice(0, 48)}`);
}

writeFileSync(
  join(root, "src", "videos", "autoline", "vo-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${CUES.length} clips → public/vo/  ·  manifest → src/videos/autoline/vo-manifest.json`);
console.log(`  spoken total: ${total.toFixed(1)}s`);
