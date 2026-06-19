import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, Chip, KeyLine, ramp } from "../components";
import { Container, SandboxFence, MiniTerminal } from "../motifs";
import { SANDBOX_LIMITS, S7_PROMPT, S7_CLOSE, MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s7-c1", "s7-c2", "s7-c3", "s7-c4", "s7-c5", "s7-c6", "s7-c7", "s7-c8"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

/** A rogue command that lunges at the fence and is stopped. */
const Rogue: React.FC = () => {
  const frame = useCurrentFrame();
  const start = at(6);
  const lunge = ramp(frame, start, start + 14);
  const shake = frame > start + 14 ? Math.sin(frame / 2) * 3 : 0;
  const x = interpolate(lunge, [0, 1], [0, 150], { extrapolateRight: "clamp" });
  const blocked = frame >= start + 14;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: ramp(frame, start, start + 6) }}>
      <div style={{ transform: `translateX(${x + shake}px)`, display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: RADIUS.pill, background: PAL.noBg, border: `1.5px solid ${PAL.no}` }}>
        <span style={{ fontSize: 22 }}>⚠️</span>
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.small, color: PAL.no }}>亂來的指令</span>
      </div>
      <div style={{ opacity: blocked ? 1 : 0, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 30 }}>🛑</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: PAL.no }}>被擋在圍欄</span>
      </div>
    </div>
  );
};

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const outer = appearUp(frame, at(1), 16, 22);
  const prompt = appearUp(frame, at(6) + 8, 16, 18);

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.fence} kicker="07 · 容器 ⊃ 沙盒" seed="s7">
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
        <Heading zh="沙盒（sandbox）bash 是指容器嗎？其實不是" en="Container vs sandbox — two nested layers" delay={at(0)} />
      </div>

      {/* nested: container ⊃ sandbox ⊃ bash */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 232, display: "flex", justifyContent: "center", ...outer }}>
        <Container w={1060} h={600} label="容器（整台臨時電腦）" sub="比喻：整間工作室＋桌子">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", paddingTop: 6 }}>
            {/* restriction rules */}
            <div style={{ display: "flex", gap: 16, ...appearUp(frame, at(4), 14, 14) }}>
              {SANDBOX_LIMITS.map((l, i) => (
                <div key={l.text} style={{ opacity: i === 0 ? ramp(frame, at(4), at(4) + 10) : ramp(frame, at(5), at(5) + 10) }}>
                  <Chip text={`${i === 0 ? "①" : "②"} ${l.text}`} color={MOTIF.fence} size={TYPE.small} icon={<span style={{ fontSize: 20 }}>{l.icon}{i === 0 ? "🚫" : ""}</span>} />
                </div>
              ))}
            </div>

            {/* the fence */}
            <div style={{ width: 760 }}>
              <SandboxFence w={760} h={250} label="沙盒（跑指令時的安全圍欄）" sub="比喻：桌上一個有圍欄的工作區">
                <div style={{ ...appearUp(frame, at(3), 14, 16) }}>
                  <MiniTerminal command="bash 指令在這個圍欄裡執行" w={420} />
                </div>
                <Rogue />
              </SandboxFence>
            </div>
          </div>
        </Container>
      </div>

      {/* prompt + closing */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 170, display: "flex", justifyContent: "center", ...prompt }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: RADIUS.pill, background: PAL.warnBg, border: `1.5px solid ${PAL.warn}`, boxShadow: SHADOW.sm }}>
          <span style={{ fontSize: 22 }}>🔓</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>{S7_PROMPT}</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100 }}>
        <KeyLine text={S7_CLOSE} tone={MOTIF.fence} delay={at(7)} width={900} size={TYPE.h3} />
      </div>

      <Sfx src="whoosh" at={at(1)} volume={0.32} />
      <Sfx src="typing" at={at(3)} volume={0.3} durationInFrames={30} />
      <Sfx src="pop" at={at(4)} volume={0.26} />
      <Sfx src="pop" at={at(5)} volume={0.26} />
      <Sfx src="ding" at={at(6) + 14} volume={0.34} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene7: SceneDef = {
  id: "s7",
  index: 7,
  kicker: "07 · 容器 ⊃ 沙盒",
  title: "Sandbox vs container",
  accent: MOTIF.fence,
  durationInFrames: DUR,
  Component: Scene7,
};
