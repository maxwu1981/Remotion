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
 * 「自訂指令」封面 — 白底 + 深黑發光玻璃卡（彩色 rim light）。
 * 深框白字清楚、邊緣外暈漸層融入白底；輕微 3D、大字、收窄中間留白。
 */
export const SlashCoverWhiteGlass: React.FC = () => {
  const rows = [
    { c: accent("warn"), key: "天天重貼規則", gloss: "一堆人都這樣" },
    { c: accent("blue"), key: ".claude/commands", gloss: "打 /指令 就跑" },
    { c: accent("green"), key: "按需載入 · 團隊共用", gloss: "CLAUDE.md 做不到" },
    { c: accent("violet"), key: "上百行 → 一個詞", gloss: "官方內建做法" },
  ];
  const orb = (x: number, y: number, size: number, color: string, a: number): React.CSSProperties => ({
    position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%",
    background: rgba(color, a), filter: "blur(110px)",
  });
  // 深黑發光玻璃卡：深底白字 + 彩色 rim light 邊 + 外暈(漸層融入白底) + 內發光
  const darkCard = (c: string): React.CSSProperties => ({
    background: `linear-gradient(158deg, ${rgba(c, 0.32)} 0%, #0e1426 52%, #0a0f1d 100%)`,
    border: `1.5px solid ${rgba(c, 0.9)}`,
    boxShadow: [
      `0 0 30px ${rgba(c, 0.55)}`,
      `0 0 70px ${rgba(c, 0.32)}`,
      `0 22px 46px ${rgba("#0b1020", 0.28)}`,
      `inset 0 0 26px ${rgba(c, 0.3)}`,
      `inset 0 2px 0 ${rgba("#ffffff", 0.35)}`,
    ].join(", "),
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  });
  const glare: React.CSSProperties = {
    position: "absolute", top: "-30%", left: "-10%", width: "38%", height: "170%",
    background: "linear-gradient(104deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 47%, rgba(255,255,255,0) 60%)",
    transform: "rotate(9deg)", pointerEvents: "none",
  };

  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      {/* 白底 + 極淡光球 */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #eef2f9 100%)" }} />
      <div style={orb(40, 420, 520, accent("warn"), 0.12)} />
      <div style={orb(900, 560, 520, accent("violet"), 0.1)} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 24%)" }} />

      {/* 角標 */}
      <div style={{ position: "absolute", top: 66, left: 92, fontWeight: 800, fontSize: 42, letterSpacing: 2, color: COLORS.muted }}>
        AI Wisdom · @aiwisdomcc
      </div>

      {/* 標題（放大） */}
      <div style={{ position: "absolute", top: 138, left: 88 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 84, color: COLORS.ink, lineHeight: 1 }}>Claude Code</div>
        <div style={{ fontWeight: 800, fontSize: 150, letterSpacing: -2, lineHeight: 1.02, color: "transparent", background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", filter: `drop-shadow(0 8px 18px ${rgba(accent("warn"), 0.3)})` }}>自訂指令</div>
      </div>

      {/* 中央「/」深玻璃水晶 + 鉤子句（放大、往右補中間留白） */}
      <div style={{ position: "absolute", top: 470, left: 88, display: "flex", alignItems: "center", gap: 44 }}>
        <div style={{ position: "relative", width: 248, height: 320, borderRadius: 46, overflow: "hidden", background: `linear-gradient(158deg, ${rgba(accent("warn"), 0.4)} 0%, #0e1426 56%, #0a0f1d 100%)`, border: `2px solid ${rgba(accent("warn"), 0.92)}`, boxShadow: `0 0 34px ${rgba(accent("warn"), 0.6)}, 0 0 74px ${rgba(accent("warn"), 0.34)}, 0 26px 52px ${rgba("#0b1020", 0.3)}, inset 0 0 30px ${rgba(accent("warn"), 0.35)}, inset 0 2px 0 ${rgba("#ffffff", 0.4)}`, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-3deg)" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(58% 52% at 50% 36%, ${rgba(accent("warn"), 0.5)} 0%, transparent 70%)` }} />
          <div style={glare} />
          <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 268, lineHeight: 0.8, letterSpacing: -10, color: "transparent", background: "linear-gradient(150deg, #ffffff 0%, #ffd9bb 40%, #ffae72 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", filter: `drop-shadow(0 0 22px ${rgba(accent("warn"), 0.8)})` }}>/</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 118, lineHeight: 1.03, color: COLORS.ink }}>一個指令</span>
          <span style={{ fontWeight: 800, fontSize: 118, lineHeight: 1.03, color: COLORS.ink, borderBottom: `12px solid ${accent("warn")}`, paddingBottom: 6 }}>不再重貼</span>
        </div>
      </div>

      {/* 底部發光膠囊 */}
      <div style={{ position: "absolute", bottom: 70, left: 92 }}>
        <span style={{ position: "relative", overflow: "hidden", display: "inline-block", padding: "18px 40px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 48, boxShadow: `0 0 28px ${rgba(accent("warn"), 0.5)}, 0 16px 34px ${rgba(accent("warn"), 0.3)}, inset 0 2.5px 0 ${rgba("#ffffff", 0.5)}` }}>
          真實開發者心聲
        </span>
      </div>

      {/* 右側 4 張深黑發光卡（加寬往左、輕微 3D、大字） */}
      <div style={{ position: "absolute", top: 66, right: 52, width: 952, display: "flex", flexDirection: "column", gap: 24, transform: "perspective(2400px) rotateY(-4deg)", transformOrigin: "right center", transformStyle: "preserve-3d" }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, height: 204, padding: "0 40px", borderRadius: RADIUS.lg, ...darkCard(r.c), color: "#fff", boxSizing: "border-box", overflow: "hidden", transform: `translateZ(${(3 - i) * 10}px)` }}>
            <div style={glare} />
            <span style={{ position: "relative", fontWeight: 800, fontSize: 70, width: 58, color: r.c, textShadow: `0 0 24px ${rgba(r.c, 0.95)}` }}>{i + 1}</span>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 62, lineHeight: 1.04, color: "#fff", textShadow: `0 0 18px ${rgba(r.c, 0.5)}` }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 38, color: rgba("#ffffff", 0.9) }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
