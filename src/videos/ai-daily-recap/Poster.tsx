import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { BRAND } from "./brand";
import { ToolTile, ToolKey } from "./mockups/nodes";

const RAIL: ToolKey[] = ["obs", "capcut", "whisper", "gpt4o", "tts", "ffmpeg", "remotion"];

/** Static thumbnail — reads with no entrance animations at frame 0. */
export const Poster: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.ui, color: COLORS.ink }}>
    <Backdrop accent={COLORS.remotion} seed="recap-poster" />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            borderRadius: RADIUS.pill,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow: SHADOW.sm,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: TYPE.tiny,
            letterSpacing: 2,
            color: COLORS.muted,
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: COLORS.remotion }} />
          REMOTION × CLAUDE COWORK
        </div>

        <div
          style={{
            marginTop: 30,
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: 132,
            letterSpacing: -3,
            lineHeight: 1,
            color: COLORS.ink,
          }}
        >
          {BRAND.pre}
          <span
            style={{
              background: GRADIENT.remotion,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {BRAND.post}
          </span>
        </div>

        <div
          style={{
            marginTop: 20,
            fontFamily: FONT.uiCjk,
            fontWeight: 800,
            fontSize: 70,
            color: COLORS.ink,
          }}
        >
          每日影片
          <span
            style={{
              background: GRADIENT.remotion,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            全自動產線
          </span>
        </div>

        <div
          style={{
            marginTop: 22,
            fontFamily: FONT.uiCjk,
            fontSize: TYPE.h3,
            fontWeight: 500,
            color: COLORS.muted,
          }}
        >
          錄一次螢幕 · 自動轉錄、配音、雙格式輸出
        </div>

        <div
          style={{
            marginTop: 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {RAIL.map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 ? (
                <span style={{ width: 26, height: 2, borderRadius: 2, background: COLORS.borderStrong }} />
              ) : null}
              <ToolTile tool={t} size={52} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
