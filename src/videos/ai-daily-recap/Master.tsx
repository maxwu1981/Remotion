import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS } from "../../shared-skills/theme";
import { Bgm } from "../../shared-skills/audio";
import { SCENES, TRANSITION_FRAMES } from "./registry";

/**
 * The full tutorial: every scene stitched end-to-end with gentle crossfades and a
 * low technical music bed under the whole thing. Per-scene SFX + narration live
 * inside each scene, frame-aligned to their animations and captions.
 */
export const Master: React.FC = () => {
  const children: React.ReactNode[] = [];
  SCENES.forEach((s, i) => {
    const Comp = s.Component;
    children.push(
      <TransitionSeries.Sequence key={`seq-${s.id}`} durationInFrames={s.durationInFrames}>
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
      <Bgm src="bgm-tech.mp3" volume={0.1} />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
