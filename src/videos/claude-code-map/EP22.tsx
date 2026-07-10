import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP22 } from "./ThumbEP22";
import vo from "./ep22-vo.json";
import script from "./ep22-script.json";

const cfg: EpisodeCfg = {
  "ep": 22,
  "nodeId": "loop-schedule",
  "nextNodeId": "routines",
  "hookBig": "每隔一段做一次",
  "hookSub": "/loop",
  "defCallout": "✦ 本機 · session 內 · 關了就停",
  "demoTitle": "/loop 適合",
  "points": [
    {
      "icon": "🔁",
      "title": "按間隔重複",
      "note": "session 內輪詢"
    },
    {
      "icon": "⏰",
      "title": "一次性提醒",
      "note": "稍後做某事"
    },
    {
      "icon": "💻",
      "title": "本機",
      "note": "關了就停"
    }
  ],
  "nextTitle": "EP23 · Routines 雲端自動跑",
  "nextSub": "Routines"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP22: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep22" Thumb={ThumbEP22} />
);
export const ep22Frames = () => episodeFrames(VOM, SCR);
