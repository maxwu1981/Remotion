import React from "react";
import { AbsoluteFill } from "remotion";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS } from "../data";
import { Shell } from "../components";
import { ToolDeepDive } from "../deepdive";

const DUR = 449;
const T = TOOLS.elevenlabs;

const CUES: Cue[] = [
  { id: "av7-c1", from: 12, dur: 258, text: "The champion: ElevenLabs — MOS 4.8, the highest. Naturalness & emotion near 100." },
  { id: "av7-c2", from: 282, dur: 145, text: "The catch: pay-per-character, so it gets pricey at scale." },
];

export const Scene7: React.FC = () => (
  <Shell durationInFrames={DUR} kicker="#1 · THE CHAMPION 👑" accent={T.color}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 50, transform: "scale(1.33)" }}>
      <ToolDeepDive tool={T} highlight="naturalness" rank={1} />
    </AbsoluteFill>
    <Sfx src="whoosh" at={8} volume={0.45} />
    <Sfx src="ding" at={20} volume={0.45} />
    <Sfx src="ding" at={282} volume={0.35} />
    <Captions cues={CUES} />
  </Shell>
);

export const scene7: SceneDef = {
  id: "av7",
  index: 7,
  kicker: "#1 Champion",
  title: "ElevenLabs",
  accent: TOOLS.elevenlabs.color,
  durationInFrames: DUR,
  Component: Scene7,
};
