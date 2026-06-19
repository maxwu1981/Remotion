import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { GlassPanel } from "../../../shared-skills/components/lux";
import { Captions, buildScene } from "../captions";
import { TAKEAWAYS } from "../data";
import { BRAND } from "../brand";
import { ConnectorGlyph, Heading, Shell } from "../components";

const { cues: CUES, dur: DUR } = buildScene(["s7-c1", "s7-c2", "s7-c3"], { lead: 14, minDur: 160 });

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const tag = appearUp(frame, 124, 18, 20);

  return (
    <Shell durationInFrames={DUR} accent={COLORS.remotion} kicker="總結 · Takeaway">
      <div style={{ position: "absolute", left: 0, right: 0, top: 158, display: "flex", justifyContent: "center" }}>
        <Heading zh="一句話總結" en="In one line" />
      </div>

      {/* two takeaway cards */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 326, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {TAKEAWAYS.map((t, i) => {
          const a = appearUp(frame, 30 + i * 24, 18, 24);
          return (
            <div key={t.side.label} style={{ width: 1240, ...a }}>
              <GlassPanel tint={t.side.color} glow={t.side.color} glowAmt={0.35} radius={26} style={{ width: "100%" }}>
                <div style={{ padding: "28px 34px", display: "flex", alignItems: "center", gap: 30 }}>
                  <div style={{ flexShrink: 0, width: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 58, color: t.side.color, letterSpacing: 0.5 }}>{t.side.label}</span>
                  </div>
                  <div style={{ width: 2, alignSelf: "stretch", background: `${t.side.color}33`, borderRadius: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, lineHeight: 1.35 }}>{t.zh}</div>
                    <div style={{ marginTop: 6, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted }}>{t.en}</div>
                  </div>
                </div>
              </GlassPanel>
            </div>
          );
        })}
      </div>

      {/* closing tagline */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center", ...tag }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "15px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
          <ConnectorGlyph size={26} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{BRAND.tagline}</span>
        </div>
      </div>

      <Sfx src="ding" at={30} volume={0.3} />
      <Sfx src="ding" at={54} volume={0.3} />
      <Sfx src="pop" at={124} volume={0.4} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene7: SceneDef = {
  id: "s7",
  index: 7,
  kicker: "總結 · Takeaway",
  title: "Summary",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Scene7,
};
