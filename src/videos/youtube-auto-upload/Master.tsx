import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { Bgm } from "../../shared-skills/audio";
import { UPLOAD_SCENES, UPLOAD_TRANSITION_FRAMES } from "./registry";
import { UPLOAD_BRAND } from "./brand";

/**
 * The full Auto-Upload tutorial: nine sequences stitched end-to-end with gentle
 * fades, a looping music bed ducked under the whole thing. Per-scene SFX and
 * voiceover live inside each scene, frame-aligned to their animations.
 */
export const UploadMaster: React.FC = () => {
  const children: React.ReactNode[] = [];
  UPLOAD_SCENES.forEach((s, i) => {
    const Comp = s.Component;
    children.push(
      <TransitionSeries.Sequence key={`seq-${s.id}`} durationInFrames={s.durationInFrames}>
        <Comp />
      </TransitionSeries.Sequence>,
    );
    if (i < UPLOAD_SCENES.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`tr-${s.id}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: UPLOAD_TRANSITION_FRAMES })}
        />,
      );
    }
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Bgm src="bgm-piano.mp3" volume={0.13} />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};

/** Static poster frame — reads with no entrance animations at frame 0. */
export const UploadPoster: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.ui, color: COLORS.ink }}>
    <Backdrop accent={COLORS.remotion} seed="upload-poster" />
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
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF0000" }} />
          {UPLOAD_BRAND.course} · ZERO-TOUCH UPLOAD
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT.ui,
            fontWeight: 800,
            fontSize: 110,
            lineHeight: 1.0,
            letterSpacing: -3,
            color: COLORS.ink,
          }}
        >
          <div>{UPLOAD_BRAND.hero[0]}</div>
          <div style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            {UPLOAD_BRAND.hero[1]}
          </div>
        </div>
        <div style={{ marginTop: 22, fontFamily: FONT.ui, fontSize: TYPE.h3, fontWeight: 500, color: COLORS.muted }}>
          {UPLOAD_BRAND.tagline}
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
