import React from "react";
import { useCurrentFrame } from "remotion";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Chip, Terminal, ramp } from "../components";
import { MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s1-c1", "s1-c2", "s1-c3", "s1-c4", "s1-c5", "s1-c6", "s1-c7", "s1-c8"],
  { lead: 14, minDur: 430 },
);
const at = (i: number) => CUES[i].from;

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const chipsIn = ramp(frame, at(5), at(5) + 18);

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.install} kicker="00 · 最短路徑" seed="s1">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="先給你一條會動的最短安裝路徑" en="The shortest path that actually works" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" }}>
        <Terminal
          width={1240}
          start={40}
          step={18}
          lines={[
            { k: "cmt", t: "先確認 Node（要 18 以上）" },
            { k: "cmd", t: "node -v" },
            { k: "out", t: "v20.11.0" },
            { k: "cmd", t: "npm install -g @anthropic-ai/claude-code" },
            { k: "ok", t: "installed" },
            { k: "cmd", t: "claude" },
            { k: "ok", t: "Welcome to Claude Code — ready." },
          ]}
        />
      </div>

      {/* platform + prereq chips */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 766, display: "flex", justifyContent: "center", gap: 14, opacity: chipsIn, transform: `translateY(${(1 - chipsIn) * 14}px)` }}>
        <Chip text="需要 Node 18+" color={MOTIF.node} />
        <Chip text="macOS" />
        <Chip text="Linux" />
        <Chip text="Windows（WSL）" />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="一行裝起來：npm install -g @anthropic-ai/claude-code，再輸入 claude 啟動" tone={MOTIF.install} delay={at(6)} />
      </div>

      <Sfx src="pop" at={at(3)} volume={0.32} />
      <Sfx src="ding" at={at(4)} volume={0.3} />
      <Sfx src="ding" at={at(6)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene1: SceneDef = {
  id: "s1",
  index: 1,
  kicker: "00 · 最短路徑",
  title: "Shortest install path",
  accent: MOTIF.install,
  durationInFrames: DUR,
  Component: Scene1,
};
