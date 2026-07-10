import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, RADIUS, SHADOW } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, TextWall, type Block } from "../components";
import { MOTIF } from "../data";

/**
 * Opening agenda + closing recap: the same 8-concept spine, shown once up front
 * (numbered, "here's what you'll learn") and once at the end (check-marked,
 * "you now understand these"). The narration (ag-N and rc-N in script.json)
 * carries the full sentence; the list shows a short title per item.
 */

/** Short on-screen titles for the 8 concepts (narration expands each). */
const TITLES = [
  "認證 vs 授權",
  "密碼 = 萬能鑰匙",
  "OAuth = 發鑰匙的制度",
  "Token = 限定通行證",
  "旅館模型 · 角色互換",
  "兩種 token：身分卡 / 工作門卡",
  "API key vs OAuth token",
  "CAPTCHA = 門口警衛",
];

/** Numbered (or check-marked) concept list, each row revealing in time. */
const AgendaList: React.FC<{
  accent: string;
  revealAt: number[];
  check?: boolean;
  top?: number;
}> = ({ accent, revealAt, check = false, top = 268 }) => {
  const frame = useCurrentFrame();
  const dot = check ? COLORS.success : accent;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 1500, display: "flex", flexDirection: "column", gap: 12 }}>
        {TITLES.map((t, i) => {
          const a = appearUp(frame, revealAt[i] ?? 0, 14, 16);
          return (
            <div
              key={i}
              style={{
                ...a,
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "12px 30px",
                borderRadius: RADIUS.lg,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderLeft: `5px solid ${dot}`,
                boxShadow: SHADOW.sm,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: check ? COLORS.success : `${accent}16`,
                  border: `2px solid ${dot}`,
                  color: check ? "#fff" : accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 24,
                }}
              >
                {check ? "✓" : i + 1}
              </div>
              <span style={{ fontWeight: 700, fontSize: 26, color: COLORS.ink, lineHeight: 1.35 }}>{t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Build one agenda/recap scene from its cue ids (cue 0 = lead line, 1..8 = list). */
const agendaScene = (
  ids: string[],
  opts: { titleZh: string; titleEn: string; check: boolean; seed: string; index: number },
): { Component: React.FC; def: SceneDef } => {
  const { cues, dur } = buildScene(ids, { lead: 12, minDur: 420 });
  const accent = MOTIF.intro;
  const Component: React.FC = () => {
    const lead = cues[0];
    const revealAt = cues.slice(1).map((c) => c.from);
    const leadBlock: Block[] = [{ text: lead.text, from: lead.from, kind: "lead" }];
    return (
      <Shell titleZh={opts.titleZh} titleEn={opts.titleEn} accent={accent} durationInFrames={dur} seed={opts.seed}>
        <div style={{ position: "absolute", left: 96, right: 96, top: 196 }}>
          <TextWall accent={accent} blocks={leadBlock} top={0} fontSize={22} width={1680} />
        </div>
        <AgendaList accent={accent} revealAt={revealAt} check={opts.check} top={272} />
        <Captions cues={cues} />
      </Shell>
    );
  };
  const def: SceneDef = {
    id: opts.seed,
    index: opts.index,
    kicker: opts.titleZh,
    title: opts.titleEn,
    accent,
    durationInFrames: dur,
    Component,
  };
  return { Component, def };
};

const ag = agendaScene(["ag-0", "ag-1", "ag-2", "ag-3", "ag-4", "ag-5", "ag-6", "ag-7", "ag-8"], {
  titleZh: "本片地圖 · 你會搞懂這 8 件事",
  titleEn: "What you'll learn",
  check: false,
  seed: "agenda",
  index: 0,
});

const rc = agendaScene(["rc-0", "rc-1", "rc-2", "rc-3", "rc-4", "rc-5", "rc-6", "rc-7", "rc-8"], {
  titleZh: "快速回顧 · 這 8 個觀念你都懂了",
  titleEn: "Recap — you've got all 8",
  check: true,
  seed: "recap-agenda",
  index: 89,
});

export const Agenda = ag.Component;
export const RecapAgenda = rc.Component;
export const agenda = ag.def;
export const recapAgenda = rc.def;
