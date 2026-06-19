/**
 * Content model for the "Git commit 與 push 新手指南" explainer. Copy lives here
 * (not inline in scenes) so the script is easy to tweak in one place. 全繁體中文，
 * 指令／檔名／產品名／技術名詞保留英文。
 */
import { COLORS } from "../../shared-skills/theme";

/**
 * Semantic palette — reused so meaning compounds:
 *   yes  green → 正確 / 完成 / 有備份
 *   no   red   → 誤解 / 錯誤觸發
 *   warn amber → 坑 / 注意事項
 *   struct blue → 中性結構
 */
export const PAL = {
  yes: COLORS.success,
  yesBg: COLORS.successBg,
  no: COLORS.error,
  noBg: COLORS.errorBg,
  warn: COLORS.warn,
  warnBg: COLORS.warnBg,
  struct: COLORS.remotion,
  structDeep: COLORS.remotionDeep,
  ink: COLORS.ink,
} as const;

/**
 * Motif accent colours — each recurring object keeps ONE colour everywhere, so
 * a viewer learns the vocabulary once:
 *   📄 file   sky    = 改檔案
 *   💾 commit violet = commit＝本地存檔（還原點）
 *   ⬆  push   blue   = push＝上傳雲端
 *   ☁️ cloud  blue   = GitHub 雲端（遠端）
 *   🖥 local  slate  = 你的電腦（本地）
 *   💬 chat   orange = 用白話告訴 Claude
 *   ✅ allow  green  = 允許 / Allow
 */
export const MOTIF = {
  file: COLORS.hi.sky,
  commit: COLORS.hi.violet,
  push: COLORS.remotion,
  cloud: COLORS.remotion,
  local: COLORS.inkSoft,
  chat: COLORS.claude,
  allow: COLORS.success,
} as const;

/** The master pipeline established in the cover and referred back to throughout. */
export const PIPELINE = [
  { key: "file", emoji: "📄", zh: "改檔案", color: MOTIF.file },
  { key: "commit", emoji: "💾", zh: "commit", sub: "本地存檔", color: MOTIF.commit },
  { key: "push", emoji: "☁️", zh: "push", sub: "上傳雲端", color: MOTIF.push },
] as const;

/* ───────────────────────── Section 1 — 最關鍵的觀念 ─────────────────────── */

/** Two false bundles the article-reader often assumes — both get a red ✘ stamp. */
export const S1_FALSE = [
  "commit／push ＝ Claude 的指令",
  "要聊完 Claude 才能 commit／push",
];
export const S1_KEY = "commit 和 push 是 Git（版本控制）的功能，不是 Claude 的指令。";
export const S1_CAPTION = "跟你有沒有跟 Claude 聊完，完全無關。";

/* ───────────────────────── Section 2 — 是什麼（比喻） ───────────────────── */

export const S2_COMMIT_NOTE = "修好登入按鈕";
export const S2_LOCAL_LABEL = "你的電腦（本地）";
export const S2_CLOUD_LABEL = "GitHub 雲端";
export const S2_COMMIT_DESC = "commit ＝ 本地存檔（還原點，沒上傳）";
export const S2_PUSH_DESC = "push ＝ 上傳到雲端（有備份，別人也看得到）";
export const S2_KEY = "順序是：改檔案 → commit（本地存檔）→ push（上傳）。";
export const S2_CAPTION = "可以連續 commit 好幾次，最後再一次 push。";

/* ───────────────────────── Section 3 — 什麼時候用？ ─────────────────────── */

export const S3_COMMIT_TRIGGERS = ["做完一個小功能", "修好一個 bug", "寫完文件的一段"];
export const S3_PUSH_TRIGGERS = ["想備份", "要收工", "想分享出去"];
export const S3_WRONG = "聊完 Claude 才做";
export const S3_RIGHT = "完成一個進度段落就做";
export const S3_EDGE = "這次沒改到檔案 → 不用 commit。";
export const S3_KEY = "真正的觸發點是『我完成了一個之後會想退回來看的進度』。";

/* ───────────────────────── Section 4 — 三種輸入方式 ────────────────────── */

export const S4_CLI = ['git add .', 'git commit -m "這次改了什麼"', "git push"];
export const S4_GUI_FILES = ["src/login.tsx", "src/styles.css", "README.md"];
export const S4_GUI_FIELD = "這次改了什麼";
export const S4_CHAT = "幫我把剛剛的修改 commit 並 push";
export const S4_CARDS = [
  { tag: "命令列（CLI／終端機）", sub: "文章最常教", emoji: "⌨️" },
  { tag: "桌面 App", sub: "GitHub Desktop · VS Code · SourceTree", emoji: "🖱" },
  { tag: "Claude Code／Cowork", sub: "用白話講就好", emoji: "💬" },
];
export const S4_RESULT = "殊途同歸：commit ＋ push";
export const S4_KEY = "同樣三個動作，一邊打字、一邊按鈕，概念完全相同。";

/* ───────────────────────── Section 5 — 關於 /commit ────────────────────── */

export type SlashCmd = { cmd: string; tag: "內建" | "自訂（進階）"; desc: string };
export const S5_SLASH: SlashCmd[] = [
  { cmd: "/clear", tag: "內建", desc: "清空對話" },
  { cmd: "/init", tag: "內建", desc: "初始化專案" },
  { cmd: "/commit", tag: "自訂（進階）", desc: "自己設定的 git 快捷" },
];
export const S5_PATH = ".claude/commands/";
export const S5_STICKY = "新手可先略過";
export const S5_KEY = "/commit 是進階使用者自己設定的快捷指令，不是新手必備。";
export const S5_CAPTION = "等同樣的事重複很多次，再來設快捷。";

/* ───────────────────────── Section 6 — 桌面版實作步驟 ──────────────────── */

export const S6_CHAT =
  "幫我把目前的修改 commit 並 push 到 GitHub，commit 說明寫『更新作畫腳本』。";
export const S6_PERMISSION = ['git add .', 'git commit -m "更新作畫腳本"', "git push"];
export const S6_TOAST = "已 commit（本地存檔）並 push（上傳雲端），完成！";
export const S6_STEPS = ["在聊天框打一句話", "跳出權限視窗 → 按「允許」", "成功！Claude 回報完成"];
export const S6_KEY = "等於把那三行指令變成一句白話。";

/* ───────────────────────── Section 7 — 新手常踩的坑 ────────────────────── */

export const S7_ERRORS = ["error: no remote", "fatal: authentication failed"];
export const S7_SETUP = [
  { icon: "🔗", text: "連到 GitHub 倉庫" },
  { icon: "🔑", text: "登入授權一次" },
];
export const S7_FIX_CHAT = "（貼上錯誤訊息）幫我把 GitHub 接起來";
export const S7_FIX_OK = "只要設定一次，之後都不用再弄。";
export const S7_KEY =
  "push 要成功：專案要先連到 GitHub 倉庫、而且你登入授權過一次。";

/* ───────────────────────── Section 8 — 給你的小建議 ────────────────────── */

export const S8_LOOP = [
  { icon: "✅", text: "完成一個段落" },
  { icon: "💬", text: "跟 Claude 說「commit 並 push」" },
  { icon: "☁️", text: "雲端備份 ✔" },
];
export const S8_LEVELUP = "習慣後想自己掌控 → 學 CLI 三行指令，或桌面 App 的按鈕";
export const S8_KEY = "每完成一個段落，就跟 Claude 說一次『commit 並 push』。";

/* ───────────────────────── Outro — 三步驟總整理 ───────────────────────── */

export const OUTRO_CARDS = [
  "commit ＝本地存檔；push ＝上傳雲端。",
  "順序：改檔案 → commit → push（可多次 commit，再一次 push）。",
  "桌面版最簡單：直接跟 Claude 說『commit 並 push』，按『允許』就好。",
];
