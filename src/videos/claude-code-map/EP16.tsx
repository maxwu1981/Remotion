import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP16 } from "./ThumbEP16";
import vo from "./ep16-vo.json";
import script from "./ep16-script.json";

const cfg: EpisodeCfg = {
  "ep": 16,
  "nodeId": "mcp",
  "nextNodeId": "skills",
  "hookBig": "怎麼連 Gmail、Slack?",
  "hookSub": "MCP",
  "defCallout": "✦ 連外部工具/資料的開放標準",
  "demoTitle": "MCP 能做什麼",
  "points": [
    {
      "icon": "🔌",
      "title": "接一次",
      "note": "連上整個服務"
    },
    {
      "icon": "📥",
      "title": "讀資料",
      "note": "Slack / Jira / Drive"
    },
    {
      "icon": "📤",
      "title": "做動作",
      "note": "建草稿、寄信、查 DB"
    }
  ],
  "nextTitle": "EP17 · Skills(Agent Skills)",
  "nextSub": "Skills"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP16: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep16" Thumb={ThumbEP16} />
);
export const ep16Frames = () => episodeFrames(VOM, SCR);
