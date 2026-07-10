#!/usr/bin/env node
/**
 * Voiceover for 帳號授權安全 V2 · 整支長片的「曉晴頭尾」(opening + outro CTA)。
 * 曉晴＝頻道品牌臉,聲線 zh-TW-HsiaoChenNeural(同旁白)。
 *   node scripts/make-vo-frame.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "aas-frame");
const videoDir = join(root, "src", "videos", "account-auth-security-v2");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = { sunny: "zh-TW-HsiaoChenNeural" }; // 曉晴

const LINES = [
  { id: "o1", who: "sunny", text: "嗨，我是曉晴。你有沒有想過，當你把帳號密碼交給一個 AI、一個 App，背後到底發生了什麼事？該給嗎？" },
  { id: "o2", who: "sunny", text: "別急著把萬能鑰匙交出去。跟我走進這間旅館，用幾個角色，把帳號安全一次講清楚。" },
  { id: "o3", who: "sunny", text: "認證跟授權、access token、API key、CAPTCHA，還有你的密碼，現在，你看得懂它們各自在保護什麼了。" },
  { id: "o4", who: "sunny", text: "記住一句話，萬能鑰匙，握在自己手上。喜歡這支影片，記得訂閱、按讚、分享，我們下支影片見。" },
];

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
  parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`).toString().trim());

const manifest = {};
console.log("engine: edge-tts  曉晴頭尾\n");
for (const { id, who, text } of LINES) {
  const voice = VOICE[who];
  const raw = join("/tmp", `${id}.frame.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", voice, "--text", speak(text), "--write-media", raw], { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(3)} ${voice.padEnd(22)} ${seconds.toFixed(2)}s  ${text.slice(0, 22)}`);
}

writeFileSync(join(videoDir, "vo-frame-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${LINES.length} clips → public/vo/aas-frame/   spoken total: ${total.toFixed(1)}s`);
