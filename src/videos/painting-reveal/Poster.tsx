/**
 * Static cover / thumbnail (renders as a <Still> → PNG) for the upload. The
 * finished painting sits prominently with a 畫名 banner and the 峻清书画 seal —
 * no frame-based animation.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { INK, FONTS } from "./brand";
import { PaperBg } from "./PaintingReveal";
import { paintingSchema, type PaintingConfig } from "./config";

export const PaintingPoster: React.FC<PaintingConfig> = (rawProps) => {
  const cfg = paintingSchema.parse(rawProps);
  return (
    <AbsoluteFill style={{ fontFamily: FONTS.title, color: INK.ink }}>
      <PaperBg />

      {/* brand line */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: FONTS.body, fontWeight: 800, fontSize: 44, letterSpacing: 10, color: INK.inkSoft }}>峻 清 书 画</span>
      </div>

      {/* finished painting */}
      <div style={{ position: "absolute", top: 300, left: 90, right: 90, height: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img
          src={staticFile(cfg.image)}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            background: INK.paperHi,
            padding: 22,
            borderRadius: 12,
            border: `1px solid ${INK.paperEdge}`,
            boxShadow: "0 24px 60px rgba(28,24,20,0.24)",
          }}
        />
      </div>

      {/* 畫名 banner */}
      <div style={{ position: "absolute", top: 1320, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 200, letterSpacing: 8, lineHeight: 1.05, textShadow: "0 3px 0 rgba(255,255,255,0.55)" }}>{cfg.title}</div>
        {cfg.subtitle ? (
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 52, letterSpacing: 5, color: INK.inkSoft, marginTop: 34 }}>{cfg.subtitle}</div>
        ) : null}
      </div>

      {/* 朱砂 seal */}
      <div style={{ position: "absolute", bottom: 200, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "22px 46px", borderRadius: 999, background: "rgba(255,255,255,0.5)", border: `1px solid ${INK.paperEdge}` }}>
          <span style={{ width: 40, height: 40, borderRadius: 8, background: cfg.sealColor }} />
          <span style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: INK.faint }}>作 畫 過 程</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
