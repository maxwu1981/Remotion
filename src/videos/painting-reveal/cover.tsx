/**
 * Hook cover (first ~3s): a blurred "peek" of the finished painting behind a big
 * 畫名, the 峻清书画 brand line and a 朱砂 seal dot. Fades itself in and out so the
 * master can simply place it as the first sequence over the shared paper bg.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { INK, FONTS } from "./brand";

const PAD = 80;

export const Cover: React.FC<{
  image: string;
  title: string;
  subtitle?: string;
  sealColor: string;
}> = ({ image, title, subtitle, sealColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const inOp = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = inOp * outOp;
  const rise = interpolate(frame, [0, 22], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const peekScale = interpolate(frame, [0, durationInFrames], [1.08, 1.14], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: op, fontFamily: FONTS.title, color: INK.ink }}>
      {/* blurred painting peek */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img
          src={staticFile(image)}
          style={{
            width: "84%",
            height: "60%",
            objectFit: "contain",
            filter: "blur(22px) saturate(0.9)",
            opacity: 0.2,
            transform: `scale(${peekScale})`,
          }}
        />
      </AbsoluteFill>

      {/* brand line */}
      <div style={{ position: "absolute", top: 250, left: PAD, right: PAD, textAlign: "center", transform: `translateY(${rise}px)` }}>
        <span style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: INK.inkSoft }}>
          峻 清 书 画
        </span>
      </div>

      {/* 畫名 */}
      <div style={{ position: "absolute", top: 720, left: PAD, right: PAD, textAlign: "center", transform: `translateY(${rise}px)` }}>
        <div style={{ fontWeight: 900, fontSize: 188, lineHeight: 1.05, letterSpacing: 6, color: INK.ink, textShadow: "0 2px 0 rgba(255,255,255,0.5)" }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 46, letterSpacing: 4, color: INK.inkSoft, marginTop: 40 }}>
            {subtitle}
          </div>
        ) : null}
      </div>

      {/* 朱砂 seal dot + label */}
      <div style={{ position: "absolute", bottom: 360, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, transform: `translateY(${rise}px)` }}>
        <div style={{ width: 96, height: 96, borderRadius: 18, background: sealColor, boxShadow: `0 10px 24px ${sealColor}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: FONTS.title, fontWeight: 900, fontSize: 52, color: "#FBEFE6" }}>畫</span>
        </div>
        <span style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 38, letterSpacing: 6, color: INK.faint }}>作 畫 過 程</span>
      </div>
    </AbsoluteFill>
  );
};
