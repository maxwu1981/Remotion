import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { accent } from "./palette";

const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/**
 * 「自訂指令」封面 — 深色底 + 邊緣 rim-light 發光玻璃磚（仿高級 tech UI 立體感）。
 * EP00 版面：標題 + 「/」發光玻璃水晶 + 右側 4 張深玻璃磚（各自彩色發光邊）。
 */
export const SlashCoverNeonGlass: React.FC = () => {
  const rows = [
    { c: accent("warn"), key: "天天重貼規則", gloss: "一堆人都這樣" },
    { c: accent("blue"), key: ".claude/commands", gloss: "打 /指令 就跑" },
    { c: accent("green"), key: "按需載入 · 團隊共用", gloss: "CLAUDE.md 做不到" },
    { c: accent("violet"), key: "上百行 → 一個詞", gloss: "官方內建做法" },
  ];
  const DARK = "#070b16";
  const orb = (x: number, y: number, size: number, color: string, a: number): React.CSSProperties => ({
    position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%",
    background: rgba(color, a), filter: "blur(120px)",
  });
  // 深磨砂玻璃磚 + 彩色 rim light 發光邊 + 外暈 + 內發光 + 頂部斜角高光 + 漂浮深投影
  const neonGlass = (c: string): React.CSSProperties => ({
    background: `linear-gradient(158deg, ${rgba(c, 0.16)} 0%, ${rgba(DARK, 0.5)} 52%, ${rgba(DARK, 0.62)} 100%)`,
    border: `1.5px solid ${rgba(c, 0.85)}`,
    boxShadow: [
      `0 0 26px ${rgba(c, 0.6)}`,
      `0 0 64px ${rgba(c, 0.34)}`,
      `0 30px 56px ${rgba("#000000", 0.55)}`,
      `inset 0 0 24px ${rgba(c, 0.28)}`,
      `inset 0 2px 0 ${rgba("#ffffff", 0.4)}`,
    ].join(", "),
    backdropFilter: "blur(11px)",
    WebkitBackdropFilter: "blur(11px)",
  });
  const sheen: React.CSSProperties = {
    position: "absolute", left: 0, right: 0, top: 0, height: "46%",
    borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg,
    background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none",
  };
  const glare = (w = "40%", left = "-10%"): React.CSSProperties => ({
    position: "absolute", top: "-30%", left, width: w, height: "170%",
    background: "linear-gradient(104deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 47%, rgba(255,255,255,0) 60%)",
    transform: "rotate(9deg)", pointerEvents: "none",
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: "#fff" }}>
      {/* 深色底 + 中央環境光 */}
      <AbsoluteFill style={{ background: "radial-gradient(130% 115% at 50% 32%, #14223e 0%, #0a1124 46%, #05080f 100%)" }} />
      <div style={orb(-60, 360, 540, accent("warn"), 0.34)} />
      <div style={orb(560, -120, 480, accent("blue"), 0.3)} />
      <div style={orb(240, 600, 460, accent("violet"), 0.26)} />
      <div style={orb(1300, 470, 540, accent("green"), 0.24)} />

      {/* 角標 */}
      <div style={{ position: "absolute", top: 70, left: 100, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: rgba("#ffffff", 0.65) }}>
        AI Wisdom · @aiwisdomcc
      </div>

      {/* 標題 */}
      <div style={{ position: "absolute", top: 140, left: 96 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 76, color: "#fff", lineHeight: 1, textShadow: `0 2px 22px ${rgba("#000", 0.5)}` }}>Claude Code</div>
        <div style={{ fontWeight: 800, fontSize: 132, letterSpacing: -2, lineHeight: 1.04, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", filter: `drop-shadow(0 0 30px ${rgba(accent("warn"), 0.7)})` }}>自訂指令</div>
      </div>

      {/* 中央「/」發光玻璃水晶 + 鉤子句 */}
      <div style={{ position: "absolute", top: 446, left: 92, display: "flex", alignItems: "center", gap: 46 }}>
        <div style={{ position: "relative", width: 238, height: 306, borderRadius: 44, overflow: "hidden", background: `linear-gradient(158deg, ${rgba(accent("warn"), 0.24)} 0%, ${rgba(DARK, 0.5)} 55%, ${rgba(DARK, 0.62)} 100%)`, border: `2px solid ${rgba(accent("warn"), 0.9)}`, boxShadow: `0 0 32px ${rgba(accent("warn"), 0.7)}, 0 0 72px ${rgba(accent("warn"), 0.4)}, 0 32px 60px ${rgba("#000", 0.6)}, inset 0 0 30px ${rgba(accent("warn"), 0.35)}, inset 0 2px 0 ${rgba("#ffffff", 0.5)}`, backdropFilter: "blur(11px)", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-3deg)" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(58% 52% at 50% 36%, ${rgba(accent("warn"), 0.55)} 0%, transparent 70%)` }} />
          <div style={glare("50%")} />
          <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 256, lineHeight: 0.8, letterSpacing: -10, color: "transparent", background: "linear-gradient(150deg, #ffffff 0%, #ffd9bb 40%, #ffae72 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", filter: `drop-shadow(0 0 22px ${rgba(accent("warn"), 0.8)})` }}>/</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: "#fff", textShadow: `0 3px 20px ${rgba("#000", 0.6)}` }}>一個指令</span>
          <span style={{ fontWeight: 800, fontSize: 100, lineHeight: 1.05, color: "#fff", borderBottom: `10px solid ${accent("warn")}`, paddingBottom: 6, textShadow: `0 3px 20px ${rgba("#000", 0.6)}` }}>不再重貼</span>
        </div>
      </div>

      {/* 底部發光膠囊 */}
      <div style={{ position: "absolute", bottom: 76, left: 96 }}>
        <span style={{ position: "relative", overflow: "hidden", display: "inline-block", padding: "18px 38px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 46, boxShadow: `0 0 30px ${rgba(accent("warn"), 0.6)}, 0 16px 34px ${rgba("#000", 0.5)}, inset 0 2.5px 0 ${rgba("#ffffff", 0.5)}` }}>
          <span style={glare("28%")} />
          真實開發者心聲
        </span>
      </div>

      {/* 右側 4 張深玻璃發光磚（各自彩色 rim light，輕微 3D 浮空） */}
      <div style={{ position: "absolute", top: 74, right: 62, width: 800, display: "flex", flexDirection: "column", gap: 26, transform: "perspective(1700px) rotateY(-8deg)", transformOrigin: "right center", transformStyle: "preserve-3d" }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, height: 186, padding: "0 34px", borderRadius: RADIUS.lg, ...neonGlass(r.c), color: "#fff", boxSizing: "border-box", overflow: "hidden", transform: `translateZ(${(3 - i) * 18}px)` }}>
            <div style={sheen} />
            <div style={glare()} />
            <span style={{ position: "relative", fontWeight: 800, fontSize: 62, width: 52, color: r.c, textShadow: `0 0 22px ${rgba(r.c, 0.9)}` }}>{i + 1}</span>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.05, color: "#fff", textShadow: `0 0 18px ${rgba(r.c, 0.6)}` }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 32, color: rgba("#ffffff", 0.86) }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
