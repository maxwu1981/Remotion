import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, GRADIENT, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Backdrop } from "../../../shared-skills/components/Backdrop";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { BRAND } from "../brand";

const DUR = 150;

/** Subtitle cues, timed in scene-local frames. ids map to public/vo/template/<id>.mp3 */
const CUES: Cue[] = [{ id: "t1-c1", from: 10, dur: 120, text: "Replace me with your first line." }];

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const title = appearUp(frame, 8, 18, 26);

  return (
    <AbsoluteFill style={{ fontFamily: FONT.ui, color: COLORS.ink }}>
      <Backdrop accent={COLORS.remotion} seed="template" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", ...title }}>
          <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h1, letterSpacing: -1.5, color: COLORS.ink }}>
            {BRAND.hero[0]}{" "}
            <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {BRAND.hero[1]}
            </span>
          </div>
          <div style={{ marginTop: 16, fontSize: TYPE.h3, fontWeight: 500, color: COLORS.muted }}>{BRAND.tagline}</div>
        </div>
      </AbsoluteFill>

      <Sfx src="pop" at={8} volume={0.4} />
      <Captions cues={CUES} />
    </AbsoluteFill>
  );
};

export const scene1: SceneDef = {
  id: "t1",
  index: 1,
  kicker: "Intro",
  title: "Template scene",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene1,
};
