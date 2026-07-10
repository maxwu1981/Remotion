import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP24 } from "./ThumbEP24";
import vo from "./ep24-vo.json";
import script from "./ep24-script.json";

const cfg: EpisodeCfg = {
  "ep": 24,
  "nodeId": "web",
  "nextNodeId": "security",
  "hookBig": "雲端長什麼樣?",
  "hookSub": "claude.ai/code",
  "defCallout": "✦ 隔離雲端 VM · 免本機 · 長任務/平行",
  "demoTitle": "雲端版適合",
  "points": [
    {
      "icon": "🌐",
      "title": "免本機",
      "note": "瀏覽器就能跑"
    },
    {
      "icon": "⏳",
      "title": "長任務",
      "note": "丟著去做別的"
    },
    {
      "icon": "🧪",
      "title": "隔離 VM",
      "note": "每 session 獨立"
    }
  ],
  "nextTitle": "EP25 · 安全與權限架構",
  "nextSub": "Security"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP24: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep24" Thumb={ThumbEP24} />
);
export const ep24Frames = () => episodeFrames(VOM, SCR);
