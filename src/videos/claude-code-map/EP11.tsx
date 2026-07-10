import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP11 } from "./ThumbEP11";
import vo from "./ep11-vo.json";
import script from "./ep11-script.json";

const cfg: EpisodeCfg = {
  "ep": 11,
  "nodeId": "permission-modes",
  "nextNodeId": "context-window",
  "hookBig": "每步都問,還是放手跑?",
  "hookSub": "permission modes",
  "defCallout": "✦ bypass 跳過所有確認,只在自動化場景謹慎用",
  "demoTitle": "四種模式",
  "points": [
    {
      "icon": "🙋",
      "title": "Default",
      "note": "改檔、跑指令前先問"
    },
    {
      "icon": "⚡",
      "title": "Auto-accept",
      "note": "自動接受改檔"
    },
    {
      "icon": "🛡️",
      "title": "Plan / Auto",
      "note": "只規劃 / 背景安全檢查"
    }
  ],
  "nextTitle": "EP12 · Context window 上下文",
  "nextSub": "Context window"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP11: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep11" Thumb={ThumbEP11} />
);
export const ep11Frames = () => episodeFrames(VOM, SCR);
