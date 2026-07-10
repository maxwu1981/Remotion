import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP21 } from "./ThumbEP21";
import vo from "./ep21-vo.json";
import script from "./ep21-script.json";

const cfg: EpisodeCfg = {
  "ep": 21,
  "nodeId": "headless",
  "nextNodeId": "loop-schedule",
  "hookBig": "不用人坐前面也能跑",
  "hookSub": "claude -p",
  "defCallout": "✦ 可 pipe、塞進 CI、取得 JSON 輸出",
  "demoTitle": "headless 用法",
  "points": [
    {
      "icon": "⌨️",
      "title": "claude -p",
      "note": "非互動單次"
    },
    {
      "icon": "🔗",
      "title": "pipe / CI",
      "note": "串進腳本"
    },
    {
      "icon": "📦",
      "title": "結構化輸出",
      "note": "JSON 給程式接"
    }
  ],
  "nextTitle": "EP22 · /loop 與排程",
  "nextSub": "/loop & scheduled tasks"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP21: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep21" Thumb={ThumbEP21} />
);
export const ep21Frames = () => episodeFrames(VOM, SCR);
