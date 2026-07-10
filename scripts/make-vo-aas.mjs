#!/usr/bin/env node
/**
 * Voiceover for the「帳號授權安全 · 鑰匙比喻」explainer — Microsoft edge-tts neural
 * voice (free, no key, needs network). Reads the verbatim lines from
 * src/videos/account-auth-security/script.json (same text the scenes caption),
 * writes one mp3 per id into public/vo/account-auth-security/<id>.mp3, and records
 * measured durations in src/videos/account-auth-security/vo-manifest.json.
 *
 *   node scripts/make-vo-aas.mjs
 *   VO_VOICE="zh-TW-YunJheNeural" node scripts/make-vo-aas.mjs   # male voice
 *   VO_RATE="-6%" node scripts/make-vo-aas.mjs                    # a touch slower
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
const CUES = Object.entries(script);

/**
 * Tidy a verbatim caption line for *speaking* only (the on-screen text stays
 * exactly as written). Turns visual symbols into natural spoken Chinese and
 * sidesteps edge-tts quirks (a colon hugging Latin letters reads as a confused
 * noise; raw ＝／≠／＋ get mispronounced). The on-screen text is unaffected.
 */
const speak = (text) =>
  text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]/gu, " ") // strip emoji / arrows
    .replace(/——/g, "，")
    .replace(/\s*≠\s*/g, "，不等於，")
    .replace(/\s*[=＝]\s*/g, "，就是，")
    .replace(/\s+vs\s+/gi, "，對上，")
    .replace(/＋/g, "、")
    .replace(/重來/g, "從來")
    .replace(/\bApp\b/g, "A P P").replace(/\bapp\b/g, "A P P")
    .replace(/([A-Za-z]):([A-Za-z])/g, "$1 $2") // pins:write → pins write
    .replace(/[：:]\s+/g, "，") // colon + space → pause (avoids「：S D K」怪音)
    .replace(/_/g, " ") // pina_… → pina …
    .replace(/[…]+/g, "，")
    .replace(/／/g, "、")
    .replace(/\s+/g, " ")
    .trim();

const probe = (file) =>
  parseFloat(
    execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`).toString().trim(),
  );

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}${RATE ? `   rate: ${RATE}` : ""}\n`);
for (const [id, text] of CUES) {
  const raw = join("/tmp", `${id}.aas.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(9)} ${seconds.toFixed(2)}s   ${text.slice(0, 26)}`);
}

writeFileSync(join(videoDir, "vo-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${CUES.length} clips → public/vo/account-auth-security/`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
