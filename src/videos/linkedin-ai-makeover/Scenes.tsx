import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { ACC, Glare, darkCard, emberPill, rgba } from "./glass";

/**
 * 「丟一份舊履歷給 AI」各景 — 2026-07-03 高級感精修版(白底+黑曜石玻璃卡),
 * 文案與節拍(marks)與 v2 完全相同;個資一律不繪出。
 * 版面鐵則(v4):每景 Wrap 置中 flex+scale(1.12)+緊 padding,內容放大填滿、不留上下死空隙
 * (老闆 2026-07-03 對 v3 退稿:「上下留白太多,放大中間」→ 全景改置中放大,見記憶 video-fill-frame-rule)。
 * 色義:ember 橙=主敘事/After、signal 藍=流程、mint 綠=成果、rose 紅=慘況/盲點、violet 紫=人工。
 * 字重三層:800=鉤子數字、700=標題句、500=說明句。
 * 防抖紀律:只用 opacity 淡入,元件進場後凍結,無彈跳/spring。
 */
export type Mark = { start: number; end: number };
export type SceneProps = { dur: number; marks: Mark[] };

const SLATE = "#3A4356"; // 中性深卡(無語義色時)
const blueSoft = "#6FB1FF"; // 深卡上的亮藍(LinkedIn 主題點綴)

const fi = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 深卡上的標題句(700)。 */
const t7 = (size = 36): React.CSSProperties => ({
  fontFamily: FONT.uiCjk,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: 1,
  color: "#fff",
});
/** 深卡上的說明句(500、微降亮度)。 */
const gloss = (size = 28): React.CSSProperties => ({
  fontFamily: FONT.uiCjk,
  fontWeight: 500,
  fontSize: size,
  letterSpacing: 0.5,
  color: rgba("#ffffff", 0.74),
});
/** 白底上的說明句(只給短註腳)。 */
const inkNote = (size = 34): React.CSSProperties => ({
  fontFamily: FONT.uiCjk,
  fontWeight: 500,
  fontSize: size,
  letterSpacing: 1,
  color: ACC.inkSoft,
});

/** 內容置中放大、壓低上下留白(頂部讓概念錨、底部讓字幕,其餘全給內容)。 */
const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "64px 50px 104px" }}>
    <div style={{ transform: "scale(1.18)", transformOrigin: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
  </AbsoluteFill>
);

/** 景標:ink 大字壓白底 + 細橙槓。 */
const Head: React.FC<{ children: React.ReactNode; mb?: number }> = ({ children, mb = 40 }) => (
  <div style={{ textAlign: "center", marginBottom: mb }}>
    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 54, letterSpacing: 4, color: ACC.ink }}>{children}</div>
    <div style={{ width: 72, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${ACC.ember}, ${ACC.emberSoft})`, margin: "16px auto 0", boxShadow: `0 0 12px ${rgba(ACC.ember, 0.4)}` }} />
  </div>
);

/** 黑曜石卡容器(標配 Glare)。 */
const Card: React.FC<{ c: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ c, style, children }) => (
  <div style={{ position: "relative", overflow: "hidden", ...darkCard(c), ...style }}>
    <Glare />
    {children}
  </div>
);

/* ────────────────────────── S1 鉤子:丟履歷去倒咖啡 ────────────────────────── */
export const HookScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const steps = [
    { e: "📄➡️🤖", t: "丟一份舊履歷給 Claude", c: ACC.ember, at: marks[0].start + 4 },
    { e: "☕", t: "去倒了一杯咖啡", c: ACC.violet, at: marks[0].start + 40 },
    { e: "🌐✨", t: "回來,檔案已經全自動翻新", c: ACC.mint, at: marks[1].start + 8 },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, 4) }}>
        <Head>三個我沒想到的盲點</Head>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.t}>
            {i > 0 && <span style={{ fontSize: 52, color: ACC.muted, alignSelf: "center" }}>→</span>}
            <div style={{ opacity: fi(f, s.at) }}>
              <Card c={s.c} style={{ width: 440, padding: "44px 32px", textAlign: "center" }}>
                <div style={{ position: "relative", fontSize: 92 }}>{s.e}</div>
                <div style={{ ...t7(35), position: "relative", marginTop: 22, lineHeight: 1.4 }}>{s.t}</div>
              </Card>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 48, opacity: fi(f, marks[2].start + 10) }}>
        <Card c={ACC.ember} style={{ padding: "20px 54px", borderRadius: 999 }}>
          <span style={{ ...t7(40), position: "relative" }}>它做的每一件事,<span style={{ color: ACC.emberSoft }}>我都拆給你看</span></span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch1 荒廢三年的檔案有多慘 ────────────────────────── */
export const DecayScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const stats = [
    { big: "41", unit: "人", k: "過去 7 天訪客", at: marks[1].start + 6 },
    { big: "0", unit: "次", k: "貼文曝光", at: marks[1].start + 16 },
    { big: "2", unit: "項", k: "技能欄", at: marks[2].start + 4 },
    { big: "1", unit: "段", k: "工作經歷", at: marks[3].start + 4 },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head>荒廢三年的檔案有多慘</Head>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 28, width: 1580 }}>
        {stats.map((s) => (
          <div key={s.k} style={{ opacity: fi(f, s.at) }}>
            <Card c={ACC.rose} style={{ padding: "46px 20px", textAlign: "center" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
                <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 112, color: ACC.rose, textShadow: `0 0 22px ${rgba(ACC.rose, 0.45)}` }}>{s.big}</span>
                <span style={{ ...gloss(32) }}>{s.unit}</span>
              </div>
              <div style={{ ...gloss(31), position: "relative", marginTop: 14 }}>{s.k}</div>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 46, opacity: fi(f, marks[4].start + 6) }}>
        <Card c={ACC.rose} style={{ padding: "20px 50px", borderRadius: 999 }}>
          <span style={{ ...t7(38), position: "relative" }}>
            十六年資歷只剩現職一段 — 對獵頭來說,<span style={{ color: ACC.rose }}>等於不存在</span>
          </span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch2 為什麼一直沒改 ────────────────────────── */
export const BlockedScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head>為什麼一直沒改</Head>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: 56 }}>
        <div style={{ opacity: fi(f, marks[1].start + 6) }}>
          <Card c={ACC.rose} style={{ width: 660, padding: "48px 48px" }}>
            <div style={{ position: "relative", fontSize: 96, textAlign: "center" }}>😵‍💫</div>
            <div style={{ ...t7(42), position: "relative", textAlign: "center", marginTop: 20, lineHeight: 1.5 }}>
              幾十個欄位不知道<span style={{ color: ACC.rose }}>從哪下手</span>
            </div>
            <div style={{ ...gloss(31), position: "relative", textAlign: "center", marginTop: 16 }}>寫出來的字像自嗨,也不知道獵頭到底搜什麼</div>
          </Card>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 62, color: ACC.muted, opacity: fi(f, marks[2].start) }}>→</span>
        </div>
        <div style={{ opacity: fi(f, marks[2].start + 6), display: "flex" }}>
          <Card c={ACC.ember} style={{ width: 500, padding: "48px 48px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ position: "relative", fontSize: 96 }}>🤖</div>
            <div style={{ ...t7(44), position: "relative", marginTop: 20 }}>
              換個做法 — <span style={{ color: ACC.emberSoft }}>外包給 AI</span>
            </div>
          </Card>
        </div>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch3 我只做了一件事 ────────────────────────── */
export const OneAskScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const steps = [
    { e: "☁️", t: "讀雲端硬碟裡的舊履歷", c: ACC.signal },
    { e: "🌐", t: "自己開瀏覽器操作", c: ACC.signal },
    { e: "🛑", t: "每一步送出前先停下來讓我確認", c: ACC.violet },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head>我只做了一件事</Head>
      </div>
      <div style={{ opacity: fi(f, marks[0].start + 10) }}>
        <Card c={ACC.signal} style={{ maxWidth: 1420, padding: "34px 50px", borderRadius: 24 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ fontSize: 64 }}>💬</div>
            <span style={t7(38)}>
              「幫我更新檔案,讓 HR 更容易注意到我」<span style={{ color: blueSoft }}>+ 舊履歷位置</span>
            </span>
          </div>
        </Card>
      </div>
      <div style={{ margin: "34px 0 26px", textAlign: "center", opacity: fi(f, marks[1].start + 4) }}>
        <span style={inkNote(36)}>剩下的它自己來 →</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 34 }}>
        {steps.map((s, i) => (
          <div key={s.t} style={{ opacity: fi(f, marks[1].start + 20 + i * 12) }}>
            <Card c={s.c} style={{ width: 450, padding: "38px 30px", textAlign: "center" }}>
              <div style={{ position: "relative", fontSize: 72 }}>{s.e}</div>
              <div style={{ ...t7(32), position: "relative", marginTop: 18, lineHeight: 1.4 }}>{s.t}</div>
            </Card>
          </div>
        ))}
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch4 優化一:先把定位吵清楚 ────────────────────────── */
export const PositionForkScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={26}>優化一 · 先把定位吵清楚</Head>
      </div>
      <div style={{ marginBottom: 36, textAlign: "center", opacity: fi(f, marks[0].start + 8) }}>
        <span style={inkNote(36)}>它先問我一個我沒想過的問題:走哪條路?</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 54 }}>
        <div style={{ opacity: fi(f, marks[1].start + 4) * 0.72 }}>
          <Card c={SLATE} style={{ width: 600, padding: "46px 44px", textAlign: "center" }}>
            <div style={{ position: "relative", fontSize: 80 }}>🧑‍💻</div>
            <div style={{ ...gloss(40), position: "relative", marginTop: 16 }}>轉型 AI 工程師路線</div>
          </Card>
        </div>
        <div style={{ opacity: fi(f, marks[2].start + 4), position: "relative" }}>
          <Card c={ACC.ember} style={{ width: 600, padding: "46px 44px", textAlign: "center" }}>
            <div style={{ position: "relative", fontSize: 80 }}>🏭</div>
            <div style={{ ...t7(42), position: "relative", marginTop: 16 }}>
              十六年資歷為主 <span style={{ color: ACC.emberSoft }}>+ AI 加分</span>
            </div>
          </Card>
          <div style={{ position: "absolute", top: -24, right: 24, ...emberPill, padding: "8px 26px", fontWeight: 700, fontSize: 28 }}>✓ 拍板</div>
        </div>
      </div>
      <div style={{ marginTop: 42, textAlign: "center", opacity: fi(f, marks[2].start + 20) }}>
        <span style={inkNote()}>後面所有措辭,都圍繞這個定位</span>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch5 GitHub 門面從零到有 + 雙向連結 ────────────────────────── */
export const LinkupScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const linkOn = fi(f, marks[1].start + 4, 16);
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head>優化二 · 個人主頁從零到有</Head>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: fi(f, marks[0].start + 8) }}>
          <Card c={ACC.signal} style={{ width: 620, padding: "50px 44px", textAlign: "center" }}>
            <div style={{ position: "relative", fontSize: 84 }}>🗂️</div>
            <div style={{ ...t7(42), position: "relative", marginTop: 16 }}>個人主頁</div>
            <div style={{ ...gloss(31), position: "relative", marginTop: 12, lineHeight: 1.55 }}>
              0 → <span style={{ color: ACC.emberSoft, fontWeight: 700 }}>從零建好上線</span>
              <br />
              作品 · 技術棧 · 聯絡方式排好版
            </div>
          </Card>
        </div>
        <div style={{ width: 170, textAlign: "center", opacity: linkOn }}>
          <span style={{ fontSize: 60, color: ACC.ember, textShadow: `0 0 14px ${rgba(ACC.ember, 0.35)}` }}>⇄</span>
        </div>
        <div style={{ opacity: fi(f, marks[1].start) }}>
          <Card c={ACC.signal} style={{ width: 620, padding: "50px 44px", textAlign: "center" }}>
            <div style={{ position: "relative", fontSize: 84 }}>💼</div>
            <div style={{ ...t7(42), position: "relative", marginTop: 16 }}>職涯檔案</div>
            <div style={{ ...gloss(31), position: "relative", marginTop: 12, lineHeight: 1.55 }}>互相連結,兩邊點進來都能繞到另一邊</div>
          </Card>
        </div>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch6 Banner 用程式畫,不用 AI 生圖 ────────────────────────── */
export const BannerRevealScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const shiftOn = fi(f, marks[1].start + 6, 14);
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={34}>優化三 · Banner 用程式碼精準畫</Head>
      </div>
      <div style={{ position: "relative", opacity: fi(f, marks[0].start + 10) }}>
        <Card c={ACC.ember} style={{ width: 1500, padding: 24, borderRadius: 28 }}>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${rgba("#ffffff", 0.2)}` }}>
            <Img src={staticFile("linkedin-makeover/banner-redacted.png")} style={{ width: "100%", display: "block" }} />
          </div>
        </Card>
        <div style={{ position: "absolute", top: -20, left: 30, ...darkCard(SLATE, { r: 999, glow: 0.4 }), padding: "8px 24px" }}>
          <span style={{ ...gloss(25), color: rgba("#ffffff", 0.85) }}>個資已馬賽克 · 姓名/公司/國家一律不繪出</span>
        </div>
      </div>
      <div style={{ marginTop: 40, opacity: shiftOn }}>
        <Card c={ACC.ember} style={{ padding: "18px 46px", borderRadius: 999 }}>
          <span style={{ ...t7(35), position: "relative" }}>
            v1 字被大頭照擋住 → 量出遮擋範圍,<span style={{ color: ACC.emberSoft }}>整版右移重出一張</span>
          </span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch7 盲點一:措辭會誤導 ────────────────────────── */
export const WordingTrapScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={32}>盲點一 · 措辭會誤導人</Head>
      </div>
      <div style={{ width: 1520, opacity: fi(f, marks[1].start + 6) }}>
        <Card c={ACC.rose} style={{ padding: "30px 46px" }}>
          <div style={{ position: "relative", fontWeight: 800, fontSize: 30, letterSpacing: 2, color: ACC.rose }}>BEFORE · 我自己看覺得很順</div>
          <div style={{ ...gloss(42), position: "relative", marginTop: 12, color: rgba("#ffffff", 0.85) }}>「某兩家國際大廠 + 十六年經驗」</div>
        </Card>
      </div>
      <div style={{ margin: "26px 0", textAlign: "center", opacity: fi(f, marks[2].start + 4) }}>
        <div style={{ display: "inline-block", position: "relative", overflow: "hidden", ...darkCard(SLATE, { r: 20, glow: 0.5 }), padding: "20px 42px" }}>
          <span style={t7(35)}>
            會讓人以為我<span style={{ color: ACC.rose }}>在那兩家公司上過班</span> — 實際是代工端替他們交付專案
          </span>
        </div>
      </div>
      <div style={{ width: 1520, opacity: fi(f, marks[3].start + 4) }}>
        <Card c={ACC.mint} style={{ padding: "30px 46px" }}>
          <div style={{ position: "relative", fontWeight: 800, fontSize: 30, letterSpacing: 2, color: ACC.mint }}>AFTER · 它主動改的</div>
          <div style={{ ...t7(42), position: "relative", marginTop: 12 }}>
            「<span style={{ color: ACC.gold }}>為</span>某兩家國際大廠<span style={{ color: ACC.gold }}>交付</span>了三億兩千萬美元的專案」
          </div>
        </Card>
      </div>
      <div style={{ marginTop: 34, textAlign: "center", opacity: fi(f, marks[3].start + 26) }}>
        <span style={inkNote()}>一字之差,誠信差很多</span>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch8 Headline 改寫 ────────────────────────── */
export const HeadlineScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const chips = ["16 年資歷", "新產品導入", "量化金額", "跨國產線移轉", "AI 提效加分"];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={34}>優化四 · 頭銜改寫</Head>
      </div>
      <div style={{ opacity: fi(f, marks[0].start + 6) * 0.78 }}>
        <div style={{ position: "relative", overflow: "hidden", ...darkCard(SLATE, { r: 20, glow: 0.4 }), padding: "24px 44px" }}>
          <span style={gloss(36)}>BEFORE · 系統預設「職稱 + 現職公司名」</span>
        </div>
      </div>
      <div style={{ margin: "34px 0", textAlign: "center", opacity: fi(f, marks[1].start) }}>
        <span style={inkNote(42)}>↓ 換成<span style={{ color: ACC.ember, fontWeight: 700 }}>獵頭會搜的關鍵字</span></span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24, maxWidth: 1500 }}>
        {chips.map((c, i) => (
          <div key={c} style={{ opacity: fi(f, marks[1].start + 14 + i * 10) }}>
            <Card c={ACC.ember} style={{ padding: "20px 42px", borderRadius: 999 }}>
              <span style={{ ...t7(38), position: "relative" }}>{c}</span>
            </Card>
          </div>
        ))}
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch9 把十六年經歷找回來 + 盲點二 ────────────────────────── */
export const ExperienceScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const cards = [
    { t: "現職公司", g: "EPM Director", c: ACC.signal },
    { t: "前公司 A", g: "良率 +10% · 缺料 −30%", c: ACC.ember },
    { t: "前公司 B", g: "成本 −15%", c: ACC.mint },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={30}>優化五 · 把十六年經歷找回來</Head>
      </div>
      <div style={{ display: "flex", gap: 30, width: 1560, opacity: fi(f, marks[1].start + 6) }}>
        {cards.map((c) => (
          <Card key={c.t} c={c.c} style={{ flex: 1, padding: "30px 28px" }}>
            <div style={{ ...t7(36), position: "relative" }}>{c.t}</div>
            <div style={{ ...gloss(28), position: "relative", marginTop: 10, lineHeight: 1.5 }}>{c.g}</div>
          </Card>
        ))}
      </div>
      <div style={{ margin: "36px 0 24px", textAlign: "center", opacity: fi(f, marks[2].start + 4) }}>
        <span style={{ ...inkNote(37), color: "#C2334E", fontWeight: 700 }}>⚠️ 盲點二 · 送出前特地關掉兩個預設</span>
      </div>
      <div style={{ display: "flex", gap: 32, width: 1400 }}>
        {[
          { e: "🚫🏷️", t: "不讓舊經歷蓋掉剛改好的頭銜" },
          { e: "🚫📢", t: "關掉通知人脈,不然像換工作的假消息" },
        ].map((x, i) => (
          <div key={x.t} style={{ flex: 1, opacity: fi(f, marks[3].start + i * 14) }}>
            <Card c={ACC.violet} style={{ padding: "30px 30px", textAlign: "center" }}>
              <div style={{ position: "relative", fontSize: 60 }}>{x.e}</div>
              <div style={{ ...t7(31), position: "relative", marginTop: 16, lineHeight: 1.4 }}>{x.t}</div>
            </Card>
          </div>
        ))}
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch10 技能 2 變 24 + 盲點三 ────────────────────────── */
export const SkillsGrowScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const SKILLS = [
    "NPI Management", "供應鏈管理", "計畫管理", "營運管理", "跨部門團隊領導", "製造作業", "委託製造",
    "產品生命週期管理", "風險管理", "降低成本", "消費性電子產品", "精實製造", "持續改善", "敏捷方法",
    "變更管理", "利害關係人管理", "FMEA", "專案管理", "團隊合作", "資料分析", "專案控制", "Office", "物料清單", "英文",
  ];
  const shown = Math.min(SKILLS.length, Math.floor(interpolate(f, [marks[0].start + 10, marks[2].end - 20], [2, SKILLS.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={28}>優化六 · 技能欄 2 → 24 項</Head>
      </div>
      <div style={{ marginBottom: 36, textAlign: "center", opacity: fi(f, marks[1].start + 4) }}>
        <span style={inkNote()}>
          ⚠️ 盲點三 · 技能欄不是給人看的,是<span style={{ color: ACC.ember, fontWeight: 700 }}>給獵頭搜尋系統讀的資料庫</span>
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 17, maxWidth: 1500, minHeight: 250 }}>
        {SKILLS.slice(0, shown).map((s) => (
          <div key={s} style={{ position: "relative", overflow: "hidden", ...darkCard(SLATE, { r: 999, glow: 0.3 }), padding: "13px 30px", alignSelf: "flex-start" }}>
            <span style={{ ...gloss(28), color: rgba("#ffffff", 0.88) }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 34, textAlign: "center" }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 74, color: ACC.ember, filter: `drop-shadow(0 4px 12px ${rgba(ACC.ember, 0.3)})` }}>{shown} / 24</span>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch11 我沒開口它也做了的 ────────────────────────── */
export const BonusScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const items = [
    { e: "🔗", t: "檢查每條連結是不是活的" },
    { e: "🧠", t: "把每個決策存進長期記憶" },
    { e: "🚫💳", t: "跳出來的付費推銷視窗自動關掉" },
    { e: "🔁", t: "重複的技能自動偵測跳過" },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head>我沒開口,它也順手做了的</Head>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, width: 1560 }}>
        {items.map((x, i) => (
          <div key={x.t} style={{ opacity: fi(f, marks[1].start + 4 + i * 10) }}>
            <Card c={ACC.mint} style={{ padding: "36px 38px", display: "flex", gap: 28, alignItems: "center" }}>
              <div style={{ position: "relative", fontSize: 68 }}>{x.e}</div>
              <div style={{ ...t7(35), position: "relative" }}>{x.t}</div>
            </Card>
          </div>
        ))}
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch12 誠實清單:它做不到的 ────────────────────────── */
export const HonestScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head>誠實清單 · 它做不到的</Head>
      </div>
      <div style={{ display: "flex", gap: 44, width: 1360, opacity: fi(f, marks[1].start + 4) }}>
        {[
          { t: "推薦信", g: "要真人幫我寫" },
          { t: "技能肯定", g: "要同事幫我點" },
        ].map((x) => (
          <Card key={x.t} c={ACC.rose} style={{ flex: 1, padding: "38px 40px", textAlign: "center" }}>
            <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 104, color: ACC.rose, textShadow: `0 0 24px ${rgba(ACC.rose, 0.4)}` }}>0</div>
            <div style={{ ...t7(40), position: "relative", marginTop: 8 }}>{x.t}</div>
            <div style={{ ...gloss(29), position: "relative", marginTop: 10 }}>{x.g}</div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 46, opacity: fi(f, marks[2].start + 4) }}>
        <Card c={ACC.ember} style={{ padding: "20px 50px", borderRadius: 999 }}>
          <span style={{ ...t7(38), position: "relative" }}>
            AI 能把<span style={{ color: ACC.emberSoft }}>舞台搭好</span>,站上去握手的還是得我自己
          </span>
        </Card>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Ch13 總成績 Before/After ────────────────────────── */
export const ScoreboardScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const rows = [
    { k: "技能欄", b: "2 項", a: "24 項" },
    { k: "工作經歷", b: "1 段", a: "3 段" },
    { k: "頭銜", b: "系統預設", a: "一整串關鍵字" },
    { k: "封面橫幅", b: "空白", a: "定製設計" },
    { k: "個人主頁", b: "不存在", a: "已上線" },
  ];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Head mb={26}>總成績單</Head>
      </div>
      <div style={{ display: "flex", gap: 26, width: 1500, marginBottom: 14, opacity: fi(f, marks[1].start + 2) }}>
        {["項目", "Before", "After"].map((h) => (
          <div key={h} style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 33, letterSpacing: 3, color: ACC.inkSoft }}>{h}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 15, width: 1500 }}>
        {rows.map((r, i) => (
          <div key={r.k} style={{ display: "flex", gap: 26, opacity: fi(f, marks[1].start + 6 + i * 8) }}>
            <div style={{ position: "relative", overflow: "hidden", ...darkCard(SLATE, { r: 14, glow: 0.3 }), flex: 1, padding: "17px 20px", textAlign: "center" }}>
              <span style={{ ...gloss(31), color: rgba("#ffffff", 0.88) }}>{r.k}</span>
            </div>
            <div style={{ position: "relative", overflow: "hidden", ...darkCard(SLATE, { r: 14, glow: 0.2 }), flex: 1, padding: "17px 20px", textAlign: "center", opacity: 0.72 }}>
              <span style={gloss(31)}>{r.b}</span>
            </div>
            <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.ember, { r: 14, glow: 0.6 }), flex: 1, padding: "17px 20px", textAlign: "center" }}>
              <span style={{ ...t7(31), letterSpacing: 0.5 }}>{r.a}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 34, textAlign: "center", opacity: fi(f, marks[2].start + 4) }}>
        <span style={inkNote()}>花費時間 ≈ 幾杯咖啡 + 十幾次按下確認鍵</span>
      </div>
    </Wrap>
  );
};

/* ────────────────────────── Outro ────────────────────────── */
export const MakeoverOutroScene: React.FC<SceneProps> = ({ marks }) => {
  const f = useCurrentFrame();
  const ctas = ["🔔 訂閱", "👍 按讚", "↗️ 分享"];
  return (
    <Wrap>
      <div style={{ opacity: fi(f, marks[0].start) }}>
        <Card c={ACC.ember} style={{ padding: "48px 76px", textAlign: "center", maxWidth: 1440, borderRadius: 34 }}>
          <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 58, lineHeight: 1.5, color: "#fff" }}>
            AI 能幫你把舞台搭好
            <br />
            <span style={{ color: ACC.emberSoft }}>站上去,還是要靠你自己</span>
          </div>
        </Card>
      </div>
      <div style={{ margin: "44px 0 30px", textAlign: "center", opacity: fi(f, marks[1].start + 6) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 46, color: ACC.ink }}>感謝收看 🙏</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 38 }}>
        {ctas.map((t, i) => (
          <div key={t} style={{ opacity: fi(f, marks[1].start + 14 + i * 8) }}>
            <Card c={ACC.ember} style={{ padding: "18px 46px", borderRadius: 999 }}>
              <span style={{ ...t7(40), position: "relative" }}>{t}</span>
            </Card>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 38, textAlign: "center", opacity: fi(f, marks[1].start + 44) }}>
        <span style={inkNote(30)}>把 AI 當同事用的頻道 · AI Wisdom @aiwisdomcc</span>
      </div>
    </Wrap>
  );
};
