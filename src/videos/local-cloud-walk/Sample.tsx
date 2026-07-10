import React from "react";
import { DiagramScene, Step, sceneFrames } from "./DiagramScene";
import { Diagram1, DIAGRAM1 } from "./diagrams";
import vo from "../_explainer/specs/local-cloud.vo.json";

const VO = vo as Record<string, number>;
const VODIR = "vo/claude-local-cloud";

/** Sample steps — reuse v1 narration cues, focus+glow different regions of 圖1. */
const STEPS: Step[] = [
  { cueId: "cv1", text: "在 Claude 裡，東西到底跑在你電腦、還是雲端？哪些記憶和檔案會共用、哪些永遠碰不到？", cx: 0.5, cy: 0.46, scale: 1.0, glow: { x: 40, y: 44, w: 600, h: 34 }, glowColor: "#d6963c" },
  { cueId: "g2", text: "本地這堆，在你的 Mac 上：本地電腦、沙盒、Claude Code、還有 Cowork。", cx: 0.257, cy: 0.432, scale: 1.7, glow: { x: 40, y: 92, w: 270, h: 290 }, glowColor: "#2bb38a" },
  { cueId: "w2", text: "答案是完全不能。這就是最關鍵的一道單向牆。", cx: 0.53, cy: 0.456, scale: 1.95, glow: { x: 330, y: 140, w: 64, h: 222 }, glowColor: "#ef4444" },
  { cueId: "d2", text: "Dispatch 其實就是雲端版的 Claude Code。", cx: 0.773, cy: 0.308, scale: 1.8, glow: { x: 424, y: 140, w: 204, h: 58 }, glowColor: "#e0734a" },
];

export const sampleFrames = () => sceneFrames(STEPS, VO);

export const Sample: React.FC = () => (
  <DiagramScene Diagram={Diagram1} dim={DIAGRAM1} steps={STEPS} vo={VO} voDir={VODIR} />
);
