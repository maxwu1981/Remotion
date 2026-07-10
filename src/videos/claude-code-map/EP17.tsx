import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP17 } from "./ThumbEP17";
import vo from "./ep17-vo.json";
import script from "./ep17-script.json";

const cfg: EpisodeCfg = {
  "ep": 17,
  "nodeId": "skills",
  "nextNodeId": "subagents",
  "hookBig": "一直貼同一段指示?",
  "hookSub": "skills",
  "defCallout": "✦ 用到才載入,放再多參考也幾乎不花 context",
  "demoTitle": "Skill 重點",
  "points": [
    {
      "icon": "📦",
      "title": "SKILL.md",
      "note": "打包流程/知識"
    },
    {
      "icon": "⚡",
      "title": "動態載入",
      "note": "需要時才讀"
    },
    {
      "icon": "🆚",
      "title": "vs MCP",
      "note": "知識 vs 連線"
    }
  ],
  "nextTitle": "EP18 · Subagents 子代理",
  "nextSub": "Subagents"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP17: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep17" Thumb={ThumbEP17} />
);
export const ep17Frames = () => episodeFrames(VOM, SCR);
