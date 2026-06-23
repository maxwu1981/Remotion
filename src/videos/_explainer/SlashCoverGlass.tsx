import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { accent } from "./palette";

/** hex (#rrggbb) → rgba string */
const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/**
 * 「自訂指令」封面 — 玻璃透光進化版（EP00 公式 + glassmorphism）。
 * 深色底 + bokeh 光球 + 全玻璃化卡片 + 中央 3D 玻璃水晶「/」+ 橘漸層發光標題。
 */
export const SlashCoverGlass: React.FC = () => {
  const rows = [
    { c: accent("warn"), key: "天天重貼規則", gloss: "一堆人都這樣" },
    { c: accent("blue"), key: ".claude/commands", gloss: "打 /指令 就跑" },
    { c: accent("green"), key: "按需載入 · 團隊共用", gloss: "CLAUDE.md 做不到" },
    { c: accent("violet"), key: "上百行 → 一個詞", gloss: "官方內建做法" },
  ];
  const orb = (x: number, y: number, size: number, color: string, a: number): React.CSSProperties => ({
    position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%",
    background: rgba(color, a), filter: "blur(90px)",
  });
  // 玻璃面板共用樣式（半透 + 背景模糊 + 邊緣高光 + 柔投影）
  const glass = (tint: string, tintA = 0.16): React.CSSProperties => ({
    background: `linear-gradient(160deg, ${rgba("#ffffff", 0.16)} 0%, ${rgba(tint, tintA)} 40%, ${rgba("#0b1020", 0.14)} 100%)`,
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: `1.5px solid ${rgba("#ffffff", 0.22)}`,
    boxShadow: `0 24px 60px ${rgba("#000000", 0.45)}, inset 0 1.5px 0 ${rgba("#ffffff", 0.5)}, inset 0 -1px 0 ${rgba("#ffffff", 0.06)}`,
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: "#fff" }}>
      {/* 深色底 */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 30% 20%, #18203a 0%, #0d1326 45%, #080b16 100%)" }} />
      {/* bokeh 光球（給玻璃可折射的色彩） */}
      <div style={orb(-60, 360, 520, accent("warn"), 0.5)} />
      <div style={orb(560, -120, 460, accent("blue"), 0.42)} />
      <div style={orb(250, 560, 460, accent("violet"), 0.36)} />
      <div style={orb(1180, 520, 520, accent("green"), 0.34)} />
      <div style={orb(1320, 120, 380, accent("warn"), 0.38)} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 30%)" }} />

      {/* 角標 */}
      <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: rgba("#ffffff", 0.7) }}>
        AI Wisdom · @aiwisdomcc
      </div>

      {/* 標題 */}
      <div style={{ position: "absolute", top: 140, left: 96 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 76, color: "#fff", lineHeight: 1, textShadow: `0 2px 24px ${rgba("#000", 0.5)}` }}>Claude Code</div>
        <div style={{ fontWeight: 800, fontSize: 132, letterSpacing: -2, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", filter: `drop-shadow(0 0 28px ${rgba(accent("warn"), 0.65)})` }}>自訂指令</div>
      </div>

      {/* 中央「/」3D 玻璃水晶 + 鉤子句 */}
      <div style={{ position: "absolute", top: 452, left: 92, display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative", width: 240, height: 300, borderRadius: 40, ...glass(accent("warn"), 0.2), display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-4deg)" }}>
          {/* 水晶內橘光 */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: `radial-gradient(60% 60% at 50% 38%, ${rgba(accent("warn"), 0.5)} 0%, transparent 70%)` }} />
          <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 250, lineHeight: 0.8, letterSpacing: -10, color: "transparent", background: "linear-gradient(150deg, #ffffff 0%, #ffe7d2 45%, #ffb27a 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", filter: `drop-shadow(0 6px 18px ${rgba("#000", 0.55)})` }}>/</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: "#fff", textShadow: `0 3px 20px ${rgba("#000", 0.55)}` }}>一個指令</span>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: "#fff", borderBottom: `10px solid ${accent("warn")}`, paddingBottom: 6, textShadow: `0 3px 20px ${rgba("#000", 0.55)}` }}>不再重貼</span>
        </div>
      </div>

      {/* 底部玻璃膠囊 */}
      <div style={{ position: "absolute", bottom: 72, left: 96, display: "flex", gap: 18, alignItems: "center" }}>
        <span style={{ padding: "16px 34px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 44, boxShadow: `0 12px 30px ${rgba(accent("warn"), 0.45)}` }}>真實開發者心聲</span>
        <span style={{ padding: "16px 32px", borderRadius: RADIUS.pill, ...glass("#ffffff", 0.08), color: "#fff", fontWeight: 800, fontSize: 40 }}>中英對照</span>
      </div>

      {/* 右側 4 張玻璃資訊卡 */}
      <div style={{ position: "absolute", top: 80, right: 70, width: 780, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 22, height: 196, padding: "0 32px", borderRadius: RADIUS.lg, ...glass(r.c, 0.22), borderColor: rgba(r.c, 0.55) as unknown as undefined, boxSizing: "border-box" }}>
            <span style={{ fontWeight: 800, fontSize: 64, color: rgba(r.c, 0.95), width: 56, textShadow: `0 0 20px ${rgba(r.c, 0.7)}` }}>{i + 1}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.05, color: "#fff" }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 32, color: rgba("#ffffff", 0.82) }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
