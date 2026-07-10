import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave, springPop, springV } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, ramp } from "../components";
import { S1_FALSE, S1_KEY, MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s1-c1", "s1-c2", "s1-c3", "s1-c4", "s1-c5", "s1-c6", "s1-c7", "s1-c8", "s1-c9", "s1-c10", "s1-c11", "s1-c12", "s1-c13"],
  { lead: 14, minDur: 360 },
);
const at = (i: number) => CUES[i].from;

/** A false bundle the article-reader assumes — gets a red ✘ slash + 誤解 stamp. */
const FalseCard: React.FC<{ text: string; delay: number; crossAt: number }> = ({ text, delay, crossAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appearUp(frame, delay, 16, 22);
  const cross = springV(frame, fps, { delay: crossAt, damping: 12, stiffness: 160 });
  const crossed = frame >= crossAt;
  return (
    <div style={{ ...a, position: "relative", width: 700, padding: "26px 30px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${crossed ? PAL.no : COLORS.border}`, boxShadow: SHADOW.md }}>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: crossed ? COLORS.muted : COLORS.ink, lineHeight: 1.3 }}>{text}</span>
      {/* red slash */}
      {frame >= crossAt ? (
        <svg width={700} height={120} style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", overflow: "visible", pointerEvents: "none" }}>
          <line x1={24} y1={96} x2={24 + (652) * Math.min(1, cross)} y2={96 - 72 * Math.min(1, cross)} stroke={PAL.no} strokeWidth={7} strokeLinecap="round" opacity={0.9} />
        </svg>
      ) : null}
      {/* 誤解 stamp */}
      <div style={{ position: "absolute", right: -14, top: -18, transform: `scale(${Math.min(1, cross * 1.3)}) rotate(-8deg)`, opacity: Math.min(1, cross * 1.6) }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: RADIUS.pill, background: PAL.noBg, border: `2px solid ${PAL.no}`, color: PAL.no, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small }}>✘ 誤解</span>
      </div>
    </div>
  );
};

/** A labelled identity badge (Git / Claude) that slides apart from its partner. */
const Badge: React.FC<{ emoji: string; title: string; sub: string; color: string; shift: number; reveal: { opacity: number; transform: string } }> = ({ emoji, title, sub, color, shift, reveal }) => (
  <div style={{ opacity: reveal.opacity, transform: `translateX(${shift}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 360, padding: "26px 22px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2.5px solid ${color}`, boxShadow: SHADOW.lg }}>
    <div style={{ width: 86, height: 86, borderRadius: "50%", background: `${color}16`, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>{emoji}</div>
    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{title}</div>
    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color }}>{sub}</div>
  </div>
);

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A — two false bundles, crossed out — leaves as the truth (phase B) arrives.
  const phaseALeave = leave(frame, at(7) - 8, 14);
  // Phase B — Git vs Claude separation.
  const sep = ramp(frame, at(9), at(9) + 26) * 110; // slide-apart distance
  const gitR = springPop(frame, fps, { delay: at(7), from: 0.7, dist: 24 });
  const claudeR = springPop(frame, fps, { delay: at(7) + 6, from: 0.7, dist: 24 });
  const okChip = springPop(frame, fps, { delay: at(11), from: 0.5, dist: 18 });

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.commit} kicker="01 · 最關鍵的觀念" seed="s1">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="最關鍵的觀念：先分清楚兩件事" en="commit / push are Git features — not Claude commands" delay={at(0)} />
      </div>

      {/* Phase A — false bundles */}
      {frame < at(7) + 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: phaseALeave, transform: `translateY(${(1 - phaseALeave) * -18}px)` }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.muted, ...appearUp(frame, at(2), 14, 16) }}>常見的兩個誤會 👇</div>
          <FalseCard text={S1_FALSE[0]} delay={at(3)} crossAt={at(6)} />
          <FalseCard text={S1_FALSE[1]} delay={at(4)} crossAt={at(6) + 8} />
        </div>
      ) : null}

      {/* Phase B — clean separation Git ←→ Claude */}
      {frame >= at(7) - 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 318 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
            <Badge emoji="🌿" title="Git" sub="版本控制工具" color={PAL.struct} shift={-sep} reveal={gitR} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: ramp(frame, at(9), at(9) + 18) }}>
              <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 64, color: COLORS.faint }}>≠</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted }}>兩件事</span>
            </div>
            <Badge emoji="✳️" title="Claude" sub="幫你執行的方式之一" color={MOTIF.chat} shift={sep} reveal={claudeR} />
          </div>
          {/* green ✔ verdict chip */}
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
            <div style={{ ...okChip, display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 30px", borderRadius: RADIUS.pill, background: PAL.yesBg, border: `2px solid ${PAL.yes}`, boxShadow: SHADOW.md }}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: PAL.yes, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>✔</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>commit／push ＝ Git 的功能</span>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text={S1_KEY} tone={MOTIF.commit} delay={at(11)} width={1480} />
      </div>

      <Sfx src="pop" at={at(3)} volume={0.32} />
      <Sfx src="pop" at={at(4)} volume={0.32} />
      <Sfx src="ding" at={at(6)} volume={0.34} />
      <Sfx src="whoosh" at={at(7)} volume={0.34} />
      <Sfx src="whoosh" at={at(9)} volume={0.3} />
      <Sfx src="ding" at={at(11)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene1: SceneDef = {
  id: "s1",
  index: 1,
  kicker: "01 · 最關鍵的觀念",
  title: "Git feature, not a Claude command",
  accent: MOTIF.commit,
  durationInFrames: DUR,
  Component: Scene1,
};
