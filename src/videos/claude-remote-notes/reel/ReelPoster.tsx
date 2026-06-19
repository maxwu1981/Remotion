import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { Backdrop } from "../../../shared-skills/components/Backdrop";
import { Phone, Cloud } from "../motifs";
import { MOTIF } from "../data";
import { BrandGlyph } from "../components";

/**
 * Vertical (1080×1920) cover for the reel — phone↔cloud hero, big stacked title,
 * one-glance takeaways. Static (renders as a <Still>); export to PNG for the
 * Reel / Shorts thumbnail.
 */
export const ReelPoster: React.FC = () => {
  const takeaways = [
    { c: COLORS.success, t: "對話記憶共享" },
    { c: COLORS.error, t: "檔案／執行不共享" },
    { c: MOTIF.note, t: "CLAUDE.md push 才持久" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={MOTIF.cloud} seed="crn-reel-poster" freeze />

      {/* kicker */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 34px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
          <BrandGlyph size={32} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, letterSpacing: 1, color: COLORS.inkSoft }}>手機／遠端 一次看懂</span>
        </div>
      </div>

      {/* title — stacked for the tall canvas */}
      <div style={{ position: "absolute", top: 290, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: 150, letterSpacing: -5, color: COLORS.ink, lineHeight: 1 }}>Claude Code</div>
        <div style={{ marginTop: 14, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 108, letterSpacing: -2, lineHeight: 1.1 }}>
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>手機／遠端全解析</span>
        </div>
        <div style={{ marginTop: 16, fontFamily: FONT.mono, fontWeight: 600, fontSize: 54, color: COLORS.muted }}>記憶 · 容器 · CLAUDE.md</div>
      </div>

      {/* hero: phone — signal — cloud */}
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <Phone h={360} label="手機 · 遙控器" screen={<span style={{ fontSize: 96 }}>📱</span>} />
        <div style={{ marginBottom: 70 }}>
          <svg width={210} height={70} style={{ overflow: "visible" }}>
            <line x1={6} y1={35} x2={204} y2={35} stroke={MOTIF.phone} strokeWidth={4} strokeLinecap="round" />
            {[0.3, 0.6].map((t, i) => (
              <circle key={t} cx={6 + 198 * t} cy={35} r={6} fill={i % 2 === 0 ? MOTIF.phone : MOTIF.cloud} style={{ filter: `drop-shadow(0 0 7px ${i % 2 === 0 ? MOTIF.phone : MOTIF.cloud})` }} />
            ))}
            <circle cx={6} cy={35} r={7} fill={MOTIF.phone} />
            <circle cx={204} cy={35} r={7} fill={MOTIF.cloud} />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 340, height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cloud w={340} color={MOTIF.cloud} glow={0.7} />
            <span style={{ position: "absolute", top: "44%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 92, filter: `drop-shadow(0 0 18px ${MOTIF.cloud})` }}>🧠</span>
          </div>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>雲端在跑</span>
        </div>
      </div>

      {/* takeaways — stacked */}
      <div style={{ position: "absolute", top: 1330, left: 90, right: 90, display: "flex", flexDirection: "column", gap: 26 }}>
        {takeaways.map((k) => (
          <div key={k.t} style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 40px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${k.c}55`, boxShadow: SHADOW.md }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: k.c, flexShrink: 0 }} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 64, color: COLORS.ink }}>{k.t}</span>
          </div>
        ))}
      </div>

      {/* brand footer */}
      <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted, letterSpacing: 0.5 }}>整理日期 2026-06-18</span>
      </div>
    </AbsoluteFill>
  );
};
