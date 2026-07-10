import React from "react";
import { TYPE } from "../../../shared-skills/theme";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Stamp, Terminal } from "../components";
import { MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s2-c1", "s2-c2", "s2-c3", "s2-c4", "s2-c5", "s2-c6", "s2-c7"],
  { lead: 14, minDur: 410 },
);
const at = (i: number) => CUES[i].from;

export const Scene2: React.FC = () => {
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.node} kicker="經驗 01 · Node 版本" seed="s2">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="經驗一：Node 太舊，會裝不起來" en="Old Node → install fails or won't run" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 286, display: "flex", justifyContent: "center" }}>
        <Terminal
          width={1260}
          start={44}
          step={16}
          lines={[
            { k: "cmd", t: "node -v" },
            { k: "err", t: "v16.20.0   ← 太舊" },
            { k: "cmd", t: "npm install -g @anthropic-ai/claude-code" },
            { k: "err", t: "EBADENGINE  required: node >=18" },
            { k: "cmt", t: "升級 Node（建議用 nvm）" },
            { k: "cmd", t: "nvm install 20 && nvm use 20" },
            { k: "ok", t: "now using node v20.11.0" },
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center", gap: 18 }}>
        <Stamp kind="warn" text="⚠ Node < 18 → 會出問題" at={at(3)} size={TYPE.small} />
        <Stamp kind="yes" text="✔ 升到 18+ 就過" at={at(4)} size={TYPE.small} rotate={2} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="先 node -v 看版本；太舊就升級 — 用 nvm 管版本，切換最方便" tone={MOTIF.node} delay={at(5)} />
      </div>

      <Sfx src="ding" at={at(1)} volume={0.3} />
      <Sfx src="pop" at={at(3)} volume={0.32} />
      <Sfx src="ding" at={at(4)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene2: SceneDef = {
  id: "s2",
  index: 2,
  kicker: "經驗 01 · Node 版本",
  title: "Node version",
  accent: MOTIF.node,
  durationInFrames: DUR,
  Component: Scene2,
};
