import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, ramp } from "../components";
import { BOOT_STEPS, S5_PRINCIPLE, S5_PRINCIPLE_SUB, S5_WRONG, S5_RIGHT, MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s5-c1", "s5-c2", "s5-c3", "s5-c4", "s5-c5", "s5-c6", "s5-c7", "s5-c8"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

/** One node of the boot pipeline; lights up when its frame arrives. */
const Step: React.FC<{ n: number; text: string; delay: number; last?: boolean }> = ({ n, text, delay, last }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 16);
  const lit = frame >= delay + 4;
  const accent = MOTIF.cloud;
  return (
    <div style={{ display: "flex", gap: 18, ...a }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: TYPE.h3,
            background: lit ? accent : COLORS.surface,
            color: lit ? "#fff" : COLORS.faint,
            border: `2px solid ${lit ? accent : COLORS.borderStrong}`,
            boxShadow: lit ? `0 0 0 6px ${accent}22` : "none",
            flexShrink: 0,
          }}
        >
          {n}
        </div>
        {!last ? <div style={{ width: 3, flex: 1, minHeight: 30, marginTop: 4, background: lit ? accent : COLORS.border, borderRadius: 2 }} /> : null}
      </div>
      <div
        style={{
          flex: 1,
          marginBottom: 16,
          padding: "16px 22px",
          borderRadius: RADIUS.md,
          background: COLORS.surface,
          border: `1.5px solid ${lit ? `${accent}66` : COLORS.border}`,
          boxShadow: lit ? SHADOW.md : SHADOW.sm,
        }}
      >
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.ink, lineHeight: 1.35 }}>{text}</span>
      </div>
    </div>
  );
};

const VerdictBox: React.FC<{ kind: "no" | "yes"; label: string; text: string; delay: number }> = ({ kind, label, text, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 16, 20);
  const tone = kind === "yes" ? PAL.yes : PAL.no;
  const bg = kind === "yes" ? PAL.yesBg : PAL.noBg;
  return (
    <div style={{ ...a, padding: "20px 24px", borderRadius: RADIUS.lg, background: bg, border: `2px solid ${tone}`, boxShadow: SHADOW.md }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", background: tone, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>{kind === "yes" ? "✔" : "✘"}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: tone }}>{label}</span>
      </div>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft, lineHeight: 1.5 }}>{text}</span>
    </div>
  );
};

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const banner = appearUp(frame, at(1), 16, 22);
  const sub = ramp(frame, at(2), at(2) + 14);

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.cloud} kicker="05 · 從哪裡讀 CLAUDE.md" seed="s5">
      <div style={{ position: "absolute", left: 0, right: 0, top: 112, display: "flex", justifyContent: "center" }}>
        <Heading zh="session 啟動時，CLAUDE.md 從哪裡被讀到？" en="Which CLAUDE.md gets read on boot" delay={at(0)} />
      </div>

      {/* principle banner */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 206, display: "flex", justifyContent: "center", ...banner }}>
        <div style={{ width: 1360, padding: "16px 32px", borderRadius: RADIUS.lg, background: COLORS.ink, boxShadow: SHADOW.lg, textAlign: "center" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: "#fff" }}>
            原則：{S5_PRINCIPLE}
          </div>
          <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: TYPE.small, color: "#C9CEEA", opacity: sub }}>{S5_PRINCIPLE_SUB}</div>
        </div>
      </div>

      {/* left: 4-step pipeline */}
      <div style={{ position: "absolute", left: 120, top: 372, width: 820 }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.small, color: MOTIF.cloud, marginBottom: 16, letterSpacing: 1 }}>啟動順序 · BOOT</div>
        {BOOT_STEPS.map((s, i) => (
          <Step key={i} n={i + 1} text={s} delay={at(3 + i)} last={i === BOOT_STEPS.length - 1} />
        ))}
      </div>

      {/* right: misconception vs correct */}
      <div style={{ position: "absolute", right: 120, top: 372, width: 760, display: "flex", flexDirection: "column", gap: 20 }}>
        <VerdictBox kind="no" label="誤解" text={S5_WRONG} delay={at(7)} />
        <VerdictBox kind="yes" label="正確" text={S5_RIGHT} delay={at(7) + 10} />
      </div>

      <Sfx src="pop" at={at(1)} volume={0.34} />
      {BOOT_STEPS.map((_, i) => (
        <Sfx key={i} src="ding" at={at(3 + i)} volume={0.26} />
      ))}
      <Sfx src="whoosh" at={at(7)} volume={0.34} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene5: SceneDef = {
  id: "s5",
  index: 5,
  kicker: "05 · 從哪裡讀 CLAUDE.md",
  title: "Which CLAUDE.md",
  accent: MOTIF.cloud,
  durationInFrames: DUR,
  Component: Scene5,
};
