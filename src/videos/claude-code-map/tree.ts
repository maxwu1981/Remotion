/**
 * Claude Code 新手知識地圖 — 單一真實來源 (single source of truth).
 *
 * 這份資料同時餵給:
 *   1. MAP.md 的 Mermaid 樹狀圖 + 定義清單
 *   2. ClaudeCodeMapPoster 海報 (Remotion still)
 *   3. 之後每一集影片的「你在這 / 下一步」bumper
 *
 * 設計原則:
 *   - 只收 Anthropic 原生概念(定義全部對照官方文件 code.claude.com/docs)。
 *   - nodes 依「學習順序」編號 1..30(觀眾照號碼學,看一眼就知道學過哪些)。
 *   - edges 是跨分支的「互相作用」關係,每條都帶 label。
 *   - 來源以 2026-06 線上官方文件為準;每個節點都有 sourceUrl。
 */

export type CategoryId = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface Category {
  id: CategoryId;
  /** 顯示用大類名稱(繁中) */
  label: string;
  /** 英文小標 */
  labelEn: string;
  /** 該大類主色(hex) */
  color: string;
}

export interface MapNode {
  /** 穩定 id(英文 slug,給 edges 參照) */
  id: string;
  /** 學習路徑序號 1..30 = 集數 */
  num: number;
  category: CategoryId;
  /** 畫面主標題(繁中) */
  title: string;
  /** 英文名(技術名詞保留英文) */
  titleEn: string;
  /** 一句話定義(繁中 + 英文名詞),對得上官方原文 */
  defShort: string;
  /** 官方來源 URL */
  sourceUrl: string;
}

export interface MapEdge {
  from: string;
  to: string;
  /** 關係詞(互相作用) */
  label: string;
}

/** 7 大類,每類一色(取自 shared-skills/theme 調色盤) */
export const categories: Category[] = [
  { id: "A", label: "認識 Claude Code", labelEn: "Meet Claude Code", color: "#0B84F3" },
  { id: "B", label: "專案與記憶", labelEn: "Project & Memory", color: "#D97757" },
  { id: "C", label: "規劃與控制", labelEn: "Plan & Control", color: "#8B5CF6" },
  { id: "D", label: "超能力 / 擴充", labelEn: "Superpowers", color: "#10B981" },
  { id: "E", label: "自動化與部署", labelEn: "Automate & Deploy", color: "#0EA5E9" },
  { id: "F", label: "安全與品質", labelEn: "Security & Quality", color: "#F43F5E" },
  { id: "G", label: "模型與成本", labelEn: "Models & Cost", color: "#F59E0B" },
];

export const nodes: MapNode[] = [
  // A. 認識 Claude Code
  {
    id: "claude-code",
    num: 1,
    category: "A",
    title: "Claude Code 是什麼",
    titleEn: "Claude Code",
    defShort:
      "一個 agentic coding 工具:會讀你的專案、改檔案、跑指令、串接你的開發工具;可在終端機、IDE、桌面 App、瀏覽器使用。",
    sourceUrl: "https://code.claude.com/docs/en/overview",
  },
  {
    id: "agentic-loop",
    num: 2,
    category: "A",
    title: "代理迴圈 Agentic loop",
    titleEn: "Agentic loop",
    defShort:
      "Claude Code 工作的三階段循環:收集情境(gather context)→ 採取行動(take action)→ 驗證結果(verify),由模型負責推理、工具負責動作。",
    sourceUrl: "https://code.claude.com/docs/en/how-claude-code-works",
  },
  {
    id: "interfaces",
    num: 3,
    category: "A",
    title: "在哪裡用",
    titleEn: "CLI / IDE / Desktop / Web",
    defShort:
      "同一個 Claude Code 引擎,可在終端機 CLI、VS Code / JetBrains 擴充、桌面 App、claude.ai/code 網頁上用;CLAUDE.md、設定、MCP 跨介面共用。",
    sourceUrl: "https://code.claude.com/docs/en/overview#use-claude-code-everywhere",
  },
  {
    id: "install-login",
    num: 4,
    category: "A",
    title: "安裝、登入與方案",
    titleEn: "Install, login & plans",
    defShort:
      "一行指令安裝,首次使用登入 Anthropic 帳號;需付費方案:Pro(年付約 US$17/月)起含 Claude Code,Max(US$100/月起)用量更多,Free 不含。",
    sourceUrl: "https://code.claude.com/docs/en/setup",
  },

  // B. 專案與記憶
  {
    id: "project-init",
    num: 5,
    category: "B",
    title: "開一個 Project + /init",
    titleEn: "Project & /init",
    defShort:
      "Claude Code 在你開的資料夾(專案)內工作;在新專案跑 /init 會分析程式碼並自動生成一份起始 CLAUDE.md。",
    sourceUrl: "https://code.claude.com/docs/en/quickstart",
  },
  {
    id: "claude-md",
    num: 6,
    category: "B",
    title: "CLAUDE.md 專案記憶",
    titleEn: "CLAUDE.md",
    defShort:
      "放在專案根目錄的 markdown 檔,Claude 每次開場都會讀進去;用來寫專案慣例、build 指令、「永遠要做 X」等持久指令。",
    sourceUrl: "https://code.claude.com/docs/en/memory",
  },
  {
    id: "auto-memory",
    num: 7,
    category: "B",
    title: "Auto memory 自動記憶",
    titleEn: "Auto memory",
    defShort:
      "Claude 自己邊做邊記的筆記(build 指令、除錯心得、你的偏好),存到 MEMORY.md;與你親手寫的 CLAUDE.md 互補。",
    sourceUrl: "https://code.claude.com/docs/en/memory#auto-memory",
  },
  {
    id: "settings",
    num: 8,
    category: "B",
    title: "settings.json 設定",
    titleEn: "settings.json",
    defShort:
      "Claude Code 的設定檔,可分使用者 / 專案 / 組織等層級;控制權限規則、環境變數、hooks、模型等。",
    sourceUrl: "https://code.claude.com/docs/en/settings",
  },

  // C. 規劃與控制
  {
    id: "prompting",
    num: 9,
    category: "C",
    title: "怎麼下指令",
    titleEn: "Prompt & verify",
    defShort:
      "講得越具體越好,並給它一個可驗證的目標(測試、預期輸出、截圖);複雜任務先探索再實作。",
    sourceUrl: "https://code.claude.com/docs/en/best-practices",
  },
  {
    id: "plan-mode",
    num: 10,
    category: "C",
    title: "Plan mode 計畫模式",
    titleEn: "Plan mode",
    defShort:
      "讓 Claude 先探索並提出計畫、但不動你的原始碼;你審完計畫再放行,適合複雜任務(Shift+Tab 切換)。",
    sourceUrl: "https://code.claude.com/docs/en/permission-modes",
  },
  {
    id: "permission-modes",
    num: 11,
    category: "C",
    title: "權限模式",
    titleEn: "Permission modes",
    defShort:
      "用 Shift+Tab 在 Default、Auto-accept edits、Plan mode、Auto mode 之間切;bypassPermissions 則跳過所有確認(慎用)。",
    sourceUrl: "https://code.claude.com/docs/en/permissions",
  },
  {
    id: "context-window",
    num: 12,
    category: "C",
    title: "Context window 上下文",
    titleEn: "Context window",
    defShort:
      "Claude 一次能記住的內容(對話、檔案、CLAUDE.md…);快滿時會自動壓縮(compaction),用 /context 看用量、/compact 或 /clear 整理。",
    sourceUrl: "https://code.claude.com/docs/en/context-window",
  },
  {
    id: "checkpoints",
    num: 13,
    category: "C",
    title: "Checkpoints 復原",
    titleEn: "Checkpoints",
    defShort:
      "每次改檔前都會快照,出錯按兩下 Esc 就能倒回上一個狀態;屬於 session 本地、和 git 分開,只涵蓋檔案變更。",
    sourceUrl: "https://code.claude.com/docs/en/how-claude-code-works#undo-changes-with-checkpoints",
  },
  {
    id: "slash-commands",
    num: 14,
    category: "C",
    title: "Slash commands 斜線指令",
    titleEn: "Slash commands",
    defShort:
      "用 / 開頭的指令操控 session,如 /init、/model、/clear、/compact、/agents;自訂指令現已併入 skills。",
    sourceUrl: "https://code.claude.com/docs/en/commands",
  },

  // D. 超能力 / 擴充
  {
    id: "tools",
    num: 15,
    category: "D",
    title: "Tools 工具",
    titleEn: "Tools",
    defShort:
      "讓 Claude 能「動作」而非只回字的能力,內建五類:檔案操作、搜尋、執行指令、上網、程式碼智慧。",
    sourceUrl: "https://code.claude.com/docs/en/how-claude-code-works#tools",
  },
  {
    id: "mcp",
    num: 16,
    category: "D",
    title: "MCP 連外部工具",
    titleEn: "MCP",
    defShort:
      "Model Context Protocol,連接 AI 與外部工具/資料的開放標準;接上後 Claude 能直接讀寫 Slack、Jira、Google Drive、資料庫等。",
    sourceUrl: "https://code.claude.com/docs/en/mcp",
  },
  {
    id: "skills",
    num: 17,
    category: "D",
    title: "Skills(Agent Skills)",
    titleEn: "Skills",
    defShort:
      "寫一個 SKILL.md 把可重複的流程/知識打包,Claude 需要時才動態載入(或用 /名稱 直接叫);省 context、提升一致性。",
    sourceUrl: "https://code.claude.com/docs/en/skills",
  },
  {
    id: "subagents",
    num: 18,
    category: "D",
    title: "Subagents 子代理",
    titleEn: "Subagents",
    defShort:
      "專責特定任務的子助手,各自有獨立的 context window、自訂系統提示與工具;把雜訊隔離在外、只回主對話一份摘要。",
    sourceUrl: "https://code.claude.com/docs/en/sub-agents",
  },
  {
    id: "hooks",
    num: 19,
    category: "D",
    title: "Hooks 鉤子",
    titleEn: "Hooks",
    defShort:
      "在 Claude Code 生命週期特定時點自動執行的 shell 指令(設定在 settings),確保某些動作「一定會發生」,如改檔後自動格式化。",
    sourceUrl: "https://code.claude.com/docs/en/hooks-guide",
  },
  {
    id: "plugins",
    num: 20,
    category: "D",
    title: "Plugins 外掛",
    titleEn: "Plugins",
    defShort:
      "把 skills、subagents、hooks、MCP 伺服器打包成可分享的單位,透過 marketplace 安裝給整個團隊用。",
    sourceUrl: "https://code.claude.com/docs/en/plugins",
  },

  // E. 自動化與部署
  {
    id: "headless",
    num: 21,
    category: "E",
    title: "Headless 非互動模式",
    titleEn: "Headless (claude -p)",
    defShort:
      "用 claude -p 在不開互動介面下跑單一任務,可把資料 pipe 進來、塞進 build 腳本或 CI,並取得結構化輸出。",
    sourceUrl: "https://code.claude.com/docs/en/headless",
  },
  {
    id: "loop-schedule",
    num: 22,
    category: "E",
    title: "/loop 與排程",
    titleEn: "/loop & scheduled tasks",
    defShort:
      "/loop 讓一個提示在 CLI session 內按間隔重複跑(輪詢用);也能設一次性提醒。",
    sourceUrl: "https://code.claude.com/docs/en/scheduled-tasks",
  },
  {
    id: "routines",
    num: 23,
    category: "E",
    title: "Routines 雲端自動跑",
    titleEn: "Routines",
    defShort:
      "把提示+儲存庫+連接器存成一份設定,跑在 Anthropic 雲端(電腦關機也會跑);可用排程 / API / GitHub 事件觸發,CLI 用 /schedule 建。",
    sourceUrl: "https://code.claude.com/docs/en/routines",
  },
  {
    id: "web",
    num: 24,
    category: "E",
    title: "Claude Code on the web",
    titleEn: "Claude Code on the web",
    defShort:
      "在瀏覽器跑 Claude Code、不用本機環境;每個 session 跑在隔離的 Anthropic 雲端 VM,適合長任務與沒在本機的 repo。",
    sourceUrl: "https://code.claude.com/docs/en/claude-code-on-the-web",
  },

  // F. 安全與品質
  {
    id: "security",
    num: 25,
    category: "F",
    title: "安全與權限架構",
    titleEn: "Security",
    defShort:
      "預設唯讀,要動手才請求授權;內建防 prompt injection、寫入只限工作資料夾、危險指令要核准等保護;最終你仍要審核它要跑的東西。",
    sourceUrl: "https://code.claude.com/docs/en/security",
  },
  {
    id: "sandboxing",
    num: 26,
    category: "F",
    title: "Sandboxing 沙箱隔離",
    titleEn: "Sandboxing",
    defShort:
      "用 /sandbox 對 Bash 指令做檔案系統與網路隔離,劃出 Claude 可自主工作的安全範圍,同時減少權限詢問。",
    sourceUrl: "https://code.claude.com/docs/en/sandboxing",
  },
  {
    id: "security-review",
    num: 27,
    category: "F",
    title: "Security review 外掛",
    titleEn: "Security guidance plugin",
    defShort:
      "官方外掛,讓 Claude 在 session 中自動審查並修正自己改動造成的漏洞(每次改檔 / 每回合結尾 / 每次提交時檢查)。",
    sourceUrl: "https://code.claude.com/docs/en/security-guidance",
  },
  {
    id: "code-review",
    num: 28,
    category: "F",
    title: "Code review / ultrareview",
    titleEn: "Code review",
    defShort:
      "在 PR 上自動跑程式碼審查並標出嚴重度;ultrareview 則是在雲端做更深入的多代理審查。",
    sourceUrl: "https://code.claude.com/docs/en/code-review",
  },

  // G. 模型與成本
  {
    id: "models",
    num: 29,
    category: "G",
    title: "模型 Models",
    titleEn: "Models",
    defShort:
      "用 /model 切換:sonnet(Sonnet 4.6,日常編碼)、opus(Opus 4.8,複雜推理)、haiku(快又省)、fable(Fable 5,最難最長的任務);opusplan 規劃用 Opus、執行切 Sonnet。",
    sourceUrl: "https://code.claude.com/docs/en/model-config",
  },
  {
    id: "costs",
    num: 30,
    category: "G",
    title: "成本與 /usage",
    titleEn: "Costs",
    defShort:
      "用 /usage 看用量與花費;省 token 的方法包括積極管理 context、挑對模型、把指令從 CLAUDE.md 移到 skills、把雜活交給 subagents。",
    sourceUrl: "https://code.claude.com/docs/en/costs",
  },
];

/** 跨分支的「互相作用」關係(每條都有 label) */
export const edges: MapEdge[] = [
  { from: "claude-md", to: "project-init", label: "存在專案裡" },
  { from: "auto-memory", to: "claude-md", label: "互補(它寫 vs 你寫)" },
  { from: "claude-md", to: "agentic-loop", label: "開場載入" },
  { from: "hooks", to: "settings", label: "設定於" },
  { from: "skills", to: "claude-md", label: "改放這(按需載入)" },
  { from: "skills", to: "mcp", label: "知識 vs 連線" },
  { from: "slash-commands", to: "skills", label: "自訂指令併入" },
  { from: "mcp", to: "tools", label: "提供更多" },
  { from: "tools", to: "agentic-loop", label: "驅動行動" },
  { from: "models", to: "agentic-loop", label: "負責推理" },
  { from: "subagents", to: "context-window", label: "各自獨立的" },
  { from: "subagents", to: "costs", label: "省 token" },
  { from: "plan-mode", to: "permission-modes", label: "屬於一種" },
  { from: "checkpoints", to: "permission-modes", label: "安全雙保險" },
  { from: "plugins", to: "skills", label: "打包分享" },
  { from: "headless", to: "routines", label: "促成自動化" },
  { from: "routines", to: "web", label: "跑在雲端" },
  { from: "routines", to: "loop-schedule", label: "雲端 vs 本機排程" },
  { from: "security-review", to: "security", label: "部署前先跑" },
  { from: "code-review", to: "security", label: "上線前把關" },
  { from: "sandboxing", to: "permission-modes", label: "減少詢問" },
];

/** 方便其他檔案查找 */
export const nodeById = (id: string): MapNode | undefined =>
  nodes.find((n) => n.id === id);

export const categoryById = (id: CategoryId): Category =>
  categories.find((c) => c.id === id)!;

/** 學習路徑(依 num 排序的節點 id),給「你在這 / 下一步」用 */
export const learningPath: string[] = [...nodes]
  .sort((a, b) => a.num - b.num)
  .map((n) => n.id);
