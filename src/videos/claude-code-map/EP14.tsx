import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP14 } from "./ThumbEP14";
import vo from "./ep14-vo.json";
import script from "./ep14-script.json";

const cfg: EpisodeCfg = {
  "ep": 14,
  "nodeId": "slash-commands",
  "nextNodeId": "tools",
  "hookBig": "那些斜線指令",
  "hookSub": "slash commands",
  "defCallout": "✦ 自訂指令已併入 skills",
  "demoTitle": "必學指令",
  "points": [
    {
      "icon": "✨",
      "title": "/init · /clear",
      "note": "起步 · 清空"
    },
    {
      "icon": "🗜️",
      "title": "/compact",
      "note": "壓縮上下文"
    },
    {
      "icon": "🔄",
      "title": "/model · /usage",
      "note": "換模型 · 看用量"
    }
  ],
  "nextTitle": "EP15 · Tools 工具",
  "nextSub": "Tools"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP14: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep14" Thumb={ThumbEP14} />
);
export const ep14Frames = () => episodeFrames(VOM, SCR);
