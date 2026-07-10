import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { appearScale, enter, springPop } from "../../shared-skills/anim";
import { Narration } from "../../shared-skills/components/Narration";
import { Bgm } from "../../shared-skills/audio";
import { ThumbEP01 } from "./ThumbEP01";
import { MapStage, type Beat } from "./MapStage";
import { nodeById, categoryById } from "./tree";
import VO from "./ep01-vo.json";
import SCRIPT from "./ep01-script.json";

export const FPS = 30;
const vo = VO as Record<string, number>;
const script = SCRIPT as Record<string, string>;
const VO_DIR = "vo/claude-code-map-ep01";

const voF = (id: string): number => {
  const s = vo[id];
  if (s) return Math.ceil(s * FPS);
  return Math.ceil(Math.max(1.6, (script[id] ?? "").length / 5.2) * FPS);
};

/* ── 時間軸(旁白驅動) ── */
const PAD = 12;
const INTRO = 54;
const TAIL = 24;

const hookFrom = INTRO;
const hookDur = voF("hook") + PAD;
const hereFrom = hookFrom + hookDur;
const hereDur = Math.max(voF("here") + PAD, 120);
const defFrom = hereFrom + hereDur;
const defDur = voF("def") + PAD;
const def2From = defFrom + defDur;
const def2Dur = voF("def2") + PAD;
const demoFrom = def2From + def2Dur;
const demoDur = voF("demo") + 40;
const nextFrom = demoFrom + demoDur;
const nextDur = Math.max(voF("next") + PAD, 120);
const outroFrom = nextFrom + nextDur;
const outroDur = Math.max(voF("outro") + 44, 150);
export const DURATION = outroFrom + outroDur + TAIL;
export const getEp01Frames = () => DURATION;

type Cue = { id: string; from: number; dur: number; caption: boolean };
const CUES: Cue[] = [
  { id: "hook", from: hookFrom, dur: hookDur, caption: true },
  { id: "here", from: hereFrom, dur: hereDur, caption: true },
  { id: "def", from: defFrom, dur: defDur, caption: true },
  { id: "def2", from: def2From, dur: def2Dur, caption: true },
  { id: "demo", from: demoFrom, dur: demoDur, caption: true },
  { id: "next", from: nextFrom, dur: nextDur, caption: true },
  { id: "outro", from: outroFrom, dur: outroDur, caption: false },
];

/* ── 共用小元件 ── */
const FlatBg: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%, ${COLORS.bgAlt} 100%)` }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 22%)" }} />
  </AbsoluteFill>
);

const CapLine: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  const a = interpolate(frame, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [Math.max(0, dur - 8), dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", opacity: Math.min(a, o) }}>
      <div style={{ maxWidth: 1640, padding: "16px 40px", borderRadius: RADIUS.pill, background: "#FFFFFF", border: `1.5px solid ${COLORS.borderStrong}`, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, color: COLORS.ink, textAlign: "center" }}>
        {text}
      </div>
    </div>
  );
};

const Captions: React.FC = () => (
  <>
    {CUES.filter((c) => c.caption).map((c) => (
      <Sequence key={c.id} from={c.from} durationInFrames={c.dur} layout="none" name={`cap-${c.id}`}>
        <CapLine text={script[c.id]} dur={c.dur} />
      </Sequence>
    ))}
  </>
);

const VoiceTrack: React.FC = () => (
  <>
    {CUES.map((c) => (
      <Sequence key={c.id} from={c.from} durationInFrames={voF(c.id) + 8} layout="none" name={`vo-${c.id}`}>
        <Narration id={c.id} dir={VO_DIR} />
      </Sequence>
    ))}
  </>
);

const EpBadge: React.FC = () => (
  <div style={{ position: "absolute", top: 50, left: 60, display: "flex", alignItems: "center", gap: 12 }}>
    <span style={{ padding: "6px 16px", borderRadius: RADIUS.pill, background: categoryById("A").color, color: "#fff", fontWeight: 800, fontSize: 26 }}>EP01</span>
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 28, color: COLORS.muted }}>
      <span style={{ fontFamily: FONT.mono }}>Claude Code</span> 新手地圖
    </span>
  </div>
);

/* ── 封面亮相(第 0 秒 ThumbEP01 全幅,frame 0 即滿版;結束前淡出接內容) ── */
const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const fout = interpolate(frame, [42, 54], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: COLORS.bg, opacity: fout }}>
      <div style={{ position: "relative", width: 1280, height: 720, transform: "scale(1.5)", transformOrigin: "center center" }}>
        <ThumbEP01 />
      </div>
    </AbsoluteFill>
  );
};

/* ── 鉤子 ── */
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, 2, 16, 0.8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 110, color: COLORS.ink }}>Claude Code</div>
        <div style={{ marginTop: 6, fontWeight: 800, fontSize: 150, color: COLORS.claudeDeep, lineHeight: 1 }}>= ?</div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 定義卡 ── */
const SURFACES = ["終端機 CLI", "VS Code", "桌面 App", "瀏覽器"];
const DefScene: React.FC<{ phase2At: number }> = ({ phase2At }) => {
  const frame = useCurrentFrame();
  const n = nodeById("claude-code")!;
  const color = categoryById("A").color;
  const head = enter(frame, 0, 14);
  const body = enter(frame, 12, 18);
  const p2 = enter(frame, phase2At, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1500, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, borderLeft: `12px solid ${color}`, borderRadius: RADIUS.lg, padding: "52px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: head, transform: `translateY(${(1 - head) * 14}px)` }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 36 }}>1</span>
          <span style={{ fontWeight: 800, fontSize: 56, color: COLORS.ink }}>{n.title}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 30, color: COLORS.muted }}>{n.titleEn}</span>
        </div>
        <div style={{ marginTop: 28, fontWeight: 600, fontSize: 42, lineHeight: 1.5, color: COLORS.inkSoft, opacity: body, transform: `translateY(${(1 - body) * 14}px)` }}>
          {script.def}
        </div>
        <div style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap", opacity: p2 }}>
          {SURFACES.map((s) => (
            <span key={s} style={{ padding: "10px 22px", borderRadius: RADIUS.pill, background: COLORS.bgAlt, border: `1.5px solid ${COLORS.borderStrong}`, fontWeight: 800, fontSize: 30, color: COLORS.inkSoft }}>{s}</span>
          ))}
        </div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "12px 24px", borderRadius: RADIUS.md, background: `${color}14`, border: `1.5px solid ${color}`, fontWeight: 800, fontSize: 34, color: COLORS.ink, opacity: p2 }}>
          ✦ 它會自己動手,不只是回你文字
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT.mono, fontSize: 24, color: COLORS.muted, opacity: body }}>
          📚 來源:{n.sourceUrl.replace("https://", "")}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 終端機 demo ── */
type TLine = { at: number; kind: "cmd" | "out" | "user"; text: string };
const TERM_LINES: TLine[] = [
  { at: 8, kind: "cmd", text: "cd daily-news" },
  { at: 22, kind: "cmd", text: "claude" },
  { at: 40, kind: "out", text: "✦ Welcome to Claude Code — ready." },
  { at: 60, kind: "user", text: "> 幫我把今天的 AI 新聞整理成摘要,寄到我信箱" },
];
const LOOP_STEPS = [
  { at: 95, label: "① 收集情境", c: COLORS.hi.blue },
  { at: 120, label: "② 採取行動", c: COLORS.hi.violet },
  { at: 145, label: "③ 驗證結果", c: COLORS.hi.emerald },
];
const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, 2, 16, 0.9);
  const done = enter(frame, 180, 14);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, width: 1500 }}>
        {/* 終端機視窗 */}
        <div style={{ borderRadius: RADIUS.lg, overflow: "hidden", border: `2px solid ${COLORS.term.bgTop}` }}>
          <div style={{ background: COLORS.term.bgTop, padding: "14px 20px", display: "flex", gap: 10 }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <span key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c }} />
            ))}
            <span style={{ marginLeft: 14, fontFamily: FONT.mono, fontSize: 22, color: COLORS.term.dim }}>zsh — daily-news</span>
          </div>
          <div style={{ background: COLORS.term.bg, padding: "26px 30px", minHeight: 300, fontFamily: FONT.monoCjk, fontSize: 30, lineHeight: 1.6 }}>
            {TERM_LINES.map((l) => {
              const op = enter(frame, l.at, 8);
              const col = l.kind === "cmd" ? COLORS.term.green : l.kind === "user" ? COLORS.term.yellow : COLORS.term.text;
              const prefix = l.kind === "cmd" ? "$ " : "";
              return (
                <div key={l.at} style={{ color: col, opacity: op }}>
                  {prefix}
                  {l.text}
                </div>
              );
            })}
          </div>
        </div>
        {/* 代理迴圈三步 */}
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          {LOOP_STEPS.map((s, idx) => {
            const op = appearScale(frame, s.at, 14, 0.8);
            return (
              <React.Fragment key={s.label}>
                <div style={{ ...op, padding: "16px 30px", borderRadius: RADIUS.pill, background: "#fff", border: `2px solid ${s.c}`, fontWeight: 800, fontSize: 34, color: COLORS.ink }}>{s.label}</div>
                {idx < LOOP_STEPS.length - 1 ? <span style={{ fontSize: 40, color: COLORS.faint, opacity: enter(frame, s.at + 8, 8) }}>→</span> : null}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop: 22, textAlign: "center", fontWeight: 800, fontSize: 34, color: COLORS.success, opacity: done }}>✓ 已自動整理並寄出摘要</div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 結尾 ── */
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appearScale(frame, 2, 16, 0.86);
  const pill = springPop(frame, fps, { delay: 16 });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 40, color: COLORS.muted }}>下一站</div>
        <div style={{ marginTop: 8, fontWeight: 800, fontSize: 88, color: COLORS.ink }}>EP02 · 代理迴圈</div>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 40, color: COLORS.muted }}>Agentic loop</div>
      </div>
      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, display: "flex", justifyContent: "center", ...pill }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "16px 40px 16px 16px", borderRadius: RADIUS.pill, background: GRADIENT.claude, border: "2px solid rgba(255,255,255,0.55)", boxShadow: `0 6px 0 ${COLORS.claudeDeep}` }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: "50%", background: "#fff", color: COLORS.claudeDeep, fontSize: 28, paddingLeft: 5 }}>▶</span>
          <span style={{ fontWeight: 800, fontSize: 44, color: "#fff" }}>訂閱 · 按讚 · 一路學到 30</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── spotlight bumper beats ── */
const node1Beat: Beat[] = [{ start: 16, inF: 14, hold: hereDur, outF: 2, focus: { type: "node", id: "claude-code" } }];
const node2Beat: Beat[] = [{ start: 16, inF: 14, hold: nextDur, outF: 2, focus: { type: "node", id: "agentic-loop" } }];

export const EP01Master: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <FlatBg />
      <Bgm src="bgm-crystal.mp3" volume={0.07} />
      <Sequence from={INTRO} durationInFrames={DURATION - INTRO} layout="none" name="badge"><EpBadge /></Sequence>

      <Sequence from={0} durationInFrames={INTRO + 2} layout="none" name="cover"><Cover /></Sequence>
      <Sequence from={hookFrom} durationInFrames={hookDur} layout="none" name="hook"><HookScene /></Sequence>
      <Sequence from={hereFrom} durationInFrames={hereDur} layout="none" name="here"><MapStage beats={node1Beat} /></Sequence>
      <Sequence from={defFrom} durationInFrames={def2From + def2Dur - defFrom} layout="none" name="def"><DefScene phase2At={defDur} /></Sequence>
      <Sequence from={demoFrom} durationInFrames={demoDur} layout="none" name="demo"><TerminalScene /></Sequence>
      <Sequence from={nextFrom} durationInFrames={nextDur} layout="none" name="next"><MapStage beats={node2Beat} /></Sequence>
      <Sequence from={outroFrom} durationInFrames={outroDur} layout="none" name="outro"><OutroScene /></Sequence>

      <Captions />
      <VoiceTrack />
    </AbsoluteFill>
  );
};
