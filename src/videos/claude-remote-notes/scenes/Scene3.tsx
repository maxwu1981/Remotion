import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { springV } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, ramp } from "../components";
import { TERMS, MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s3-c1", "s3-c2", "s3-c3", "s3-c4", "s3-c5", "s3-c6", "s3-c7", "s3-c8"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

/** A flashcard that flips in on its Y axis, then stays as a reference cell. */
const TermCard: React.FC<{ idx: number; delay: number }> = ({ idx, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = TERMS[idx];
  const s = springV(frame, fps, { delay, damping: 15, stiffness: 120, mass: 0.9 });
  const rot = interpolate(s, [0, 1], [82, 0]);
  const op = ramp(frame, delay, delay + 8);
  const accent = idx === TERMS.length - 1 ? MOTIF.cloud : MOTIF.warehouse;
  return (
    <div style={{ width: 366, height: 248, perspective: 1000 }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "20px 22px",
          boxSizing: "border-box",
          borderRadius: RADIUS.lg,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          boxShadow: SHADOW.md,
          opacity: op,
          transform: `rotateY(${rot}deg)`,
          transformOrigin: "center",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 38, lineHeight: 1 }}>{t.emoji}</span>
          <div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.ink, lineHeight: 1 }}>{t.term}</div>
            <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: RADIUS.pill, background: `${accent}16`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: accent }}>{t.zh}</div>
          </div>
        </div>
        <div style={{ height: 1, background: COLORS.border }} />
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft, lineHeight: 1.42 }}>{t.desc}</div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.warehouse} kicker="03 · 名詞白話對照" seed="s3">
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <Heading zh="名詞白話對照表" en="7 core terms, in plain language" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 120, right: 120, top: 256, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
        {TERMS.map((t, i) => (
          <TermCard key={t.term} idx={i} delay={at(i + 1)} />
        ))}
      </div>

      {TERMS.map((t, i) => (
        <Sfx key={t.term} src="pop" at={at(i + 1)} volume={0.26} />
      ))}
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene3: SceneDef = {
  id: "s3",
  index: 3,
  kicker: "03 · 名詞白話對照",
  title: "Glossary",
  accent: MOTIF.warehouse,
  durationInFrames: DUR,
  Component: Scene3,
};
