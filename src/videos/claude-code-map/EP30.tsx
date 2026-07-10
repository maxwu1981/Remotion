import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP30 } from "./ThumbEP30";
import vo from "./ep30-vo.json";
import script from "./ep30-script.json";

const cfg: EpisodeCfg = {
  "ep": 30,
  "nodeId": "costs",
  "nextNodeId": null,
  "hookBig": "到底花多少?怎麼省?",
  "hookSub": "costs",
  "defCallout": "✦ /usage 看花費;挑對模型 + 管理 context 最有效",
  "demoTitle": "省 token 五招",
  "points": [
    {
      "icon": "📊",
      "title": "/usage",
      "note": "看用量花費"
    },
    {
      "icon": "🧠",
      "title": "挑對模型",
      "note": "日常用 sonnet/haiku"
    },
    {
      "icon": "🧹",
      "title": "管理 context",
      "note": "skills + subagents"
    }
  ],
  "nextTitle": "EP31 · 系列回顧",
  "nextSub": "把整張地圖走一遍"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP30: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep30" Thumb={ThumbEP30} />
);
export const ep30Frames = () => episodeFrames(VOM, SCR);
