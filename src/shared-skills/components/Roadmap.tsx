import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../theme";
import { appearUp, ramp, springPop } from "../anim";
import { Sfx } from "../audio";
import type { Cue } from "../captions";
import { Shell } from "./Shell";

/**
 * Promoted from the Git commit/push guide's "全集地圖" scene — a full-collection
 * roadmap shown right after the cover, so the viewer sees the whole trip before
 * it starts. Mark the last stop `gem: true` to glow and tease a payoff later in
 * the video (pairs with `PromptGem`, below).
 */
export type RoadmapStop = {
  n: number;
  emoji: string;
  zh: string;
  sub: string;
  color: string;
  gem?: boolean;
};

/** A short animated connector between two stops — draws then pulses a dot. */
const Connector: React.FC<{ progress: number; color: string }> = ({ progress, color }) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, progress));
  const len = 72;
  const tip = 6 + (len - 16) * p;
  const headOp = ramp(p, 0.5, 1);
  const dotT = (frame % 42) / 42;
  const dotX = 6 + (len - 16) * dotT;
  return (
    <svg width={len} height={24} style={{ overflow: "visible" }}>
      <line x1={6} y1={12} x2={tip} y2={12} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      {p > 0.99 ? <circle cx={dotX} cy={12} r={3} fill={color} opacity={Math.sin(Math.PI * dotT)} /> : null}
      <path d={`M ${tip - 7} 7 L ${tip} 12 L ${tip - 7} 17`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={headOp} />
    </svg>
  );
};

/** One numbered stop on the journey. The 💎 stop glows to tease the payoff. */
const Stop: React.FC<{ stop: RoadmapStop; delay: number; ribbon: string }> = ({ stop, delay, ribbon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = springPop(frame, fps, { delay, from: 0.8, dist: 22 });
  const pulse = stop.gem ? 0.5 + 0.5 * Math.sin((frame - delay) / 14) : 0;
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
        background: stop.gem ? `linear-gradient(180deg, ${stop.color}14, ${COLORS.surface})` : COLORS.surface,
        border: `2px solid ${stop.color}${stop.gem ? "" : "55"}`,
        boxShadow: stop.gem
          ? `0 0 0 1px ${stop.color}44, 0 20px 50px ${stop.color}${Math.round(30 + pulse * 34).toString(16)}`
          : SHADOW.md,
      }}
    >
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
      {stop.gem ? (
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
          {ribbon}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Full-collection roadmap / agenda scene — "here's the map before we start".
 *
 * `cues` must have `stops.length + 1` entries: `cues[0]` times the title,
 * `cues[i + 1]` times stop `i`'s reveal (the same convention a video's own
 * `buildScene([titleId, ...stopIds])` produces). Captions/VO stay video-local
 * (pass your own `<Captions cues={cues} />` via the `captions` prop) since the
 * manifest + audio folder differ per video.
 */
export const Roadmap: React.FC<{
  titleZh: string;
  titleEn?: string;
  stops: RoadmapStop[];
  keyText: string;
  cues: Cue[];
  durationInFrames: number;
  accent?: string;
  kicker?: string;
  brand: string;
  seed?: string;
  /** Text on the last (gem) stop's ribbon. */
  gemRibbon?: string;
  captions?: React.ReactNode;
}> = ({
  titleZh,
  titleEn,
  stops,
  keyText,
  cues,
  durationInFrames,
  accent = COLORS.remotion,
  kicker = "地圖 · Roadmap",
  brand,
  seed = "roadmap",
  gemRibbon = "⭐ 看到最後",
  captions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (i: number) => cues[i]?.from ?? 0;
  const title = appearUp(frame, at(0), 18, 22);

  return (
    <Shell durationInFrames={durationInFrames} accent={accent} kicker={kicker} seed={seed} brand={brand}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <div style={{ textAlign: "center", ...title }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, letterSpacing: -0.5, color: COLORS.ink, lineHeight: 1.18 }}>{titleZh}</div>
          {titleEn ? <div style={{ marginTop: 9, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted, letterSpacing: 0.4 }}>{titleEn}</div> : null}
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        {stops.map((stop, i) => (
          <React.Fragment key={stop.n}>
            <Stop stop={stop} delay={at(i + 1)} ribbon={gemRibbon} />
            {i < stops.length - 1 ? (
              <div style={{ paddingBottom: 26 }}>
                <Connector color={COLORS.borderStrong} progress={ramp(frame, at(i + 1) + 8, at(i + 2))} />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 132, display: "flex", justifyContent: "center", ...springPop(frame, fps, { delay: at(stops.length), from: 0.9, dist: 14 }) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${COLORS.hi.amber}`, boxShadow: SHADOW.sm }}>
          <span style={{ fontSize: 22 }}>💎</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft }}>{keyText}</span>
        </div>
      </div>

      <Sfx src="whoosh" at={at(1)} volume={0.32} />
      {stops.slice(1, -1).map((s, i) => (
        <Sfx key={s.n} src="pop" at={at(i + 2)} volume={0.3} />
      ))}
      <Sfx src="ding" at={at(stops.length)} volume={0.32} />
      {captions}
    </Shell>
  );
};
