import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW } from "../../shared-skills/theme";

/**
 * EP00「致勝公式」垂版封面（1080×1920）— 也當影片 0:00 閃卡 + YouTube 縮圖。
 * 沿用 EP01 同款：乾淨淺色平背景 + Anthropic 橙大鉤子 + 藍底線點綴 + 分色資訊牆卡 + 曉晴門面。
 * 本集 EP02：API / SDK / 函式庫，用「去餐廳吃飯」比喻。中文用 Remotion 疊字，永遠正確。
 */

/** 系列識別：之後做 EP03… 只改這兩個常數（標題/本集名詞另外換）。 */
export const SERIES = "新手知道一下比較好的名詞";
export const EP = "EP02";

/** EP00 風格分色資訊牆卡（實色底 + 白字 + emoji）。 */
const WallRow: React.FC<{ emoji: string; label: string; sub: string; color: string }> = ({ emoji, label, sub, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      height: 132,
      padding: "0 30px",
      borderRadius: RADIUS.lg,
      background: color,
      color: "#fff",
      boxShadow: SHADOW.md,
    }}
  >
    <span style={{ fontSize: 64 }}>{emoji}</span>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 46, lineHeight: 1.05 }}>{label}</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 29, opacity: 0.92 }}>{sub}</span>
    </div>
  </div>
);

export const ApiCover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
    {/* EP00 乾淨淺色平背景 */}
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />
    {/* faint dotted grid masked toward centre */}
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${COLORS.borderStrong}66 1.4px, transparent 1.5px)`,
        backgroundSize: "48px 48px",
        opacity: 0.5,
        WebkitMaskImage: "radial-gradient(ellipse 85% 70% at 50% 42%, black 42%, transparent 92%)",
        maskImage: "radial-gradient(ellipse 85% 70% at 50% 42%, black 42%, transparent 92%)",
      }}
    />

    {/* series badge + name */}
    <div style={{ position: "absolute", top: 96, left: 70, display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ padding: "8px 22px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontFamily: FONT.mono, fontWeight: 800, fontSize: 36, boxShadow: SHADOW.sm }}>{EP}</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, letterSpacing: 1, color: COLORS.claudeDeep }}>{SERIES}</span>
    </div>

    {/* giant hook */}
    <div style={{ position: "absolute", top: 206, left: 70, right: 70 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 76, lineHeight: 1.1, color: COLORS.inkSoft, letterSpacing: -1 }}>
        用一頓「餐廳吃飯」
      </div>
      <div style={{ marginTop: 34, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 150, lineHeight: 1.22, color: COLORS.ink, letterSpacing: -3 }}>
        分清<span style={{ borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 8 }}>三個詞</span>
      </div>
      <div
        style={{
          marginTop: 46,
          fontFamily: FONT.monoCjk,
          fontWeight: 800,
          fontSize: 88,
          lineHeight: 1.18,
          letterSpacing: -2,
          color: "transparent",
          background: GRADIENT.claude,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        API・SDK・函式庫
      </div>
    </div>

    {/* the three terms — EP00 colored info wall */}
    <div style={{ position: "absolute", top: 770, left: 70, width: 800, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 32, color: COLORS.muted, marginBottom: 2 }}>一句話看穿 ▾</div>
      <WallRow emoji="🧾" label="API ＝ 隔窗口點餐" sub="你點，廚房做，不進廚房" color={COLORS.remotion} />
      <WallRow emoji="📦" label="SDK ＝ 料理包" sub="食材＋食譜＋工具，帶回家自己組" color={COLORS.hi.violet} />
      <WallRow emoji="🧴" label="函式庫 ＝ 現成醬料" sub="要哪味，開罐直接加" color={COLORS.claude} />
    </div>

    {/* one-line verdict — left lower */}
    <div style={{ position: "absolute", left: 70, bottom: 196 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 46 }}>🪟</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 48, color: COLORS.claudeDeep }}>API＝隔牆點餐</span>
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 46 }}>🏠</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 48, color: COLORS.success }}>SDK／庫＝搬回家煮</span>
      </div>
    </div>

    {/* channel footer */}
    <div style={{ position: "absolute", left: 72, bottom: 96, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 42, color: COLORS.claudeDeep }}>
      Ai-Wisdom <span style={{ color: COLORS.muted, fontWeight: 600, fontSize: 34 }}>・ 工程師黑話翻譯</span>
    </div>
    <div style={{ position: "absolute", left: 74, bottom: 52, fontFamily: FONT.mono, fontWeight: 500, fontSize: 30, color: COLORS.faint }}>
      @aiwisdomcc
    </div>

    {/* Sunny 門面（右下）+ soft ground shadow */}
    <div style={{ position: "absolute", right: 70, bottom: 40, width: 380, height: 60, borderRadius: "50%", background: "rgba(20,20,43,0.16)", filter: "blur(20px)" }} />
    <Img
      src={staticFile("thumb/sunny.png")}
      style={{ position: "absolute", right: -26, bottom: 0, height: 760, objectFit: "contain", filter: "drop-shadow(0 14px 26px rgba(20,20,43,0.22))" }}
    />
  </AbsoluteFill>
);
