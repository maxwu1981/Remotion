/**
 * One reusable 小紅書 cover (3:4, 1080×1440) rendered as a Still.
 * Strategy (see memory xiaohongshu-cover-strategy): full-bleed hero photo +
 * two top pills (一个人旅行 + 鉤子 tag) + bottom block (痛点/数字鉤子一行 →
 * accent underline → big title → subtitle → @handle), dark bottom gradient.
 * Each spot = one XhsCoverConfig in config.ts (XHS_COVERS); render via
 * `npx remotion still <Id>Cover out/<spot>-cover.jpg --image-format=jpeg`.
 */
import React from "react";
import { z } from "zod";
import { AbsoluteFill, Img, staticFile } from "remotion";

export const COVER_W = 1080;
export const COVER_H = 1440;

const SANS =
  "'PingFang SC','PingFang TC','Hiragino Sans GB','Noto Sans CJK SC',sans-serif";

export const xhsCoverSchema = z.object({
  image: z.string(),
  accent: z.string().default("#DE6E9C"),
  pillL: z.string().default("一个人旅行"),
  pillR: z.string().default("日本三景"),
  hookL: z.string().default(""),
  hookR: z.string().default(""),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  handle: z.string().default("@独自旅游乱走"),
  /** CSS object-position for the hero crop, e.g. "50% 35%". */
  focus: z.string().default("50% 50%"),
  /** optional EP badge text, e.g. "EP01 / 06". Shown top-right when set. */
  ep: z.string().default(""),
});

export type XhsCoverConfig = z.infer<typeof xhsCoverSchema>;

const Pill: React.FC<{ bg: string; fg: string; children: React.ReactNode; weight?: number }> = ({
  bg,
  fg,
  children,
  weight = 800,
}) => (
  <span
    style={{
      display: "inline-block",
      padding: "13px 30px",
      borderRadius: 999,
      background: bg,
      color: fg,
      fontFamily: SANS,
      fontWeight: weight,
      fontSize: 36,
      letterSpacing: 2,
      lineHeight: 1,
    }}
  >
    {children}
  </span>
);

export const XhsCover: React.FC<XhsCoverConfig> = (raw) => {
  const c = xhsCoverSchema.parse(raw);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img
        src={staticFile(c.image)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.focus }}
      />
      {/* top + bottom legibility gradients */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.30) 70%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      {/* top pills */}
      <div style={{ position: "absolute", top: 46, left: 44, display: "flex", gap: 16 }}>
        <Pill bg="rgba(0,0,0,0.55)" fg="#fff" weight={700}>
          {c.pillL}
        </Pill>
        <Pill bg={c.accent} fg="#1b1b1b">
          {c.pillR}
        </Pill>
      </div>

      {/* EP badge top-right */}
      {c.ep ? (
        <div
          style={{
            position: "absolute",
            top: 46,
            right: 44,
            padding: "13px 26px",
            borderRadius: 16,
            background: "rgba(0,0,0,0.62)",
            border: `3px solid ${c.accent}`,
            color: "#fff",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 38,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          {c.ep}
        </div>
      ) : null}

      {/* bottom block */}
      <div style={{ position: "absolute", left: 50, right: 50, bottom: 70 }}>
        {(c.hookL || c.hookR) && (
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 39,
              color: "#fff",
              letterSpacing: 1,
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
              marginBottom: 22,
            }}
          >
            {c.hookL}
            {c.hookL && c.hookR ? (
              <span style={{ color: c.accent, fontWeight: 900, margin: "0 14px" }}>/</span>
            ) : null}
            {c.hookR}
          </div>
        )}
        <div style={{ width: 96, height: 9, background: c.accent, borderRadius: 5, marginBottom: 20 }} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 112,
            color: "#fff",
            letterSpacing: 4,
            lineHeight: 1.04,
            textShadow: "0 4px 22px rgba(0,0,0,0.6)",
          }}
        >
          {c.title}
        </div>
        {c.subtitle ? (
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 42,
              color: "#f5e7cf",
              letterSpacing: 2,
              marginTop: 18,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {c.subtitle}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 31,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: 2,
            marginTop: 28,
          }}
        >
          {c.handle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
