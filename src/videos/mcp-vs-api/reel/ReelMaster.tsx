import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { ReelCaptionContext } from "../../../shared-skills/captions";
import { ReelFrame, reelStageGeometry } from "../../../shared-skills/components/ReelFrame";
import { appearUp } from "../../../shared-skills/anim";
import { Master } from "../Master";
import { API, MCP } from "../data";
import { ConnectorGlyph } from "../components";
import { REEL_CUES, SCENE_SPANS } from "./timeline";
import { ReelCaptions } from "../../../shared-skills/components/ReelCaptions";

const PAD = 36; // horizontal inset of the clip
const STAGE_TOP = 392; // top edge of the scaled 16:9 clip

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
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: active.accent,
            boxShadow: `0 0 0 4px ${active.accent}22`,
          }}
        />
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.small, letterSpacing: 0.5, color: active.accent }}>
          {active.kicker}
        </span>
      </div>
    </div>
  );
};

/** Branded header: AI chip → MCP vs API title → live section chip. */
const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, 4, 18, 16);
  return (
    <div style={{ position: "absolute", top: 56, left: 0, right: 0, ...a }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 26px",
            borderRadius: RADIUS.pill,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow: SHADOW.sm,
          }}
        >
          <ConnectorGlyph size={26} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, letterSpacing: 0.5, color: COLORS.inkSoft }}>
            AI 必修課
          </span>
        </div>
      </div>

      <div style={{ marginTop: 26, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 20 }}>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 104, letterSpacing: -4, color: MCP.color, lineHeight: 1 }}>MCP</span>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 60, color: COLORS.faint, lineHeight: 1 }}>vs</span>
        <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 104, letterSpacing: -4, color: API.color, lineHeight: 1 }}>API</span>
      </div>

      <div style={{ marginTop: 14, textAlign: "center" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, letterSpacing: -0.5, color: COLORS.ink }}>
          到底{" "}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>差在哪</span>
          ？
        </span>
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
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 32px",
            borderRadius: RADIUS.pill,
            background: COLORS.ink,
            boxShadow: SHADOW.lg,
          }}
        >
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: "#fff" }}>🔔 追蹤</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: "#fff" }}>完整版在 YouTube ▶</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: COLORS.bgAlt }}>
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${MCP.color}, ${API.color})`,
            boxShadow: `0 0 16px ${MCP.color}88`,
          }}
        />
      </div>
    </>
  );
};

/**
 * Vertical 1080×1920 reel. Reuses the landscape <Master/> wholesale (every scene +
 * its narration + BGM) scaled into a rounded screen, then overlays a branded header,
 * a live section chip, big mobile-legible captions and a CTA. The in-clip caption
 * bars are suppressed via ReelCaptionContext so they don't double up.
 */
export const ReelMaster: React.FC = () => {
  const { width, durationInFrames } = useVideoConfig();
  const { stageHeight } = reelStageGeometry(width, PAD);
  const capTop = STAGE_TOP + stageHeight + 44;

  return (
    <AbsoluteFill>
      <ReelFrame accent={MCP.color} seed="mcp-reel" stageTop={STAGE_TOP} sidePad={PAD}>
        <ReelCaptionContext.Provider value={true}>
          <Master />
        </ReelCaptionContext.Provider>
      </ReelFrame>

      <Header />

      {/* big captions live in the lower third, between the clip and the CTA */}
      <div style={{ position: "absolute", top: capTop, left: PAD, right: PAD, bottom: 150 }}>
        <ReelCaptions cues={REEL_CUES} accent={MCP.color} />
      </div>

      <Footer totalFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
