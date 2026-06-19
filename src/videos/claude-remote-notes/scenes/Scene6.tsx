import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, Stamp } from "../components";
import { SCENARIO_A, SCENARIO_B, S6_BEST, MOTIF, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s6-c1", "s6-c2", "s6-c3", "s6-c4", "s6-c5", "s6-c6", "s6-c7", "s6-c8"],
  { lead: 14, minDur: 420 },
);
const at = (i: number) => CUES[i].from;

const Panel: React.FC<{ tag: string; title: string; sub: string; tone: string; delay: number; children: React.ReactNode }> = ({ tag, title, sub, tone, delay, children }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 16, 22);
  return (
    <div style={{ ...a, width: 840, minHeight: 540, padding: "26px 30px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ padding: "4px 14px", borderRadius: RADIUS.pill, background: tone, color: "#fff", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small }}>{tag}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{title}</span>
      </div>
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted, marginBottom: 20 }}>{sub}</div>
      {children}
    </div>
  );
};

/** 情況 A: file → ✘/✔ verdict. */
const VerdictRow: React.FC<{ file: string; ok: boolean; verdict: string; delay: number }> = ({ file, ok, verdict, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 16);
  return (
    <div style={{ ...a, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", marginBottom: 14, borderRadius: RADIUS.md, background: ok ? PAL.yesBg : COLORS.surfaceAlt, border: `1.5px solid ${ok ? PAL.yes : COLORS.border}` }}>
      <span style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.inkSoft }}>{file}</span>
      <Stamp kind={ok ? "yes" : "no"} text={verdict} at={delay} size={TYPE.small} rotate={ok ? -2 : 2} />
    </div>
  );
};

/** 情況 B: file → 作用範圍 + 適合. */
const ScopeRow: React.FC<{ file: string; scope: string; use: string; delay: number }> = ({ file, scope, use, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 14, 16);
  return (
    <div style={{ ...a, padding: "16px 20px", marginBottom: 14, borderRadius: RADIUS.md, background: COLORS.surfaceAlt, border: `1.5px solid ${COLORS.border}` }}>
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.ink, marginBottom: 10 }}>{file}</div>
      <div style={{ display: "flex", gap: 12 }}>
        <Field label="作用範圍" value={scope} tone={MOTIF.warehouse} />
        <Field label="適合" value={use} tone={MOTIF.note} />
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; tone: string }> = ({ label, value, tone }) => (
  <div style={{ flex: 1, padding: "8px 12px", borderRadius: RADIUS.sm, background: `${tone}10`, border: `1px solid ${tone}33` }}>
    <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: TYPE.micro, color: tone, letterSpacing: 0.5 }}>{label}</div>
    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.tiny, color: COLORS.inkSoft, marginTop: 3, lineHeight: 1.35 }}>{value}</div>
  </div>
);

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const bestA = appearUp(frame, at(7), 16, 20);
  const icons = ["💻 電腦", "📱 手機", "🌐 網頁"];

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.note} kicker="06 · 電腦上還要放嗎？" seed="s6">
      <div style={{ position: "absolute", left: 0, right: 0, top: 112, display: "flex", justifyContent: "center" }}>
        <Heading zh="我的電腦上，還要放 CLAUDE.md 嗎？" en="Depends on how you run Claude Code" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 100, right: 100, top: 210, display: "flex", justifyContent: "center", gap: 40 }}>
        <Panel tag="情況 A" title="用手機／網頁" sub="遠端容器在跑" tone={MOTIF.cloud} delay={at(1)}>
          {SCENARIO_A.map((r, i) => (
            <VerdictRow key={r.file} file={r.file} ok={r.ok} verdict={r.verdict} delay={at(2 + i)} />
          ))}
        </Panel>

        <Panel tag="情況 B" title="在自己電腦開 Claude Code" sub="本機在跑" tone={MOTIF.warehouse} delay={at(5)}>
          {SCENARIO_B.map((r, i) => (
            <ScopeRow key={r.file} file={r.file} scope={r.scope} use={r.use} delay={at(6 + i)} />
          ))}
        </Panel>
      </div>

      {/* best-value banner */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, display: "flex", justifyContent: "center", ...bestA }}>
        <div style={{ maxWidth: 1480, display: "flex", alignItems: "center", gap: 20, padding: "18px 32px", borderRadius: RADIUS.lg, background: `linear-gradient(180deg, #FFF8E8, ${PAL.warnBg})`, border: `2px solid ${PAL.warn}`, boxShadow: SHADOW.lg }}>
          <span style={{ fontSize: 44 }}>🏆</span>
          <span style={{ flex: 1, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, lineHeight: 1.34 }}>{S6_BEST}</span>
          <div style={{ display: "flex", gap: 10 }}>
            {icons.map((t, i) => (
              <div key={t} style={{ ...appearUp(frame, at(7) + 8 + i * 5, 12, 12), padding: "8px 14px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${PAL.yes}`, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink, whiteSpace: "nowrap" }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      <Sfx src="whoosh" at={at(1)} volume={0.32} />
      <Sfx src="whoosh" at={at(5)} volume={0.32} />
      <Sfx src="cash" at={at(7)} volume={0.3} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene6: SceneDef = {
  id: "s6",
  index: 6,
  kicker: "06 · 電腦上還要放嗎？",
  title: "Need it locally?",
  accent: MOTIF.note,
  durationInFrames: DUR,
  Component: Scene6,
};
