import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared-skills/theme";
import spec from "../_explainer/specs/remotion-autovideo.json";
import { WhiteBg, ACC, darkCard, Glare, hairline, emberClip, rgba, accOf } from "../fb-autopost/glass";

/**
 * YouTube 縮圖（1920×1080）— 生活應用 EP07「Remotion 自動生成影片」。
 * 系列一致：忠實複製黑曜石片頭封面景（同 pinterest / fb-autopost 版型），
 * 左上「生活應用系列 EP07」藥丸 + handle、titlePre/titlePost 大標、tagline、4 chip、右側 master prompt 石碑。
 * 純縮圖故不帶字幕。
 */
const EP = "生活應用系列 EP07";
const cover = spec.scenes[0] as any;

export const RemotionAutoVideoThumb: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
    <WhiteBg />

    {/* 左上：系列藥丸 + handle */}
    <div style={{ position: "absolute", top: 62, left: 96, display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 28px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 11, height: 11, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
        <span style={{ fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "#fff" }}>{EP}</span>
      </div>
      <span style={{ fontWeight: 500, fontSize: 27, letterSpacing: 6, color: ACC.muted }}>AI WISDOM · @aiwisdomcc</span>
    </div>

    {/* 大標 + tagline */}
    <div style={{ position: "absolute", top: 200, left: 96 }}>
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 72, letterSpacing: 1, color: ACC.ink }}>{cover.titlePre}</div>
      <div style={{ ...emberClip, background: "linear-gradient(160deg, #F09A6B 0%, #D97757 42%, #B54C29 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", fontWeight: 800, fontSize: 138, letterSpacing: -2, lineHeight: 1.02, marginTop: 6, filter: `drop-shadow(0 8px 20px ${rgba(ACC.ember, 0.35)})` }}>{cover.titlePost}</div>
      <div style={{ marginTop: 30, display: "flex", alignItems: "flex-start", gap: 22, maxWidth: 1010 }}>
        <span style={{ width: 60, height: 3, background: ACC.ember, borderRadius: 2, marginTop: 22, flexShrink: 0 }} />
        <span style={{ fontWeight: 500, fontSize: 36, lineHeight: 1.34, letterSpacing: 1, color: ACC.inkSoft }}>{spec.brand.tagline}</span>
      </div>
    </div>

    {/* 左下 4 數字 chip */}
    <div style={{ position: "absolute", bottom: 120, left: 96, display: "flex", gap: 20 }}>
      {(cover.chips ?? []).map((ch: any, i: number) => {
        const c = accOf(ch.accent);
        return (
          <div key={i} style={{ ...darkCard(c, { r: 18, glow: 0.75 }), position: "relative", overflow: "hidden", padding: "18px 28px", display: "flex", alignItems: "baseline", gap: 12 }}>
            <Glare />
            <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 58, color: "#fff", textShadow: `0 0 18px ${rgba(c, 0.6)}` }}>{ch.n}</span>
            <span style={{ position: "relative", fontWeight: 600, fontSize: 28, color: rgba("#ffffff", 0.82) }}>{ch.t}</span>
          </div>
        );
      })}
    </div>

    {/* 右：master prompt 獨石碑 */}
    <div style={{ position: "absolute", top: 178, right: 92, width: 620, ...darkCard(ACC.ember, { r: 40, glow: 1.2 }), overflow: "hidden", padding: "40px 42px", transform: "rotate(-2.5deg)" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(54% 30% at 50% 20%, ${rgba(ACC.ember, 0.36)} 0%, transparent 72%)` }} />
      <Glare />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 30 }}>💬</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, letterSpacing: 1, color: rgba("#ffffff", 0.7) }}>你只要對 Claude 說一句話</span>
      </div>
      <div style={{ position: "relative", padding: "22px 24px", borderRadius: 16, background: rgba("#060a14", 0.7), border: `1px solid ${rgba(ACC.ember, 0.35)}`, boxShadow: `inset 0 2px 6px ${rgba("#000", 0.5)}` }}>
        <span style={{ fontFamily: FONT.monoCjk, fontSize: 30, lineHeight: 1.42, color: "#fff" }}>
          <span style={{ color: ACC.gold }}>$</span> 「Hi Claude，幫我用 Remotion 把這篇文章<span style={{ color: ACC.emberSoft }}>自動變成解說影片</span>」
        </span>
      </div>
      <div style={{ ...hairline, position: "relative", margin: "26px 0 22px" }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 15 }}>
        {["一份 JSON → Remotion → 配音 → 出片", "程式碼畫面 · AI 配音 · 全在本機", "改內容＝改文字檔，不用重錄重剪"].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, color: ACC.emberSoft, textShadow: `0 0 12px ${rgba(ACC.ember, 0.6)}` }}>✓</span>
            <span style={{ fontWeight: 500, fontSize: 27, color: rgba("#ffffff", 0.85) }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
