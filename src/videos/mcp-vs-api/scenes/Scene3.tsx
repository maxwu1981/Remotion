import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { GlassPanel, LightStream } from "../../../shared-skills/components/lux";
import { Captions, buildScene } from "../captions";
import { MCP, MCP_SOURCES } from "../data";
import { Heading, IconBubble, Shell, ramp } from "../components";

const { cues: CUES, dur: DUR } = buildScene(["s3-c1", "s3-c2", "s3-c3"], { lead: 14, minDur: 200 });

/** Pixel centres so the SVG links line up with the absolutely-placed nodes. */
const AI = { cx: 540, cy: 566 };
const HUB = { cx: 880, cy: 566 };
const SRC_X = 1290;
const SRC_Y = [338, 490, 642, 794];

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ai = springPop(frame, fps, { delay: 16, from: 0.6, dist: 20 });
  const hub = springPop(frame, fps, { delay: 34, from: 0.4, dist: 0 });
  const sub = appearUp(frame, 50, 16, 18);
  const spokeP = ramp(frame, 64, 96);
  const aiP = ramp(frame, 40, 64);

  return (
    <Shell durationInFrames={DUR} accent={MCP.color} kicker="概念二 · MCP">
      <div style={{ position: "absolute", left: 0, right: 0, top: 142, display: "flex", justifyContent: "center" }}>
        <Heading zh="MCP ＝ 模型上下文協定" en="Model Context Protocol" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", ...sub }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px", borderRadius: RADIUS.pill, background: `${MCP.color}14`, border: `1.5px solid ${MCP.color}44` }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: MCP.deep }}>由 Anthropic 推出的開源標準 · Open standard</span>
        </div>
      </div>

      {/* connecting links (under the nodes) */}
      <LightStream from={[AI.cx + 108, AI.cy]} to={[HUB.cx - 78, HUB.cy]} ctrl={[(AI.cx + HUB.cx) / 2, AI.cy]} progress={aiP} color={COLORS.remotion} particles={3} speed={50} particleFrom={70} />
      {SRC_Y.map((y, i) => (
        <LightStream key={i} from={[HUB.cx + 78, HUB.cy]} to={[SRC_X - 60, y]} ctrl={[HUB.cx + 240, (HUB.cy + y) / 2]} progress={spokeP} color={MCP.color} particles={3} speed={58} particleFrom={96} />
      ))}

      {/* AI model */}
      <div style={{ position: "absolute", left: AI.cx - 110, top: AI.cy - 92, width: 220, height: 184, opacity: ai.opacity, transform: ai.transform }}>
        <GlassPanel glow={COLORS.remotion} glowAmt={0.5} radius={28} style={{ width: "100%", height: "100%" }}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 64 }}>🤖</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>AI 模型</span>
            <span style={{ fontFamily: FONT.mono, fontSize: TYPE.tiny, color: COLORS.muted }}>AI model</span>
          </div>
        </GlassPanel>
      </div>

      {/* the single MCP connector / hub */}
      <div style={{ position: "absolute", left: HUB.cx - 78, top: HUB.cy - 78, width: 156, height: 156, opacity: hub.opacity, transform: hub.transform }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(150deg, ${MCP.color}, ${MCP.deep})`, boxShadow: `0 22px 50px -12px ${MCP.color}aa, 0 0 0 10px ${MCP.color}1f` }}>
          <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 46, color: "#fff", letterSpacing: 1 }}>MCP</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.tiny, color: "#ffffffdd", marginTop: 2 }}>統一標準接口</span>
        </div>
      </div>

      {/* the sources reached through one standard */}
      {MCP_SOURCES.map((s, i) => {
        const appear = springPop(frame, fps, { delay: 84 + i * 12, from: 0.5, dist: 16 });
        return (
          <div key={s.en} style={{ position: "absolute", left: SRC_X - 42, top: SRC_Y[i] - 42, display: "flex", alignItems: "center", gap: 16, opacity: appear.opacity, transform: appear.transform }}>
            <IconBubble emoji={s.emoji} color={MCP.color} size={84} />
            <div>
              <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft }}>{s.zh}</div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.tiny, color: COLORS.faint }}>{s.en}</div>
            </div>
          </div>
        );
      })}

      <Sfx src="processing" at={64} volume={0.3} />
      {MCP_SOURCES.map((s, i) => (
        <Sfx key={s.en} src="ding" at={84 + i * 12} volume={0.22} />
      ))}
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene3: SceneDef = {
  id: "s3",
  index: 3,
  kicker: "概念二 · MCP",
  title: "What is MCP",
  accent: MCP.color,
  durationInFrames: DUR,
  Component: Scene3,
};
