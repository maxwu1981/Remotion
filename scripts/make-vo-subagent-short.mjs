#!/usr/bin/env node
/**
 * 曉晴旁白 — subagent 9:16 Short（6 段）。edge-tts zh-TW-HsiaoChenNeural。
 * 生 mp3 到 public/vo/subagent-short/<id>.mp3，量秒數寫 subagent-short.vo.json。
 *   node scripts/make-vo-subagent-short.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "subagent-short");
const manifestFile = join(root, "src", "videos", "claude-code-subagent", "subagent-short.vo.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const RATE = process.env.VO_RATE || null;

const LINES = {
  sh_hook: "5 個 subagent，該不該開？",
  sh_run: "我真的開 5 個 subagent，並行調查一個專案，畫面是真的，5 個同時在跑。",
  sh_data: "結果出乎意料：小任務並行反而慢 24%，但重任務並行省了 59%。",
  sh_build: "接著請它把這些發現，寫成一份程式碼健檢報告。",
  sh_doc: "七頁報告真的長出來了，分模組列出問題和建議修法。",
  sh_outro: "任務夠重，才值得開 subagent。訂閱看更多！",
};

const speak = (t) => t.replace(/subagent/gi, "sub agent").replace(/\s+/g, " ").trim();
const probe = (f) => parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${f}"`).toString().trim());

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}\n`);
for (const [id, text] of Object.entries(LINES)) {
  const raw = join("/tmp", `${id}.sht.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
  if (RATE) args.push(`--rate=${RATE}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const s = probe(mp3);
  manifest[id] = Number(s.toFixed(3));
  console.log(`  ${id.padEnd(8)} ${s.toFixed(2)}s   ${text}`);
}
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ ${Object.keys(LINES).length} clips → public/vo/subagent-short/  ·  manifest → ${manifestFile}`);
