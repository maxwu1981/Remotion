import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS } from "../../shared-skills/theme";
import { Bgm } from "../../shared-skills/audio";
import { SCENES, TRANSITION_FRAMES } from "./registry";

/** The full video: scenes stitched end-to-end with gentle fades + a music bed. */
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
      <Bgm src="bgm-piano.mp3" volume={0.12} />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
