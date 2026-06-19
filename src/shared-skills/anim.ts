/**
 * Small animation helpers so scenes stay declarative. All timing is frame-based
 * (no CSS transitions) and uses Bézier easing / springs per Remotion best practice.
 */
import { Easing, interpolate, spring } from "remotion";

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_POP = Easing.bezier(0.34, 1.4, 0.64, 1);

/** 0→1 ease-out ramp between [start, start+dur]. */
export const enter = (frame: number, start = 0, dur = 16): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

/** 1→0 ease-in ramp between [start, start+dur]. */
export const leave = (frame: number, start: number, dur = 14): number =>
  interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

/** 0→1 with a gentle overshoot, for "pop in" emphasis. */
export const pop = (frame: number, start = 0, dur = 20): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_POP,
  });

/** Fade + translate up. Returns a style fragment. */
export const appearUp = (
  frame: number,
  start = 0,
  dur = 16,
  dist = 26,
): { opacity: number; transform: string } => {
  const t = enter(frame, start, dur);
  return { opacity: t, transform: `translateY(${(1 - t) * dist}px)` };
};

/** Fade + scale in (pop). Returns a style fragment. */
export const appearScale = (
  frame: number,
  start = 0,
  dur = 20,
  from = 0.85,
): { opacity: number; transform: string } => {
  const t = pop(frame, start, dur);
  const o = interpolate(t, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });
  return { opacity: o, transform: `scale(${from + (1 - from) * t})` };
};

/** Window-in (fade + translate) that also leaves at the end of a beat. */
export const appearHold = (
  frame: number,
  total: number,
  inDur = 16,
  outDur = 12,
): number => {
  const i = enter(frame, 0, inDur);
  const o = leave(frame, total - outDur, outDur);
  return Math.min(i, o);
};

/* ----------------------------------------------------------------- springs --- */

export type SpringOpts = {
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
};

/**
 * Raw spring value (0→1). Defaults are tuned for an *elegant* settle — enough
 * physicality to feel alive, gentle enough that nothing flickers or jitters.
 */
export const springV = (
  frame: number,
  fps: number,
  { delay = 0, damping = 16, stiffness = 110, mass = 0.9 }: SpringOpts = {},
): number =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness, mass },
  });

/**
 * Spring "pop in" — physical scale + lift with a clean (non-overshooting) fade,
 * so the opacity never exceeds 1 even when the spring overshoots its scale.
 */
export const springPop = (
  frame: number,
  fps: number,
  opts: SpringOpts & { dist?: number; from?: number } = {},
): { opacity: number; transform: string } => {
  const { dist = 22, from = 0.86, delay = 0, ...rest } = opts;
  const s = springV(frame, fps, { delay, damping: 14, stiffness: 120, mass: 0.85, ...rest });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  return {
    opacity,
    transform: `translateY(${(1 - s) * dist}px) scale(${from + (1 - from) * s})`,
  };
};
