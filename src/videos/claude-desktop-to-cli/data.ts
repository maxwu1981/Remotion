/**
 * Content model for the "Claude 桌面版 → CLI：差異、安裝與換機備份" explainer.
 * Copy lives here (not inline in scenes) so the script is easy to tweak in one
 * place. 全繁體中文；指令／檔名／產品名／技術名詞保留英文。
 */
import { COLORS } from "../../shared-skills/theme";

/**
 * Semantic palette — reused so meaning compounds:
 *   yes  green → 相同 / 自動共用 / 保留得了 / 持續存在
 *   no   red   → 各自獨立 / 不同步 / 保不住
 *   warn amber → 不同系統 / 要手動搬
 *   struct blue → 中性結構（磁碟、git、安裝）
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
 *   🖥 Chatbot 分頁  violet  = 聊天產品（不同系統）
 *   🖥 Cowork  分頁  sky     = 桌面協作模式
 *   🖥 Code    分頁  orange  = Claude Code（＝ 終端機 CLI）
 *   ⌨️ CLI 終端機    orange  = 與 Code 同引擎，所以同色
 *   ⚙️ engine        green   = 共用的引擎 / agent / 工具（＝「同一套」）
 *   📁 disk          blue    = 磁碟上同一批檔案
 *   📦 tarball       orange  = 打包好的 ~/.claude/
 *   🔑 key           amber   = 登入憑證（備份會排除）
 *   🗂 repo          blue    = 專案層檔案（靠 clone 回來）
 */
export const MOTIF = {
  chatbot: COLORS.hi.violet,
  cowork: COLORS.hi.sky,
  code: COLORS.claude,
  cli: COLORS.claude,
  engine: COLORS.success,
  disk: COLORS.remotion,
  tarball: COLORS.claude,
  key: COLORS.warn,
  repo: COLORS.remotion,
} as const;

/* ───────────────────────── Cover ──────────────────────────────────────── */

export const COVER_TAKEAWAYS = [
  { c: MOTIF.code, t: "Code 分頁 ≡ CLI" },
  { c: MOTIF.engine, t: "同一個引擎" },
  { c: MOTIF.disk, t: "換機備份 ~/.claude/" },
];

/* ───────────────── Section 1 — 桌面版 vs CLI 差在哪 ─────────────────────── */

export type TabKind = "chatbot" | "cowork" | "code";
export type Tab = {
  key: TabKind;
  name: string;
  emoji: string;
  desc: string;
  color: string;
  /** verdict tag under the card */
  tag?: string;
  tagKind?: "warn" | "yes";
};

export const S1_TABS: Tab[] = [
  {
    key: "chatbot",
    name: "Chatbot",
    emoji: "💬",
    desc: "一般對話用的 Claude，有 Memory、Projects（含 project／dispatch）",
    color: MOTIF.chatbot,
    tag: "聊天產品，跟 CLI 不同系統，記憶不互通",
    tagKind: "warn",
  },
  {
    key: "cowork",
    name: "Cowork",
    emoji: "🤝",
    desc: "桌面協作模式（桌面 App 特有）",
    color: MOTIF.cowork,
  },
  {
    key: "code",
    name: "Code",
    emoji: "⌨️",
    desc: "就是 Claude Code（寫程式的 agent）",
    color: MOTIF.code,
    tag: "跟終端機 CLI 同一個引擎，設定共用",
    tagKind: "yes",
  },
];

/** The two faces differ only in interface & workflow — engine is identical. */
export const S1_CODE_FEATURES = [
  "圖形介面、可視化 diff",
  "內建終端＋檔案編輯器",
  "瀏覽器預覽",
  "平行 session（自動 git worktree）",
  "僅支援 macOS / Windows",
];
export const S1_CLI_FEATURES = [
  "純文字介面",
  "可寫進 script／CI/CD",
  "可用 shell pipe 串接",
  "可走 SSH 在遠端伺服器跑",
  "支援 macOS / Linux / WSL / Windows",
  "多了 dontAsk 等權限模式",
];
export const S1_KEY = "Code 分頁與終端機 CLI 是『同一個引擎』，差別只在介面與工作流。";
export const S1_CAPTION = "底層的 agent、工具、能力完全一樣。";

/* ───────────────── Section 2 — CLI 去哪拿（官方安裝指令） ────────────────── */

export type Installer = { os: string; cmd: string; note?: string };
export const S2_INSTALLERS: Installer[] = [
  { os: "macOS / Linux / WSL", cmd: "curl -fsSL https://claude.ai/install.sh | bash" },
  { os: "Windows PowerShell", cmd: "irm https://claude.ai/install.ps1 | iex" },
];
export const S2_INSTALLER_BADGE = "會自動更新";

export type AltInstall = { cmd: string; note?: string };
export const S2_ALTS: AltInstall[] = [
  { cmd: "brew install --cask claude-code", note: "要手動 brew upgrade" },
  { cmd: "winget install Anthropic.ClaudeCode" },
  { cmd: "npm install -g @anthropic-ai/claude-code", note: "舊方式，需 Node 18+" },
];

export const S2_STEPS = [
  { icon: "📂", t: "在專案資料夾打 claude" },
  { icon: "🌐", t: "第一次跳瀏覽器登入" },
  { icon: "🔑", t: "用桌面版同一個帳號登入" },
];
export const S2_KEY = "推薦原生安裝器；裝完在專案資料夾打 claude 登入即可。";

/* ───────────── Section 3 — 記憶跟資料怎麼轉移（同一台電腦） ───────────────── */

export const S3_AUTO_SHARED = [
  "CLAUDE.md（./CLAUDE.md、~/.claude/CLAUDE.md）",
  "settings.json（~/.claude/、.claude/）",
  "MCP 設定（~/.claude.json、.mcp.json）",
  ".claude/skills/",
  ".claude/agents/",
  "hooks",
  "自動記憶 ~/.claude/projects/<專案>/memory/MEMORY.md",
];
export const S3_NOT_SHARED = [
  "對話／session 歷史（桌面與 CLI 各自獨立）",
  "登入憑證（各自存，但算同一帳號額度）",
];
export const S3_CONTINUE =
  "桌面 Code 分頁右上角「Continue in…」→ 選 CLI，把當前 session 交接到終端機";
export const S3_EXCEPTION =
  "例外：Chatbot 分頁的 Memory 屬聊天產品，沒有官方管道匯入 Claude Code——兩者是不同系統。";
export const S3_KEY = "Code 跟 CLI 讀的是磁碟上同一批檔案，所以登入後自動就有。";

/* ───────────── Section 4 — 換電腦：哪些保留得了、哪些保不住 ───────────────── */

export type Fate = "yes" | "warn" | "no";
export type FateItem = { icon: string; item: string; verdict: string; kind: Fate };
export const S4_ITEMS: FateItem[] = [
  { icon: "🔑", item: "登入／額度", verdict: "重新登入自動回來", kind: "yes" },
  { icon: "🗂", item: "專案層設定（在 git）", verdict: "clone 就回來", kind: "yes" },
  { icon: "⚙️", item: "個人層 ~/.claude/ 設定、技能", verdict: "要手動搬檔", kind: "warn" },
  {
    icon: "💬",
    item: "對話 session 歷史＋自動記憶",
    verdict: "不同步，要手動 copy，且預設 30 天會清",
    kind: "no",
  },
];
export const S4_BEST = [
  "重要記憶／設定盡量寫進專案 git",
  "換機前整包備份 ~/.claude/",
  "新機解開＋重新登入",
];
export const S4_KEY = "Claude Code 是『本機優先』，換電腦時除了登入，幾乎都要自己搬。";

/* ───────────────── Section 5 — 換機備份／還原腳本 ───────────────────────── */

export type MigrateCmd = { cmd: string; desc: string; color: string };
export const S5_CMDS: MigrateCmd[] = [
  {
    cmd: "./claude-migrate.sh backup [--no-history] [輸出檔.tgz]",
    desc: "在舊電腦打包 ~/.claude/",
    color: MOTIF.tarball,
  },
  {
    cmd: "./claude-migrate.sh restore <備份檔.tgz>",
    desc: "在新電腦還原 ~/.claude/",
    color: MOTIF.disk,
  },
  {
    cmd: "./claude-migrate.sh check",
    desc: "檢查專案層 .claude/ 是否已進 git",
    color: PAL.struct,
  },
];

/** What goes into the tarball (everything personal-level). */
export const S5_PACKED = ["個人設定", "技能", "agents", "rules", "對話歷史", "自動記憶"];

/** Files `check` looks for in a git project. */
export const S5_CHECK_FILES = [
  "CLAUDE.md",
  ".claude/settings.json",
  ".claude/skills",
  ".claude/agents",
  ".claude/rules",
  ".mcp.json",
];

export const S5_MANUAL = [
  {
    label: "舊電腦打包（排除憑證）",
    cmd: "tar --exclude='.credentials.json' -czf claude-backup.tgz -C ~ .claude",
  },
  { label: "新電腦解開", cmd: "tar -xzf claude-backup.tgz -C ~" },
];
export const S5_KEY = "一個腳本三個動作：backup → restore → check。";

/* ───────────────────────── Outro — 三點總整理 ──────────────────────────── */

export const OUTRO_CARDS = [
  "桌面 Code 分頁 ≡ 終端機 CLI（同引擎、設定共用）；Chatbot 的 Memory 是另一套，不互通。",
  "同一台電腦：記憶／設定／技能讀的是磁碟同一批檔，登入後自動就有。",
  "換電腦：本機優先、不雲端同步——重要的寫進 git，換機前整包備份 ~/.claude/。",
];
