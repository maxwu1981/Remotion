import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP25 } from "./ThumbEP25";
import vo from "./ep25-vo.json";
import script from "./ep25-script.json";

const cfg: EpisodeCfg = {
  "ep": 25,
  "nodeId": "security",
  "nextNodeId": "sandboxing",
  "hookBig": "讓 AI 跑指令安全嗎?",
  "hookSub": "security",
  "defCallout": "✦ 權限導向:預設唯讀,動手才請授權",
  "demoTitle": "內建保護",
  "points": [
    {
      "icon": "👁️",
      "title": "預設唯讀",
      "note": "動手才問"
    },
    {
      "icon": "🛡️",
      "title": "防注入",
      "note": "可疑指令需核准"
    },
    {
      "icon": "🔑",
      "title": "金鑰保護",
      "note": "放 env、別寫死"
    }
  ],
  "nextTitle": "EP26 · Sandboxing 沙箱隔離",
  "nextSub": "Sandboxing"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP25: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep25" Thumb={ThumbEP25} />
);
export const ep25Frames = () => episodeFrames(VOM, SCR);
