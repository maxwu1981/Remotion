#!/usr/bin/env node
/**
 * 曉晴旁白 — subagent「詳細可照做」教學 master（逐步講解）。
 * edge-tts zh-TW-HsiaoChenNeural。生 mp3 到 public/vo/subagent-tutorial/，
 * 量秒數寫 subagent-tutorial.vo.json（場景時長配合 VO）。
 *   node scripts/make-vo-subagent-tutorial.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "subagent-tutorial");
const manifestFile = join(root, "src", "videos", "claude-code-subagent", "subagent-tutorial.vo.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const RATE = process.env.VO_RATE || null;

// 逐章詳細：看得懂、跟得上、照得做
const LINES = {
  t_hook: "今天手把手帶你做一次 Claude Code 的 subagent 並行，看完你就能自己照做。",
  t_setup: "第一步，開一個全新的對話，讓它調查這個叫 ShopFlow 的專案，裡面有五個模組。subagent 就是主代理臨時叫出的分身，每個有自己獨立的 context。",
  t_prompt: "第二步，輸入這一句。用自然語言直接說：用五個 subagent 並行，每個查一個模組，附上檔名行號，最後彙整。你不用記任何指令，講人話就好。",
  t_parallel: "送出之後，看這裡——畫面出現五個 running tasks，五個子代理同時啟動、各跑各的。這就是並行：不是排隊一個一個等，而是五件事同時做。",
  t_report: "跑完，每個子代理把自己模組的問題回報上來。auth 寫死了密鑰、payments 把完整卡號印進日誌、cart 有競態、catalog 是 N 加一查詢、notifications 同步阻塞，五個真問題一次攤開。",
  t_merge: "最後，主代理把五份回報彙整成一份結論，幫你排好優先順序。整個過程，你只下了一句話。",
  t_yourturn: "換你試。第一，開新對話、指向你的專案。第二，貼上這句並行 subagent 的指令。第三，等五個跑完、看彙整。指令就在畫面上，按暫停照著做。",
  t_outro: "記住一個重點：任務夠重，subagent 才划算。覺得有用，按讚訂閱分享，我們下次見。",
};

const speak = (t) => t.replace(/subagent/gi, "sub agent").replace(/N 加一/g, "N 加一").replace(/\s+/g, " ").trim();
const probe = (f) => parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${f}"`).toString().trim());

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}\n`);
for (const [id, text] of Object.entries(LINES)) {
  const raw = join("/tmp", `${id}.tut.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const s = probe(mp3);
  manifest[id] = Number(s.toFixed(3));
  console.log(`  ${id.padEnd(11)} ${s.toFixed(2)}s   ${text.slice(0, 26)}`);
}
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ ${Object.keys(LINES).length} clips → public/vo/subagent-tutorial/  ·  manifest → ${manifestFile}`);
