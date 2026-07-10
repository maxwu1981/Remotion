import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../../shared-skills/theme";
import { DarkChip, GlassHeader, SILVER, Screws, emboss, glass } from "./glass";

/**
 * EP01「本地存取優勢」各景 — 全部銀玻璃風、程式畫(中文正確)。
 * 防抖紀律:只用 opacity 淡入 + 慢速線性位移,元件進場後凍結,無彈跳/spring。
 */
export type Mark = { start: number; end: number };
export type SceneProps = { dur: number; marks: Mark[] };

const O = SILVER.orange;

const fi = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const lerp = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 打字機(等寬,整數字元 → 不抖)。 */
const typed = (f: number, at: number, text: string, cps = 2.4) =>
  text.slice(0, Math.max(0, Math.floor((f - at) * cps)));

const label = (size = 40, color = SILVER.ink, weight = 800): React.CSSProperties => ({
  fontFamily: FONT.uiCjk,
  fontWeight: weight,
  fontSize: size,
  color,
});

/* ────────────────────────── S1 鉤子:兩條路賽跑 ────────────────────────── */
export const RaceScene: React.FC<SceneProps> = ({ marks, dur }) => {
  const f = useCurrentFrame();
  const zipAt = marks[1].start; // h2:本機檔案瞬移
  const lane = (y: number): React.CSSProperties => ({
    position: "absolute",
    left: 130,
    right: 130,
    top: y,
    height: 4,
    borderRadius: 2,
    background: "linear-gradient(90deg, rgba(90,100,118,0.55), rgba(90,100,118,0.2))",
  });
  // 雲端檔案:整景慢慢爬(繞地球);本機檔案:h2 一到 20 格直達
  const cloudP = lerp(f, marks[0].start + 8, dur - 10, 0, 0.82);
  const localP = lerp(f, zipAt + 4, zipAt + 24, 0, 1);
  const trackW = 1420;
  const localTrackW = 1300; // 本機檔案終點停在標籤前,不壓到右側圖標
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, opacity: fi(f, 4) }}>
        <GlassHeader>同一個檔案 · 兩條路</GlassHeader>
      </div>
      <div style={{ position: "absolute", top: 300, left: 120, width: 1680, height: 620, ...glass({ a: 0.28 }), opacity: fi(f, 10) }}>
        <Screws />
        {/* 本機 lane */}
        <div style={{ position: "absolute", left: 60, top: 96, display: "flex", alignItems: "center", gap: 20 }}>
          <DarkChip>{">_"}</DarkChip>
          <span style={label(42)}>本機路徑</span>
        </div>
        <div style={lane(210)} />
        <div style={{ position: "absolute", left: 130 + localP * localTrackW, top: 158, fontSize: 62, opacity: fi(f, zipAt) }}>📄</div>
        <div style={{ position: "absolute", right: 44, top: 96 }}>
          <DarkChip>🤖</DarkChip>
        </div>
        <div style={{ position: "absolute", right: 150, top: 108, opacity: fi(f, zipAt + 26) }}>
          <span style={{ ...label(46, O), textShadow: "0 2px 0 rgba(255,255,255,0.7)" }}>幾毫秒 ⚡</span>
        </div>

        {/* 雲端 lane */}
        <div style={{ position: "absolute", left: 60, top: 400, display: "flex", alignItems: "center", gap: 20 }}>
          <DarkChip>☁️</DarkChip>
          <span style={label(42)}>雲端硬碟</span>
        </div>
        <div style={{ ...lane(516), background: "repeating-linear-gradient(90deg, rgba(90,100,118,0.5) 0 18px, rgba(90,100,118,0) 18px 34px)" }} />
        <div style={{ position: "absolute", left: 130 + trackW * 0.5 - 40, top: 430, fontSize: 76, opacity: 0.9 }}>🌍</div>
        <div
          style={{
            position: "absolute",
            left: 130 + cloudP * trackW,
            top: 462 - Math.sin(Math.min(cloudP, 1) * Math.PI) * 46,
            fontSize: 62,
            opacity: fi(f, marks[0].start + 8),
          }}
        >
          📄
        </div>
        <div style={{ position: "absolute", right: 150, top: 412, opacity: fi(f, zipAt + 26) }}>
          <span style={label(46, SILVER.muted)}>幾百毫秒 🐢</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S2 我的故事:全丟雲端 ────────────────────────── */
export const StoryScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const files = [
    { e: "🖼️", t: "圖片" },
    { e: "🎵", t: "音樂" },
    { e: "📝", t: "字幕" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, opacity: fi(f, 4) }}>
        <GlassHeader>我的日常 · 檔案整天丟來丟去</GlassHeader>
      </div>
      {/* 左:每天的素材 */}
      <div style={{ position: "absolute", left: 150, top: 330, width: 640, ...glass({ a: 0.3 }), padding: "44px 50px", opacity: fi(f, marks[0].start) }}>
        <Screws />
        <div style={{ display: "flex", gap: 44, justifyContent: "center" }}>
          {files.map((x, i) => (
            <div key={x.t} style={{ textAlign: "center", opacity: fi(f, marks[0].start + 8 + i * 8) }}>
              <div style={{ fontSize: 84 }}>{x.e}</div>
              <div style={{ ...label(34, SILVER.inkSoft), marginTop: 10 }}>{x.t}</div>
            </div>
          ))}
        </div>
        <div style={{ ...label(38, SILVER.ink), textAlign: "center", marginTop: 30 }}>
          每天用 <span style={{ color: O }}>Claude Code</span> 做影片
        </div>
      </div>
      {/* 中:上雲箭頭 + 雲 */}
      <div style={{ position: "absolute", left: 860, top: 300, textAlign: "center", opacity: fi(f, marks[1].start) }}>
        <div style={{ fontSize: 150, filter: "drop-shadow(0 12px 24px rgba(70,80,100,0.35))" }}>☁️</div>
        <div style={{ ...glass({ a: 0.3, r: 14 }), display: "inline-block", padding: "8px 22px", marginTop: 4 }}>
          <span style={label(32, SILVER.inkSoft)}>Google Drive</span>
        </div>
        <div style={{ ...label(60, SILVER.muted), marginTop: 8 }}>⬆︎</div>
        <div style={{ ...label(36, SILVER.inkSoft) }}>「全放雲端最方便」</div>
      </div>
      {/* 右:st3 疑惑 */}
      <div style={{ position: "absolute", right: 130, top: 380, width: 520, opacity: fi(f, marks[2].start + 6) }}>
        <div style={{ ...glass({ a: 0.32 }), padding: "38px 42px", borderLeft: `10px solid ${SILVER.red}` }}>
          <Screws />
          <div style={{ fontSize: 66, textAlign: "center" }}>🐢⏳</div>
          <div style={{ ...label(40, SILVER.ink), textAlign: "center", marginTop: 16, lineHeight: 1.4 }}>
            怎麼<span style={{ color: SILVER.red }}>那麼慢</span>?<br />
            還一直<span style={{ color: SILVER.red }}>吃額度</span>?
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S3 四大痛點卡 ────────────────────────── */
export const PainScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const cards = [
    { e: "🔁", k: "每檔 1+ 次 API 呼叫", g: "先叫工具,才拿得到檔案", at: marks[0].start + 6 },
    { e: "🌐", k: "幾百毫秒 一趟", g: "跨網路來回,不是讀硬碟", at: marks[0].start + Math.round((marks[0].end - marks[0].start) * 0.6) },
    { e: "🔥", k: "Token 白白燒", g: "API 回應結構 + metadata 過路費", at: marks[1].start + 8 },
    { e: "🔒", k: "唯讀 不能改", g: "只能看,要改檔案做不到", at: marks[2].start + 8 },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, opacity: fi(f, 4) }}>
        <GlassHeader>繞雲端的代價</GlassHeader>
      </div>
      <div style={{ position: "absolute", top: 280, left: 200, right: 200, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34 }}>
        {cards.map((c) => (
          <div key={c.k} style={{ ...glass({ a: 0.34 }), position: "relative", padding: "36px 42px", display: "flex", gap: 30, alignItems: "center", opacity: fi(f, c.at), borderLeft: `10px solid ${SILVER.red}` }}>
            <Screws inset={12} />
            <div style={{ fontSize: 78 }}>{c.e}</div>
            <div>
              <div style={label(44)}>{c.k}</div>
              <div style={{ ...label(32, SILVER.muted, 700), marginTop: 8 }}>{c.g}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S4 直接問當事人(真實截圖) ────────────────────────── */
export const AskScene: React.FC<SceneProps> = ({ marks, dur }) => {
  const f = useCurrentFrame();
  const scale = lerp(f, 0, dur, 1.0, 1.06); // 慢 Ken Burns(線性、防抖)
  const W = 1560;
  const H = 975; // 2560×1600 → 1.6 比例,正好無裁切
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 116, left: 0, right: 0, opacity: fi(f, 4) }}>
        <GlassHeader>與其上網查,不如直接問當事人</GlassHeader>
      </div>
      <div style={{ position: "absolute", top: 254, left: (1920 - W) / 2 - 22, width: W + 44, height: H - 280 + 44, ...glass({ a: 0.3 }), padding: 22, boxSizing: "content-box", opacity: fi(f, 8) }}>
        <div style={{ position: "relative", width: W, height: H - 280, borderRadius: 18, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)" }}>
          <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "50% 20%" }}>
            <Img src={staticFile("local-access/chat1.png")} style={{ width: W, height: H, display: "block" }} />
          </div>
          {/* a1:框住我的原話(右上使用者泡泡) */}
          <div
            style={{
              position: "absolute",
              left: W * 0.305,
              top: H * 0.148,
              width: W * 0.575,
              height: H * 0.082,
              border: `4px solid ${SILVER.blue}`,
              borderRadius: 14,
              boxShadow: "0 0 0 4px rgba(74,125,189,0.25)",
              opacity: fi(f, marks[0].start + 20) * (1 - fi(f, marks[1].start, 8)),
            }}
          />
          {/* a2:框住 Claude 的結論句 */}
          <div
            style={{
              position: "absolute",
              left: W * 0.112,
              top: H * 0.259,
              width: W * 0.605,
              height: H * 0.052,
              border: `4px solid ${O}`,
              borderRadius: 12,
              boxShadow: "0 0 0 4px rgba(231,144,47,0.28)",
              opacity: fi(f, marks[1].start + 10),
            }}
          />
        </div>
        {/* 標記:未改一字 */}
        <div style={{ position: "absolute", top: -26, right: 30, ...glass({ a: 0.5, r: 999 }), padding: "8px 26px" }}>
          <span style={label(30, SILVER.inkSoft)}>📸 真實對話 · 未改一字</span>
        </div>
      </div>
      {/* a2 放大金句 */}
      <div style={{ position: "absolute", bottom: 168, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fi(f, marks[1].start + 16) }}>
        <div style={{ ...glass({ a: 0.42, r: 20 }), padding: "18px 44px", borderLeft: `10px solid ${O}` }}>
          <span style={label(44)}>
            「對我來說,<span style={{ color: O }}>本機路徑完勝</span> Google Drive。」— Claude Code
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S5 詳細比較牆(四回合) ────────────────────────── */
export const CompareWall: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const rows = [
    { k: "存取方式", l: ["Read / Bash 直讀", "0 API call"], r: ["需 MCP 工具", "每檔 1+ call"] },
    { k: "延遲", l: ["幾毫秒", "硬碟直讀"], r: ["幾百毫秒", "網路往返 ≈ 慢 100 倍"] },
    { k: "Token 消耗", l: ["只有檔案內容", "一毛不多花"], r: ["+ API 回應結構", "+ metadata 過路費"] },
    { k: "可執行操作", l: ["讀・改・寫・跑指令", "全部都行"], r: ["唯讀", "不能直接修改"] },
  ];
  const stampAt = marks[3].end - 34; // c4 尾「四比零」
  const cell = (win: boolean): React.CSSProperties => ({
    ...glass({ a: win ? 0.4 : 0.24, r: 18 }),
    position: "relative",
    flex: 1,
    padding: "13px 26px",
    borderLeft: win ? `8px solid ${O}` : `8px solid rgba(120,128,142,0.5)`,
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 112, left: 0, right: 0, opacity: fi(f, 4) }}>
        <GlassHeader width={1300}>本機路徑 🆚 Google Drive MCP</GlassHeader>
      </div>
      {/* 欄頭 */}
      <div style={{ position: "absolute", top: 244, left: 120, right: 120, display: "flex", gap: 26, paddingLeft: 240, opacity: fi(f, 10) }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
          <DarkChip size={56}>{">_"}</DarkChip>
          <span style={{ ...emboss, ...label(40), color: undefined } as React.CSSProperties}>
            <span style={{ ...emboss, fontWeight: 800, fontSize: 40 }}>本機路徑(終端機位置)</span>
          </span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
          <DarkChip size={56}>☁️</DarkChip>
          <span style={{ ...emboss, fontWeight: 800, fontSize: 40 }}>Google Drive MCP</span>
        </div>
      </div>
      {/* 四回合 rows */}
      <div style={{ position: "absolute", top: 322, left: 120, right: 120, display: "flex", flexDirection: "column", gap: 17 }}>
        {rows.map((r, i) => {
          const on = fi(f, marks[i].start + 4, 10);
          return (
            <div key={r.k} style={{ display: "flex", gap: 26, alignItems: "stretch", opacity: 0.18 + on * 0.82 }}>
              <div style={{ width: 214, display: "flex", alignItems: "center" }}>
                <div style={{ ...glass({ a: 0.32, r: 14 }), padding: "14px 20px", width: "100%", textAlign: "center" }}>
                  <span style={label(34, SILVER.inkSoft)}>{r.k}</span>
                </div>
              </div>
              <div style={cell(true)}>
                <div style={label(40)}>
                  <span style={{ color: O, marginRight: 14 }}>✓</span>
                  {r.l[0]}
                </div>
                <div style={{ ...label(30, SILVER.muted, 700), marginTop: 4, marginLeft: 44 }}>{r.l[1]}</div>
              </div>
              <div style={cell(false)}>
                <div style={label(40, SILVER.inkSoft)}>
                  <span style={{ color: SILVER.red, marginRight: 14 }}>✗</span>
                  {r.r[0]}
                </div>
                <div style={{ ...label(30, SILVER.muted, 700), marginTop: 4, marginLeft: 44 }}>{r.r[1]}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* 四比零 stamp */}
      <div
        style={{
          position: "absolute",
          right: 62,
          top: 74,
          transform: "rotate(8deg)",
          opacity: fi(f, stampAt, 8),
        }}
      >
        <div style={{ border: `6px solid ${O}`, borderRadius: 20, padding: "6px 24px", background: "rgba(255,255,255,0.5)", boxShadow: "0 10px 24px rgba(60,70,90,0.25)" }}>
          <span style={{ ...label(66, O), fontFamily: FONT.monoCjk }}>4 : 0</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S6 生活化比喻:冰箱 vs 外送 ────────────────────────── */
export const KitchenScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const panel = (win: boolean): React.CSSProperties => ({
    ...glass({ a: 0.32 }),
    position: "relative",
    width: 700,
    padding: "42px 48px",
    borderTop: `10px solid ${win ? O : SILVER.muted}`,
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, opacity: fi(f, 4) }}>
        <GlassHeader>講生活一點 🍳</GlassHeader>
      </div>
      <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        {/* 自家冰箱 */}
        <div style={{ ...panel(true), opacity: fi(f, marks[0].start + 4) }}>
          <Screws />
          <div style={{ textAlign: "center", fontSize: 92 }}>🧊 → 👩‍🍳</div>
          <div style={{ ...label(46), textAlign: "center", marginTop: 18 }}>
            本機路徑 = <span style={{ color: O }}>自家冰箱</span>
          </div>
          <div style={{ ...label(36, SILVER.inkSoft, 700), textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
            伸手就拿 · 幾毫秒
            <br />
            想煎想炒都隨你(可改可寫)
          </div>
        </div>
        {/* 叫外送 */}
        <div style={{ ...panel(false), opacity: fi(f, marks[1].start + 4) }}>
          <Screws />
          <div style={{ textAlign: "center", fontSize: 92 }}>🛵 → 📦</div>
          <div style={{ ...label(46, SILVER.inkSoft), textAlign: "center", marginTop: 18 }}>
            雲端硬碟 = <span style={{ color: SILVER.red }}>叫外送</span>
          </div>
          <div style={{ ...label(36, SILVER.muted, 700), textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
            要等配送(延遲) · 要付運費(token)
            <br />
            只送到門口,不進廚房(唯讀)
          </div>
        </div>
      </div>
      {/* m3 金句 */}
      <div style={{ position: "absolute", bottom: 190, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fi(f, marks[2].start + 8) }}>
        <div style={{ ...glass({ a: 0.44, r: 999 }), padding: "18px 52px", borderLeft: `10px solid ${O}` }}>
          <span style={label(44)}>
            廚師就住你家——<span style={{ color: O }}>別再每樣食材都叫外送</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S7 案例 A:三種路徑情況 ────────────────────────── */
export const ThreeCasesScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const rows = [
    { s: "📁 專案資料夾裡", know: "✅ 自動知道", how: "講檔名就好", at: marks[1].start + 4, c: SILVER.green },
    { s: "⬇️ 下載、文件等常用夾", know: "⚠️ 知道規律", how: "給檔名它就找得到", at: marks[2].start + 4, c: O },
    { s: "❓ 完全陌生的路徑", know: "❌ 不知道", how: "Finder 拖進終端機 → 路徑自己跳出來", at: marks[3].start + 4, c: SILVER.blue },
  ];
  const dragP = lerp(f, marks[3].start + 30, marks[3].start + 60, 0, 1); // t4:拖檔演示
  const pathText = typed(f, marks[3].start + 64, "/Users/maxwu/Pictures/新畫作.png", 1.6);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 116, left: 0, right: 0, opacity: fi(f, marks[0].start) }}>
        <GlassHeader>路徑怎麼給?就三種情況</GlassHeader>
      </div>
      {/* 表頭 */}
      <div style={{ position: "absolute", top: 254, left: 170, right: 170, display: "flex", gap: 22, opacity: fi(f, marks[0].start + 10) }}>
        {["情況", "AI 知道嗎?", "怎麼做"].map((h, i) => (
          <div key={h} style={{ flex: [1.2, 0.7, 1.1][i], textAlign: "center" }}>
            <span style={{ ...emboss, fontWeight: 800, fontSize: 36 }}>{h}</span>
          </div>
        ))}
      </div>
      {/* 三行 */}
      <div style={{ position: "absolute", top: 316, left: 170, right: 170, display: "flex", flexDirection: "column", gap: 22 }}>
        {rows.map((r) => (
          <div key={r.s} style={{ display: "flex", gap: 22, opacity: fi(f, r.at, 10) }}>
            <div style={{ ...glass({ a: 0.34, r: 18 }), flex: 1.2, padding: "20px 28px", borderLeft: `8px solid ${r.c}` }}>
              <span style={label(38)}>{r.s}</span>
            </div>
            <div style={{ ...glass({ a: 0.28, r: 18 }), flex: 0.7, padding: "20px 20px", textAlign: "center" }}>
              <span style={label(36, SILVER.inkSoft)}>{r.know}</span>
            </div>
            <div style={{ ...glass({ a: 0.28, r: 18 }), flex: 1.1, padding: "20px 24px" }}>
              <span style={label(34, SILVER.inkSoft)}>{r.how}</span>
            </div>
          </div>
        ))}
      </div>
      {/* t4:Finder 拖進終端機 mini demo */}
      <div style={{ position: "absolute", bottom: 168, left: 320, right: 320, ...glass({ a: 0.34 }), padding: "26px 40px", opacity: fi(f, marks[3].start + 24) }}>
        <Screws inset={12} />
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <DarkChip size={64}>🗂️</DarkChip>
          <div style={{ position: "relative", flex: 1, height: 64 }}>
            <div style={{ position: "absolute", top: 30, left: 0, right: 0, height: 3, background: "repeating-linear-gradient(90deg, rgba(90,100,118,0.5) 0 14px, rgba(90,100,118,0) 14px 26px)" }} />
            <div style={{ position: "absolute", top: 2, left: `${dragP * 88}%`, fontSize: 46 }}>🖼️</div>
          </div>
          <DarkChip size={64}>{">_"}</DarkChip>
          <div style={{ width: 620, fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 27, color: SILVER.ink, background: "rgba(255,255,255,0.5)", borderRadius: 12, padding: "12px 18px", minHeight: 34 }}>
            {pathText}
            <span style={{ color: O }}>▌</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S8 案例 B:下載自動接手(終端機) ────────────────────────── */
export const TerminalScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const T = COLORS.term;
  const cmd1 = typed(f, marks[1].start + 6, "ls -t ~/Downloads | head -3", 1.6);
  const listAt = marks[1].start + 6 + Math.ceil(27 / 1.6) + 8;
  const cmd2 = typed(f, marks[2].start + 4, "cp ~/Downloads/bgm-crystal-v2.mp3 public/", 1.8);
  const okAt = marks[2].start + 4 + Math.ceil(41 / 1.8) + 8;
  const line = (t: string, c: string, at: number, hl = false): React.ReactNode => (
    <div style={{ opacity: fi(f, at, 6), color: c, background: hl ? "rgba(231,144,47,0.16)" : "none", borderRadius: 6, padding: hl ? "2px 10px" : "2px 0", marginLeft: hl ? -10 : 0 }}>{t}</div>
  );
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 114, left: 0, right: 0, opacity: fi(f, 4) }}>
        <GlassHeader>我每天在用的自動接手</GlassHeader>
      </div>
      {/* 流程 chips */}
      <div style={{ position: "absolute", top: 248, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22, alignItems: "center", opacity: fi(f, marks[0].start + 8) }}>
        {[
          { e: "✦", t: "Gemini 生音樂" },
          { e: "⬇️", t: "落在 ~/Downloads" },
          { e: "🤖", t: "Claude Code 自己接手" },
        ].map((x, i) => (
          <React.Fragment key={x.t}>
            {i > 0 && <span style={label(40, SILVER.muted)}>→</span>}
            <div style={{ ...glass({ a: 0.32, r: 999 }), padding: "12px 30px", display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 36 }}>{x.e}</span>
              <span style={label(34, SILVER.inkSoft)}>{x.t}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* 終端機玻璃框 */}
      <div style={{ position: "absolute", top: 358, left: 300, right: 300, ...glass({ a: 0.3 }), padding: 20, opacity: fi(f, marks[0].start + 16) }}>
        <Screws inset={10} />
        <div style={{ background: T.bg, borderRadius: 16, padding: "26px 34px", fontFamily: FONT.monoCjk, fontSize: 31, lineHeight: 1.75, minHeight: 420, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
            ))}
          </div>
          <div style={{ color: T.text }}>
            <span style={{ color: T.prompt }}>$ </span>
            {cmd1}
            {f < marks[2].start && <span style={{ color: T.yellow }}>▌</span>}
          </div>
          {line("bgm-crystal-v2.mp3        ← 最新,就是它", T.yellow, listAt, true)}
          {line("video_seaside.mp4", T.dim, listAt + 5)}
          {line("cover-draft.png", T.dim, listAt + 10)}
          <div style={{ marginTop: 14, color: T.text, opacity: fi(f, marks[2].start + 2, 4) }}>
            <span style={{ color: T.prompt }}>$ </span>
            {cmd2}
            {f >= marks[2].start && f < okAt && <span style={{ color: T.yellow }}>▌</span>}
          </div>
          {line("✓ 已搬進專案 — 全程我沒打過任何路徑", T.green, okAt)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S9 證明 + 陷阱 + 分工 ────────────────────────── */
export const ProofScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const ba = (win: boolean): React.CSSProperties => ({
    ...glass({ a: win ? 0.4 : 0.26 }),
    position: "relative",
    flex: 1,
    padding: "30px 40px",
    borderTop: `10px solid ${win ? O : SILVER.muted}`,
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 114, left: 0, right: 0, opacity: fi(f, 4) }}>
        <GlassHeader>帳很好算 · 而且要分工</GlassHeader>
      </div>
      {/* v1 before/after */}
      <div style={{ position: "absolute", top: 252, left: 170, right: 170, display: "flex", gap: 40 }}>
        <div style={{ ...ba(false), opacity: fi(f, marks[0].start + 4) }}>
          <Screws inset={12} />
          <div style={label(36, SILVER.muted)}>BEFORE · 繞雲端</div>
          <div style={{ ...label(44, SILVER.inkSoft), marginTop: 14, lineHeight: 1.5 }}>
            每檔 <span style={{ color: SILVER.red }}>1+ 次</span> API 呼叫
            <br />
            幾百毫秒 · 只能讀
          </div>
        </div>
        <div style={{ ...ba(true), opacity: fi(f, marks[0].start + Math.round((marks[0].end - marks[0].start) * 0.55)) }}>
          <Screws inset={12} />
          <div style={label(36, O)}>AFTER · 本機路徑</div>
          <div style={{ ...label(44), marginTop: 14, lineHeight: 1.5 }}>
            <span style={{ color: O }}>0 次</span> 呼叫 · 幾毫秒
            <br />
            讀改寫跑指令 全都行
          </div>
        </div>
      </div>
      {/* v2 陷阱 pill */}
      <div style={{ position: "absolute", top: 592, left: 170, right: 170, opacity: fi(f, marks[1].start + 6) }}>
        <div style={{ ...glass({ a: 0.34, r: 20 }), padding: "22px 38px", borderLeft: `10px solid ${SILVER.red}` }}>
          <span style={label(38)}>
            ⚠️ 少人講的陷阱:Drive 這類 <span style={{ color: SILVER.red }}>MCP 外掛每次對話都要先載入</span>,斷線 = 整條流程卡死;本機路徑沒這問題
          </span>
        </div>
      </div>
      {/* v3 分工圖 */}
      <div style={{ position: "absolute", top: 748, left: 170, right: 170, display: "flex", gap: 40, opacity: fi(f, marks[2].start + 6) }}>
        {[
          { a: ">_", b: "本機路徑", c: "🤖 Claude Code", col: O },
          { a: "☁️", b: "Drive 同步夾", c: "✦ Gemini 網頁版", col: SILVER.blue },
        ].map((x) => (
          <div key={x.b} style={{ ...glass({ a: 0.34, r: 20 }), flex: 1, padding: "20px 28px", display: "flex", alignItems: "center", gap: 16, borderLeft: `10px solid ${x.col}`, whiteSpace: "nowrap" }}>
            <DarkChip size={54}>{x.a}</DarkChip>
            <span style={label(35)}>{x.b}</span>
            <span style={{ ...label(38, x.col) }}>→</span>
            <span style={label(35, SILVER.inkSoft)}>{x.c}</span>
            <span style={{ ...label(38, SILVER.green), marginLeft: "auto" }}>✓</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────── S10 Outro ────────────────────────── */
export const OutroScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const ctas = ["🔔 訂閱", "👍 按讚", "↗️ 分享"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fi(f, marks[0].start) }}>
        <div style={{ ...glass({ a: 0.36 }), position: "relative", padding: "44px 70px", textAlign: "center", maxWidth: 1400 }}>
          <Screws />
          <div style={{ ...emboss, fontWeight: 800, fontSize: 58, lineHeight: 1.5 }}>
            檔案放哪裡,決定 AI
            <br />
            <span style={{ color: O, textShadow: "0 2px 6px rgba(120,60,10,0.35)" }}>多快拿到 · 能不能動手</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", opacity: fi(f, marks[1].start + 6) }}>
        <div style={label(48)}>感謝收看 🙏</div>
      </div>
      <div style={{ position: "absolute", top: 730, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
        {ctas.map((t, i) => (
          <div key={t} style={{ ...glass({ a: 0.4, r: 999 }), padding: "16px 44px", opacity: fi(f, marks[1].start + 14 + i * 8), borderBottom: `6px solid ${O}` }}>
            <span style={label(40)}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 880, left: 0, right: 0, textAlign: "center", opacity: fi(f, marks[1].start + 44) }}>
        <span style={label(32, SILVER.muted)}>EP06 · 本地存取優勢 — AI Wisdom @aiwisdomcc · 下集見</span>
      </div>
    </AbsoluteFill>
  );
};
