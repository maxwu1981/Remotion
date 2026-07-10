import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP09 } from "./ThumbEP09";
import vo from "./ep09-vo.json";
import script from "./ep09-script.json";

const cfg: EpisodeCfg = {
  "ep": 9,
  "nodeId": "prompting",
  "nextNodeId": "plan-mode",
  "hookBig": "用得神 vs 用得爛",
  "hookSub": "prompt & verify",
  "defCallout": "✦ 給「可驗證目標」成功率最高",
  "demoTitle": "三個要點",
  "points": [
    {
      "icon": "🎯",
      "title": "講具體",
      "note": "指明檔案、限制、範例"
    },
    {
      "icon": "✅",
      "title": "可驗證目標",
      "note": "測試 / 預期輸出 / 截圖"
    },
    {
      "icon": "🔭",
      "title": "先探索再實作",
      "note": "複雜任務尤其"
    }
  ],
  "nextTitle": "EP10 · Plan mode 計畫模式",
  "nextSub": "Plan mode"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP09: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep09" Thumb={ThumbEP09} />
);
export const ep09Frames = () => episodeFrames(VOM, SCR);
