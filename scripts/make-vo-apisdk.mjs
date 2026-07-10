#!/usr/bin/env node
/**
 * 曉晴旁白 — kitchen-api-sdk-library 9:16 Short（EP02・8 beats）。
 * edge-tts zh-TW-HsiaoChenNeural。餐廳比喻：API=隔窗口點餐 / SDK=料理包帶回家 / 函式庫=現成醬料。
 * 生 mp3 → public/vo/apisdk/<id>.mp3，量秒數寫 api.vo.json。
 *   node scripts/make-vo-apisdk.mjs
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "apisdk");
const manifestFile = join(root, "src", "videos", "kitchen-api-sdk-library", "api.vo.json");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });
mkdirSync(dirname(manifestFile), { recursive: true });

const VOICE = process.env.VO_VOICE || "zh-TW-HsiaoChenNeural";

/** id → { text, rate }. rate 給 edge-tts --rate（連珠炮加速、釐清點放慢）。 */
const LINES = {
  a_hook: { text: "A P I、S D K、函式庫，這三個詞，天天有人搞混。其實，想成去餐廳吃飯，一分鐘就分得清。", rate: "+8%" },
  a_setup: { text: "重點只有一個問題：這頓飯，是你隔著窗口點，還是把料帶回家，自己煮？", rate: "+4%" },
  a_api: { text: "A P I，就是隔著窗口點餐。你看菜單，跟服務生說我要這個，廚房幫你做好端出來。你完全不用進廚房，也不知道裡面怎麼煮，這就是 A P I。", rate: "+6%" },
  a_sdk: { text: "S D K，是一整盒料理包。食材、食譜、工具，全部打包給你，讓你在自己家的廚房，把這道菜組出來。它裡面，常常還附了幫你跟外面餐廳點餐的工具喔。", rate: "+6%" },
  a_lib: { text: "函式庫，就是一罐現成的醬料。你不用從頭熬，要哪個味道，開罐倒進你的菜裡，立刻就有。", rate: "+8%" },
  // 注意：edge-tts 在「全形冒號／分號」緊接空格拆開的字母（：S D K）會吐出含糊怪音（聽似「表情符號困惑」）。
  // 字母前一律用逗號或空格，別用 ：／；。
  a_combo: { text: "所以一句話，A P I 是隔牆點餐，人家幫你做，S D K 跟函式庫，是把東西搬進你家，自己煮。", rate: "+2%" },
  a_myth: { text: "最容易搞混的是，S D K 跟 A P I，不是二選一。S D K 這個盒子裡面，常常就裝著，幫你打 A P I 的工具。", rate: "+0%" },
  a_outro: { text: "我是曉晴。訂閱看更多工程師黑話翻譯，下集，我們再翻一組新黑話！", rate: "+4%" },
};

const speak = (t) => t.replace(/\s+/g, " ").trim();
const probe = (f) =>
  parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${f}"`).toString().trim());

const manifest = {};
console.log(`engine: edge-tts   voice: ${VOICE}\n`);
for (const [id, { text, rate }] of Object.entries(LINES)) {
  const raw = join("/tmp", `${id}.api.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  const args = ["-m", "edge_tts", "--voice", VOICE, "--text", speak(text), "--write-media", raw];
  if (rate) args.push(`--rate=${rate}`);
  execFileSync("python3", args, { stdio: ["ignore", "ignore", "inherit"] });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const s = probe(mp3);
  manifest[id] = Number(s.toFixed(3));
  console.log(`  ${id.padEnd(10)} ${s.toFixed(2)}s   ${text}`);
}
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ ${Object.keys(LINES).length} clips → public/vo/apisdk/  ·  manifest → ${manifestFile}`);

/* ── VO QA：把生成的旁白轉錄回來，揪 edge-tts 發音意外 ──────────────
 * 例：「：S D K」會被唸成含糊怪音，whisper/人耳都聽成「表情符號困惑」。
 * 看稿抓不到、只有耳朵或轉錄抓得到 → 自動轉錄回比對當機器防線。
 * 字母前一律用逗號/空格、別用全形「：」「；」。詳記憶 edge-tts-spaced-acronym-bug。 */
console.log(`\n— VO QA：轉錄回比對（faster-whisper small）—`);
const qaPy = join("/tmp", "qa-vo-apisdk.py");
writeFileSync(
  qaPy,
  [
    `import sys, glob`,
    `from faster_whisper import WhisperModel`,
    `m = WhisperModel("small", device="cpu", compute_type="int8")`,
    `bad = ["表情", "符號", "困惑", "笑臉", "愛心", "emoji"]`,
    `fail = False`,
    `for f in sorted(glob.glob(${JSON.stringify(voDir + "/*.mp3")})):`,
    `    segs, _ = m.transcribe(f, language="zh")`,
    `    txt = "".join(s.text for s in segs).strip()`,
    `    hit = [b for b in bad if b in txt]`,
    `    if hit: fail = True`,
    `    tag = "  ⚠️ 疑似怪音(" + "/".join(hit) + ")" if hit else "  ok"`,
    `    print(f"  {f.split('/')[-1]:14}{tag}  {txt[:42]}")`,
    `sys.exit(1 if fail else 0)`,
  ].join("\n") + "\n",
);
try {
  execSync(`python3 "${qaPy}"`, { stdio: "inherit" });
  console.log(`✓ VO QA 通過：無發音意外\n`);
} catch {
  console.log(`\n✗ VO QA 警告：上面標 ⚠️ 的句子可能有 edge-tts 怪音（如字母前用了「：」「；」）。`);
  console.log(`  改標點（字母前用逗號或空格）後重生這支腳本即可。\n`);
}
