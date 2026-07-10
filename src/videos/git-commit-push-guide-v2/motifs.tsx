import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { MOTIF } from "./data";

/**
 * The recurring physical-object vocabulary + synthesized UI mockups. Reuse the
 * same component for the same idea every time so meaning compounds:
 *   📄 ChangedFile  = 改檔案
 *   💾 CommitBox    = commit＝本地存檔（還原點）
 *   ⬆  PushArrow    = push＝上傳雲端
 *   🖥 Laptop       = 你的電腦（本地）
 *   ☁️ GitHubCloud  = 雲端（遠端）
 *   💬 ChatBubble   = 用白話告訴 Claude
 *   ✅ AllowButton  = 允許 / Allow（授權）
 * Mockups (themeable, not screenshots): Terminal · GuiApp · SlashMenu ·
 * PermissionDialog · Toast.
 */

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

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

/* ============================================================ changed file ==== */

/** 📄 a document with an ✏️ "edited" badge — the 改檔案 motif. */
export const ChangedFile: React.FC<{
  name?: string;
  w?: number;
  label?: string;
  edited?: boolean;
  tint?: string;
}> = ({ name = "login.tsx", w = 180, label, edited = true, tint = MOTIF.file }) => {
  const h = w * 1.18;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: w }}>
        <div
          style={{
            width: w,
            height: h,
            borderRadius: RADIUS.md,
            background: COLORS.surface,
            border: `2px solid ${tint}66`,
            boxShadow: SHADOW.md,
            overflow: "hidden",
          }}
        >
          <div style={{ height: 9, background: tint }} />
          <div style={{ padding: "16px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>📄</span>
              <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink }}>{name}</span>
            </div>
            {[92, 74, 84, 60].map((wd, i) => (
              <div
                key={i}
                style={{
                  height: 7,
                  borderRadius: 4,
                  marginBottom: 10,
                  width: `${wd}%`,
                  background: edited && i === 1 ? `${tint}` : COLORS.bgAlt,
                  opacity: edited && i === 1 ? 0.65 : 1,
                }}
              />
            ))}
          </div>
        </div>
        {edited ? (
          <div
            style={{
              position: "absolute",
              right: -12,
              top: -12,
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: tint,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: SHADOW.md,
            }}
          >
            ✏️
          </div>
        ) : null}
      </div>
      {label ? (
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{label}</span>
      ) : null}
    </div>
  );
};

/* ============================================================== commit box ==== */

/** 💾 a save-point box with a one-line note + a 還原點 flag — the commit motif. */
export const CommitBox: React.FC<{
  note?: string;
  w?: number;
  label?: string;
  flag?: boolean;
  dim?: boolean;
}> = ({ note, w = 230, label, flag = true, dim = false }) => {
  const c = MOTIF.commit;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: dim ? 0.5 : 1 }}>
      <div style={{ position: "relative", width: w }}>
        <div
          style={{
            width: w,
            borderRadius: RADIUS.lg,
            background: `linear-gradient(180deg, ${c}14, ${COLORS.surface})`,
            border: `2px solid ${c}`,
            boxShadow: SHADOW.md,
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 30 }}>💾</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: c }}>commit</span>
          </div>
          {note ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: RADIUS.sm,
                background: COLORS.surface,
                border: `1px solid ${c}44`,
              }}
            >
              <span style={{ fontSize: 15 }}>💬</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft }}>「{note}」</span>
            </div>
          ) : null}
        </div>
        {flag ? (
          <div style={{ position: "absolute", left: -10, top: -16, fontSize: 26, filter: `drop-shadow(0 2px 4px ${c}66)` }}>🚩</div>
        ) : null}
      </div>
      {label ? (
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted, textAlign: "center", maxWidth: w + 60 }}>{label}</span>
      ) : null}
    </div>
  );
};

/* ================================================================ push arrow == */

/** ⬆ an upload arrow carrying dots toward the cloud — the push motif. */
export const PushArrow: React.FC<{
  h?: number;
  progress?: number;
  color?: string;
  label?: string;
}> = ({ h = 150, progress = 1, color = MOTIF.push, label }) => {
  const frame = useCurrentFrame();
  const p = clamp01(progress);
  const flowing = p > 0.95;
  const w = 64;
  const topY = 14 + (1 - p) * (h - 40);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={w} height={h} style={{ overflow: "visible" }}>
        <line x1={w / 2} y1={h - 8} x2={w / 2} y2={14} stroke={`${color}33`} strokeWidth={5} strokeLinecap="round" />
        <line x1={w / 2} y1={h - 8} x2={w / 2} y2={topY} stroke={color} strokeWidth={5} strokeLinecap="round" />
        <path d={`M ${w / 2 - 12} ${topY + 14} L ${w / 2} ${topY} L ${w / 2 + 12} ${topY + 14}`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.2 ? 1 : 0} />
        {flowing
          ? new Array(3).fill(0).map((_, i) => {
              const t = (((frame / 26 + i / 3) % 1) + 1) % 1;
              const y = (h - 12) - t * (h - 26);
              return <circle key={i} cx={w / 2} cy={y} r={5} fill={color} opacity={Math.sin(Math.PI * t)} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />;
            })
          : null}
      </svg>
      {label ? <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color }}>{label}</span> : null}
    </div>
  );
};

/* ================================================================== laptop ==== */

/** 🖥 a laptop — "你的電腦（本地）". Screen holds any content. */
export const Laptop: React.FC<{
  w?: number;
  label?: string;
  children?: React.ReactNode;
}> = ({ w = 520, label, children }) => {
  const screenH = w * 0.6;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ width: w }}>
        {/* screen */}
        <div
          style={{
            width: "100%",
            height: screenH,
            borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`,
            background: COLORS.surface,
            border: `5px solid ${COLORS.ink}`,
            borderBottom: "none",
            boxShadow: SHADOW.lg,
            boxSizing: "border-box",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
        {/* base */}
        <div style={{ width: w * 1.12, marginLeft: -w * 0.06, height: 16, borderRadius: "0 0 14px 14px", background: COLORS.ink }} />
        <div style={{ width: w * 1.12, marginLeft: -w * 0.06, height: 5, borderRadius: 999, background: COLORS.borderStrong }} />
      </div>
      {label ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 22 }}>🖥</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{label}</span>
        </div>
      ) : null}
    </div>
  );
};

/* ============================================================== github cloud == */

/** ☁️ GitHub cloud — "雲端（遠端）". `ok` adds a green ✔. Holds children. */
export const GitHubCloud: React.FC<{
  w?: number;
  label?: string;
  sub?: string;
  glow?: number;
  ok?: boolean;
  children?: React.ReactNode;
}> = ({ w = 360, label = "GitHub 雲端", sub, glow = 0.5, ok = false, children }) => {
  const c = MOTIF.cloud;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: w, height: w * 0.62, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Cloud w={w} color={c} glow={glow} />
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 8 }}>
          {children ?? <span style={{ fontSize: w * 0.2 }}>🐙</span>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {ok ? (
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: COLORS.success, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>✔</span>
        ) : null}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{label}</div>
          {sub ? <div style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: TYPE.tiny, color: COLORS.muted }}>{sub}</div> : null}
        </div>
      </div>
    </div>
  );
};

/* ============================================================== chat bubble === */

/** 💬 a chat message — from the user (right, tinted) or Claude (left, with avatar). */
export const ChatBubble: React.FC<{
  text: React.ReactNode;
  from?: "user" | "claude";
  w?: number;
  size?: number;
}> = ({ text, from = "user", w = 760, size = TYPE.body }) => {
  const isUser = from === "user";
  const tint = isUser ? MOTIF.chat : COLORS.remotion;
  return (
    <div style={{ width: w, display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 12 }}>
      {!isUser ? (
        <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: "50%", background: GRAD_CLAUDE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✳️</div>
      ) : null}
      <div
        style={{
          maxWidth: w * 0.82,
          padding: "16px 22px",
          borderRadius: 22,
          borderBottomRightRadius: isUser ? 6 : 22,
          borderBottomLeftRadius: isUser ? 22 : 6,
          background: isUser ? `${tint}14` : COLORS.surface,
          border: `1.5px solid ${tint}${isUser ? "55" : "33"}`,
          boxShadow: SHADOW.sm,
        }}
      >
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: isUser ? 700 : 500, fontSize: size, lineHeight: 1.4, color: COLORS.inkSoft }}>{text}</span>
      </div>
      {isUser ? (
        <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: "50%", background: `${MOTIF.chat}22`, border: `1.5px solid ${MOTIF.chat}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧑</div>
      ) : null}
    </div>
  );
};

const GRAD_CLAUDE = `linear-gradient(135deg, ${COLORS.claude}, #ECA988)`;

/* ============================================================== allow button == */

/** The 「允許 / Allow」 button — granting permission. `pressed` darkens it. */
export const AllowButton: React.FC<{ pressed?: boolean; cursor?: boolean; size?: number }> = ({
  pressed = false,
  cursor = false,
  size = TYPE.body,
}) => {
  const c = MOTIF.allow;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 28px",
          borderRadius: RADIUS.md,
          background: pressed ? COLORS.successBg : c,
          border: `2px solid ${c}`,
          boxShadow: pressed ? "none" : `0 8px 20px ${c}55`,
          transform: pressed ? "translateY(2px) scale(0.97)" : "none",
        }}
      >
        <span style={{ fontSize: size, lineHeight: 1 }}>✅</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: size, color: pressed ? c : "#fff" }}>允許 / Allow</span>
      </div>
      {cursor ? (
        <div style={{ position: "absolute", right: -18, bottom: -22, fontSize: 34, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>👆</div>
      ) : null}
    </div>
  );
};

/* ================================================================ terminal ==== */

export type TermLine = { text: string; kind?: "cmd" | "out" | "err" | "ok" };

const TERM_COLOR: Record<NonNullable<TermLine["kind"]>, string> = {
  cmd: COLORS.term.text,
  out: COLORS.term.dim,
  err: COLORS.term.red,
  ok: COLORS.term.green,
};

/**
 * A synthesized dark terminal window. `progress` (0→1) types the lines out
 * character-by-character across the whole block. `title` names the window.
 */
export const Terminal: React.FC<{
  lines: TermLine[];
  w?: number;
  title?: string;
  progress?: number;
  caret?: boolean;
}> = ({ lines, w = 720, title = "bash", progress = 1, caret = true }) => {
  const frame = useCurrentFrame();
  const withPrompt = (l: TermLine) => (l.kind === "cmd" || l.kind === undefined ? `$ ${l.text}` : l.text);
  const full = lines.map(withPrompt);
  const total = full.reduce((n, s) => n + s.length, 0);
  const typed = Math.floor(clamp01(progress) * total);
  let used = 0;
  const blink = Math.floor(frame / 16) % 2 === 0;

  return (
    <div
      style={{
        width: w,
        borderRadius: RADIUS.md,
        background: COLORS.term.bg,
        boxShadow: SHADOW.lg,
        overflow: "hidden",
        fontFamily: FONT.monoCjk,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: COLORS.term.bgTop }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: 8, fontFamily: FONT.mono, fontSize: TYPE.tiny, color: COLORS.term.dim }}>{title}</span>
      </div>
      <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 9, minHeight: 40 }}>
        {full.map((s, i) => {
          const start = used;
          used += s.length;
          const take = clamp01((typed - start) / Math.max(1, s.length));
          const shownChars = Math.round(take * s.length);
          if (shownChars <= 0) return <div key={i} style={{ height: TYPE.body * 1.1 }} />;
          const isCmd = lines[i].kind === "cmd" || lines[i].kind === undefined;
          const isLastTyping = typed >= start && typed < start + s.length;
          const body = s.slice(0, shownChars);
          return (
            <div key={i} style={{ fontSize: TYPE.body, lineHeight: 1.1, whiteSpace: "pre-wrap", color: TERM_COLOR[lines[i].kind ?? "cmd"] }}>
              {isCmd && shownChars > 0 ? <span style={{ color: COLORS.term.prompt }}>{body.slice(0, 2)}</span> : null}
              {isCmd ? body.slice(2) : body}
              {caret && isLastTyping ? <span style={{ opacity: blink ? 1 : 0, color: COLORS.term.green }}>▋</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================================================================== gui app === */

/** A desktop git-client mockup: changed-files + message field + Commit/Push. */
export const GuiApp: React.FC<{
  files: string[];
  message?: string;
  commitOn?: boolean;
  pushOn?: boolean;
  w?: number;
  title?: string;
}> = ({ files, message, commitOn = false, pushOn = false, w = 560, title = "GitHub Desktop" }) => {
  return (
    <div style={{ width: w, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
      {/* title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: COLORS.bgAlt, borderBottom: `1px solid ${COLORS.border}` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: 8, fontFamily: FONT.uiCjk, fontSize: TYPE.tiny, fontWeight: 700, color: COLORS.muted }}>{title}</span>
      </div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.muted }}>變更的檔案</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {files.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: RADIUS.sm, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}>
              <span style={{ width: 20, height: 20, borderRadius: 5, background: MOTIF.file, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>✓</span>
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: COLORS.inkSoft }}>{f}</span>
            </div>
          ))}
        </div>
        {/* message field */}
        <div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: COLORS.muted, marginBottom: 6 }}>這次改了什麼</div>
          <div style={{ padding: "12px 14px", borderRadius: RADIUS.sm, background: COLORS.surface, border: `1.5px solid ${message ? MOTIF.commit : COLORS.border}`, minHeight: 24 }}>
            <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, color: message ? COLORS.inkSoft : COLORS.faint }}>{message ?? "（在這裡輸入說明…）"}</span>
          </div>
        </div>
        {/* buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <GuiButton label="Commit" color={MOTIF.commit} active={commitOn} />
          <GuiButton label="Push" color={MOTIF.push} active={pushOn} />
        </div>
      </div>
    </div>
  );
};

const GuiButton: React.FC<{ label: string; color: string; active: boolean }> = ({ label, color, active }) => (
  <div
    style={{
      flex: 1,
      textAlign: "center",
      padding: "11px 0",
      borderRadius: RADIUS.sm,
      background: active ? color : COLORS.surface,
      border: `2px solid ${color}${active ? "" : "55"}`,
      boxShadow: active ? `0 6px 16px ${color}55` : "none",
      transform: active ? "translateY(1px)" : "none",
    }}
  >
    <span style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small, color: active ? "#fff" : color }}>{label}</span>
  </div>
);

/* ================================================================ slash menu == */

/** A slash-command menu mockup: built-in vs custom entries. */
export const SlashMenu: React.FC<{
  items: { cmd: string; tag: string; desc: string }[];
  highlight?: string;
  w?: number;
  shown?: number;
}> = ({ items, highlight, w = 620, shown = items.length }) => (
  <div style={{ width: w, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
    <div style={{ padding: "12px 18px", background: COLORS.bgAlt, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted }}>/</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted }}>輸入斜線指令…</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.slice(0, shown).map((it) => {
        const isCustom = it.tag.startsWith("自訂");
        const hot = highlight === it.cmd;
        return (
          <div
            key={it.cmd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "13px 18px",
              borderTop: `1px solid ${COLORS.border}`,
              background: hot ? `${MOTIF.commit}10` : "transparent",
            }}
          >
            <span style={{ width: 150, fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.body, color: hot ? MOTIF.commit : COLORS.ink }}>{it.cmd}</span>
            <span
              style={{
                padding: "3px 11px",
                borderRadius: RADIUS.pill,
                fontFamily: FONT.uiCjk,
                fontWeight: 800,
                fontSize: TYPE.micro,
                color: isCustom ? MOTIF.commit : COLORS.muted,
                background: isCustom ? `${MOTIF.commit}16` : COLORS.bgAlt,
                border: `1px solid ${isCustom ? MOTIF.commit : COLORS.border}`,
                whiteSpace: "nowrap",
              }}
            >
              {it.tag}
            </span>
            <span style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.small, color: COLORS.muted }}>{it.desc}</span>
          </div>
        );
      })}
    </div>
  </div>
);

/* =========================================================== permission dialog = */

/** A permission dialog listing the git commands Claude will run + Allow/Deny. */
export const PermissionDialog: React.FC<{
  commands: string[];
  allowPressed?: boolean;
  cursor?: boolean;
  w?: number;
}> = ({ commands, allowPressed = false, cursor = false, w = 640 }) => (
  <div style={{ width: w, borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
    <div style={{ padding: "16px 22px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 26 }}>🔐</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>Claude 想執行這些指令</span>
    </div>
    <div style={{ padding: "18px 22px" }}>
      <div style={{ borderRadius: RADIUS.sm, background: COLORS.term.bg, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        {commands.map((c) => (
          <div key={c} style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: COLORS.term.text }}>
            <span style={{ color: COLORS.term.prompt }}>$ </span>
            {c}
          </div>
        ))}
      </div>
    </div>
    <div style={{ padding: "0 22px 20px", display: "flex", justifyContent: "flex-end", gap: 14, alignItems: "center" }}>
      <div style={{ padding: "12px 24px", borderRadius: RADIUS.md, border: `2px solid ${COLORS.border}`, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.muted }}>拒絕</div>
      <AllowButton pressed={allowPressed} cursor={cursor} />
    </div>
  </div>
);

/* ================================================================== toast ===== */

/** A success toast — the ✔ "done" confirmation. */
export const Toast: React.FC<{ text: string; color?: string; w?: number }> = ({ text, color = COLORS.success, w }) => (
  <div
    style={{
      width: w,
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 26px",
      borderRadius: RADIUS.pill,
      background: COLORS.surface,
      border: `2px solid ${color}`,
      boxShadow: SHADOW.lg,
    }}
  >
    <span style={{ width: 34, height: 34, borderRadius: "50%", background: color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800 }}>✔</span>
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{text}</span>
  </div>
);
