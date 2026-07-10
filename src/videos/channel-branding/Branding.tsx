/**
 * 頻道識別重設計 2026-07 — 三版 banner (2560×1440, 文字鎖在 1546×423 安全區)
 * + 三顆 avatar (800×800)。底圖由 Gemini 生（無文字），中文一律程式疊。
 *   A 踩坑筆記本（工程方眼紙）  B 曉晴工作室（人設門面）  C 黑曜石終端（頻道臉=影片臉）
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, BRAND_MARK } from "../../shared-skills/theme";

/** YouTube banner 安全區：2560×1440 置中的 1546×423。 */
const SAFE = { w: 1546, h: 423, left: (2560 - 1546) / 2, top: (1440 - 423) / 2 };

const Cover: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/* ────────────────────────── A｜踩坑筆記本 ────────────────────────── */

const INK = "#14142B";
const PIT_RED = "#E5484D";
const MARK_ORANGE = "#D97757";

/** 手繪感雙圈（簽字筆圈「坑」）。 */
const PitCircle: React.FC = () => (
  <svg
    viewBox="0 0 240 200"
    style={{
      position: "absolute",
      width: "150%",
      height: "135%",
      left: "-25%",
      top: "-16%",
      overflow: "visible",
    }}
  >
    <ellipse
      cx="120"
      cy="100"
      rx="102"
      ry="78"
      fill="none"
      stroke={PIT_RED}
      strokeWidth="7"
      strokeLinecap="round"
      transform="rotate(-5 120 100)"
      opacity={0.92}
    />
    <ellipse
      cx="122"
      cy="98"
      rx="96"
      ry="72"
      fill="none"
      stroke={PIT_RED}
      strokeWidth="4.5"
      strokeLinecap="round"
      transform="rotate(4 122 98)"
      opacity={0.55}
    />
  </svg>
);

export const ChannelBannerA: React.FC = () => (
  <AbsoluteFill style={{ background: "#FAFBFC" }}>
    <Img src={staticFile("channel-branding/bannerA-base.png")} style={Cover} />
    {/* 安全區內容 */}
    <div
      style={{
        position: "absolute",
        ...{ left: SAFE.left, top: SAFE.top, width: SAFE.w, height: SAFE.h },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      <div
        style={{
          fontFamily: FONT.monoCjk,
          fontSize: 30,
          letterSpacing: "0.3em",
          color: "#697090",
          fontWeight: 500,
        }}
      >
        {BRAND_MARK}
      </div>
      <div
        style={{
          fontFamily: FONT.cjk,
          fontWeight: 800,
          fontSize: 148,
          lineHeight: 1.08,
          color: INK,
          display: "flex",
          alignItems: "baseline",
          letterSpacing: "0.02em",
        }}
      >
        <span>Claude 踩</span>
        <span style={{ position: "relative", display: "inline-block" }}>
          坑
          <PitCircle />
        </span>
        <span>筆記</span>
      </div>
      <div
        style={{
          fontFamily: FONT.cjk,
          fontWeight: 700,
          fontSize: 47,
          color: "#363B57",
          letterSpacing: "0.06em",
        }}
      >
        每天真正遇到的坑 <span style={{ color: PIT_RED }}>✗</span>
        <span style={{ color: MARK_ORANGE, padding: "0 14px" }}>→</span>
        一句話教 Claude 解掉 <span style={{ color: "#16A34A" }}>✓</span>
      </div>
    </div>
  </AbsoluteFill>
);

export const ChannelAvatarA: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        `repeating-linear-gradient(0deg, transparent, transparent 39px, #C7D6E8 39px, #C7D6E8 40px),` +
        `repeating-linear-gradient(90deg, transparent, transparent 39px, #C7D6E8 39px, #C7D6E8 40px), #FAFBFC`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        position: "relative",
        fontFamily: FONT.cjk,
        fontWeight: 800,
        fontSize: 400,
        color: INK,
        lineHeight: 1,
      }}
    >
      坑
      <PitCircle />
    </div>
  </AbsoluteFill>
);

/* ────────────────────────── B｜曉晴工作室 ────────────────────────── */

const B_INK = "#23201E";
const B_ORANGE = "#E8672E";

export const ChannelBannerB: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFF9F2" }}>
    <Img src={staticFile("channel-branding/bannerB-base-2560.png")} style={Cover} />
    {/* 安全區左側文字塊（右側留給曉晴） */}
    <div
      style={{
        position: "absolute",
        left: SAFE.left + 10,
        top: SAFE.top,
        width: 1090,
        height: SAFE.h,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          fontFamily: FONT.monoCjk,
          fontSize: 28,
          letterSpacing: "0.28em",
          color: "rgba(35,32,30,0.62)",
          fontWeight: 500,
        }}
      >
        {BRAND_MARK}
      </div>
      <div
        style={{
          fontFamily: FONT.cjk,
          fontWeight: 800,
          fontSize: 106,
          lineHeight: 1.1,
          color: B_INK,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        Claude 踩坑筆記
      </div>
      <div style={{ width: 132, height: 10, borderRadius: 5, background: B_ORANGE }} />
      <div
        style={{
          fontFamily: FONT.cjk,
          fontWeight: 700,
          fontSize: 40,
          color: "#4A443E",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        學姐曉晴陪你踩坑，一句話教 Claude 解掉
      </div>
    </div>
  </AbsoluteFill>
);

/** 曉晴 master 臉部特寫裁切。 */
export const ChannelAvatarB: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(circle at 50% 42%, #D9EFE7 0%, #BFE3D8 68%, #A9D5C7 100%)",
      overflow: "hidden",
    }}
  >
    <Img
      src={staticFile("thumb/sunny.png")}
      style={{
        position: "absolute",
        width: 860,
        left: -12,
        top: -75,
      }}
    />
  </AbsoluteFill>
);

/* ────────────────────────── C｜黑曜石終端 ────────────────────────── */

const C_SILVER = "#C9D2E8";
const C_DIM = "#8B93B5";
const C_ORANGE = "#D97757";

export const ChannelBannerC: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0E1A" }}>
    <Img src={staticFile("channel-branding/bannerC-base.png")} style={Cover} />
    {/* 中央玻璃感淡淡壓暗，保字 */}
    <div
      style={{
        position: "absolute",
        left: SAFE.left - 40,
        top: SAFE.top - 20,
        width: SAFE.w + 80,
        height: SAFE.h + 40,
        borderRadius: 36,
        background: "rgba(8,11,24,0.42)",
        border: "1px solid rgba(201,210,232,0.14)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top,
        width: SAFE.w,
        height: SAFE.h,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          fontFamily: FONT.monoCjk,
          fontSize: 46,
          color: C_SILVER,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <span style={{ color: C_ORANGE, fontWeight: 700 }}>❯</span>
        <span>claude "把今天的事做完"</span>
        <span
          style={{
            display: "inline-block",
            width: 24,
            height: 52,
            background: C_ORANGE,
            borderRadius: 3,
            boxShadow: `0 0 18px ${C_ORANGE}AA`,
          }}
        />
      </div>
      <div
        style={{
          fontFamily: FONT.cjk,
          fontWeight: 800,
          fontSize: 132,
          lineHeight: 1.08,
          color: "#F2F5FC",
          letterSpacing: "0.03em",
          textShadow: "0 6px 40px rgba(0,0,0,0.55)",
        }}
      >
        Claude 踩坑筆記
      </div>
      <div
        style={{
          fontFamily: FONT.cjk,
          fontWeight: 700,
          fontSize: 40,
          color: C_DIM,
          letterSpacing: "0.14em",
        }}
      >
        每天真正遇到的坑 × 一句話解法 <span style={{ color: C_DIM, padding: "0 10px" }}>·</span>
        <span style={{ fontFamily: FONT.monoCjk, fontSize: 34 }}>{BRAND_MARK}</span>
      </div>
    </div>
  </AbsoluteFill>
);

export const ChannelAvatarC: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(circle at 50% 44%, #1B2242 0%, #141A33 46%, #0B0E1A 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* 玻璃細環（YouTube 圓形裁切內） */}
    <div
      style={{
        position: "absolute",
        width: 690,
        height: 690,
        left: 55,
        top: 55,
        borderRadius: "50%",
        border: "2px solid rgba(201,210,232,0.22)",
        boxShadow: "inset 0 0 60px rgba(201,210,232,0.06)",
      }}
    />
    <div
      style={{
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: 380,
        color: C_ORANGE,
        lineHeight: 1,
        textShadow: `0 0 90px ${C_ORANGE}88, 0 0 30px ${C_ORANGE}66`,
        transform: "translate(22px, -14px)",
      }}
    >
      ❯
    </div>
  </AbsoluteFill>
);
