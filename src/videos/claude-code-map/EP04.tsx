import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP04 } from "./ThumbEP04";
import vo from "./ep04-vo.json";
import script from "./ep04-script.json";

const cfg: EpisodeCfg = {
  "ep": 4,
  "nodeId": "install-login",
  "nextNodeId": "project-init",
  "hookBig": "怎麼裝?要花錢嗎?",
  "hookSub": "install · login · plans",
  "defCallout": "✦ 新手選 Pro 就夠,Free 不含 Claude Code",
  "demoTitle": "三種方案",
  "points": [
    {
      "icon": "🆓",
      "title": "Free",
      "note": "不含 Claude Code"
    },
    {
      "icon": "✅",
      "title": "Pro",
      "note": "年付約 US$17/月,含 Claude Code"
    },
    {
      "icon": "🚀",
      "title": "Max",
      "note": "US$100/月起,用量更多"
    }
  ],
  "nextTitle": "EP05 · 開一個 Project + /init",
  "nextSub": "Project & /init"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP04: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep04" Thumb={ThumbEP04} />
);
export const ep04Frames = () => episodeFrames(VOM, SCR);
