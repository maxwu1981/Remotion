import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP20 } from "./ThumbEP20";
import vo from "./ep20-vo.json";
import script from "./ep20-script.json";

const cfg: EpisodeCfg = {
  "ep": 20,
  "nodeId": "plugins",
  "nextNodeId": "headless",
  "hookBig": "怎麼分享你的設定?",
  "hookSub": "plugins",
  "defCallout": "✦ 一個指令安裝整套設定",
  "demoTitle": "Plugin 裝什麼",
  "points": [
    {
      "icon": "📦",
      "title": "打包",
      "note": "skills/hooks/MCP"
    },
    {
      "icon": "🏪",
      "title": "marketplace",
      "note": "官方或社群"
    },
    {
      "icon": "👥",
      "title": "團隊共用",
      "note": "不用各自重設"
    }
  ],
  "nextTitle": "EP21 · Headless 非互動模式",
  "nextSub": "Headless (claude -p)"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP20: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep20" Thumb={ThumbEP20} />
);
export const ep20Frames = () => episodeFrames(VOM, SCR);
