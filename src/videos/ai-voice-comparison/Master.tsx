import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS } from "../../shared-skills/theme";
import { Bgm } from "../../shared-skills/audio";
import { SCENES, TRANSITION_FRAMES } from "./registry";
import { VoVariant, CHATTTS_VO } from "./captions";

/** The scenes stitched end-to-end with gentle fades + the music bed. */
const MovieBody: React.FC = () => {
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
      <Bgm src="bgm-tech.mp3" volume={0.13} />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};

/** Default narration: Ava (edge-tts). */
export const Master: React.FC = () => <MovieBody />;

/** Same video, alternate narration: ChatTTS (seed 23). */
export const MasterChatTTS: React.FC = () => (
  <VoVariant.Provider value={CHATTTS_VO}>
    <MovieBody />
  </VoVariant.Provider>
);
