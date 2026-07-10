import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../shared-skills/theme";

/**
 * 「實戰自動化」系列視覺系統(EP02 YouTube 上片) — 沿用 EP01 黑曜石 v3:
 * 淺底畫布 + 黑曜石玻璃卡(hairline 邊 + 收斂雙層光暈 + 接地陰影) + 橙漸層鉤子字。
 * EP01 背景=小紅書珊瑚;EP02 換 YouTube 冷調(雪白→霧藍)+紅點綴,系列同骨不同皮。
 * 高級感三紀律:①光暈收斂 ②字重三層(800鉤子/700標題/500正文) ③深卡白字、白底 ink 大字。
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
  ember: COLORS.claude, // 主敘事橙:數字鉤子/術語/膠囊(系列簽名色)
  emberSoft: "#ECA988", // ember 漸層亮端
  signal: COLORS.remotion, // 流程/結構
  mint: "#10B981", // 自動化成功
  violet: COLORS.hi.violet, // 人工/判斷
  rose: "#F43F5E", // 坑/警示
  gold: "#F5B942", // 深卡上的高亮黃(數字)
  yt: "#FF0033", // YouTube 紅(背景點綴+品牌)
  ytSoft: "#FF6B6B", // YouTube 紅亮端
};

/** YouTube 首頁影片卡水印(16:9 縮圖+標題線,極低對比背景紋理,不搶前景)。 */
const YtFeedBackdrop: React.FC = () => {
  const cards: [number, number, number][] = [
    // [x, y, w] — 16:9 縮圖,錯落在畫布左右緣
    [52, 78, 260], [42, 420, 240], [66, 730, 250],
    [1650, 66, 250], [1636, 400, 262], [1660, 750, 240],
    [330, 850, 235], [1350, 858, 240],
  ];
  return (
    <AbsoluteFill style={{ opacity: 0.8 }}>
      {cards.map(([x, y, w], i) => {
        const th = (w * 9) / 16;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: w }}>
            <div style={{ position: "relative", width: w, height: th, borderRadius: 14, background: `linear-gradient(150deg, ${rgba(ACC.signal, 0.1)}, ${rgba(ACC.yt, 0.08)})`, border: `1px solid ${rgba(ACC.ink, 0.06)}`, boxShadow: `0 10px 24px ${rgba(ACC.ink, 0.06)}` }}>
              {/* 播放鍵 */}
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 34, height: 24, borderRadius: 7, background: rgba(ACC.yt, 0.2), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: `10px solid ${rgba("#ffffff", 0.85)}`, marginLeft: 2 }} />
              </div>
              {/* 時長角標 */}
              <div style={{ position: "absolute", right: 7, bottom: 6, width: 34, height: 12, borderRadius: 4, background: rgba(ACC.ink, 0.18) }} />
            </div>
            <div style={{ display: "flex", gap: 9, marginTop: 9 }}>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: rgba(ACC.ink, 0.09), flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, borderRadius: 4, background: rgba(ACC.ink, 0.09), marginBottom: 7 }} />
                <div style={{ height: 7, width: "62%", borderRadius: 4, background: rgba(ACC.ink, 0.06) }} />
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** YouTube 冷調畫布 + 影片卡水印 + 多顆低調光暈(靜態防抖)。全片墊底。 */
export const WhiteBg: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #FAFCFF 0%, #F1F5FC 52%, #E7EDF8 100%)" }}>
    <YtFeedBackdrop />
    {/* 左上暖橙主光,右上 YouTube 紅暈,左下藍,底部金 → 有層次不單調 */}
    <div style={{ position: "absolute", left: -160, top: -200, width: 960, height: 760, borderRadius: "50%", background: rgba(ACC.ember, 0.07), filter: "blur(140px)" }} />
    <div style={{ position: "absolute", left: 1200, top: 60, width: 600, height: 600, borderRadius: "50%", background: rgba(ACC.yt, 0.05), filter: "blur(150px)" }} />
    <div style={{ position: "absolute", left: 60, top: 540, width: 600, height: 600, borderRadius: "50%", background: rgba(ACC.signal, 0.06), filter: "blur(150px)" }} />
    <div style={{ position: "absolute", left: 900, top: 620, width: 480, height: 480, borderRadius: "50%", background: rgba(ACC.gold, 0.05), filter: "blur(140px)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0) 60%)" }} />
  </AbsoluteFill>
);

/** 黑曜石玻璃卡(同 EP01):深底白字 + 彩色 hairline 邊 + 收斂光暈 + 接地陰影。 */
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
