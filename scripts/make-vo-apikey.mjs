#!/usr/bin/env node
/**
 * Voiceover for 帳號授權安全 V2 · 第2章「API key＝洗衣廠司機」。
 * edge-tts 多聲線;重心＝先講「為什麼用 API key 不用 OAuth/發房卡」(高頻＋不涉隱私)。
 *   node scripts/make-vo-apikey.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "apikey");
const videoDir = join(root, "src", "videos", "account-auth-security-v2");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = {
  narrator: "zh-TW-HsiaoChenNeural", // 旁白 / 曉晴
  driver: "zh-CN-YunjianNeural", // 洗衣廠司機(憨厚勤奮男)
  boss: "zh-TW-YunJheNeural", // 老闆
};

const LINES = [
  { id: "s1", who: "narrator", text: "上一章的房卡，是發給「客人」進自己房間、還會過期。可是旅館裡還有另一種訪客——天天來、一天好幾趟的「服務」，像洗衣廠收送床單。" },
  { id: "s2", who: "driver", text: "我一天來好幾趟收送床單，又不會去翻客人的私人東西——每一趟都辦一次手續，也太累了吧！" },
  { id: "s3", who: "narrator", text: "沒錯。它又頻繁、又不涉隱私，要是每趟都跑前台、認證、問同意、再領一張臨時房卡，太荒謬也沒必要——所以這種活，根本不走前台發房卡那一套。" },
  { id: "s4", who: "narrator", text: "改成直接給它一把固定的後門鑰匙——這把，就叫 API key，不綁哪位客人、不問同意、長期有效。" },
  { id: "s5", who: "narrator", text: "跟房卡一比就懂：房卡給客人、限定、會過期，是為了顧個人隱私；API key 給服務、固定、長期，做的是例行、不涉隱私的活。" },
  { id: "s6", who: "narrator", text: "但它這麼好用，最怕外流——被偷配一把，小偷就能裝成洗衣廠、大方走後門。" },
  { id: "s7", who: "boss", text: "別慌。把鎖換掉、發一把新的、舊的立刻作廢——所以 API key 要像金庫一樣收好。" },
  { id: "s8", who: "narrator", text: "一句話，API key，就是服務用的固定後門鑰匙。因為它常來、不涉隱私，才不走發房卡那套；但權限大、要保管，外洩就換發。" },
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
console.log("engine: edge-tts  API key 章 多聲線\n");
for (const { id, who, text } of LINES) {
  const voice = VOICE[who];
  const raw = join("/tmp", `${id}.apikey.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", voice, "--text", speak(text), "--write-media", raw], { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(3)} ${who.padEnd(9)} ${voice.padEnd(22)} ${seconds.toFixed(2)}s  ${text.slice(0, 20)}`);
}

writeFileSync(join(videoDir, "vo-apikey-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${LINES.length} clips → public/vo/apikey/   spoken total: ${total.toFixed(1)}s (${(total / 60).toFixed(1)} min)`);
