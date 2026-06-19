import React from "react";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { MOTIF } from "./data";

/**
 * The recurring physical-object vocabulary. Reuse the same component for the same
 * idea every time so meaning compounds:
 *   Phone        📱  = 螢幕／遙控器
 *   Container    ☁️/🖥 = 臨時雲端電腦＝會被清空的「工作桌」
 *   Warehouse    🏛️  = GitHub 倉庫＝永久存放
 *   ClaudeMdNote 📝  = CLAUDE.md 記事本（記憶檔）
 *   SandboxFence 🔒  = 容器內「有圍欄的工作區」（安全邊界）
 */

/* ============================================================ device token === */

/** A circular emoji device/idea token with a label — 📱手機 / 🌐網頁 / 🖥桌面. */
export const DeviceToken: React.FC<{
  emoji: string;
  label?: string;
  size?: number;
  color?: string;
  active?: boolean;
}> = ({ emoji, label, size = 96, color = MOTIF.phone, active }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.46,
        background: COLORS.surface,
        border: `2px solid ${color}${active ? "" : "55"}`,
        boxShadow: active ? SHADOW.glow(color) : SHADOW.md,
      }}
    >
      <span>{emoji}</span>
    </div>
    {label ? (
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>{label}</span>
    ) : null}
  </div>
);

/* ================================================================== cloud ==== */

/** A soft cloud silhouette — the "雲端" marker. */
export const Cloud: React.FC<{ w?: number; color?: string; glow?: number }> = ({
  w = 120,
  color = MOTIF.cloud,
  glow = 0,
}) => (
  <svg width={w} height={w * 0.66} viewBox="0 0 120 80" style={{ overflow: "visible" }}>
    <path
      d="M30 64h56a18 18 0 0 0 2-35.8A26 26 0 0 0 36.5 34 16 16 0 0 0 30 64z"
      fill={color}
      opacity={0.16}
      stroke={color}
      strokeWidth={2.4}
      style={glow ? { filter: `drop-shadow(0 0 ${8 + glow * 22}px ${color})` } : undefined}
    />
  </svg>
);

/* ================================================================== phone ==== */

/** A phone — the "螢幕／遙控器". Screen holds an emoji or any node. */
export const Phone: React.FC<{
  h?: number;
  label?: string;
  tint?: string;
  screen?: React.ReactNode;
  live?: boolean;
}> = ({ h = 360, label, tint = MOTIF.phone, screen }) => {
  const w = h * 0.49;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: h * 0.12,
          background: COLORS.surface,
          border: `4px solid ${COLORS.borderStrong}`,
          boxShadow: SHADOW.lg,
          padding: w * 0.05,
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* notch */}
        <div
          style={{
            position: "absolute",
            top: w * 0.07,
            left: "50%",
            transform: "translateX(-50%)",
            width: w * 0.34,
            height: w * 0.05,
            borderRadius: 999,
            background: COLORS.borderStrong,
            zIndex: 2,
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: h * 0.085,
            background: `linear-gradient(160deg, ${tint}1c, ${tint}0a)`,
            border: `1px solid ${tint}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: w * 0.4,
            overflow: "hidden",
          }}
        >
          {screen}
        </div>
      </div>
      {label ? (
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{label}</span>
      ) : null}
    </div>
  );
};

/* ============================================================== container ==== */

/**
 * The container = a borrowed, wipe-on-finish cloud computer drawn as a work desk
 * panel (header = the machine; body = the desk surface). `wiped` shows the
 * cleared / recycled state.
 */
export const Container: React.FC<{
  w?: number;
  h?: number;
  label?: string;
  sub?: string;
  wiped?: boolean;
  dim?: boolean;
  children?: React.ReactNode;
}> = ({ w = 460, h = 320, label = "容器 Container", sub = "臨時工作桌 · 用完清空", wiped = false, dim = false, children }) => {
  const color = MOTIF.cloud;
  return (
    <div style={{ width: w, opacity: dim ? 0.4 : 1 }}>
      <div
        style={{
          width: "100%",
          height: h,
          borderRadius: RADIUS.lg,
          background: COLORS.surface,
          border: `2px solid ${color}55`,
          boxShadow: SHADOW.lg,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* machine header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 20px",
            background: `linear-gradient(180deg, ${color}1c, ${color}0c)`,
            borderBottom: `1px solid ${color}33`,
          }}
        >
          <Cloud w={42} color={color} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{label}</div>
            <div style={{ fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: TYPE.micro, color: COLORS.muted }}>{sub}</div>
          </div>
          <span style={{ fontSize: TYPE.h3 }}>{wiped ? "🗑" : "♻"}</span>
        </div>

        {/* desk surface */}
        <div
          style={{
            flex: 1,
            position: "relative",
            background: wiped
              ? `repeating-linear-gradient(45deg, ${COLORS.bgAlt}, ${COLORS.bgAlt} 12px, ${COLORS.surface} 12px, ${COLORS.surface} 24px)`
              : COLORS.surfaceAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
          }}
        >
          {wiped ? (
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.faint }}>桌子被清空</span>
          ) : (
            children
          )}
          {/* desk lip */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: `linear-gradient(180deg, ${color}22, ${color}11)`, borderTop: `1px solid ${color}33` }} />
        </div>
      </div>
    </div>
  );
};

/* ============================================================== warehouse ==== */

/** GitHub 倉庫 = a permanent vault/warehouse. `ok` adds a green ✔ badge. */
export const Warehouse: React.FC<{
  w?: number;
  label?: string;
  sub?: string;
  ok?: boolean;
}> = ({ w = 360, label = "GitHub 倉庫", sub = "永久存放 · 永遠在", ok = true }) => {
  const g = MOTIF.warehouse;
  const h = w * 0.82;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <svg width={w} height={h} viewBox="0 0 360 296" style={{ overflow: "visible" }}>
        {/* ground shadow */}
        <ellipse cx="180" cy="286" rx="150" ry="12" fill="rgba(20,20,43,0.12)" />
        {/* roof */}
        <path d="M24 96 L180 22 L336 96 Z" fill={g} opacity={0.18} stroke={g} strokeWidth="3" strokeLinejoin="round" />
        {/* body */}
        <rect x="44" y="96" width="272" height="180" rx="8" fill={COLORS.surface} stroke={g} strokeWidth="3" />
        {/* columns */}
        {[78, 134, 190, 246].map((x) => (
          <rect key={x} x={x} y="120" width="24" height="132" rx="3" fill={`${g}14`} stroke={`${g}55`} strokeWidth="2" />
        ))}
        {/* vault door */}
        <rect x="150" y="196" width="60" height="80" rx="4" fill={`${g}1c`} stroke={g} strokeWidth="2.5" />
        <circle cx="180" cy="226" r="13" fill="none" stroke={g} strokeWidth="2.5" />
        <line x1="180" y1="226" x2="189" y2="235" stroke={g} strokeWidth="2.5" strokeLinecap="round" />
        {/* eave label band */}
        <rect x="44" y="96" width="272" height="22" fill={`${g}22`} />
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {ok ? (
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: g, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>✔</span>
        ) : null}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{label}</div>
          <div style={{ fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: TYPE.micro, color: COLORS.muted }}>{sub}</div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================ CLAUDE.md note == */

/** The memory file as a notepad/document. `tint` colours its tab. */
export const ClaudeMdNote: React.FC<{
  title?: string;
  tint?: string;
  w?: number;
  lines?: number;
  badge?: React.ReactNode;
}> = ({ title = "CLAUDE.md", tint = MOTIF.note, w = 240, lines = 3, badge }) => {
  const h = w * 1.16;
  return (
    <div style={{ position: "relative", width: w }}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: RADIUS.md,
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          boxShadow: SHADOW.md,
          overflow: "hidden",
        }}
      >
        {/* colored tab */}
        <div style={{ height: 10, background: tint }} />
        <div style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>📄</span>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>{title}</span>
          </div>
          {new Array(lines).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                height: 8,
                borderRadius: 4,
                background: COLORS.bgAlt,
                marginBottom: 11,
                width: `${[92, 78, 86, 70, 82][i % 5]}%`,
              }}
            />
          ))}
        </div>
        {/* folded corner */}
        <div style={{ position: "absolute", right: 0, top: 10, width: 0, height: 0, borderTop: `26px solid ${COLORS.bgAlt}`, borderLeft: "26px solid transparent" }} />
      </div>
      {badge ? <div style={{ position: "absolute", left: "50%", bottom: -16, transform: "translateX(-50%)" }}>{badge}</div> : null}
    </div>
  );
};

/* ============================================================ sandbox fence === */

/** A fenced safe work area inside the container — picket-fence top + content. */
export const SandboxFence: React.FC<{
  w?: number;
  h?: number;
  label?: string;
  sub?: string;
  children?: React.ReactNode;
}> = ({ w = 520, h = 230, label = "沙盒 sandbox", sub = "桌上一個有圍欄的工作區", children }) => {
  const f = MOTIF.fence;
  const pickets = Math.floor(w / 34);
  return (
    <div style={{ width: w }}>
      {/* picket fence top */}
      <svg width={w} height={26} viewBox={`0 0 ${w} 26`} style={{ display: "block" }}>
        <line x1="0" y1="20" x2={w} y2="20" stroke={f} strokeWidth="3" />
        {new Array(pickets).fill(0).map((_, i) => {
          const x = 8 + i * ((w - 16) / (pickets - 1));
          return <path key={i} d={`M ${x - 5} 24 L ${x - 5} 8 L ${x} 2 L ${x + 5} 8 L ${x + 5} 24`} fill={`${f}22`} stroke={f} strokeWidth="2.4" strokeLinejoin="round" />;
        })}
      </svg>
      <div
        style={{
          width: "100%",
          minHeight: h,
          borderRadius: `0 0 ${RADIUS.lg}px ${RADIUS.lg}px`,
          background: `${f}0c`,
          border: `2px dashed ${f}`,
          borderTop: "none",
          boxSizing: "border-box",
          padding: 22,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
        {children}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{label}</div>
          <div style={{ fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: TYPE.micro, color: COLORS.muted }}>{sub}</div>
        </div>
      </div>
    </div>
  );
};

/* ================================================================ terminal ==== */

/** A tiny dark terminal line — bash $ prompt with a command. */
export const MiniTerminal: React.FC<{ command: string; w?: number; caretOn?: boolean }> = ({ command, w = 360, caretOn = true }) => (
  <div
    style={{
      width: w,
      borderRadius: RADIUS.sm,
      background: COLORS.term.bg,
      boxShadow: SHADOW.md,
      overflow: "hidden",
      fontFamily: FONT.mono,
    }}
  >
    <div style={{ display: "flex", gap: 6, padding: "8px 12px", background: COLORS.term.bgTop }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
      ))}
    </div>
    <div style={{ padding: "14px 16px", fontSize: TYPE.small, color: COLORS.term.text, whiteSpace: "nowrap" }}>
      <span style={{ color: COLORS.term.prompt }}>$ </span>
      {command}
      <span style={{ opacity: caretOn ? 1 : 0, color: COLORS.term.green }}>▋</span>
    </div>
  </div>
);
