import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine } from "../components";
import { MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s5-c1", "s5-c2", "s5-c3", "s5-c4", "s5-c5", "s5-c6"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

const Place: React.FC<{ icon: string; where: string; path: string; who: string; color: string; delay: number }> = ({
  icon,
  where,
  path,
  who,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  return (
    <div style={{ ...a, width: 480, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${color}`, boxShadow: SHADOW.lg, padding: "26px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 56, height: 56, borderRadius: "50%", background: `${color}18`, border: `2px solid ${color}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{icon}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{where}</span>
      </div>
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, background: COLORS.code.panel, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: "12px 16px" }}>{path}</div>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color, lineHeight: 1.35 }}>{who}</div>
    </div>
  );
};

export const Scene5: React.FC = () => {
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.place} kicker="經驗 04 · 放哪裡" seed="s5">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="經驗四：放哪裡，決定誰能用" en="Global vs project vs plugin — who gets it" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", gap: 28 }}>
        <Place icon="🌍" where="全域" path="~/.claude/skills" who="每個專案都吃得到（只有你自己）" color={MOTIF.install} delay={at(1)} />
        <Place icon="📦" where="專案" path=".claude/skills" who="跟著 repo 走，團隊 clone 就有 — 最適合分享" color={MOTIF.build} delay={at(2)} />
        <Place icon="🔌" where="Plugin" path="打包成 plugin" who="散布給更多人安裝使用" color={MOTIF.place} delay={at(4)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="依「誰要用」決定放哪：自己用→全域；團隊共用→專案 repo；公開散布→plugin" tone={MOTIF.place} delay={at(5)} />
      </div>

      <Sfx src="pop" at={at(1)} volume={0.3} />
      <Sfx src="pop" at={at(2)} volume={0.3} />
      <Sfx src="ding" at={at(4)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene5: SceneDef = {
  id: "s5",
  index: 5,
  kicker: "經驗 04 · 放哪裡",
  title: "Where it lives",
  accent: MOTIF.place,
  durationInFrames: DUR,
  Component: Scene5,
};
