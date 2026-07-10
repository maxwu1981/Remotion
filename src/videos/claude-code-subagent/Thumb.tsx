import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, FONT } from "../../shared-skills/theme";

/**
 * 風格 B 封面（縮圖）— 1280×720 Still，可複用。
 *
 * 設計定案（2026-06-21）：亮背高對比 + 3D 終端/橙光氛圍(中等) + 右側 ~40%
 * 主播「曉晴」門面 + 左側橙色數字鉤子 + 一行具體數據(GEO) + 左下「Claude
 * Code 解法」角標 + 1→N 品牌簽名。換 props 就出下一集的封面。
 *
 * 曉晴正式圖用 Gemini 生（見 README）。`character` 指到 public/ 下的去背 PNG
 * 時用真圖；沒給時 fallback 一個動漫示意，讓 Studio 不空。
 */
export type ThumbProps = {
  /** 鉤子第一行的橙色數字/字首（如 "5"）。 */
  hookLeadNum: string;
  /** 鉤子第一行數字後面的字（如 "隻分身"）。 */
  hookLeadRest: string;
  /** 鉤子第二行（如 "並行開工"）。 */
  hookSecond: string;
  /** 一行具體數據，GEO 用（含數字/結論）。 */
  dataLine: string;
  /** 左上小標。 */
  eyebrow: string;
  /** 右下時長徽章。 */
  duration: string;
  /** 曉晴去背 PNG 路徑（public/ 下，用 staticFile）。不給就用動漫示意。 */
  character?: string;
};

const ORANGE = COLORS.claude; // Anthropic 橙 #D97757
const ORANGE_DEEP = COLORS.claudeDeep;
const NAVY = "#1E2A3A";

/** 曉晴動漫示意（SVG fallback，正式版用 Gemini PNG 取代）。 */
const SunnyPlaceholder: React.FC = () => (
  <g transform="translate(-17.5,58) scale(1.9)">
    <ellipse cx="525" cy="180" rx="84" ry="104" fill="url(#ccsHair)" />
    <path d="M430 383 C436 300 472 252 525 252 C578 252 614 300 620 383 Z" fill="#C9D3DC" />
    <rect x="508" y="196" width="34" height="40" rx="14" fill="#F2C9AC" />
    <path d="M470 300 C470 268 495 250 525 250 C555 250 580 268 580 300 L568 300 C566 276 548 262 525 262 C502 262 484 276 482 300 Z" fill="#28303C" />
    <rect x="478" y="258" width="16" height="18" rx="6" fill="#2E3A4A" />
    <rect x="556" y="258" width="16" height="18" rx="6" fill="#2E3A4A" />
    <rect x="481" y="262" width="10" height="10" rx="3" fill={ORANGE} />
    <rect x="559" y="262" width="10" height="10" rx="3" fill={ORANGE} />
    <ellipse cx="525" cy="160" rx="47" ry="53" fill="#F6D7BE" />
    <ellipse cx="571" cy="166" rx="9" ry="13" fill="#F2C9AC" />
    <path d="M572 178 l7 -8 l7 8 l-7 8 Z" fill="#CFEAF6" />
    <path d="M482 150 C488 112 562 112 568 150 C556 130 540 122 525 122 C510 122 494 130 482 150 Z" fill="url(#ccsHair)" />
    <ellipse cx="483" cy="188" rx="15" ry="62" fill="url(#ccsHair)" />
    <ellipse cx="567" cy="188" rx="15" ry="62" fill="url(#ccsHair)" />
    <ellipse cx="510" cy="166" rx="11" ry="9" fill="#FFFFFF" />
    <ellipse cx="540" cy="166" rx="11" ry="9" fill="#FFFFFF" />
    <circle cx="511" cy="167" r="6.5" fill="#5B4636" />
    <circle cx="541" cy="167" r="6.5" fill="#5B4636" />
    <circle cx="511" cy="167" r="3" fill="#241A12" />
    <circle cx="541" cy="167" r="3" fill="#241A12" />
    <path d="M515 192 q10 9 20 0" stroke="#C2705E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </g>
);

export const SubagentThumb: React.FC<ThumbProps> = ({
  hookLeadNum,
  hookLeadRest,
  hookSecond,
  dataLine,
  eyebrow,
  duration,
  character,
}) => {
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #E9F1FB 0%, #F8F5EF 100%)" }}>
      <svg width="1280" height="720" viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ccsGlow" cx="985" cy="360" r="450" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFC88A" stopOpacity="0.85" />
            <stop offset="0.6" stopColor="#FFB36B" stopOpacity="0.32" />
            <stop offset="1" stopColor="#FFB36B" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ccsHair" x1="0" y1="80" x2="0" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2B2535" />
            <stop offset="0.5" stopColor="#5A4536" />
            <stop offset="1" stopColor="#D9AE5C" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1280" height="720" fill="url(#ccsGlow)" />

        <g transform="rotate(11 1075 175)">
          <rect x="950" y="58" width="252" height="234" rx="18" fill={NAVY} />
          <circle cx="972" cy="82" r="5" fill="#E2604A" />
          <circle cx="988" cy="82" r="5" fill="#E8A53C" />
          <circle cx="1004" cy="82" r="5" fill="#4FBF7B" />
          <rect x="972" y="106" width="150" height="11" rx="5" fill="#5DCAA5" />
          <rect x="972" y="132" width="196" height="11" rx="5" fill="#3A4658" />
          <rect x="972" y="158" width="112" height="11" rx="5" fill={ORANGE} />
          <rect x="972" y="184" width="176" height="11" rx="5" fill="#3A4658" />
          <rect x="972" y="210" width="88" height="11" rx="5" fill="#85B7EB" />
          <rect x="972" y="236" width="152" height="11" rx="5" fill="#3A4658" />
        </g>

        {character ? null : <SunnyPlaceholder />}

        <circle cx="98" cy="556" r="10" fill={ORANGE} />
        <path d="M108 556 L168 528" stroke={ORANGE} strokeWidth="3" fill="none" />
        <path d="M108 556 L168 556" stroke={ORANGE} strokeWidth="3" fill="none" />
        <path d="M108 556 L168 584" stroke={ORANGE} strokeWidth="3" fill="none" />
        <circle cx="174" cy="526" r="7" fill={ORANGE} />
        <circle cx="174" cy="556" r="7" fill={ORANGE} />
        <circle cx="174" cy="586" r="7" fill={ORANGE} />
      </svg>

      {character ? (
        <Img
          src={staticFile(character)}
          style={{ position: "absolute", right: 24, bottom: 0, height: 704, objectFit: "contain" }}
        />
      ) : null}

      <div style={{ position: "absolute", left: 70, top: 122, width: 680, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 30, letterSpacing: 1, color: "#5A6675" }}>{eyebrow}</div>
        <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 112, lineHeight: 1.04, color: COLORS.ink }}>
          <span style={{ color: ORANGE, fontSize: 130 }}>{hookLeadNum}</span>
          {hookLeadRest}
        </div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 112, lineHeight: 1.04, color: COLORS.ink }}>{hookSecond}</div>
        <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 31, color: "#46505E" }}>{dataLine}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          bottom: 44,
          display: "inline-flex",
          alignItems: "center",
          padding: "12px 28px",
          borderRadius: 999,
          background: NAVY,
          fontFamily: FONT.uiCjk,
          fontWeight: 700,
          fontSize: 28,
          color: "#FFFFFF",
        }}
      >
        Claude Code <span style={{ color: "#F0A24E", marginLeft: 6 }}>解法</span>
      </div>

      <div
        style={{
          position: "absolute",
          right: 36,
          bottom: 30,
          padding: "8px 16px",
          borderRadius: 8,
          background: "rgba(17,22,29,0.88)",
          fontFamily: FONT.ui,
          fontWeight: 600,
          fontSize: 26,
          color: "#FFFFFF",
        }}
      >
        {duration}
      </div>

      {character ? null : (
        <div style={{ position: "absolute", right: 44, bottom: 8, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 18, color: "#7A8694" }}>
          曉晴 · Sunny（角色示意，正式圖用 Gemini 生）
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 預設實例：subagent 打樣片封面。 */
export const SubagentThumbDefault: React.FC = () => (
  <SubagentThumb
    eyebrow="Claude Code 實測"
    hookLeadNum="5"
    hookLeadRest=" 個分身"
    hookSecond="該不該開？"
    dataLine="實測：重任務省 59% · 小任務反而慢 24%"
    duration="8:24"
    character="thumb/sunny.png"
  />
);
