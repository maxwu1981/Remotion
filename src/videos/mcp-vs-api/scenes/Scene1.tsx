import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { API, MCP } from "../data";
import { Shell } from "../components";

const { cues: CUES, dur: DUR } = buildScene(["s1-c1", "s1-c2"], { lead: 14, minDur: 170 });

/** Animated link between the two big tokens — particles drift both ways. */
const HeroLink: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const w = 190;
  const reveal = interpolate(progress, [0, 1], [10, w - 10]);
  return (
    <svg width={w} height={70} style={{ overflow: "visible" }}>
      <line x1={10} y1={35} x2={reveal} y2={35} stroke={COLORS.borderStrong} strokeWidth={3} strokeLinecap="round" />
      {progress > 0.95
        ? new Array(4).fill(0).map((_, i) => {
            const t = (((frame / 46 + i / 4) % 1) + 1) % 1;
            const x = 10 + (w - 20) * t;
            const c = i % 2 === 0 ? MCP.color : API.color;
            return <circle key={i} cx={x} cy={35} r={4.5} fill={c} opacity={Math.sin(Math.PI * t)} style={{ filter: `drop-shadow(0 0 6px ${c})` }} />;
          })
        : null}
      <circle cx={10} cy={35} r={6} fill={MCP.color} />
      <circle cx={w - 10} cy={35} r={6} fill={API.color} />
    </svg>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMcp = springPop(frame, fps, { delay: 10, from: 0.6, dist: 24 });
  const tApi = springPop(frame, fps, { delay: 22, from: 0.6, dist: 24 });
  const linkP = interpolate(frame, [34, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const q = appearUp(frame, 70, 18, 24);
  const sub = appearUp(frame, 84, 18, 20);
  const tag = appearUp(frame, 150, 16, 18);

  return (
    <Shell durationInFrames={DUR} showChrome={false} accent={COLORS.remotion}>
      {/* two contenders + the link between them */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 268, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 168, letterSpacing: -5, color: MCP.color, ...tMcp }}>MCP</span>
        <div style={{ opacity: tApi.opacity }}>
          <HeroLink progress={linkP} />
        </div>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 168, letterSpacing: -5, color: API.color, ...tApi }}>API</span>
      </div>

      {/* the question */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 510, textAlign: "center", ...q }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 76, letterSpacing: -1, color: COLORS.ink }}>
          它們有什麼{" "}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>關係</span>
          ？又差在哪？
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 624, textAlign: "center", ...sub }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.h3, color: COLORS.muted, letterSpacing: 0.5 }}>
          How MCP relates to APIs — and what&rsquo;s different
        </span>
      </div>

      {/* tagline chip */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", ...tag }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: API.color }}>API ＝ 軟體溝通的橋樑</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.faint }} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: MCP.color }}>MCP ＝ AI 的萬能轉接頭</span>
        </div>
      </div>

      <Sfx src="pop" at={10} volume={0.45} />
      <Sfx src="pop" at={22} volume={0.45} />
      <Sfx src="whoosh" at={34} volume={0.4} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene1: SceneDef = {
  id: "s1",
  index: 1,
  kicker: "開場 · Intro",
  title: "Hook",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene1,
};
