import React from "react";
import { AbsoluteFill, Audio, interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { DiagramScene, Step, sceneFrames } from "./DiagramScene";
import { DialogueScene, dialogueFrames, DLine } from "./DialogueScene";
import { Diagram1, Diagram2, Diagram3, DIAGRAM1, DIAGRAM2, DIAGRAM3 } from "./diagrams";
import localCloudSpec from "../_explainer/specs/local-cloud.json";
import lcVo from "../_explainer/specs/local-cloud.vo.json";
import dlg from "./dialogue.json";
import dlgVo from "./dialogue.vo.json";

const VO = lcVo as Record<string, number>;
const VODIR = "vo/claude-local-cloud";
const SC = (localCloudSpec as { script: Record<string, string> }).script;
const DLINES = (dlg as { lines: DLine[] }).lines;
const DVO = dlgVo as Record<string, number>;
const DDIR = "vo/local-cloud-dialogue";

const C = { teal: "#2bb38a", coral: "#e0734a", red: "#ef4444", gray: "#b4b2a9", green: "#34c39a", purple: "#9a82f0", amber: "#d6963c" };
const st = (id: string, cx: number, cy: number, scale: number, glow?: Step["glow"], glowColor?: string): Step => ({ id, cueId: id, text: SC[id] ?? "", cx, cy, scale, glow, glowColor } as Step);

/* 圖1 region glows (viewBox 680×548) */
const G = {
  bar: { x: 40, y: 44, w: 600, h: 34 },
  localFrame: { x: 40, y: 92, w: 270, h: 290 },
  cc: { x: 52, y: 140, w: 246, h: 88 },
  cowork: { x: 52, y: 188, w: 246, h: 40 },
  localMem: { x: 180, y: 270, w: 118, h: 44 },
  cloudFrame: { x: 412, y: 92, w: 228, h: 290 },
  tempC: { x: 424, y: 140, w: 204, h: 58 },
  cloudMem: { x: 424, y: 264, w: 204, h: 50 },
  wall: { x: 330, y: 140, w: 64, h: 222 },
  readUp: { x: 306, y: 168, w: 112, h: 22 },
  noRead: { x: 356, y: 202, w: 80, h: 26 },
  upload: { x: 298, y: 276, w: 124, h: 24 },
  panelPurple: { x: 40, y: 434, w: 600, h: 30 },
};

const D1: Step[] = [
  st("cv1", 0.5, 0.46, 1.0, G.bar, C.amber),
  st("cv2", 0.5, 0.12, 1.4, G.bar, C.amber),
  st("cv3", 0.5, 0.46, 1.05, G.wall, C.red),
  st("p1", 0.5, 0.46, 1.0),
  st("p2", 0.5, 0.12, 1.45, G.bar, C.amber),
  st("p3", 0.257, 0.432, 1.55, G.localFrame, C.teal),
  st("p4", 0.773, 0.432, 1.55, G.cloudFrame, C.coral),
  st("p5", 0.5, 0.46, 1.05),
  st("g1", 0.5, 0.46, 1.0),
  st("g2", 0.257, 0.432, 1.55, G.localFrame, C.teal),
  st("g3", 0.257, 0.31, 1.7, G.cc, C.teal),
  st("g4", 0.773, 0.432, 1.55, G.cloudFrame, C.coral),
  st("g5", 0.5, 0.46, 1.05),
  st("w1", 0.5, 0.46, 1.05),
  st("w2", 0.53, 0.456, 1.9, G.wall, C.red),
  st("w3", 0.588, 0.39, 1.7, G.noRead, C.red),
  st("w4", 0.53, 0.328, 1.7, G.readUp, C.teal),
  st("w5", 0.53, 0.456, 1.85, G.wall, C.red),
  st("w6", 0.5, 0.819, 1.45, G.panelPurple, C.purple),
  st("c1", 0.257, 0.38, 1.9, G.cowork, C.gray),
  st("c2", 0.257, 0.38, 1.95, G.cowork, C.gray),
  st("c3", 0.53, 0.456, 1.85, G.wall, C.red),
  st("c4", 0.257, 0.38, 1.9, G.cowork, C.gray),
  st("c5", 0.773, 0.4, 1.6, G.cloudFrame, C.coral),
  st("d1", 0.5, 0.46, 1.05),
  st("d2", 0.773, 0.308, 1.8, G.tempC, C.coral),
  st("d3", 0.773, 0.31, 1.8, G.tempC, C.coral),
  st("d4", 0.773, 0.432, 1.55, G.cloudFrame, C.coral),
  st("d5", 0.773, 0.308, 1.85, G.tempC, C.coral),
  st("d6", 0.257, 0.31, 1.6, G.cc, C.teal),
  st("m1", 0.351, 0.533, 1.8, G.localMem, C.teal),
  st("m2", 0.5, 0.5, 1.35, G.localMem, C.teal),
  st("m3", 0.351, 0.533, 1.9, G.localMem, C.teal),
  st("m4", 0.773, 0.527, 1.85, G.cloudMem, C.coral),
  st("m5", 0.53, 0.525, 1.75, G.upload, C.green),
];

/* 圖2 (680×470) — 臨時 vs 持久 */
const G2 = { b4: { x: 40, y: 264, w: 600, h: 50 }, b5: { x: 40, y: 328, w: 600, h: 50 } };
const D2: Step[] = [
  st("t1", 0.5, 0.5, 1.0),
  st("t2", 0.5, 0.615, 1.5, G2.b4, C.coral),
  st("t3", 0.5, 0.615, 1.55, G2.b4, C.coral),
  st("t4", 0.5, 0.751, 1.5, G2.b5, C.green),
  st("t5", 0.5, 0.5, 1.1),
  st("t6", 0.5, 0.751, 1.55, G2.b5, C.green),
];

/* 圖3 (680×444) — 記憶/對話流向 */
const G3 = { upload: { x: 250, y: 150, w: 184, h: 70 }, blocked: { x: 300, y: 296, w: 132, h: 24 }, chat: { x: 248, y: 332, w: 188, h: 30 }, bridge: { x: 56, y: 362, w: 568, h: 46 } };
const D3: Step[] = [
  st("s1", 0.5, 0.5, 1.0),
  st("s2", 0.5, 0.36, 1.5, G3.upload, C.green),
  st("s3", 0.5, 0.36, 1.55, G3.upload, C.green),
  st("s4", 0.5, 0.69, 1.6, G3.blocked, C.red),
  st("s5", 0.5, 0.78, 1.55, G3.chat, C.red),
  st("s6", 0.5, 0.866, 1.5, G3.bridge, C.purple),
];

const OUTRO_LEN = Math.ceil((VO["o7"] ?? 11) * 30) + 40;
const OutroCTA: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 16], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0a0a0f", justifyContent: "center", alignItems: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ opacity: op, transform: `translateY(${ty}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#f4f4f8" }}>感謝 <span style={{ color: C.amber }}>觀看</span>！</div>
        <div style={{ marginTop: 18, fontSize: 28, color: "#a9a9be" }}>覺得有幫助，就用一個動作支持 👇</div>
        <div style={{ marginTop: 28, display: "flex", gap: 18, justifyContent: "center", fontSize: 26, fontWeight: 600 }}>
          <span style={{ padding: "12px 26px", borderRadius: 999, background: "rgba(45,179,138,.16)", border: `1.5px solid ${C.teal}`, color: "#f4f4f8" }}>👍 按讚</span>
          <span style={{ padding: "12px 26px", borderRadius: 999, background: "rgba(224,115,74,.16)", border: `1.5px solid ${C.coral}`, color: "#f4f4f8" }}>🔔 訂閱</span>
          <span style={{ padding: "12px 26px", borderRadius: 999, background: "rgba(154,130,240,.16)", border: `1.5px solid ${C.purple}`, color: "#f4f4f8" }}>🔗 分享</span>
        </div>
        <div style={{ marginTop: 30, fontSize: 22, color: "#6c6c82" }}>完整圖解＋對話腳本 → 影片下方文章連結　·　Ai-Wisdom-01</div>
      </div>
      <Audio src={staticFile(`${VODIR}/o7.mp3`)} />
    </AbsoluteFill>
  );
};

const F1 = sceneFrames(D1, VO), F2 = sceneFrames(D2, VO), F3 = sceneFrames(D3, VO), FD = dialogueFrames(DLINES, DVO);
export const masterFrames = () => F1 + F2 + F3 + FD + OUTRO_LEN;

export const LocalCloudWalk: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={F1}><DiagramScene Diagram={Diagram1} dim={DIAGRAM1} steps={D1} vo={VO} voDir={VODIR} lockWhole /></Series.Sequence>
    <Series.Sequence durationInFrames={F2}><DiagramScene Diagram={Diagram2} dim={DIAGRAM2} steps={D2} vo={VO} voDir={VODIR} lockWhole /></Series.Sequence>
    <Series.Sequence durationInFrames={F3}><DiagramScene Diagram={Diagram3} dim={DIAGRAM3} steps={D3} vo={VO} voDir={VODIR} lockWhole /></Series.Sequence>
    <Series.Sequence durationInFrames={FD}><DialogueScene lines={DLINES} vo={DVO} voDir={DDIR} /></Series.Sequence>
    <Series.Sequence durationInFrames={OUTRO_LEN}><OutroCTA /></Series.Sequence>
  </Series>
);
