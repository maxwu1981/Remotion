import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW } from "../../shared-skills/theme";
import { appearScale, enter, springPop } from "../../shared-skills/anim";
import { categories, edges, categoryById, type CategoryId } from "./tree";
import { W, H, HEADER_Y, CARD_W, CARD_H, placed, posOf, colX } from "./mapLayout";
import { Narration } from "../../shared-skills/components/Narration";
import { Bgm } from "../../shared-skills/audio";
import { ThumbEP00 } from "./ThumbEP00";
import VO from "./ep00-vo.json";
import SCRIPT from "./ep00-script.json";

export const FPS = 30;

/* ── 版面(橫式 1920×1080) ── */
const BOX = { x: 50, y: 150, w: 1060, h: 824 }; // 地圖在左
const SCALE = Math.min(BOX.w / W, BOX.h / H);
const ORIGIN_X = BOX.x + (BOX.w - W * SCALE) / 2;
const ORIGIN_Y = BOX.y + (BOX.h - H * SCALE) / 2;
const PANEL = { x: 1150, y: 150, w: 720, h: 824 }; // 描述面板在右

// 結尾:地圖放大置中(更大)
const OUTRO_SCALE = 0.66;
const OUTRO_X = (1920 - W * OUTRO_SCALE) / 2;
const OUTRO_Y = 40;

/* ── 時間軸(旁白驅動:每段長度依語音時長自動撐開) ── */
const vo = VO as Record<string, number>;
const script = SCRIPT as Record<string, string>;
const VO_DIR = "vo/claude-code-map-ep00";

const PAD = 12;
const INTRO = 54;
const TAIL = 24;
const HDR = 18;
const PER = 30; // 每張描述顯示間隔
const HOLD = 48; // 全組描述顯示完後額外停留

const voF = (id: string): number => {
  const s = vo[id];
  if (s) return Math.ceil(s * FPS);
  const t = script[id] ?? "";
  return Math.ceil(Math.max(1.6, t.length / 5.2) * FPS);
};

type Seg = { cat: CategoryId; start: number; end: number; ids: string[] };
type Cue = { id: string; from: number; dur: number; text: string; voF: number; caption: boolean };

const SECTION_ORDER: { id: string; kind: "hook" | "map" | "group" | "outro"; cat?: CategoryId }[] = [
  { id: "hook1", kind: "hook" },
  { id: "hook2", kind: "hook" },
  { id: "map", kind: "map" },
  { id: "gA", kind: "group", cat: "A" },
  { id: "gB", kind: "group", cat: "B" },
  { id: "gC", kind: "group", cat: "C" },
  { id: "gD", kind: "group", cat: "D" },
  { id: "gE", kind: "group", cat: "E" },
  { id: "gF", kind: "group", cat: "F" },
  { id: "gG", kind: "group", cat: "G" },
  { id: "outro", kind: "outro" },
];

const { CUES, SEGS, MAP_APPEAR, OUTRO_START, DURATION } = (() => {
  const cues: Cue[] = [];
  const segs: Seg[] = [];
  let mapAppear = INTRO;
  let outroStart = INTRO;
  let t = INTRO;
  for (const sec of SECTION_ORDER) {
    const v = voF(sec.id);
    let dur: number;
    if (sec.kind === "group") {
      const ids = placed.filter((p) => p.category === sec.cat).sort((a, b) => a.num - b.num).map((p) => p.id);
      const reveal = HDR + ids.length * PER + HOLD;
      dur = Math.max(reveal, v + PAD);
      segs.push({ cat: sec.cat!, start: t, end: t + dur, ids });
    } else if (sec.kind === "map") {
      mapAppear = t;
      dur = v + PAD + 18;
    } else if (sec.kind === "outro") {
      outroStart = t;
      dur = Math.max(v + 44, 210);
    } else {
      dur = v + PAD;
    }
    cues.push({ id: sec.id, from: t, dur, text: script[sec.id] ?? "", voF: v, caption: sec.kind !== "outro" });
    t += dur;
  }
  return { CUES: cues, SEGS: segs, MAP_APPEAR: mapAppear, OUTRO_START: outroStart, DURATION: t + TAIL };
})();

export const getEp00Frames = () => DURATION;

/* ── 旁白音軌 ── */
const VoiceTrack: React.FC = () => (
  <>
    {CUES.map((c) => (
      <Sequence key={c.id} from={c.from} durationInFrames={c.voF + 8} layout="none" name={`vo-${c.id}`}>
        <Narration id={c.id} dir={VO_DIR} />
      </Sequence>
    ))}
  </>
);

/* ── 字幕(橫式底部單行,文字＝旁白) ── */
const Captions: React.FC = () => (
  <>
    {CUES.filter((c) => c.caption && c.text).map((c) => (
      <Sequence key={c.id} from={c.from} durationInFrames={c.dur} layout="none" name={`cap-${c.id}`}>
        <CapLine text={c.text} dur={c.dur} />
      </Sequence>
    ))}
  </>
);
const CapLine: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  const a = interpolate(frame, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [Math.max(0, dur - 8), dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", opacity: Math.min(a, o) }}>
      <div
        style={{
          maxWidth: 1640,
          padding: "16px 40px",
          borderRadius: RADIUS.pill,
          background: "#FFFFFF",
          border: `1.5px solid ${COLORS.borderStrong}`,
          boxShadow: "none",
          fontFamily: FONT.uiCjk,
          fontWeight: 800,
          fontSize: 38,
          color: COLORS.ink,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ── 平背景(無點陣/無光塊高頻元素,避免 h264 靜態閃爍) ── */
const FlatBg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 22%)" }} />
  </AbsoluteFill>
);

/* ── 左:地圖板面 ── */
const Board: React.FC<{ activeCat: CategoryId | null; popT: number; appear: number; outroT: number }> = ({ activeCat, popT, appear, outroT }) => {
  const dimOther = (cat: CategoryId) => (activeCat && cat !== activeCat ? 0.26 : 1);
  const sc = interpolate(outroT, [0, 1], [SCALE, OUTRO_SCALE]);
  const ox = interpolate(outroT, [0, 1], [ORIGIN_X, OUTRO_X]);
  const oy = interpolate(outroT, [0, 1], [ORIGIN_Y, OUTRO_Y]);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: appear }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${ox}px, ${oy}px) scale(${sc})` }}>
        {/* 關係線(淡) */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {edges.map((e, idx) => {
            const a = posOf(e.from);
            const b = posOf(e.to);
            const mx = (a.cx + b.cx) / 2;
            const my = (a.cy + b.cy) / 2 - 64;
            return (
              <path key={idx} d={`M ${a.cx} ${a.cy} Q ${mx} ${my} ${b.cx} ${b.cy}`} fill="none" stroke={categoryById(a.category).color} strokeWidth={2} strokeOpacity={0.12} strokeDasharray="2 9" />
            );
          })}
          {categories.map((cat) => {
            const cn = placed.filter((p) => p.category === cat.id).sort((a, b) => a.num - b.num);
            return cn.slice(0, -1).map((p, idx) => {
              const next = cn[idx + 1];
              return <line key={`${cat.id}-${idx}`} x1={p.cx} y1={p.y + CARD_H} x2={next.cx} y2={next.y} stroke={cat.color} strokeWidth={3} strokeOpacity={0.3 * dimOther(cat.id)} />;
            });
          })}
        </svg>

        {/* 大類標籤 */}
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              position: "absolute",
              left: colX(cat.id),
              top: HEADER_Y,
              width: CARD_W,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: RADIUS.md,
              background: cat.color,
              color: "#fff",
              opacity: dimOther(cat.id),
            }}
          >
            <span style={{ fontWeight: 800, fontSize: 22 }}>{cat.id}</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 19 }}>{cat.label}</span>
          </div>
        ))}

        {/* 節點卡片(只放標題) */}
        {placed.map((n) => {
          const color = categoryById(n.category).color;
          const isActive = activeCat === n.category;
          const cardScale = isActive ? 1 + 0.05 * popT : 1;
          return (
            <div
              key={n.id}
              style={{
                position: "absolute",
                left: n.x,
                top: n.y,
                width: CARD_W,
                height: CARD_H,
                transformOrigin: "center",
                transform: `scale(${cardScale})`,
                borderRadius: RADIUS.md,
                background: COLORS.surface,
                border: `1.5px solid ${isActive ? color : COLORS.border}`,
                borderLeft: `6px solid ${color}`,
                boxShadow: "none",
                padding: "12px 14px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                overflow: "hidden",
                opacity: dimOther(n.category),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 17, flexShrink: 0 }}>{n.num}</span>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 20, color: COLORS.ink }}>{n.title}</span>
              </div>
              <span style={{ fontFamily: FONT.mono, fontSize: 14, color: COLORS.muted }}>{n.titleEn}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── 右:課程描述面板(一組一組逐張出現) ── */
const DescPanel: React.FC<{ seg: Seg }> = ({ seg }) => {
  const frame = useCurrentFrame();
  const cat = categoryById(seg.cat);
  const rowH = Math.min(132, (PANEL.h - 90) / seg.ids.length);
  const hdr = enter(frame, seg.start, 12);
  return (
    <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h }}>
      {/* 面板標題 */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: hdr, transform: `translateY(${(1 - hdr) * 14}px)` }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 56, height: 56, padding: "0 16px", borderRadius: RADIUS.md, background: cat.color, color: "#fff", fontWeight: 800, fontSize: 30 }}>{seg.cat}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: COLORS.ink }}>{cat.label}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 24, color: COLORS.muted }}>· {seg.ids.length} 個</span>
      </div>

      {/* 描述列 */}
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {seg.ids.map((id, k) => {
          const n = posOf(id);
          const color = categoryById(n.category).color;
          const rs = seg.start + HDR + k * PER;
          const op = interpolate(frame, [rs, rs + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={id}
              style={{
                minHeight: rowH,
                display: "flex",
                gap: 14,
                padding: "12px 16px",
                borderRadius: RADIUS.md,
                background: COLORS.surface,
                border: `1.5px solid ${COLORS.borderStrong}`,
                borderLeft: `6px solid ${color}`,
                boxShadow: "none",
                opacity: op,
                transform: `translateY(${(1 - op) * 16}px)`,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{n.num}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 26, color: COLORS.ink, lineHeight: 1.1 }}>{n.title}</span>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 20, color: COLORS.inkSoft, lineHeight: 1.36 }}>{n.defShort}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── 封面亮相(第 0 秒先閃 EP00 縮圖同款設計,全幅放大,再淡出進鉤子) ── */
const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  // frame 0 必須 opacity=1(封面立刻滿版、與 YouTube 縮圖一致),絕不從 0 淡入;只在結束前淡出接內容
  const fout = interpolate(frame, [42, 54], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: COLORS.bg, opacity: fout }}>
      <div style={{ position: "relative", width: 1280, height: 720, transform: "scale(1.5)", transformOrigin: "center center" }}>
        <ThumbEP00 />
      </div>
    </AbsoluteFill>
  );
};

/* ── 鉤子 ── */
const HOOK_TERMS = [
  { t: "MCP", x: 0.16, y: 0.28 }, { t: "Skills", x: 0.7, y: 0.24 }, { t: "Hooks", x: 0.3, y: 0.6 },
  { t: "Routines", x: 0.74, y: 0.58 }, { t: "Subagents", x: 0.46, y: 0.4 }, { t: "Sandbox", x: 0.2, y: 0.74 }, { t: "Headless", x: 0.62, y: 0.78 },
];
const HookChips: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {HOOK_TERMS.map((c, i) => {
        const d = i * 6;
        const a = appearScale(frame, d, 16, 0.7);
        const strike = interpolate(frame, [d + 64, d + 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={c.t} style={{ position: "absolute", left: c.x * width, top: c.y * height, ...a }}>
            <div style={{ position: "relative", padding: "12px 24px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${COLORS.borderStrong}`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 40, color: COLORS.inkSoft, boxShadow: SHADOW.md }}>
              {c.t}
              <div style={{ position: "absolute", left: 8, right: 8, top: "50%", height: 4, borderRadius: 2, background: COLORS.error, transform: `scaleX(${strike})`, transformOrigin: "left" }} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ── 結尾訂閱 ── */
const SubscribePill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springPop(frame, fps, { delay: 4 });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 978, display: "flex", justifyContent: "center", ...s }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 20,
          padding: "14px 40px 14px 14px",
          borderRadius: RADIUS.pill,
          background: GRADIENT.claude,
          border: "2px solid rgba(255,255,255,0.55)",
          boxShadow: `0 6px 0 ${COLORS.claudeDeep}`,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fff",
            color: COLORS.claudeDeep,
            fontSize: 30,
            paddingLeft: 5,
          }}
        >
          ▶
        </span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, letterSpacing: 1, color: "#fff" }}>
          訂閱 · 按讚 · 一路學到 30
        </span>
      </div>
    </div>
  );
};

const TopTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const o = enter(frame, MAP_APPEAR, 16) * interpolate(frame, [OUTRO_START, OUTRO_START + 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", opacity: o, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, color: COLORS.inkSoft }}>
      <span style={{ fontFamily: FONT.mono }}>Claude Code</span> 新手地圖
    </div>
  );
};

export const EP00Master: React.FC = () => {
  const frame = useCurrentFrame();
  const seg = SEGS.find((s) => frame >= s.start && frame < s.end) ?? null;
  const activeCat = seg?.cat ?? null;
  const popT = seg ? interpolate(frame, [seg.start, seg.start + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const boardAppear = interpolate(frame, [MAP_APPEAR, MAP_APPEAR + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outroT = interpolate(frame, [OUTRO_START, OUTRO_START + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showBoard = frame >= MAP_APPEAR;
  const isOutro = frame >= OUTRO_START;

  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <FlatBg />
      {/* 水晶背景音樂(Gemini 生,旁白密→壓低) */}
      <Bgm src="bgm-crystal.mp3" volume={0.07} />

      <Sequence from={0} durationInFrames={56} layout="none" name="cover">
        <Cover />
      </Sequence>

      <Sequence from={48} durationInFrames={MAP_APPEAR - 48} layout="none" name="hook">
        <HookChips />
      </Sequence>

      <TopTitle />

      {showBoard ? <Board activeCat={activeCat} popT={popT} appear={boardAppear} outroT={outroT} /> : null}
      {seg ? <DescPanel seg={seg} /> : null}
      {isOutro ? <SubscribePill /> : null}

      <Captions />
      <VoiceTrack />
    </AbsoluteFill>
  );
};
