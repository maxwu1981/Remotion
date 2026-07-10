#!/usr/bin/env node
/**
 * Voiceover for 帳號授權安全 V2 故事版 — 樣板段落「房卡 = access token」。
 * edge-tts 多聲線廣播劇:每個角色不同 neural voice(混 zh-TW / zh-CN 區分)。
 * 這支樣板的核心目的之一 = 驗證「混聲線聽起來 OK 嗎」(見 STORYBOARD-pilot.md)。
 *
 * 每句 → public/vo/account-auth-security-v2/<id>.mp3
 * 量到的秒數 → src/videos/account-auth-security-v2/vo-manifest.json (comp 用來排時間)。
 *
 *   node scripts/make-vo-aas-v2.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "account-auth-security-v2");
const videoDir = join(root, "src", "videos", "account-auth-security-v2");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

// 角色 → edge-tts 聲線(zh-TW 只有3個,其餘混 zh-CN 區分)
const VOICE = {
  narrator: "zh-TW-HsiaoChenNeural", // 旁白 / 曉晴(清新台灣女聲)
  frontdesk: "zh-CN-XiaoxiaoNeural", // 前台 OAuth(溫暖女聲;原 HsiaoYu 太低沉,老闆退)
  hero: "zh-CN-YunxiNeural", // 主角你(年輕男,大陸)
  boss: "zh-TW-YunJheNeural", // 老闆(溫暖睿智,台灣男聲)
};

// 一句一條(房卡=access token 樣板,8 鏡;s3 兩位角色拆成 s3a/s3b)
const LINES = [
  { id: "s1", who: "narrator", text: "你想讓這台小幫手替你進去拿東西——但要把你家的萬能鑰匙交給它？" },
  { id: "s2", who: "frontdesk", text: "別把鑰匙交出去。讓我來——發一張卡給它就行。" },
  { id: "s3a", who: "frontdesk", text: "先確認是你本人同意。" },
  { id: "s3b", who: "hero", text: "我同意。" },
  { id: "s4", who: "frontdesk", text: "這張叫 access token，是我發的。它不是你的密碼——只能開你允許的那幾扇門。" },
  { id: "s5", who: "boss", text: "卡發出去了，但遙控器，永遠在你手上。" },
  { id: "s6", who: "narrator", text: "被授權的門開得了，沒授權的，打不開。" },
  { id: "s7", who: "narrator", text: "你隨時能讓這張卡作廢——而你的密碼，從頭到尾沒交出去。" },
  { id: "s8", who: "narrator", text: "access token——限定、可撤銷、在程式手上的房卡。" },
];

/** 把字幕原文洗成「好唸」的版本(畫面字幕不受影響);避開 edge-tts 怪音(冒號+字母、——、…)。 */
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

const manifest = {};
console.log("engine: edge-tts  多聲線廣播劇\n");
for (const { id, who, text } of LINES) {
  const voice = VOICE[who];
  const raw = join("/tmp", `${id}.aasv2.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", voice, "--text", speak(text), "--write-media", raw], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(4)} ${who.padEnd(10)} ${voice.padEnd(22)} ${seconds.toFixed(2)}s  ${text.slice(0, 22)}`);
}

writeFileSync(join(videoDir, "vo-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${LINES.length} clips → public/vo/account-auth-security-v2/`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
