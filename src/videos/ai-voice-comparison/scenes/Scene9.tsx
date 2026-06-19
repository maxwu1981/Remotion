import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, Cue } from "../captions";
import { TOOLS, TOOLS_RANKED, Tool } from "../data";
import { Shell, ToolGlyph } from "../components";
import { Leaderboard } from "../deepdive";

const DUR = 414;

const CUES: Cue[] = [
  { id: "av9-c1", from: 12, dur: 90, text: "So here's your 3-second cheat sheet." },
  { id: "av9-c2", from: 108, dur: 300, text: "Free at scale? Edge. Podcasts? ChatTTS. An app? OpenAI. Pure quality? ElevenLabs." },
];

const ROWS: { need: string; tool: Tool; at: number }[] = [
  { need: "Free, at scale", tool: TOOLS.edgetts, at: 120 },
  { need: "Podcasts & dialogue", tool: TOOLS.chattts, at: 150 },
  { need: "Apps & automation", tool: TOOLS.openaitts, at: 180 },
  { need: "Pure quality", tool: TOOLS.elevenlabs, at: 210 },
];

const Row: React.FC<{ need: string; tool: Tool; at: number }> = ({ need, tool, at }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, at, 14, 18);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "15px 22px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm, ...a }}>
      <ToolGlyph tool={tool} size={48} />
      <span style={{ flex: 1, fontFamily: FONT.ui, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft }}>{need}</span>
      <span style={{ fontFamily: FONT.ui, fontSize: TYPE.h3, color: COLORS.faint }}>→</span>
      <span style={{ display: "inline-flex", alignItems: "center", padding: "8px 18px", borderRadius: RADIUS.pill, background: `${tool.color}18`, border: `1px solid ${tool.color}55`, fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small, color: tool.color }}>
        {tool.name}
      </span>
    </div>
  );
};

export const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const head = appearUp(frame, 8, 14, 16);
  const lhead = appearUp(frame, 14, 14, 16);

  return (
    <Shell durationInFrames={DUR} kicker="THE 3-SECOND CHEAT SHEET" accent={COLORS.remotion}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 56, transform: "scale(1.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
          {/* ranked overall scores — clear numbers instead of an overlaid radar */}
          <div style={{ width: 640 }}>
            <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink, letterSpacing: -0.5, marginBottom: 24, ...lhead }}>Overall score</div>
            <Leaderboard tools={TOOLS_RANKED} delay={26} width={640} />
          </div>

          {/* pick by your need */}
          <div style={{ width: 600 }}>
            <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h2, color: COLORS.ink, letterSpacing: -0.5, marginBottom: 24, ...head }}>Pick by your need 👇</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ROWS.map((r) => (
                <Row key={r.tool.id} {...r} />
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <Sfx src="ding" at={12} volume={0.4} />
      {ROWS.map((r) => (
        <Sfx key={r.tool.id} src="pop" at={r.at} volume={0.34} />
      ))}

      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene9: SceneDef = {
  id: "av9",
  index: 9,
  kicker: "Cheat sheet",
  title: "Pick by your need",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene9,
};
