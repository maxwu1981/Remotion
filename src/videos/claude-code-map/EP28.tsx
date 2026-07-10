import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP28 } from "./ThumbEP28";
import vo from "./ep28-vo.json";
import script from "./ep28-script.json";

const cfg: EpisodeCfg = {
  "ep": 28,
  "nodeId": "code-review",
  "nextNodeId": "models",
  "hookBig": "品質怎麼把關?",
  "hookSub": "code review",
  "defCallout": "✦ PR 自動審查 + 嚴重度;ultrareview 更深",
  "demoTitle": "兩種審查",
  "points": [
    {
      "icon": "🔎",
      "title": "Code review",
      "note": "PR 自動把關"
    },
    {
      "icon": "🏷️",
      "title": "嚴重度標記",
      "note": "逐條 inline"
    },
    {
      "icon": "🧠",
      "title": "ultrareview",
      "note": "雲端多代理深審"
    }
  ],
  "nextTitle": "EP29 · 模型 Models",
  "nextSub": "Models"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP28: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep28" Thumb={ThumbEP28} />
);
export const ep28Frames = () => episodeFrames(VOM, SCR);
