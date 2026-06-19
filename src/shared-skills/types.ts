import React from "react";

/** Registry entry for one sequence of the masterclass. */
export type SceneDef = {
  id: string;
  index: number;
  /** e.g. "01 / 06" */
  kicker: string;
  title: string;
  accent: string;
  durationInFrames: number;
  Component: React.FC;
};
