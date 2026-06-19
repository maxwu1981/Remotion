import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, BrandGlyph, ramp } from "../components";
import { OUTRO_CARDS, MOTIF, PAL } from "../data";
import { BRAND } from "../brand";

const { cues: CUES, dur: DUR } = buildScene(["ot-c1", "ot-c2", "ot-c3", "ot-c4"], { lead: 14, tail: 50, minDur: 420 });
const at = (i: number) => CUES[i].from;

const ACCENTS = [PAL.yes, MOTIF.note, MOTIF.cloud];
const EMOJIS = ["💬", "📝", "🧰"];

const SummaryCard: React.FC<{ idx: number; delay: number }> = ({ idx, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  const accent = ACCENTS[idx];
  return (
    <div style={{ ...a, width: 1380, display: "flex", alignItems: "center", gap: 24, padding: "22px 32px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${accent}55`, boxShadow: SHADOW.lg }}>
      <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: "50%", background: `${accent}16`, border: `2px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{EMOJIS[idx]}</div>
      <div style={{ width: 50, flexShrink: 0, fontFamily: FONT.ui, fontWeight: 800, fontSize: 52, color: accent, lineHeight: 1 }}>{idx + 1}</div>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.ink, lineHeight: 1.36 }}>{OUTRO_CARDS[idx]}</span>
    </div>
  );
};

/** The thanks + 按讚/訂閱/分享 sign-off card (cv-c4). */
const EndCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appearUp(frame, delay, 18, 26);
  const ctas = [
    { icon: "👍", t: "按讚", c: PAL.yes },
    { icon: "🔔", t: "訂閱", c: COLORS.error },
    { icon: "🔗", t: "分享", c: MOTIF.cloud },
  ];
  return (
    <div style={{ ...a, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 96, letterSpacing: -1, color: COLORS.ink }}>
        感謝{" "}
        <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>觀看</span>
        ！
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
          Claude Code <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>手機／遠端全解析</span>
        </span>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.faint }} />
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>{BRAND.date}</span>
      </div>
    </div>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  // summary cards (beats 1-3) gently leave as the sign-off (beat 4) arrives
  const cardsLeave = leave(frame, at(3) - 6, 14);
  const headOut = leave(frame, at(3) - 6, 14);

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={MOTIF.cloud} seed="outro">
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", opacity: headOut }}>
        <Heading zh="結語：三句話總整理" en="The whole thing in three lines" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 232, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: cardsLeave, transform: `translateY(${(1 - cardsLeave) * -20}px)` }}>
        {OUTRO_CARDS.map((_, i) => (
          <SummaryCard key={i} idx={i} delay={at(i)} />
        ))}
      </div>

      {/* sign-off end-card */}
      {frame >= at(3) - 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: ramp(frame, at(3) - 10, at(3) + 8) }}>
          <EndCard delay={at(3)} />
        </div>
      ) : null}

      <Sfx src="ding" at={at(0)} volume={0.3} />
      <Sfx src="ding" at={at(1)} volume={0.3} />
      <Sfx src="ding" at={at(2)} volume={0.3} />
      <Sfx src="whoosh" at={at(3) - 6} volume={0.34} />
      <Sfx src="pop" at={at(3) + 10} volume={0.34} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const outro: SceneDef = {
  id: "ot",
  index: 10,
  kicker: "結語 · Outro",
  title: "Outro",
  accent: MOTIF.cloud,
  durationInFrames: DUR,
  Component: Outro,
};
