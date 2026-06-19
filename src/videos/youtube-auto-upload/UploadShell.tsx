import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { enter } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { UPLOAD_BRAND } from "./brand";

/**
 * Per-scene frame for the Auto-Upload tutorial: shared light Backdrop, an
 * optional top bar (step chip + title on the left, brand lockup on the right)
 * and a bottom progress bar driven by the scene's own length. Mirrors
 * AutoLine's SceneShell but carries the UPLOAD_BRAND and a "STEP" kicker, so
 * the two videos read as distinct pieces.
 */
export const UploadShell: React.FC<{
  step?: string; // e.g. "STEP 01"
  kicker?: string; // e.g. "GCP PROJECT"
  title?: string;
  accent?: string;
  durationInFrames: number;
  showChrome?: boolean;
  showProgress?: boolean;
  chromeFrom?: number;
  children: React.ReactNode;
}> = ({
  step,
  kicker,
  title,
  accent = COLORS.remotion,
  durationInFrames,
  showChrome = true,
  showProgress = true,
  chromeFrom = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const headIn = enter(frame, chromeFrom, 14);
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, durationInFrames - 1)));

  return (
    <AbsoluteFill style={{ fontFamily: FONT.ui, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={kicker ?? title ?? "upload"} />

      <AbsoluteFill>{children}</AbsoluteFill>

      {showChrome ? (
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 92,
            right: 92,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            opacity: headIn,
            transform: `translateY(${(1 - headIn) * -14}px)`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 11,
                alignSelf: "flex-start",
                padding: "8px 17px",
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
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, fontWeight: 700, letterSpacing: 2, color: accent }}>
                {step ?? "AUTO-UPLOAD"}
              </span>
              {kicker ? (
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: TYPE.micro,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: COLORS.muted,
                    borderLeft: `1px solid ${COLORS.border}`,
                    paddingLeft: 11,
                  }}
                >
                  {kicker}
                </span>
              ) : null}
            </div>
            {title ? (
              <div style={{ fontSize: TYPE.h3, fontWeight: 800, letterSpacing: -0.5, color: COLORS.ink }}>
                {title}
              </div>
            ) : null}
          </div>

          <BrandMark accent={accent} />
        </div>
      ) : null}

      {showProgress ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: COLORS.bgAlt }}>
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${accent}, ${COLORS.teal})`,
              boxShadow: `0 0 14px ${accent}88`,
            }}
          />
        </div>
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
        background: "#FF0000",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={15} height={15} viewBox="0 0 24 24">
        <path d="M9 6l9 6-9 6z" fill="#fff" />
      </svg>
    </span>
    <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>
      {UPLOAD_BRAND.pre}
      <span style={{ color: accent }}>{UPLOAD_BRAND.post}</span>
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
      {UPLOAD_BRAND.course}
    </span>
  </div>
);
