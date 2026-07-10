#!/usr/bin/env node
/**
 * 曉晴旁白 — gemini-poc「AI 小幫手」9:16 PoC（4 句，旁白稿同 src/videos/gemini-poc/storyboard.ts）。
 * edge-tts zh-TW-HsiaoChenNeural → public/vo/gemini-poc/<id>.mp3，量秒數寫 gemini-poc.vo.json。
 *   node scripts/make-vo-gemini-poc.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "gemini-poc");
const manifestFile = join(root, "src", "videos", "gemini-poc", "gemini-poc.vo.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const RATE = process.env.VO_RATE || null;

const LINES = {
  s1: "這是我的 AI 小幫手，一開機就準備上工。",
  s2: "丟給它一個任務，它馬上看懂、立刻動手。",
  s3: "再雜的活，它都能同時並行處理。",
  s4: "搞定，比個讚——這就是 AI 幫你省力的樣子。",
};

const speak = (t) => t.replace(/\s+/g, " ").trim();
const probe = (f) => parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${f}"`).toString().trim());

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}\n`);
for (const [id, text] of Object.entries(LINES)) {
  const raw = join("/tmp", `${id}.gpoc.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const s = probe(mp3);
  manifest[id] = Number(s.toFixed(3));
  console.log(`  ${id.padEnd(4)} ${s.toFixed(2)}s   ${text}`);
}
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ ${Object.keys(LINES).length} clips → public/vo/gemini-poc/  ·  manifest → ${manifestFile}`);
