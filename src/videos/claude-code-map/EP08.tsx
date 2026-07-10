import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP08 } from "./ThumbEP08";
import vo from "./ep08-vo.json";
import script from "./ep08-script.json";

const cfg: EpisodeCfg = {
  "ep": 8,
  "nodeId": "settings",
  "nextNodeId": "prompting",
  "hookBig": "建議 vs 強制",
  "hookSub": "settings.json",
  "defCallout": "✦ settings=強制執行 · CLAUDE.md=行為建議",
  "demoTitle": "settings 管什麼",
  "points": [
    {
      "icon": "🔐",
      "title": "權限規則",
      "note": "哪些指令免問可跑"
    },
    {
      "icon": "🗝️",
      "title": "環境變數",
      "note": "金鑰別寫死"
    },
    {
      "icon": "🪝",
      "title": "hooks / 模型",
      "note": "自動化與預設"
    }
  ],
  "nextTitle": "EP09 · 怎麼下指令",
  "nextSub": "Prompt & verify"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP08: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep08" Thumb={ThumbEP08} />
);
export const ep08Frames = () => episodeFrames(VOM, SCR);
