import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP19 } from "./ThumbEP19";
import vo from "./ep19-vo.json";
import script from "./ep19-script.json";

const cfg: EpisodeCfg = {
  "ep": 19,
  "nodeId": "hooks",
  "nextNodeId": "plugins",
  "hookBig": "拜託 vs 保證",
  "hookSub": "hooks",
  "defCallout": "✦ 時間點一到「一定執行」,不靠 AI 自己想到",
  "demoTitle": "Hooks 用途",
  "points": [
    {
      "icon": "🎨",
      "title": "改檔後格式化",
      "note": "自動"
    },
    {
      "icon": "🧪",
      "title": "提交前 lint",
      "note": "把關"
    },
    {
      "icon": "🔔",
      "title": "等你時通知",
      "note": "不用盯著終端機"
    }
  ],
  "nextTitle": "EP20 · Plugins 外掛",
  "nextSub": "Plugins"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP19: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep19" Thumb={ThumbEP19} />
);
export const ep19Frames = () => episodeFrames(VOM, SCR);
