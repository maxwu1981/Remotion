import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave, springV } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, ramp } from "../components";
import { Terminal, PushArrow, GitHubCloud, ChatBubble } from "../motifs";
import { S7_ERRORS, S7_SETUP, S7_FIX_CHAT, S7_FIX_OK, S7_KEY, PAL } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s7-c1", "s7-c2", "s7-c3", "s7-c4", "s7-c5", "s7-c6", "s7-c7", "s7-c8", "s7-c9", "s7-c10", "s7-c11"],
  { lead: 14, minDur: 360 },
);
const at = (i: number) => CUES[i].from;

/** A prerequisite that is missing (✘ amber) then satisfied (✔ green). */
const Prereq: React.FC<{ icon: string; text: string; delay: number; okAt: number }> = ({ icon, text, delay, okAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appearUp(frame, delay, 14, 16);
  const ok = frame >= okAt;
  const flip = springV(frame, fps, { delay: okAt, damping: 12, stiffness: 160 });
  const c = ok ? PAL.yes : PAL.warn;
  return (
    <div style={{ ...a, display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 24px", borderRadius: RADIUS.pill, background: ok ? PAL.yesBg : PAL.warnBg, border: `2px solid ${c}`, boxShadow: SHADOW.sm }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{text}</span>
      <span style={{ width: 30, height: 30, borderRadius: "50%", background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, transform: `scale(${ok ? 0.6 + 0.4 * Math.min(1, flip) : 1})` }}>{ok ? "✔" : "✘"}</span>
    </div>
  );
};

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();

  const phaseALeave = leave(frame, at(8) - 8, 14);
  const errP = ramp(frame, at(6), at(7) + 16);
  const pushBlocked = ramp(frame, at(1), at(1) + 20) * 0.46; // arrow stalls mid-way
  const okPill = appearUp(frame, at(10), 16, 18);

  return (
    <Shell durationInFrames={DUR} accent={PAL.warn} kicker="07 · 新手常踩的坑" seed="s7">
      <div style={{ position: "absolute", left: 0, right: 0, top: 106, display: "flex", justifyContent: "center" }}>
        <Heading zh="push 失敗？多半是少了「一次性設定」" en="push needs a connected repo + a one-time login" delay={at(0)} />
      </div>

      {/* Phase A — blocked push + error terminal */}
      {frame < at(8) + 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 244, display: "flex", justifyContent: "center", alignItems: "center", gap: 56, opacity: phaseALeave }}>
          {/* blocked push */}
          <div style={{ ...appearUp(frame, at(1), 16, 20), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 8 }}>
              <PushArrow h={150} progress={pushBlocked} color={PAL.no} label="push" />
              {/* barrier */}
              <div style={{ position: "absolute", left: -10, top: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 44 }}>🚧</span>
              </div>
            </div>
            <div style={{ opacity: 0.5 }}>
              <GitHubCloud w={220} label="GitHub 雲端" glow={0} />
            </div>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: PAL.no }}>上不去 ✘</span>
          </div>

          {/* error terminal */}
          <div style={{ ...appearUp(frame, at(6) - 6, 16, 20) }}>
            <Terminal
              lines={[
                { text: "git push", kind: "cmd" },
                { text: S7_ERRORS[0], kind: "err" },
                { text: S7_ERRORS[1], kind: "err" },
              ]}
              w={680}
              title="terminal — 錯誤"
              progress={errP}
            />
          </div>
        </div>
      ) : null}

      {/* Phase B — paste the error into Claude */}
      {frame >= at(8) - 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ ...appearUp(frame, at(8), 16, 20) }}>
            <ChatBubble text={S7_FIX_CHAT} from="user" w={1080} />
          </div>
          <div style={{ ...appearUp(frame, at(9), 16, 18) }}>
            <ChatBubble
              text={
                <span>
                  好的，已幫你連到 GitHub 倉庫、並完成登入授權。現在 <span style={{ fontFamily: FONT.mono }}>push</span> 就會成功了 ✅
                </span>
              }
              from="claude"
              w={1080}
            />
          </div>
        </div>
      ) : null}

      {/* one-time setup prerequisites (persist, flip ✘→✔) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 24 }}>
        <Prereq icon={S7_SETUP[0].icon} text={S7_SETUP[0].text} delay={at(4)} okAt={at(9)} />
        <Prereq icon={S7_SETUP[1].icon} text={S7_SETUP[1].text} delay={at(5)} okAt={at(9) + 12} />
      </div>

      {/* resolution pill */}
      {frame >= at(10) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 656, display: "flex", justifyContent: "center", ...okPill }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "13px 26px", borderRadius: RADIUS.pill, background: PAL.yesBg, border: `2px solid ${PAL.yes}`, boxShadow: SHADOW.md }}>
            <span style={{ fontSize: 22 }}>🎉</span>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: PAL.yes }}>{S7_FIX_OK}</span>
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 108 }}>
        <KeyLine text={S7_KEY} tone={PAL.warn} delay={at(3)} width={1520} />
      </div>

      <Sfx src="whoosh" at={at(1)} volume={0.3} />
      <Sfx src="typing" at={at(6)} volume={0.3} durationInFrames={Math.max(20, at(7) + 16 - at(6))} />
      <Sfx src="pop" at={at(8)} volume={0.3} />
      <Sfx src="ding" at={at(9)} volume={0.32} />
      <Sfx src="ding" at={at(9) + 12} volume={0.32} />
      <Sfx src="cash" at={at(10)} volume={0.28} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene7: SceneDef = {
  id: "s7",
  index: 7,
  kicker: "07 · 新手常踩的坑",
  title: "The one-time GitHub setup",
  accent: PAL.warn,
  durationInFrames: DUR,
  Component: Scene7,
};
