import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP06 } from "./ThumbEP06";
import vo from "./ep06-vo.json";
import script from "./ep06-script.json";

const cfg: EpisodeCfg = {
  "ep": 6,
  "nodeId": "claude-md",
  "nextNodeId": "auto-memory",
  "hookBig": "別每次都重講一遍",
  "hookSub": "CLAUDE.md",
  "defCallout": "✦ 每次開場必讀 · 寫具體、200 行內最聽話",
  "demoTitle": "該寫什麼",
  "points": [
    {
      "icon": "📐",
      "title": "慣例與結構",
      "note": "命名、檔案放哪"
    },
    {
      "icon": "🔧",
      "title": "build / 測試指令",
      "note": "常用指令"
    },
    {
      "icon": "📌",
      "title": "永遠要做 X",
      "note": "持久規則"
    }
  ],
  "nextTitle": "EP07 · Auto memory 自動記憶",
  "nextSub": "Auto memory"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP06: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep06" Thumb={ThumbEP06} />
);
export const ep06Frames = () => episodeFrames(VOM, SCR);
