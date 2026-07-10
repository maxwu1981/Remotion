import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS } from "../../shared-skills/theme";
import { categories, edges, categoryById, type CategoryId } from "./tree";
import { W, H, HEADER_Y, CARD_W, CARD_H, placed, posOf, colX, type Placed } from "./mapLayout";

/**
 * 動畫版知識地圖(尺寸自適應,直式/橫式皆可)。提供 spotlight:
 * 鏡頭推進到「要講解的那一張(節點/大類/關係線)」+ 背景變暗 + 該目標彈出發光,
 * 撐約 2 秒再回復正常。節點與關係線共用同一套效果。
 *
 * 抗 h264 閃爍:卡片用清晰實線邊框、去柔和陰影(同 EP00 FlatBg 策略)。
 * 用 beats 驅動:每個 beat = { start, inF, hold, outF, focus }(local frame)。
 */

export type Focus =
  | { type: "all" }
  | { type: "node"; id: string }
  | { type: "category"; id: CategoryId }
  | { type: "edge"; index: number };

export type Beat = { start: number; inF: number; hold: number; outF: number; focus: Focus };

function focusPoint(f: Focus): { x: number; y: number } {
  if (f.type === "node") {
    const p = posOf(f.id);
    return { x: p.cx, y: p.cy };
  }
  if (f.type === "category") {
    const ns = placed.filter((p) => p.category === f.id);
    return { x: colX(f.id) + CARD_W / 2, y: ns.reduce((s, p) => s + p.cy, 0) / ns.length };
  }
  if (f.type === "edge") {
    const a = posOf(edges[f.index].from);
    const b = posOf(edges[f.index].to);
    return { x: (a.cx + b.cx) / 2, y: (a.cy + b.cy) / 2 };
  }
  return { x: W / 2, y: H / 2 };
}

const focusColorOf = (f: Focus): string => {
  if (f.type === "node") return categoryById(posOf(f.id).category).color;
  if (f.type === "category") return categoryById(f.id).color;
  if (f.type === "edge") return categoryById(posOf(edges[f.index].from).category).color;
  return COLORS.remotion;
};

function activeBeat(frame: number, beats: Beat[]): { focus: Focus; i: number } {
  for (const b of beats) {
    const total = b.inF + b.hold + b.outF;
    if (frame >= b.start && frame < b.start + total) {
      const local = frame - b.start;
      let i: number;
      if (local < b.inF) i = interpolate(local, [0, b.inF], [0, 1]);
      else if (local < b.inF + b.hold) i = 1;
      else i = interpolate(local, [b.inF + b.hold, total], [1, 0]);
      return { focus: b.focus, i };
    }
  }
  return { focus: { type: "all" }, i: 0 };
}

export const MapStage: React.FC<{ beats?: Beat[] }> = ({ beats = [] }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const appear = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 取景(依畫布大小自適應):全圖塞進上方區域,留頂部標題、底部字幕
  const baseScale = Math.min((width * 0.94) / W, (height * 0.62) / H);
  const baseTx = (width - W * baseScale) / 2;
  const baseTy = height * 0.15;
  const screenCx = width / 2;
  const screenCy = height * 0.52;

  const { focus, i } = activeBeat(frame, beats);
  const isAll = focus.type === "all";
  const fp = focusPoint(focus);
  const fScale =
    focus.type === "node" ? 1.05 : focus.type === "edge" ? 0.95 : focus.type === "category" ? 0.6 : baseScale * 1.06;
  const scale = interpolate(i, [0, 1], [baseScale, fScale]);

  const baseScreen = { x: fp.x * baseScale + baseTx, y: fp.y * baseScale + baseTy };
  const target = isAll ? baseScreen : { x: screenCx, y: screenCy };
  const sx = interpolate(i, [0, 1], [baseScreen.x, target.x]);
  const sy = interpolate(i, [0, 1], [baseScreen.y, target.y]);
  const tx = sx - fp.x * scale;
  const ty = sy - fp.y * scale;

  const dim = (isAll ? 0 : 0.66) * i;
  const rIn = interpolate(i, [0, 1], [520, 200]);
  const rOut = interpolate(i, [0, 1], [900, 480]);
  const fColor = focusColorOf(focus);

  const specific = !isAll && i > 0.01;
  const dimNode = (n: Placed): number => {
    if (!specific) return 1;
    const hit =
      (focus.type === "node" && n.id === focus.id) || (focus.type === "category" && n.category === focus.id);
    return hit ? 1 : 1 - 0.6 * i;
  };
  const focusedNodeId = focus.type === "node" ? focus.id : null;

  return (
    <AbsoluteFill style={{ opacity: appear }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        }}
      >
        {/* 欄內學習順序連接線 */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {categories.map((cat) => {
            const cn = placed.filter((p) => p.category === cat.id).sort((a, b) => a.num - b.num);
            return cn.slice(0, -1).map((p, idx) => {
              const next = cn[idx + 1];
              return (
                <line key={`sp-${p.id}`} x1={p.cx} y1={p.y + CARD_H} x2={next.cx} y2={next.y} stroke={cat.color} strokeWidth={3} strokeOpacity={0.35 * (specific ? 1 - 0.6 * i : 1)} />
              );
            });
          })}
        </svg>

        {/* 大類標籤 */}
        {categories.map((cat) => {
          const fade = specific && !(focus.type === "category" && focus.id === cat.id) ? 1 - 0.6 * i : 1;
          return (
            <div key={cat.id} style={{ position: "absolute", left: colX(cat.id), top: HEADER_Y, width: CARD_W, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: RADIUS.md, background: cat.color, color: "#fff", opacity: fade }}>
              <span style={{ fontWeight: 800, fontSize: 22 }}>{cat.id}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 19, lineHeight: 1.05 }}>{cat.label}</span>
            </div>
          );
        })}

        {/* 跨分支關係曲線 */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {edges.map((e, idx) => {
            const a = posOf(e.from);
            const b = posOf(e.to);
            const color = categoryById(a.category).color;
            const mx = (a.cx + b.cx) / 2;
            const my = (a.cy + b.cy) / 2 - 64;
            const isFocusEdge = focus.type === "edge" && focus.index === idx;
            const op = specific ? (isFocusEdge ? 0.95 : 0.4 * (1 - 0.7 * i)) : 0.4;
            return (
              <path key={`e-${idx}`} d={`M ${a.cx} ${a.cy} Q ${mx} ${my} ${b.cx} ${b.cy}`} fill="none" stroke={color} strokeWidth={isFocusEdge ? 2.5 + 4 * i : 2.5} strokeOpacity={op} strokeDasharray="2 8" strokeLinecap="round" />
            );
          })}
        </svg>

        {/* 關係詞標籤 */}
        {edges.map((e, idx) => {
          const a = posOf(e.from);
          const b = posOf(e.to);
          const mx = (a.cx + b.cx) / 2;
          const my = (a.cy + b.cy) / 2 - 40;
          const isFocusEdge = focus.type === "edge" && focus.index === idx;
          const op = specific ? (isFocusEdge ? 1 : 1 - 0.85 * i) : 1;
          return (
            <div key={`el-${idx}`} style={{ position: "absolute", left: mx, top: my, transform: `translate(-50%, -50%) scale(${isFocusEdge ? 1 + 0.25 * i : 1})`, padding: "3px 10px", borderRadius: RADIUS.pill, background: "#FFFFFF", border: `1.5px solid ${isFocusEdge ? fColor : COLORS.borderStrong}`, fontFamily: FONT.uiCjk, fontSize: 15, fontWeight: 700, color: COLORS.inkSoft, whiteSpace: "nowrap", opacity: op }}>
              {e.label}
            </div>
          );
        })}

        {/* 節點卡片(清晰邊框、無柔陰影) */}
        {placed.map((n) => {
          const color = categoryById(n.category).color;
          const isFocusNode = n.id === focusedNodeId;
          const cardScale = isFocusNode ? 1 + 0.1 * i : 1;
          return (
            <div key={n.id} style={{ position: "absolute", left: n.x, top: n.y, width: CARD_W, height: CARD_H, transformOrigin: "center", transform: `scale(${cardScale})`, borderRadius: RADIUS.md, background: COLORS.surface, border: `${isFocusNode ? 2 : 1.5}px solid ${isFocusNode ? color : COLORS.border}`, borderLeft: `6px solid ${color}`, boxShadow: "none", padding: "12px 14px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 4, overflow: "hidden", opacity: dimNode(n) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 17, flexShrink: 0 }}>{n.num}</span>
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 20, lineHeight: 1.05, color: COLORS.ink }}>{n.title}</span>
              </div>
              <span style={{ fontFamily: FONT.mono, fontSize: 14, color: COLORS.muted }}>{n.titleEn}</span>
            </div>
          );
        })}
      </div>

      {/* 變暗遮罩(中心留洞) */}
      {dim > 0 ? (
        <AbsoluteFill style={{ background: `radial-gradient(circle at ${sx}px ${sy}px, rgba(8,10,20,0) ${rIn}px, rgba(8,10,20,0.84) ${rOut}px)`, opacity: dim / 0.66 }} />
      ) : null}

      {/* 焦點環(實線,不用柔光以免靜態閃爍) */}
      {dim > 0 ? (
        <div style={{ position: "absolute", left: sx, top: sy, width: rIn * 2, height: rIn * 2, transform: "translate(-50%, -50%)", borderRadius: "50%", border: `4px solid ${fColor}`, opacity: 0.9 * i }} />
      ) : null}
    </AbsoluteFill>
  );
};
