import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { ReelCaptionContext } from "../../../shared-skills/captions";
import { ReelFrame, reelStageGeometry } from "../../../shared-skills/components/ReelFrame";
import { ReelCaptions } from "../../../shared-skills/components/ReelCaptions";
import { appearUp } from "../../../shared-skills/anim";
import { Master } from "../Master";
import { BrandGlyph } from "../components";
import { MOTIF } from "../data";
import { REEL_CUES, SCENE_SPANS } from "./timeline";

const PAD = 36; // horizontal inset of the clip
const STAGE_TOP = 404; // top edge of the scaled 16:9 clip
const ACCENT = MOTIF.cloud;

/** The live "section" chip — mirrors the kicker of whatever scene is on screen. */
const SectionChip: React.FC = () => {
  const frame = useCurrentFrame();
  const active = SCENE_SPANS.filter((s) => frame >= s.from).slice(-1)[0] ?? SCENE_SPANS[0];
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        key={active.index}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 22px",
          borderRadius: RADIUS.pill,
          background: COLORS.surface,
          border: `1px solid ${active.accent}44`,
          boxShadow: SHADOW.sm,
        }}
      >
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: active.accent, boxShadow: `0 0 0 4px ${active.accent}22` }} />
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.small, letterSpacing: 0.5, color: active.accent }}>
          {active.kicker}
        </span>
      </div>
    </div>
  );
};

/** Branded header: phone↔cloud chip → stacked title → live section chip. */
const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, 4, 18, 16);
  return (
    <div style={{ position: "absolute", top: 52, left: 0, right: 0, ...a }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "11px 26px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
          <BrandGlyph size={26} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, letterSpacing: 0.5, color: COLORS.inkSoft }}>手機／遠端 必懂</span>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 86, letterSpacing: -3, color: COLORS.ink, lineHeight: 1 }}>Claude Code</div>
        <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 62, letterSpacing: -1, lineHeight: 1 }}>
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>手機／遠端全解析</span>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionChip />
      </div>
    </div>
  );
};

/** CTA pill + progress bar pinned to the bottom edge. */
const Footer: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, totalFrames - 1)));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 32px", borderRadius: RADIUS.pill, background: COLORS.ink, boxShadow: SHADOW.lg }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: "#fff" }}>🔔 追蹤</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: "#fff" }}>完整版在 YouTube ▶</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: COLORS.bgAlt }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.remotion}, ${ACCENT})`, boxShadow: `0 0 16px ${ACCENT}88` }} />
      </div>
    </>
  );
};

/**
 * Vertical 1080×1920 reel. Reuses the landscape <Master/> wholesale (every scene +
 * narration + BGM) scaled into a rounded screen, then overlays a branded header, a
 * live section chip, big mobile-legible captions and a CTA. In-clip caption bars are
 * suppressed via ReelCaptionContext so they don't double up.
 */
export const ReelMaster: React.FC = () => {
  const { width, durationInFrames } = useVideoConfig();
  const { stageHeight } = reelStageGeometry(width, PAD);
  const capTop = STAGE_TOP + stageHeight + 44;

  return (
    <AbsoluteFill>
      <ReelFrame accent={ACCENT} seed="crn-reel" stageTop={STAGE_TOP} sidePad={PAD} freeze>
        <ReelCaptionContext.Provider value={true}>
          <Master />
        </ReelCaptionContext.Provider>
      </ReelFrame>

      <Header />

      <div style={{ position: "absolute", top: capTop, left: PAD, right: PAD, bottom: 150 }}>
        <ReelCaptions cues={REEL_CUES} accent={ACCENT} />
      </div>

      <Footer totalFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
