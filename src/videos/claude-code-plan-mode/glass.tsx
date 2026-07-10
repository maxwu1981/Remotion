import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../shared-skills/theme";

/**
 * 「新手知道一下比較好的名詞」系列 EP07 · Claude Code Plan Mode 視覺系統 —
 * 黑曜石高級感精修版(與生活應用/實戰自動化 EP01 同一套精修語言)。
 * 白底畫布 + 黑曜石玻璃卡(hairline 邊 + 收斂雙層光暈 + 接地陰影) + 橙漸層鉤子字。
 * 高級感三紀律:①光暈收斂(緊halo+極淡ambient,不做霓虹) ②字重三層(800鉤子/700標題/500正文)
 * ③對比鐵則:資訊面板一律深卡白字;白底上只放 ink 大字。
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
  ember: COLORS.claude, // 主敘事橙:數字鉤子/術語/膠囊
  emberSoft: "#ECA988", // ember 漸層亮端(深卡上的橙強調)
  signal: COLORS.remotion, // 流程/結構(終端藍)
  mint: "#10B981", // 解法/成果(深卡上要亮)
  violet: COLORS.hi.violet, // 人工判斷
  rose: "#F43F5E", // 痛點/警示(深卡上要亮)
  gold: "#F5B942", // 深卡上的高亮黃(數字)
};

/** 白底畫布 + 極淡單光源暖光(靜態、防抖)。全片墊底。 */
export const WhiteBg: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #eef2f9 100%)" }}>
    <div style={{ position: "absolute", left: -140, top: -180, width: 900, height: 700, borderRadius: "50%", background: rgba(ACC.ember, 0.055), filter: "blur(130px)" }} />
    <div style={{ position: "absolute", left: 120, top: 520, width: 520, height: 520, borderRadius: "50%", background: rgba(ACC.ember, 0.06), filter: "blur(120px)" }} />
    <div style={{ position: "absolute", left: 1240, top: 160, width: 480, height: 480, borderRadius: "50%", background: rgba(ACC.signal, 0.05), filter: "blur(120px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 26%)" }} />
  </AbsoluteFill>
);

/** 黑曜石玻璃卡:深底白字 + 彩色 hairline 邊 + 收斂光暈 + 接地陰影。 */
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

/** 斜向 glare 光帶(深卡表面的玻璃反光,低調)。父層要 overflow hidden + position relative。 */
export const Glare: React.FC = () => (
  <div style={{ position: "absolute", top: "-30%", left: "-8%", width: "34%", height: "170%", background: "linear-gradient(104deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.13) 48%, rgba(255,255,255,0) 60%)", transform: "rotate(9deg)", pointerEvents: "none" }} />
);

/** 深卡內的 hairline 分隔線。 */
export const hairline: React.CSSProperties = {
  height: 1,
  background: `linear-gradient(90deg, ${rgba("#ffffff", 0)} 0%, ${rgba("#ffffff", 0.16)} 18%, ${rgba("#ffffff", 0.16)} 82%, ${rgba("#ffffff", 0)} 100%)`,
};

/** 橙漸層 clip 大字(封面/景標的鉤子詞)。 */
export const emberClip: React.CSSProperties = {
  color: "transparent",
  background: `linear-gradient(135deg, ${COLORS.claude} 0%, #ECA988 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  filter: `drop-shadow(0 6px 16px ${rgba(COLORS.claude, 0.28)})`,
};

/** 發光膠囊(橙底白字,光收斂)。 */
export const emberPill: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 36px",
  borderRadius: 999,
  background: `linear-gradient(135deg, ${COLORS.claude} 0%, #ECA988 100%)`,
  color: "#fff",
  boxShadow: `0 0 18px ${rgba(COLORS.claude, 0.32)}, 0 12px 26px ${rgba(COLORS.claude, 0.22)}, inset 0 1px 0 ${rgba("#ffffff", 0.4)}`,
};
