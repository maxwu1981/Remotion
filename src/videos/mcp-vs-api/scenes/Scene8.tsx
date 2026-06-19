import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { API, MCP } from "../data";
import { ConnectorGlyph, Shell } from "../components";

const { cues: CUES, dur: DUR } = buildScene(["s8-c1", "s8-c2"], { lead: 14, minDur: 230 });

const CTA = [
  { emoji: "👍", zh: "按讚", color: COLORS.remotion },
  { emoji: "🔔", zh: "追蹤", color: MCP.color },
  { emoji: "💬", zh: "留言討論", color: COLORS.teal },
];

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMcp = springPop(frame, fps, { delay: 10, from: 0.6, dist: 20 });
  const tApi = springPop(frame, fps, { delay: 18, from: 0.6, dist: 20 });
  const recap = appearUp(frame, 42, 18, 22);
  const sign = appearUp(frame, 120, 18, 20);

  return (
    <Shell durationInFrames={DUR} accent={MCP.color} kicker="結尾 · Outro">
      {/* the two come together */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 258, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 142, letterSpacing: -4, color: MCP.color, ...tMcp }}>MCP</span>
        <div style={{ opacity: tApi.opacity }}>
          <ConnectorGlyph size={92} />
        </div>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 142, letterSpacing: -4, color: API.color, ...tApi }}>API</span>
      </div>

      {/* memorable recap line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 472, textAlign: "center", ...recap }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 60, color: COLORS.ink, letterSpacing: -0.5 }}>
          <span style={{ color: API.color }}>API</span> 是橋樑，<span style={{ color: MCP.color }}>MCP</span> 是轉接頭
        </span>
      </div>

      {/* call to action */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 612, display: "flex", justifyContent: "center", gap: 22 }}>
        {CTA.map((c, i) => {
          const a = springPop(frame, fps, { delay: 70 + i * 10, from: 0.5, dist: 16 });
          return (
            <div key={c.zh} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "15px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${c.color}44`, boxShadow: SHADOW.md, opacity: a.opacity, transform: a.transform }}>
              <span style={{ fontSize: 34 }}>{c.emoji}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: c.color }}>{c.zh}</span>
            </div>
          );
        })}
      </div>

      {/* sign-off */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 792, textAlign: "center", ...sign }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h2, color: COLORS.inkSoft }}>我們下次見 👋</span>
      </div>

      <Sfx src="pop" at={10} volume={0.45} />
      <Sfx src="pop" at={18} volume={0.45} />
      {CTA.map((c, i) => (
        <Sfx key={c.zh} src="ding" at={70 + i * 10} volume={0.26} />
      ))}
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene8: SceneDef = {
  id: "s8",
  index: 8,
  kicker: "結尾 · Outro",
  title: "Outro",
  accent: MCP.color,
  durationInFrames: DUR,
  Component: Scene8,
};
