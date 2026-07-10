import React from "react";
import { NodeEpisode, episodeFrames, type EpisodeCfg } from "./NodeEpisode";
import { ThumbEP15 } from "./ThumbEP15";
import vo from "./ep15-vo.json";
import script from "./ep15-script.json";

const cfg: EpisodeCfg = {
  "ep": 15,
  "nodeId": "tools",
  "nextNodeId": "mcp",
  "hookBig": "不只會講,還能做",
  "hookSub": "tools",
  "defCallout": "✦ 五類內建工具,驅動代理迴圈的「行動」",
  "demoTitle": "五類工具",
  "points": [
    {
      "icon": "📄",
      "title": "檔案 / 搜尋",
      "note": "讀寫、找程式"
    },
    {
      "icon": "▶",
      "title": "執行",
      "note": "shell、測試、git"
    },
    {
      "icon": "🌐",
      "title": "上網 / 程式智慧",
      "note": "查資料、型別檢查"
    }
  ],
  "nextTitle": "EP16 · MCP 連外部工具",
  "nextSub": "MCP"
};
const VOM = vo as Record<string, number>;
const SCR = script as Record<string, string>;

export const EP15: React.FC = () => (
  <NodeEpisode cfg={cfg} vo={VOM} script={SCR} voDir="vo/claude-code-map-ep15" Thumb={ThumbEP15} />
);
export const ep15Frames = () => episodeFrames(VOM, SCR);
