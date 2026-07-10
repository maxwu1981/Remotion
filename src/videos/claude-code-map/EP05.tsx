import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP05 } from "./ThumbEP05";
import vo from "./ep05-vo.json";
import script from "./ep05-script.json";

const cfg: EpisodeCfg = {
  "ep": 5,
  "nodeId": "project-init",
  "nextNodeId": "claude-md",
  "hookBig": "它一定要待在一個專案裡",
  "hookSub": "project & /init",
  "defCallout": "✦ /init = 自動生成起始 CLAUDE.md",
  "demoTitle": "開專案三步",
  "points": [
    {
      "icon": "📁",
      "title": "開資料夾",
      "note": "Claude Code 以它為家"
    },
    {
      "icon": "⌨️",
      "title": "claude",
      "note": "在資料夾內啟動"
    },
    {
      "icon": "✨",
      "title": "/init",
      "note": "自動生成 CLAUDE.md"
    }
  ],
  "nextTitle": "EP06 · CLAUDE.md 專案記憶",
  "nextSub": "CLAUDE.md"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP05: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep05" Thumb={ThumbEP05} />
);
export const ep05Frames = () => episodeFrames(VOM, SCR);
