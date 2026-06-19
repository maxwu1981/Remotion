import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS, TOOLS_RANKED } from "../data";
import { Shell } from "../components";
import { ComparisonTable } from "../deepdive";

const DUR = 391;

const CUES: Cue[] = [
  { id: "av8-c1", from: 12, dur: 188, text: "Head-to-head: ElevenLabs & ChatTTS win naturalness and emotion." },
  { id: "av8-c2", from: 212, dur: 165, text: "The free tools win speed & value — every column has a different champion." },
];

const CHAMPS = [
  { e: "🗣️", label: "Most natural", who: "ElevenLabs", color: TOOLS.elevenlabs.color },
  { e: "❤️", label: "Most emotion", who: "ChatTTS", color: TOOLS.chattts.color },
  { e: "⚡", label: "Fastest", who: "Mac Siri", color: TOOLS.macsiri.color },
  { e: "💲", label: "Best value", who: "ChatTTS & Edge", color: TOOLS.edgetts.color },
];

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Shell durationInFrames={DUR} kicker="HEAD TO HEAD" accent={COLORS.ink}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 28, transform: "scale(1.12)" }}>
        {/* per-axis champions */}
        <div style={{ display: "flex", gap: 16 }}>
          {CHAMPS.map((c, i) => {
            const a = appearUp(frame, 210 + i * 10, 12, 16);
            return (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 18px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${c.color}55`, boxShadow: SHADOW.sm, ...a }}>
                <span style={{ fontSize: 20 }}>{c.e}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, fontWeight: 700, color: COLORS.muted }}>{c.label}</span>
                <span style={{ fontFamily: FONT.ui, fontSize: TYPE.small, fontWeight: 800, color: c.color }}>{c.who}</span>
              </div>
            );
          })}
        </div>

        <ComparisonTable tools={TOOLS_RANKED} delay={26} rowStep={12} />
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.faint }}>
          👑 = best in column · pricing approximate · *self-hosted compute only
        </div>
      </AbsoluteFill>

      <Sfx src="ding" at={12} volume={0.4} />
      {TOOLS_RANKED.map((t, i) => (
        <Sfx key={t.id} src="pop" at={26 + i * 12} volume={0.28} />
      ))}
      {CHAMPS.map((c, i) => (
        <Sfx key={c.label} src="pop" at={210 + i * 10} volume={0.3} />
      ))}

      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene8: SceneDef = {
  id: "av8",
  index: 8,
  kicker: "Head to head",
  title: "Full comparison",
  accent: COLORS.ink,
  durationInFrames: DUR,
  Component: Scene8,
};
