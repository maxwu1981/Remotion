import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { Backdrop } from "../../../shared-skills/components/Backdrop";
import { ToolTile, ToolKey } from "../mockups/nodes";
import { BRAND } from "../brand";

const RAIL: ToolKey[] = ["obs", "whisper", "gpt4o", "tts", "ffmpeg", "remotion"];

/** Vertical (1080×1920) cover for the reel — export to PNG for the Short thumbnail. */
export const ReelPoster: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
    <Backdrop accent={COLORS.remotion} seed="recap-reel-poster" />

    {/* kicker */}
    <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.remotion }} />
        <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.h3, letterSpacing: 1, color: COLORS.muted }}>REMOTION × CLAUDE</span>
      </div>
    </div>

    {/* wordmark — stacked for the tall canvas */}
    <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 168, letterSpacing: -6, color: COLORS.ink, lineHeight: 1 }}>ai-daily</span>
      <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 168, letterSpacing: -6, background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", lineHeight: 1.05 }}>-recap</span>
    </div>

    {/* hero */}
    <div style={{ position: "absolute", top: 820, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 110, letterSpacing: -1, color: COLORS.ink, lineHeight: 1.15 }}>
        每天一支影片
        <div style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>全自動產線</div>
      </div>
    </div>

    {/* tagline */}
    <div style={{ position: "absolute", top: 1120, left: 80, right: 80, textAlign: "center" }}>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: TYPE.h2, color: COLORS.muted, lineHeight: 1.4 }}>
        {BRAND.tagline}
      </span>
    </div>

    {/* tool rail */}
    <div style={{ position: "absolute", top: 1360, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
      {RAIL.map((t, i) => (
        <React.Fragment key={t}>
          {i > 0 ? <span style={{ width: 32, height: 3, borderRadius: 2, background: COLORS.borderStrong }} /> : null}
          <ToolTile tool={t} size={92} />
        </React.Fragment>
      ))}
    </div>

    {/* footer */}
    <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.muted, letterSpacing: 0.5 }}>
        錄一次螢幕 · 自動轉錄、配音、雙格式輸出
      </span>
    </div>
  </AbsoluteFill>
);
