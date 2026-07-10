/**
 * Ordered scene registry for the 帳號授權安全 · 鑰匙比喻 explainer.
 * Built data-driven from content.ts: cover → every doc section → 一頁速查 → outro.
 * Root.tsx builds the composition from SCENES; the two table sections also expose
 * a cards-variant in ALT_SCENES so the user can pick table vs cards.
 */
import React from "react";
import type { SceneDef } from "../../shared-skills/types";
import { COLORS } from "../../shared-skills/theme";
import { SCENES as SPECS } from "./content";
import { Section, sceneFrames } from "./Section";
import { MOTIF } from "./data";
import { cover } from "./scenes/Cover";
import { agenda, recapAgenda } from "./scenes/Agenda";
import { recapA, recapB, outro } from "./scenes/Outro";

export const FPS = 30;
export const TRANSITION_FRAMES = 9;

/** Sections shown as cards (not the animated table) in the MAIN movie. */
const MAIN_CARDS = new Set<string>(["s6a"]); // 旅館卡司 = 卡片版; 四角色(s0a) = 表格版

const sectionDef = (specIndex: number, cards = false, idSuffix = ""): SceneDef => {
  const spec = SPECS[specIndex];
  const { dur } = sceneFrames(spec);
  return {
    id: spec.id + idSuffix,
    index: specIndex + 1,
    kicker: spec.no ? `${spec.no} · ${spec.titleZh}` : spec.titleZh,
    title: spec.titleEn ?? spec.titleZh,
    accent: MOTIF[spec.motif] ?? COLORS.remotion,
    durationInFrames: dur,
    Component: () => React.createElement(Section, { spec, cards }),
  };
};

const SECTION_DEFS: SceneDef[] = SPECS.map((s, i) => sectionDef(i, MAIN_CARDS.has(s.id)));

/** Full movie, in order. */
export const SCENES: SceneDef[] = [cover, agenda, ...SECTION_DEFS, recapAgenda, recapA, recapB, outro];

/** The *other* variant of each table section, so the user can still preview both. */
export const ALT_SCENES: SceneDef[] = SPECS.flatMap((s, i) => {
  if (!s.altCards) return [];
  const mainIsCards = MAIN_CARDS.has(s.id);
  return [sectionDef(i, !mainIsCards, mainIsCards ? "-table" : "-cards")];
});

/** Master length = Σ scene lengths − the overlap each crossfade consumes. */
export const getMovieFrames = (): number => {
  const total = SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);
  return total - TRANSITION_FRAMES * (SCENES.length - 1);
};
