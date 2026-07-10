import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CaptionTrack, Cue } from "../../shared-skills/captions";

const FPS = 30, LEAD = 12, GAP = 10, TAIL = 18;
const fb = (t: string) => Math.max(2.2, Math.min(5.2, 0.6 + t.length * 0.135));

export type Step = {
  cueId: string;
  text: string;
  /** focus centre in diagram-normalised coords (0–1) + zoom factor (1 = whole). */
  cx: number; cy: number; scale: number;
  /** glow rectangle in the diagram's own viewBox units. */
  glow?: { x: number; y: number; w: number; h: number };
  glowColor?: string;
};

const BG = "#0a0a0f";

/** Total frames a diagram scene occupies, timed from the VO manifest. */
export function sceneFrames(steps: Step[], vo: Record<string, number>): number {
  let t = LEAD;
  for (const s of steps) t += Math.ceil((vo[s.cueId] ?? fb(s.text)) * FPS) + GAP;
  return t - GAP + TAIL;
}

const Glow: React.FC<{
  stageW: number; stageH: number; dimW: number; dimH: number;
  rect: { x: number; y: number; w: number; h: number }; color: string;
  frame: number; start: number; end: number;
}> = ({ stageW, stageH, dimW, dimH, rect, color, frame, start, end }) => {
  const op = Math.min(
    interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [end - 10, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  if (op <= 0) return null;
  return (
    <div style={{
      position: "absolute",
      left: (rect.x / dimW) * stageW, top: (rect.y / dimH) * stageH,
      width: (rect.w / dimW) * stageW, height: (rect.h / dimH) * stageH,
      borderRadius: 10, border: `2.5px solid ${color}`,
      boxShadow: `0 0 12px 1px ${color}, inset 0 0 10px ${color}44`,
      opacity: op, pointerEvents: "none",
    }} />
  );
};

export const DiagramScene: React.FC<{
  Diagram: React.FC; dim: { w: number; h: number }; steps: Step[];
  vo: Record<string, number>; voDir: string;
  /** Keep the diagram dead-still (whole view); highlight regions with glow only —
   * no camera zoom, so the text never scales (zero motion shimmer). */
  lockWhole?: boolean;
}> = ({ Diagram, dim, steps, vo, voDir, lockWhole }) => {
  const frame = useCurrentFrame();

  let t = LEAD;
  const cues: Cue[] = [];
  const starts: number[] = [];
  for (const s of steps) {
    const f = Math.ceil((vo[s.cueId] ?? fb(s.text)) * FPS);
    starts.push(t);
    cues.push({ id: s.cueId, text: s.text, from: t, dur: f });
    t += f + GAP;
  }
  const ends = starts.map((_, i) => (i + 1 < starts.length ? starts[i + 1] : t));

  // Reserve the bottom for the caption bar (CaptionBar sits at bottom:60, up to ~2
  // lines) and anchor the diagram to the TOP, so the whole-view never overlaps the
  // caption. (When zoomed the content fills past it — overlap is fine there.)
  const FW = 1920, FH = 1080, topPad = 24, captionZone = 196, sideMargin = 80;
  let stageH = FH - topPad - captionZone;
  let stageW = (stageH * dim.w) / dim.h;
  if (stageW > FW - sideMargin * 2) { stageW = FW - sideMargin * 2; stageH = (stageW * dim.h) / dim.w; }

  // Snap-and-hold camera: quick move to the cue's region at its start, then HOLD
  // perfectly still for the rest of the cue (no continuous drift).
  let active = 0;
  for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) active = i;
  const TRANS = 16;
  const prev = active > 0 ? active - 1 : 0;
  const p = interpolate(frame, [starts[active], starts[active] + TRANS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const lerp = (a: number, b: number) => a + (b - a) * p;
  const cx = lerp(steps[prev].cx, steps[active].cx);
  const cy = lerp(steps[prev].cy, steps[active].cy);
  const sc = lerp(steps[prev].scale, steps[active].scale);
  const tx = -(cx - 0.5) * stageW * sc;
  const ty = -(cy - 0.5) * stageH * sc;
  const Tx = lockWhole ? 0 : tx, Ty = lockWhole ? 0 : ty, Ts = lockWhole ? 1 : sc;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: topPad }}>
        <div style={{ width: stageW, height: stageH, position: "relative", transform: `translate(${Tx}px, ${Ty}px) scale(${Ts})`, transformOrigin: "center center" }}>
          <Diagram />
          {steps.map((s, i) => s.glow ? (
            <Glow key={i} stageW={stageW} stageH={stageH} dimW={dim.w} dimH={dim.h} rect={s.glow} color={s.glowColor || "#facc15"} frame={frame} start={starts[i]} end={ends[i]} />
          ) : null)}
        </div>
      </AbsoluteFill>
      <CaptionTrack cues={cues} vo={vo} voDir={voDir} />
    </AbsoluteFill>
  );
};
