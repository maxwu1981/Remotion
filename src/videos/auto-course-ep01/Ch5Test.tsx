import React from "react";
import { AbsoluteFill } from "remotion";
import spec from "../_explainer/specs/auto-course-ep01.json";
import voManifest from "../_explainer/specs/auto-course-ep01.vo.json";
import type { VideoSpec } from "../_explainer/schema";
import { WhiteBg } from "../_explainer/obsidian-glass";
import { RealFootageScene, realFootageSceneDuration } from "./RealFootageScene";

/**
 * ⚠️ 暫時測試用 comp，驗證 CH5 真人錄影節奏，老闆看過確認後可刪。
 * c5-16~33＝claude 啟動→分類→整理計畫→完成清單→Finder 驗收，對應乾淨合成素材 ch5-walkthrough-clean.mp4。
 * c5-01~15（悲劇留言+資料夾/檔案準備+cd）不在這段真人錄影裡，之後另外處理。
 */
const SPEC = spec as unknown as VideoSpec;
const VO = voManifest as Record<string, number>;
const CH5_CUES = Array.from({ length: 18 }, (_, i) => `c5-${String(i + 16).padStart(2, "0")}`);

export const autoCourseEp01Ch5TestFrames = () => realFootageSceneDuration(CH5_CUES, SPEC, VO);

export const AutoCourseEp01Ch5Test: React.FC = () => (
  <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
    <WhiteBg />
    <RealFootageScene
      spec={SPEC}
      vo={VO}
      voDir="vo/auto-course-ep01"
      videoSrc="footage/auto-course-ep01/ch5-walkthrough-clean.mp4"
      videoNativeDurationSec={145}
      cueIds={CH5_CUES}
      kicker="CH5 · 第一個自動化實錄"
      accent="teal"
      redactions={[{ x: 0.08, y: 0.39, w: 0.44, h: 0.08, fromSec: 0, toSec: 24 }]}
    />
  </AbsoluteFill>
);
