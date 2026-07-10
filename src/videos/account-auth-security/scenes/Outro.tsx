import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, TextWall, BrandGlyph, type Block } from "../components";
import { RECAP_A, RECAP_B } from "../content";
import { MOTIF, PAL } from "../data";
import { BRAND } from "../brand";

/* ----------------------------------------------------------------- recap 1/2 */

const recapScene = (ids: string[], part: string): { Component: React.FC; def: SceneDef } => {
  const { cues, dur } = buildScene(ids, { lead: 12, minDur: 420 });
  const Component: React.FC = () => {
    const accent = MOTIF.outro;
    const blocks: Block[] = cues.map((c) => ({ text: c.text, from: c.from, kind: "bullet" }));
    return (
      <Shell no="11" titleZh={`一頁速查 · ${part}`} titleEn="One-page cheat sheet" accent={accent} durationInFrames={dur} seed={`recap-${part}`}>
        <TextWall accent={accent} blocks={blocks} top={236} fontSize={21} gap={10} width={1700} />
        <Captions cues={cues} />
      </Shell>
    );
  };
  const def: SceneDef = {
    id: `recap-${part}`,
    index: 90,
    kicker: "速查 · Recap",
    title: `Recap ${part}`,
    accent: MOTIF.outro,
    durationInFrames: dur,
    Component,
  };
  return { Component, def };
};

const a = recapScene(RECAP_A, "1");
const b = recapScene(RECAP_B, "2");
export const RecapA = a.Component;
export const RecapB = b.Component;
export const recapA = a.def;
export const recapB = b.def;

/* --------------------------------------------------------------------- outro */

const { cues: OT_CUES, dur: OT_DUR } = buildScene(["ot-cta"], { lead: 10, tail: 60, minDur: 360 });

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a2 = appearUp(frame, 8, 18, 26);
  const ctas = [
    { icon: "👍", t: "按讚", c: PAL.yes },
    { icon: "🔔", t: "訂閱", c: COLORS.error },
    { icon: "🔗", t: "分享", c: MOTIF.outro },
  ];
  return (
    <Shell durationInFrames={OT_DUR} showChrome={false} showHead={false} accent={MOTIF.outro} seed="outro">
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...a2, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ fontWeight: 800, fontSize: 96, letterSpacing: -1, color: COLORS.ink }}>
            感謝{" "}
            <span style={{ background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>觀看</span>！
          </div>
          <div style={{ fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>寧可發一把又弱又可撤的限定鑰匙，也不要把萬能鑰匙交出去 🔑</div>
          <div style={{ display: "flex", gap: 26 }}>
            {ctas.map((cta, i) => {
              const p = springPop(frame, fps, { delay: 26 + i * 6, from: 0.5, dist: 16 });
              return (
                <div key={cta.t} style={{ ...p, display: "flex", alignItems: "center", gap: 14, padding: "18px 36px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${cta.c}`, boxShadow: SHADOW.md }}>
                  <span style={{ fontSize: 40 }}>{cta.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: TYPE.h2, color: cta.c }}>{cta.t}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
            <BrandGlyph size={28} />
            <span style={{ fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{BRAND.name}</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.faint }} />
            <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>{BRAND.date}</span>
          </div>
        </div>
      </div>

      <Sfx src="whoosh" at={6} volume={0.34} />
      <Sfx src="pop" at={26} volume={0.34} />
      <Captions cues={OT_CUES} />
    </Shell>
  );
};

export const outro: SceneDef = {
  id: "ot",
  index: 99,
  kicker: "結語 · Outro",
  title: "Outro",
  accent: MOTIF.outro,
  durationInFrames: OT_DUR,
  Component: Outro,
};
