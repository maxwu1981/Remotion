#!/usr/bin/env node
/**
 * EP06「本地存取優勢」YouTube 字幕檔(.srt) — 時間軸與 Master.tsx 完全同一套數學
 * (COVER/LEAD/GAP/TAIL/XFADE 常數要跟 Master 同步改)。
 *
 *   node scripts/make-srt-local-access.mjs
 *   → out/youtube-videos/local-access-ep06/local-access-ep06.srt
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const M = JSON.parse(readFileSync(join(root, "src/videos/local-access-advantage/vo-manifest.json"), "utf8"));

const FPS = 30, LEAD = 16, GAP = 8, TAIL = 22, XFADE = 11, COVER = 66;
const sec = (id) => Math.round((M[id] ?? 3) * FPS);

// 與 Master.tsx SCENES 同序;字幕文字=旁白原句(GEO:引擎吃逐字稿)
const SCENES = [
  ["h1", "h2"],
  ["st1", "st2", "st3"],
  ["p1", "p2", "p3"],
  ["a1", "a2", "a3"],
  ["c1", "c2", "c3", "c4"],
  ["m1", "m2", "m3"],
  ["t1", "t2", "t3", "t4"],
  ["d1", "d2", "d3"],
  ["v1", "v2", "v3"],
  ["o1", "o2"],
];
const TEXT = {
  h1: "你有沒有想過——你請 AI 讀一個檔案的時候,它可能正在繞地球一圈?",
  h2: "同一個檔案,放對地方,幾毫秒到手;放錯地方,慢上百倍,還多花錢。",
  st1: "我每天用 Claude Code 做影片。圖片、音樂、字幕檔,整天丟來丟去。",
  st2: "一開始我想得很美——檔案全放 Google Drive。雲端嘛,走到哪、讀到哪,最方便。",
  st3: "直到有一天我發現,怪了——它讀個檔案怎麼那麼慢,還一直吃我的額度?",
  p1: "後來我才知道,AI 從雲端拿一個檔案,要先呼叫工具、跨網路來回——一趟,就是幾百毫秒。",
  p2: "而且每個檔案至少多一次 API 呼叫,回應裡還夾著一堆結構資料,token 就這樣白白燒掉。",
  p3: "最痛的是——雲端這條路,只能讀、不能改。你要它幫你改檔案?抱歉,做不到。",
  a1: "這種問題,與其上網查,不如直接問當事人。我打開 Claude Code,原話這樣問——檔案放終端機位置,你找得到嗎?跟 Google Drive 比,哪個有優勢?",
  a2: "先直接說結論——對我來說,本機路徑,完勝 Google Drive。Google Drive 的主要用途,是給 Gemini 用的,不是給我用的。",
  a3: "它還給了我一張完整的比較表。我把它做成這面牆,四個回合,一個一個看。",
  c1: "第一回合,存取方式。本機路徑,AI 用 Read 跟 Bash 直接讀,零次 API 呼叫;雲端要透過 MCP 工具,每個檔案,至少一次。",
  c2: "第二回合,速度。本機是硬碟直讀,幾毫秒;雲端要網路往返,幾百毫秒——差了大概一百倍。",
  c3: "第三回合,token 消耗。本機,只算檔案內容本身;雲端,還要多付 API 回應結構跟 metadata 的過路費。",
  c4: "第四回合,能做的事。本機,讀、改、寫、跑指令,樣樣都行;雲端,只能讀,不能直接修改。四比零。",
  m1: "講生活一點。本機路徑,就像食材放在自家冰箱——伸手就拿,想煎想炒都隨你。",
  m2: "Google Drive,像每樣食材都叫外送——要等配送、要付運費,而且外送員只送到門口,不會進廚房幫你煮。",
  m3: "廚師就住你家,你卻堅持每樣食材都叫外送——這就是我之前幹的傻事。",
  t1: "那路徑實際怎麼給?就三種情況。",
  t2: "第一種,專案資料夾裡的檔案——它自動知道,你講檔名就好。",
  t3: "第二種,下載、文件這些常用資料夾——它知道規律,給檔名它就找得到。",
  t4: "第三種,完全陌生的路徑——最快的做法,把檔案從 Finder 直接拖進終端機,完整路徑自己跳出來,一秒鐘的事。",
  d1: "再看一個我每天在用的自動化。我用 Gemini 生了一段音樂,檔案落在下載資料夾——然後我什麼路徑都沒報。",
  d2: "Claude Code 自己跑一行指令,把下載資料夾按時間排序——最新的檔案,立刻現形。",
  d3: "接著自己複製進專案資料夾,收工。整個流程,我一個字的路徑都沒打過。",
  v1: "換掉做法之後,帳很好算——原本每讀一個檔,至少一次 API 呼叫、幾百毫秒;現在,零次呼叫、幾毫秒,還能直接改。",
  v2: "還有個很少人講的陷阱——Drive 這類 MCP 工具是外掛,每次新對話都要先載入才能用;萬一斷線,整條流程卡死。本機路徑,沒這個問題。",
  v3: "但注意,兩邊不是敵人,是分工——本機路徑給 Claude Code;Google Drive,給讀不到你電腦的網頁版 AI,像 Gemini。各走各的路,各自最快。",
  o1: "記住這一句——檔案放哪裡,決定 AI 多快拿到、能不能動手。",
  o2: "這集是,新手名詞系列第六集。如果這種把 AI 用法講透的影片幫到你,訂閱、按讚,分享給那個還在把檔案丟雲端的朋友——我們下一集見。",
};

const ts = (frames) => {
  const msTotal = Math.round((frames / FPS) * 1000);
  const h = Math.floor(msTotal / 3600000);
  const m = Math.floor((msTotal % 3600000) / 60000);
  const s = Math.floor((msTotal % 60000) / 1000);
  const ms = msTotal % 1000;
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(h)}:${p(m)}:${p(s)},${p(ms, 3)}`;
};

let abs = COVER; // 第一景起點(TransitionSeries:下一段起點=前段結尾-XFADE)
let idx = 0;
const out = [];
for (const lines of SCENES) {
  const sceneStart = abs - XFADE;
  let off = LEAD;
  let total = LEAD;
  for (const id of lines) {
    const from = sceneStart + off;
    const to = from + sec(id);
    idx += 1;
    out.push(`${idx}\n${ts(from)} --> ${ts(to)}\n${TEXT[id]}\n`);
    off += sec(id) + GAP;
    total += sec(id) + GAP;
  }
  const sceneFrames = total - GAP + TAIL;
  abs = sceneStart + sceneFrames;
}

const file = join(root, "out/youtube-videos/local-access-ep06/local-access-ep06.srt");
writeFileSync(file, out.join("\n"));
console.log(`✓ ${idx} cues → ${file}`);
console.log(`  last cue ends ${ts(abs)} (video total ≈ ${ts(abs)})`);
