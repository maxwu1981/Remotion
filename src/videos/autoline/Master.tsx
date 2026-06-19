import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { BRAND } from "./brand";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { Bgm } from "../../shared-skills/audio";
import { SCENES, TRANSITION_FRAMES } from "./registry";

/**
 * The full masterclass: every sequence stitched end-to-end with gentle fades, a
 * looping music bed under the whole thing (ducked to 15%). Per-scene SFX live
 * inside each scene, frame-aligned to their animations.
 */
export const Master: React.FC = () => {
  const children: React.ReactNode[] = [];
  SCENES.forEach((s, i) => {
    const Comp = s.Component;
    children.push(
      <TransitionSeries.Sequence
        key={`seq-${s.id}`}
        durationInFrames={s.durationInFrames}
      >
        <Comp />
      </TransitionSeries.Sequence>,
    );
    if (i < SCENES.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`tr-${s.id}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />,
      );
    }
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Bgm volume={0.1} />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};

/** Static poster frame — reads with no entrance animations at frame 0. */
export const Poster: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.ui, color: COLORS.ink }}>
    <Backdrop accent={COLORS.remotion} seed="poster" />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 18px",
            borderRadius: RADIUS.pill,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow: SHADOW.sm,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: TYPE.tiny,
            letterSpacing: 2,
            color: COLORS.muted,
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: COLORS.remotion }} />
          ZERO-TOUCH PIPELINE · THE {BRAND.course}
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT.ui,
            fontWeight: 800,
            fontSize: 116,
            lineHeight: 1.0,
            letterSpacing: -3,
            color: COLORS.ink,
          }}
        >
          <div>{BRAND.hero[0]}</div>
          <div
            style={{
              background: GRADIENT.remotion,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {BRAND.hero[1]}
          </div>
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: FONT.ui,
            fontSize: TYPE.h3,
            fontWeight: 500,
            color: COLORS.muted,
          }}
        >
          {BRAND.tagline}
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
