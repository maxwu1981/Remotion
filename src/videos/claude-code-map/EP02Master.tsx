import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { appearScale, enter, springPop } from "../../shared-skills/anim";
import { Narration } from "../../shared-skills/components/Narration";
import { Bgm } from "../../shared-skills/audio";
import { ThumbEP02 } from "./ThumbEP02";
import { MapStage, type Beat } from "./MapStage";
import { nodeById, categoryById } from "./tree";
import VO from "./ep02-vo.json";
import SCRIPT from "./ep02-script.json";

export const FPS = 30;
const vo = VO as Record<string, number>;
const script = SCRIPT as Record<string, string>;
const VO_DIR = "vo/claude-code-map-ep02";
const NODE = "agentic-loop";
const NEXT_NODE = "interfaces";

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
export const getEp02Frames = () => DURATION;

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
      <div style={{ maxWidth: 1640, padding: "16px 40px", borderRadius: RADIUS.pill, background: "#FFFFFF", border: `1.5px solid ${COLORS.borderStrong}`, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, color: COLORS.ink, textAlign: "center" }}>{text}</div>
    </div>
  );
};
const Captions: React.FC = () => (
  <>
    {CUES.filter((c) => c.caption).map((c) => (
      <Sequence key={c.id} from={c.from} durationInFrames={c.dur} layout="none" name={`cap-${c.id}`}><CapLine text={script[c.id]} dur={c.dur} /></Sequence>
    ))}
  </>
);
const VoiceTrack: React.FC = () => (
  <>
    {CUES.map((c) => (
      <Sequence key={c.id} from={c.from} durationInFrames={voF(c.id) + 8} layout="none" name={`vo-${c.id}`}><Narration id={c.id} dir={VO_DIR} /></Sequence>
    ))}
  </>
);
const EpBadge: React.FC = () => (
  <div style={{ position: "absolute", top: 50, left: 60, display: "flex", alignItems: "center", gap: 12 }}>
    <span style={{ padding: "6px 16px", borderRadius: RADIUS.pill, background: categoryById("A").color, color: "#fff", fontWeight: 800, fontSize: 26 }}>EP02</span>
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 28, color: COLORS.muted }}><span style={{ fontFamily: FONT.mono }}>Claude Code</span> 新手地圖</span>
  </div>
);

/* ── 封面亮相(第 0 秒 ThumbEP02 全幅,frame 0 即滿版;結束前淡出接內容) ── */
const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const fout = interpolate(frame, [42, 54], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: COLORS.bg, opacity: fout }}>
      <div style={{ position: "relative", width: 1280, height: 720, transform: "scale(1.5)", transformOrigin: "center center" }}>
        <ThumbEP02 />
      </div>
    </AbsoluteFill>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, 2, 16, 0.8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 96, color: COLORS.ink, lineHeight: 1.15 }}>它怎麼<span style={{ color: COLORS.claudeDeep }}>自己</span>做完?</div>
        <div style={{ marginTop: 14, fontFamily: FONT.mono, fontWeight: 700, fontSize: 44, color: COLORS.muted }}>the agentic loop</div>
      </div>
    </AbsoluteFill>
  );
};

const PHASES = [
  { t: "① 收集情境", e: "gather context", c: COLORS.hi.blue },
  { t: "② 採取行動", e: "take action", c: COLORS.hi.violet },
  { t: "③ 驗證結果", e: "verify", c: COLORS.hi.emerald },
];
const DefScene: React.FC<{ phase2At: number }> = ({ phase2At }) => {
  const frame = useCurrentFrame();
  const n = nodeById(NODE)!;
  const color = categoryById("A").color;
  const head = enter(frame, 0, 14);
  const body = enter(frame, 12, 18);
  const p2 = enter(frame, phase2At, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1500, background: COLORS.surface, border: `2px solid ${COLORS.borderStrong}`, borderLeft: `12px solid ${color}`, borderRadius: RADIUS.lg, padding: "52px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: head, transform: `translateY(${(1 - head) * 14}px)` }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 36 }}>2</span>
          <span style={{ fontWeight: 800, fontSize: 52, color: COLORS.ink }}>{n.title}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 28, color: COLORS.muted }}>{n.titleEn}</span>
        </div>
        <div style={{ marginTop: 26, fontWeight: 600, fontSize: 40, lineHeight: 1.5, color: COLORS.inkSoft, opacity: body, transform: `translateY(${(1 - body) * 14}px)` }}>{script.def}</div>
        <div style={{ marginTop: 28, display: "flex", gap: 14, opacity: p2 }}>
          {PHASES.map((p) => (
            <span key={p.t} style={{ padding: "12px 24px", borderRadius: RADIUS.pill, background: "#fff", border: `2px solid ${p.c}`, fontWeight: 800, fontSize: 32, color: COLORS.ink }}>{p.t}</span>
          ))}
        </div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "12px 24px", borderRadius: RADIUS.md, background: `${color}14`, border: `1.5px solid ${color}`, fontWeight: 800, fontSize: 32, color: COLORS.ink, opacity: p2 }}>✦ 你隨時能按 Esc 打斷、改方向</div>
        <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: 24, color: COLORS.muted, opacity: body }}>📚 來源:{n.sourceUrl.replace("https://", "")}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ── demo:代理迴圈動畫 ── */
const LOG = [
  { at: 70, t: "🔍 搜尋:怎麼拿 YouTube/新聞資料" },
  { at: 110, t: "🛠️ 寫一小段程式去抓" },
  { at: 150, t: "▶ 執行" },
  { at: 185, t: "✗ 失敗:被 API 限流", c: COLORS.error },
  { at: 215, t: "🔧 自我修正:改用批次端點" },
  { at: 250, t: "✓ 完成:摘要已產生", c: COLORS.success },
];
const LoopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, 2, 16, 0.92);
  const activeIdx = Math.floor(frame / 26) % 3;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, width: 1500, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        {/* 三階段循環 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {PHASES.map((p, idx) => {
            const on = idx === activeIdx;
            return (
              <React.Fragment key={p.t}>
                <div style={{ padding: "22px 34px", borderRadius: RADIUS.lg, background: on ? p.c : "#fff", border: `3px solid ${p.c}`, color: on ? "#fff" : COLORS.ink, transform: `scale(${on ? 1.06 : 1})`, textAlign: "center", minWidth: 240 }}>
                  <div style={{ fontWeight: 800, fontSize: 40 }}>{p.t}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 22, opacity: 0.8 }}>{p.e}</div>
                </div>
                {idx < PHASES.length - 1 ? <span style={{ fontSize: 50, color: COLORS.faint }}>→</span> : null}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ fontWeight: 800, fontSize: 30, color: COLORS.muted }}>↻ 不斷循環 · 模型推理 + 工具動作 · 自我修正直到完成</div>
        {/* 例子 log */}
        <div style={{ width: 1100, background: COLORS.term.bg, borderRadius: RADIUS.lg, padding: "24px 30px", fontFamily: FONT.monoCjk, fontSize: 28, lineHeight: 1.7, minHeight: 240 }}>
          {LOG.map((l) => (
            <div key={l.at} style={{ color: l.c || COLORS.term.text, opacity: enter(frame, l.at, 8) }}>{l.t}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appearScale(frame, 2, 16, 0.86);
  const pill = springPop(frame, fps, { delay: 16 });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 40, color: COLORS.muted }}>下一站</div>
        <div style={{ marginTop: 8, fontWeight: 800, fontSize: 88, color: COLORS.ink }}>EP03 · 在哪裡用</div>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 40, color: COLORS.muted }}>CLI / IDE / Desktop / Web</div>
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

const node2Beat: Beat[] = [{ start: 16, inF: 14, hold: hereDur, outF: 2, focus: { type: "node", id: NODE } }];
const node3Beat: Beat[] = [{ start: 16, inF: 14, hold: nextDur, outF: 2, focus: { type: "node", id: NEXT_NODE } }];

export const EP02Master: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
    <FlatBg />
    <Bgm src="bgm-crystal.mp3" volume={0.07} />
    <Sequence from={INTRO} durationInFrames={DURATION - INTRO} layout="none" name="badge"><EpBadge /></Sequence>
    <Sequence from={0} durationInFrames={INTRO + 2} layout="none" name="cover"><Cover /></Sequence>
    <Sequence from={hookFrom} durationInFrames={hookDur} layout="none" name="hook"><HookScene /></Sequence>
    <Sequence from={hereFrom} durationInFrames={hereDur} layout="none" name="here"><MapStage beats={node2Beat} /></Sequence>
    <Sequence from={defFrom} durationInFrames={def2From + def2Dur - defFrom} layout="none" name="def"><DefScene phase2At={defDur} /></Sequence>
    <Sequence from={demoFrom} durationInFrames={demoDur} layout="none" name="demo"><LoopScene /></Sequence>
    <Sequence from={nextFrom} durationInFrames={nextDur} layout="none" name="next"><MapStage beats={node3Beat} /></Sequence>
    <Sequence from={outroFrom} durationInFrames={outroDur} layout="none" name="outro"><OutroScene /></Sequence>
    <Captions />
    <VoiceTrack />
  </AbsoluteFill>
);
