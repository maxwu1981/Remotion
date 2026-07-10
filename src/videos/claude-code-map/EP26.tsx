import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP26 } from "./ThumbEP26";
import vo from "./ep26-vo.json";
import script from "./ep26-script.json";

const cfg: EpisodeCfg = {
  "ep": 26,
  "nodeId": "sandboxing",
  "nextNodeId": "security-review",
  "hookBig": "放手又怕亂跑?",
  "hookSub": "sandboxing",
  "defCallout": "✦ OS 級隔離,自主工作又少打擾",
  "demoTitle": "沙箱 = 安全範圍",
  "points": [
    {
      "icon": "📦",
      "title": "檔案隔離",
      "note": "碰不到範圍外"
    },
    {
      "icon": "🌐",
      "title": "網路隔離",
      "note": "限制連線"
    },
    {
      "icon": "🙂",
      "title": "少問你",
      "note": "範圍內自主跑"
    }
  ],
  "nextTitle": "EP27 · Security review 外掛",
  "nextSub": "Security guidance plugin"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP26: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep26" Thumb={ThumbEP26} />
);
export const ep26Frames = () => episodeFrames(VOM, SCR);
