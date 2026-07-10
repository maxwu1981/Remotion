#!/usr/bin/env node
/**
 * Voiceover for 帳號授權安全 V2 · 第3章「密碼＝你家的萬能鑰匙」。
 * edge-tts 多聲線;這章是系列根基——密碼是你在保護的東西,回扣 OAuth/token/API key 都是為了不必交出萬能鑰匙。
 *   node scripts/make-vo-password.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "password");
const videoDir = join(root, "src", "videos", "account-auth-security-v2");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = {
  narrator: "zh-TW-HsiaoChenNeural", // 旁白 / 曉晴
  hero: "zh-CN-YunxiNeural", // 主角你(第一人稱)
  boss: "zh-TW-YunJheNeural", // 老闆
};

const LINES = [
  { id: "s1", who: "hero", text: "這把巨大的萬能鑰匙，就是我的密碼，一把，開我所有的門。" },
  { id: "s2", who: "narrator", text: "有了它，你能進每一間房、動每一樣東西。所以整個故事最重要的一句話就是，這把，絕對不能隨便交出去。" },
  { id: "s3", who: "narrator", text: "還記得前台發的房卡、洗衣廠的固定鑰匙嗎？那些之所以存在，全是為了讓你，不必把萬能鑰匙交出去。" },
  { id: "s4", who: "narrator", text: "但這把鑰匙本身也有講究。第一，別讓一把開所有地方，同一個密碼到處用，一個網站外洩，小偷就拿它開你所有的門。" },
  { id: "s5", who: "narrator", text: "記不住那麼多把？交給一個鑰匙保管員，密碼管理器。它幫你保管全部，你只要記住一把主鑰匙。" },
  { id: "s6", who: "narrator", text: "想更安全？在門上加第二道鎖，就算鑰匙被偷配，還需要只有你手機才有的那一下確認。這就是兩步驗證。" },
  { id: "s7", who: "boss", text: "記住，萬能鑰匙握在自己手上，別人再會說，也不隨便交出去。" },
  { id: "s8", who: "narrator", text: "密碼，就是你家的萬能鑰匙，不交出去、每處用不同把、記不住交給管理員、再加一道兩步驗證。" },
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
console.log("engine: edge-tts  密碼章 多聲線\n");
for (const { id, who, text } of LINES) {
  const voice = VOICE[who];
  const raw = join("/tmp", `${id}.password.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", voice, "--text", speak(text), "--write-media", raw], { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(3)} ${who.padEnd(9)} ${voice.padEnd(22)} ${seconds.toFixed(2)}s  ${text.slice(0, 20)}`);
}

writeFileSync(join(videoDir, "vo-password-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ ${LINES.length} clips → public/vo/password/   spoken total: ${total.toFixed(1)}s (${(total / 60).toFixed(1)} min)`);
