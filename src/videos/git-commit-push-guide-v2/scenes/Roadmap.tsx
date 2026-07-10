import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, FlowArrow, ramp } from "../components";
import { ROADMAP, ROADMAP_KEY, PAL, MOTIF } from "../data";

const IDS = ["rm-c1", "rm-c2", "rm-c3", "rm-c4", "rm-c5"];
const { cues: CUES, dur: DUR } = buildScene(IDS, { lead: 12, minDur: 330 });
const at = (i: number) => CUES[i].from;

/** One numbered stop on the journey. The 💎 stop glows to tease the payoff. */
const Stop: React.FC<{ stop: (typeof ROADMAP)[number]; delay: number }> = ({ stop, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = springPop(frame, fps, { delay, from: 0.8, dist: 22 });
  const gem = "gem" in stop && stop.gem;
  // gentle breathing glow on the take-away stop
  const pulse = gem ? 0.5 + 0.5 * Math.sin((frame - delay) / 14) : 0;
  return (
    <div
      style={{
        ...a,
        width: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "30px 22px",
        borderRadius: RADIUS.xl,
        background: gem ? `linear-gradient(180deg, ${stop.color}14, ${COLORS.surface})` : COLORS.surface,
        border: `2px solid ${stop.color}${gem ? "" : "55"}`,
        boxShadow: gem ? `0 0 0 1px ${stop.color}44, 0 20px 50px ${stop.color}${Math.round(30 + pulse * 34).toString(16)}` : SHADOW.md,
      }}
    >
      {/* number badge + emoji */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: stop.color,
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT.ui,
            fontWeight: 800,
            fontSize: 26,
            boxShadow: `0 6px 16px ${stop.color}66`,
          }}
        >
          {stop.n}
        </span>
        <span style={{ fontSize: 44 }}>{stop.emoji}</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, lineHeight: 1.2 }}>{stop.zh}</div>
        <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted, lineHeight: 1.35 }}>{stop.sub}</div>
      </div>
      {gem ? (
        <div
          style={{
            marginTop: 4,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: RADIUS.pill,
            background: stop.color,
            color: "#3A2A00",
            fontFamily: FONT.uiCjk,
            fontWeight: 800,
            fontSize: TYPE.tiny,
          }}
        >
          ⭐ 看到最後
        </div>
      ) : null}
    </div>
  );
};

export const Roadmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Shell durationInFrames={DUR} accent={PAL.struct} kicker="地圖 · Roadmap" seed="roadmap">
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <Heading zh="先看地圖：這支影片帶你走完四站" en="Your roadmap — four stops to master it" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        {ROADMAP.map((stop, i) => (
          <React.Fragment key={stop.n}>
            <Stop stop={stop} delay={at(i + 1)} />
            {i < ROADMAP.length - 1 ? (
              <div style={{ paddingBottom: 26 }}>
                <FlowArrow width={72} thickness={3} color={COLORS.borderStrong} progress={ramp(frame, at(i + 1) + 8, at(i + 2))} />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 132, display: "flex", justifyContent: "center", ...springPop(frame, fps, { delay: at(4), from: 0.9, dist: 14 }) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${COLORS.hi.amber}`, boxShadow: SHADOW.sm }}>
          <span style={{ fontSize: 22 }}>💎</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft }}>{ROADMAP_KEY}</span>
        </div>
      </div>

      <Sfx src="whoosh" at={at(1)} volume={0.32} />
      <Sfx src="pop" at={at(2)} volume={0.3} />
      <Sfx src="pop" at={at(3)} volume={0.3} />
      <Sfx src="ding" at={at(4)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const roadmap: SceneDef = {
  id: "rm",
  index: 1,
  kicker: "地圖 · Roadmap",
  title: "Roadmap",
  accent: MOTIF.commit,
  durationInFrames: DUR,
  Component: Roadmap,
};
