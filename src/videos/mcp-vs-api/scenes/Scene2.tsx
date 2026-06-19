import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { API, API_FLOW } from "../data";
import { FlowArrow, Heading, IconBubble, Shell, ramp } from "../components";

const { cues: CUES, dur: DUR } = buildScene(["s2-c1", "s2-c2", "s2-c3"], { lead: 14, minDur: 235 });

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const note = appearUp(frame, 210, 16, 18);

  return (
    <Shell durationInFrames={DUR} accent={API.color} kicker="概念一 · API">
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <Heading zh="API ＝ 應用程式介面" en="Application Programming Interface" />
      </div>

      {/* restaurant-waiter flow */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 4 }}>
        {API_FLOW.map((step, i) => {
          const appear = springPop(frame, fps, { delay: 30 + i * 16, from: 0.5, dist: 18 });
          const active = i === 2 && frame > 30 + i * 16 + 10;
          return (
            <React.Fragment key={step.en}>
              <div style={{ width: 158, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: appear.opacity, transform: appear.transform }}>
                <IconBubble emoji={step.emoji} color={API.color} size={104} active={active} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft, lineHeight: 1.25 }}>{step.zh}</div>
                  <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.micro, color: COLORS.faint, marginTop: 3 }}>{step.en}</div>
                </div>
              </div>
              {i < API_FLOW.length - 1 ? (
                <div style={{ marginTop: 41 }}>
                  <FlowArrow width={70} color={API.color} progress={ramp(frame, 30 + (i + 1) * 16 - 6, 30 + (i + 1) * 16 + 14)} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      {/* "thousands of APIs, each different" note */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center", ...note }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "13px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft }}>世界上有 <span style={{ color: API.color }}>上萬種 API</span></span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.faint }} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>每一種規則與格式都不同 · REST、GraphQL…</span>
        </div>
      </div>

      <Sfx src="whoosh" at={30} volume={0.4} />
      {API_FLOW.map((s, i) => (
        <Sfx key={s.en} src="pop" at={30 + i * 16} volume={0.3} />
      ))}
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene2: SceneDef = {
  id: "s2",
  index: 2,
  kicker: "概念一 · API",
  title: "What is API",
  accent: API.color,
  durationInFrames: DUR,
  Component: Scene2,
};
