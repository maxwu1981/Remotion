import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../../shared-skills/theme";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS } from "../data";
import { Shell } from "../components";
import { ToolDeepDive } from "../deepdive";

const DUR = 416;

const CUES: Cue[] = [
  { id: "av3-c1", from: 12, dur: 185, text: "Bottom of the pile: Mac's built-in Siri — MOS just 3.0." },
  { id: "av3-c2", from: 205, dur: 195, text: "Naturalness 60, emotion 40 — robotic. Proofread with it; never publish." },
];

export const Scene3: React.FC = () => (
  <Shell durationInFrames={DUR} kicker="#5 · THE FLOOR" accent={COLORS.error}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 50, transform: "scale(1.33)" }}>
      <ToolDeepDive tool={TOOLS.macsiri} highlight="naturalness" rank={5} />
    </AbsoluteFill>
    <Sfx src="pop" at={10} volume={0.4} />
    <Sfx src="ding" at={205} volume={0.35} />
    <Captions cues={CUES} />
  </Shell>
);

export const scene3: SceneDef = {
  id: "av3",
  index: 3,
  kicker: "#5 Floor",
  title: "Mac Siri",
  accent: COLORS.error,
  durationInFrames: DUR,
  Component: Scene3,
};
