import React from "react";
import { COLORS } from "../../../shared-skills/theme";
import { PromptGem as SharedPromptGem } from "../../../shared-skills/components/PromptGem";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { BRAND } from "../brand";
import { GEM } from "../data";

const DUR = 360;

/** Hand-timed placeholder — switch to `buildScene([...ids])` once scripted for real. */
const CUES: Cue[] = [
  { id: "gem-c0", from: 14, dur: 60, text: `${GEM.label} · ${GEM.labelEn}` },
  { id: "gem-c1", from: 74, dur: 60, text: GEM.hint },
  { id: "gem-c2", from: 134, dur: 70, text: "Replace me: line spoken while the prompt types out." },
  { id: "gem-c3", from: 214, dur: 60, text: GEM.why },
  { id: "gem-c4", from: 274, dur: 60, text: GEM.variant },
  { id: "gem-c5", from: 334, dur: 26, text: GEM.save },
];

export const PromptGem: React.FC = () => (
  <SharedPromptGem gem={GEM} cues={CUES} durationInFrames={DUR} brand={BRAND.name} captions={<Captions cues={CUES} />} />
);

export const promptGem: SceneDef = {
  id: "gem",
  index: 3,
  kicker: "今日提示詞 · Prompt of the Day",
  title: "Prompt of the Day",
  accent: COLORS.hi.amber,
  durationInFrames: DUR,
  Component: PromptGem,
};
