import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP18 } from "./ThumbEP18";
import vo from "./ep18-vo.json";
import script from "./ep18-script.json";

const cfg: EpisodeCfg = {
  "ep": 18,
  "nodeId": "subagents",
  "nextNodeId": "hooks",
  "hookBig": "雜活塞爆主對話?",
  "hookSub": "subagents",
  "defCallout": "✦ 獨立 context,只回摘要;省 token",
  "demoTitle": "Subagent 好處",
  "points": [
    {
      "icon": "🧰",
      "title": "獨立 context",
      "note": "雜訊不塞主對話"
    },
    {
      "icon": "📋",
      "title": "只回摘要",
      "note": "主線乾淨"
    },
    {
      "icon": "💸",
      "title": "省成本",
      "note": "可用 Haiku 跑"
    }
  ],
  "nextTitle": "EP19 · Hooks 鉤子",
  "nextSub": "Hooks"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP18: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep18" Thumb={ThumbEP18} />
);
export const ep18Frames = () => episodeFrames(VOM, SCR);
