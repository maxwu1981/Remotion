import React from "react";
import { TYPE } from "../../../shared-skills/theme";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Stamp, Terminal } from "../components";
import { MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s2-c1", "s2-c2", "s2-c3", "s2-c4", "s2-c5", "s2-c6"],
  { lead: 14, minDur: 400 },
);
const at = (i: number) => CUES[i].from;

export const Scene2: React.FC = () => {
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.build} kicker="經驗 01 · 建一個 Skill" seed="s2">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="經驗一：建一個 Skill 其實很簡單" en="SKILL.md = frontmatter + content" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" }}>
        <Terminal
          title="my-skill/SKILL.md"
          width={1180}
          start={40}
          step={16}
          lines={[
            { k: "cmt", t: "---   ← frontmatter（給 Claude 看的）" },
            { k: "out", t: "name: my-skill" },
            { k: "out", t: "description: 何時用 + 觸發詞…" },
            { k: "cmt", t: "---" },
            { k: "ok", t: "# 內容：步驟、規則、範例（給執行用的）" },
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", gap: 18 }}>
        <Stamp kind="warn" text="⚠ 重點不是內容寫多長" at={at(4)} size={TYPE.small} />
        <Stamp kind="yes" text="✔ 重點是 description 那一行" at={at(5)} size={TYPE.small} rotate={2} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="SKILL.md ＝ frontmatter（name / description）＋ 內容 — 真正關鍵是 description" tone={MOTIF.build} delay={at(4)} />
      </div>

      <Sfx src="pop" at={at(2)} volume={0.32} />
      <Sfx src="ding" at={at(5)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene2: SceneDef = {
  id: "s2",
  index: 2,
  kicker: "經驗 01 · 建一個 Skill",
  title: "Build a Skill",
  accent: MOTIF.build,
  durationInFrames: DUR,
  Component: Scene2,
};
