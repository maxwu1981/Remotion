import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BRAND_MARK, FONT } from "../../shared-skills/theme";
import spec from "../_explainer/specs/hf-voiceid.json";
import voManifest from "../_explainer/specs/hf-voiceid.vo.json";
import { WhiteBg, ACC, darkCard, Glare, hairline, emberClip, rgba, accOf } from "./glass";

/**
 * hf-voiceid 黑曜石版（16:9, 1920×1080, 30fps）— 生活應用系列 EP09。
 * Hugging Face 入門：註冊 → gated 條款 → Access Token → pyannote 聽聲音辨識發言人 → 會議全文。
 * 沿用 EP04/EP06 黑曜石模板：讀 _explainer/specs/hf-voiceid.json（已過稿）
 *   + 同名 vo.json + 曉晴 VO(public/vo/hf-voiceid)。
 * HAS_VO：VO 尚未生成時設 false；HAS_BGM：bgm-hf-voiceid.mp3 生成後改 true。
 */
const FPS = 30;
const HAS_VO = true;
const HAS_BGM = true;
const VO = voManifest as Record<string, number>;
const SC = spec.script as Record<string, string>;
const sec = (id: string) => Math.round((VO[id] ?? 3) * FPS);
const LEAD = 14, GAP = 10, TAIL = 20, XFADE = 12;

const fadeIn = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

type Scene = any;
const SCENES = spec.scenes as Scene[];

/* ── 每景概念錨（index 對 scene；null=不顯示：封面/禮物/outro）── */
const OS: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: ACC.emberSoft }}>{children}</span>;
const ANCHORS: (React.ReactNode | null)[] = [
  null,
  <>註冊 → 同意 → <OS>Token → 開跑</OS></>,
  <>Hugging Face = <OS>模型界 App Store</OS></>,
  <>gated = 登記進場 · <OS>token = 借書證</OS></>,
  <>一大坨文字 <OS>≠ 會議記錄</OS></>,
  <>註冊<OS>免費</OS>，不綁信用卡</>,
  <>兩顆模型，<OS>都要同意</OS></>,
  <>Token 權限 <OS>Read 就夠</OS></>,
  <>41 分音檔 <OS>≈ 跑 40 分</OS>，丟著等</>,
  <>聲紋註冊 = <OS>編號變名字</OS></>,
  <><OS>聲紋註冊</OS>，大部分教學沒教</>,
  null,
  null,
];

const sceneDur = (s: Scene) =>
  LEAD + s.cues.reduce((a: number, id: string) => a + sec(id) + GAP, 0) - GAP + TAIL;
const sceneMarks = (s: Scene) => {
  let off = LEAD;
  return s.cues.map((id: string) => {
    const m = { id, start: off, end: off + sec(id) };
    off += sec(id) + GAP;
    return m;
  });
};
export const hfVoiceidObsidianFrames = () =>
  SCENES.reduce((a, s) => a + sceneDur(s), 0) - (SCENES.length - 1) * XFADE;

/* ── 共用小件 ─────────────────────────────────────────────── */
const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 40, right: 56, display: "flex", alignItems: "center", gap: 12, ...darkCard(ACC.ember, { r: 999, glow: 0.45 }), padding: "9px 22px" }}>
    <span style={{ width: 10, height: 10, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 9px ${rgba(ACC.ember, 0.8)}` }} />
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "#fff" }}>Ai-Wisdom</span>
  </div>
);

const Kicker: React.FC<{ text: string; c: string }> = ({ text, c }) => (
  <div style={{ position: "absolute", top: 44, left: 60 }}>
    <div style={{ ...darkCard(c, { r: 999, glow: 0.5 }), padding: "9px 26px", display: "inline-flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 9, height: 9, borderRadius: 999, background: c, boxShadow: `0 0 9px ${rgba(c, 0.85)}` }} />
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, letterSpacing: 2, color: "#fff" }}>{text}</span>
    </div>
  </div>
);

const Heading: React.FC<{ zh: string; en?: string; f: number }> = ({ zh, en, f }) => {
  const o = fadeIn(f, 4, 14);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 62, letterSpacing: 1, color: ACC.ink }}>{zh}</div>
      {en && <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 27, letterSpacing: 4, color: ACC.muted, marginTop: 8 }}>{en}</div>}
    </div>
  );
};

const KeyLine: React.FC<{ text: string; c: string; show: boolean }> = ({ text, c, show }) => {
  const f = useCurrentFrame();
  const o = show ? fadeIn(f, 0, 12) : 0;
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 168, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ ...darkCard(c, { r: 16, glow: 0.7 }), position: "relative", overflow: "hidden", padding: "16px 40px", maxWidth: 1480 }}>
        <Glare />
        <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 34, letterSpacing: 0.5, color: "#fff" }}>{text}</span>
      </div>
    </div>
  );
};

/* ── 終端機深卡（cmd/out/err/ok/cmt）── */
const lineColor = (k: string): React.CSSProperties => {
  switch (k) {
    case "cmd": return { color: "#fff", fontWeight: 700 };
    case "err": return { color: "#FF9DAC", fontWeight: 600 };
    case "ok": return { color: "#7EE6B6", fontWeight: 600 };
    case "cmt": return { color: rgba("#ffffff", 0.5), fontWeight: 500 };
    default: return { color: rgba("#ffffff", 0.82), fontWeight: 500 };
  }
};
const TermCard: React.FC<{ title?: string; lines: { k: string; t: string }[]; c: string; f: number; w?: number }> = ({ title, lines, c, f, w = 1440 }) => {
  const o = fadeIn(f, 8, 14);
  return (
    <div style={{ ...darkCard(c, { r: 22, glow: 0.95 }), position: "relative", overflow: "hidden", width: w, opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
      <Glare />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "16px 26px", borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 13, height: 13, borderRadius: 999, background: "#28C840" }} />
        {title && <span style={{ marginLeft: 12, fontFamily: FONT.monoCjk, fontSize: 24, color: rgba("#ffffff", 0.6) }}>{title}</span>}
      </div>
      <div style={{ position: "relative", padding: "22px 30px", display: "flex", flexDirection: "column", gap: 15 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: FONT.monoCjk, fontSize: 30, lineHeight: 1.32, textRendering: "geometricPrecision", fontKerning: "none", ...lineColor(l.k) }}>
            {l.k === "cmd" && <span style={{ color: ACC.gold, marginRight: 12 }}>$</span>}
            {l.k === "cmt" && <span style={{ color: rgba("#ffffff", 0.32), marginRight: 8 }}>#</span>}
            {l.t}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── 場景視覺 ─────────────────────────────────────────────── */
const CoverScene: React.FC<{ s: Scene; f: number }> = ({ s, f }) => {
  const o = fadeIn(f, 2, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: ACC.ink }}>
      <div style={{ position: "absolute", top: 62, left: 96, display: "flex", alignItems: "center", gap: 22, opacity: o }}>
        <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 28px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: `linear-gradient(135deg, ${ACC.ember}, ${ACC.emberSoft})`, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
          <span style={{ fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "#fff" }}>生活應用系列 EP09</span>
        </div>
        <span style={{ fontWeight: 500, fontSize: 27, letterSpacing: 6, color: ACC.muted }}>{BRAND_MARK}</span>
      </div>

      <div style={{ position: "absolute", top: 194, left: 96, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 66, letterSpacing: 1, color: ACC.ink }}>{s.titlePre}</div>
        <div style={{ ...emberClip, background: "linear-gradient(160deg, #F09A6B 0%, #D97757 42%, #B54C29 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", fontWeight: 800, fontSize: 118, letterSpacing: -2, lineHeight: 1.04, marginTop: 8, filter: `drop-shadow(0 8px 20px ${rgba(ACC.ember, 0.35)})` }}>{s.titlePost}</div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "flex-start", gap: 22, maxWidth: 1010 }}>
          <span style={{ width: 60, height: 3, background: ACC.ember, borderRadius: 2, marginTop: 22, flexShrink: 0 }} />
          <span style={{ fontWeight: 500, fontSize: 38, lineHeight: 1.34, letterSpacing: 2, color: ACC.inkSoft }}>{spec.brand.tagline}</span>
        </div>
      </div>

      {/* 數字 chips */}
      <div style={{ position: "absolute", bottom: 214, left: 96, display: "flex", gap: 20, opacity: o }}>
        {(s.chips ?? []).map((ch: any, i: number) => {
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
      <div style={{ position: "absolute", top: 150, right: 92, width: 620, ...darkCard(ACC.ember, { r: 40, glow: 1.2 }), overflow: "hidden", padding: "40px 42px", transform: `rotate(-2.5deg)`, opacity: o }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(54% 30% at 50% 20%, ${rgba(ACC.ember, 0.36)} 0%, transparent 72%)` }} />
        <Glare />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 30 }}>💬</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 27, letterSpacing: 1, color: rgba("#ffffff", 0.7) }}>你只要對 Claude 說一句話</span>
        </div>
        <div style={{ position: "relative", padding: "22px 24px", borderRadius: 16, background: rgba("#060a14", 0.7), border: `1px solid ${rgba(ACC.ember, 0.35)}`, boxShadow: `inset 0 2px 6px ${rgba("#000", 0.5)}` }}>
          <span style={{ fontFamily: FONT.monoCjk, fontSize: 30, lineHeight: 1.42, color: "#fff" }}>
            <span style={{ color: ACC.gold }}>$</span> 「Hi Claude，用 Hugging Face 的 pyannote，幫我把會議音檔<span style={{ color: ACC.emberSoft }}>標出誰在說話</span>」
          </span>
        </div>
        <div style={{ ...hairline, position: "relative", margin: "26px 0 22px" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 15 }}>
          {["註冊 → 同意條款 → Token → 開跑", "聲紋註冊 · 編號自動變真名", "模型免費 · MIT 授權 · 全程帶路"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 26, color: ACC.emberSoft, textShadow: `0 0 12px ${rgba(ACC.ember, 0.6)}` }}>✓</span>
              <span style={{ fontWeight: 500, fontSize: 27, color: rgba("#ffffff", 0.85) }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 真截圖標註件（2026-07-10 拍板：實操段用真截圖＋正紅紅框＋聚光＋放大鏡）── */
const RED = "#FF3B30";

/** 紅框：一次性「畫框」動畫（12 幀描完後全靜態，防抖安全）。座標=繪製後像素。 */
const RedFrame: React.FC<{ x: number; y: number; w: number; h: number; t: number; sw?: number }> = ({ x, y, w, h, t, sw = 5 }) => {
  const P = 2 * (w + h);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", overflow: "visible" }} width={1} height={1}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={RED} strokeWidth={sw}
        strokeDasharray={P} strokeDashoffset={P * (1 - t)} opacity={t <= 0 ? 0 : 1}
        style={{ filter: `drop-shadow(0 0 10px ${rgba(RED, 0.55)})` }} />
    </svg>
  );
};

/** 聚光：紅框外壓暗（box-shadow 打洞法），跟紅框同步淡入後靜止。 */
const Spotlight: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 10, boxShadow: `0 0 0 9999px ${rgba("#060a14", 0.36)}`, opacity: t, pointerEvents: "none" }} />
);

/** 放大鏡：目標欄位裁切放大浮出（Img 平移縮放實作，render 安全）。 */
const Loupe: React.FC<{ src: string; imgW: number; rect: number[]; w: number; t: number; c?: string; maxH?: number }> = ({ src, imgW, rect, w, t, c = RED, maxH = 260 }) => {
  const [x1, y1, x2, y2] = rect;
  const k = w / (x2 - x1);
  const full = Math.round((y2 - y1) * k);
  const h = Math.min(maxH, full);
  if (t <= 0.01) return null;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 14, overflow: "hidden", border: `3px solid ${c}`, boxShadow: `0 0 14px ${rgba(c, 0.45)}, 0 14px 30px ${rgba("#0b1020", 0.35)}`, opacity: t, background: "#0D1322" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", width: imgW * k, left: -x1 * k, top: -y1 * k - (full - h) / 2, maxWidth: "none" }} />
      <div style={{ position: "absolute", top: 6, right: 10, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 18, color: "#fff", background: rgba(c, 0.85), borderRadius: 8, padding: "2px 10px" }}>放大</div>
    </div>
  );
};

/** shot 景：真截圖佔約 2/3（黑曜石卡框）＋左窄步驟欄；紅框/聚光/放大鏡隨 cue 移動。 */
const ShotScene: React.FC<{ s: Scene; f: number; marks: { id: string; start: number; end: number }[] }> = ({ s, f, marks }) => {
  const c = accOf(s.accent);
  const IMGW = 1160;
  let act = -1;
  marks.forEach((m, i) => { if (f >= m.start) act = i; });
  const cueId = act >= 0 ? s.cues[act] : s.cues[0];
  const hl = s.highlights[cueId];
  const imgs: any[] = s.images;
  const activeImg = imgs.find((im) => im.id === (hl?.img ?? imgs[0].id)) ?? imgs[0];
  const hlStart = act >= 0 ? marks[act].start : 0;
  const tDraw = act >= 0 ? fadeIn(f, hlStart + 2, 12) : 0;

  // 圖片單調堆疊：每張圖在「第一次成為主圖」的 cue 起點淡入，之後蓋住前一張（全一次性動畫）
  const firstStart: Record<string, number> = {};
  s.cues.forEach((id: string, i: number) => {
    const im = s.highlights[id]?.img;
    if (im && firstStart[im] === undefined) firstStart[im] = i === 0 ? 6 : marks[i]?.start ?? 6;
  });

  const scale = IMGW / activeImg.w;
  const IMGH = Math.round(activeImg.h * scale);
  const R = hl ? { x: hl.rect[0] * scale, y: hl.rect[1] * scale, w: (hl.rect[2] - hl.rect[0]) * scale, h: (hl.rect[3] - hl.rect[1]) * scale } : null;
  const o = fadeIn(f, 6, 14);

  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />

      {/* 左：步驟欄＋放大鏡 */}
      <div style={{ position: "absolute", left: 56, top: 268, width: 500, display: "flex", flexDirection: "column", gap: 14, opacity: o }}>
        {(s.steps ?? []).map((st: any, i: number) => {
          const active = st.cue === cueId;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderRadius: 16, ...(active ? darkCard(c, { r: 16, glow: 0.7 }) : { border: `1px solid ${rgba(ACC.ink, 0.1)}`, background: rgba("#ffffff", 0.45) }) }}>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 26, color: active ? ACC.gold : ACC.muted, flexShrink: 0 }}>{st.icon}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: active ? 700 : 500, fontSize: 25, lineHeight: 1.3, color: active ? "#fff" : ACC.inkSoft }}>{st.t}</span>
            </div>
          );
        })}
        {hl?.loupe && (
          <div style={{ marginTop: 8 }}>
            <Loupe src={activeImg.src} imgW={activeImg.w} rect={hl.loupe} w={500} t={tDraw} />
          </div>
        )}
      </div>

      {/* 右：截圖主圖（黑曜石卡框）＋紅框/聚光 */}
      <div style={{ position: "absolute", left: 618, top: 252, ...darkCard(c, { r: 24, glow: 0.85 }), padding: 14, opacity: o }}>
        <div style={{ position: "relative", width: IMGW, height: IMGH, borderRadius: 14, overflow: "hidden" }}>
          {imgs.filter((im) => firstStart[im.id] !== undefined).map((im) => (
            <Img key={im.id} src={staticFile(im.src)} style={{ position: "absolute", left: 0, top: 0, width: IMGW, opacity: fadeIn(f, firstStart[im.id], 8) }} />
          ))}
          {R && <Spotlight x={R.x} y={R.y} w={R.w} h={R.h} t={tDraw} />}
          {R && <RedFrame x={R.x} y={R.y} w={R.w} h={R.h} t={tDraw} />}
          {R && hl?.mask && (
            <div style={{ position: "absolute", left: R.x + R.w / 2, top: R.y + R.h / 2, transform: "translate(-50%, -50%)", padding: "6px 18px", borderRadius: 10, background: rgba(RED, 0.88), fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 24, color: "#fff", opacity: tDraw, whiteSpace: "nowrap" }}>⚠ {hl.mask}</div>
          )}
        </div>
        <div style={{ position: "absolute", right: 26, top: 26, padding: "6px 16px", borderRadius: 999, background: rgba("#060a14", 0.72), border: `1px solid ${rgba("#ffffff", 0.2)}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: 1 }}>📸 {activeImg.label}</div>
      </div>
    </AbsoluteFill>
  );
};

/** 名詞小教室景：四詞四框（pipeline 節點卡同款），旁白講到哪個詞哪框亮（編號①-④固定對應四個詞）；
 *  可掛 sideShot 真圖實據（如 pyannote 模型頁圈下載數）。2026-07-10 老闆退稿終端卡版後拍板。 */
const GlossaryScene: React.FC<{ s: Scene; f: number; marks: { id: string; start: number; end: number }[] }> = ({ s, f, marks }) => {
  const c = accOf(s.accent);
  let act = -1;
  marks.forEach((m, i) => { if (f >= m.start) act = i; });
  const cueId = act >= 0 ? s.cues[act] : null;
  const cueStart = act >= 0 ? marks[act].start : 0;

  const side = s.sideShot;
  const sideAt = side ? (marks[s.cues.indexOf(side.atCue)]?.start ?? 9999) : 9999;
  const so = side ? fadeIn(f, sideAt, 12) : 0;
  const SW = 620;
  const sideScale = side ? SW / (side.view[2] - side.view[0]) : 1;
  const SH = side ? Math.round((side.view[3] - side.view[1]) * sideScale) : 0;
  // 無側卡時四框置中；側卡亮相時一次性上移讓位（12 幀後定住，防抖安全）
  const rowY = side ? interpolate(f, [sideAt, sideAt + 12], [400, 288], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 400;

  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      <div style={{ position: "absolute", top: rowY, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 24 }}>
        {s.terms.map((n: any, i: number) => {
          const active = !!cueId && n.cues.includes(cueId);
          const nc = accOf(n.accent);
          const o = fadeIn(f, 8 + i * 6, 12);
          const at = active ? fadeIn(f, cueStart, 8) : 0;
          return (
            <div key={i} style={{ position: "relative", width: 320, minHeight: 216, padding: "26px 18px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, opacity: o * (active ? 1 : 0.55), transform: `translateY(${(1 - o) * 18}px) scale(${1 + at * 0.05})`, ...darkCard(nc, { r: 24, glow: active ? 0.55 + at * 0.55 : 0.22 }), overflow: "hidden" }}>
              <Glare />
              <span style={{ position: "absolute", top: 12, left: 18, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 27, color: active ? ACC.gold : rgba("#ffffff", 0.45) }}>{n.n}</span>
              <span style={{ position: "relative", fontSize: 52 }}>{n.icon}</span>
              <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 32, color: "#fff" }}>{n.label}</span>
              <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 23, color: rgba("#ffffff", 0.72), lineHeight: 1.3 }}>{n.sub}</span>
            </div>
          );
        })}
      </div>
      {side && so > 0.01 && (
        <div style={{ position: "absolute", top: rowY + 256, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 22, opacity: so }}>
          <div style={{ ...darkCard(ACC.signal, { r: 20, glow: 0.85 }), padding: 12 }}>
            <div style={{ position: "relative", width: SW, height: SH, borderRadius: 12, overflow: "hidden" }}>
              <Img src={staticFile(side.src)} style={{ position: "absolute", width: side.w * sideScale, left: -side.view[0] * sideScale, top: -side.view[1] * sideScale, maxWidth: "none" }} />
              <Spotlight x={(side.rect[0] - side.view[0]) * sideScale} y={(side.rect[1] - side.view[1]) * sideScale} w={(side.rect[2] - side.rect[0]) * sideScale} h={(side.rect[3] - side.rect[1]) * sideScale} t={so} />
              <RedFrame x={(side.rect[0] - side.view[0]) * sideScale} y={(side.rect[1] - side.view[1]) * sideScale} w={(side.rect[2] - side.rect[0]) * sideScale} h={(side.rect[3] - side.rect[1]) * sideScale} t={so} sw={4} />
            </div>
            <div style={{ marginTop: 8, textAlign: "center", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 19, color: rgba("#ffffff", 0.75), letterSpacing: 1 }}>📸 {side.label}</div>
          </div>
          <Loupe src={side.src} imgW={side.w} rect={side.loupe} w={400} t={so} maxH={190} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const TerminalScene: React.FC<{ s: Scene; f: number; showKey: boolean; marks: { id: string; start: number; end: number }[] }> = ({ s, f, showKey, marks }) => {
  const c = accOf(s.accent);
  const isGift = (s.kicker || "").includes("禮物");
  const side = s.sideShot;
  const sideAt = side ? (marks[s.cues.indexOf(side.atCue)]?.start ?? 9999) : 9999;
  const so = side ? fadeIn(f, sideAt, 12) : 0;
  const SW = 560;
  const sideScale = side ? SW / (side.view[2] - side.view[0]) : 1;
  const SH = side ? Math.round((side.view[3] - side.view[1]) * sideScale) : 0;
  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 30, paddingTop: 60 }}>
        <TermCard title={s.terminal.title} lines={s.terminal.lines} c={c} f={f} w={side && so > 0.01 ? 1060 : isGift ? 1560 : 1440} />
        {side && so > 0.01 && (
          <div style={{ ...darkCard(c, { r: 20, glow: 0.85 }), padding: 12, opacity: so }}>
            <div style={{ position: "relative", width: SW, height: SH, borderRadius: 12, overflow: "hidden" }}>
              <Img src={staticFile(side.src)} style={{ position: "absolute", width: side.w * sideScale, left: -side.view[0] * sideScale, top: -side.view[1] * sideScale, maxWidth: "none" }} />
              <Spotlight x={(side.rect[0] - side.view[0]) * sideScale} y={(side.rect[1] - side.view[1]) * sideScale} w={(side.rect[2] - side.rect[0]) * sideScale} h={(side.rect[3] - side.rect[1]) * sideScale} t={so} />
              <RedFrame x={(side.rect[0] - side.view[0]) * sideScale} y={(side.rect[1] - side.view[1]) * sideScale} w={(side.rect[2] - side.rect[0]) * sideScale} h={(side.rect[3] - side.rect[1]) * sideScale} t={so} sw={4} />
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
              <Loupe src={side.src} imgW={side.w} rect={side.loupe} w={400} t={so} maxH={180} />
            </div>
            <div style={{ marginTop: 10, textAlign: "center", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 19, color: rgba("#ffffff", 0.75), letterSpacing: 1 }}>📸 {side.label}</div>
          </div>
        )}
      </AbsoluteFill>
      {s.keyline && <KeyLine text={s.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const PipelineScene: React.FC<{ s: Scene; f: number; showKey: boolean }> = ({ s, f, showKey }) => {
  const c = accOf(s.accent);
  const many = s.nodes.length >= 5;
  const nodeW = many ? 288 : 300;
  const gap = many ? 14 : 26;
  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap }}>
          {s.nodes.map((n: any, i: number) => {
            const nc = accOf(n.accent);
            const o = fadeIn(f, 10 + i * 8, 14);
            return (
              <React.Fragment key={i}>
                <div style={{ ...darkCard(nc, { r: 24, glow: 0.9 }), position: "relative", overflow: "hidden", width: nodeW, minHeight: 210, padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
                  <Glare />
                  <span style={{ position: "relative", fontSize: 56 }}>{n.icon}</span>
                  <span style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: many ? 30 : 34, color: "#fff" }}>{n.label}</span>
                  {n.sub && <span style={{ position: "relative", fontWeight: 500, fontSize: many ? 22 : 24, color: rgba("#ffffff", 0.66), lineHeight: 1.3 }}>{n.sub}</span>}
                </div>
                {i < s.nodes.length - 1 && <span style={{ fontSize: many ? 36 : 46, fontWeight: 800, color: ACC.emberSoft, opacity: fadeIn(f, 14 + i * 8, 12) }}>→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      {s.keyline && <KeyLine text={s.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const CompareScene: React.FC<{ s: Scene; f: number; showKey: boolean }> = ({ s, f, showKey }) => {
  const c = accOf(s.accent);
  const Card = ({ side, badge, code, note, delay }: any) => {
    const good = side === "good";
    const cc = good ? ACC.mint : ACC.rose;
    const o = fadeIn(f, delay, 14);
    return (
      <div style={{ ...darkCard(cc, { r: 24, glow: 0.9 }), position: "relative", overflow: "hidden", width: 680, opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
        <Glare />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "18px 26px", borderBottom: `1px solid ${rgba("#ffffff", 0.1)}` }}>
          <span style={{ width: 36, height: 36, borderRadius: 999, background: cc, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>{good ? "✔" : "✘"}</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 32, color: "#fff" }}>{badge}</span>
        </div>
        <div style={{ position: "relative", padding: "24px 26px" }}>
          <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: 28, color: "#fff", background: rgba("#060a14", 0.6), border: `1px solid ${rgba(cc, 0.3)}`, borderRadius: 12, padding: "16px 20px", lineHeight: 1.4 }}>{code}</div>
          <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 27, color: rgba("#ffffff", 0.78), lineHeight: 1.45 }}>{note}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Kicker text={s.kicker} c={c} />
      <Brand />
      <Heading zh={s.headingZh} en={s.headingEn} f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 34 }}>
          <Card side="bad" {...s.bad} delay={10} />
          <Card side="good" {...s.good} delay={20} />
        </div>
      </AbsoluteFill>
      {s.keyline && <KeyLine text={s.keyline} c={c} show={showKey} />}
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ s: Scene; f: number }> = ({ s, f }) => {
  const o = fadeIn(f, 4, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ textAlign: "center", opacity: o }}>
        <div style={{ fontWeight: 800, fontSize: 96, color: ACC.ink }}>感謝 <span style={emberClip}>觀看</span>！</div>
        <div style={{ fontWeight: 600, fontSize: 40, color: ACC.inkSoft, marginTop: 14 }}>覺得有幫助，就用一個動作支持 👇</div>
        <div style={{ display: "flex", gap: 26, justifyContent: "center", marginTop: 44 }}>
          {[["👍", "按讚", ACC.mint], ["🔔", "訂閱", ACC.rose], ["🔗", "分享", ACC.azure]].map(([e, t, c], i) => (
            <div key={i} style={{ ...darkCard(c as string, { r: 999, glow: 0.8 }), position: "relative", overflow: "hidden", padding: "18px 48px", display: "flex", alignItems: "center", gap: 14, opacity: fadeIn(f, 16 + i * 6, 12) }}>
              <Glare />
              <span style={{ position: "relative", fontSize: 40 }}>{e}</span>
              <span style={{ position: "relative", fontWeight: 800, fontSize: 42, color: "#fff" }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44, display: "inline-flex", alignItems: "center", gap: 14, ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "12px 30px" }}>
          <span style={{ fontWeight: 800, fontSize: 30, color: "#fff" }}>Ai-Wisdom</span>
          <span style={{ fontWeight: 500, fontSize: 26, letterSpacing: 3, color: rgba("#ffffff", 0.6) }}>· 生活應用系列 · {spec.brand.date.replace(/[^0-9-]/g, "")}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 字幕 + 頂帶 + 場景外殼 ── */
const Caption: React.FC<{ text: string; at: number; until: number }> = ({ text, at, until }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, at, 6) * (1 - fadeIn(f, until - 6, 6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 50, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: 1640, padding: "16px 38px", borderRadius: 16, background: "rgba(13,19,34,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 38, lineHeight: 1.42, color: "#fff", letterSpacing: 0.5 }}>{text}</div>
      </div>
    </div>
  );
};

const TopBanner: React.FC<{ node: React.ReactNode }> = ({ node }) => {
  const f = useCurrentFrame();
  if (!node) return null;
  return (
    <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 6, 16) }}>
      <div style={{ padding: "11px 34px", borderRadius: 999, background: "rgba(13,19,34,0.66)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 10px 24px rgba(11,16,32,0.24), inset 0 1px 0 rgba(255,255,255,0.22)" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 30, color: "#f4f7fb", letterSpacing: 1 }}>{node}</span>
      </div>
    </div>
  );
};

const SceneShell: React.FC<{ idx: number }> = ({ idx }) => {
  const s = SCENES[idx];
  const f = useCurrentFrame();
  const marks = sceneMarks(s);
  const anchor = ANCHORS[idx];
  const keyAtCue = s.keylineAtCue ?? 3;
  const keyStart = marks[Math.min(keyAtCue, marks.length - 1)]?.start ?? 9999;
  let visual: React.ReactNode;
  if (s.type === "cover") visual = <CoverScene s={s} f={f} />;
  else if (s.type === "pipeline") visual = <PipelineScene s={s} f={f} showKey={f >= keyStart} />;
  else if (s.type === "compare") visual = <CompareScene s={s} f={f} showKey={f >= keyStart} />;
  else if (s.type === "shot") visual = <ShotScene s={s} f={f} marks={marks} />;
  else if (s.type === "glossary") visual = <GlossaryScene s={s} f={f} marks={marks} />;
  else if (s.type === "outro") visual = <OutroScene s={s} f={f} />;
  else visual = <TerminalScene s={s} f={f} showKey={f >= keyStart} marks={marks} />;

  return (
    <AbsoluteFill>
      {visual}
      {/* 頂帶（概念錨）— 封面/gift/outro 無 */}
      {anchor && s.type !== "cover" && <TopBanner node={anchor} />}
      {marks.map((m: any) => (
        <Caption key={m.id} text={SC[m.id]} at={m.start} until={m.end + GAP} />
      ))}
      {HAS_VO && marks.map((m: any) => (
        <Sequence key={`a-${m.id}`} from={m.start}>
          <Audio src={staticFile(`vo/hf-voiceid/${m.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** 乾淨封面縮圖（無字幕、元素全淡入）— 給 YouTube 自訂縮圖用。 */
export const HfVoiceidThumb: React.FC = () => (
  <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
    <WhiteBg />
    <CoverScene s={SCENES[0]} f={60} />
  </AbsoluteFill>
);

export const HfVoiceidObsidian: React.FC = () => (
  // textSpacingTrim off：Chrome 的 CJK 標點擠壓在「全形標點相鄰但分屬不同字型分片」時
  // （本片 v1 場景10「身分證」，編號」行）會逐 render-worker 不一致 → 整行半字寬左右跳。
  <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
    <WhiteBg />
    {HAS_BGM && <Audio loop src={staticFile("bgm-hf-voiceid.mp3")} volume={0.11} />}
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`seq-${i}`} durationInFrames={sceneDur(s)}>
            <SceneShell idx={i} />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        return [
          <TransitionSeries.Transition key={`tr-${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
          seq,
        ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
