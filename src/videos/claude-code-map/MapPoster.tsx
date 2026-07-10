import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW } from "../../shared-skills/theme";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { categories, nodes, edges, categoryById, type MapNode } from "./tree";

/**
 * Claude Code 新手知識地圖 — 靜態海報 (Still).
 * 讀 tree.ts:7 欄(每大類一色)、節點依序號 1..30 排列、跨分支關係以曲線+關係詞疊加。
 * 渲染:  npx remotion still ClaudeCodeMapPoster out/claude-code-map.png
 */

const W = 2200;
const H = 1400;

const COL_PAD = 56;
const COL_TOP = 248; // 欄內第一張卡的 y
const HEADER_Y = 196; // 大類標籤 y
const CARD_W = (W - COL_PAD * 2) / categories.length - 18;
const CARD_H = 132;
const ROW_H = 170;

type Placed = MapNode & { x: number; y: number; cx: number; cy: number };

function layout(): Placed[] {
  return categories.flatMap((cat) => {
    const colIndex = categories.findIndex((c) => c.id === cat.id);
    const colNodes = nodes
      .filter((n) => n.category === cat.id)
      .sort((a, b) => a.num - b.num);
    const x =
      COL_PAD + colIndex * ((W - COL_PAD * 2) / categories.length) + 9;
    return colNodes.map((n, i) => {
      const y = COL_TOP + i * ROW_H;
      return { ...n, x, y, cx: x + CARD_W / 2, cy: y + CARD_H / 2 };
    });
  });
}

export const ClaudeCodeMapPoster: React.FC = () => {
  const placed = layout();
  const pos = (id: string) => placed.find((p) => p.id === id)!;

  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop seed="cc-map" freeze />

      {/* 標題 */}
      <div style={{ position: "absolute", top: 52, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 78, letterSpacing: -1, color: COLORS.ink }}>
          <span style={{ fontFamily: FONT.mono }}>Claude Code</span> 新手知識地圖
        </div>
        <div style={{ marginTop: 8, fontWeight: 700, fontSize: 30, color: COLORS.muted }}>
          30 個名詞 · 跟著號碼 1 → 30 學 · 定義全部來自 Anthropic 官方文件
        </div>
      </div>

      {/* 欄內學習順序連接線(同色細線,畫在卡片底下) */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {categories.map((cat) => {
          const colNodes = placed
            .filter((p) => p.category === cat.id)
            .sort((a, b) => a.num - b.num);
          return colNodes.slice(0, -1).map((p, i) => {
            const next = colNodes[i + 1];
            return (
              <line
                key={`spine-${p.id}`}
                x1={p.cx}
                y1={p.y + CARD_H}
                x2={next.cx}
                y2={next.y}
                stroke={cat.color}
                strokeWidth={3}
                strokeOpacity={0.35}
              />
            );
          });
        })}
      </svg>

      {/* 大類標籤 */}
      {categories.map((cat) => {
        const colIndex = categories.findIndex((c) => c.id === cat.id);
        const x =
          COL_PAD + colIndex * ((W - COL_PAD * 2) / categories.length) + 9;
        return (
          <div
            key={cat.id}
            style={{
              position: "absolute",
              left: x,
              top: HEADER_Y,
              width: CARD_W,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: RADIUS.md,
              background: cat.color,
              color: "#fff",
              boxShadow: SHADOW.md,
            }}
          >
            <span style={{ fontWeight: 800, fontSize: 22 }}>{cat.id}</span>
            <span style={{ fontWeight: 800, fontSize: 19, lineHeight: 1.05 }}>{cat.label}</span>
          </div>
        );
      })}

      {/* 節點卡片 */}
      {placed.map((n) => {
        const color = categoryById(n.category).color;
        return (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: CARD_W,
              height: CARD_H,
              borderRadius: RADIUS.md,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderLeft: `6px solid ${color}`,
              boxShadow: SHADOW.md,
              padding: "12px 14px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: color,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 17,
                  flexShrink: 0,
                }}
              >
                {n.num}
              </span>
              <span style={{ fontWeight: 800, fontSize: 20, lineHeight: 1.05, color: COLORS.ink }}>
                {n.title}
              </span>
            </div>
            <span style={{ fontFamily: FONT.mono, fontSize: 14, color: COLORS.muted }}>
              {n.titleEn}
            </span>
          </div>
        );
      })}

      {/* 跨分支關係曲線(畫在卡片上方,才看得見「互相作用」) */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {edges.map((e, i) => {
          const a = pos(e.from);
          const b = pos(e.to);
          const color = categoryById(a.category).color;
          const mx = (a.cx + b.cx) / 2;
          const my = (a.cy + b.cy) / 2 - 64;
          return (
            <path
              key={`edge-${i}`}
              d={`M ${a.cx} ${a.cy} Q ${mx} ${my} ${b.cx} ${b.cy}`}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              strokeOpacity={0.55}
              strokeDasharray="2 8"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* 關係詞標籤(白底膠囊,放在曲線中點) */}
      {edges.map((e, i) => {
        const a = pos(e.from);
        const b = pos(e.to);
        const mx = (a.cx + b.cx) / 2;
        const my = (a.cy + b.cy) / 2 - 40;
        return (
          <div
            key={`lbl-${i}`}
            style={{
              position: "absolute",
              left: mx,
              top: my,
              transform: "translate(-50%, -50%)",
              padding: "3px 10px",
              borderRadius: RADIUS.pill,
              background: "rgba(255,255,255,0.95)",
              border: `1px solid ${COLORS.borderStrong}`,
              fontSize: 15,
              fontWeight: 700,
              color: COLORS.inkSoft,
              whiteSpace: "nowrap",
              boxShadow: SHADOW.sm,
            }}
          >
            {e.label}
          </div>
        );
      })}

      {/* 圖例 / 來源 */}
      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 18,
          fontWeight: 700,
          color: COLORS.faint,
        }}
      >
        實線=學習順序 · 虛線=互相作用 · 來源:code.claude.com/docs · AI Wisdom · @aiwisdomcc
      </div>
    </AbsoluteFill>
  );
};
