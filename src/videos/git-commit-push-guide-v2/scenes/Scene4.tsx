import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, ramp } from "../components";
import { Terminal, GuiApp, ChatBubble } from "../motifs";
import { S4_CLI, S4_GUI_FILES, S4_GUI_FIELD, S4_CHAT, S4_CARDS, S4_RESULT, S4_KEY, MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s4-c1", "s4-c2", "s4-c3", "s4-c4", "s4-c5", "s4-c6", "s4-c7", "s4-c8", "s4-c9", "s4-c10", "s4-c11", "s4-c12"],
  { lead: 14, minDur: 360 },
);
const at = (i: number) => CUES[i].from;

const CX = [392, 960, 1528]; // card centre x positions
const CARD_W = 532;

const Card: React.FC<{
  idx: number;
  color: string;
  reveal: { opacity: number; transform: string };
  children: React.ReactNode;
}> = ({ idx, color, reveal, children }) => {
  const c = S4_CARDS[idx];
  return (
    <div style={{ ...reveal, width: CARD_W, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${color}44`, boxShadow: SHADOW.lg, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", background: `${color}16`, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{c.emoji}</div>
        <div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink, lineHeight: 1.15 }}>{c.tag}</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.tiny, color: COLORS.muted }}>{c.sub}</div>
        </div>
      </div>
      <div style={{ height: 326, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c1 = appearUp(frame, at(2), 16, 22);
  const c2 = appearUp(frame, at(5), 16, 22);
  const c3 = appearUp(frame, at(8), 16, 22);

  const termP = ramp(frame, at(2) + 10, at(4) + 28);
  const guiCommit = frame > at(7);
  const guiPush = frame > at(7) + 20;
  const guiMsg = frame > at(6) + 6;
  const chatShown = frame > at(8) + 6;
  const claudeRun = frame > at(9);

  const conv = ramp(frame, at(10), at(10) + 26);
  const resultIn = springPop(frame, fps, { delay: at(10) + 14, from: 0.6, dist: 18 });
  const cardBottomY = 690;
  const chipY = 792;

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.push} kicker="04 · 三種輸入方式" seed="s4">
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center" }}>
        <Heading zh="三種方式，做的是同樣三件事" en="Three inputs · the same three actions" delay={at(0)} />
      </div>

      {/* three cards */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 226, display: "flex", justifyContent: "center", gap: 36 }}>
        <Card idx={0} color={COLORS.ink} reveal={c1}>
          <Terminal lines={S4_CLI.map((t) => ({ text: t, kind: "cmd" }))} w={478} title="terminal" progress={termP} />
        </Card>
        <Card idx={1} color={MOTIF.push} reveal={c2}>
          <GuiApp files={S4_GUI_FILES} message={guiMsg ? S4_GUI_FIELD : undefined} commitOn={guiCommit} pushOn={guiPush} w={478} />
        </Card>
        <Card idx={2} color={MOTIF.chat} reveal={c3}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 478 }}>
            <div style={{ opacity: chatShown ? 1 : 0, transform: `translateY(${chatShown ? 0 : 10}px)` }}>
              <ChatBubble text={S4_CHAT} from="user" w={478} size={TYPE.small} />
            </div>
            {claudeRun ? (
              <div style={{ ...appearUp(frame, at(9), 12, 14) }}>
                <ChatBubble
                  text={
                    <span>
                      好的，幫你執行：<span style={{ fontFamily: FONT.mono }}>git add · commit · push</span> ✔
                    </span>
                  }
                  from="claude"
                  w={478}
                  size={TYPE.small}
                />
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      {/* converging lines → result */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
        {CX.map((x, i) => {
          const d = `M ${x} ${cardBottomY} Q ${x} ${(cardBottomY + chipY) / 2} ${960} ${chipY}`;
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={[COLORS.ink, MOTIF.push, MOTIF.chat][i]}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={700}
              strokeDashoffset={700 * (1 - conv)}
              opacity={0.7}
            />
          );
        })}
      </svg>

      {/* result chip */}
      <div style={{ position: "absolute", left: 0, right: 0, top: chipY - 34, display: "flex", justifyContent: "center" }}>
        <div style={{ ...resultIn, display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 34px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2.5px solid ${MOTIF.commit}`, boxShadow: SHADOW.lg }}>
          <span style={{ fontSize: 28 }}>🎯</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{S4_RESULT}</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110 }}>
        <KeyLine text={S4_KEY} tone={MOTIF.push} delay={at(11)} width={1480} />
      </div>

      <Sfx src="typing" at={at(2) + 10} volume={0.3} durationInFrames={Math.max(20, at(4) + 28 - (at(2) + 10))} />
      <Sfx src="pop" at={at(5)} volume={0.3} />
      <Sfx src="ding" at={at(7)} volume={0.3} />
      <Sfx src="pop" at={at(8)} volume={0.3} />
      <Sfx src="whoosh" at={at(10)} volume={0.34} />
      <Sfx src="ding" at={at(10) + 14} volume={0.34} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene4: SceneDef = {
  id: "s4",
  index: 4,
  kicker: "04 · 三種輸入方式",
  title: "Three inputs, same actions",
  accent: MOTIF.push,
  durationInFrames: DUR,
  Component: Scene4,
};
