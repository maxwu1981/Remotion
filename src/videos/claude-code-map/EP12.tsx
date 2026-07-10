import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP12 } from "./ThumbEP12";
import vo from "./ep12-vo.json";
import script from "./ep12-script.json";

const cfg: EpisodeCfg = {
  "ep": 12,
  "nodeId": "context-window",
  "nextNodeId": "checkpoints",
  "hookBig": "它好像忘了前面",
  "hookSub": "context window",
  "defCallout": "✦ /context 看用量 · /compact 壓縮 · /clear 清空",
  "demoTitle": "三個指令",
  "points": [
    {
      "icon": "📊",
      "title": "/context",
      "note": "看用掉多少"
    },
    {
      "icon": "🗜️",
      "title": "/compact",
      "note": "壓縮保留重點"
    },
    {
      "icon": "🧹",
      "title": "/clear",
      "note": "清空重開"
    }
  ],
  "nextTitle": "EP13 · Checkpoints 復原",
  "nextSub": "Checkpoints"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP12: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep12" Thumb={ThumbEP12} />
);
export const ep12Frames = () => episodeFrames(VOM, SCR);
