import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared-skills/theme";

/**
 * 「本地存取優勢」EP01 — 銀灰霧面玻璃風(仿老闆給的 NotebookLM 資訊圖:
 * 拉絲金屬底 + 半透明玻璃面板 + 四角螺絲 + 浮雕銀白字),全片貫穿 + 封面同款。
 * 橘色只給「術語/數字/勝方」,維持 Anthropic 品牌感(EP00 公式的數字鉤子色)。
 */
export const SILVER = {
  ink: "#2b313d",
  inkSoft: "#49515f",
  muted: "#6d7584",
  white: "#f7f9fc",
  orange: "#E7902F", // 巨大數字/術語鉤子(EP00 公式)
  claude: "#D97757",
  blue: "#4a7dbd",
  green: "#3f9464",
  red: "#c25555",
};

/** 拉絲銀灰金屬底 + 斜向柔光(靜態、無動畫 → 防抖)。全片墊底。 */
export const MetalBg: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(155deg, #e3e7ec 0%, #ced4dc 30%, #b8bfca 58%, #a3abb7 100%)" }}>
    {/* 斜向光帶 ×2(仿參考圖左上入光) */}
    <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 26%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 62%)" }} />
    {/* 細拉絲紋理(repeating-linear,極淡) */}
    <AbsoluteFill
      style={{
        background: "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, rgba(90,100,115,0.04) 3px, rgba(90,100,115,0.04) 5px)",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 60%, rgba(50,58,72,0.18) 100%)" }} />
  </AbsoluteFill>
);

/** 霧面玻璃面板底樣式(半透明白 + 上緣高光 + 外陰影)。 */
export const glass = (opts?: { a?: number; r?: number }): React.CSSProperties => ({
  background: `linear-gradient(168deg, rgba(255,255,255,${(opts?.a ?? 0.34) + 0.12}) 0%, rgba(255,255,255,${opts?.a ?? 0.34}) 45%, rgba(235,239,245,${(opts?.a ?? 0.34) - 0.08}) 100%)`,
  border: "1.5px solid rgba(255,255,255,0.75)",
  borderRadius: opts?.r ?? 26,
  boxShadow:
    "0 22px 44px rgba(45,54,70,0.28), 0 4px 10px rgba(45,54,70,0.14), inset 0 1.5px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(120,130,150,0.22)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
});

/** 浮雕銀白大字(仿參考圖標題字)。 */
export const emboss: React.CSSProperties = {
  color: "#fbfcfe",
  textShadow: "0 2px 5px rgba(52,61,78,0.5), 0 0 1px rgba(255,255,255,0.6)",
};

/** 玻璃面板四角螺絲。 */
export const Screws: React.FC<{ inset?: number }> = ({ inset = 16 }) => {
  const dot = (x: "left" | "right", y: "top" | "bottom"): React.CSSProperties => ({
    position: "absolute",
    [x]: inset,
    [y]: inset,
    width: 11,
    height: 11,
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 30%, #f2f4f8 0%, #b9c0cb 55%, #868e9c 100%)",
    boxShadow: "inset 0 -1px 2px rgba(60,70,88,0.55), 0 1px 1px rgba(255,255,255,0.7)",
  });
  return (
    <>
      <div style={dot("left", "top")} />
      <div style={dot("right", "top")} />
      <div style={dot("left", "bottom")} />
      <div style={dot("right", "bottom")} />
    </>
  );
};

/** 深色小方塊 chip(仿參考圖的終端機/資料夾圖標框)。 */
export const DarkChip: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 74 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.2,
      background: "linear-gradient(170deg, #3a4250 0%, #232936 100%)",
      border: "1px solid rgba(255,255,255,0.35)",
      boxShadow: "0 8px 18px rgba(40,48,62,0.4), inset 0 1px 0 rgba(255,255,255,0.28)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.52,
      color: "#e8ecf3",
      flex: "none",
    }}
  >
    {children}
  </div>
);

/** 玻璃標題橫幅(每景頂部大標,浮雕字)。 */
export const GlassHeader: React.FC<{ children: React.ReactNode; width?: number | string }> = ({ children, width = "auto" }) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div style={{ ...glass({ a: 0.3, r: 20 }), position: "relative", width, padding: "20px 56px", textAlign: "center" }}>
      <Screws inset={12} />
      <span style={{ ...emboss, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 54, letterSpacing: 3 }}>{children}</span>
    </div>
  </div>
);
