#!/usr/bin/env node
// 從 episodes.config.mjs 產生 EPxx.tsx / ThumbEPxx.tsx / generatedEpisodes.ts
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { EPISODES } from "../src/videos/claude-code-map/episodes.config.mjs";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "videos", "claude-code-map");

// 縮圖兩行(精簡有力)
const THUMB = {
  4: ["怎麼裝?", "要付費嗎"], 5: ["開一個", "Project"], 6: ["CLAUDE.md", "專案記憶"],
  7: ["它自己", "記筆記"], 8: ["settings", "設定檔"], 9: ["怎麼", "下指令"],
  10: ["Plan mode", "先計畫"], 11: ["權限", "模式"], 12: ["Context", "上下文"],
  13: ["改錯了", "一鍵還原"], 14: ["斜線", "指令"], 15: ["Tools", "工具"],
  16: ["MCP", "連外部工具"], 17: ["Skills", "技能"], 18: ["Subagents", "子代理"],
  19: ["Hooks", "鉤子"], 20: ["Plugins", "外掛"], 21: ["Headless", "非互動"],
  22: ["/loop", "排程"], 23: ["Routines", "雲端自動跑"], 24: ["雲端", "Web 版"],
  25: ["安全", "架構"], 26: ["Sandbox", "沙箱"], 27: ["自己", "抓漏洞"],
  28: ["Code", "Review"], 29: ["模型", "怎麼選"], 30: ["成本", "怎麼省"],
};

// 節點 → 大類(高亮用):依 tree.ts 章節
const CAT = {
  4: "A", 5: "B", 6: "B", 7: "B", 8: "B", 9: "C", 10: "C", 11: "C", 12: "C", 13: "C", 14: "C",
  15: "D", 16: "D", 17: "D", 18: "D", 19: "D", 20: "D", 21: "E", 22: "E", 23: "E", 24: "E",
  25: "F", 26: "F", 27: "F", 28: "F", 29: "G", 30: "G",
};

const reg = [];
for (const e of EPISODES) {
  const NN = String(e.ep).padStart(2, "0");
  const id = `ep${NN}`;
  const cfg = {
    ep: e.ep, nodeId: e.nodeId, nextNodeId: e.nextNodeId,
    hookBig: e.hookBig, hookSub: e.hookSub, defCallout: e.defCallout,
    demoTitle: e.demoTitle, points: e.points, nextTitle: e.nextTitle, nextSub: e.nextSub,
  };
  // EPxx.tsx
  writeFileSync(join(dir, `EP${NN}.tsx`), `import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP${NN} } from "./ThumbEP${NN}";
import vo from "./${id}-vo.json";
import script from "./${id}-script.json";

const cfg: EpisodeCfg = ${JSON.stringify(cfg, null, 2)};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP${NN}: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-${id}" Thumb={ThumbEP${NN}} />
);
export const ep${NN}Frames = () => episodeFrames(VOM, SCR);
`);
  // ThumbEPxx.tsx
  const [l1, l2] = THUMB[e.ep];
  writeFileSync(join(dir, `ThumbEP${NN}.tsx`), `import React from "react";
import { SeriesThumb } from "./SeriesThumb";

export const ThumbEP${NN}: React.FC = () => (
  <SeriesThumb ep="EP${NN}" epLabel="第 ${e.ep} 站" bigNum="${e.ep}" line1="${l1}" line2="${l2}" highlightCat="${CAT[e.ep]}" />
);
`);
  reg.push({ NN, id, ep: e.ep });
}

// generatedEpisodes.ts
const imports = reg
  .map((r) => `import { EP${r.NN}, ep${r.NN}Frames } from "./EP${r.NN}";\nimport { ThumbEP${r.NN} } from "./ThumbEP${r.NN}";`)
  .join("\n");
const arr = reg
  .map((r) => `  { id: "ClaudeCodeMapEP${r.NN}", thumbId: "ClaudeCodeMapEP${r.NN}Thumb", Comp: EP${r.NN}, getFrames: ep${r.NN}Frames, Thumb: ThumbEP${r.NN} },`)
  .join("\n");
writeFileSync(join(dir, "generatedEpisodes.ts"), `// 自動產生(scripts/gen-ep-tsx.mjs)。EP04–EP30 影片 + 縮圖 registry。
import React from "react";
${imports}

export type GenEp = { id: string; thumbId: string; Comp: React.FC; getFrames: () => number; Thumb: React.FC };
export const GENERATED_EPISODES: GenEp[] = [
${arr}
];
`);

console.log(`✓ 產生 ${reg.length} 集 EPxx.tsx + ThumbEPxx.tsx + generatedEpisodes.ts`);
