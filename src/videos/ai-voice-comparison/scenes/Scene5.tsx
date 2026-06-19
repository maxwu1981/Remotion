import React from "react";
import { AbsoluteFill } from "remotion";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS } from "../data";
import { Shell } from "../components";
import { ToolDeepDive } from "../deepdive";

// 3rd by score (88) — uses the OpenAI voiceover cues (av6)
const DUR = 439;
const T = TOOLS.openaitts;

const CUES: Cue[] = [
  { id: "av6-c1", from: 12, dur: 246, text: "OpenAI TTS — MOS 4.5. Speed 90, clean & stable: the developer's pick." },
  { id: "av6-c2", from: 270, dur: 155, text: "Pay-as-you-go, but cheap — and dead simple to wire into an app." },
];

export const Scene5: React.FC = () => (
  <Shell durationInFrames={DUR} kicker="#3 · FOR DEVELOPERS" accent={T.color}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 50, transform: "scale(1.33)" }}>
      <ToolDeepDive tool={T} highlight="speed" rank={3} />
    </AbsoluteFill>
    <Sfx src="pop" at={10} volume={0.4} />
    <Sfx src="ding" at={270} volume={0.35} />
    <Captions cues={CUES} />
  </Shell>
);

export const scene5: SceneDef = {
  id: "av5",
  index: 5,
  kicker: "#3 Developers",
  title: "OpenAI TTS",
  accent: TOOLS.openaitts.color,
  durationInFrames: DUR,
  Component: Scene5,
};
