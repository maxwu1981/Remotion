import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP29 } from "./ThumbEP29";
import vo from "./ep29-vo.json";
import script from "./ep29-script.json";

const cfg: EpisodeCfg = {
  "ep": 29,
  "nodeId": "models",
  "nextNodeId": "costs",
  "hookBig": "換不同的腦",
  "hookSub": "models",
  "defCallout": "✦ /model 切換;opusplan=規劃 Opus、執行 Sonnet",
  "demoTitle": "四個別名",
  "points": [
    {
      "icon": "🟦",
      "title": "sonnet",
      "note": "Sonnet 4.6 日常"
    },
    {
      "icon": "🟪",
      "title": "opus",
      "note": "Opus 4.8 複雜推理"
    },
    {
      "icon": "⚡",
      "title": "haiku / fable",
      "note": "快省 / 最難最長"
    }
  ],
  "nextTitle": "EP30 · 成本與 /usage",
  "nextSub": "Costs"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP29: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep29" Thumb={ThumbEP29} />
);
export const ep29Frames = () => episodeFrames(VOM, SCR);
