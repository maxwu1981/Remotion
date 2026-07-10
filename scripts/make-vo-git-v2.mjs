#!/usr/bin/env node
/**
 * Voiceover for the v2 cut of "Git commit 與 push 新手指南" (adds Roadmap + 💎PromptGem).
 * Same edge-tts neural voice (曉晴 / zh-TW-HsiaoChenNeural) as the original so the 11
 * new lines match the existing 102. Reuses the shared public/vo/git-commit-push-guide/
 * folder: it only synthesizes ids whose mp3 is missing (rm-*, gem-*), then rebuilds
 * src/videos/git-commit-push-guide-v2/vo-manifest.json from the actual mp3 durations
 * so every scene re-times to real audio.
 *
 *   node scripts/make-vo-git-v2.mjs
 *   VO_VOICE="zh-TW-YunJheNeural" node scripts/make-vo-git-v2.mjs   # male voice
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "git-commit-push-guide");
const videoDir = join(root, "src", "videos", "git-commit-push-guide-v2");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const RATE = process.env.VO_RATE || null;

const script = JSON.parse(readFileSync(join(videoDir, "script.json"), "utf8"));
const CUES = Object.entries(script);

/** Turn on-screen arrows/slashes into natural pauses so the TTS doesn't read them literally. */
const speak = (text) =>
  text
    .replace(/\s*→\s*/g, "，")
    .replace(/／/g, "、")
    .replace(/\s+/g, " ")
    .trim();

const probe = (file) =>
  parseFloat(
    execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`)
      .toString()
      .trim(),
  );

let made = 0;
console.log(`engine: edge-tts   voice: ${VOICE}${RATE ? `   rate: ${RATE}` : ""}\n`);
const manifest = {};
for (const [id, text] of CUES) {
  const mp3 = join(voDir, `${id}.mp3`);
  if (!existsSync(mp3)) {
    const raw = join("/tmp", `${id}.gitv2.edge.mp3`);
    const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
    if (RATE) args.push(`--rate=${RATE}`);
    execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
    execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
    made += 1;
    console.log(`  + ${id.padEnd(8)} ${probe(mp3).toFixed(2)}s   ${text.slice(0, 28)}`);
  }
  manifest[id] = Number(probe(mp3).toFixed(3));
}

writeFileSync(join(videoDir, "vo-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ generated ${made} new clip(s); manifest now covers ${CUES.length} lines`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
