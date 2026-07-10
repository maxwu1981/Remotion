import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP23 } from "./ThumbEP23";
import vo from "./ep23-vo.json";
import script from "./ep23-script.json";

const cfg: EpisodeCfg = {
  "ep": 23,
  "nodeId": "routines",
  "nextNodeId": "web",
  "hookBig": "讓它每天自己跑",
  "hookSub": "Routines",
  "defCallout": "✦ 跑在 Anthropic 雲端,電腦關機也跑",
  "demoTitle": "三種觸發",
  "points": [
    {
      "icon": "⏱️",
      "title": "排程",
      "note": "每天/每週"
    },
    {
      "icon": "🔗",
      "title": "API",
      "note": "HTTP 觸發"
    },
    {
      "icon": "🐙",
      "title": "GitHub 事件",
      "note": "如開 PR"
    }
  ],
  "nextTitle": "EP24 · Claude Code on the web",
  "nextSub": "Claude Code on the web"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP23: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep23" Thumb={ThumbEP23} />
);
export const ep23Frames = () => episodeFrames(VOM, SCR);
