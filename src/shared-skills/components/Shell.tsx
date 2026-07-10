import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../theme";
import { ramp } from "../anim";
import { Backdrop } from "./Backdrop";
import { RemotionLogo } from "./logos";

/**
 * Page chrome shared by every scene in a "masterclass"-style explainer: frozen
 * gradient backdrop, a kicker chip (top-left), a brand badge (top-right), and
 * a bottom progress bar that fills as the scene plays. Promoted out of the Git
 * commit/push guide's per-video `components.tsx` so any new video can reuse the
 * same chrome instead of re-deriving it — pass `brand` (and optionally `icon`)
 * instead of importing a video-local `BRAND` constant.
 */
export const Shell: React.FC<{
  kicker?: string;
  accent?: string;
  durationInFrames: number;
  showChrome?: boolean;
  seed?: string;
  /** Text shown in the brand badge, top-right. */
  brand: string;
  /** Icon in the brand badge; defaults to the Remotion mark. */
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ kicker, accent = COLORS.remotion, durationInFrames, showChrome = true, seed, brand, icon, children }) => {
  const frame = useCurrentFrame();
  const headIn = ramp(frame, 0, 14);
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, durationInFrames - 1)));
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={seed ?? kicker ?? "shell"} freeze />
      <AbsoluteFill>{children}</AbsoluteFill>
      {showChrome ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 92,
              right: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: headIn,
              transform: `translateY(${(1 - headIn) * -12}px)`,
            }}
          >
            {kicker ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "8px 18px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: accent, boxShadow: `0 0 0 4px ${accent}22` }} />
                <span style={{ fontFamily: FONT.monoCjk, fontSize: TYPE.tiny, fontWeight: 700, letterSpacing: 1, color: accent }}>{kicker}</span>
              </div>
            ) : (
              <span />
            )}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
              {icon ?? <RemotionLogo size={22} />}
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>{brand}</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: COLORS.bgAlt }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.hi.sky}, ${COLORS.hi.violet}, ${COLORS.remotion})`, boxShadow: `0 0 14px ${accent}88` }} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
