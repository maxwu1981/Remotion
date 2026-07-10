import React from "react";
import { AbsoluteFill } from "remotion";
import spec from "../_explainer/specs/auto-course-ep01.json";
import voManifest from "../_explainer/specs/auto-course-ep01.vo.json";
import type { VideoSpec } from "../_explainer/schema";
import { WhiteBg } from "../_explainer/obsidian-glass";
import { RealFootageScene, realFootageSceneDuration } from "./RealFootageScene";

/**
 * ⚠️ 暫時測試用 comp，驗證「真人錄影 playbackRate 伸縮貼合旁白」節奏策略是否自然。
 * 老闆看過確認節奏後即可刪除，正式版會把 RealFootageScene 接進 Obsidian.tsx 主時間軸。
 */
const SPEC = spec as unknown as VideoSpec;
const VO = voManifest as Record<string, number>;
const CH4_CUES = Array.from({ length: 26 }, (_, i) => `c4-${String(i + 1).padStart(2, "0")}`); // c4-01~26 = Mac 真人錄影段；c4-27~42 是 Windows 重建段+收尾，不用真實影片

export const autoCourseEp01Ch4TestFrames = () => realFootageSceneDuration(CH4_CUES, SPEC, VO);

export const AutoCourseEp01Ch4Test: React.FC = () => (
  <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
    <WhiteBg />
    <RealFootageScene
      spec={SPEC}
      vo={VO}
      voDir="vo/auto-course-ep01"
      videoSrc="footage/auto-course-ep01/ch4-mac-install-clean.mp4"
      videoNativeDurationSec={163}
      cueIds={CH4_CUES}
      kicker="CH4 · Mac 安裝實錄"
      accent="green"
    />
  </AbsoluteFill>
);
