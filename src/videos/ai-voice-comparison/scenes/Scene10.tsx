import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS_RANKED } from "../data";
import { Shell, ToolGlyph } from "../components";

const DUR = 336;

const CUES: Cue[] = [
  { id: "av10-c1", from: 16, dur: 150, text: "The best AI voice isn't the priciest — it's the one that fits your job." },
  { id: "av10-c2", from: 180, dur: 130, text: "So which one are you picking? Tell me in the comments 👇" },
];

const Shimmer: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + dur], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < start || frame > start + dur + 6) return null;
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: RADIUS.xl, background: `linear-gradient(105deg, transparent ${t - 16}%, rgba(255,255,255,0.8) ${t}%, transparent ${t + 16}%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
  );
};

export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v1 = springPop(frame, fps, { delay: 16, from: 0.9, dist: 22 });
  const v2 = appearUp(frame, 44, 16, 20);
  const hook = springPop(frame, fps, { delay: 180, from: 0.8, dist: 24 });
  const sub = appearUp(frame, 208, 16, 18);
  const fade = interpolate(frame, [DUR - 32, DUR - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={COLORS.remotion}>
      <AbsoluteFill style={{ opacity: fade }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
          <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 60, lineHeight: 1.1, letterSpacing: -1, color: COLORS.muted, ...v1 }}>
            The best AI voice isn't the priciest.
          </div>
          <div style={{ marginTop: 12, fontFamily: FONT.ui, fontWeight: 800, fontSize: 76, lineHeight: 1.05, letterSpacing: -1.5, color: COLORS.ink, ...v2 }}>
            It's the one that{" "}
            <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>fits your job</span>.
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", padding: "22px 46px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, opacity: hook.opacity, transform: hook.transform }}>
            <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 56, letterSpacing: -1, color: COLORS.ink, textAlign: "center" }}>
              Which one will <span style={{ color: COLORS.remotion }}>YOU</span> pick? 👇
            </div>
            <Shimmer start={198} dur={44} />
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontFamily: FONT.ui, fontSize: TYPE.h3, fontWeight: 600, color: COLORS.muted, ...sub }}>
          Drop your pick in the comments.
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, display: "flex", justifyContent: "center", gap: 30 }}>
          {TOOLS_RANKED.map((t, i) => {
            const g = springPop(frame, fps, { delay: 212 + i * 7, from: 0.6, dist: 16 });
            return (
              <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: g.opacity, transform: g.transform }}>
                <ToolGlyph tool={t} size={58} />
                <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, color: COLORS.muted }}>{t.name}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Sfx src="pop" at={16} volume={0.45} />
      <Sfx src="whoosh" at={180} volume={0.5} />
      <Sfx src="ding" at={198} volume={0.45} />

      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene10: SceneDef = {
  id: "av10",
  index: 10,
  kicker: "CTA",
  title: "Which will you pick?",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene10,
};
