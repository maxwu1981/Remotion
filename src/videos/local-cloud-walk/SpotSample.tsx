import React from "react";
import { SpotScene, SpotStep, spotFrames } from "./SpotScene";
import { Diagram1, DIAGRAM1 } from "./diagrams";
import vo from "../_explainer/specs/local-cloud.json";
import voManifest from "../_explainer/specs/local-cloud.vo.json";

const SC = (vo as { script: Record<string, string> }).script;
const VO = voManifest as Record<string, number>;

const STEPS: SpotStep[] = [
  { cueId: "g2", text: SC["g2"], cx: 0.257, cy: 0.40, scale: 1.5, glow: { x: 40, y: 92, w: 270, h: 290 }, color: "#0F6E56", headline: "本地世界：都在你的 Mac" },
  { cueId: "w2", text: SC["w2"], cx: 0.53, cy: 0.45, scale: 1.5, glow: { x: 330, y: 140, w: 64, h: 222 }, color: "#DC2626", headline: "單向牆：雲端讀不到本機" },
  { cueId: "d2", text: SC["d2"], cx: 0.773, cy: 0.31, scale: 1.55, glow: { x: 424, y: 140, w: 204, h: 58 }, color: "#C2410C", headline: "Dispatch ＝ 雲端版 Claude Code" },
];

export const spotSampleFrames = () => spotFrames(STEPS, VO);
export const SpotSample: React.FC = () => <SpotScene Diagram={Diagram1} dim={DIAGRAM1} steps={STEPS} vo={VO} />;
