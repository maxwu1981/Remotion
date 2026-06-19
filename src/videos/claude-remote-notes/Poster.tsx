import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { Phone, Cloud } from "./motifs";
import { MOTIF } from "./data";
import { BrandGlyph } from "./components";

/**
 * Thumbnail / cover for the video — phone↔cloud hero, big title, one-glance
 * takeaways. Static (renders as a <Still>), so no frame-based animation.
 */
export const Poster: React.FC = () => {
  const takeaways = [
    { c: COLORS.success, t: "對話記憶共享" },
    { c: COLORS.error, t: "檔案／執行不共享" },
    { c: MOTIF.note, t: "CLAUDE.md push 才持久" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={MOTIF.cloud} seed="crn-poster" freeze />

      {/* kicker */}
      <div style={{ position: "absolute", top: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
          <BrandGlyph size={28} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, letterSpacing: 1, color: COLORS.inkSoft }}>手機／遠端 一次看懂</span>
        </div>
      </div>

      {/* title */}
      <div style={{ position: "absolute", top: 196, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 104, letterSpacing: -2, color: COLORS.ink, lineHeight: 1.08 }}>
          Claude Code{" "}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>手機／遠端</span>
        </div>
        <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 64, letterSpacing: -1, color: COLORS.inkSoft }}>
          記憶、容器與 <span style={{ fontFamily: FONT.mono }}>CLAUDE.md</span> 全解析
        </div>
      </div>

      {/* hero: phone — signal — cloud */}
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
        <Phone h={300} label="手機 · 螢幕／遙控器" screen={<span style={{ fontSize: 80 }}>📱</span>} />
        <div style={{ marginBottom: 56 }}>
          <svg width={300} height={70} style={{ overflow: "visible" }}>
            <line x1={6} y1={35} x2={294} y2={35} stroke={MOTIF.phone} strokeWidth={3} strokeLinecap="round" />
            {[0.25, 0.5, 0.75].map((t, i) => (
              <circle key={t} cx={6 + 288 * t} cy={35} r={5} fill={i % 2 === 0 ? MOTIF.phone : MOTIF.cloud} style={{ filter: `drop-shadow(0 0 6px ${i % 2 === 0 ? MOTIF.phone : MOTIF.cloud})` }} />
            ))}
            <circle cx={6} cy={35} r={6} fill={MOTIF.phone} />
            <circle cx={294} cy={35} r={6} fill={MOTIF.cloud} />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 300, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cloud w={300} color={MOTIF.cloud} glow={0.7} />
            <span style={{ position: "absolute", top: "44%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 76, filter: `drop-shadow(0 0 16px ${MOTIF.cloud})` }}>🧠</span>
          </div>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>雲端遠端電腦 · 真正在跑</span>
        </div>
      </div>

      {/* takeaways */}
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
        {takeaways.map((k) => (
          <div key={k.t} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${k.c}55`, boxShadow: SHADOW.md }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: k.c }} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{k.t}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
