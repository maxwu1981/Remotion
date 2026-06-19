import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS, RADIUS, SHADOW } from "../theme";
import { Backdrop } from "./Backdrop";

/**
 * Geometry of the scaled landscape "screen" inside a vertical reel. Exported so a
 * reel master can place its header/captions exactly above and below the clip.
 */
export const reelStageGeometry = (
  width: number,
  sidePad: number,
  sourceWidth = 1920,
  sourceHeight = 1080,
): { stageWidth: number; stageHeight: number; scale: number } => {
  const stageWidth = width - sidePad * 2;
  const scale = stageWidth / sourceWidth;
  return { stageWidth, stageHeight: sourceHeight * scale, scale };
};

/**
 * Vertical (9:16) reel wrapper that repurposes a landscape (16:9) composition for
 * Reels / Shorts / TikTok WITHOUT re-laying-out a single scene. The landscape
 * content is rendered at its native size and uniformly scaled to fit the reel
 * width inside a rounded "screen"; the caller overlays a branded header, large
 * captions and a CTA in the space above and below.
 *
 * Best-practice wins: one source of truth (the existing master), frame-based only,
 * and reusable across every video in the repo. Defaults assume a 1920×1080 source.
 */
export const ReelFrame: React.FC<{
  /** The landscape master, authored at sourceWidth×sourceHeight. */
  children: React.ReactNode;
  accent?: string;
  seed?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  /** Y of the clip's top edge (reel pixels). */
  stageTop: number;
  /** Horizontal inset of the clip from the reel edges. */
  sidePad?: number;
  radius?: number;
  /** Freeze the backdrop drift (calmer bg → less h264 text shimmer). */
  freeze?: boolean;
}> = ({
  children,
  accent = COLORS.remotion,
  seed = "reel",
  sourceWidth = 1920,
  sourceHeight = 1080,
  stageTop,
  sidePad = 36,
  radius = RADIUS.xl,
  freeze = false,
}) => {
  const { width } = useVideoConfig();
  const { stageWidth, stageHeight, scale } = reelStageGeometry(
    width,
    sidePad,
    sourceWidth,
    sourceHeight,
  );

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Backdrop accent={accent} seed={seed} freeze={freeze} />

      {/* the landscape master, scaled into a rounded screen */}
      <div
        style={{
          position: "absolute",
          top: stageTop,
          left: sidePad,
          width: stageWidth,
          height: stageHeight,
          borderRadius: radius,
          overflow: "hidden",
          background: COLORS.bg,
          border: `1px solid ${COLORS.borderStrong}`,
          boxShadow: SHADOW.lg,
        }}
      >
        <div
          style={{
            position: "relative",
            width: sourceWidth,
            height: sourceHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
        {/* faint inner bezel for a "device screen" feel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 0 0 1px rgba(255,255,255,0.35)",
            pointerEvents: "none",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
