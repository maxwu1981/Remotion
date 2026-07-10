#!/usr/bin/env node
// 為 EP03–EP30 產生 YouTube metadata(title/desc/tags)到 out/ytmeta/。
// hook/def 取自 epNN-script.json;標題/來源 URL 用下面的 map。
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vdir = join(root, "src", "videos", "claude-code-map");
const out = join(root, "out", "ytmeta");
if (!existsSync(out)) mkdirSync(out, { recursive: true });

const B = "https://code.claude.com/docs/en/";
const PLAYLIST = "https://www.youtube.com/playlist?list=PL4hZLWNunGZ0-JE9SyWad5PcwxE_nCZJt";
// ep → { title, url, tag(英文關鍵字) }
const M = {
  3:  ["在哪裡用:CLI / IDE / Desktop / Web", "overview#use-claude-code-everywhere", "VS Code,CLI,Desktop,Web"],
  4:  ["安裝、登入與方案", "setup", "安裝,Pro,Max,訂閱"],
  5:  ["開一個 Project + /init", "quickstart", "project,/init"],
  6:  ["CLAUDE.md 專案記憶", "memory", "CLAUDE.md,系統提示,memory"],
  7:  ["Auto memory 自動記憶", "memory#auto-memory", "auto memory,MEMORY.md"],
  8:  ["settings.json 設定", "settings", "settings.json,設定,權限"],
  9:  ["怎麼下指令(Prompt)", "best-practices", "prompt,下指令,best practices"],
  10: ["Plan mode 計畫模式", "permission-modes", "plan mode,計畫模式"],
  11: ["權限模式", "permissions", "權限,permission modes,bypass"],
  12: ["Context window 上下文", "context-window", "context window,上下文,compact"],
  13: ["Checkpoints 復原", "how-claude-code-works#undo-changes-with-checkpoints", "checkpoints,復原,rewind"],
  14: ["Slash commands 斜線指令", "commands", "slash commands,斜線指令"],
  15: ["Tools 工具", "how-claude-code-works#tools", "tools,工具"],
  16: ["MCP 連外部工具", "mcp", "MCP,Model Context Protocol,Gmail"],
  17: ["Skills(Agent Skills)", "skills", "skills,Agent Skills,SKILL.md"],
  18: ["Subagents 子代理", "sub-agents", "subagents,子代理"],
  19: ["Hooks 鉤子", "hooks-guide", "hooks,鉤子,自動化"],
  20: ["Plugins 外掛", "plugins", "plugins,外掛,marketplace"],
  21: ["Headless 非互動模式", "headless", "headless,claude -p,CI"],
  22: ["/loop 與排程", "scheduled-tasks", "/loop,排程,scheduled tasks"],
  23: ["Routines 雲端自動跑", "routines", "routines,排程,自動化"],
  24: ["Claude Code on the web", "claude-code-on-the-web", "web,雲端,claude.ai/code"],
  25: ["安全與權限架構", "security", "安全,security,prompt injection"],
  26: ["Sandboxing 沙箱隔離", "sandboxing", "sandboxing,沙箱,隔離"],
  27: ["Security review 外掛", "security-guidance", "security review,漏洞,安全審查"],
  28: ["Code review / ultrareview", "code-review", "code review,ultrareview,PR"],
  29: ["模型 Models", "model-config", "模型,Opus,Sonnet,Haiku,Fable"],
  30: ["成本與 /usage", "costs", "成本,/usage,省 token"],
};
const BASE_TAGS = "Claude Code,Claude Code 教學,Claude Code 新手,AI 自動化,Anthropic,AI agent,coding agent,claude code 中文";

let count = 0;
for (let ep = 3; ep <= 30; ep++) {
  const NN = String(ep).padStart(2, "0");
  const [title, urlPath, tag] = M[ep];
  const s = JSON.parse(readFileSync(join(vdir, `ep${NN}-script.json`), "utf8"));
  const url = B + urlPath;
  const desc = `${s.hook}

${s.def}

「Claude Code 新手地圖」系列第 ${ep} 站。跟著編號從 1 學到 30,每集一個名詞、附 Anthropic 官方文件出處。

📚 來源:${url}
▶ 系列播放清單:${PLAYLIST}

#ClaudeCode #AI自動化 #新手教學 #Anthropic #AIagent
`;
  writeFileSync(join(out, `ep${NN}-title.txt`), `EP${NN} · ${title} — Claude Code 新手地圖`);
  writeFileSync(join(out, `ep${NN}-desc.txt`), desc);
  writeFileSync(join(out, `ep${NN}-tags.txt`), `${BASE_TAGS},${tag}`);
  count++;
}
console.log(`✓ 產生 ${count} 集 metadata → out/ytmeta/`);
