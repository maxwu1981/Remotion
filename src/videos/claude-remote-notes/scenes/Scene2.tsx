import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, Stamp, FlowArrow, ramp } from "../components";
import { ClaudeMdNote } from "../motifs";
import { TIERS, S2_WARNING, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s2-c1", "s2-c2", "s2-c3", "s2-c4", "s2-c5", "s2-c6", "s2-c7", "s2-c8"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

/** A two-tier card: title · path · note · keep/lose badge. */
const TierCard: React.FC<{ idx: number; delay: number }> = ({ idx, delay }) => {
  const frame = useCurrentFrame();
  const t = TIERS[idx];
  const a = appearUp(frame, delay, 16, 22);
  const tone = t.keep ? PAL.yes : PAL.no;
  return (
    <div style={{ ...a, width: 720, padding: "26px 30px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, display: "flex", gap: 24, alignItems: "flex-start" }}>
      <ClaudeMdNote w={150} tint={tone} lines={3} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{t.zh}</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: TYPE.tiny, color: COLORS.faint }}>· Tier {idx + 1}</span>
        </div>
        <div style={{ display: "inline-block", marginTop: 10, padding: "7px 14px", borderRadius: RADIUS.sm, background: COLORS.code.panel, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: TYPE.small, color: COLORS.code.key }}>{t.path}</span>
        </div>
        <div style={{ marginTop: 16, ...appearUp(frame, delay + 8, 14, 14) }}>
          <Stamp kind={t.keep ? "yes" : "no"} text={t.badge} at={delay + 8} size={TYPE.small} />
        </div>
        <div style={{ marginTop: 14, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted, lineHeight: 1.4 }}>{t.note}</div>
      </div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const bubble = appearUp(frame, at(0), 16, 20);
  const morph = ramp(frame, at(1), at(1) + 18);
  const warn = appearUp(frame, at(6), 18, 24);

  return (
    <Shell durationInFrames={DUR} accent={PAL.warn} kicker="02 · Memory = CLAUDE.md" seed="s2">
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <Heading zh="「Memory」其實就是 CLAUDE.md 這個檔案" en="“Add to memory” writes a plain-text file" delay={at(0)} />
      </div>

      {/* chat bubble → arrow → file */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 232, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <div style={{ ...bubble, position: "relative", padding: "16px 24px", borderRadius: 20, borderBottomLeftRadius: 4, background: COLORS.claude, boxShadow: SHADOW.md }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: "#fff" }}>把這個 bug 加到 memory</span>
        </div>
        <div style={{ opacity: morph }}>
          <FlowArrow width={110} color={PAL.warn} progress={morph} />
        </div>
        <div style={{ opacity: morph, transform: `scale(${0.8 + 0.2 * morph})` }}>
          <ClaudeMdNote w={120} tint={PAL.warn} lines={3} />
        </div>
      </div>

      {/* two tiers */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 452, display: "flex", justifyContent: "center", gap: 28 }}>
        <TierCard idx={0} delay={at(3)} />
        <TierCard idx={1} delay={at(5)} />
      </div>

      {/* warning */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, display: "flex", justifyContent: "center", ...warn }}>
        <div style={{ maxWidth: 1400, display: "flex", alignItems: "center", gap: 18, padding: "18px 32px", borderRadius: RADIUS.lg, background: PAL.warnBg, border: `2px solid ${PAL.warn}`, boxShadow: SHADOW.md }}>
          <span style={{ fontSize: 36 }}>⚠️</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, lineHeight: 1.34 }}>{S2_WARNING}</span>
        </div>
      </div>

      <Sfx src="pop" at={at(0)} volume={0.34} />
      <Sfx src="whoosh" at={at(1)} volume={0.34} />
      <Sfx src="ding" at={at(3)} volume={0.3} />
      <Sfx src="ding" at={at(5)} volume={0.3} />
      <Sfx src="pop" at={at(6)} volume={0.34} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene2: SceneDef = {
  id: "s2",
  index: 2,
  kicker: "02 · Memory = CLAUDE.md",
  title: "Memory = CLAUDE.md",
  accent: PAL.warn,
  durationInFrames: DUR,
  Component: Scene2,
};
