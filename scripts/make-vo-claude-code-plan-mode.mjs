#!/usr/bin/env node
/**
 * Voiceover 補生 —「新手知道一下比較好的名詞」EP07 · Claude Code Plan Mode。
 * 原 36 句沿用每日影片工廠 current.vo.json 搬過來的音檔(見 vo-manifest.json)。
 * 這裡只補生「加入 tutorial-video-show-claude-prompts.md 標準規則」新增的 4 句：
 * sa0p(solution 景 prompt beat 開場)、g1-g3(片尾 master prompt 禮物景)。
 *
 *   node scripts/make-vo-claude-code-plan-mode.mjs         # 全部(只有這 4 句)
 *   node scripts/make-vo-claude-code-plan-mode.mjs g1      # 只重生指定句
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "claude-code-plan-mode");
const videoDir = join(root, "src", "videos", "claude-code-plan-mode");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = "zh-TW-HsiaoChenNeural"; // 曉晴

const LINES = [
  { id: "sa0p", text: "跟 Claude 說，幫我在 settings.json 加上 permissions 的 defaultMode 設成 plan，這樣以後一開新對話都先進 Plan Mode。" },
  { id: "g1", text: "最後，送給看到這裡的你一個禮物。" },
  { id: "g2", text: "這一整段，是把前面每一步合成的一句完整指令。" },
  { id: "g3", text: "暫停整段複製，貼給 Claude，它就能幫你把 Plan Mode 設定好，順便教你怎麼用。" },
];

/** 洗成「好唸」版本(畫面字幕不受影響);避開 edge-tts 怪音(冒號+字母、——、…)。 */
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
const manifestPath = join(videoDir, "vo-manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

console.log("engine: edge-tts  曉晴旁白(補生 prompt-beat + master prompt 禮物景)\n");
for (const { id, text } of LINES) {
  if (only.length && !only.includes(id)) continue;
  const raw = join("/tmp", `${id}.pm.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(5)} ${seconds.toFixed(2)}s  ${text.slice(0, 34)}`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ → public/vo/claude-code-plan-mode/`);
