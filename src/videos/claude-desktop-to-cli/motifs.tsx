import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { MOTIF } from "./data";

/**
 * The recurring synthesized-UI vocabulary (themeable, NOT screenshots). Reuse
 * the same component for the same idea every time so meaning compounds:
 *   🖥 AppWindow   = 桌面 App（三個分頁：Chatbot／Cowork／Code）
 *   ⌨️ Terminal    = 終端機 CLI
 *   ⚙️ EngineBlock = 共用的引擎 / agent / 工具（Code 與 CLI 同一套）
 *   📁 Disk        = 磁碟上同一批檔案
 *   💻 Laptop      = 一台電腦（換機場景的舊機／新機）
 *   📦 Tarball     = 打包好的 ~/.claude/ 備份
 *   🔑 KeyChip     = 登入憑證（.credentials.json）
 *   🗂 RepoBox     = 專案層檔案（靠 git clone 回來）
 *   🌳 FileTree    = ~/.claude/ 或專案 .claude/ 的檔案結構
 */

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* ================================================================ app window == */

type TabDef = { key: "chatbot" | "cowork" | "code"; name: string; color: string };
const TABS: TabDef[] = [
  { key: "chatbot", name: "Chatbot", color: MOTIF.chatbot },
  { key: "cowork", name: "Cowork", color: MOTIF.cowork },
  { key: "code", name: "Code", color: MOTIF.code },
];

/**
 * The desktop App window with its three tabs. `active` highlights one tab;
 * `tabsShown` reveals the tabs left-to-right (for the build-up). The body shows
 * `children`, or a faint product placeholder for the active tab.
 */
export const AppWindow: React.FC<{
  active?: "chatbot" | "cowork" | "code" | null;
  tabsShown?: number;
  w?: number;
  bodyH?: number;
  label?: string;
  glowActive?: boolean;
  children?: React.ReactNode;
}> = ({ active = "code", tabsShown = 3, w = 560, bodyH = 210, label, glowActive = false, children }) => {
  const activeColor = TABS.find((t) => t.key === active)?.color ?? COLORS.muted;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: w,
          borderRadius: RADIUS.lg,
          background: COLORS.surface,
          border: `1px solid ${COLORS.borderStrong}`,
          boxShadow: glowActive ? SHADOW.glow(activeColor) : SHADOW.lg,
          overflow: "hidden",
        }}
      >
        {/* title bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: COLORS.bgAlt, borderBottom: `1px solid ${COLORS.border}` }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 8, fontFamily: FONT.uiCjk, fontSize: TYPE.tiny, fontWeight: 700, color: COLORS.muted }}>Claude</span>
          <span style={{ marginLeft: "auto", fontSize: 15 }}>🖥</span>
        </div>
        {/* tab strip */}
        <div style={{ display: "flex", gap: 8, padding: "12px 14px 0" }}>
          {TABS.map((t, i) => {
            const shown = i < tabsShown;
            const on = active === t.key;
            return (
              <div
                key={t.key}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "9px 0",
                  borderRadius: `${RADIUS.sm}px ${RADIUS.sm}px 0 0`,
                  background: on ? `${t.color}16` : COLORS.surfaceAlt,
                  borderBottom: `3px solid ${on ? t.color : "transparent"}`,
                  opacity: shown ? 1 : 0,
                  transform: shown ? "none" : "translateY(6px)",
                }}
              >
                <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: on ? t.color : COLORS.muted }}>{t.name}</span>
              </div>
            );
          })}
        </div>
        {/* body */}
        <div style={{ height: bodyH, borderTop: `1px solid ${COLORS.border}`, padding: 18, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {children ?? <PlaceholderBody color={activeColor} />}
        </div>
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

const PlaceholderBody: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
    {[90, 70, 80].map((wd, i) => (
      <div key={i} style={{ height: 12, width: `${wd}%`, borderRadius: 6, background: i === 0 ? `${color}33` : COLORS.bgAlt }} />
    ))}
  </div>
);

/* ================================================================ terminal ==== */

export type TermLine = { text: string; kind?: "cmd" | "out" | "err" | "ok" | "comment" };
const TERM_COLOR: Record<NonNullable<TermLine["kind"]>, string> = {
  cmd: COLORS.term.text,
  out: COLORS.term.dim,
  err: COLORS.term.red,
  ok: COLORS.term.green,
  comment: COLORS.term.dim,
};

/**
 * A synthesized dark terminal window = the CLI. `progress` (0→1) types the lines
 * out character-by-character across the whole block. `title` names the window.
 */
export const Terminal: React.FC<{
  lines: TermLine[];
  w?: number;
  title?: string;
  progress?: number;
  caret?: boolean;
  fontSize?: number;
  glow?: string;
}> = ({ lines, w = 720, title = "bash", progress = 1, caret = true, fontSize = TYPE.body, glow }) => {
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
        boxShadow: glow ? SHADOW.glow(glow) : SHADOW.lg,
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
          if (shownChars <= 0) return <div key={i} style={{ height: fontSize * 1.1 }} />;
          const kind = lines[i].kind ?? "cmd";
          const isCmd = kind === "cmd";
          const isLastTyping = typed >= start && typed < start + s.length;
          const body = s.slice(0, shownChars);
          return (
            <div key={i} style={{ fontSize, lineHeight: 1.15, whiteSpace: "pre-wrap", color: TERM_COLOR[kind] }}>
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

/* ============================================================== engine block == */

/** The glowing shared engine: 「引擎 / agent / 工具」— Code 與 CLI 同一套. */
export const EngineBlock: React.FC<{ w?: number; active?: boolean }> = ({
  w = 460,
  active = true,
}) => {
  const c = MOTIF.engine;
  return (
    <div
      style={{
        width: w,
        borderRadius: RADIUS.lg,
        padding: "18px 26px",
        background: `linear-gradient(180deg, ${c}1c, ${COLORS.surface})`,
        border: `2px solid ${c}`,
        boxShadow: active ? SHADOW.glow(c) : SHADOW.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 38, filter: active ? `drop-shadow(0 0 10px ${c})` : "none" }}>⚙️</span>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: c }}>同一個引擎</div>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft }}>engine · agent · tools</div>
      </div>
    </div>
  );
};

/* ================================================================== disk ====== */

/** 📁 a database-cylinder = 「磁碟上同一批檔案」. Optional file chips inside. */
export const Disk: React.FC<{ w?: number; label?: string; glow?: number; files?: string[] }> = ({
  w = 280,
  label = "磁碟上同一批檔案",
  glow = 0.5,
  files,
}) => {
  const c = MOTIF.disk;
  const h = w * 0.78;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", width: w, height: h }}>
        <svg width={w} height={h} viewBox="0 0 100 78" style={{ overflow: "visible", filter: glow ? `drop-shadow(0 0 ${10 + glow * 16}px ${c}66)` : undefined }}>
          <ellipse cx="50" cy="62" rx="40" ry="11" fill={`${c}1a`} stroke={c} strokeWidth="2.4" />
          <path d="M10 16v46a40 11 0 0 0 80 0V16" fill={`${c}12`} stroke={c} strokeWidth="2.4" />
          <ellipse cx="50" cy="16" rx="40" ry="11" fill={COLORS.surface} stroke={c} strokeWidth="2.4" />
          <ellipse cx="50" cy="32" rx="40" ry="11" fill="none" stroke={`${c}66`} strokeWidth="1.6" />
          <ellipse cx="50" cy="47" rx="40" ry="11" fill="none" stroke={`${c}66`} strokeWidth="1.6" />
        </svg>
        <span style={{ position: "absolute", left: 0, right: 0, top: "16%", textAlign: "center", fontSize: 26 }}>📁</span>
      </div>
      {files ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, maxWidth: w + 80 }}>
          {files.map((f) => (
            <span key={f} style={{ fontFamily: FONT.mono, fontSize: TYPE.micro, color: c, background: `${c}12`, border: `1px solid ${c}44`, borderRadius: RADIUS.sm, padding: "3px 8px" }}>{f}</span>
          ))}
        </div>
      ) : null}
      {label ? (
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft, textAlign: "center" }}>{label}</span>
      ) : null}
    </div>
  );
};

/* ================================================================== laptop ==== */

/** 💻 a laptop — old/new machine in the migration scene. Screen holds children. */
export const Laptop: React.FC<{
  w?: number;
  label?: string;
  tone?: string;
  children?: React.ReactNode;
}> = ({ w = 420, label, tone = COLORS.ink, children }) => {
  const screenH = w * 0.62;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: w }}>
        <div
          style={{
            width: "100%",
            height: screenH,
            borderRadius: `${RADIUS.lg}px ${RADIUS.lg}px 0 0`,
            background: COLORS.surface,
            border: `5px solid ${tone}`,
            borderBottom: "none",
            boxShadow: SHADOW.lg,
            boxSizing: "border-box",
            padding: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
        <div style={{ width: w * 1.12, marginLeft: -w * 0.06, height: 14, borderRadius: "0 0 12px 12px", background: tone }} />
        <div style={{ width: w * 1.12, marginLeft: -w * 0.06, height: 5, borderRadius: 999, background: COLORS.borderStrong }} />
      </div>
      {label ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 20 }}>💻</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.inkSoft }}>{label}</span>
        </div>
      ) : null}
    </div>
  );
};

/* ================================================================= tarball ==== */

/** 📦 a backup package of ~/.claude/. `form` (0→1) assembles it; lists contents. */
export const Tarball: React.FC<{
  w?: number;
  label?: string;
  caption?: string;
  items?: string[];
  form?: number;
  noHistory?: boolean;
}> = ({ w = 300, label = "claude-backup.tgz", caption, items, form = 1, noHistory = false }) => {
  const c = MOTIF.tarball;
  const p = clamp01(form);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: 0.35 + 0.65 * p, transform: `scale(${0.9 + 0.1 * p})` }}>
      <div
        style={{
          width: w,
          borderRadius: RADIUS.lg,
          background: `linear-gradient(180deg, ${c}1e, ${COLORS.surface})`,
          border: `2.5px solid ${c}`,
          boxShadow: SHADOW.lg,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 34 }}>📦</span>
          <span style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.body, color: c }}>{label}</span>
        </div>
        {items ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {items.map((it, i) => {
              const isHistory = it.includes("對話") || it.includes("歷史");
              const dropped = noHistory && isHistory;
              return (
                <span
                  key={it}
                  style={{
                    fontFamily: FONT.uiCjk,
                    fontWeight: 700,
                    fontSize: TYPE.tiny,
                    color: dropped ? COLORS.faint : COLORS.inkSoft,
                    background: dropped ? COLORS.bgAlt : `${c}12`,
                    border: `1px solid ${dropped ? COLORS.border : `${c}44`}`,
                    borderRadius: RADIUS.pill,
                    padding: "4px 11px",
                    textDecoration: dropped ? "line-through" : "none",
                    opacity: clamp01((p - i * 0.06) * 3),
                  }}
                >
                  {it}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
      {caption ? (
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted, textAlign: "center", maxWidth: w + 120 }}>{caption}</span>
      ) : null}
    </div>
  );
};

/* ================================================================ key chip ==== */

/** 🔑 the login credentials token. `excluded` strikes it out (tossed aside). */
export const KeyChip: React.FC<{ excluded?: boolean; label?: string }> = ({
  excluded = false,
  label = ".credentials.json",
}) => {
  const c = excluded ? COLORS.faint : MOTIF.key;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 22px",
        borderRadius: RADIUS.md,
        background: excluded ? COLORS.bgAlt : `${c}16`,
        border: `2px dashed ${c}`,
        transform: excluded ? "rotate(-7deg)" : "none",
        boxShadow: excluded ? "none" : SHADOW.sm,
        position: "relative",
      }}
    >
      <span style={{ fontSize: 28, filter: excluded ? "grayscale(1)" : "none" }}>🔑</span>
      <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.small, color: excluded ? COLORS.faint : COLORS.inkSoft, textDecoration: excluded ? "line-through" : "none" }}>{label}</span>
      {excluded ? (
        <span style={{ position: "absolute", right: -14, top: -14, fontSize: 24 }}>🚫</span>
      ) : null}
    </div>
  );
};

/* ================================================================= repo box === */

/** 🗂 a git repo of project-level files — survives a machine switch via clone. */
export const RepoBox: React.FC<{ w?: number; label?: string; files?: string[] }> = ({
  w = 320,
  label = "專案 git 倉庫",
  files = [".claude/", "CLAUDE.md", ".mcp.json"],
}) => {
  const c = MOTIF.repo;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: w, borderRadius: RADIUS.lg, background: COLORS.surface, border: `2px solid ${c}`, boxShadow: SHADOW.md, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: `${c}12`, borderBottom: `1px solid ${c}33` }}>
          <span style={{ fontSize: 20 }}>🗂</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: c }}>{label}</span>
        </div>
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 7 }}>
          {files.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 13, color: c }}>›</span>
              <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: COLORS.inkSoft }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================================================================ file tree === */

export type TreeEntry = { name: string; depth?: number; mark?: "yes" | "no" | "warn" | null; dir?: boolean };

/** 🌳 a file-tree list — used to show ~/.claude/ contents or project .claude/. */
export const FileTree: React.FC<{
  root: string;
  entries: TreeEntry[];
  w?: number;
  shown?: number;
}> = ({ root, entries, w = 560, shown = entries.length }) => {
  const markColor = { yes: COLORS.success, no: COLORS.error, warn: COLORS.warn } as const;
  const markIcon = { yes: "✓", no: "✕", warn: "!" } as const;
  return (
    <div style={{ width: w, borderRadius: RADIUS.md, background: COLORS.code.bg, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md, overflow: "hidden", fontFamily: FONT.monoCjk }}>
      <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ fontSize: 17 }}>📂</span>
        <span style={{ fontWeight: 700, fontSize: TYPE.small, color: COLORS.inkSoft }}>{root}</span>
      </div>
      <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        {entries.slice(0, shown).map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: (e.depth ?? 1) * 18 }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>{e.dir ? "📁" : "📄"}</span>
            <span style={{ fontSize: TYPE.small, color: COLORS.code.text, flex: 1 }}>{e.name}</span>
            {e.mark ? (
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${markColor[e.mark]}1a`, border: `1.4px solid ${markColor[e.mark]}`, color: markColor[e.mark], display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{markIcon[e.mark]}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
