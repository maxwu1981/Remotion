import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, leave } from "../../../shared-skills/anim";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, ramp } from "../components";
import { Terminal, PermissionDialog, Toast, ChatBubble } from "../motifs";
import { S6_CHAT, S6_PERMISSION, S6_TOAST, S6_STEPS, S6_KEY, MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s6-c1", "s6-c2", "s6-c3", "s6-c4", "s6-c5", "s6-c6", "s6-c7", "s6-c8", "s6-c9", "s6-c10", "s6-c11"],
  { lead: 14, minDur: 360 },
);
const at = (i: number) => CUES[i].from;

/** Step pills 1·2·3 highlighting the current step. */
const Steps: React.FC<{ current: number }> = ({ current }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
    {S6_STEPS.map((s, i) => {
      const active = current === i + 1;
      const done = current > i + 1;
      const c = active ? MOTIF.chat : done ? COLORS.success : COLORS.muted;
      return (
        <div key={s} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 18px", borderRadius: RADIUS.pill, background: active ? `${c}12` : COLORS.surface, border: `1.5px solid ${active || done ? c : COLORS.border}`, boxShadow: active ? SHADOW.sm : "none", opacity: active || done ? 1 : 0.7 }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{done ? "✓" : i + 1}</span>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: active ? COLORS.ink : COLORS.muted }}>{s}</span>
        </div>
      );
    })}
  </div>
);

/** Step 1 — the chat composer being typed into. */
const Composer: React.FC<{ typed: number }> = ({ typed }) => {
  const text = S6_CHAT.slice(0, typed);
  const caret = typed < S6_CHAT.length;
  return (
    <div style={{ width: 1180, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${MOTIF.chat}55`, boxShadow: SHADOW.lg, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 28 }}>🧑</span>
      <div style={{ flex: 1, minHeight: 36, padding: "12px 18px", borderRadius: RADIUS.md, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}` }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, lineHeight: 1.4 }}>
          {text}
          {caret ? <span style={{ color: MOTIF.chat }}>▋</span> : null}
        </span>
      </div>
      <div style={{ padding: "12px 22px", borderRadius: RADIUS.md, background: MOTIF.chat, color: "#fff", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body }}>送出 ↵</div>
    </div>
  );
};

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();

  const current = frame >= at(8) ? 3 : frame >= at(5) ? 2 : 1;
  const phaseALeave = leave(frame, at(9) - 8, 14);
  const typed = Math.floor(ramp(frame, at(3), at(4) + 22) * S6_CHAT.length);

  return (
    <Shell durationInFrames={DUR} accent={MOTIF.chat} kicker="06 · 桌面版實作步驟" seed="s6">
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
        <Heading zh="桌面版：只要跟 Claude 說一句話" en="On desktop, just tell Claude in the chat box" delay={at(0)} />
      </div>

      {/* Phase A — three steps */}
      {frame < at(9) + 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, opacity: phaseALeave }}>
          <Steps current={current} />
          <div style={{ marginTop: 34, display: "flex", justifyContent: "center", minHeight: 360, alignItems: "flex-start" }}>
            {current === 1 ? (
              <div style={{ ...appearUp(frame, at(3), 14, 18) }}>
                <Composer typed={typed} />
              </div>
            ) : null}
            {current === 2 ? (
              <div style={{ ...appearUp(frame, at(5), 16, 22) }}>
                <PermissionDialog commands={S6_PERMISSION} allowPressed={frame >= at(7) + 8} cursor={frame >= at(7)} w={760} />
              </div>
            ) : null}
            {current === 3 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
                <div style={{ ...appearUp(frame, at(8), 14, 18) }}>
                  <Toast text={S6_TOAST} />
                </div>
                <div style={{ ...appearUp(frame, at(8) + 10, 14, 16) }}>
                  <ChatBubble
                    text={
                      <span>
                        已經幫你 <span style={{ fontFamily: FONT.mono }}>commit</span> 並 <span style={{ fontFamily: FONT.mono }}>push</span> 完成，雲端已有最新備份 ✅
                      </span>
                    }
                    from="claude"
                    w={920}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Phase B — equivalence: 三行指令 ＝ 一句白話 */}
      {frame >= at(9) - 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
          <div style={{ ...appearUp(frame, at(9), 16, 22), display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Terminal lines={S6_PERMISSION.map((t) => ({ text: t, kind: "cmd" }))} w={560} title="terminal" progress={1} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.muted }}>三行指令</span>
          </div>
          <span style={{ ...appearUp(frame, at(9) + 10, 12, 12), fontFamily: FONT.ui, fontWeight: 800, fontSize: 80, color: MOTIF.commit }}>＝</span>
          <div style={{ ...appearUp(frame, at(9) + 14, 16, 22), display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <ChatBubble text="幫我 commit 並 push" from="user" w={520} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: MOTIF.chat }}>一句白話</span>
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 116 }}>
        <KeyLine text={S6_KEY} tone={MOTIF.chat} delay={at(9)} width={1360} />
      </div>

      <Sfx src="typing" at={at(3)} volume={0.32} durationInFrames={Math.max(20, at(4) + 22 - at(3))} />
      <Sfx src="whoosh" at={at(5)} volume={0.32} />
      <Sfx src="pop" at={at(7) + 8} volume={0.34} />
      <Sfx src="cash" at={at(8)} volume={0.3} />
      <Sfx src="ding" at={at(9) + 10} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene6: SceneDef = {
  id: "s6",
  index: 6,
  kicker: "06 · 桌面版實作步驟",
  title: "Desktop: tell Claude in one sentence",
  accent: MOTIF.chat,
  durationInFrames: DUR,
  Component: Scene6,
};
