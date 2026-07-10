import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP07 } from "./ThumbEP07";
import vo from "./ep07-vo.json";
import script from "./ep07-script.json";

const cfg: EpisodeCfg = {
  "ep": 7,
  "nodeId": "auto-memory",
  "nextNodeId": "settings",
  "hookBig": "它會自己記筆記",
  "hookSub": "auto memory",
  "defCallout": "✦ 它寫 vs 你寫的 CLAUDE.md,互補",
  "demoTitle": "它會記什麼",
  "points": [
    {
      "icon": "🧠",
      "title": "build 指令",
      "note": "怎麼跑這專案"
    },
    {
      "icon": "🐞",
      "title": "除錯心得",
      "note": "踩過的雷"
    },
    {
      "icon": "❤️",
      "title": "你的偏好",
      "note": "如用 pnpm 不用 npm"
    }
  ],
  "nextTitle": "EP08 · settings.json 設定",
  "nextSub": "settings.json"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP07: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep07" Thumb={ThumbEP07} />
);
export const ep07Frames = () => episodeFrames(VOM, SCR);
