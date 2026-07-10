#!/usr/bin/env node
/**
 * Regenerate only the AAS VO lines affected by speak() changes:
 *   ＝ → 就是  |  重來 → 從來  |  App/app → A P P
 * Run: node scripts/regen-vo-aas-partial.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "account-auth-security");
const videoDir = join(root, "src", "videos", "account-auth-security");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const RATE = process.env.VO_RATE || null;

const script = JSON.parse(readFileSync(join(videoDir, "script.json"), "utf8"));

const AFFECTED = new Set([
  "s1-2","s1-3","s1-4","s1-5","s1-6","s1-7","s1b-4","s1b-6","s1b-7","s1b-8",
  "s1c-1","s1c-2","s1c-3","s1c-4","s3-3","s3-4","s4a-4","s4d-1","s4d-2","s4d-3",
  "s5-1","s5b-2","s5b-3","s6a-1","s6a-2","s6b-1","s6c-3","s6c-4","s6c-5","s6c-6",
  "s6d-2","s6d-3","s9b-1","s9b-2",
  "ot-1","ot-2","ot-3","ot-6","ot-7","ot-8","ot-9","ot-10","ot-11",
]);

const speak = (text) =>
  text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]/gu, " ")
    .replace(/——/g, "，")
    .replace(/\s*≠\s*/g, "，不等於，")
    .replace(/\s*[=＝]\s*/g, "，就是，")
    .replace(/\s+vs\s+/gi, "，對上，")
    .replace(/＋/g, "、")
    .replace(/重來/g, "從來")
    .replace(/\bApp\b/g, "A P P").replace(/\bapp\b/g, "A P P")
    .replace(/([A-Za-z]):([A-Za-z])/g, "$1 $2")
    .replace(/[：:]\s+/g, "，")
    .replace(/_/g, " ")
    .replace(/[…]+/g, "，")
    .replace(/／/g, "、")
    .replace(/\s+/g, " ")
    .trim();

const probe = (file) =>
  parseFloat(
    execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`).toString().trim(),
  );

const manifest = JSON.parse(readFileSync(join(videoDir, "vo-manifest.json"), "utf8"));
const CUES = Object.entries(script).filter(([id]) => AFFECTED.has(id));

console.log(`Regenerating ${CUES.length} clips  voice: ${VOICE}\n`);
for (const [id, text] of CUES) {
  const raw = join("/tmp", `${id}.aas.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const spoken = speak(text);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", spoken, "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(9)} ${seconds.toFixed(2)}s   ${spoken.slice(0, 36)}`);
}

writeFileSync(join(videoDir, "vo-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ ${CUES.length} clips updated → vo-manifest.json`);
