import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

const BLOB_COLORS = [
  COLORS.remotion,
  COLORS.teal,
  COLORS.claude,
  COLORS.hi.violet,
  COLORS.hi.sky,
];

/**
 * Light, technical canvas: vertical gradient + a few slow drifting color blobs
 * + a faint dotted grid masked toward the edges. Fully deterministic.
 *
 * `freeze` stops the blob drift so the whole backdrop is pixel-identical every
 * frame. On text-heavy explainers this matters: a constantly-moving background
 * forces h264 to re-quantize the (high-contrast CJK) text macroblocks each frame,
 * producing mosquito-noise shimmer that reads as 抖動. A frozen backdrop lets the
 * encoder skip unchanged macroblocks → rock-stable text during holds.
 */
export const Backdrop: React.FC<{ accent?: string; seed?: string; freeze?: boolean }> = ({
  accent,
  seed = "bg",
  freeze = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const blobs = new Array(5).fill(0).map((_, i) => {
    const r = 230 + random(`${seed}-r${i}`) * 280;
    const baseX = random(`${seed}-x${i}`) * width;
    const baseY = random(`${seed}-y${i}`) * height;
    const driftX = freeze ? 0 : Math.sin(frame / 110 + i * 1.7) * 26;
    const driftY = freeze ? 0 : Math.cos(frame / 130 + i * 2.1) * 22;
    const color = i === 0 && accent ? accent : BLOB_COLORS[i % BLOB_COLORS.length];
    return { x: baseX + driftX, y: baseY + driftY, r, color };
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 52%, ${COLORS.bgAlt} 100%)`,
      }}
    >
      <AbsoluteFill style={{ filter: "blur(95px)", opacity: 0.2 }}>
        {blobs.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x - b.r,
              top: b.y - b.r,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: "50%",
              background: b.color,
            }}
          />
        ))}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLORS.borderStrong}66 1.4px, transparent 1.5px)`,
          backgroundSize: "44px 44px",
          opacity: 0.55,
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 92%)",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 92%)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 22%)",
        }}
      />
    </AbsoluteFill>
  );
};
