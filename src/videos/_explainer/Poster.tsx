/**
 * 封面 / 縮圖 Still for roundup（工具盤點卡）specs — 影片同款「索引封面」版型，
 * 但去掉字幕/進度條等 chrome、字加大成海報級。靜態（frame 0），兩個比例共用一個元件：
 *   variant="wide"  → 1920×1080（YouTube 縮圖）
 *   variant="reel"  → 1080×1920（XHS · Reels · Shorts 封面）
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { BrandGlyph } from "./components";
import { accent as accentColor } from "./palette";
import type { SceneBlock, VideoSpec } from "./schema";

type CoverScene = Extract<SceneBlock, { type: "cover" }>;

export const RoundupPoster: React.FC<{ spec: VideoSpec; variant?: "wide" | "reel" }> = ({ spec, variant = "wide" }) => {
  const cover = spec.scenes.find((s): s is CoverScene => s.type === "cover");
  const items = cover?.index ?? [];
  const reel = variant === "reel";
  const acc = (k?: string) => accentColor(k);

  // size knobs per orientation
  const M = reel ? 60 : 110;
  const titlePreSize = reel ? 76 : 64;
  const titlePostSize = reel ? 122 : 100;
  const rowGap = reel ? 18 : 13;
  const rowPad = reel ? "24px 32px" : "13px 28px";
  const badgeN = reel ? 80 : 58;
  const nameSize = reel ? TYPE.h2 : TYPE.h2;
  const tagSize = reel ? TYPE.body : TYPE.body;

  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={acc("claude")} seed="roundup-poster" freeze />

      {/* brand handle */}
      <div style={{ position: "absolute", top: reel ? 56 : 60, left: M, display: "inline-flex", alignItems: "center", gap: 14 }}>
        <BrandGlyph size={reel ? 34 : 38} />
        <span style={{ fontWeight: 800, fontSize: reel ? 34 : 38, letterSpacing: 1, color: COLORS.muted }}>
          {spec.brand.name}{spec.brand.handle ? <span style={{ color: COLORS.faint }}>{`  ${spec.brand.handle}`}</span> : null}
        </span>
      </div>

      {/* title */}
      <div style={{ position: "absolute", left: M, right: M, top: reel ? 150 : 108, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: titlePreSize, letterSpacing: -1, color: COLORS.ink, lineHeight: 1.04 }}>{cover?.titlePre}</div>
        <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: titlePostSize, letterSpacing: -2.5, lineHeight: 1.02, background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{cover?.titlePost}</div>
      </div>

      {/* index wall */}
      <div style={{ position: "absolute", left: reel ? M : 0, right: reel ? M : 0, top: reel ? 560 : 300, display: "flex", flexDirection: "column", alignItems: "center", gap: rowGap }}>
        {items.map((it, i) => {
          const col = acc(it.accent);
          return (
            <div key={i} style={{ width: reel ? "100%" : 1060, display: "flex", alignItems: "center", gap: reel ? 24 : 22, padding: rowPad, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${col}66`, boxShadow: SHADOW.md }}>
              <span style={{ width: badgeN, height: badgeN, flexShrink: 0, borderRadius: reel ? 18 : 16, background: col, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: reel ? 40 : 38 }}>{it.n}</span>
              <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: nameSize, color: COLORS.ink, letterSpacing: -0.5 }}>{it.title}</span>
              <span style={{ marginLeft: "auto", textAlign: "right", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: tagSize, color: COLORS.muted }}>{it.tag}</span>
            </div>
          );
        })}
      </div>

      {/* bottom hook badge */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: reel ? 88 : 70, display: "flex", justifyContent: "center", gap: 16 }}>
        <span style={{ padding: reel ? "16px 34px" : "16px 36px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: reel ? 40 : 44, boxShadow: SHADOW.md }}>{items.length} 個官方原生能力</span>
        <span style={{ padding: reel ? "16px 30px" : "16px 32px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, color: COLORS.inkSoft, fontWeight: 800, fontSize: reel ? 32 : 36 }}>不用外掛 · 開箱就有</span>
      </div>
    </AbsoluteFill>
  );
};
