#!/usr/bin/env node
/**
 * Voiceover for the "Claude Code 手機／遠端全解析" explainer — Microsoft edge-tts
 * neural voice (free, no key, needs network). Reads the canonical lines from
 * src/videos/claude-remote-notes/script.json (same text the scenes caption),
 * writes one mp3 per id into public/vo/claude-remote-notes/<id>.mp3, and records
 * measured durations in src/videos/claude-remote-notes/vo-manifest.json so every
 * scene re-times to the audio.
 *
 *   npm run vo:claude-remote
 *   VO_VOICE="zh-TW-YunJheNeural" npm run vo:claude-remote      # male
 *   VO_RATE="-6%" npm run vo:claude-remote                       # a touch slower
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "claude-remote-notes");
const videoDir = join(root, "src", "videos", "claude-remote-notes");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const RATE = process.env.VO_RATE || null;

/** Canonical narration: id → spoken text (same as on-screen captions). */
const script = JSON.parse(readFileSync(join(videoDir, "script.json"), "utf8"));
const CUES = Object.entries(script);

const probe = (file) =>
  parseFloat(
    execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`)
      .toString()
      .trim(),
  );

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}${RATE ? `   rate: ${RATE}` : ""}\n`);
for (const [id, text] of CUES) {
  const raw = join("/tmp", `${id}.crn.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", text, "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(8)} ${seconds.toFixed(2)}s   ${text.slice(0, 30)}`);
}

writeFileSync(join(videoDir, "vo-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${CUES.length} clips → public/vo/claude-remote-notes/  ·  manifest → src/videos/claude-remote-notes/vo-manifest.json`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
