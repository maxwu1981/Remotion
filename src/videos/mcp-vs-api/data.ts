/**
 * Content model for the MCP-vs-API explainer. Keeping the copy here (not inline
 * in scenes) makes the script easy to tweak in one place. 中英對照.
 */
import { COLORS } from "../../shared-skills/theme";

/** Each side keeps a consistent colour across every scene. */
export const API = { color: COLORS.remotion, deep: COLORS.remotionDeep, label: "API" } as const;
export const MCP = { color: COLORS.claude, deep: COLORS.claudeDeep, label: "MCP" } as const;

/** A node in the "API = restaurant waiter" flow (Scene 2). */
export type FlowStep = { zh: string; en: string; emoji: string };

export const API_FLOW: FlowStep[] = [
  { zh: "你 · 用戶端", en: "Client", emoji: "🙋" },
  { zh: "菜單 · API 文件", en: "API docs", emoji: "📋" },
  { zh: "服務生 · API", en: "API", emoji: "🤵" },
  { zh: "廚房 · 伺服器", en: "Server", emoji: "🍳" },
  { zh: "上菜 · 資料", en: "Data", emoji: "🍽️" },
];

/** The data sources an AI reaches through one MCP connector (Scene 3). */
export const MCP_SOURCES: FlowStep[] = [
  { zh: "本地檔案", en: "Local files", emoji: "📁" },
  { zh: "公司資料庫", en: "Database", emoji: "🗄️" },
  { zh: "外部 API", en: "External APIs", emoji: "🌐" },
  { zh: "各種工具", en: "Tools", emoji: "🛠️" },
];

/** The two halves of the "they cooperate, not compete" idea (Scene 4). */
export const RELATION = [
  {
    zh: "MCP 底層常在呼叫 API",
    en: "MCP usually calls APIs underneath",
    body: "MCP 本身不產生資料。AI 透過 MCP 取資料時，MCP 伺服器常在背後呼叫該服務的 API。",
  },
  {
    zh: "MCP 是 API 的封裝與翻譯者",
    en: "MCP wraps & translates APIs",
    body: "它把各種複雜的 API 串接邏輯包起來，統一翻譯成 AI 看得懂的標準語言。",
  },
] as const;

/** The core differences, one row per dimension (Scene 5). */
export type DiffRow = { dim: string; dimEn: string; api: string; mcp: string };

export const DIFFS: DiffRow[] = [
  { dim: "主要用途", dimEn: "Purpose", api: "任何軟體之間溝通", mcp: "專為 AI 連接外部世界" },
  { dim: "標準化程度", dimEn: "Standardization", api: "低 · 各有文件與格式", mcp: "高 · 統一標準協議" },
  { dim: "主要使用者", dimEn: "Main user", api: "人類開發者", mcp: "AI 模型 + AI 開發者" },
  { dim: "整合複雜度", dimEn: "Integration", api: "每個都要客製串接", mcp: "寫一次 · 隨插即用" },
];

/** Closing one-liners (Scene 7). */
export const TAKEAWAYS = [
  { side: API, zh: "建立了數位世界資料流通的基礎。", en: "The foundation of how data flows." },
  { side: MCP, zh: "讓 AI 時代能輕鬆、標準化地使用這些資料與 API。", en: "Standardized access for the AI era." },
] as const;
