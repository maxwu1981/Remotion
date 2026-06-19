import React from "react";
import { AbsoluteFill } from "remotion";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS } from "../data";
import { Shell } from "../components";
import { ToolDeepDive } from "../deepdive";

// 2nd by score (92) — uses the ChatTTS voiceover cues (av5)
const DUR = 448;
const T = TOOLS.chattts;

const CUES: Cue[] = [
  { id: "av5-c1", from: 12, dur: 277, text: "ChatTTS — MOS 4.7. Emotion a perfect 100: real breathing & laughter." },
  { id: "av5-c2", from: 300, dur: 135, text: "The catch: open-source, so you self-host it with Python." },
];

export const Scene6: React.FC = () => (
  <Shell durationInFrames={DUR} kicker="#2 · DIALOGUE PRO" accent={T.color}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 50, transform: "scale(1.33)" }}>
      <ToolDeepDive tool={T} highlight="emotion" rank={2} />
    </AbsoluteFill>
    <Sfx src="pop" at={10} volume={0.4} />
    <Sfx src="ding" at={300} volume={0.35} />
    <Captions cues={CUES} />
  </Shell>
);

export const scene6: SceneDef = {
  id: "av6",
  index: 6,
  kicker: "#2 Dialogue",
  title: "ChatTTS",
  accent: TOOLS.chattts.color,
  durationInFrames: DUR,
  Component: Scene6,
};
