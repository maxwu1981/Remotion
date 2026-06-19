/**
 * 結尾 (last ~4s): the finished painting sits small at the top, then 畫名 / 落款,
 * a 朱砂 seal, and a follow CTA tying the series together. Mirrors the bilingual,
 * heritage-forward tone of the jq-fb-video-publisher caption. Fades itself in.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { INK, FONTS } from "./brand";

const PAD = 80;

export const Outro: React.FC<{
  image: string;
  title: string;
  subtitle?: string;
  sealColor: string;
}> = ({ image, title, subtitle, sealColor }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(frame, [0, 24], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ opacity: op, fontFamily: FONTS.title, color: INK.ink }}>
      {/* finished painting, small + framed */}
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${rise}px)` }}>
        <Img
          src={staticFile(image)}
          style={{
            width: 560,
            height: 560,
            objectFit: "contain",
            background: INK.paperHi,
            padding: 18,
            borderRadius: 10,
            border: `1px solid ${INK.paperEdge}`,
            boxShadow: "0 18px 44px rgba(28,24,20,0.22)",
          }}
        />
      </div>

      {/* 畫名 + 落款 */}
      <div style={{ position: "absolute", top: 880, left: PAD, right: PAD, textAlign: "center", transform: `translateY(${rise}px)` }}>
        <div style={{ fontWeight: 900, fontSize: 120, letterSpacing: 6, lineHeight: 1.1 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 44, letterSpacing: 4, color: INK.inkSoft, marginTop: 28 }}>
            {subtitle}
          </div>
        ) : null}
      </div>

      {/* seal + brand */}
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, transform: `translateY(${rise}px)` }}>
        <div style={{ width: 104, height: 104, borderRadius: 18, background: sealColor, boxShadow: `0 10px 24px ${sealColor}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 56, color: "#FBEFE6" }}>峻</span>
        </div>
        <span style={{ fontFamily: FONTS.body, fontWeight: 800, fontSize: 52, letterSpacing: 8, color: INK.ink }}>峻 清 书 画</span>
      </div>

      {/* CTA pill */}
      <div style={{ position: "absolute", bottom: 250, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${rise}px)` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "26px 52px", borderRadius: 999, background: INK.ink, boxShadow: "0 16px 40px rgba(28,24,20,0.3)" }}>
          <span style={{ fontFamily: FONTS.body, fontWeight: 800, fontSize: 44, color: INK.paperHi }}>🔔 追蹤</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.45)" }} />
          <span style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 44, color: INK.paperHi }}>每幅畫都有作畫過程</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
