import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../shared-skills/theme";

/**
 * 「實戰自動化」系列視覺系統(EP01) — EP00 玻璃進化版的精修版:
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
  emberSoft: "#ECA988", // ember 漸層亮端(深卡上的橙勾/強調)
  signal: COLORS.remotion, // 流程/結構
  mint: "#10B981", // 自動化成功(深卡上要亮)
  violet: COLORS.hi.violet, // 人工/判斷
  rose: "#F43F5E", // 坑/警示(深卡上要亮)
  gold: "#F5B942", // 深卡上的高亮黃(數字)
  xhs: "#FF2442", // 小紅書紅(背景珊瑚調+品牌點綴)
  xhsSoft: "#FF6E88", // 小紅書粉(背景亮端)
};

/** 小紅書瀑布流筆記卡水印(招牌雙欄 masonry,極低對比當背景紋理,不搶前景)。 */
const XhsFeedBackdrop: React.FC = () => {
  // 手排出瀑布流錯落感;每張=淡卡+頂部珊瑚封面條+兩三行假文字線。
  const cards: [number, number, number, number][] = [
    [60, 70, 250, 300], [60, 400, 250, 210], [60, 640, 250, 330],
    [1610, 60, 250, 240], [1610, 330, 250, 320], [1610, 680, 250, 250],
    [330, 820, 250, 210], [1330, 830, 250, 200],
  ];
  return (
    <AbsoluteFill style={{ opacity: 0.82 }}>
      {cards.map(([x, y, w, h], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: rgba("#ffffff", 0.72), border: `1px solid ${rgba(ACC.xhs, 0.1)}`, boxShadow: `0 10px 26px ${rgba(ACC.xhs, 0.1)}`, overflow: "hidden" }}>
          <div style={{ height: h * 0.52, background: `linear-gradient(150deg, ${rgba(ACC.xhsSoft, 0.22)}, ${rgba(ACC.xhs, 0.12)})` }} />
          <div style={{ padding: 16 }}>
            <div style={{ height: 8, borderRadius: 4, background: rgba(ACC.ink, 0.09), marginBottom: 9 }} />
            <div style={{ height: 8, width: "72%", borderRadius: 4, background: rgba(ACC.ink, 0.09), marginBottom: 14 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: 999, background: rgba(ACC.xhs, 0.16) }} />
              <div style={{ height: 7, width: 60, borderRadius: 4, background: rgba(ACC.ink, 0.07) }} />
              <div style={{ marginLeft: "auto", fontSize: 15, color: rgba(ACC.xhs, 0.34) }}>♡</div>
            </div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** 小紅書珊瑚暖調畫布 + 瀑布流筆記卡水印 + 多顆低調光暈(靜態防抖)。全片墊底。
 *  純白太單調→小紅書珊瑚漸層+招牌瀑布流卡紋理,光暈給層次;黑曜石玻璃在暖底上更跳。 */
export const WhiteBg: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFF7F4 0%, #FFEEF0 50%, #FFE2E7 100%)" }}>
    <XhsFeedBackdrop />
    {/* 左上暖橙主光 + 珊瑚粉餘暉,右上小紅書粉,底部金暈 → 有層次不單調 */}
    <div style={{ position: "absolute", left: -160, top: -200, width: 960, height: 760, borderRadius: "50%", background: rgba(ACC.ember, 0.07), filter: "blur(140px)" }} />
    <div style={{ position: "absolute", left: 40, top: 500, width: 620, height: 620, borderRadius: "50%", background: rgba(ACC.xhs, 0.05), filter: "blur(150px)" }} />
    <div style={{ position: "absolute", left: 1180, top: 100, width: 580, height: 580, borderRadius: "50%", background: rgba(ACC.xhsSoft, 0.08), filter: "blur(150px)" }} />
    <div style={{ position: "absolute", left: 880, top: 600, width: 480, height: 480, borderRadius: "50%", background: rgba(ACC.gold, 0.05), filter: "blur(140px)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)" }} />
  </AbsoluteFill>
);

/**
 * 黑曜石玻璃卡:深底白字 + 彩色 hairline 邊 + 收斂光暈 + 接地陰影。
 * 光的紀律:緊 halo(18px) 講「這塊玻璃在發光」,極淡 ambient(52px) 講「它照亮了周圍」,
 * 下方兩層投影(drop+contact) 講「它有重量」。不再用 60px 大糊光。
 */
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
