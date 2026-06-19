import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { BRAND } from "../brand";
import { ToolTile, ToolKey } from "../mockups/nodes";

const { cues: CUES, dur: DUR } = buildScene(["cov-c1", "cov-c2"], { lead: 10, minDur: 200 });

const PIPELINE: ToolKey[] = ["obs", "whisper", "gpt4o", "tts", "ffmpeg", "remotion"];

export const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mark = springPop(frame, fps, { delay: 8, from: 0.72, dist: 26 });
  const hero = appearUp(frame, 30, 18, 26);
  const tag = appearUp(frame, 50, 18, 20);
  const rail = appearUp(frame, 74, 18, 22);
  const railGlow = interpolate(frame, [90, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell kicker="00 / 09" title="" accent={COLORS.remotion} durationInFrames={DUR} showChrome={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.ui }}>
        {/* kicker pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 18px",
            borderRadius: RADIUS.pill,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow: SHADOW.sm,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: TYPE.tiny,
            letterSpacing: 2,
            color: COLORS.muted,
            opacity: mark.opacity,
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: COLORS.remotion }} />
          REMOTION × CLAUDE COWORK · 自動化教學
        </div>

        {/* wordmark */}
        <div
          style={{
            marginTop: 28,
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: 120,
            letterSpacing: -3,
            color: COLORS.ink,
            ...mark,
          }}
        >
          {BRAND.pre}
          <span
            style={{
              background: GRADIENT.remotion,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {BRAND.post}
          </span>
        </div>

        {/* chinese hero */}
        <div
          style={{
            marginTop: 14,
            fontFamily: FONT.uiCjk,
            fontWeight: 800,
            fontSize: 64,
            letterSpacing: 1,
            color: COLORS.ink,
            ...hero,
          }}
        >
          {BRAND.hero[0]}
          <span style={{ color: COLORS.faint, margin: "0 18px", fontWeight: 400 }}>·</span>
          {BRAND.hero[1]}
        </div>

        {/* tagline */}
        <div
          style={{
            marginTop: 22,
            maxWidth: 1180,
            textAlign: "center",
            fontFamily: FONT.uiCjk,
            fontSize: TYPE.h3,
            fontWeight: 500,
            color: COLORS.muted,
            lineHeight: 1.4,
            ...tag,
          }}
        >
          {BRAND.tagline}
        </div>

        {/* pipeline rail */}
        <div
          style={{
            marginTop: 50,
            display: "flex",
            alignItems: "center",
            gap: 18,
            ...rail,
          }}
        >
          {PIPELINE.map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 ? (
                <span
                  style={{
                    width: 30,
                    height: 2,
                    borderRadius: 2,
                    background: COLORS.borderStrong,
                    opacity: 0.4 + 0.6 * railGlow,
                  }}
                />
              ) : null}
              <div
                style={{
                  transform: `translateY(${(1 - railGlow) * 8 * (i % 2 ? 1 : -1)}px)`,
                }}
              >
                <ToolTile tool={t} size={58} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </AbsoluteFill>

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const cover: SceneDef = {
  id: "cover",
  index: 0,
  kicker: "00 / 09",
  title: "Intro",
  accent: COLORS.remotion,
  durationInFrames: DUR,
  Component: Cover,
};
