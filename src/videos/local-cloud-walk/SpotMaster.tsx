import React from "react";
import { AbsoluteFill, Audio, interpolate, Series, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { Bgm } from "../../shared-skills/audio";
import { SpotScene, SpotStep, spotFrames } from "./SpotScene";
import { Diagram1, Diagram2, Diagram3, DIAGRAM1, DIAGRAM2, DIAGRAM3, BG } from "./diagrams";
import localCloudSpec from "../_explainer/specs/local-cloud.json";
import lcVo from "../_explainer/specs/local-cloud.vo.json";

const VO = lcVo as Record<string, number>;
const VODIR = "vo/claude-local-cloud";
const SC = (localCloudSpec as { script: Record<string, string> }).script;

const C = { amber: "#B45309", teal: "#0F6E56", coral: "#C2410C", red: "#DC2626", green: "#15803D", purple: "#6D28D9", gray: "#4B5563" };
const sp = (id: string, cx: number, cy: number, scale: number, glow: SpotStep["glow"], color: string, headline: string): SpotStep =>
  ({ cueId: id, text: SC[id] ?? "", cx, cy, scale, glow, color, headline });

/* 圖1 區塊 */
const G = {
  bar: { x: 40, y: 26, w: 1200, h: 54 }, localFrame: { x: 44, y: 100, w: 548, h: 402 },
  cc: { x: 66, y: 176, w: 504, h: 124 }, cowork: { x: 66, y: 244, w: 504, h: 56 },
  localMem: { x: 324, y: 350, w: 246, h: 74 }, cloudFrame: { x: 688, y: 100, w: 548, h: 402 },
  tempC: { x: 710, y: 176, w: 504, h: 72 }, cloudMem: { x: 710, y: 324, w: 504, h: 64 },
  wall: { x: 566, y: 176, w: 148, h: 220 }, noRead: { x: 598, y: 274, w: 164, h: 36 },
  upload: { x: 566, y: 348, w: 164, h: 40 }, panelP: { x: 40, y: 578, w: 1200, h: 54 },
};
const D1S: SpotStep[] = [
  sp("cv1", 0.5, 0.111, 1.5, G.bar, C.amber, "核心：工作「在哪執行」決定一切"),
  sp("cv2", 0.5, 0.111, 1.5, G.bar, C.amber, "在哪執行 → 檔案 · 記憶 · 可見性"),
  sp("cv3", 0.531, 0.458, 1.5, G.wall, C.red, "本地與雲端：一道單向牆"),
  sp("p1", 0.5, 0.111, 1.5, G.bar, C.amber, "核心原則"),
  sp("p2", 0.5, 0.111, 1.5, G.bar, C.amber, "看它「在哪執行」"),
  sp("p3", 0.257, 0.432, 1.55, G.localFrame, C.teal, "本地執行：碰本機、只本地看得到"),
  sp("p4", 0.773, 0.432, 1.55, G.cloudFrame, C.coral, "雲端執行：碰不到本機、到處看得到"),
  sp("p5", 0.5, 0.111, 1.5, G.bar, C.amber, "重點：看它在哪跑"),
  sp("g1", 0.257, 0.432, 1.5, G.localFrame, C.teal, "七個名詞，分兩個世界"),
  sp("g2", 0.257, 0.432, 1.55, G.localFrame, C.teal, "本地世界：你的 Mac"),
  sp("g3", 0.257, 0.336, 1.7, G.cc, C.teal, "本地：Claude Code · Cowork"),
  sp("g4", 0.773, 0.432, 1.55, G.cloudFrame, C.coral, "雲端世界：伺服器"),
  sp("g5", 0.773, 0.432, 1.55, G.cloudFrame, C.coral, "雲端：Chatbot · 容器 · Dispatch"),
  sp("w1", 0.531, 0.458, 1.5, G.wall, C.red, "為什麼雲端讀不到本機？"),
  sp("w2", 0.531, 0.458, 1.5, G.wall, C.red, "單向牆：雲端讀不到本機"),
  sp("w3", 0.588, 0.39, 1.6, G.noRead, C.red, "雲端 → 本機：沒權限"),
  sp("w4", 0.531, 0.525, 1.6, G.upload, C.green, "本地能讀、能上傳到雲端"),
  sp("w5", 0.531, 0.458, 1.5, G.wall, C.red, "牆只有一個方向"),
  sp("w6", 0.5, 0.819, 1.5, G.panelP, C.purple, "本機檔上雲端：git 或橋接層"),
  sp("c1", 0.257, 0.38, 1.8, G.cowork, C.gray, "Cowork 能在手機開嗎？"),
  sp("c2", 0.257, 0.38, 1.8, G.cowork, C.gray, "Cowork 只在本地"),
  sp("c3", 0.531, 0.458, 1.5, G.wall, C.red, "手機在雲端側，連不進來"),
  sp("c4", 0.257, 0.38, 1.8, G.cowork, C.gray, "「手機開 Cowork」不成立"),
  sp("c5", 0.773, 0.4, 1.55, G.cloudFrame, C.coral, "手機做事 → 用雲端 Dispatch/Chatbot"),
  sp("d1", 0.773, 0.308, 1.7, G.tempC, C.coral, "Dispatch 是什麼？"),
  sp("d2", 0.773, 0.308, 1.7, G.tempC, C.coral, "Dispatch ＝ 雲端版 Claude Code"),
  sp("d3", 0.773, 0.308, 1.7, G.tempC, C.coral, "在雲端臨時容器跑 · 讀雲端 CLAUDE.md"),
  sp("d4", 0.773, 0.308, 1.7, G.tempC, C.coral, "雲端跑 → 任何裝置看得到"),
  sp("d5", 0.773, 0.308, 1.7, G.tempC, C.coral, "碰不到本機 · 要 PR 才落地"),
  sp("d6", 0.773, 0.308, 1.7, G.tempC, C.coral, "Claude Code 有兩種"),
  sp("m1", 0.773, 0.527, 1.8, G.cloudMem, C.coral, "你有兩份 CLAUDE.md"),
  sp("m2", 0.351, 0.533, 1.8, G.localMem, C.teal, "本機一份、雲端一份"),
  sp("m3", 0.351, 0.533, 1.9, G.localMem, C.teal, "各自獨立"),
  sp("m4", 0.773, 0.527, 1.8, G.cloudMem, C.coral, "改本機 → 雲端不會自動知道"),
  sp("m5", 0.531, 0.525, 1.7, G.upload, C.green, "要雲端用到 → 自己推上去"),
];

/* 圖2 */
const G2 = { b4: { x: 40, y: 348, w: 1200, h: 80 }, b5: { x: 40, y: 444, w: 1200, h: 80 } };
const D2S: SpotStep[] = [
  sp("t1", 0.5, 0.615, 1.4, G2.b4, C.coral, "雲端用完就沒了嗎？"),
  sp("t2", 0.5, 0.615, 1.45, G2.b4, C.coral, "臨時容器：用完即丟"),
  sp("t3", 0.5, 0.615, 1.45, G2.b4, C.coral, "每次對話配一個、用完即丟"),
  sp("t4", 0.5, 0.751, 1.45, G2.b5, C.green, "雲端記憶 / Chatbot：持久"),
  sp("t5", 0.5, 0.751, 1.4, G2.b5, C.green, "為什麼要持久？"),
  sp("t6", 0.5, 0.751, 1.45, G2.b5, C.green, "持久 → 才能上傳共用、記得對話"),
];

/* 圖3 */
const G3 = { rw: { x: 80, y: 96, w: 380, h: 96 }, upload: { x: 500, y: 150, w: 360, h: 180 }, blocked: { x: 540, y: 470, w: 300, h: 36 }, chat: { x: 490, y: 510, w: 300, h: 38 }, bridge: { x: 80, y: 560, w: 1120, h: 84 } };
const D3S: SpotStep[] = [
  sp("s1", 0.5, 0.5, 1.25, G3.rw, C.gray, "本地 ↔ 雲端：什麼能共用？"),
  sp("s2", 0.503, 0.417, 1.5, G3.upload, C.green, "記憶 / 檔案：可上傳"),
  sp("s3", 0.503, 0.417, 1.5, G3.upload, C.green, "單向、手動 · 上傳後各一份"),
  sp("s4", 0.538, 0.694, 1.6, G3.blocked, C.red, "對話：不能共用"),
  sp("s5", 0.503, 0.781, 1.55, G3.chat, C.red, "對話搬不動，只能手動搬"),
  sp("s6", 0.5, 0.867, 1.4, G3.bridge, C.purple, "存成檔 → 就能上傳"),
];

const TITLE_LEN = 95;
const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const op = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ transform: `translateY(${(1 - s) * 24}px)`, opacity: op, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 78, color: "#14142B" }}>Claude <span style={{ color: C.coral }}>本地 vs 雲端</span></div>
        <div style={{ marginTop: 22, fontSize: 34, fontWeight: 600, color: "#363B57" }}>一張圖搞懂：容器 · 沙盒 · Cowork · Dispatch 怎麼共存</div>
        <div style={{ marginTop: 30, fontSize: 24, color: "#888780" }}>AI Wisdom · @aiwisdomcc · 整理日期 2026-06-20</div>
      </div>
    </AbsoluteFill>
  );
};

const OUTRO_LEN = Math.ceil((VO["o7"] ?? 11) * 30) + 40;
const OutroCTA: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 16], [20, 0], { extrapolateRight: "clamp" });
  const pill = (bg: string, bd: string, txt: string) => (
    <span style={{ padding: "12px 26px", borderRadius: 999, background: bg, border: `1.5px solid ${bd}`, color: "#14142B", fontWeight: 600 }}>{txt}</span>
  );
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ opacity: op, transform: `translateY(${ty}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#14142B" }}>感謝 <span style={{ color: C.coral }}>觀看</span>！</div>
        <div style={{ marginTop: 18, fontSize: 28, color: "#363B57" }}>覺得有幫助，就用一個動作支持 👇</div>
        <div style={{ marginTop: 28, display: "flex", gap: 18, justifyContent: "center", fontSize: 26 }}>
          {pill("#E1F5EE", C.teal, "👍 按讚")}{pill("#FAECE7", C.coral, "🔔 訂閱")}{pill("#EEEDFE", C.purple, "🔗 分享")}
        </div>
        <div style={{ marginTop: 30, fontSize: 22, color: "#888780" }}>完整圖解＋對話腳本 → 影片下方文章連結　·　AI Wisdom · @aiwisdomcc</div>
      </div>
      <Audio src={staticFile(`${VODIR}/o7.mp3`)} />
    </AbsoluteFill>
  );
};

const F1 = spotFrames(D1S, VO), F2 = spotFrames(D2S, VO), F3 = spotFrames(D3S, VO);
export const spotMasterFrames = () => TITLE_LEN + F1 + F2 + F3 + OUTRO_LEN;

export const SpotMaster: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Series>
      <Series.Sequence durationInFrames={TITLE_LEN}><TitleCard /></Series.Sequence>
      <Series.Sequence durationInFrames={F1}><SpotScene Diagram={Diagram1} dim={DIAGRAM1} steps={D1S} vo={VO} sceneAudio={`${VODIR}/scene-d1.mp3`} diagramImg="diagrams/d1.png" /></Series.Sequence>
      <Series.Sequence durationInFrames={F2}><SpotScene Diagram={Diagram2} dim={DIAGRAM2} steps={D2S} vo={VO} sceneAudio={`${VODIR}/scene-d2.mp3`} diagramImg="diagrams/d2.png" /></Series.Sequence>
      <Series.Sequence durationInFrames={F3}><SpotScene Diagram={Diagram3} dim={DIAGRAM3} steps={D3S} vo={VO} sceneAudio={`${VODIR}/scene-d3.mp3`} diagramImg="diagrams/d3.png" /></Series.Sequence>
      <Series.Sequence durationInFrames={OUTRO_LEN}><OutroCTA /></Series.Sequence>
    </Series>
    <Bgm src="bgm-piano.mp3" volume={0.12} />
  </AbsoluteFill>
);
