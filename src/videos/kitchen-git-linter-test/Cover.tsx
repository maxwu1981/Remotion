import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRAND_MARK, COLORS, FONT, GRADIENT, RADIUS, SHADOW } from "../../shared-skills/theme";

/**
 * EP00「致勝公式」垂版封面（1080×1920）— 也當影片 0:00 閃卡 + YouTube 縮圖。
 * 正宗 EP00 色調：乾淨淺色平背景 + Anthropic 橙大鉤子 + 藍底線點綴 + 分色資訊牆卡 +
 * 曉晴門面。靜態（無逐幀動畫）→ 渲染穩定。中文用 Remotion 疊字，永遠正確。
 */

/** 系列識別：之後做 EP02… 只改這兩個常數（標題/本集名詞另外換）。 */
export const SERIES = "新手需要知道的事";
export const EP = "EP01";

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
      <span style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 48, lineHeight: 1.05 }}>{label}</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 30, opacity: 0.92 }}>{sub}</span>
    </div>
  </div>
);

export const KitchenCover: React.FC = () => (
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

    {/* giant hook — generous line spacing so nothing overlaps and the block uses the space down to the info wall */}
    <div style={{ position: "absolute", top: 206, left: 70, right: 70 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 76, lineHeight: 1.1, color: COLORS.inkSoft, letterSpacing: -1 }}>
        用一個「廚房故事」
      </div>
      <div style={{ marginTop: 34, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 150, lineHeight: 1.22, color: COLORS.ink, letterSpacing: -3 }}>
        讓你<span style={{ borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 8 }}>秒懂</span>
      </div>
      <div
        style={{
          marginTop: 46,
          fontFamily: FONT.monoCjk,
          fontWeight: 800,
          fontSize: 92,
          lineHeight: 1.18,
          letterSpacing: -2,
          color: "transparent",
          background: GRADIENT.claude,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Git・Linter・測試
      </div>
    </div>

    {/* the three signals — EP00 colored info wall */}
    <div style={{ position: "absolute", top: 770, left: 70, width: 760, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 32, color: COLORS.muted, marginBottom: 2 }}>一句話看穿 ▾</div>
      <WallRow emoji="🕰️" label="Git ＝ 時光機" sub="手滑搞砸？一鍵倒回" color={COLORS.remotion} />
      <WallRow emoji="📏" label="Linter ＝ 糾察隊" sub="強制刀工衛生統一" color={COLORS.hi.violet} />
      <WallRow emoji="🥢" label="測試 ＝ 試毒官" sub="上菜前先驗，防改壞" color={COLORS.claude} />
    </div>

    {/* contrast verdict — left lower */}
    <div style={{ position: "absolute", left: 70, bottom: 196 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 46 }}>✅</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, color: COLORS.success }}>全有＝頂級廚房</span>
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 46 }}>🚨</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, color: COLORS.error }}>全無＝快逃啊</span>
      </div>
    </div>

    {/* channel footer */}
    <div style={{ position: "absolute", left: 72, bottom: 96, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 42, color: COLORS.claudeDeep }}>
      Ai-Wisdom <span style={{ color: COLORS.muted, fontWeight: 600, fontSize: 34 }}>・ 術語白話翻譯</span>
    </div>
    <div style={{ position: "absolute", left: 74, bottom: 52, fontFamily: FONT.mono, fontWeight: 500, fontSize: 30, color: COLORS.faint }}>
      @aiwisdomcc
    </div>

    {/* Sunny 門面（右下）+ soft ground shadow to seat her on the light canvas */}
    <div style={{ position: "absolute", right: 70, bottom: 40, width: 380, height: 60, borderRadius: "50%", background: "rgba(20,20,43,0.16)", filter: "blur(20px)" }} />
    <Img
      src={staticFile("thumb/sunny.png")}
      style={{ position: "absolute", right: -26, bottom: 0, height: 760, objectFit: "contain", filter: "drop-shadow(0 14px 26px rgba(20,20,43,0.22))" }}
    />
  </AbsoluteFill>
);

/**
 * 橫版 16:9 封面（1920×1080）— 給 YouTube 縮圖（垂版 KitchenCover 在 16:9 會黑邊）。
 * 徽章沿用 EP02–05 章封面同款（橙藥丸系列名 + 深色 EP 藥丸），跟系列視覺對齊。
 */
export const KitchenCoverWide: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%)" }} />
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${COLORS.borderStrong}66 1.4px, transparent 1.5px)`,
        backgroundSize: "48px 48px",
        opacity: 0.5,
        WebkitMaskImage: "radial-gradient(ellipse 82% 76% at 42% 46%, black 42%, transparent 92%)",
        maskImage: "radial-gradient(ellipse 82% 76% at 42% 46%, black 42%, transparent 92%)",
      }}
    />
    {/* 頂色條 */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, background: COLORS.remotion }} />

    {/* 徽章（沿用 EP02–05 章封面同款）*/}
    <div style={{ position: "absolute", top: 60, left: 100, display: "flex", alignItems: "center", gap: 22 }}>
      <span style={{ padding: "12px 30px", borderRadius: RADIUS.pill, background: GRADIENT.claude, color: "#fff", fontWeight: 800, fontSize: 40 }}>{SERIES}</span>
      <span style={{ padding: "12px 30px", borderRadius: RADIUS.pill, background: COLORS.ink, color: "#fff", fontWeight: 800, fontSize: 40, fontFamily: FONT.mono, letterSpacing: 1 }}>{EP}</span>
    </div>
    <div style={{ position: "absolute", top: 72, right: 96, fontWeight: 800, fontSize: 34, color: COLORS.muted, letterSpacing: 1 }}>{BRAND_MARK}</div>

    {/* 左：巨大鉤子 */}
    <div style={{ position: "absolute", top: 232, left: 100, width: 900 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: COLORS.inkSoft, letterSpacing: -1 }}>
        用一個「廚房故事」
      </div>
      <div style={{ marginTop: 20, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 138, lineHeight: 1.14, color: COLORS.ink, letterSpacing: -3 }}>
        讓你<span style={{ borderBottom: `10px solid ${COLORS.remotion}`, paddingBottom: 6 }}>秒懂</span>
      </div>
      <div
        style={{
          marginTop: 34,
          fontFamily: FONT.monoCjk,
          fontWeight: 800,
          fontSize: 86,
          lineHeight: 1.16,
          letterSpacing: -2,
          color: "transparent",
          background: GRADIENT.claude,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Git・Linter・測試
      </div>
    </div>

    {/* 右：EP00 分色資訊牆 */}
    <div style={{ position: "absolute", top: 250, left: 1046, width: 720, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 32, color: COLORS.muted, marginBottom: 2 }}>一句話看穿 ▾</div>
      <WallRow emoji="🕰️" label="Git ＝ 時光機" sub="手滑搞砸？一鍵倒回" color={COLORS.remotion} />
      <WallRow emoji="📏" label="Linter ＝ 糾察隊" sub="強制刀工衛生統一" color={COLORS.hi.violet} />
      <WallRow emoji="🥢" label="測試 ＝ 試毒官" sub="上菜前先驗，防改壞" color={COLORS.claude} />
    </div>

    {/* 左下：對比結論 */}
    <div style={{ position: "absolute", left: 100, bottom: 150 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 44 }}>✅</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 48, color: COLORS.success }}>全有＝頂級廚房</span>
        <span style={{ fontSize: 44, marginLeft: 26 }}>🚨</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 48, color: COLORS.error }}>全無＝快逃啊</span>
      </div>
    </div>

    {/* 頻道 footer */}
    <div style={{ position: "absolute", left: 100, bottom: 66, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: COLORS.claudeDeep }}>
      Ai-Wisdom <span style={{ color: COLORS.muted, fontWeight: 600, fontSize: 32 }}>・ 術語白話翻譯 · @aiwisdomcc</span>
    </div>

    {/* Sunny 門面（右下）*/}
    <div style={{ position: "absolute", right: 96, bottom: 24, width: 320, height: 46, borderRadius: "50%", background: "rgba(20,20,43,0.16)", filter: "blur(20px)" }} />
    <Img
      src={staticFile("thumb/sunny.png")}
      style={{ position: "absolute", right: 40, bottom: 0, height: 452, objectFit: "contain", filter: "drop-shadow(0 14px 26px rgba(20,20,43,0.22))" }}
    />
  </AbsoluteFill>
);
