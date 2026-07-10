import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, WhiteBg, darkCard, Glare, emberClip, hairline, rgba } from "./glass";

/**
 * 「新手知道一下比較好的名詞」EP07 · Claude Code Plan Mode 封面 — 黑曜石高級感精修版。
 * 構圖:左=純排版三層級(實體→巨大鉤子「終結核准疲勞」→副句「先看完整計畫，一次決定」)+
 * 底部核准次數暗玻璃條(20+→1);右=黑曜石獨石碑「Plan Mode 終端卡」——命令列+唯讀計畫清單+
 * 核准選項,遠看是一張終端截圖,近看是完整機制示範。frame 0 亮相不淡入。
 */

const planLines: { icon: string; text: string; tone?: "mint" | "rose" }[] = [
  { icon: "📖", text: "只讀 · 掃描 15 個路由檔案" },
  { icon: "📝", text: "產出遷移計畫 · 4 個步驟" },
  { icon: "⛔", text: "不寫檔 · 不執行有副作用指令", tone: "rose" },
];

const approveLines = ["Approve + Auto", "Approve + Review each", "Keep planning"];

export const PlanModeCover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
    <WhiteBg />

    {/* ── Eyebrow:系列徽章 + 頻道名 ── */}
    <div style={{ position: "absolute", top: 66, left: 100, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 30px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
        <span style={{ fontWeight: 700, fontSize: 33, letterSpacing: 3, color: "#fff" }}>新手名詞 EP07</span>
      </div>
      <span style={{ fontWeight: 500, fontSize: 30, letterSpacing: 7, color: ACC.muted }}>AI WISDOM · @aiwisdomcc</span>
    </div>

    {/* ── 左:標題三層級 ── */}
    <div style={{ position: "absolute", top: 208, left: 96 }}>
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 66, letterSpacing: 1, color: ACC.ink }}>
        Claude Code <span style={{ color: ACC.ember }}>✕</span> Plan Mode
      </div>
      <div
        style={{
          ...emberClip,
          background: "linear-gradient(160deg, #F09A6B 0%, #D97757 40%, #B54C29 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          fontWeight: 800,
          fontSize: 176,
          letterSpacing: -3,
          lineHeight: 1.05,
          marginTop: 10,
          filter: `drop-shadow(0 8px 20px ${rgba(ACC.ember, 0.35)})`,
        }}
      >
        終結核准疲勞
      </div>
      <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ width: 64, height: 3, background: ACC.ember, borderRadius: 2 }} />
        <span style={{ fontWeight: 500, fontSize: 46, letterSpacing: 8, color: ACC.inkSoft }}>
          先看完整計畫<span style={{ color: ACC.muted }}>，</span>一次決定
        </span>
      </div>
    </div>

    {/* ── 左下:核准次數暗玻璃條 ── */}
    <div style={{ position: "absolute", bottom: 78, left: 96 }}>
      <div style={{ ...darkCard(ACC.ember, { r: 24, glow: 0.85 }), position: "relative", overflow: "hidden", display: "flex", alignItems: "baseline", gap: 18, padding: "26px 46px" }}>
        <Glare />
        <span style={{ position: "relative", fontWeight: 500, fontSize: 34, color: rgba("#ffffff", 0.62) }}>核准次數</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 62, color: rgba("#ffffff", 0.5) }}>20+</span>
        <span style={{ position: "relative", fontWeight: 700, fontSize: 40, color: ACC.emberSoft }}>→</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 96, color: ACC.gold, textShadow: `0 0 22px ${rgba(ACC.gold, 0.45)}` }}>1</span>
        <span style={{ position: "relative", width: 1, alignSelf: "stretch", background: rgba("#ffffff", 0.16), margin: "0 14px" }} />
        <span style={{ position: "relative", fontWeight: 500, fontSize: 30, color: rgba("#ffffff", 0.55) }}>Anthropic 官方數據</span>
        <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 44, color: ACC.rose }}>93%</span>
        <span style={{ position: "relative", fontWeight: 500, fontSize: 28, color: rgba("#ffffff", 0.55) }}>核准疲勞</span>
      </div>
    </div>

    {/* ── 右:黑曜石獨石碑「Plan Mode 終端卡」 ── */}
    <div style={{ position: "absolute", right: 118, bottom: 52, width: 520, height: 56, borderRadius: "50%", background: rgba("#0b1020", 0.22), filter: "blur(26px)" }} />
    <div
      style={{
        position: "absolute",
        top: 92,
        right: 108,
        width: 590,
        height: 880,
        borderRadius: 48,
        overflow: "hidden",
        transform: "rotate(-3deg)",
        transformOrigin: "center",
        ...darkCard(ACC.signal, { r: 48, glow: 1.15 }),
      }}
    >
      {/* 終端窗口條 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 76, display: "flex", alignItems: "center", gap: 10, padding: "0 30px", borderBottom: `1px solid ${rgba("#ffffff", 0.12)}`, background: rgba("#000000", 0.18) }}>
        <span style={{ width: 16, height: 16, borderRadius: 999, background: "#F04A45" }} />
        <span style={{ width: 16, height: 16, borderRadius: 999, background: "#F5B942" }} />
        <span style={{ width: 16, height: 16, borderRadius: 999, background: "#2FC15E" }} />
        <span style={{ marginLeft: 14, fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: rgba("#ffffff", 0.6) }}>Claude Code — Plan Mode</span>
      </div>
      <Glare />

      {/* 卡身內容 */}
      <div style={{ position: "absolute", top: 108, left: 44, right: 44, bottom: 40, display: "flex", flexDirection: "column" }}>
        {/* 指令列 */}
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 27, color: ACC.signal, textShadow: `0 0 12px ${rgba(ACC.signal, 0.5)}` }}>
          $ claude --permission-mode plan
        </div>

        <div style={{ ...hairline, margin: "26px 0 22px" }} />

        {/* 計畫清單 */}
        <div style={{ fontWeight: 500, fontSize: 24, letterSpacing: 3, color: rgba("#ffffff", 0.55), marginBottom: 16 }}>唯讀計畫 · 產出中</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {planLines.map((l) => (
            <div key={l.text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>{l.icon}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 25, color: l.tone === "rose" ? ACC.rose : rgba("#ffffff", 0.88) }}>{l.text}</span>
            </div>
          ))}
        </div>

        <div style={{ ...hairline, margin: "28px 0 22px" }} />

        {/* 核准選項 */}
        <div style={{ fontWeight: 500, fontSize: 24, letterSpacing: 3, color: rgba("#ffffff", 0.55), marginBottom: 16 }}>計畫完成 · 你決定</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {approveLines.map((t, i) => (
            <div
              key={t}
              style={{
                fontFamily: FONT.mono,
                fontWeight: i === 0 ? 700 : 500,
                fontSize: 24,
                padding: "10px 18px",
                borderRadius: 12,
                color: i === 0 ? ACC.gold : rgba("#ffffff", 0.55),
                background: i === 0 ? rgba(ACC.gold, 0.14) : "transparent",
                border: i === 0 ? `1px solid ${rgba(ACC.gold, 0.4)}` : `1px solid ${rgba("#ffffff", 0.08)}`,
              }}
            >
              {i === 0 ? "▸ " : "  "}{t}
            </div>
          ))}
        </div>

        {/* 碑腳 */}
        <div style={{ marginTop: "auto", textAlign: "center", fontWeight: 500, fontSize: 24, letterSpacing: 5, color: rgba("#ffffff", 0.5) }}>
          唯讀先出計畫 · 一次決定
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
