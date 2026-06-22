import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { Bgm } from "../../shared-skills/audio";
import { UPLOAD_SCENES, UPLOAD_TRANSITION_FRAMES } from "./registry";
import { UPLOAD_BRAND } from "./brand";

/**
 * The full Auto-Upload tutorial: nine sequences stitched end-to-end with gentle
 * fades, a looping music bed ducked under the whole thing. Per-scene SFX and
 * voiceover live inside each scene, frame-aligned to their animations.
 */
export const UploadMaster: React.FC = () => {
  const children: React.ReactNode[] = [];
  UPLOAD_SCENES.forEach((s, i) => {
    const Comp = s.Component;
    children.push(
      <TransitionSeries.Sequence key={`seq-${s.id}`} durationInFrames={s.durationInFrames}>
        <Comp />
      </TransitionSeries.Sequence>,
    );
    if (i < UPLOAD_SCENES.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`tr-${s.id}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: UPLOAD_TRANSITION_FRAMES })}
        />,
      );
    }
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Bgm src="bgm-piano.mp3" volume={0.13} />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};

/**
 * Static poster frame. Ports the EP00 winning formula: left = brand + giant
 * number hook (0 手動步驟); right = colour-coded info wall of the auto pipeline.
 */
export const UploadPoster: React.FC = () => {
  const rows = [
    { c: COLORS.hi.sky, key: "Email 觸發", gloss: "來源自動進" },
    { c: COLORS.hi.violet, key: "自動生腳本＋成片", gloss: "Remotion 算繪" },
    { c: COLORS.error, key: "自動上 YouTube", gloss: "Data API · 直接公開" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />

      <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      <div style={{ position: "absolute", top: 140, left: 96 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 76, letterSpacing: -1, lineHeight: 1, color: COLORS.ink }}>
          {UPLOAD_BRAND.pre}
          <span style={{ color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text" }}>{UPLOAD_BRAND.post}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 110, letterSpacing: -2, lineHeight: 1.04, color: COLORS.ink }}>YouTube 自動上片</div>
      </div>

      <div style={{ position: "absolute", top: 488, left: 92, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ fontWeight: 800, fontSize: 300, lineHeight: 0.86, color: COLORS.claudeDeep, letterSpacing: -8 }}>0</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink }}>手動步驟</span>
          <span style={{ fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: COLORS.ink, borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 6 }}>全自動上片</span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 72, left: 96, display: "flex", gap: 18, alignItems: "center" }}>
        <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 40 }}>YouTube Data API</span>
        <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: 40 }}>Email → 腳本 → 公開</span>
      </div>

      <div style={{ position: "absolute", top: 80, right: 70, width: 780, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 22, height: 268, padding: "0 36px", borderRadius: RADIUS.lg, background: r.c, color: "#fff", boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 64, opacity: 0.5, width: 54 }}>{i + 1}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 54, lineHeight: 1.05 }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 34, opacity: 0.92 }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
