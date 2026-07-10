import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP13 } from "./ThumbEP13";
import vo from "./ep13-vo.json";
import script from "./ep13-script.json";

const cfg: EpisodeCfg = {
  "ep": 13,
  "nodeId": "checkpoints",
  "nextNodeId": "slash-commands",
  "hookBig": "改壞了怎麼救?",
  "hookSub": "checkpoints",
  "defCallout": "✦ session 本地、與 git 分開、只涵蓋檔案",
  "demoTitle": "Checkpoints",
  "points": [
    {
      "icon": "📸",
      "title": "改檔前快照",
      "note": "自動"
    },
    {
      "icon": "⎋",
      "title": "按兩下 Esc",
      "note": "倒回上一狀態"
    },
    {
      "icon": "🚫",
      "title": "外部動作不可倒",
      "note": "所以會先問你"
    }
  ],
  "nextTitle": "EP14 · Slash commands 斜線指令",
  "nextSub": "Slash commands"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP13: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep13" Thumb={ThumbEP13} />
);
export const ep13Frames = () => episodeFrames(VOM, SCR);
