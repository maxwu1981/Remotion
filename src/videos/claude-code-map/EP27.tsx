import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP27 } from "./ThumbEP27";
import vo from "./ep27-vo.json";
import script from "./ep27-script.json";

const cfg: EpisodeCfg = {
  "ep": 27,
  "nodeId": "security-review",
  "nextNodeId": "code-review",
  "hookBig": "你的 code 有漏洞嗎?",
  "hookSub": "security review",
  "defCallout": "✦ 改檔/回合結尾/提交時自動掃漏洞",
  "demoTitle": "三個檢查時機",
  "points": [
    {
      "icon": "✏️",
      "title": "每次改檔",
      "note": "即時"
    },
    {
      "icon": "🔚",
      "title": "每回合結尾",
      "note": "收尾檢查"
    },
    {
      "icon": "📤",
      "title": "每次提交",
      "note": "上版前"
    }
  ],
  "nextTitle": "EP28 · Code review / ultrareview",
  "nextSub": "Code review"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP27: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep27" Thumb={ThumbEP27} />
);
export const ep27Frames = () => episodeFrames(VOM, SCR);
