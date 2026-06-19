/**
 * The heart of the video: a finished painting "paints itself" onto blank paper.
 *
 * We don't simulate brush strokes (impossible from a flat photo) — instead we
 * sweep an animated, *feathered* mask across the real image so ink appears to
 * bloom onto the paper, and ride a brush sprite along the wet leading edge to
 * sell the "作畫" feel. Because the mask reveals the untouched photo, the clip
 * always lands on the exact original artwork at p=1.
 *
 * Frame-driven only (no CSS transitions) so it renders deterministically.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import type { PaintingConfig } from "./config";

const FEATHER = 15; // % width of the soft "wet ink" band at the leading edge

/** Build the reveal mask for a given direction and edge position (0–100+). */
const maskFor = (direction: PaintingConfig["direction"], line: number): string => {
  const a = line - FEATHER; // fully-inked side
  const b = line; // paper side
  switch (direction) {
    case "left":
      return `linear-gradient(to right, #000 ${a}%, rgba(0,0,0,0) ${b}%)`;
    case "center":
      return `radial-gradient(circle at 50% 50%, #000 ${a}%, rgba(0,0,0,0) ${b}%)`;
    case "top":
    default:
      return `linear-gradient(to bottom, #000 ${a}%, rgba(0,0,0,0) ${b}%)`;
  }
};

/** A stylised slanted calligraphy brush, tip at the bottom-centre of the viewBox. */
const BrushSprite: React.FC<{ size: number; opacity: number; sealColor: string }> = ({
  size,
  opacity,
  sealColor,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    style={{ opacity, filter: "drop-shadow(0 6px 10px rgba(28,24,20,0.28))" }}
  >
    {/* bamboo handle */}
    <rect x="54" y="4" width="12" height="62" rx="6" fill="#7A5230" />
    <rect x="56" y="6" width="4" height="58" rx="2" fill="#9A6E45" />
    {/* binding */}
    <rect x="50" y="60" width="20" height="14" rx="3" fill={sealColor} />
    <rect x="50" y="60" width="20" height="4" rx="2" fill="#E7C46B" opacity={0.8} />
    {/* ink tuft tapering to a point */}
    <path d="M60 72 C49 84, 52 104, 60 118 C68 104, 71 84, 60 72 Z" fill="#1C1814" />
    <path d="M60 80 C55 90, 56 104, 60 116 C64 104, 65 90, 60 80 Z" fill="#000" opacity={0.5} />
  </svg>
);

export const Reveal: React.FC<{
  image: string;
  direction: PaintingConfig["direction"];
  sealColor: string;
  revealFrames: number;
}> = ({ image, direction, sealColor, revealFrames }) => {
  const frame = useCurrentFrame();

  // Reveal completes a touch before the section ends, leaving a short still
  // "appreciation" hold on the finished, fully-revealed painting.
  const p = interpolate(frame, [0, revealFrames * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.42, 0, 0.2, 1),
  });

  // Drive the edge from -FEATHER to 100+FEATHER so it both starts fully blank
  // and ends fully inked (the feather clears past the canvas at p=1).
  const line = interpolate(p, [0, 1], [0, 100 + FEATHER]);
  const mask = maskFor(direction, line);

  // Brush position along the leading edge (% of the stage box), with a little wobble.
  const wobble = Math.sin(frame / 4.5) * 2.4;
  const edge = Math.max(0, Math.min(100, line - FEATHER / 2));
  const brushPos =
    direction === "left"
      ? { left: `${edge}%`, top: `${50 + wobble}%` }
      : { left: `${50 + wobble}%`, top: `${edge}%` };
  const brushOpacity = interpolate(p, [0, 0.04, 0.9, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showBrush = direction !== "center";

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Img
        src={staticFile(image)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
      {showBrush && (
        <div
          style={{
            position: "absolute",
            ...brushPos,
            transform: "translate(-50%, -86%) rotate(-30deg)",
            transformOrigin: "center bottom",
          }}
        >
          <BrushSprite size={170} opacity={brushOpacity} sealColor={sealColor} />
        </div>
      )}
    </div>
  );
};
