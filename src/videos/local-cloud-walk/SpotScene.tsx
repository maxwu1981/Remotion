import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { BG } from "./diagrams";

const FPS = 30, LEAD = 12, GAP = 10, TAIL = 18;
const fb = (t: string) => Math.max(2.2, Math.min(5.2, 0.6 + t.length * 0.135));

export type SpotStep = {
  cueId: string; text: string;
  /** kept for API compat; ignored in keynote mode (diagram always shows whole). */
  cx?: number; cy?: number; scale?: number;
  /** the block to highlight (diagram viewBox units) + semantic colour + headline. */
  glow: { x: number; y: number; w: number; h: number };
  color: string;
  headline?: string;
};

export function spotFrames(steps: SpotStep[], vo: Record<string, number>): number {
  let t = LEAD;
  for (const s of steps) t += Math.ceil((vo[s.cueId] ?? fb(s.text)) * FPS) + GAP;
  return t - GAP + TAIL;
}

const headH = 92, capH = 150, side = 80, FW = 1920, FH = 1080;

/**
 * Keynote style — the whole diagram is always shown; the active block gets a
 * bright ring + a big headline, both appearing **instantly** (no fade).
 *
 * Two things are deliberately NOT animated, because Remotion renders every frame
 * independently (seek→screenshot, no cross-frame caching): (1) the highlight has
 * no opacity/scale fade, and (2) narration plays as ONE continuous per-scene
 * track (`sceneAudio`) instead of per-cue `<Sequence>`s. Per-cue sequences
 * mount/unmount every cue and a fade re-paints every frame; both reflow the page
 * and make the thinnest text (the 沙盒 line under the dashed rule) land
 * sub-pixel-different = visible jitter. With neither, every in-step frame is
 * byte-identical.
 */
export const SpotScene: React.FC<{
  Diagram: React.FC<{ vb?: string }>; dim: { w: number; h: number }; steps: SpotStep[];
  vo: Record<string, number>; sceneAudio?: string;
  /** pre-baked diagram PNG (staticFile path). A raster <img> at a whole-pixel box
   * can't re-rasterise per frame, so the thin SVG text never jitters. Falls back
   * to the live <Diagram/> SVG (used by the preview comp) when omitted. */
  diagramImg?: string;
}> = ({ Diagram, dim, steps, vo, sceneAudio, diagramImg }) => {
  const frame = useCurrentFrame();
  let t = LEAD;
  const starts: number[] = [];
  for (const s of steps) {
    starts.push(t);
    t += Math.ceil((vo[s.cueId] ?? fb(s.text)) * FPS) + GAP;
  }
  let active = 0;
  for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) active = i;
  const st = steps[active];

  // Whole diagram, as large as fits between headline and caption. Round to whole
  // pixels: a fractional left/size puts the SVG on a sub-pixel grid, and any
  // per-frame reflow then flips the rounding → the thinnest text shimmers.
  const vw = FW, vh = FH - headH - capH;
  let baseH = vh, baseW = (baseH * dim.w) / dim.h;
  if (baseW > vw - side * 2) { baseW = vw - side * 2; baseH = (baseW * dim.h) / dim.w; }
  baseW = Math.round(baseW); baseH = Math.round(baseH);
  const cleft = Math.round((vw - baseW) / 2), ctop = Math.round(headH + (vh - baseH) / 2);

  // Highlight ring rect (block → screen px within the diagram box).
  const pad = 6;
  const rx = (st.glow.x / dim.w) * baseW - pad;
  const ry = (st.glow.y / dim.h) * baseH - pad;
  const rw = (st.glow.w / dim.w) * baseW + pad * 2;
  const rh = (st.glow.h / dim.h) * baseH + pad * 2;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: headH, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {st.headline ? <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: st.color, letterSpacing: 0.5 }}>{st.headline}</div> : null}
      </div>
      <div style={{ position: "absolute", left: cleft, top: ctop, width: baseW, height: baseH }}>
        {diagramImg ? <img src={staticFile(diagramImg)} style={{ width: "100%", height: "100%", display: "block" }} /> : <Diagram />}
        <div style={{
          position: "absolute", left: rx, top: ry, width: rw, height: rh, borderRadius: 14,
          border: `3px solid ${st.color}`,
          boxShadow: `0 0 0 5px ${st.color}22, 0 14px 34px rgba(20,22,40,0.18)`,
          background: `${st.color}0c`,
          pointerEvents: "none",
        }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", justifyContent: "center", padding: "0 60px" }}>
        <div style={{ maxWidth: 1600, background: "#FFFFFF", border: "1px solid #E6E9F0", borderRadius: 16, padding: "16px 32px", fontFamily: FONT.uiCjk, fontSize: 30, fontWeight: 600, color: "#14142B", lineHeight: 1.42, textAlign: "center", boxShadow: "0 6px 22px rgba(0,0,0,0.08)" }}>{st.text}</div>
      </div>
      {sceneAudio ? <Audio src={staticFile(sceneAudio)} /> : null}
    </AbsoluteFill>
  );
};
