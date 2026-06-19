import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springV } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, Stamp, ramp } from "../components";
import { PRODUCTS, S8_FOOTER, MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s8-c1", "s8-c2", "s8-c3", "s8-c4", "s8-c5", "s8-c6"],
  { lead: 14, minDur: 360 },
);
const at = (i: number) => CUES[i].from;

/** Reveal frame for each product's verdict (Code first, then Chat, Cowork). */
const VERDICT_AT = [at(1), at(3), at(4)];

const ProductCard: React.FC<{ idx: number; delay: number }> = ({ idx, delay }) => {
  const frame = useCurrentFrame();
  const p = PRODUCTS[idx];
  const a = appearUp(frame, delay, 16, 20);
  return (
    <div
      style={{
        ...a,
        width: 500,
        height: 430,
        padding: "30px 30px",
        borderRadius: RADIUS.xl,
        background: COLORS.surface,
        border: `2px solid ${p.here ? PAL.yes : COLORS.border}`,
        boxShadow: p.here ? SHADOW.glow(PAL.yes) : SHADOW.md,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div style={{ fontSize: 56 }}>{p.emoji}</div>
      <div style={{ marginTop: 10, fontFamily: FONT.ui, fontWeight: 800, fontSize: 52, color: COLORS.ink, lineHeight: 1 }}>{p.name}</div>
      <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>{p.sub}</div>
      <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, lineHeight: 1.45, flex: 1 }}>{p.desc}</div>
      <div>
        <Stamp kind={p.here ? "yes" : "no"} text={p.here ? "✔ 在" : "✘ 不在"} at={VERDICT_AT[idx]} size={TYPE.h3} rotate={p.here ? -3 : 3} />
      </div>
      {!p.here ? <div style={{ position: "absolute", inset: 0, borderRadius: RADIUS.xl, background: COLORS.bg, opacity: 0.28 * ramp(frame, VERDICT_AT[idx], VERDICT_AT[idx] + 12), pointerEvents: "none" }} /> : null}
    </div>
  );
};

/** The glowing 本對話 token that drops into the Code card. */
const ConversationToken: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springV(frame, fps, { delay: at(1), damping: 12, stiffness: 130 });
  const y = interpolate(s, [0, 1], [-180, 0], { extrapolateRight: "clamp" });
  const op = ramp(frame, at(1), at(1) + 6);
  return (
    <div
      style={{
        position: "absolute",
        left: 420,
        top: 250,
        transform: `translate(-50%, ${y}px)`,
        opacity: op,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 24px",
        borderRadius: RADIUS.pill,
        background: `linear-gradient(135deg, ${MOTIF.cloud}, #B59BF0)`,
        boxShadow: `0 0 0 6px ${MOTIF.cloud}22, 0 16px 40px ${MOTIF.cloud}66`,
        zIndex: 5,
      }}
    >
      <span style={{ fontSize: 26 }}>💬</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: "#fff" }}>本對話</span>
    </div>
  );
};

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const footer = appearUp(frame, at(5), 16, 18);

  return (
    <Shell durationInFrames={DUR} accent={PAL.yes} kicker="08 · Chat / Cowork / Code" seed="s8">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="這段對話在電腦上哪裡找得到？" en="This is a Claude Code session — it lives in Code" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 40 }}>
        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.name} idx={i} delay={at(1) + i * 5} />
        ))}
      </div>
      <ConversationToken />

      {/* sync footer */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 104, display: "flex", justifyContent: "center", ...footer }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "16px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
          <span style={{ fontSize: 28 }}>🔄</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.body, color: COLORS.code.key }}>claude.ai/code</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.faint }} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft }}>📱 手機 / 🖥 桌面 App</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.faint }} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>{S8_FOOTER}</span>
        </div>
      </div>

      <Sfx src="whoosh" at={at(1)} volume={0.3} />
      <Sfx src="ding" at={at(1) + 10} volume={0.34} />
      <Sfx src="pop" at={at(3)} volume={0.26} />
      <Sfx src="pop" at={at(4)} volume={0.26} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene8: SceneDef = {
  id: "s8",
  index: 8,
  kicker: "08 · Chat / Cowork / Code",
  title: "Where it lives",
  accent: PAL.yes,
  durationInFrames: DUR,
  Component: Scene8,
};
