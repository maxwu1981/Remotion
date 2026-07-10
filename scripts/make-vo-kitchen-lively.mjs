#!/usr/bin/env node
/**
 * 「輕亮活潑 Sunny」PoC — 同一把曉臻 zh-TW-HsiaoChenNeural，但：
 *   ① 音高整體調亮(+pitch) → 解「太沈重」，往年輕輕亮走
 *   ② 逐「片語」做音高/語速起伏(問句上揚、短促驚嘆拉高放慢、開場有勁) → 補「語氣」
 * 把每句切片語各別合成、再串接(片語間 80ms 微停)，模擬有起伏的口條。
 * 輸出 public/vo/kitchen-lively/<id>.mp3，不碰現有 Sunny(vo/kitchen/)。
 *   node scripts/make-vo-kitchen-lively.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "kitchen-lively");
const manifestFile = join(voDir, "manifest.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";
const BASE_PITCH = process.env.PITCH || "+12Hz"; // 整體調亮的基準

// 同 make-vo-kitchen.mjs 的稿；rate 是該句的基準語速。
const LINES = {
  k_hook: { text: "Git、Linter、測試，這三個工程師天天掛在嘴邊的詞，其實，想像成開一間餐廳廚房，三分鐘就懂。", rate: "+8%" },
  k_kitchen: { text: "把寫程式想像成開餐廳。一間好廚房，會有三樣法寶：時光機、糾察隊、跟皇家試毒官。", rate: "+10%" },
  k_git: { text: "Git，就是廚房的時光機。整鍋湯搞砸了？沒關係，按一下，啪，倒流回三分鐘前。", rate: "+10%" },
  k_linter: { text: "Linter，是廚房裡的處女座糾察隊。蒜頭只能切丁，砧板沒擦扣五分！它逼每個廚師習慣一模一樣，端出來的菜才不會忽鹹忽淡。", rate: "+10%" },
  k_test: { text: "測試，就是皇家試毒官。擺盤再美，吃下去會不會出事？他先吃。改版也先吃，確保你加了新香料，沒把招牌菜變成毒藥。", rate: "+8%" },
  k_michelin: { text: "三樣都有，代表這是一間，頂級的餐廳廚房。", rate: "+2%" },
  k_flee_setup: { text: "但如果一間廚房，這三樣全都沒有，菜煮壞了，還直接端給客人……", rate: "-6%" },
  k_flee: { text: "快逃啊！", rate: "+12%" },
  k_outro: { text: "我是曉晴。訂閱看更多工程師術語翻譯，把這支，分享給還在火燒廚房的朋友！", rate: "+4%" },
};

// 把一句切成片語（保留結尾標點作判斷）；丟掉純標點/空白的碎片。
const splitPhrases = (t) =>
  t.split(/(?<=[，。？！、：…])/)
    .map((s) => s.trim())
    .filter((s) => /[一-鿿A-Za-z0-9]/.test(s));

// pitch 字串相加：把 baseHz + 額外 Hz。
const addPitch = (base, extra) => {
  const b = parseInt(base.replace(/[^-\d]/g, ""), 10) || 0;
  return `${b + extra >= 0 ? "+" : ""}${b + extra}Hz`;
};
// rate 字串相加（百分比）。
const addRate = (base, extra) => {
  const b = parseInt(base.replace(/[^-\d]/g, ""), 10) || 0;
  return `${b + extra >= 0 ? "+" : ""}${b + extra}%`;
};

/** 依片語內容/位置決定該片語的 pitch、rate（製造起伏）。 */
const shape = (phrase, baseRate, isFirst) => {
  const end = phrase.slice(-1);
  const core = phrase.replace(/[，。？！、：…]/g, "");
  if (end === "？") return { pitch: addPitch(BASE_PITCH, 20), rate: baseRate }; // 問句上揚
  if (end === "！" || (core.length <= 3 && /[啪逃啊喔哇呀]/.test(core)))
    return { pitch: addPitch(BASE_PITCH, 24), rate: addRate(baseRate, -8) }; // 短促驚嘆：拉高+放慢
  if (isFirst) return { pitch: addPitch(BASE_PITCH, 6), rate: addRate(baseRate, 6) }; // 開場有勁
  if (core.length <= 4) return { pitch: addPitch(BASE_PITCH, 10), rate: baseRate }; // 短插語略亮
  return { pitch: BASE_PITCH, rate: baseRate };
};

const probe = (f) =>
  parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${f}"`).toString().trim());

const manifest = {};
console.log(`engine: edge-tts(lively)   voice: ${VOICE}   base pitch: ${BASE_PITCH}\n`);
for (const [id, { text, rate }] of Object.entries(LINES)) {
  const phrases = splitPhrases(text);
  const parts = [];
  phrases.forEach((ph, i) => {
    const { pitch, rate: prate } = shape(ph, rate, i === 0);
    const raw = join("/tmp", `${id}_${i}.lively.mp3`);
    const args = ["-m", "edge_tts", "--voice", VOICE, "--text", ph,
      "--write-media", raw, `--rate=${prate}`, `--pitch=${pitch}`];
    execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
    parts.push(raw);
  });
  // 串接片語(80ms 微停)。
  const listFile = join("/tmp", `${id}.lively.txt`);
  const sil = join("/tmp", "sil08.lively.wav");
  if (!existsSync(sil))
    execSync(`ffmpeg -y -hide_banner -loglevel error -f lavfi -i anullsrc=r=24000:cl=mono -t 0.08 "${sil}"`);
  const lines = [];
  parts.forEach((p) => { lines.push(`file '${p}'`); lines.push(`file '${sil}'`); });
  writeFileSync(listFile, lines.join("\n") + "\n");
  const mp3 = join(voDir, `${id}.mp3`);
  execSync(`ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i "${listFile}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const s = probe(mp3);
  manifest[id] = Number(s.toFixed(3));
  console.log(`  ${id.padEnd(13)} ${phrases.length} 片語  ${s.toFixed(2)}s`);
}
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ ${Object.keys(LINES).length} clips → public/vo/kitchen-lively/`);
