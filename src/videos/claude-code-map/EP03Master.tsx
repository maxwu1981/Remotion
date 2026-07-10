import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS } from "../../shared-skills/theme";
import { appearScale, enter, springPop } from "../../shared-skills/anim";
import { Narration } from "../../shared-skills/components/Narration";
import { Bgm } from "../../shared-skills/audio";
import { ThumbEP03 } from "./ThumbEP03";
import { MapStage, type Beat } from "./MapStage";
import { nodeById, categoryById } from "./tree";
import VO from "./ep03-vo.json";
import SCRIPT from "./ep03-script.json";

export const FPS = 30;
const vo = VO as Record<string, number>;
const script = SCRIPT as Record<string, string>;
const VO_DIR = "vo/claude-code-map-ep03";
const NODE = "interfaces";
const NEXT_NODE = "install-login";

const voF = (id: string): number => {
  const s = vo[id];
  if (s) return Math.ceil(s * FPS);
  return Math.ceil(Math.max(1.6, (script[id] ?? "").length / 5.2) * FPS);
};

const PAD = 12, INTRO = 54, TAIL = 24;
const hookFrom = INTRO;
const hookDur = voF("hook") + PAD;
const hereFrom = hookFrom + hookDur;
const hereDur = Math.max(voF("here") + PAD, 120);
const defFrom = hereFrom + hereDur;
const defDur = voF("def") + PAD;
const def2From = defFrom + defDur;
const def2Dur = voF("def2") + PAD;
const demoFrom = def2From + def2Dur;
const demoDur = voF("demo") + 50;
const nextFrom = demoFrom + demoDur;
const nextDur = Math.max(voF("next") + PAD, 120);
const outroFrom = nextFrom + nextDur;
const outroDur = Math.max(voF("outro") + 44, 150);
export const DURATION = outroFrom + outroDur + TAIL;
export const getEp03Frames = () => DURATION;

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
const Captions: React.FC = () => (<>{CUES.filter((c) => c.caption).map((c) => (<Sequence key={c.id} from={c.from} durationInFrames={c.dur} layout="none" name={`cap-${c.id}`}><CapLine text={script[c.id]} dur={c.dur} /></Sequence>))}</>);
const VoiceTrack: React.FC = () => (<>{CUES.map((c) => (<Sequence key={c.id} from={c.from} durationInFrames={voF(c.id) + 8} layout="none" name={`vo-${c.id}`}><Narration id={c.id} dir={VO_DIR} /></Sequence>))}</>);
const EpBadge: React.FC = () => (
  <div style={{ position: "absolute", top: 50, left: 60, display: "flex", alignItems: "center", gap: 12 }}>
    <span style={{ padding: "6px 16px", borderRadius: RADIUS.pill, background: categoryById("A").color, color: "#fff", fontWeight: 800, fontSize: 26 }}>EP03</span>
    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 28, color: COLORS.muted }}><span style={{ fontFamily: FONT.mono }}>Claude Code</span> 新手地圖</span>
  </div>
);
/* ── 封面亮相(第 0 秒 ThumbEP03 全幅,frame 0 即滿版;結束前淡出接內容) ── */
const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const fout = interpolate(frame, [42, 54], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: COLORS.bg, opacity: fout }}>
      <div style={{ position: "relative", width: 1280, height: 720, transform: "scale(1.5)", transformOrigin: "center center" }}>
        <ThumbEP03 />
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
        <div style={{ fontWeight: 800, fontSize: 96, color: COLORS.ink, lineHeight: 1.15 }}>要在<span style={{ color: COLORS.claudeDeep }}>哪裡</span>用?</div>
        <div style={{ marginTop: 14, fontFamily: FONT.mono, fontWeight: 700, fontSize: 44, color: COLORS.muted }}>CLI · IDE · Desktop · Web</div>
      </div>
    </AbsoluteFill>
  );
};

const SURFACES = [
  { icon: "💻", t: "終端機 CLI", note: "完整功能", c: COLORS.hi.blue },
  { icon: "🧩", t: "VS Code / JetBrains", note: "inline 對照、@檔案", c: COLORS.hi.violet },
  { icon: "🖥️", t: "桌面 App", note: "視覺化、多開、排程", c: COLORS.hi.amber },
  { icon: "🌐", t: "瀏覽器 Web", note: "免本機、雲端、關機也跑", c: COLORS.hi.emerald },
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
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 36 }}>3</span>
          <span style={{ fontWeight: 800, fontSize: 52, color: COLORS.ink }}>{n.title}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 28, color: COLORS.muted }}>{n.titleEn}</span>
        </div>
        <div style={{ marginTop: 26, fontWeight: 600, fontSize: 40, lineHeight: 1.5, color: COLORS.inkSoft, opacity: body, transform: `translateY(${(1 - body) * 14}px)` }}>{script.def}</div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "12px 24px", borderRadius: RADIUS.md, background: `${color}14`, border: `1.5px solid ${color}`, fontWeight: 800, fontSize: 32, color: COLORS.ink, opacity: p2 }}>✦ CLAUDE.md / 設定 / MCP 跨介面共用,換地方不用重設</div>
        <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: 24, color: COLORS.muted, opacity: body }}>📚 來源:{n.sourceUrl.replace("https://", "")}</div>
      </div>
    </AbsoluteFill>
  );
};

const SurfacesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = appearScale(frame, 2, 16, 0.92);
  const activeIdx = Math.floor(frame / 30) % SURFACES.length;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...a, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", gap: 22 }}>
          {SURFACES.map((s, idx) => {
            const on = idx === activeIdx;
            return (
              <div key={s.t} style={{ width: 320, height: 300, borderRadius: RADIUS.lg, background: "#fff", border: `3px solid ${on ? s.c : COLORS.borderStrong}`, transform: `scale(${on ? 1.05 : 1})`, padding: "30px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }}>
                <div style={{ fontSize: 88 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 36, color: COLORS.ink }}>{s.t}</div>
                <div style={{ fontWeight: 600, fontSize: 26, color: COLORS.muted }}>{s.note}</div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "14px 34px", borderRadius: RADIUS.pill, background: categoryById("A").color, color: "#fff", fontWeight: 800, fontSize: 34 }}>同一引擎 · CLAUDE.md / 設定 / MCP 共用</div>
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
        <div style={{ marginTop: 8, fontWeight: 800, fontSize: 88, color: COLORS.ink }}>EP04 · 安裝、登入與方案</div>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 40, color: COLORS.muted }}>Install · Login · Plans</div>
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

const node3Beat: Beat[] = [{ start: 16, inF: 14, hold: hereDur, outF: 2, focus: { type: "node", id: NODE } }];
const node4Beat: Beat[] = [{ start: 16, inF: 14, hold: nextDur, outF: 2, focus: { type: "node", id: NEXT_NODE } }];

export const EP03Master: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
    <FlatBg />
    <Bgm src="bgm-crystal.mp3" volume={0.07} />
    <Sequence from={INTRO} durationInFrames={DURATION - INTRO} layout="none" name="badge"><EpBadge /></Sequence>
    <Sequence from={0} durationInFrames={INTRO + 2} layout="none" name="cover"><Cover /></Sequence>
    <Sequence from={hookFrom} durationInFrames={hookDur} layout="none" name="hook"><HookScene /></Sequence>
    <Sequence from={hereFrom} durationInFrames={hereDur} layout="none" name="here"><MapStage beats={node3Beat} /></Sequence>
    <Sequence from={defFrom} durationInFrames={def2From + def2Dur - defFrom} layout="none" name="def"><DefScene phase2At={defDur} /></Sequence>
    <Sequence from={demoFrom} durationInFrames={demoDur} layout="none" name="demo"><SurfacesScene /></Sequence>
    <Sequence from={nextFrom} durationInFrames={nextDur} layout="none" name="next"><MapStage beats={node4Beat} /></Sequence>
    <Sequence from={outroFrom} durationInFrames={outroDur} layout="none" name="outro"><OutroScene /></Sequence>
    <Captions />
    <VoiceTrack />
  </AbsoluteFill>
);
