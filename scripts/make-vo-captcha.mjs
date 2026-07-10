#!/usr/bin/env node
/**
 * Voiceover for 帳號授權安全 V2 · 第4章「CAPTCHA＝門口的保安（人機驗證）」。
 * 播放順序 ch1→ch2→CAPTCHA→ch3(密碼)。術語鐵則：CAPTCHA 一律「人機驗證」，不講「驗證碼」。
 *   node scripts/make-vo-captcha.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "captcha");
const videoDir = join(root, "src", "videos", "account-auth-security-v2");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = {
  narrator: "zh-TW-HsiaoChenNeural", // 旁白 / 曉晴
  guard: "zh-CN-YunyangNeural", // 保安(嚴肅盡責有點兇的男聲)
  boss: "zh-TW-YunJheNeural", // 老闆
};

const LINES = [
  { id: "s1", who: "narrator", text: "前台發房卡、後門給服務鑰匙。但在這一切之前，旅館大門口，還站著一位表情嚴肅的保安。" },
  { id: "s2", who: "guard", text: "站住。你們這些不睡覺的傢伙，一秒能試上千把鑰匙、一夜灌爆整排房間，想都別想混進來。" },
  { id: "s3", who: "narrator", text: "保安不查你是誰，那是前台認證、對密碼的事。他只擋一件事，分清楚門外的，是活生生的人，還是自動化的機器人。" },
  { id: "s4", who: "narrator", text: "方法很簡單，出一個人一秒就會、機器人卻很頭痛的小題目，認扭曲的字、選有紅綠燈的格子、勾一個我不是機器人。這就是 CAPTCHA，人機驗證。" },
  { id: "s5", who: "narrator", text: "你覺得只是舉手之勞，對想硬闖的自動程式，卻是一道牆。真人輕鬆進門，機器人海被擋在外面。" },
  { id: "s6", who: "narrator", text: "分清楚，認證問你是誰、兩步驗證確認真的是你本人、CAPTCHA 只確認你是不是真人。三個站在不同的關卡。" },
  { id: "s7", who: "boss", text: "所以保安不是找你麻煩，是替你擋掉門外那群不睡覺的機器人，讓暴力破解、大量灌帳號沒機會得逞。" },
  { id: "s8", who: "narrator", text: "一句話，CAPTCHA，就是門口的人機驗證，專擋機器人海量試鑰匙。而擋在門外之後，你手上那把萬能鑰匙，還是得自己顧好。" },
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
console.log("engine: edge-tts  CAPTCHA 章 多聲線\n");
for (const { id, who, text } of LINES) {
  const voice = VOICE[who];
  const raw = join("/tmp", `${id}.captcha.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", voice, "--text", speak(text), "--write-media", raw], { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(3)} ${who.padEnd(9)} ${voice.padEnd(22)} ${seconds.toFixed(2)}s  ${text.slice(0, 20)}`);
}

writeFileSync(join(videoDir, "vo-captcha-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${LINES.length} clips → public/vo/captcha/   spoken total: ${total.toFixed(1)}s (${(total / 60).toFixed(1)} min)`);
