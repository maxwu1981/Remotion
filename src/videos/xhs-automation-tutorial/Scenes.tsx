import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, darkCard, Glare, emberPill, rgba } from "./glass";

/**
 * 「小紅書發文全自動化」實戰自動化 EP01 — 場景元件庫。
 * 視覺=EP00 玻璃進化版精修:白底 + 黑曜石玻璃卡(白字,高對比) + 收斂光暈。
 * 色義:ember 橙=數字/術語、signal 藍=流程、mint 綠=自動成功、rose 紅=坑、violet 紫=人工。
 * 字重三層:800=鉤子與數字、700=標題句、500=說明句(高級感來自對比,不是全部加粗)。
 * 防抖:白底由 Master 全片墊底,景內只 opacity/translate 淡入。
 */
export type Mark = { start: number; end: number };
export type SceneProps = { dur: number; marks: Mark[] };

const rise = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 深卡上的說明句(500 字重、微降亮度)。 */
const gloss = (size = 28): React.CSSProperties => ({
  fontFamily: FONT.uiCjk,
  fontWeight: 500,
  fontSize: size,
  letterSpacing: 0.5,
  color: rgba("#ffffff", 0.74),
});

/** 內容置中放大、壓低上下留白(scale 由 DOM 即時渲染,字仍銳利)。 */
const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "60px 50px 96px" }}>
    <div style={{ transform: "scale(1.12)", transformOrigin: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
  </AbsoluteFill>
);

/** 景標:ink 大字壓白底 + 細橙槓(hairline 品味,不做粗底槓)。 */
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ textAlign: "center", marginBottom: 36 }}>
    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 56, letterSpacing: 4, color: ACC.ink }}>{children}</div>
    <div style={{ width: 72, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${ACC.ember}, ${ACC.emberSoft})`, margin: "16px auto 0", boxShadow: `0 0 12px ${rgba(ACC.ember, 0.4)}` }} />
  </div>
);

/** 深卡容器(標配 Glare)。 */
const Card: React.FC<{ c: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ c, style, children }) => (
  <div style={{ position: "relative", overflow: "hidden", ...darkCard(c), ...style }}>
    <Glare />
    {children}
  </div>
);

/* ── CH1 一鍵發布 demo(hook):真實終端錄屏重演 ──
 * 節拍全掛 VO marks:c1-1 打指令 → c1-1b Claude 提計畫+我:OK → c1-2 亮「實錄重演」tag
 * → +24s 靜默重演(pad 在 Master 的 c1-2 上):log 逐行跑+進度條+下方六格同步點亮
 * → c1-3 紫框 highlight 回扣「先提議→點頭→才執行」 → c1-4 收尾行 40 秒。
 * 內容全對應真實流程(webdriver=false/讀回核對/先名後時間/停在發布鈕),tag 誠實標「實錄重演」。 */
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const DemoScene: React.FC<SceneProps> = ({ marks: m }) => {
  const f = useCurrentFrame();
  const CMD = "node xhs-post-video.mjs 金澤vlog";
  // 時間錨(掛 VO marks,句長變了也不用改)
  const typeAt = m[0].start + 8;
  const planAt = m[1].start + 8;
  const okAt = Math.round(m[1].start + (m[1].end - m[1].start) * 0.6);
  const tagAt = m[2].start + 6;
  const runAt = m[2].end + 12; // 靜默重演開始
  const hiAt = m[3].start + 6;
  const doneAt = m[4].start + 10;

  const typed = Math.max(0, Math.min(CMD.length, Math.floor((f - typeAt) / 1.6)));
  const typing = f >= typeAt && typed < CMD.length;
  const cursorOn = typing && Math.floor(f / 12) % 2 === 0;

  // 上傳進度條(runAt+88 → +228)
  const prog = interpolate(f, [runAt + 88, runAt + 228], [0, 1], clamp);
  const blocks = Math.round(prog * 10);
  const bar = "▓".repeat(blocks) + "░".repeat(10 - blocks);

  const wDim = rgba("#ffffff", 0.55);
  const wTxt = rgba("#ffffff", 0.86);
  const ok = (label: React.ReactNode) => (
    <>
      <span style={{ color: ACC.mint }}>✓ </span>
      <span style={{ color: wTxt }}>{label}</span>
    </>
  );
  const LOG: { at: number; node: React.ReactNode }[] = [
    { at: planAt, node: <span style={{ color: wDim }}>── Claude Code 接手 · 計畫:上傳影片 → 填 <span style={{ color: ACC.emberSoft }}>6 項</span> → 停在發布鈕</span> },
    { at: okAt, node: <span style={{ color: wDim }}>　 執行嗎? ▸ <span style={{ color: "#fff", fontWeight: 700 }}>我:OK</span> <span style={{ color: ACC.mint }}>✓</span></span> },
    { at: runAt, node: ok(<>接上真 Chrome 分身 · <span style={{ color: ACC.mint }}>webdriver = false</span></>) },
    { at: runAt + 42, node: ok(<>開啟 創作者中心 · 發布頁</>) },
    { at: runAt + 88, node: <span style={{ color: ACC.signal }}>↑ <span style={{ color: wTxt }}>上傳 vlog-final.mp4　</span><span style={{ color: ACC.gold }}>{bar} {Math.round(prog * 100)}%</span></span> },
    { at: runAt + 238, node: ok(<>轉碼完成 · 影片就緒</>) },
    { at: runAt + 325, node: ok(<>標題 填入 → 讀回核對 · 一致</>) },
    { at: runAt + 395, node: ok(<>正文 · 問答體 · ≤1000 字</>) },
    { at: runAt + 460, node: ok(<>標籤 8 個 · 下拉精準命中真話題</>) },
    { at: runAt + 525, node: ok(<>可見範圍 = <span style={{ color: ACC.emberSoft }}>仅自己可见</span></>) },
    { at: runAt + 595, node: ok(<>章節 5 筆 · 先名後時間 → 讀回一致 · 保存</>) },
    { at: runAt + 668, node: <span style={{ color: ACC.violet, fontWeight: 700 }}>⏸ 停在「發布」按鈕 — 這一下留給人</span> },
    { at: doneAt, node: <span style={{ color: ACC.gold, fontWeight: 700, letterSpacing: 2 }}>── 約 40 秒 · 全程沒碰滑鼠 ──</span> },
  ];

  const fields = ["影片", "標題", "正文", "8 標籤", "仅自己可见", "5 章節"];
  const fieldAt = [runAt + 244, runAt + 331, runAt + 401, runAt + 466, runAt + 531, runAt + 601];

  return (
    <Wrap>
      {/* 終端機視窗 */}
      <Card c={ACC.ember} style={{ width: 1560, padding: 0, borderRadius: 24 }}>
        {/* 標題列 */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", height: 54, padding: "0 26px", background: rgba("#ffffff", 0.04), borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 15, height: 15, borderRadius: 999, background: c, marginRight: 11, boxShadow: `inset 0 1px 1px ${rgba("#ffffff", 0.3)}` }} />
          ))}
          <span style={{ fontFamily: FONT.monoCjk, fontSize: 22, letterSpacing: 1, color: rgba("#ffffff", 0.45), marginLeft: 14 }}>zsh — xhs 自動發文</span>
          <span style={{ ...emberPill, marginLeft: "auto", padding: "5px 18px", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 21, letterSpacing: 2, opacity: rise(f, tagAt, 10) }}>實錄重演</span>
        </div>
        {/* log 區 */}
        <div style={{ position: "relative", padding: "22px 36px", fontFamily: FONT.monoCjk, fontSize: 26, lineHeight: "40px" }}>
          {/* c1-3 回扣:計畫兩行的紫框 highlight */}
          <div style={{ position: "absolute", left: 24, right: 24, top: 22 + 40 - 6, height: 2 * 40 + 12, borderRadius: 10, border: `1.5px solid ${rgba(ACC.violet, 0.75)}`, background: rgba(ACC.violet, 0.08), opacity: rise(f, hiAt, 12), pointerEvents: "none" }}>
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 23, letterSpacing: 1, color: ACC.violet, background: rgba("#0D1322", 0.9), padding: "4px 14px", borderRadius: 8, border: `1px solid ${rgba(ACC.violet, 0.5)}` }}>先提議 → 點頭 → 才執行</span>
          </div>
          <div>
            <span style={{ color: ACC.gold }}>$ </span>
            <span style={{ color: wTxt }}>{CMD.slice(0, typed)}</span>
            {cursorOn && <span style={{ color: ACC.emberSoft }}>▍</span>}
          </div>
          {LOG.map((l, i) => (
            <div key={i} style={{ opacity: rise(f, l.at, 9), whiteSpace: "nowrap" }}>{l.node}</div>
          ))}
        </div>
      </Card>
      {/* 六格同步儀表 */}
      <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
        {fields.map((label, i) => {
          const on = rise(f, fieldAt[i], 10);
          const c = on > 0.5 ? ACC.mint : "#3A4356";
          return (
            <div key={label} style={{ position: "relative", overflow: "hidden", ...darkCard(c, { r: 14, glow: on > 0.5 ? 0.5 : 0.15 }), padding: "13px 22px", display: "flex", alignItems: "center", gap: 11, opacity: 0.55 + on * 0.45 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 25, fontWeight: 700, color: on > 0.5 ? ACC.mint : rgba("#ffffff", 0.3) }}>{on > 0.5 ? "✓" : "○"}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, color: "#fff", whiteSpace: "nowrap" }}>{label}</span>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
};

/* ── CH2 七站產線地圖 ── */
export const MapScene: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const stations = [
    ["1", "環境建置", ACC.signal],
    ["2", "防封框架", ACC.ember],
    ["3", "GEO 文案", ACC.signal],
    ["4", "素材產製", ACC.signal],
    ["5", "一鍵上傳", ACC.ember],
    ["6", "人工把關", ACC.violet],
    ["7", "發布營運", ACC.mint],
  ] as const;
  return (
    <Wrap>
      <Title>從零到發布 · 七站產線</Title>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", maxWidth: 1560 }}>
        {stations.map(([n, label, c], i) => {
          const on = rise(f, 20 + i * 16, 12);
          return (
            <div key={n} style={{ opacity: on, transform: `translateY(${(1 - on) * 16}px)` }}>
              <Card c={c} style={{ width: 200, padding: "24px 14px", textAlign: "center" }}>
                <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 44, color: c === ACC.ember ? ACC.gold : "#fff", textShadow: `0 0 16px ${rgba(c, 0.7)}` }}>{n}</div>
                <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 31, color: "#fff", marginTop: 6 }}>{label}</div>
              </Card>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 34, fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 32, letterSpacing: 1, color: ACC.inkSoft, opacity: rise(f, 140, 12) }}>
        重頭戲在 <span style={{ color: ACC.ember, fontWeight: 700 }}>第 5 站 · 一鍵上傳</span>
      </div>
    </Wrap>
  );
};

/* ── CH3 webdriver 對比:機器人 true vs 真人分身 false ── */
export const CompareScene: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const col = (title: string, sub: string, val: string, c: string, on: number, verdict: string) => (
    <div style={{ opacity: on, transform: `translateY(${(1 - on) * 20}px)` }}>
      <Card c={c} style={{ width: 620, padding: "42px 40px", textAlign: "center" }}>
        <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 42, letterSpacing: 1, color: "#fff" }}>{title}</div>
        <div style={{ ...gloss(28), position: "relative", margin: "10px 0 26px" }}>{sub}</div>
        <div style={{ position: "relative", fontFamily: FONT.mono, fontSize: 28, letterSpacing: 1, color: rgba("#ffffff", 0.55) }}>navigator.webdriver</div>
        <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 88, color: c, textShadow: `0 0 22px ${rgba(c, 0.6)}` }}>{val}</div>
        <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 32, color: "#fff", marginTop: 8 }}>{verdict}</div>
      </Card>
    </div>
  );
  return (
    <Wrap>
      <Title>讓瀏覽器像真人</Title>
      <div style={{ display: "flex", gap: 44 }}>
        {col("框架直接開", "自動化指紋全套帶著", "true", ACC.rose, rise(f, 20, 14), "風控一查就中")}
        {col("真 Chrome 分身", "除錯通道從外面接上", "false", ACC.mint, rise(f, 60, 14), "看起來就是真人")}
      </div>
    </Wrap>
  );
};

/* ── CH4 防封三鐵則(封號 7 天引子) ── */
export const RulesScene: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const rules = [
    ["先發僅自己可見", "自檢沒問題才轉公開"],
    ["一天最多 1–3 篇", "絕不衝量"],
    ["發布鈕留給人按", "省苦工,不省判斷"],
  ];
  return (
    <Wrap>
      <div style={{ opacity: rise(f, 10, 12), marginBottom: 28 }}>
        <Card c={ACC.rose} style={{ padding: "16px 44px" }}>
          <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 36, letterSpacing: 1, color: "#fff" }}>
            代價 <span style={{ color: ACC.gold, fontFamily: FONT.mono, fontWeight: 800, fontSize: 44 }}>7</span> 天封號,換來三條鐵則
          </span>
        </Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 960 }}>
        {rules.map(([h, s], i) => {
          const on = rise(f, 44 + i * 30, 14);
          return (
            <div key={h} style={{ opacity: on, transform: `translateX(${(1 - on) * -24}px)` }}>
              <Card c={ACC.ember} style={{ padding: "26px 40px", display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 56, color: ACC.gold, width: 56, textShadow: `0 0 16px ${rgba(ACC.gold, 0.5)}` }}>{i + 1}</div>
                <div style={{ position: "relative" }}>
                  <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, letterSpacing: 1, color: "#fff" }}>{h}</div>
                  <div style={{ ...gloss(28), marginTop: 6 }}>{s}</div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 30, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 36, letterSpacing: 1, opacity: rise(f, 140, 12) }}>
        <span style={{ color: ACC.rose }}>封號 7 天</span>
        <span style={{ color: ACC.muted, fontWeight: 500 }}> → </span>
        <span style={{ color: "#0B8A4B" }}>30+ 篇零事故</span>
      </div>
    </Wrap>
  );
};

/* ── 通用:數字反差卡(CH5 600→800) ── */
export const StatFlipScene: React.FC<SceneProps & { title?: string; from?: [string, string]; to?: [string, string]; note?: string }> = ({
  title = "數字它自己查",
  from = ["600", "日圓 · 舊文照抄"],
  to = ["800", "日圓 · Claude 上網查到"],
  note = "Claude 自動上網查證每個數字,錯一個信任就沒了",
}) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <Title>{title}</Title>
      <div style={{ opacity: rise(f, 8, 12), marginBottom: 26 }}>
        <div style={{ ...emberPill, padding: "10px 30px", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 30, letterSpacing: 2 }}>🔍 Claude 自動上網查證</div>
      </div>
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        <div style={{ opacity: rise(f, 20, 14) }}>
          <Card c={ACC.rose} style={{ width: 470, padding: 42, textAlign: "center" }}>
            <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 112, color: rgba("#ffffff", 0.5), textDecoration: "line-through", textDecorationColor: rgba(ACC.rose, 0.7) }}>{from[0]}</div>
            <div style={{ ...gloss(29), position: "relative", marginTop: 8 }}>{from[1]}</div>
          </Card>
        </div>
        <div style={{ fontSize: 62, color: ACC.ember, opacity: rise(f, 50, 10), textShadow: `0 0 16px ${rgba(ACC.ember, 0.4)}` }}>→</div>
        <div style={{ opacity: rise(f, 60, 14) }}>
          <Card c={ACC.mint} style={{ width: 470, padding: 42, textAlign: "center" }}>
            <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 112, color: ACC.gold, textShadow: `0 0 24px ${rgba(ACC.gold, 0.45)}` }}>{to[0]}</div>
            <div style={{ ...gloss(29), position: "relative", marginTop: 8, color: "#fff" }}>{to[1]}</div>
          </Card>
        </div>
      </div>
      <div style={{ marginTop: 32, fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 32, letterSpacing: 1, color: ACC.inkSoft, opacity: rise(f, 90, 12) }}>{note}</div>
    </Wrap>
  );
};

/* ── 通用:清單卡(CH6 發布包, CH12 營運) ── */
export const ListScene: React.FC<SceneProps & { title: string; items: [string, string][]; foot?: React.ReactNode; startAt?: number }> = ({
  title,
  items,
  foot,
  startAt = 20,
}) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <Title>{title}</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 1340 }}>
        {items.map(([h, s], i) => {
          const on = rise(f, startAt + i * 24, 13);
          return (
            <div key={h} style={{ opacity: on, transform: `translateY(${(1 - on) * 14}px)` }}>
              <Card c={ACC.signal} style={{ padding: "22px 36px", display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 40, color: ACC.gold, width: 46, textShadow: `0 0 14px ${rgba(ACC.gold, 0.45)}` }}>{i + 1}</div>
                <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 36, letterSpacing: 1, color: "#fff" }}>{h}</div>
                <div style={{ ...gloss(27), position: "relative", marginLeft: "auto", textAlign: "right", maxWidth: 620 }}>{s}</div>
              </Card>
            </div>
          );
        })}
      </div>
      {foot && <div style={{ marginTop: 28, fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 32, letterSpacing: 1, color: ACC.inkSoft }}>{foot}</div>}
    </Wrap>
  );
};

/* ── CH7 實拍 vlog 六步 + 平滑度數據 ── */
export const EditScene: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const steps = ["抽縮圖濾家人", "按走法分段", "放慢 2.5x", "配 BGM", "封面烘進 frame 0", "存章节.tsv"];
  return (
    <Wrap>
      <Title>實拍片也能自動剪</Title>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", width: 1520, marginBottom: 30 }}>
        {steps.map((s, i) => {
          const on = rise(f, 20 + i * 18, 12);
          return (
            <div key={s} style={{ opacity: on }}>
              <Card c={ACC.signal} style={{ padding: "16px 26px", display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 30, color: ACC.gold }}>{i + 1}</span>
                <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 29, color: "#fff" }}>{s}</span>
              </Card>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: rise(f, 130, 14) }}>
        <Card c={ACC.mint} style={{ padding: "28px 52px", display: "flex", gap: 44, alignItems: "center" }}>
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{ ...gloss(27) }}>晃動感(逐幀移動)</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 58 }}>
              <span style={{ color: rgba("#ffffff", 0.45), textDecoration: "line-through", textDecorationColor: rgba(ACC.mint, 0.6) }}>14.3</span>
              <span style={{ color: ACC.gold, textShadow: `0 0 18px ${rgba(ACC.gold, 0.45)}` }}> → 5.9</span>
            </div>
          </div>
          <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: "#fff" }}>降 59%</div>
        </Card>
      </div>
    </Wrap>
  );
};

/* ── CH8 讀回驗證(填入→讀回→核對→存/取消) ── */
export const VerifyScene: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const flow = [
    ["填入", ACC.signal],
    ["讀回", ACC.signal],
    ["核對", ACC.ember],
  ] as const;
  return (
    <Wrap>
      <Title>寧可不存 · 也不存錯</Title>
      <div style={{ display: "flex", gap: 18, alignItems: "center", justifyContent: "center" }}>
        {flow.map(([label, c], i) => {
          const on = rise(f, 24 + i * 24, 12);
          return (
            <React.Fragment key={label}>
              {i > 0 && <span style={{ fontSize: 46, color: ACC.muted, opacity: on }}>→</span>}
              <div style={{ opacity: on }}>
                <Card c={c} style={{ padding: "24px 40px" }}>
                  <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: "#fff" }}>{label}</span>
                </Card>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 30, marginTop: 34 }}>
        <div style={{ opacity: rise(f, 96, 14) }}>
          <Card c={ACC.mint} style={{ padding: "20px 38px" }}>
            <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 34, letterSpacing: 1, color: "#fff" }}>一致 → 儲存</span>
          </Card>
        </div>
        <div style={{ opacity: rise(f, 120, 14) }}>
          <Card c={ACC.rose} style={{ padding: "20px 38px" }}>
            <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 34, letterSpacing: 1, color: "#fff" }}>不符 → 自動取消</span>
          </Card>
        </div>
      </div>
      <div style={{ marginTop: 32, fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 30, letterSpacing: 1, color: ACC.inkSoft, opacity: rise(f, 150, 12) }}>
        每一欄填完,都把頁面的值重新讀回來核對
      </div>
    </Wrap>
  );
};

/* ── 通用:坑警示卡(CH9, CH10) ── */
export const PitfallScene: React.FC<SceneProps & { tag: string; title: string; symptom: string; fix: string }> = ({ tag, title, symptom, fix }) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <div style={{ opacity: rise(f, 12, 14) }}>
        <Card c={ACC.rose} style={{ width: 1260, padding: 50, borderRadius: 30 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 22, marginBottom: 26 }}>
            <span style={{ ...emberPill, background: `linear-gradient(135deg, ${ACC.rose} 0%, #F87C93 100%)`, boxShadow: `0 0 16px ${rgba(ACC.rose, 0.32)}, inset 0 1px 0 ${rgba("#ffffff", 0.4)}`, padding: "10px 28px", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 30, letterSpacing: 2 }}>{tag}</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, letterSpacing: 1, color: "#fff" }}>{title}</span>
          </div>
          <div style={{ position: "relative", background: rgba("#ffffff", 0.06), border: `1px solid ${rgba(ACC.rose, 0.45)}`, borderRadius: 16, padding: "22px 32px", marginBottom: 18, opacity: rise(f, 44, 14), boxShadow: `inset 0 1px 0 ${rgba("#ffffff", 0.08)}` }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 31, color: ACC.rose }}>症狀　</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 31, color: rgba("#ffffff", 0.92) }}>{symptom}</span>
          </div>
          <div style={{ position: "relative", background: rgba("#ffffff", 0.06), border: `1px solid ${rgba(ACC.mint, 0.45)}`, borderRadius: 16, padding: "22px 32px", opacity: rise(f, 84, 14), boxShadow: `inset 0 1px 0 ${rgba("#ffffff", 0.08)}` }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 31, color: ACC.mint }}>解法　</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 31, color: rgba("#ffffff", 0.92) }}>{fix}</span>
          </div>
        </Card>
      </div>
    </Wrap>
  );
};

/* ── CH11 人工三步:自動 95% / 人工 3 下 ── */
export const HandScene: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const items = ["原创声明開關 · 只吃真實手勢", "添加地點 · 自動選會選錯", "發布鈕 · 鐵則,留給人"];
  return (
    <Wrap>
      <Title>誠實說 · 這三下留給人</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 1200, marginBottom: 30 }}>
        {items.map((s, i) => {
          const on = rise(f, 24 + i * 26, 13);
          return (
            <div key={s} style={{ opacity: on, transform: `translateX(${(1 - on) * -20}px)` }}>
              <Card c={ACC.violet} style={{ padding: "24px 36px", display: "flex", gap: 22, alignItems: "center" }}>
                <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 42, color: ACC.gold, width: 48, textShadow: `0 0 14px ${rgba(ACC.gold, 0.45)}` }}>{i + 1}</span>
                <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 36, letterSpacing: 1, color: "#fff" }}>{s}</span>
              </Card>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: rise(f, 110, 14) }}>
        <Card c={ACC.mint} style={{ padding: "22px 48px" }}>
          <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 40, color: "#fff" }}>
            自動 <span style={{ color: ACC.gold, fontFamily: FONT.mono, fontWeight: 800, fontSize: 48 }}>95%</span>
            <span style={{ ...gloss(32), display: "inline" }}>　·　剩最後 3 下滑鼠人工把關</span>
          </span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ── CH13 Outro:40→3 + 訂閱 ── */
export const OutroScene: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <div style={{ opacity: rise(f, 16, 16), marginBottom: 40 }}>
        <Card c={ACC.ember} style={{ padding: "38px 70px", display: "flex", gap: 38, alignItems: "center", borderRadius: 34 }}>
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 118, color: rgba("#ffffff", 0.42), textDecoration: "line-through", textDecorationColor: rgba(ACC.emberSoft, 0.65) }}>40</div>
            <div style={{ ...gloss(28) }}>分鐘 · 手動</div>
          </div>
          <div style={{ position: "relative", fontSize: 72, color: ACC.gold, textShadow: `0 0 20px ${rgba(ACC.gold, 0.45)}` }}>→</div>
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 148, color: ACC.gold, textShadow: `0 0 32px ${rgba(ACC.gold, 0.45)}` }}>3</div>
            <div style={{ ...gloss(28), color: "#fff" }}>分鐘 · 一行指令</div>
          </div>
        </Card>
      </div>
      <div style={{ opacity: rise(f, 80, 16), textAlign: "center" }}>
        <span style={{ ...emberPill, padding: "20px 52px", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, letterSpacing: 2 }}>訂閱 · 按讚 · 分享</span>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 29, letterSpacing: 1, color: ACC.inkSoft, marginTop: 22 }}>下一支:把這套產線搬到別的平台</div>
      </div>
    </Wrap>
  );
};
