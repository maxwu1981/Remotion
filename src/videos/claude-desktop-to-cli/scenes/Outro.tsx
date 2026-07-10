import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, BrandGlyph, ramp } from "../components";
import { OUTRO_CARDS, MOTIF, PAL } from "../data";
import { BRAND } from "../brand";

const { cues: CUES, dur: DUR } = buildScene(["ot-1", "ot-2", "ot-3", "ot-4", "ot-5"], { lead: 14, tail: 56, minDur: 540 });
const at = (i: number) => CUES[i].from;

const ACCENTS = [MOTIF.engine, MOTIF.disk, PAL.warn];
const EMOJIS = ["≡", "📁", "📦"];

const SummaryCard: React.FC<{ idx: number; delay: number }> = ({ idx, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  const accent = ACCENTS[idx];
  return (
    <div style={{ ...a, width: 1480, display: "flex", alignItems: "center", gap: 24, padding: "22px 34px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${accent}55`, boxShadow: SHADOW.lg }}>
      <div style={{ width: 66, height: 66, flexShrink: 0, borderRadius: "50%", background: `${accent}16`, border: `2px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontFamily: FONT.mono, fontWeight: 800, color: accent }}>{EMOJIS[idx]}</div>
      <div style={{ width: 52, flexShrink: 0, fontFamily: FONT.ui, fontWeight: 800, fontSize: 52, color: accent, lineHeight: 1 }}>{idx + 1}</div>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.ink, lineHeight: 1.34 }}>{OUTRO_CARDS[idx]}</span>
    </div>
  );
};

/** Thanks + 按讚/訂閱/分享 sign-off card. */
const EndCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appearUp(frame, delay, 18, 26);
  const ctas = [
    { icon: "👍", t: "按讚", c: PAL.yes },
    { icon: "🔔", t: "訂閱", c: COLORS.error },
    { icon: "🔗", t: "分享", c: MOTIF.disk },
  ];
  return (
    <div style={{ ...a, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 96, letterSpacing: -1, color: COLORS.ink }}>
        感謝{" "}
        <span style={{ background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>觀看</span>！
      </div>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>覺得有幫助，就用一個動作支持 👇</div>
      <div style={{ display: "flex", gap: 26 }}>
        {ctas.map((cta, i) => {
          const p = springPop(frame, fps, { delay: delay + 10 + i * 6, from: 0.5, dist: 16 });
          return (
            <div key={cta.t} style={{ ...p, display: "flex", alignItems: "center", gap: 14, padding: "18px 36px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${cta.c}`, boxShadow: SHADOW.md }}>
              <span style={{ fontSize: 40 }}>{cta.icon}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: cta.c }}>{cta.t}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
        <BrandGlyph size={28} />
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>
          Claude 桌面版 <span style={{ color: COLORS.faint }}>→</span> <span style={{ fontFamily: FONT.mono, background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>CLI</span>
        </span>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.faint }} />
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>{BRAND.date}</span>
      </div>
    </div>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const cardsLeave = leave(frame, at(4) - 6, 14);

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={MOTIF.engine} seed="outro">
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", opacity: cardsLeave }}>
        <div style={{ ...appearUp(frame, at(0), 18, 22), textAlign: "center" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h1, letterSpacing: -1, color: COLORS.ink }}>三點，總整理</div>
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted }}>the whole thing in three points</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 244, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: cardsLeave, transform: `translateY(${(1 - cardsLeave) * -20}px)` }}>
        {OUTRO_CARDS.map((_, i) => (
          <SummaryCard key={i} idx={i} delay={at(i + 1)} />
        ))}
      </div>

      {frame >= at(4) - 16 ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: ramp(frame, at(4) - 10, at(4) + 8) }}>
          <EndCard delay={at(4)} />
        </div>
      ) : null}

      <Sfx src="ding" at={at(1)} volume={0.3} />
      <Sfx src="ding" at={at(2)} volume={0.3} />
      <Sfx src="ding" at={at(3)} volume={0.3} />
      <Sfx src="whoosh" at={at(4) - 6} volume={0.34} />
      <Sfx src="pop" at={at(4) + 10} volume={0.34} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const outro: SceneDef = {
  id: "ot",
  index: 6,
  kicker: "結語 · Outro",
  title: "Outro",
  accent: MOTIF.engine,
  durationInFrames: DUR,
  Component: Outro,
};
