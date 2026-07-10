import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, FlowArrow, ramp } from "../components";
import { Tarball, KeyChip, FileTree, type TreeEntry } from "../motifs";
import { MOTIF, PAL, S5_CMDS, S5_PACKED, S5_CHECK_FILES, S5_MANUAL, S5_KEY, type MigrateCmd } from "../data";

const IDS = Array.from({ length: 16 }, (_, i) => `s5-${i + 1}`);
const { cues: CUES, dur: DUR } = buildScene(IDS, { lead: 12, minDur: 300 });
const at = (i: number) => CUES[i].from;

const CmdRow: React.FC<{ c: MigrateCmd; delay: number }> = ({ c, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 18);
  return (
    <div style={{ ...a, width: 1320, display: "flex", alignItems: "center", gap: 22, padding: "16px 26px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderLeft: `6px solid ${c.color}`, boxShadow: SHADOW.sm }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: COLORS.term.bg, borderRadius: RADIUS.sm, padding: "12px 18px" }}>
        <span style={{ color: COLORS.term.prompt, fontFamily: FONT.mono, fontSize: TYPE.small }}>$</span>
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.term.text }}>{c.cmd}</span>
      </div>
      <span style={{ flexShrink: 0, fontSize: 22, color: COLORS.faint }}>→</span>
      <span style={{ flexShrink: 0, width: 320, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: c.color }}>{c.desc}</span>
    </div>
  );
};

const Toggle: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 58, height: 32, borderRadius: 999, background: on ? PAL.yes : COLORS.borderStrong, position: "relative", boxShadow: on ? `0 0 0 4px ${PAL.yes}22` : "none" }}>
      <div style={{ position: "absolute", top: 3, left: on ? 29 : 3, width: 26, height: 26, borderRadius: "50%", background: "#fff", boxShadow: SHADOW.sm }} />
    </div>
    <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.body, color: on ? PAL.yes : COLORS.muted }}>--no-history</span>
  </div>
);

const PathBox: React.FC<{ label: string; tone: string; sub?: string }> = ({ label, tone, sub }) => (
  <div style={{ borderRadius: RADIUS.md, background: COLORS.surface, border: `2px solid ${tone}`, boxShadow: SHADOW.sm, padding: "14px 22px", textAlign: "center", minWidth: 260 }}>
    <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.body, color: tone }}>{label}</div>
    {sub ? <div style={{ marginTop: 3, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.tiny, color: COLORS.muted }}>{sub}</div> : null}
  </div>
);

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const aOp = leave(frame, at(6) - 8, 12);
  const bOp = Math.min(ramp(frame, at(6) - 8, at(6) + 6), leave(frame, at(11) - 8, 12));
  const cOp = Math.min(ramp(frame, at(11) - 8, at(11) + 6), leave(frame, at(13) - 8, 12));
  const dOp = ramp(frame, at(13) - 8, at(13) + 6);

  const treeEntries: TreeEntry[] = S5_CHECK_FILES.map((f) => ({ name: f, dir: f.endsWith("/") || !f.includes("."), mark: "yes" as const }));
  const treeShown = Math.floor(ramp(frame, at(13) + 12, at(14) + 24) * treeEntries.length + 0.001);

  return (
    <Shell durationInFrames={DUR} kicker="05 · 備份／還原腳本" accent={MOTIF.tarball} seed="s5">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116 }}>
        <Heading zh="換機備份／還原腳本" en="scripts/claude-migrate.sh" />
      </div>

      {/* ── View A: one script, three commands ── */}
      <AbsoluteFill style={{ opacity: aOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 218, display: "flex", justifyContent: "center", ...appearUp(frame, at(1), 14, 16) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 26px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.sm }}>
            <span style={{ fontSize: 22 }}>🧳</span>
            <span style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft }}>scripts/claude-migrate.sh</span>
          </span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 312, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {S5_CMDS.map((c, i) => (
            <CmdRow key={c.cmd} c={c} delay={at([3, 4, 5][i])} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 612 }}>
          <KeyLine text={S5_KEY} tone={MOTIF.tarball} delay={at(2)} width={1180} />
        </div>
      </AbsoluteFill>

      {/* ── View B: backup ＝ pack ~/.claude/ (exclude creds, --no-history) ── */}
      <AbsoluteFill style={{ opacity: bOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 214, textAlign: "center", ...appearUp(frame, at(6), 14, 16) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: MOTIF.tarball }}>backup ＝ 把 ~/.claude/ 整包打包</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
          <div style={{ ...appearUp(frame, at(7), 14, 18), display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 24px", borderRadius: RADIUS.md, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, boxShadow: SHADOW.sm }}>
            <span style={{ fontSize: 28 }}>📂</span>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.body, color: COLORS.inkSoft }}>~/.claude/</span>
          </div>
          <FlowArrow width={110} thickness={3.2} color={MOTIF.tarball} progress={ramp(frame, at(7) + 6, at(7) + 26)} />
          <Tarball w={360} items={S5_PACKED} form={ramp(frame, at(7) + 10, at(7) + 44)} noHistory={frame >= at(10)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 622, display: "flex", justifyContent: "center", gap: 40, alignItems: "center" }}>
          <div style={{ ...appearUp(frame, at(8), 14, 18), display: "flex", alignItems: "center", gap: 16 }}>
            <KeyChip excluded />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted, maxWidth: 320 }}>自動排除憑證，新機重新登入即可，較安全</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, ...appearUp(frame, at(10), 14, 18) }}>
          <Toggle on={frame >= at(10)} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted }}>只搬設定、不搬對話歷史，檔案更小</span>
        </div>
      </AbsoluteFill>

      {/* ── View C: restore renames to .bak-日期 (never overwrites) ── */}
      <AbsoluteFill style={{ opacity: cOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", ...appearUp(frame, at(11), 14, 16) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: MOTIF.disk }}>restore ＝ 在新電腦還原（不直接覆蓋）</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <div style={{ ...appearUp(frame, at(11) + 8, 14, 18) }}>
            <PathBox label="既有 ~/.claude/" tone={COLORS.muted} sub="新機原本的設定" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 18 }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: PAL.warn }}>先改名（安全副本）</span>
            <FlowArrow width={90} thickness={3} color={PAL.warn} progress={ramp(frame, at(11) + 16, at(11) + 34)} />
          </div>
          <div style={{ ...appearUp(frame, at(12), 14, 18) }}>
            <PathBox label="~/.claude.bak-2026-06-19" tone={PAL.warn} sub="不直接覆蓋" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 18 }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.tiny, color: PAL.yes }}>再解開 📦</span>
            <FlowArrow width={90} thickness={3} color={PAL.yes} progress={ramp(frame, at(12) + 12, at(12) + 30)} />
          </div>
          <div style={{ ...appearUp(frame, at(12) + 10, 14, 18) }}>
            <PathBox label="新的 ~/.claude/" tone={PAL.yes} sub="還原完成" />
          </div>
        </div>
      </AbsoluteFill>

      {/* ── View D: check scans git + manual tar fallback ── */}
      <AbsoluteFill style={{ opacity: dOp, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 92, top: 220, ...appearUp(frame, at(13), 14, 16) }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: PAL.struct }}>check ＝ 看專案層 .claude/ 有沒有進 git</span>
        </div>
        <div style={{ position: "absolute", left: 92, top: 286, ...appearUp(frame, at(13) + 8, 14, 18) }}>
          <FileTree root="你的 git 專案" entries={treeEntries} w={720} shown={treeShown} />
        </div>
        <div style={{ position: "absolute", right: 92, top: 220, width: 820, ...appearUp(frame, at(15), 16, 20) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>🧰</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.inkSoft }}>手動備份（不用腳本也可以）</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {S5_MANUAL.map((m) => (
              <div key={m.label}>
                <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted, marginBottom: 6 }}>{m.label}</div>
                <div style={{ background: COLORS.term.bg, borderRadius: RADIUS.sm, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: COLORS.term.prompt, fontFamily: FONT.mono, fontSize: TYPE.small }}>$</span>
                  <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.term.text, wordBreak: "break-all" }}>{m.cmd}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <Sfx src="pop" at={at(3)} volume={0.3} />
      <Sfx src="pop" at={at(4)} volume={0.3} />
      <Sfx src="pop" at={at(5)} volume={0.3} />
      <Sfx src="whoosh" at={at(6) - 6} volume={0.32} />
      <Sfx src="processing" at={at(7) + 10} volume={0.26} durationInFrames={40} />
      <Sfx src="whoosh" at={at(11) - 6} volume={0.3} />
      <Sfx src="whoosh" at={at(13) - 6} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene5: SceneDef = {
  id: "s5",
  index: 5,
  kicker: "05 · 備份／還原腳本",
  title: "換機備份／還原腳本",
  accent: MOTIF.tarball,
  durationInFrames: DUR,
  Component: Scene5,
};
