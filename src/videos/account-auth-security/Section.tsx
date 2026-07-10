import React from "react";
import { COLORS } from "../../shared-skills/theme";
import type { Cue } from "../../shared-skills/captions";
import { Captions, buildScene } from "./captions";
import {
  Shell,
  KeyLine,
  TextWall,
  RoleTable,
  RoleCards,
  CompareCols,
  NumberedFlow,
  MetaphorPanel,
  RoleSwap,
  type Block,
} from "./components";
import { MOTIF } from "./data";
import type { SceneSpec } from "./content";

/** Resolve a spec into timed cues + scene length. */
export const sceneFrames = (spec: SceneSpec): { cues: Cue[]; dur: number } =>
  buildScene(spec.cueIds, { minDur: spec.minDur ?? 0 });

const blocksFrom = (cues: Cue[], idx: number[], kind: Block["kind"] = "para"): Block[] =>
  idx.map((i) => ({ text: cues[i].text, from: cues[i].from, kind }));

/** Render one doc section as a scene. `cards` forces the table's card-variant. */
export const Section: React.FC<{ spec: SceneSpec; cards?: boolean }> = ({ spec, cards = false }) => {
  const { cues, dur } = sceneFrames(spec);
  const accent = MOTIF[spec.motif] ?? COLORS.remotion;

  const head = (
    <Shell no={spec.no} titleZh={spec.titleZh} titleEn={spec.titleEn} accent={accent} durationInFrames={dur} seed={spec.id}>
      {body()}
      <Captions cues={cues} />
    </Shell>
  );
  return head;

  function body(): React.ReactNode {
    switch (spec.kind) {
      case "text":
      case "bullets": {
        const n = cues.length;
        const fontSize = n >= 8 ? 24 : n >= 6 ? 26 : 30;
        const gap = n >= 6 ? 14 : 18;
        const top = n >= 7 ? 224 : 248;
        return (
          <TextWall
            accent={accent}
            blocks={blocksFrom(cues, cues.map((_, i) => i), spec.kind === "bullets" ? "bullet" : "para")}
            fontSize={fontSize}
            gap={gap}
            top={top}
          />
        );
      }

      case "metaphor":
        return <MetaphorPanel kind={spec.art ?? "key"} accent={accent} blocks={blocksFrom(cues, cues.map((_, i) => i), "para")} />;

      case "table": {
        const t = spec.table!;
        if (cards && spec.altCards) {
          const at = spreadReveal(cues, spec.altCards.length);
          return <RoleCards items={spec.altCards} accent={accent} revealAt={at} top={spec.no ? 250 : 250} />;
        }
        const revealAt = t.rowCueIdx ? t.rowCueIdx.map((i) => cues[i].from) : spreadReveal(cues, t.rows.length);
        const lead = t.leadIdx != null ? cues[t.leadIdx] : null;
        return (
          <>
            {lead ? (
              <div style={{ position: "absolute", left: 96, right: 96, top: 196 }}>
                <TextWall accent={accent} blocks={[{ text: lead.text, from: lead.from, kind: "lead" }]} top={0} fontSize={22} width={1680} />
              </div>
            ) : null}
            <RoleTable cols={t.cols} rows={t.rows} accent={accent} revealAt={revealAt} top={lead ? 286 : 250} highlightCol0={t.highlightCol0 ?? true} />
            {t.keyText ? (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 116 }}>
                <KeyLine text={t.keyText} tone={accent} delay={cues[cues.length - 1].from} size={22} />
              </div>
            ) : null}
          </>
        );
      }

      case "compare": {
        const c = spec.compare!;
        const lead = c.leadIdx != null ? cues[c.leadIdx] : null;
        const left = { badge: c.left.badge, tone: c.left.tone, lines: c.left.cueIdx.map((i) => cues[i].text) };
        const right = { badge: c.right.badge, tone: c.right.tone, lines: c.right.cueIdx.map((i) => cues[i].text) };
        const leftAt = cues[c.left.cueIdx[0]].from;
        const rightAt = cues[c.right.cueIdx[0]].from;
        return (
          <>
            {lead ? (
              <div style={{ position: "absolute", left: 96, right: 96, top: 196 }}>
                <TextWall accent={accent} blocks={[{ text: lead.text, from: lead.from, kind: "lead" }]} top={0} fontSize={22} width={1680} />
              </div>
            ) : null}
            <CompareCols left={left} right={right} leftAt={leftAt} rightAt={rightAt} top={lead ? 282 : 256} />
            {c.keyIdx != null ? (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 116 }}>
                <KeyLine text={cues[c.keyIdx].text} tone={accent} delay={cues[c.keyIdx].from} size={22} />
              </div>
            ) : null}
          </>
        );
      }

      case "flow": {
        const f = spec.flow!;
        const lead = f.leadIdx != null ? cues[f.leadIdx] : null;
        const steps = f.stepIdx.map((i) => cues[i].text);
        const revealAt = f.stepIdx.map((i) => cues[i].from);
        return (
          <>
            {lead ? (
              <div style={{ position: "absolute", left: 96, right: 96, top: 196 }}>
                <TextWall accent={accent} blocks={[{ text: lead.text, from: lead.from, kind: "lead" }]} top={0} fontSize={22} width={1680} />
              </div>
            ) : null}
            <NumberedFlow steps={steps} accent={accent} revealAt={revealAt} top={lead ? 282 : 250} />
            {f.keyIdx && f.keyIdx.length ? (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 110 }}>
                <KeyLine text={f.keyIdx.map((i) => cues[i].text).join(" ")} tone={accent} delay={cues[f.keyIdx[0]].from} size={21} />
              </div>
            ) : null}
          </>
        );
      }

      case "roleswap": {
        const r = spec.roleswap!;
        return (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 214, display: "flex", justifyContent: "center" }}>
              <RoleSwap hotel={r.hotel} guest={r.guest} action={r.action} accent={accent} delay={6} />
            </div>
            <TextWall accent={accent} blocks={blocksFrom(cues, r.bodyIdx.length ? [...r.introIdx, ...r.bodyIdx] : cues.map((_, i) => i), "para")} top={560} fontSize={21} gap={10} width={1700} />
          </>
        );
      }

      default:
        return null;
    }
  }
};

/** Evenly spread N reveal frames between the first and last cue of a scene. */
function spreadReveal(cues: Cue[], n: number): number[] {
  if (cues.length === 0) return new Array(n).fill(0);
  const start = cues[0].from;
  const end = cues[cues.length - 1].from + Math.round(cues[cues.length - 1].dur * 0.4);
  return new Array(n).fill(0).map((_, i) => Math.round(start + ((end - start) * i) / Math.max(1, n)));
}
