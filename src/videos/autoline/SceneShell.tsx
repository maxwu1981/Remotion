import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { BRAND } from "./brand";
import { enter } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";

/**
 * Per-scene frame: light backdrop, persistent top chrome (section kicker + title
 * + brand lockup) and a bottom progress bar. Progress is driven by the scene's
 * own length, so it reads correctly both standalone and inside the movie.
 * Decoupled from any script — everything comes in as props.
 */
export const SceneShell: React.FC<{
  kicker: string;
  title: string;
  accent?: string;
  durationInFrames: number;
  chromeFrom?: number;
  showChrome?: boolean;
  children: React.ReactNode;
}> = ({
  kicker,
  title,
  accent = COLORS.remotion,
  durationInFrames,
  chromeFrom = 0,
  showChrome = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const headIn = enter(frame, chromeFrom, 14);
  const progress = Math.max(
    0,
    Math.min(1, frame / Math.max(1, durationInFrames - 1)),
  );

  return (
    <AbsoluteFill style={{ fontFamily: FONT.ui, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={kicker} />

      <AbsoluteFill>{children}</AbsoluteFill>

      {showChrome ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 54,
              left: 96,
              right: 96,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              opacity: headIn,
              transform: `translateY(${(1 - headIn) * -14}px)`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  alignSelf: "flex-start",
                  padding: "7px 16px",
                  borderRadius: RADIUS.pill,
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: SHADOW.sm,
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: accent,
                    boxShadow: `0 0 0 4px ${accent}22`,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: TYPE.micro,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: COLORS.muted,
                  }}
                >
                  SEQUENCE {kicker}
                </span>
              </div>
              <div
                style={{
                  fontSize: TYPE.h3,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: COLORS.ink,
                }}
              >
                {title}
              </div>
            </div>

            <BrandMark accent={accent} />
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 6,
              background: COLORS.bgAlt,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${accent}, ${COLORS.teal})`,
                boxShadow: `0 0 14px ${accent}88`,
              }}
            />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const BrandMark: React.FC<{ accent: string }> = ({ accent }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 16px 9px 9px",
      borderRadius: RADIUS.pill,
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      boxShadow: SHADOW.sm,
    }}
  >
    <span
      style={{
        width: 30,
        height: 30,
        borderRadius: 9,
        background: `linear-gradient(135deg, ${accent}, ${COLORS.teal})`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={15} height={15} viewBox="0 0 24 24">
        <path d="M8 5l11 7-11 7z" fill="#fff" />
      </svg>
    </span>
    <span
      style={{
        fontFamily: FONT.ui,
        fontWeight: 800,
        fontSize: TYPE.small,
        color: COLORS.ink,
        letterSpacing: -0.3,
      }}
    >
      {BRAND.pre}
      <span style={{ color: accent }}>{BRAND.post}</span>
    </span>
    <span
      style={{
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: 1.5,
        color: COLORS.faint,
        borderLeft: `1px solid ${COLORS.border}`,
        paddingLeft: 10,
      }}
    >
      {BRAND.course}
    </span>
  </div>
);
