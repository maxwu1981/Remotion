import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { GlassPanel } from "../../../shared-skills/components/lux";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { Shell } from "../components";

const DUR = 473;

const CUES: Cue[] = [
  { id: "av2-c1", from: 12, dur: 205, text: "Two numbers tell the story. First — MOS: a 1–5 score from real human listeners." },
  { id: "av2-c2", from: 222, dur: 245, text: "Then 4 metrics: naturalness, emotion, speed & value. Lowest to highest — let's go." },
];

const METRICS = [
  { e: "🗣️", n: "Naturalness", d: "Does it sound human?" },
  { e: "❤️", n: "Emotion", d: "Feeling, range & expression" },
  { e: "⚡", n: "Speed", d: "How fast it generates" },
  { e: "💲", n: "Value", d: "Quality per dollar" },
];

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, 10, 16, 22);
  const dots = Math.floor(interpolate(frame, [40, 120], [0, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const head2 = appearUp(frame, 204, 14, 16);

  return (
    <Shell durationInFrames={DUR} kicker="HOW WE SCORE" accent={COLORS.remotion}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 56, transform: "scale(1.3)" }}>
        <div style={{ display: "flex", gap: 46, alignItems: "stretch" }}>
          {/* MOS panel */}
          <div style={{ width: 560, ...a }}>
            <GlassPanel tint={COLORS.remotion} glow={COLORS.remotion} glowAmt={0.3} radius={26} style={{ height: "100%" }}>
              <div style={{ padding: 38 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 2, color: COLORS.remotion }}>METRIC 1 · CREDIBILITY</div>
                <div style={{ marginTop: 12, fontFamily: FONT.ui, fontWeight: 800, fontSize: 88, lineHeight: 1, color: COLORS.ink }}>MOS</div>
                <div style={{ marginTop: 8, fontFamily: FONT.ui, fontSize: TYPE.h3, fontWeight: 600, color: COLORS.inkSoft }}>Mean Opinion Score</div>
                <div style={{ marginTop: 16, fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted, lineHeight: 1.45 }}>
                  A 1-to-5 rating from real human listeners — the audio industry's quality standard.
                </div>
                <div style={{ marginTop: 26, display: "flex", gap: 12, alignItems: "center" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: i <= dots ? COLORS.remotion : COLORS.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", color: i <= dots ? "#fff" : COLORS.faint, fontFamily: FONT.ui, fontWeight: 800 }}>{i}</div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* 4 metrics panel */}
          <div style={{ width: 560 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 2, color: COLORS.teal, marginBottom: 16, ...head2 }}>+ 4 PERFORMANCE METRICS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {METRICS.map((m, i) => {
                const r = appearUp(frame, 212 + i * 12, 14, 18);
                return (
                  <div key={m.n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "17px 22px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm, ...r }}>
                    <span style={{ fontSize: 30 }}>{m.e}</span>
                    <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink, width: 190 }}>{m.n}</span>
                    <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, color: COLORS.muted }}>{m.d}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <Sfx src="pop" at={12} volume={0.4} />
      <Sfx src="ding" at={118} volume={0.35} />
      {METRICS.map((m, i) => (
        <Sfx key={m.n} src="pop" at={212 + i * 12} volume={0.3} />
      ))}

      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene2: SceneDef = {
  id: "av2",
  index: 2,
  kicker: "How we score",
  title: "MOS + 4 metrics",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene2,
};
