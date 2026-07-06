import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND_MARK, FONT } from "../../shared-skills/theme";
import { DarkChip, MetalBg, SILVER, Screws, emboss, glass } from "./glass";

const O = SILVER.orange;

/**
 * EP06 封面(新手名詞系列) — EP00 致勝公式文字排版(巨大數字鉤子 + 右側資訊牆) × 銀灰霧玻璃風合併。
 * 中文全部 Remotion 疊(AI 生圖中文必亂碼);同款也當影片 0:00 開場卡。
 */
export const LocalAccessCover: React.FC = () => {
  const rows = [
    { c: O, big: "0", unit: "API call", key: "本機直讀", gloss: "雲端每檔 1+ 次呼叫" },
    { c: SILVER.blue, big: "毫秒", unit: "vs 百毫秒", key: "硬碟 vs 網路往返", gloss: "同一個檔案,差一百倍" },
    { c: SILVER.green, big: "全能", unit: "vs 唯讀", key: "讀改寫跑指令", gloss: "雲端只能看、不能改" },
    { c: "#8B5CF6", big: "分工", unit: "", key: "本機給 Claude Code", gloss: "雲端 Drive 給 Gemini" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <MetalBg />

      {/* 角標 + EP 徽章 */}
      <div style={{ position: "absolute", top: 56, left: 84, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ ...glass({ a: 0.3, r: 16 }), padding: "10px 26px" }}>
          <span style={{ fontWeight: 800, fontSize: 40, letterSpacing: 2, color: SILVER.inkSoft }}>{BRAND_MARK}</span>
        </div>
        <div style={{ ...glass({ a: 0.26, r: 16 }), padding: "10px 26px", border: `2px solid ${O}` }}>
          <span style={{ fontWeight: 800, fontSize: 40, letterSpacing: 2, color: O }}>新手需要知道的事 · EP06</span>
        </div>
      </div>

      {/* 左:標題 + 巨大數字鉤子(EP00 公式) */}
      <div style={{ position: "absolute", top: 170, left: 84 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <DarkChip size={72}>{">_"}</DarkChip>
          <span style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 74, color: SILVER.ink }}>Claude Code 讀檔案</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 130, color: SILVER.ink }}>快</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: 330,
              lineHeight: 1,
              letterSpacing: -8,
              color: "transparent",
              background: `linear-gradient(165deg, #ffb765 0%, ${O} 46%, #c96c1e 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              filter: "drop-shadow(0 10px 26px rgba(231,144,47,0.45)) drop-shadow(0 2px 0 rgba(255,255,255,0.6))",
            }}
          >
            100
          </span>
          <span style={{ fontWeight: 800, fontSize: 130, color: SILVER.ink }}>倍</span>
        </div>
        <div style={{ marginTop: 8, display: "inline-block", ...glass({ a: 0.3, r: 18 }), padding: "14px 34px" }}>
          <span style={{ ...emboss, fontWeight: 800, fontSize: 60, letterSpacing: 2 }}>
            本機路徑 <span style={{ color: O, textShadow: "0 2px 6px rgba(120,60,10,0.35)" }}>vs</span> 雲端硬碟
          </span>
        </div>
      </div>

      {/* 底部膠囊 */}
      <div style={{ position: "absolute", bottom: 64, left: 88 }}>
        <span
          style={{
            display: "inline-block",
            padding: "16px 40px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${SILVER.claude} 0%, #ECA988 100%)`,
            color: "#fff",
            fontWeight: 800,
            fontSize: 44,
            boxShadow: "0 0 26px rgba(217,119,87,0.45), 0 14px 30px rgba(120,60,30,0.3), inset 0 2px 0 rgba(255,255,255,0.55)",
          }}
        >
          真實對話實測 · 附生活化比喻
        </span>
      </div>

      {/* 右:資訊牆 4 卡(EP00 公式的分色牆 → 銀玻璃版) */}
      <div
        style={{
          position: "absolute",
          top: 152,
          right: 56,
          width: 850,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          transform: "perspective(2400px) rotateY(-4deg)",
          transformOrigin: "right center",
        }}
      >
        {rows.map((r) => (
          <div
            key={r.key}
            style={{
              ...glass({ a: 0.36, r: 24 }),
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 28,
              height: 196,
              padding: "0 38px",
              boxSizing: "border-box",
              borderLeft: `10px solid ${r.c}`,
              overflow: "hidden",
            }}
          >
            <Screws inset={12} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, width: 340, flex: "none", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: 800, fontSize: r.big.length > 1 ? 78 : 120, color: r.c, textShadow: "0 2px 0 rgba(255,255,255,0.7), 0 6px 16px rgba(60,70,90,0.3)" }}>
                {r.big}
              </span>
              {r.unit && <span style={{ fontWeight: 800, fontSize: 34, color: SILVER.inkSoft }}>{r.unit}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.05, color: SILVER.ink }}>{r.key}</span>
              <span style={{ fontWeight: 700, fontSize: 34, color: SILVER.muted }}>{r.gloss}</span>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
