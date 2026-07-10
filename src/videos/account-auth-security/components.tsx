import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp, springV } from "../../shared-skills/anim";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { BRAND } from "./brand";

/** Clamped 0→1 ramp between two frames. */
export const ramp = (frame: number, a: number, b: number): number =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ============================================================= brand glyph === */

/** A small key glyph in a gradient tile — the video's mark. */
export const BrandGlyph: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${COLORS.claude}, ${COLORS.remotion})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: size * 0.56,
    }}
  >
    🔑
  </div>
);

/* ================================================================= shell ===== */

/** Page chrome shared by every scene: backdrop, section badge, brand badge, progress bar. */
export const Shell: React.FC<{
  no?: string;
  titleZh?: string;
  titleEn?: string;
  accent?: string;
  durationInFrames: number;
  showChrome?: boolean;
  showHead?: boolean;
  seed?: string;
  headDelay?: number;
  children: React.ReactNode;
}> = ({
  no,
  titleZh,
  titleEn,
  accent = COLORS.remotion,
  durationInFrames,
  showChrome = true,
  showHead = true,
  seed,
  headDelay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const headIn = ramp(frame, 0, 14);
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, durationInFrames - 1)));
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={accent} seed={seed ?? titleZh ?? "aas"} freeze />
      <AbsoluteFill>{children}</AbsoluteFill>

      {showChrome ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 92,
              right: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: headIn,
              transform: `translateY(${(1 - headIn) * -12}px)`,
            }}
          >
            <span />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
              <BrandGlyph size={24} />
              <span style={{ fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, letterSpacing: -0.3 }}>{BRAND.name}</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: COLORS.bgAlt }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.remotion}, ${COLORS.hi.violet}, ${COLORS.claude})`, boxShadow: `0 0 14px ${accent}88` }} />
          </div>
        </>
      ) : null}

      {showHead && titleZh ? (
        <div style={{ position: "absolute", left: 96, right: 96, top: 116, display: "flex", alignItems: "center", gap: 22, ...appearUp(frame, headDelay, 18, 20) }}>
          {no ? (
            <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: RADIUS.lg, background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 42, boxShadow: SHADOW.glow(accent) }}>{no}</div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontWeight: 800, fontSize: TYPE.h2, letterSpacing: -0.5, color: COLORS.ink, lineHeight: 1.12 }}>{titleZh}</div>
            {titleEn ? <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted, letterSpacing: 0.3 }}>{titleEn}</div> : null}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* =============================================================== key-line ==== */

/** The prominent "land on screen" banner stating a scene's key takeaway. */
export const KeyLine: React.FC<{ text: string; tone?: string; delay?: number; width?: number; size?: number }> = ({
  text,
  tone = COLORS.remotion,
  delay = 0,
  width = 1560,
  size = TYPE.h3,
}) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  return (
    <div style={{ width, margin: "0 auto", padding: "20px 36px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${tone}`, boxShadow: SHADOW.lg, textAlign: "center", ...a }}>
      <span style={{ fontWeight: 800, fontSize: size, lineHeight: 1.34, color: COLORS.ink }}>{text}</span>
    </div>
  );
};

/* =============================================================== text wall === */

export type Block = { text: string; from: number; kind?: "para" | "bullet" | "lead" };

/**
 * The core「逐字全上螢幕」layout: each cue's verbatim line appears as a block,
 * revealing in time with the narration. The currently-spoken block is emphasised
 * (accent rail + surface card); earlier blocks stay, dimmed slightly.
 */
export const TextWall: React.FC<{
  blocks: Block[];
  accent: string;
  top?: number;
  fontSize?: number;
  gap?: number;
  width?: number;
}> = ({ blocks, accent, top = 248, fontSize = TYPE.body, gap = 16, width = 1640 }) => {
  const frame = useCurrentFrame();
  let active = -1;
  blocks.forEach((b, i) => {
    if (frame >= b.from) active = i;
  });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ width, display: "flex", flexDirection: "column", gap }}>
        {blocks.map((b, i) => {
          const o = ramp(frame, b.from, b.from + 16);
          const isActive = i === active;
          const isBullet = b.kind === "bullet";
          const isLead = b.kind === "lead";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: isLead ? "16px 28px" : "14px 26px",
                borderRadius: RADIUS.md,
                background: isActive ? COLORS.surface : "transparent",
                border: isActive ? `1px solid ${accent}55` : "1px solid transparent",
                borderLeft: `5px solid ${isActive ? accent : `${accent}33`}`,
                boxShadow: isActive ? SHADOW.md : "none",
                opacity: isActive ? o : o * 0.62,
                transition: "none",
              }}
            >
              {isBullet ? <span style={{ flexShrink: 0, marginTop: 12, width: 10, height: 10, borderRadius: "50%", background: accent }} /> : null}
              <span
                style={{
                  fontWeight: isLead ? 800 : isActive ? 700 : 600,
                  fontSize: isLead ? fontSize + 4 : fontSize,
                  lineHeight: 1.5,
                  color: isLead ? COLORS.ink : isActive ? COLORS.ink : COLORS.inkSoft,
                }}
              >
                {b.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================================================================ table ====== */

/** Animated comparison table: header row + body rows that reveal one by one. */
export const RoleTable: React.FC<{
  cols: string[];
  rows: string[][];
  accent: string;
  revealAt: number[]; // scene-local frame each body row reveals at
  top?: number;
  width?: number;
  highlightCol0?: boolean;
}> = ({ cols, rows, accent, revealAt, top = 250, width = 1660, highlightCol0 = true }) => {
  const frame = useCurrentFrame();
  const tmpl = `1.1fr ` + cols.slice(1).map(() => "1fr").join(" ");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ width, borderRadius: RADIUS.lg, overflow: "hidden", border: `1px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.lg, background: COLORS.surface }}>
        {/* header */}
        <div style={{ display: "grid", gridTemplateColumns: tmpl, background: accent }}>
          {cols.map((c, i) => (
            <div key={i} style={{ padding: "16px 22px", color: "#fff", fontWeight: 800, fontSize: TYPE.small, borderLeft: i ? "1px solid #ffffff2e" : "none" }}>{c}</div>
          ))}
        </div>
        {/* body */}
        {rows.map((r, ri) => {
          const a = appearUp(frame, revealAt[ri] ?? 0, 14, 14);
          return (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: tmpl, background: ri % 2 ? COLORS.surfaceAlt : COLORS.surface, borderTop: `1px solid ${COLORS.border}`, ...a }}>
              {r.map((cell, ci) => (
                <div
                  key={ci}
                  style={{
                    padding: "16px 22px",
                    fontWeight: ci === 0 && highlightCol0 ? 800 : 600,
                    fontSize: TYPE.small,
                    color: ci === 0 && highlightCol0 ? accent : COLORS.inkSoft,
                    lineHeight: 1.4,
                    borderLeft: ci ? `1px solid ${COLORS.border}` : "none",
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================================================================ cards ====== */

export type RoleCard = { title: string; sub?: string; lines: string[]; accent?: string };

/** Card-variant of a table: one card per row, revealing in sequence. */
export const RoleCards: React.FC<{
  items: RoleCard[];
  accent: string;
  revealAt: number[];
  top?: number;
  width?: number;
}> = ({ items, accent, revealAt, top = 250, width = 1680 }) => {
  const frame = useCurrentFrame();
  const cols = Math.min(items.length, items.length <= 2 ? 2 : items.length === 4 ? 2 : 3);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ width, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 20 }}>
        {items.map((it, i) => {
          const a = appearUp(frame, revealAt[i] ?? 0, 16, 18);
          const c = it.accent ?? accent;
          return (
            <div key={i} style={{ ...a, padding: "22px 26px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${c}44`, borderTop: `5px solid ${c}`, boxShadow: SHADOW.md, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 800, fontSize: TYPE.h3, color: c, lineHeight: 1.1 }}>{it.title}</span>
                {it.sub ? <span style={{ fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>{it.sub}</span> : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {it.lines.map((ln, li) => (
                  <span key={li} style={{ fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft, lineHeight: 1.4 }}>{ln}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================== compare ====== */

export type CompareSide = { badge: string; tone: string; lines: string[] };

/** Two side-by-side columns (bad vs good / A vs B). */
export const CompareCols: React.FC<{
  left: CompareSide;
  right: CompareSide;
  leftAt: number;
  rightAt: number;
  top?: number;
  width?: number;
}> = ({ left, right, leftAt, rightAt, top = 256, width = 1640 }) => {
  const frame = useCurrentFrame();
  const Side: React.FC<{ s: CompareSide; at: number }> = ({ s, at }) => {
    const a = appearUp(frame, at, 18, 22);
    return (
      <div style={{ ...a, flex: 1, padding: "26px 30px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${s.tone}`, boxShadow: SHADOW.lg, display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ alignSelf: "flex-start", padding: "8px 20px", borderRadius: RADIUS.pill, background: s.tone, color: "#fff", fontWeight: 800, fontSize: TYPE.body }}>{s.badge}</span>
        {s.lines.map((ln, i) => (
          <span key={i} style={{ fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, lineHeight: 1.46 }}>{ln}</span>
        ))}
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ width, display: "flex", gap: 24, alignItems: "stretch" }}>
        <Side s={left} at={leftAt} />
        <Side s={right} at={rightAt} />
      </div>
    </div>
  );
};

/* ============================================================ numbered flow == */

/** Vertical numbered steps (for the OAuth flow). */
export const NumberedFlow: React.FC<{
  steps: string[];
  accent: string;
  revealAt: number[];
  top?: number;
  width?: number;
}> = ({ steps, accent, revealAt, top = 250, width = 1560 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ width, display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map((s, i) => {
          const a = appearUp(frame, revealAt[i] ?? 0, 16, 16);
          return (
            <div key={i} style={{ ...a, display: "flex", alignItems: "flex-start", gap: 20, padding: "18px 28px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
              <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: `${accent}16`, border: `2px solid ${accent}`, color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: TYPE.h3 }}>{i + 1}</div>
              <span style={{ fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, lineHeight: 1.46, paddingTop: 6 }}>{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================== metaphor art = */

export type ArtKind = "key" | "guard" | "hotel" | "dog" | "cards" | "swap";

/** Simple on-brand SVG illustration for a metaphor, drawn with theme colours. */
export const MetaphorArt: React.FC<{ kind: ArtKind; accent: string; size?: number }> = ({ kind, accent, size = 300 }) => {
  const s = size;
  if (kind === "key") {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200">
        <circle cx="70" cy="70" r="42" fill="none" stroke={accent} strokeWidth="16" />
        <circle cx="70" cy="70" r="16" fill={COLORS.surface} stroke={accent} strokeWidth="10" />
        <rect x="96" y="92" width="86" height="16" rx="6" fill={accent} transform="rotate(45 96 92)" />
        <rect x="150" y="138" width="22" height="16" rx="4" fill={accent} transform="rotate(45 150 138)" />
        <rect x="132" y="120" width="22" height="16" rx="4" fill={accent} transform="rotate(45 132 120)" />
      </svg>
    );
  }
  if (kind === "guard") {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200">
        <path d="M100 22 L165 48 V104 C165 146 134 172 100 184 C66 172 35 146 35 104 V48 Z" fill={`${accent}1c`} stroke={accent} strokeWidth="10" />
        <path d="M72 100 l20 20 l40 -46" fill="none" stroke={accent} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "hotel") {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200">
        <rect x="42" y="40" width="116" height="140" rx="10" fill={COLORS.surface} stroke={accent} strokeWidth="10" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect key={`${r}-${c}`} x={60 + c * 30} y={58 + r * 30} width="20" height="20" rx="4" fill={`${accent}33`} stroke={accent} strokeWidth="4" />
          )),
        )}
        <rect x="86" y="150" width="28" height="30" rx="4" fill={accent} />
      </svg>
    );
  }
  if (kind === "dog") {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200">
        <ellipse cx="100" cy="120" rx="58" ry="42" fill={`${accent}22`} stroke={accent} strokeWidth="9" />
        <circle cx="100" cy="74" r="34" fill={COLORS.surface} stroke={accent} strokeWidth="9" />
        <path d="M70 50 q-14 -6 -16 16 q14 6 18 -2 Z" fill={accent} />
        <path d="M130 50 q14 -6 16 16 q-14 6 -18 -2 Z" fill={accent} />
        <circle cx="90" cy="72" r="6" fill={accent} />
        <circle cx="110" cy="72" r="6" fill={accent} />
        <circle cx="100" cy="88" r="7" fill={accent} />
      </svg>
    );
  }
  if (kind === "cards") {
    return (
      <svg width={s} height={s} viewBox="0 0 200 200">
        <rect x="36" y="64" width="100" height="64" rx="10" fill={`${accent}22`} stroke={accent} strokeWidth="8" transform="rotate(-8 86 96)" />
        <rect x="68" y="78" width="100" height="64" rx="10" fill={COLORS.surface} stroke={accent} strokeWidth="8" transform="rotate(8 118 110)" />
        <circle cx="92" cy="104" r="10" fill={accent} />
        <rect x="110" y="98" width="44" height="8" rx="4" fill={accent} />
        <rect x="110" y="114" width="30" height="8" rx="4" fill={`${accent}66`} />
      </svg>
    );
  }
  // swap — two arrows in a circle (role互換)
  return (
    <svg width={s} height={s} viewBox="0 0 200 200">
      <path d="M50 78 a50 50 0 0 1 92 -8" fill="none" stroke={accent} strokeWidth="11" strokeLinecap="round" />
      <path d="M142 60 l4 18 l-20 2 Z" fill={accent} />
      <path d="M150 122 a50 50 0 0 1 -92 8" fill="none" stroke={accent} strokeWidth="11" strokeLinecap="round" />
      <path d="M58 140 l-4 -18 l20 -2 Z" fill={accent} />
    </svg>
  );
};

/** A metaphor scene body: illustration on the left, text blocks on the right. */
export const MetaphorPanel: React.FC<{
  kind: ArtKind;
  accent: string;
  blocks: Block[];
}> = ({ kind, accent, blocks }) => {
  const frame = useCurrentFrame();
  let active = -1;
  blocks.forEach((b, i) => {
    if (frame >= b.from) active = i;
  });
  const art = appearUp(frame, 6, 20, 24);
  return (
    <div style={{ position: "absolute", left: 96, right: 96, top: 256, display: "flex", gap: 48, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, width: 360, height: 360, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${accent}33`, boxShadow: SHADOW.lg, display: "flex", alignItems: "center", justifyContent: "center", ...art }}>
        <MetaphorArt kind={kind} accent={accent} size={300} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
        {blocks.map((b, i) => {
          const o = ramp(frame, b.from, b.from + 16);
          const isActive = i === active;
          return (
            <div key={i} style={{ padding: "14px 26px", borderRadius: RADIUS.md, background: isActive ? COLORS.surface : "transparent", borderLeft: `5px solid ${isActive ? accent : `${accent}33`}`, boxShadow: isActive ? SHADOW.md : "none", opacity: isActive ? o : o * 0.64 }}>
              <span style={{ fontWeight: isActive ? 700 : 600, fontSize: TYPE.body, lineHeight: 1.48, color: isActive ? COLORS.ink : COLORS.inkSoft }}>{b.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =============================================================== role-swap === */

/** The「角色互換」hero diagram for §6: 主人 / 旅館 / 訪客 with swappable hotel↔guest. */
export const RoleSwap: React.FC<{
  hotel: string;
  guest: string;
  action: string;
  accent: string;
  delay?: number;
}> = ({ hotel, guest, action, accent, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const owner = springV(frame, fps, { delay });
  const hotelA = appearUp(frame, delay + 10, 16, 20);
  const guestA = appearUp(frame, delay + 18, 16, 20);
  const node = (label: string, role: string, color: string, a: { opacity: number; transform: string }) => (
    <div style={{ ...a, width: 300, padding: "16px 22px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${color}`, boxShadow: SHADOW.lg, textAlign: "center" }}>
      <div style={{ fontWeight: 700, fontSize: TYPE.tiny, color }}>{role}</div>
      <div style={{ marginTop: 4, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{label}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {node("你（人）", "🧑 主人 · 永遠不變", accent, { opacity: owner, transform: `translateY(${(1 - owner) * 20}px)` })}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {node(guest, "🐶 訪客 · 想進去拿東西的程式", COLORS.claude, guestA)}
        <div style={{ ...appearUp(frame, delay + 26, 14, 12), display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 36, color: accent }}>→</span>
          <span style={{ fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.muted, maxWidth: 180, textAlign: "center" }}>{action}</span>
        </div>
        {node(hotel, "🏨 旅館 · 被敲門的那一家", accent, hotelA)}
      </div>
    </div>
  );
};
