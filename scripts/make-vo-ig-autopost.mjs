#!/usr/bin/env node
/**
 * Voiceover for 生活應用系列 EP05「我讓 Instagram 也每天自動發文」。
 * 全程曉晴(第一人稱老闆視角) · 故事解說片。承接 EP04(FB 自動發文)。
 *
 * 逐字來源＝單一真相：src/videos/_explainer/specs/ig-autopost.json 的 script。
 * 每句 → public/vo/ig-autopost/<id>.mp3
 * 量到的秒數 → src/videos/_explainer/specs/ig-autopost.vo.json
 *
 *   node scripts/make-vo-ig-autopost.mjs            # 全部
 *   node scripts/make-vo-ig-autopost.mjs url3       # 只重生指定句(過稿改字用)
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const specPath = join(root, "src", "videos", "_explainer", "specs", "ig-autopost.json");
const voDir = join(root, "public", "vo", "ig-autopost");
const manifestPath = join(root, "src", "videos", "_explainer", "specs", "ig-autopost.vo.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = "zh-TW-HsiaoChenNeural";

const spec = JSON.parse(readFileSync(specPath, "utf8"));
const SC = spec.script;
// 播放順序＝scenes cues 攤平
const ORDER = spec.scenes.flatMap((s) => s.cues);
const LINES = ORDER.map((id) => ({ id, text: SC[id] }));

/** 洗成好唸版本(不影響畫面字幕)：避 edge-tts 怪音。
 *  去 emoji / 全形符號 / 冒號緊接字母，避免拆字母怪音(記憶 edge-tts-spaced-acronym-bug)。 */
const speak = (text) =>
  text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]/gu, " ")
    .replace(/——/g, "，")
    .replace(/[…]+/g, "，")
    .replace(/([A-Za-z]):([A-Za-z])/g, "$1 $2")
    .replace(/[：:]\s+/g, "，")
    .replace(/／/g, "、")
    .replace(/\s+/g, " ")
    .trim();

const probe = (file) =>
  parseFloat(
    execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`).toString().trim(),
  );

const only = process.argv.slice(2);
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

console.log("engine: edge-tts  曉晴旁白(IG 自動發文 EP05)\n");
for (const { id, text } of LINES) {
  if (only.length && !only.includes(id)) continue;
  const raw = join("/tmp", `${id}.ig.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(6)} ${seconds.toFixed(2)}s  ${text.slice(0, 22)}`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ → public/vo/ig-autopost/`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
