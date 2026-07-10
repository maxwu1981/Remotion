import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import shortVo from "./short.vo.json";

const FPS = 30, LEAD = 6, GAP = 6, TAIL = 10;
const VO = shortVo as Record<string, number>;
const ORANGE = "#F6A23C", BLUE = "#4FC3F7", RED = "#FF6B6B", GREEN = "#46D17F", PURPLE = "#B79CFF";
const W = 1080, H = 1920;

type Stage = "cover" | "d1";
type Cam = { fx: number; fy: number; z: number };
type Seg = { t: string; kw?: boolean };
type Beat = { id: string; caps: Seg[][]; accent: string; num?: number; cta?: boolean; stage: Stage; from: Cam; to: Cam };

const C = { full: { fx: 540, fy: 980 }, lap: { fx: 540, fy: 545 }, cloud: { fx: 560, fy: 1690 } };
const D = { wall: { fx: 540, fy: 253 }, lmem: { fx: 377, fy: 327 }, cmem: { fx: 812, fy: 300 }, lower: { fx: 540, fy: 505 } };

const BEATS: Beat[] = [
  { id: "h0", accent: ORANGE, stage: "cover", from: { ...C.full, z: 1.0 }, to: { ...C.full, z: 1.14 },
    caps: [[{ t: "Claude 最常踩的 " }, { t: "3 個雷", kw: true }], [{ t: "第 3 個", kw: true }, { t: "最多人中" }]] },
  { id: "h1", accent: ORANGE, stage: "cover", from: { ...C.lap, z: 1.24 }, to: { ...C.cloud, z: 1.24 },
    caps: [[{ t: "工作「" }, { t: "在哪執行", kw: true }, { t: "」" }], [{ t: "就決定一切" }]] },
  { id: "p1", accent: RED, num: 1, stage: "d1", from: { ...D.wall, z: 2.4 }, to: { ...D.wall, z: 2.78 },
    caps: [[{ t: "單向牆", kw: true }, { t: "：本地能上雲端" }], [{ t: "雲端" }, { t: "碰不到", kw: true }, { t: "你的本機" }]] },
  { id: "p2", accent: ORANGE, num: 2, stage: "d1", from: { ...D.lmem, z: 2.55 }, to: { ...D.cmem, z: 2.6 },
    caps: [[{ t: "你有" }, { t: "兩份 CLAUDE.md", kw: true }], [{ t: "沒上傳就會" }, { t: "漂移", kw: true }]] },
  { id: "p3", accent: GREEN, num: 3, stage: "d1", from: { ...D.lower, z: 2.2 }, to: { ...D.lower, z: 2.38 },
    caps: [[{ t: "對話" }, { t: "搬不動", kw: true }]], /* second line set below */ },
  { id: "cta", accent: BLUE, cta: true, stage: "cover", from: { ...C.full, z: 1.26 }, to: { ...C.full, z: 1.08 },
    caps: [[{ t: "完整一張圖解在主頻道" }], [{ t: "訂閱 AI Wisdom 🔔" }]] },
];
// p3 second line (kept here to keep the array readable)
BEATS[4].caps.push([{ t: "但" }, { t: "存成檔就能搬", kw: true }]);

export function shortFrames(): number {
  let t = LEAD;
  for (const b of BEATS) t += Math.ceil((VO[b.id] ?? 4) * FPS) + GAP;
  return t - GAP + TAIL;
}
const TOTAL = shortFrames();
const ease = (t: number) => t * t * (3 - 2 * t);
const STAGE_SRC: Record<Stage, { w: number; h: number; img: string }> = {
  cover: { w: 1080, h: 1920, img: "thumb/bg916.png" },
  d1: { w: 1080, h: 607.5, img: "diagrams/d1.png" },
};

/** karaoke caption — chars before `hi` are lit, after are dim; keywords keep accent. */
const Karaoke: React.FC<{ caps: Seg[][]; hi: number; accent: string }> = ({ caps, hi, accent }) => {
  let idx = 0;
  return (
    <>
      {caps.map((line, li) => (
        <div key={li} style={{ fontWeight: 800, fontSize: 66, lineHeight: 1.3, textShadow: "0 2px 16px rgba(0,0,0,0.95)" }}>
          {line.map((seg, si) =>
            [...seg.t].map((ch, ci) => {
              const my = idx++;
              const lit = my < hi;
              const base = seg.kw ? accent : "#FFFFFF";
              return <span key={`${si}-${ci}`} style={{ color: base, opacity: lit ? 1 : 0.3, transform: lit ? "none" : "none" }}>{ch}</span>;
            }),
          )}
        </div>
      ))}
    </>
  );
};

export const LocalCloudShort: React.FC = () => {
  const frame = useCurrentFrame();
  let t = LEAD;
  const starts: number[] = [], durs: number[] = [];
  for (const b of BEATS) { starts.push(t); const d = Math.ceil((VO[b.id] ?? 4) * FPS) + GAP; durs.push(d); t += d; }
  let active = 0;
  for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) active = i;
  const b = BEATS[active];
  const a0 = starts[active], dur = durs[active];
  const isCut = active > 0 && BEATS[active - 1].stage !== b.stage;

  const p = ease(interpolate(frame, [a0, a0 + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lp = (k: keyof Cam) => b.from[k] + (b.to[k] - b.from[k]) * p;
  let fx = lp("fx"), fy = lp("fy"), z = lp("z");
  z *= interpolate(frame, [a0, a0 + 6], [1.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const src = STAGE_SRC[b.stage];
  const camTx = `translate(${W / 2 - fx * z}px, ${H / 2 - fy * z}px) scale(${z})`;

  // karaoke progress over the spoken window
  const spoken = Math.ceil((VO[b.id] ?? 4) * FPS);
  const totalChars = b.caps.reduce((n, ln) => n + ln.reduce((m, s) => m + [...s.t].length, 0), 0);
  const hi = Math.round(interpolate(frame, [a0 + 2, a0 + spoken], [0, totalChars], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const tIn = interpolate(frame, [a0, a0 + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(frame, [a0, a0 + 9], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dip = isCut ? interpolate(frame, [a0, a0 + 5], [0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const numPop = b.num ? interpolate(frame, [a0, a0 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const numScale = b.num ? interpolate(frame, [a0, a0 + 10], [1.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const prog = Math.min(1, frame / (TOTAL - TAIL));

  return (
    <AbsoluteFill style={{ background: "#070B14", fontFamily: FONT.uiCjk, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: src.w, height: src.h, transformOrigin: "0 0", transform: camTx }}>
        <Img src={staticFile(src.img)} style={{ width: src.w, height: src.h, display: "block" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,11,20,0.5) 0%, rgba(7,11,20,0) 20%, rgba(7,11,20,0) 52%, rgba(7,11,20,0.84) 76%, rgba(7,11,20,0.96) 100%)" }} />
      {dip > 0 ? <div style={{ position: "absolute", inset: 0, background: "#04060C", opacity: dip }} /> : null}

      {/* progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.12)" }}>
        <div style={{ height: "100%", width: `${prog * 100}%`, background: `linear-gradient(90deg, ${ORANGE}, ${BLUE})` }} />
      </div>

      {/* mini title */}
      <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", fontWeight: 800, fontSize: 44, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
        <span style={{ color: ORANGE }}>本地</span><span style={{ color: "#fff", margin: "0 12px", fontStyle: "italic" }}>vs</span><span style={{ color: BLUE }}>雲端</span>
      </div>

      {/* numbered chip */}
      {b.num ? (
        <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: numPop }}>
          <div style={{ width: 132, height: 132, borderRadius: 30, background: `${b.accent}`, color: "#0A0E18", fontWeight: 900, fontSize: 86, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${numScale})`, boxShadow: `0 0 36px ${b.accent}88` }}>{b.num}</div>
        </div>
      ) : null}

      {/* caption / CTA */}
      <div style={{ position: "absolute", left: 56, right: 56, bottom: b.cta ? 350 : 290, textAlign: "center", opacity: tIn, transform: `translateY(${rise}px)` }}>
        {b.cta ? (
          <div style={{ background: "rgba(8,12,20,0.8)", border: `2px solid ${BLUE}66`, borderRadius: 28, padding: "44px 36px" }}>
            <div style={{ fontWeight: 800, fontSize: 58, color: "#fff", lineHeight: 1.3, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>完整一張圖解在主頻道</div>
            <div style={{ marginTop: 16, fontWeight: 800, fontSize: 64, color: BLUE }}>訂閱 AI Wisdom 🔔</div>
            <div style={{ marginTop: 20, fontSize: 36, color: "#C7D0DE", fontWeight: 700 }}>@aiwisdomcc</div>
          </div>
        ) : (
          <div style={{ display: "inline-block", background: "rgba(8,12,20,0.66)", borderRadius: 26, padding: "24px 32px", borderLeft: `8px solid ${b.accent}` }}>
            <Karaoke caps={b.caps} hi={hi} accent={b.accent} />
          </div>
        )}
      </div>

      {/* audio: narration + bgm bed + sfx */}
      <Audio src={staticFile("vo/local-cloud-short/scene3.mp3")} />
      <Audio src={staticFile("bgm-tech.mp3")} volume={0.085} loop />
      {BEATS.map((bb, i) => {
        const fx2: React.ReactNode[] = [];
        const cut = i > 0 && BEATS[i - 1].stage !== bb.stage;
        if (cut) fx2.push(<Sequence key={`w${i}`} from={starts[i]} durationInFrames={24} layout="none"><Audio src={staticFile("soft-whoosh.mp3")} volume={0.45} /></Sequence>);
        if (bb.num) fx2.push(<Sequence key={`p${i}`} from={starts[i] + 2} durationInFrames={20} layout="none"><Audio src={staticFile("ui-pop.mp3")} volume={0.5} /></Sequence>);
        if (bb.cta) fx2.push(<Sequence key={`d${i}`} from={starts[i]} durationInFrames={30} layout="none"><Audio src={staticFile("clean-ding.mp3")} volume={0.5} /></Sequence>);
        return fx2;
      })}
    </AbsoluteFill>
  );
};
