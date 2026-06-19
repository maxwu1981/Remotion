import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS_RANKED } from "../data";
import { EqualizerBars, Shell, ToolGlyph } from "../components";

const DUR = 332;

const CUES: Cue[] = [
  { id: "av1-c1", from: 14, dur: 130, text: "Five AI voices. Only one is right for you." },
  { id: "av1-c2", from: 150, dur: 160, text: "Pick wrong and you waste time or money — so I scored all 5, on the data." },
];

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = springPop(frame, fps, { delay: 14, from: 0.8, dist: 20 });
  const l2 = springPop(frame, fps, { delay: 150, from: 0.85, dist: 22 });
  const chip = appearUp(frame, 170, 16, 20);
  const eqOpacity = interpolate(frame, [0, 20], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={COLORS.remotion}>
      {/* equalizer behind the title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: eqOpacity }}>
        <EqualizerBars color={COLORS.remotion} count={18} barW={10} height={120} gap={9} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 118, lineHeight: 1.0, letterSpacing: -3, color: COLORS.ink, ...l1 }}>
          5 AI VOICES.
        </div>
        <div style={{ marginTop: 14, fontFamily: FONT.ui, fontWeight: 800, fontSize: 76, lineHeight: 1.05, letterSpacing: -1.5, color: COLORS.muted, ...l2 }}>
          Which one is for{" "}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>YOU</span>?
        </div>
      </div>

      {/* the five contenders fly in */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", gap: 34 }}>
        {TOOLS_RANKED.map((t, i) => {
          const g = springPop(frame, fps, { delay: 70 + i * 9, from: 0.5, dist: 26 });
          return (
            <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: g.opacity, transform: g.transform }}>
              <div style={{ position: "relative" }}>
                <ToolGlyph tool={t} size={92} />
                <span style={{ position: "absolute", right: -8, top: -8, width: 30, height: 30, borderRadius: "50%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 18, color: COLORS.muted }}>?</span>
              </div>
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, color: COLORS.muted }}>{t.name}</span>
            </div>
          );
        })}
      </div>

      {/* cost-of-getting-it-wrong chip */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", ...chip }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 26px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.error}40`, boxShadow: SHADOW.glow(COLORS.error) }}>
          <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>⏱ waste time</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.faint }} />
          <span style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>💸 waste money</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.remotion }}>→ USE THE DATA</span>
        </div>
      </div>

      <Sfx src="ui-pop.mp3" at={14} volume={0.5} />
      {TOOLS_RANKED.map((t, i) => (
        <Sfx key={t.id} src="pop" at={70 + i * 9} volume={0.3} />
      ))}
      <Sfx src="whoosh" at={150} volume={0.45} />

      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene1: SceneDef = {
  id: "av1",
  index: 1,
  kicker: "The question",
  title: "Hook",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene1,
};
