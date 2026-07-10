import React from "react";
import { COLORS } from "../../../shared-skills/theme";
import { Roadmap as SharedRoadmap } from "../../../shared-skills/components/Roadmap";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { BRAND } from "../brand";
import { ROADMAP, ROADMAP_KEY } from "../data";

const DUR = 300;

/**
 * cues[0] times the title; cues[i + 1] times stop i's reveal (see
 * shared-skills/components/Roadmap.tsx for the convention). Hand-timed for
 * now — captions-only, no VO. Once you script this scene for real, generate
 * one mp3 per id and switch these to `buildScene([...ids])`.
 */
const CUES: Cue[] = [
  { id: "rm-c0", from: 12, dur: 60, text: "Replace me: your roadmap intro line." },
  { id: "rm-c1", from: 60, dur: 60, text: ROADMAP[0].zh },
  { id: "rm-c2", from: 120, dur: 60, text: ROADMAP[1].zh },
  { id: "rm-c3", from: 180, dur: 60, text: ROADMAP[2].zh },
  { id: "rm-c4", from: 240, dur: 50, text: ROADMAP[3].zh },
];

export const Roadmap: React.FC = () => (
  <SharedRoadmap
    titleZh="Replace me: your roadmap headline"
    titleEn="Your roadmap, in one glance"
    stops={ROADMAP}
    keyText={ROADMAP_KEY}
    cues={CUES}
    durationInFrames={DUR}
    brand={BRAND.name}
    captions={<Captions cues={CUES} />}
  />
);

export const roadmap: SceneDef = {
  id: "rm",
  index: 2,
  kicker: "地圖 · Roadmap",
  title: "Roadmap",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Roadmap,
};
