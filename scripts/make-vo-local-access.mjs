#!/usr/bin/env node
/**
 * Voiceover for 「本地存取優勢」EP01 — 本機路徑 vs 雲端存取(銀玻璃資訊面板風)。
 * 旁白 = 曉晴(第一人稱老闆視角);Claude Code 的回答 = 台灣男聲(一句)。
 *
 * 每句 → public/vo/local-access-advantage/<id>.mp3
 * 量到的秒數 → src/videos/local-access-advantage/vo-manifest.json (comp 排時間用)。
 *
 *   node scripts/make-vo-local-access.mjs            # 全部
 *   node scripts/make-vo-local-access.mjs c1 c2      # 只重生指定句(過稿改字用)
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voDir = join(root, "public", "vo", "local-access-advantage");
const videoDir = join(root, "src", "videos", "local-access-advantage");
if (!existsSync(voDir)) mkdirSync(voDir, { recursive: true });

const VOICE = {
  narrator: "zh-TW-HsiaoChenNeural", // 曉晴(我=老闆第一人稱)
  claude: "zh-TW-YunJheNeural", // Claude Code 的回答(溫暖台灣男聲)
};

// 一句一條;id 對應 Master.tsx 的 SCENES lines(順序即播放順序)
const LINES = [
  // S1 鉤子
  { id: "h1", who: "narrator", text: "你有沒有想過——你請 AI 讀一個檔案的時候,它可能正在繞地球一圈?" },
  { id: "h2", who: "narrator", text: "同一個檔案,放對地方,幾毫秒到手;放錯地方,慢上百倍,還多花錢。" },
  // S2 我的故事(為何有此議題)
  { id: "st1", who: "narrator", text: "我每天用 Claude Code 做影片。圖片、音樂、字幕檔,整天丟來丟去。" },
  { id: "st2", who: "narrator", text: "一開始我想得很美——檔案全放 Google Drive。雲端嘛,走到哪、讀到哪,最方便。" },
  { id: "st3", who: "narrator", text: "直到有一天我發現,怪了——它讀個檔案怎麼那麼慢,還一直吃我的額度?" },
  // S3 影響(痛點)
  { id: "p1", who: "narrator", text: "後來我才知道,AI 從雲端拿一個檔案,要先呼叫工具、跨網路來回——一趟,就是幾百毫秒。" },
  { id: "p2", who: "narrator", text: "而且每個檔案至少多一次 API 呼叫,回應裡還夾著一堆結構資料,token 就這樣白白燒掉。" },
  { id: "p3", who: "narrator", text: "最痛的是——雲端這條路,只能讀、不能改。你要它幫你改檔案?抱歉,做不到。" },
  // S4 我怎麼解:直接問當事人(真實對話截圖)
  { id: "a1", who: "narrator", text: "這種問題,與其上網查,不如直接問當事人。我打開 Claude Code,原話這樣問——檔案放終端機位置,你找得到嗎?跟 Google Drive 比,哪個有優勢?" },
  { id: "a2", who: "claude", text: "先直接說結論——對我來說,本機路徑,完勝 Google Drive。Google Drive 的主要用途,是給 Gemini 用的,不是給我用的。" },
  { id: "a3", who: "narrator", text: "它還給了我一張完整的比較表。我把它做成這面牆,四個回合,一個一個看。" },
  // S5 詳細比較(正點詳細說明,四回合)
  { id: "c1", who: "narrator", text: "第一回合,存取方式。本機路徑,AI 用 Read 跟 Bash 直接讀,零次 API 呼叫;雲端要透過 MCP 工具,每個檔案,至少一次。" },
  { id: "c2", who: "narrator", text: "第二回合,速度。本機是硬碟直讀,幾毫秒;雲端要網路往返,幾百毫秒——差了大概一百倍。" },
  { id: "c3", who: "narrator", text: "第三回合,token 消耗。本機,只算檔案內容本身;雲端,還要多付 API 回應結構跟 metadata 的過路費。" },
  { id: "c4", who: "narrator", text: "第四回合,能做的事。本機,讀、改、寫、跑指令,樣樣都行;雲端,只能讀,不能直接修改。四比零。" },
  // S6 生活化 summary(廚房比喻)
  { id: "m1", who: "narrator", text: "講生活一點。本機路徑,就像食材放在自家冰箱——伸手就拿,想煎想炒都隨你。" },
  { id: "m2", who: "narrator", text: "Google Drive,像每樣食材都叫外送——要等配送、要付運費,而且外送員只送到門口,不會進廚房幫你煮。" },
  { id: "m3", who: "narrator", text: "廚師就住你家,你卻堅持每樣食材都叫外送——這就是我之前幹的傻事。" },
  // S7 案例操作 A:三種路徑情況
  { id: "t1", who: "narrator", text: "那路徑實際怎麼給?就三種情況。" },
  { id: "t2", who: "narrator", text: "第一種,專案資料夾裡的檔案——它自動知道,你講檔名就好。" },
  { id: "t3", who: "narrator", text: "第二種,下載、文件這些常用資料夾——它知道規律,給檔名它就找得到。" },
  { id: "t4", who: "narrator", text: "第三種,完全陌生的路徑——最快的做法,把檔案從 Finder 直接拖進終端機,完整路徑自己跳出來,一秒鐘的事。" },
  // S8 案例操作 B:下載自動接手(終端機 demo)
  { id: "d1", who: "narrator", text: "再看一個我每天在用的自動化。我用 Gemini 生了一段音樂,檔案落在下載資料夾——然後我什麼路徑都沒報。" },
  { id: "d2", who: "narrator", text: "Claude Code 自己跑一行指令,把下載資料夾按時間排序——最新的檔案,立刻現形。" },
  { id: "d3", who: "narrator", text: "接著自己複製進專案資料夾,收工。整個流程,我一個字的路徑都沒打過。" },
  // S9 證明 + 陷阱 + 分工
  { id: "v1", who: "narrator", text: "換掉做法之後,帳很好算——原本每讀一個檔,至少一次 API 呼叫、幾百毫秒;現在,零次呼叫、幾毫秒,還能直接改。" },
  { id: "v2", who: "narrator", text: "還有個很少人講的陷阱——Drive 這類 MCP 工具是外掛,每次新對話都要先載入才能用;萬一斷線,整條流程卡死。本機路徑,沒這個問題。" },
  { id: "v3", who: "narrator", text: "但注意,兩邊不是敵人,是分工——本機路徑給 Claude Code;Google Drive,給讀不到你電腦的網頁版 AI,像 Gemini。各走各的路,各自最快。" },
  // S10 Outro
  { id: "o1", who: "narrator", text: "記住這一句——檔案放哪裡,決定 AI 多快拿到、能不能動手。" },
  { id: "o2", who: "narrator", text: "這集是,新手名詞系列第六集。如果這種把 AI 用法講透的影片幫到你,訂閱、按讚,分享給那個還在把檔案丟雲端的朋友——我們下一集見。" },
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

const only = process.argv.slice(2); // 指定 id 局部重生
const manifestPath = join(videoDir, "vo-manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

console.log("engine: edge-tts  曉晴旁白 + Claude 男聲一句\n");
for (const { id, who, text } of LINES) {
  if (only.length && !only.includes(id)) continue;
  const voice = VOICE[who];
  const raw = join("/tmp", `${id}.la.edge.mp3`);
  const mp3 = join(voDir, `${id}.mp3`);
  execFileSync("python3", ["-m", "edge_tts", "--voice", voice, "--text", speak(text), "--write-media", raw], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  execSync(`ffmpeg -y -hide_banner -loglevel error -i "${raw}" -ar 44100 -ac 1 -b:a 192k "${mp3}"`);
  const seconds = probe(mp3);
  manifest[id] = Number(seconds.toFixed(3));
  console.log(`  ${id.padEnd(4)} ${who.padEnd(9)} ${seconds.toFixed(2)}s  ${text.slice(0, 26)}`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((a, b) => a + b, 0);
console.log(`\n✓ → public/vo/local-access-advantage/`);
console.log(`  spoken total: ${total.toFixed(1)}s  (${(total / 60).toFixed(1)} min)`);
