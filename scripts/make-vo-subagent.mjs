#!/usr/bin/env node
/**
 * Voiceover for "Claude Code subagent 並行實測" — Microsoft edge-tts neural voice
 * (free, no key, needs network). Reads the canonical lines from
 * src/videos/claude-code-subagent/spec.json (.script), writes one mp3 per id into
 * public/vo/claude-code-subagent/<id>.mp3, and records measured durations in
 * src/videos/claude-code-subagent/vo.json so every scene re-times to the audio.
 *
 * 曉晴 / Sunny 的聲音 = zh-TW-HsiaoChenNeural（清新台灣女聲）。
 *
 *   node scripts/make-vo-subagent.mjs
 *   VO_VOICE="zh-TW-HsiaoYuNeural" node scripts/make-vo-subagent.mjs   # 換更亮的女聲
 *   VO_RATE="+5%" node scripts/make-vo-subagent.mjs                    # 講快一點、更有精神
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "claude-code-subagent");
const specFile = join(root, "src", "videos", "claude-code-subagent", "spec.json");
const voManifest = join(root, "src", "videos", "claude-code-subagent", "vo.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const RATE = process.env.VO_RATE || null;

const spec = JSON.parse(readFileSync(specFile, "utf8"));
const CUES = Object.entries(spec.script);

/** Tidy a line for *speaking* only (captions keep the exact tokens). */
const speak = (text) =>
  text
    .replace(/N\+1/gi, "N 加一")
    .replace(/subagent/gi, "sub agent")
    .replace(/context/gi, "context")
    .replace(/——/g, "，")
    .replace(/—/g, "，")
    .replace(/\s*→\s*/g, "，")
    .replace(/[／/]/g, "、")
    .replace(/\s+/g, " ")
    .trim();

const probe = (file) =>
  parseFloat(
    execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`)
      .toString()
      .trim(),
  );

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}${RATE ? `   rate: ${RATE}` : ""}\n`);
for (const [id, text] of CUES) {
  const raw = join("/tmp", `${id}.ccsub.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(5)} ${seconds.toFixed(2)}s   ${text.slice(0, 30)}`);
}

writeFileSync(voManifest, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ ${CUES.length} clips → public/vo/claude-code-subagent/  ·  manifest → ${voManifest}`);
