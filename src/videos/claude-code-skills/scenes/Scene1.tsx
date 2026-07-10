import React from "react";
import { useCurrentFrame } from "remotion";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Chip, Terminal, ramp } from "../components";
import { MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s1-c1", "s1-c2", "s1-c3", "s1-c4", "s1-c5", "s1-c6", "s1-c7"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const chipsIn = ramp(frame, at(5), at(5) + 18);

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.install} kicker="00 · Skills 是什麼" seed="s1">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="Skill ＝ 一份可重用的「技能說明書」" en="A reusable how-to Claude loads on demand" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 296, display: "flex", justifyContent: "center" }}>
        <Terminal
          title="專案 / 家目錄"
          width={1180}
          start={40}
          step={16}
          lines={[
            { k: "cmt", t: ".claude/skills/" },
            { k: "out", t: "├─ pdf/SKILL.md" },
            { k: "out", t: "├─ docx/SKILL.md" },
            { k: "out", t: "└─ xlsx/SKILL.md" },
            { k: "ok", t: "Claude 需要時 → 自動載入對應的 Skill" },
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 712, display: "flex", justifyContent: "center", gap: 14, opacity: chipsIn, transform: `translateY(${(1 - chipsIn) * 14}px)` }}>
        <Chip text="✅ 適用：同一套流程重複做" color={MOTIF.build} />
        <Chip text="🚫 不建議：一次性任務" color={MOTIF.trigger} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="Skill 是可重用的技能說明書（SKILL.md），Claude 在需要時自動載入來用" tone={MOTIF.install} delay={at(4)} />
      </div>

      <Sfx src="pop" at={at(2)} volume={0.32} />
      <Sfx src="ding" at={at(4)} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene1: SceneDef = {
  id: "s1",
  index: 1,
  kicker: "00 · Skills 是什麼",
  title: "What is a Skill",
  accent: MOTIF.install,
  durationInFrames: DUR,
  Component: Scene1,
};
