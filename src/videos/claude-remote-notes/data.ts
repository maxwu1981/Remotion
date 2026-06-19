/**
 * Content model for the "Claude Code 手機／遠端全解析" explainer. Copy lives here
 * (not inline in scenes) so the script is easy to tweak in one place. 全繁體中文，
 * 檔名／指令／產品名／技術名詞保留英文。
 */
import { COLORS } from "../../shared-skills/theme";

/**
 * Semantic palette for the whole video — reused so meaning compounds:
 *   yes   green  → 共享 / 會保留 / 正確
 *   no    red    → 隔離 / 不保留 / 誤解
 *   warn  amber  → 警告 / 注意事項
 *   struct blue  → 結構 / 中性
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

/** Motif accent colours — each recurring object keeps one colour everywhere. */
export const MOTIF = {
  phone: COLORS.remotion, // 📱 手機 = 螢幕／遙控器
  cloud: COLORS.hi.violet, // ☁️ 容器 = 臨時工作桌
  warehouse: COLORS.success, // 🏛️ GitHub 倉庫 = 永久存放
  note: COLORS.warn, // 📝 CLAUDE.md 記事本
  fence: COLORS.hi.amber, // 🔒 沙盒圍欄
} as const;

/* ───────────────────────────── Section 1 — 共享 vs 不共享 ──────────────── */

export type MemoryRow = {
  zh: string;
  en: string;
  shared: boolean;
  badge: string;
  note: string;
};

export const MEMORY_ROWS: MemoryRow[] = [
  {
    zh: "對話的上下文記憶",
    en: "Conversation context",
    shared: true,
    badge: "✔ 共享",
    note: "手機、網頁、桌面 App 看到的是同一個 session。",
  },
  {
    zh: "程式／檔案的執行記憶",
    en: "RAM · 變數 · 本機檔案",
    shared: false,
    badge: "✘ 不共享",
    note: "手機檔案與容器檔案完全隔離。",
  },
];

export const S1_DEVICES = [
  { emoji: "📱", zh: "手機" },
  { emoji: "🌐", zh: "網頁" },
  { emoji: "🖥", zh: "桌面" },
];

/* ───────────────────────────── Section 2 — CLAUDE.md 兩層級 ─────────────── */

export type Tier = {
  zh: string;
  path: string;
  keep: boolean;
  badge: string;
  note: string;
};

export const TIERS: Tier[] = [
  {
    zh: "專案記憶",
    path: "專案資料夾/CLAUDE.md",
    keep: true,
    badge: "✔ 會保留（只要 commit + push）",
    note: "適合放：這個專案的 bug、慣例、注意事項",
  },
  {
    zh: "使用者記憶",
    path: "~/.claude/CLAUDE.md",
    keep: false,
    badge: "✘ 在遠端容器中不會保留（容器回收就消失）",
    note: "適合放：跨專案的個人偏好",
  },
];

export const S2_WARNING =
  "在手機／遠端情境，只有 push 到 GitHub 的專案 CLAUDE.md 才會真正持久保留，並讓所有裝置共享。";

/* ───────────────────────────── Section 3 — 名詞白話對照 ────────────────── */

export type Term = { term: string; zh: string; emoji: string; desc: string };

export const TERMS: Term[] = [
  { term: "repo", zh: "倉庫", emoji: "📁", desc: "放這個專案所有檔案的資料夾。" },
  {
    term: "git",
    zh: "存檔系統",
    emoji: "🎮",
    desc: "資料夾的存檔系統，像遊戲存檔，能記住每次變化、回到任何版本。",
  },
  { term: "commit", zh: "提交", emoji: "💾", desc: "按一次存檔，把目前版本記錄下來（存在本機）。" },
  {
    term: "push",
    zh: "推送",
    emoji: "☁️⬆",
    desc: "把存檔上傳到雲端；沒 push，別的裝置看不到你的改動。",
  },
  {
    term: "repo clone",
    zh: "複製倉庫",
    emoji: "☁️⬇",
    desc: "從雲端把整個資料夾下載下來，到新環境工作前要先做的事。",
  },
  { term: "session", zh: "工作階段", emoji: "⏱", desc: "這一次的對話／工作時段。" },
  { term: "container", zh: "容器", emoji: "🖥♻", desc: "一台借來用、用完就清空的臨時雲端電腦。" },
];

/* ───────────────────────────── Section 5 — 啟動四步 ────────────────────── */

export const BOOT_STEPS = [
  "借一台空白容器",
  "從 GitHub 把整個專案下載進容器（repo clone）",
  "此時 CLAUDE.md 已經在容器裡（跟著專案一起下載進來）",
  "對話開始，需要時就「從容器裡」讀這份 CLAUDE.md",
];

export const S5_PRINCIPLE = "誰在跑程式，就讀誰身邊的 CLAUDE.md。";
export const S5_PRINCIPLE_SUB =
  "在手機／網頁情境，是「容器」在跑，所以讀的是容器裡那份（從 GitHub 影印進來的）。";

export const S5_WRONG = "容器裡不存在 CLAUDE.md，它存在我的本地電腦。";
export const S5_RIGHT =
  "容器裡「有」CLAUDE.md（隨專案影印進來），Claude 從容器裡讀它；你的本地電腦它完全看不到。只要你之前 push 過，每次開新 session 都會自動帶進來，不必每次重給。";

/* ───────────────────────────── Section 6 — 兩種情況 ────────────────────── */

export type FileVerdict = { file: string; ok: boolean; verdict: string };

export const SCENARIO_A: FileVerdict[] = [
  { file: "電腦上 ~/.claude/CLAUDE.md", ok: false, verdict: "✘ 沒用（容器看不到你電腦）" },
  { file: "電腦上 各專案的 CLAUDE.md", ok: false, verdict: "✘ 沒用" },
  { file: "GitHub 倉庫裡的專案 CLAUDE.md", ok: true, verdict: "✔ 要（這份才會被影印進容器）" },
];

export type ScopeRow = { file: string; scope: string; use: string };

export const SCENARIO_B: ScopeRow[] = [
  {
    file: "~/.claude/CLAUDE.md（一份就好）",
    scope: "所有專案通用",
    use: "個人偏好，如「回答用中文」",
  },
  { file: "每個專案的 CLAUDE.md", scope: "只對該專案", use: "專案專屬規則、bug、慣例" },
];

export const S6_BEST =
  "最划算做法：把重要規則寫進「專案的 CLAUDE.md」並 push 到 GitHub —— 電腦、手機、網頁三邊通吃。";

/* ───────────────────────────── Section 7 — 容器 ⊃ 沙盒 ─────────────────── */

export const SANDBOX_LIMITS = [
  { icon: "🌐", text: "網路：通常不能隨便連外網" },
  { icon: "📁", text: "檔案：通常只能動專案資料夾" },
];

export const S7_PROMPT = "需要超出限制時，系統會擋下或詢問是否「跳出沙盒」用更高權限。";
export const S7_CLOSE = "就算指令有問題，傷害也被關在圍欄裡。";

/* ───────────────────────────── Section 8 — Chat / Cowork / Code ────────── */

export type Product = {
  name: string;
  sub: string;
  desc: string;
  here: boolean;
  emoji: string;
};

export const PRODUCTS: Product[] = [
  {
    name: "Code",
    sub: "Claude Code",
    emoji: "⌨️",
    here: true,
    desc: "會實際讀寫程式碼、跑指令、操作 git 的工具（即目前這個）",
  },
  {
    name: "Chat",
    sub: "claude.ai 一般對話",
    emoji: "💬",
    here: false,
    desc: "純聊天問答，不動程式碼／容器",
  },
  { name: "Cowork", sub: "另一個介面", emoji: "🧩", here: false, desc: "另一個不同的介面／產品" },
];

export const S8_FOOTER =
  "用同一個帳號，可從 claude.ai/code 或 Claude Code 手機／桌面 App 找回，跨裝置同步。";

/* ───────────────────────────── Section 9 — Dispatch ───────────────────── */

export const DISPATCH_ROUTES = [
  { kind: "寫程式／開發類", to: "Code（Claude Code）", color: COLORS.remotion },
  { kind: "一般知識工作（找文件、摘要、比對）", to: "Cowork", color: COLORS.hi.violet },
];

export const S9_NOW = "目前這個對話：手機 → 連到雲端容器在跑。";
export const S9_DISPATCH =
  "Dispatch：手機 → 連到你自己桌面電腦上的 Claude，任務在你電腦本機處理 → 因此開發任務會讀「你電腦本機」的 CLAUDE.md。";
export const S9_SUMMARY =
  "Dispatch 入口在 Cowork，但開發任務落到 Code、知識任務落在 Cowork；而且它派回你的桌面電腦跑，不是雲端容器。";

/* ───────────────────────────── Outro — 三句話 ─────────────────────────── */

export const OUTRO_CARDS = [
  "對話記憶跨裝置共享（同一 session）；檔案／執行環境不共享。",
  "想讓 memory（CLAUDE.md）持久又跨裝置：寫進專案 CLAUDE.md 並 push 到 GitHub。",
  "容器＝臨時雲端電腦；沙盒＝容器內的安全圍欄；Dispatch＝派任務回你桌面電腦（依任務分流到 Code／Cowork）。",
];
