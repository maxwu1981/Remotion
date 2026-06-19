import React from "react";
import { AbsoluteFill } from "remotion";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS } from "../data";
import { Shell } from "../components";
import { ToolDeepDive } from "../deepdive";

const DUR = 435;
const T = TOOLS.edgetts;

const CUES: Cue[] = [
  { id: "av4-c1", from: 12, dur: 252, text: "Edge-TTS — MOS 4.2, and free. Value maxed at 100: unbeatable for mass output." },
  { id: "av4-c2", from: 276, dur: 145, text: "The catch: it's unofficial, with a slight news-anchor tone." },
];

export const Scene4: React.FC = () => (
  <Shell durationInFrames={DUR} kicker="#4 · BUDGET KING" accent={T.color}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 50, transform: "scale(1.33)" }}>
      <ToolDeepDive tool={T} highlight="costEfficiency" rank={4} />
    </AbsoluteFill>
    <Sfx src="pop" at={10} volume={0.4} />
    <Sfx src="ding" at={276} volume={0.35} />
    <Captions cues={CUES} />
  </Shell>
);

export const scene4: SceneDef = {
  id: "av4",
  index: 4,
  kicker: "#4 Budget",
  title: "Edge-TTS",
  accent: TOOLS.edgetts.color,
  durationInFrames: DUR,
  Component: Scene4,
};
