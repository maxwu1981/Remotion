import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../shared-skills/theme";

/**
 * 「生活應用」黑曜石視覺系統 — hf-voiceid（Hugging Face 聽聲音辨識發言人）EP09。
 * 沿用系列黑曜石（EP04 fb-autopost / EP06 ig-autopost 同款）：
 *   淺底畫布 + 黑曜石玻璃深卡（hairline 邊 + 收斂雙層光暈 + 接地陰影）+ 橙漸層鉤子字。
 * 本片背景=中性高級冷調 + 極淡「音波＋發言人氣泡」水印（呼應聲音辨識，靜態防抖）。
 * 高級感三紀律：①光暈收斂 ②字重三層(800鉤子/700標題/500正文) ③深卡白字、白底 ink 大字。
 */
export const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const ACC = {
  ink: COLORS.ink,
  inkSoft: COLORS.inkSoft,
  muted: COLORS.muted,
  white: "#F7F9FC",
  ember: COLORS.claude, // 主敘事橙：數字鉤子/術語/膠囊（系列簽名色）
  emberSoft: "#ECA988", // ember 漸層亮端
  signal: COLORS.remotion, // 流程/結構（青）
  mint: "#10B981", // 成功/輸出
  violet: COLORS.hi.violet, // gated/授權
  rose: "#F43F5E", // 坑/警示
  gold: "#F5B942", // 深卡上的高亮黃（數字；亦呼應 HF 黃）
  azure: "#3B82F6", // 冷調藍（帳號/網站步驟）
  azureSoft: "#7CAEF8",
};

/** 語意 accent key → 色（對映 spec 的 AccentKey）。 */
export const accOf = (k?: string): string =>
  ({ blue: ACC.azure, green: ACC.mint, warn: ACC.rose, violet: ACC.violet, claude: ACC.ember, teal: ACC.signal }[k ?? "claude"] ?? ACC.ember);

/** 極淡「音波＋發言人氣泡」水印（靜態長條音波 + 圓頭像對話列，低對比不搶前景）。 */
const WaveBackdrop: React.FC = () => {
  // 一組靜態音波條（偽隨機高度，寫死避免每幀變動 → 防抖）
  const wave = (seed: number, n: number) =>
    Array.from({ length: n }, (_, i) => 10 + Math.abs(Math.sin(seed + i * 1.7)) * 34);
  const groups: { x: number; y: number; seed: number; n: number; c: string }[] = [
    { x: 46, y: 120, seed: 1, n: 16, c: ACC.azure },
    { x: 40, y: 470, seed: 5, n: 14, c: ACC.ember },
    { x: 60, y: 800, seed: 9, n: 15, c: ACC.signal },
    { x: 1650, y: 100, seed: 3, n: 15, c: ACC.violet },
    { x: 1640, y: 440, seed: 7, n: 16, c: ACC.gold },
    { x: 1660, y: 780, seed: 11, n: 14, c: ACC.mint },
  ];
  const rows: { x: number; y: number; w: number }[] = [
    { x: 320, y: 880, w: 220 }, { x: 1380, y: 890, w: 230 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 0.8 }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ position: "absolute", left: g.x, top: g.y, display: "flex", alignItems: "center", gap: 7, height: 60 }}>
          {wave(g.seed, g.n).map((h, i) => (
            <span key={i} style={{ width: 6, height: h, borderRadius: 3, background: rgba(g.c, 0.1) }} />
          ))}
        </div>
      ))}
      {rows.map((r, i) => (
        <div key={`r${i}`} style={{ position: "absolute", left: r.x, top: r.y, display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 24, height: 24, borderRadius: 999, background: rgba(ACC.ink, 0.08), flexShrink: 0 }} />
          <div>
            <div style={{ height: 8, width: r.w, borderRadius: 4, background: rgba(ACC.ink, 0.08), marginBottom: 7 }} />
            <div style={{ height: 7, width: r.w * 0.6, borderRadius: 4, background: rgba(ACC.ink, 0.055) }} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** 中性高級冷調畫布 + 音波水印 + 多顆低調收斂光暈（靜態防抖）。全片墊底。 */
export const WhiteBg: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #FAFCFF 0%, #EEF3FB 52%, #E4EAF4 100%)" }}>
    <WaveBackdrop />
    <div style={{ position: "absolute", left: -160, top: -200, width: 960, height: 760, borderRadius: "50%", background: rgba(ACC.ember, 0.07), filter: "blur(140px)" }} />
    <div style={{ position: "absolute", left: 1200, top: 60, width: 600, height: 600, borderRadius: "50%", background: rgba(ACC.gold, 0.06), filter: "blur(150px)" }} />
    <div style={{ position: "absolute", left: 60, top: 540, width: 600, height: 600, borderRadius: "50%", background: rgba(ACC.signal, 0.05), filter: "blur(150px)" }} />
    <div style={{ position: "absolute", left: 900, top: 620, width: 480, height: 480, borderRadius: "50%", background: rgba(ACC.azure, 0.05), filter: "blur(140px)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)" }} />
  </AbsoluteFill>
);

/** 黑曜石玻璃卡：深底白字 + 彩色 hairline 邊 + 收斂光暈 + 接地陰影。 */
export const darkCard = (c: string, opts?: { r?: number; glow?: number }): React.CSSProperties => {
  const g = opts?.glow ?? 1;
  return {
    background: `linear-gradient(160deg, ${rgba(c, 0.22)} 0%, #0D1322 46%, #090E1B 100%)`,
    border: `1px solid ${rgba(c, 0.55)}`,
    borderRadius: opts?.r ?? 22,
    boxShadow: [
      `0 0 ${18 * g}px ${rgba(c, 0.32)}`,
      `0 0 ${52 * g}px ${rgba(c, 0.12)}`,
      `0 24px 46px ${rgba("#0b1020", 0.28)}`,
      `0 3px 8px ${rgba("#0b1020", 0.2)}`,
      `inset 0 0 22px ${rgba(c, 0.15)}`,
      `inset 0 1px 0 ${rgba("#ffffff", 0.24)}`,
    ].join(", "),
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    color: ACC.white,
  };
};

/** 斜向 glare 光帶（深卡表面玻璃反光）。父層需 overflow hidden + position relative。 */
export const Glare: React.FC = () => (
  <div style={{ position: "absolute", top: "-30%", left: "-8%", width: "34%", height: "170%", background: "linear-gradient(104deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.13) 48%, rgba(255,255,255,0) 60%)", transform: "rotate(9deg)", pointerEvents: "none" }} />
);

/** 深卡內 hairline 分隔線。 */
export const hairline: React.CSSProperties = {
  height: 1,
  background: `linear-gradient(90deg, ${rgba("#ffffff", 0)} 0%, ${rgba("#ffffff", 0.16)} 18%, ${rgba("#ffffff", 0.16)} 82%, ${rgba("#ffffff", 0)} 100%)`,
};

/** 橙漸層 clip 大字（封面/景標鉤子詞）。 */
export const emberClip: React.CSSProperties = {
  color: "transparent",
  background: `linear-gradient(135deg, ${COLORS.claude} 0%, #ECA988 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  filter: `drop-shadow(0 6px 16px ${rgba(COLORS.claude, 0.28)})`,
};

/** 發光膠囊（橙底白字，光收斂）。 */
export const emberPill: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 36px",
  borderRadius: 999,
  background: `linear-gradient(135deg, ${COLORS.claude} 0%, #ECA988 100%)`,
  color: "#fff",
  boxShadow: `0 0 18px ${rgba(COLORS.claude, 0.32)}, 0 12px 26px ${rgba(COLORS.claude, 0.22)}, inset 0 1px 0 ${rgba("#ffffff", 0.4)}`,
};
