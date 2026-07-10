import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP10 } from "./ThumbEP10";
import vo from "./ep10-vo.json";
import script from "./ep10-script.json";

const cfg: EpisodeCfg = {
  "ep": 10,
  "nodeId": "plan-mode",
  "nextNodeId": "permission-modes",
  "hookBig": "怕它一上來就亂改?",
  "hookSub": "plan mode",
  "defCallout": "✦ 只規劃、不改原始碼;審過再放行",
  "demoTitle": "Plan mode 流程",
  "points": [
    {
      "icon": "🔍",
      "title": "探索",
      "note": "讀專案、不動手"
    },
    {
      "icon": "📝",
      "title": "提計畫",
      "note": "要改什麼、怎麼測"
    },
    {
      "icon": "👍",
      "title": "你核可",
      "note": "才開始執行"
    }
  ],
  "nextTitle": "EP11 · 權限模式",
  "nextSub": "Permission modes"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP10: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep10" Thumb={ThumbEP10} />
);
export const ep10Frames = () => episodeFrames(VOM, SCR);
