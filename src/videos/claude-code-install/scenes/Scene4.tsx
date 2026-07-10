import React from "react";
import { TYPE } from "../../../shared-skills/theme";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Stamp, Terminal } from "../components";
import { MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s4-c1", "s4-c2", "s4-c3", "s4-c4", "s4-c5", "s4-c6", "s4-c7", "s4-c8"],
  { lead: 14, minDur: 440 },
);
const at = (i: number) => CUES[i].from;

export const Scene4: React.FC = () => {
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.path} kicker="經驗 03 · command not found" seed="s4">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="經驗三：command not found ≠ 沒裝成功" en="It's installed — your shell just can't find it" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 282, display: "flex", justifyContent: "center" }}>
        <Terminal
          width={1300}
          start={40}
          step={15}
          lines={[
            { k: "cmd", t: "claude" },
            { k: "err", t: "zsh: command not found: claude" },
            { k: "cmt", t: "其實裝好了，只是不在 PATH。查全域 bin：" },
            { k: "cmd", t: "npm bin -g" },
            { k: "out", t: "/Users/you/.npm-global/bin" },
            { k: "cmd", t: 'export PATH="$(npm bin -g):$PATH"' },
            { k: "cmd", t: "claude" },
            { k: "ok", t: "Welcome to Claude Code — ready." },
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", gap: 18 }}>
        <Stamp kind="no" text="✘ 不是沒裝成功" at={at(1)} size={TYPE.small} />
        <Stamp kind="yes" text="✔ 只是 PATH 沒設好" at={at(3)} size={TYPE.small} rotate={2} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="把 npm 全域 bin 加進 PATH，重開終端機就出現 — 用 nvm 通常會自動處理" tone={MOTIF.path} delay={at(5)} />
      </div>

      <Sfx src="pop" at={at(1)} volume={0.32} />
      <Sfx src="ding" at={at(7)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene4: SceneDef = {
  id: "s4",
  index: 4,
  kicker: "經驗 03 · command not found",
  title: "command not found / PATH",
  accent: MOTIF.path,
  durationInFrames: DUR,
  Component: Scene4,
};
