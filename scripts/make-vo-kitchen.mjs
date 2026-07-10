#!/usr/bin/env node
/**
 * 曉晴旁白 — kitchen-git-linter-test 9:16 Short（11 beats）。
 * edge-tts zh-TW-HsiaoChenNeural。前段三名詞連珠炮（快），結尾「快逃啊」極慢極沉。
 * 生 mp3 → public/vo/kitchen/<id>.mp3，量秒數寫 kitchen.vo.json。
 *   node scripts/make-vo-kitchen.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "kitchen");
const manifestFile = join(root, "src", "videos", "kitchen-git-linter-test", "kitchen.vo.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });
mkdirSync(dirname(manifestFile), { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";

/** id → { text, rate }. rate 給 edge-tts --rate（連珠炮加速、快逃放慢）。 */
const LINES = {
  k_hook: { text: "Git、Linter、測試，這三個工程師天天掛在嘴邊的詞，其實，想像成開一間餐廳廚房，三分鐘就懂。", rate: "+8%" },
  k_kitchen: { text: "把寫程式想像成開餐廳。一間好廚房，會有三樣法寶：時光機、糾察隊、跟皇家試毒官。", rate: "+10%" },
  k_git: { text: "Git，就是廚房的時光機。整鍋湯搞砸了？沒關係，按一下，啪，倒流回三分鐘前。", rate: "+10%" },
  k_linter: { text: "Linter，是廚房裡的處女座糾察隊。蒜頭只能切丁，砧板沒擦扣五分！它逼每個廚師習慣一模一樣，端出來的菜才不會忽鹹忽淡。", rate: "+10%" },
  k_test: { text: "測試，就是皇家試毒官。擺盤再美，吃下去會不會出事？他先吃。改版也先吃，確保你加了新香料，沒把招牌菜變成毒藥。", rate: "+8%" },
  k_michelin: { text: "三樣都有，代表這是一間，頂級的餐廳廚房。", rate: "+2%" },
  k_flee_setup: { text: "但如果一間廚房，這三樣全都沒有，菜煮壞了，還直接端給客人……", rate: "-6%" },
  k_flee: { text: "快逃啊！", rate: "+12%" },
  k_outro: { text: "我是曉晴。訂閱看更多工程師黑話翻譯，把這支，分享給還在火燒廚房的朋友！", rate: "+4%" },
};

// edge-tts 偶爾把英文縮寫念得太快糊掉，補空格念清楚。
const speak = (t) =>
  t.replace(/Git/g, "Git").replace(/Linter/g, "Linter").replace(/\s+/g, " ").trim();
const probe = (f) =>
  parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${f}"`).toString().trim());

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}\n`);
for (const [id, { text, rate }] of Object.entries(LINES)) {
  const raw = join("/tmp", `${id}.kit.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
  if (rate) args.push(`--rate=${rate}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const s = probe(mp3);
  manifest[id] = Number(s.toFixed(3));
  console.log(`  ${id.padEnd(13)} ${s.toFixed(2)}s   ${text}`);
}
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ ${Object.keys(LINES).length} clips → public/vo/kitchen/  ·  manifest → ${manifestFile}`);
