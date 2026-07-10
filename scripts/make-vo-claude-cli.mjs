#!/usr/bin/env node
/**
 * Voiceover for the "Claude 桌面版 → CLI" explainer — Microsoft edge-tts neural
 * voice (free, no key, needs network). Reads the canonical lines from
 * src/videos/claude-desktop-to-cli/script.json (same text the scenes caption),
 * writes one mp3 per id into public/vo/claude-desktop-to-cli/<id>.mp3, and records
 * measured durations in src/videos/claude-desktop-to-cli/vo-manifest.json so every
 * scene re-times to the audio.
 *
 *   npm run vo:claude-cli
 *   VO_VOICE="zh-TW-YunJheNeural" npm run vo:claude-cli   # male voice
 *   VO_RATE="-6%" npm run vo:claude-cli                    # a touch slower / calmer
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "claude-desktop-to-cli");
const videoDir = join(root, "src", "videos", "claude-desktop-to-cli");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const RATE = process.env.VO_RATE || null;

/** Canonical narration: id → spoken text (same as on-screen captions). */
const script = JSON.parse(readFileSync(join(videoDir, "script.json"), "utf8"));
const CUES = Object.entries(script);

/**
 * Tidy a caption line for *speaking* only — captions keep the exact tokens on
 * screen, but a narrator would never read "tilde slash dot claude slash". So we
 * voice file paths and command flags the natural way (semantically identical to
 * what's shown), and turn visual arrows/slashes into pauses. Order matters:
 * longest/most-specific paths first.
 */
const speak = (text) =>
  text
    .replace(/~\/\.claude\/projects/g, "家目錄 claude 的 projects")
    .replace(/~\/\.claude\.json/g, "家目錄的 claude.json")
    .replace(/~\/\.claude\//g, "家目錄的 claude 資料夾")
    .replace(/~\/\.claude/g, "家目錄的 claude")
    .replace(/\.claude\/skills\//g, "claude 的 skills")
    .replace(/\.claude\/agents\//g, "claude 的 agents")
    .replace(/\.claude\//g, "claude 資料夾")
    .replace(/--no-history/g, " no-history ")
    .replace(/--cask/g, " cask ")
    .replace(/\s*→\s*/g, "，")
    .replace(/／/g, "、")
    .replace(/≡/g, "等於")
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
  const raw = join("/tmp", `${id}.cdc.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(7)} ${seconds.toFixed(2)}s   ${text.slice(0, 28)}`);
}

writeFileSync(join(videoDir, "vo-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${CUES.length} clips → public/vo/claude-desktop-to-cli/  ·  manifest → src/videos/claude-desktop-to-cli/vo-manifest.json`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
