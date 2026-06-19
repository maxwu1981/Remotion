import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { ArrowLink, GlassPanel } from "../../../shared-skills/components/lux";
import { Captions, buildScene } from "../captions";
import { API, MCP, RELATION } from "../data";
import { Heading, Shell, ramp } from "../components";

const { cues: CUES, dur: DUR } = buildScene(["s4-c1", "s4-c2", "s4-c3"], { lead: 14, minDur: 205 });

const PIPE_Y = 372;
const NODES = [
  { cx: 320, zh: "AI 模型", en: "AI model", emoji: "🤖", color: COLORS.remotion },
  { cx: 720, zh: "MCP 伺服器", en: "MCP server", emoji: "🔌", color: MCP.color, big: true, note: "封裝 · 翻譯" },
  { cx: 1110, zh: "外部 API", en: "External API", emoji: "🌐", color: API.color },
  { cx: 1480, zh: "資料", en: "Data", emoji: "📦", color: COLORS.teal },
];

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Shell durationInFrames={DUR} accent={MCP.color} kicker="關係 · 相輔相成">
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <Heading zh="其實是合作，不是競爭" en="They cooperate — not compete" />
      </div>

      {/* forward connectors */}
      <ArrowLink from={[410, PIPE_Y]} to={[618, PIPE_Y]} progress={ramp(frame, 36, 56)} color={COLORS.remotion} />
      <ArrowLink from={[822, PIPE_Y]} to={[1018, PIPE_Y]} progress={ramp(frame, 50, 70)} color={MCP.color} />
      <ArrowLink from={[1202, PIPE_Y]} to={[1388, PIPE_Y]} progress={ramp(frame, 64, 84)} color={API.color} />
      {/* return path: data flows back, standardized */}
      <ArrowLink from={[1480, PIPE_Y + 70]} to={[320, PIPE_Y + 70]} ctrl={[900, PIPE_Y + 200]} progress={ramp(frame, 92, 124)} color={COLORS.teal} dotR={2.6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: PIPE_Y + 188, display: "flex", justifyContent: "center", opacity: ramp(frame, 110, 130) }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.teal, background: COLORS.surface, padding: "5px 16px", borderRadius: RADIUS.pill, border: `1px solid ${COLORS.teal}40` }}>資料回傳 · 統一標準格式</span>
      </div>

      {/* pipeline nodes */}
      {NODES.map((n, i) => {
        const appear = springPop(frame, fps, { delay: 16 + i * 14, from: 0.5, dist: 18 });
        const w = n.big ? 200 : 178;
        const h = n.big ? 150 : 128;
        return (
          <div key={n.en} style={{ position: "absolute", left: n.cx - w / 2, top: PIPE_Y - h / 2, width: w, height: h, opacity: appear.opacity, transform: appear.transform }}>
            <GlassPanel tint={n.color} glow={n.big ? n.color : undefined} glowAmt={n.big ? 0.5 : 0} radius={24} style={{ width: "100%", height: "100%" }}>
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <span style={{ fontSize: n.big ? 46 : 38 }}>{n.emoji}</span>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: n.big ? TYPE.h3 : TYPE.body, color: COLORS.ink }}>{n.zh}</span>
                {n.note ? (
                  <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: n.color }}>{n.note}</span>
                ) : (
                  <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, color: COLORS.faint }}>{n.en}</span>
                )}
              </div>
            </GlassPanel>
          </div>
        );
      })}

      {/* the two key points */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 40 }}>
        {RELATION.map((r, i) => {
          const a = appearUp(frame, 132 + i * 16, 18, 22);
          return (
            <div key={r.en} style={{ width: 740, ...a }}>
              <GlassPanel radius={24} style={{ width: "100%" }}>
                <div style={{ padding: "26px 30px", display: "flex", gap: 18 }}>
                  <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 14, background: `${MCP.color}1a`, border: `1.5px solid ${MCP.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontWeight: 800, fontSize: TYPE.body, color: MCP.deep }}>{i + 1}</div>
                  <div>
                    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, letterSpacing: -0.3 }}>{r.zh}</div>
                    <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.micro, color: COLORS.faint, margin: "3px 0 10px" }}>{r.en}</div>
                    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: TYPE.small, lineHeight: 1.5, color: COLORS.inkSoft }}>{r.body}</div>
                  </div>
                </div>
              </GlassPanel>
            </div>
          );
        })}
      </div>

      <Sfx src="whoosh" at={36} volume={0.4} />
      <Sfx src="processing" at={64} volume={0.28} />
      <Sfx src="ding" at={132} volume={0.3} />
      <Sfx src="ding" at={148} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene4: SceneDef = {
  id: "s4",
  index: 4,
  kicker: "關係 · 相輔相成",
  title: "Relationship",
  accent: MCP.color,
  durationInFrames: DUR,
  Component: Scene4,
};
