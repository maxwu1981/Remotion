import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { appearScale, enter, springPop } from "../../shared-skills/anim";
import { Narration } from "../../shared-skills/components/Narration";
import { Bgm } from "../../shared-skills/audio";
import { MapStage, type Beat } from "./MapStage";
import { nodeById, categoryById } from "./tree";

/**
 * 通用「一節點一集」影片引擎(EP04+ 用,EP01–03 為手作版)。
 * 由產生器寫出的 EPxx.tsx 餵 cfg + vo + script。結構與 EP01–03 一致:
 * 片頭 → 鉤子 → 你在這(spotlight 本節點)→ 定義卡 → 重點卡 demo →
 * 下一步(spotlight 下一節點)→ 結尾。旁白驅動時間軸。抗 h264 閃爍(平背景+清晰邊框)。
 */

export const FPS = 30;
const PAD = 12, INTRO = 54, TAIL = 24;

export type Point = { icon: string; title: string; note: string };
export type EpisodeCfg = {
  ep: number;
  nodeId: string;
  nextNodeId: string | null;
  hookBig: string;
  hookSub: string;
  defCallout: string;
  demoTitle: string;
  points: Point[];
  nextTitle: string;
  nextSub: string;
};

const voFrames = (vo: Record<string, number>, id: string, fallbackText = ""): number => {
  const s = vo[id];
  if (s) return Math.ceil(s * FPS);
  return Math.ceil(Math.max(1.6, fallbackText.length / 5.2) * FPS);
};

type T = {
  hookFrom: number; hookDur: number;
  hereFrom: number; hereDur: number;
  defFrom: number; defDur: number;
  def2From: number; def2Dur: number;
  demoFrom: number; demoDur: number;
  nextFrom: number; nextDur: number;
  outroFrom: number; outroDur: number;
  total: number;
};
const timeline = (vo: Record<string, number>, script: Record<string, string>): T => {
  const vf = (id: string) => voFrames(vo, id, script[id]);
  const hookFrom = INTRO, hookDur = vf("hook") + PAD;
  const hereFrom = hookFrom + hookDur, hereDur = Math.max(vf("here") + PAD, 120);
  const defFrom = hereFrom + hereDur, defDur = vf("def") + PAD;
  const def2From = defFrom + defDur, def2Dur = vf("def2") + PAD;
  const demoFrom = def2From + def2Dur, demoDur = vf("demo") + 50;
  const nextFrom = demoFrom + demoDur, nextDur = Math.max(vf("next") + PAD, 120);
  const outroFrom = nextFrom + nextDur, outroDur = Math.max(vf("outro") + 44, 150);
  return { hookFrom, hookDur, hereFrom, hereDur, defFrom, defDur, def2From, def2Dur, demoFrom, demoDur, nextFrom, nextDur, outroFrom, outroDur, total: outroFrom + outroDur + TAIL };
};

export const episodeFrames = (vo: Record<string, number>, script: Record<string, string>): number =>
  timeline(vo, script).total;

const FlatBg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 22%)" }} />
  </AbsoluteFill>
);
const CapLine: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  const a = interpolate(frame, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [Math.max(0, dur - 8), dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", opacity: Math.min(a, o) }}>
      <div style={{ maxWidth: 1640, padding: "16px 40px", borderRadius: RADIUS.pill, background: "#FFFFFF", border: `1.5px solid ${COLORS.borderStrong}`, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, color: COLORS.ink, textAlign: "center" }}>{text}</div>
    </div>
  );
};

export const NodeEpisode: React.FC<{ cfg: EpisodeCfg; vo: Record<string, number>; script: Record<string, string>; voDir: string; Thumb?: React.FC }> = ({ cfg, vo, script, voDir, Thumb }) => {
  const t = timeline(vo, script);
  const node = nodeById(cfg.nodeId)!;
  const color = categoryById(node.category).color;
  const catId = node.category;

  const cues: { id: string; from: number; dur: number; caption: boolean }[] = [
    { id: "hook", from: t.hookFrom, dur: t.hookDur, caption: true },
    { id: "here", from: t.hereFrom, dur: t.hereDur, caption: true },
    { id: "def", from: t.defFrom, dur: t.defDur, caption: true },
    { id: "def2", from: t.def2From, dur: t.def2Dur, caption: true },
    { id: "demo", from: t.demoFrom, dur: t.demoDur, caption: true },
    { id: "next", from: t.nextFrom, dur: t.nextDur, caption: true },
    { id: "outro", from: t.outroFrom, dur: t.outroDur, caption: false },
  ];

  const nodeBeat: Beat[] = [{ start: 16, inF: 14, hold: t.hereDur, outF: 2, focus: { type: "node", id: cfg.nodeId } }];
  const nextBeat: Beat[] = [{ start: 16, inF: 14, hold: t.nextDur, outF: 2, focus: cfg.nextNodeId ? { type: "node", id: cfg.nextNodeId } : { type: "all" } }];

  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <FlatBg />
      {/* 水晶背景音樂(Gemini 生,旁白密→壓低) */}
      <Bgm src="bgm-crystal.mp3" volume={0.07} />
      {/* EP badge(封面亮相後才出現,避免蓋到封面開場) */}
      <Sequence from={INTRO} durationInFrames={Math.max(1, t.total - INTRO)} layout="none" name="badge">
        <div style={{ position: "absolute", top: 50, left: 60, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ padding: "6px 16px", borderRadius: RADIUS.pill, background: color, color: "#fff", fontWeight: 800, fontSize: 26 }}>EP{String(cfg.ep).padStart(2, "0")}</span>
          <span style={{ fontWeight: 800, fontSize: 28, color: COLORS.muted }}><span style={{ fontFamily: FONT.mono }}>Claude Code</span> 新手地圖</span>
        </div>
      </Sequence>

      {/* 封面亮相:第 0 秒先閃該集縮圖同款設計(全幅),再進內容;無 Thumb 時退回舊 Intro */}
      <Sequence from={0} durationInFrames={INTRO + 2} layout="none" name="cover">
        {Thumb ? <Cover Thumb={Thumb} /> : <Intro ep={cfg.ep} title={node.title} />}
      </Sequence>
      {/* hook */}
      <Sequence from={t.hookFrom} durationInFrames={t.hookDur} layout="none" name="hook">
        <HookScene big={cfg.hookBig} sub={cfg.hookSub} />
      </Sequence>
      {/* here */}
      <Sequence from={t.hereFrom} durationInFrames={t.hereDur} layout="none" name="here">
        <MapStage beats={nodeBeat} />
      </Sequence>
      {/* def */}
      <Sequence from={t.defFrom} durationInFrames={t.def2From + t.def2Dur - t.defFrom} layout="none" name="def">
        <DefScene num={cfg.ep === node.num ? node.num : node.num} title={node.title} titleEn={node.titleEn} def={script.def} callout={cfg.defCallout} source={node.sourceUrl} color={color} phase2At={t.defDur} />
      </Sequence>
      {/* demo */}
      <Sequence from={t.demoFrom} durationInFrames={t.demoDur} layout="none" name="demo">
        <PointsScene title={cfg.demoTitle} points={cfg.points} color={color} />
      </Sequence>
      {/* next */}
      <Sequence from={t.nextFrom} durationInFrames={t.nextDur} layout="none" name="next">
        <MapStage beats={nextBeat} />
      </Sequence>
      {/* outro */}
      <Sequence from={t.outroFrom} durationInFrames={t.outroDur} layout="none" name="outro">
        <OutroScene title={cfg.nextTitle} sub={cfg.nextSub} />
      </Sequence>

      {/* captions + vo */}
      {cues.filter((c) => c.caption).map((c) => (
        <Sequence key={c.id} from={c.from} durationInFrames={c.dur} layout="none" name={`cap-${c.id}`}><CapLine text={script[c.id]} dur={c.dur} /></Sequence>
      ))}
      {cues.map((c) => (
        <Sequence key={`vo-${c.id}`} from={c.from} durationInFrames={voFrames(vo, c.id, script[c.id]) + 8} layout="none" name={`vo-${c.id}`}><Narration id={c.id} dir={voDir} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Intro: React.FC<{ ep: number; title: string }> = ({ ep, title }) => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, 2, 18, 0.82);
  const out = interpolate(frame, [40, 54], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
      <div style={{ ...a, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 2, color: COLORS.muted }}>Ai-Wisdom-01 · 新手地圖</div>
        <div style={{ marginTop: 12, fontFamily: FONT.mono, fontWeight: 800, fontSize: 64, color: COLORS.ink }}>EP{String(ep).padStart(2, "0")}</div>
        <div style={{ fontWeight: 800, fontSize: 84, letterSpacing: -1, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
/** 封面亮相卡:把該集 1280×720 縮圖放大 1.5× 填滿 1920×1080(與 YouTube 縮圖同款),快淡入、結束前淡出接內容。 */
const Cover: React.FC<{ Thumb: React.FC }> = ({ Thumb }) => {
  const frame = useCurrentFrame();
  // frame 0 必須 opacity=1(封面立刻滿版、與 YouTube 縮圖一致),絕不從 0 淡入;只在結束前淡出接內容
  const fout = interpolate(frame, [INTRO - 13, INTRO - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: COLORS.bg, opacity: fout }}>
      <div style={{ position: "relative", width: 1280, height: 720, transform: "scale(1.5)", transformOrigin: "center center" }}>
        <Thumb />
      </div>
    </AbsoluteFill>
  );
};
const HookScene: React.FC<{ big: string; sub: string }> = ({ big, sub }) => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, 2, 16, 0.8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, textAlign: "center", padding: "0 120px" }}>
        <div style={{ fontWeight: 800, fontSize: 92, color: COLORS.ink, lineHeight: 1.18 }}>{big}</div>
        <div style={{ marginTop: 14, fontFamily: FONT.mono, fontWeight: 700, fontSize: 42, color: COLORS.muted }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};
const DefScene: React.FC<{ num: number; title: string; titleEn: string; def: string; callout: string; source: string; color: string; phase2At: number }> = ({ num, title, titleEn, def, callout, source, color, phase2At }) => {
  const frame = useCurrentFrame();
  const head = enter(frame, 0, 14), body = enter(frame, 12, 18), p2 = enter(frame, phase2At, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1500, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, borderLeft: `12px solid ${color}`, borderRadius: RADIUS.lg, padding: "52px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: head, transform: `translateY(${(1 - head) * 14}px)` }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 34 }}>{num}</span>
          <span style={{ fontWeight: 800, fontSize: 50, color: COLORS.ink }}>{title}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 26, color: COLORS.muted }}>{titleEn}</span>
        </div>
        <div style={{ marginTop: 26, fontWeight: 600, fontSize: 40, lineHeight: 1.5, color: COLORS.inkSoft, opacity: body, transform: `translateY(${(1 - body) * 14}px)` }}>{def}</div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "12px 24px", borderRadius: RADIUS.md, background: `${color}14`, border: `1.5px solid ${color}`, fontWeight: 800, fontSize: 32, color: COLORS.ink, opacity: p2 }}>{callout}</div>
        <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: 24, color: COLORS.muted, opacity: body }}>📚 來源:{source.replace("https://", "")}</div>
      </div>
    </AbsoluteFill>
  );
};
const PointsScene: React.FC<{ title: string; points: Point[]; color: string }> = ({ title, points, color }) => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, 2, 16, 0.92);
  const activeIdx = Math.floor(frame / 30) % Math.max(1, points.length);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ padding: "12px 30px", borderRadius: RADIUS.pill, background: color, color: "#fff", fontWeight: 800, fontSize: 38 }}>{title}</div>
        <div style={{ display: "flex", gap: 22 }}>
          {points.map((p, idx) => {
            const on = idx === activeIdx;
            return (
              <div key={p.title} style={{ width: 340, minHeight: 300, borderRadius: RADIUS.lg, background: "#fff", border: `3px solid ${on ? color : COLORS.borderStrong}`, transform: `scale(${on ? 1.05 : 1})`, padding: "30px 26px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" }}>
                <div style={{ fontSize: 80 }}>{p.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 36, color: COLORS.ink, lineHeight: 1.15 }}>{p.title}</div>
                <div style={{ fontWeight: 600, fontSize: 26, color: COLORS.muted, lineHeight: 1.4 }}>{p.note}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
const OutroScene: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appearScale(frame, 2, 16, 0.86);
  const pill = springPop(frame, fps, { delay: 16 });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, textAlign: "center", padding: "0 100px" }}>
        <div style={{ fontWeight: 800, fontSize: 40, color: COLORS.muted }}>下一站</div>
        <div style={{ marginTop: 8, fontWeight: 800, fontSize: 80, color: COLORS.ink, lineHeight: 1.12 }}>{title}</div>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 38, color: COLORS.muted }}>{sub}</div>
      </div>
      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, display: "flex", justifyContent: "center", ...pill }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "16px 40px 16px 16px", borderRadius: RADIUS.pill, background: GRADIENT.claude, border: "2px solid rgba(255,255,255,0.55)", boxShadow: `0 6px 0 ${COLORS.claudeDeep}` }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: "50%", background: "#fff", color: COLORS.claudeDeep, fontSize: 28, paddingLeft: 5 }}>▶</span>
          <span style={{ fontWeight: 800, fontSize: 44, color: "#fff" }}>訂閱 · 按讚 · 一路學到 30</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
