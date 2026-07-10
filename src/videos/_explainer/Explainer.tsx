import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { appearUp, leave, springPop } from "../../shared-skills/anim";
import { Bgm, Sfx } from "../../shared-skills/audio";
import { CaptionTrack, Cue, ReelCaptionContext } from "../../shared-skills/captions";
import { Shell, Heading, KeyLine, Stamp, Terminal, Pipeline, BrandGlyph, ramp } from "./components";
import { accent as accentColor, PAL } from "./palette";
import type { SceneBlock, VideoSpec } from "./schema";

const FPS = 30;
const TRANSITION = 14;
const LEAD = 12, GAP = 10, TAIL = 18;
const fallbackSeconds = (t: string) => Math.max(2.2, Math.min(5.2, 0.6 + t.length * 0.135));

/** Time a scene's cues from the VO manifest (or char-count fallback). */
export function buildScene(ids: string[], script: Record<string, string>, vo: Record<string, number>, minDur = 0) {
  let t = LEAD;
  const cues: Cue[] = ids.map((id) => {
    const text = script[id] ?? id;
    const frames = Math.ceil((vo[id] ?? fallbackSeconds(text)) * FPS);
    const cue: Cue = { id, text, from: t, dur: frames };
    t += frames + GAP;
    return cue;
  });
  return { cues, dur: Math.max(t - GAP + TAIL, minDur) };
}

export const MIN_DUR: Record<SceneBlock["type"], number> = {
  cover: 300, terminal: 400, compare: 420, places: 410, pipeline: 380, image: 380, spotlight: 300, complaints: 520, outro: 560,
};

/** Per-block timed length (used by calculateMetadata + the master). */
export function sceneDurations(spec: VideoSpec, vo: Record<string, number>): number[] {
  return spec.scenes.map((b) => buildScene(b.cues, spec.script, vo, MIN_DUR[b.type]).dur);
}
export function explainerFrames(spec: VideoSpec, vo: Record<string, number>): number {
  const ds = sceneDurations(spec, vo);
  return ds.reduce((s, d) => s + d, 0) - TRANSITION * (ds.length - 1);
}

/* ── shared little pieces ─────────────────────────────────────────────── */
const CompareCard: React.FC<{ good: boolean; badge: string; code: string; note: string; delay: number }> = ({ good, badge, code, note, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  const c = good ? PAL.yes : PAL.no;
  return (
    <div style={{ ...a, width: 740, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2.5px solid ${c}`, boxShadow: SHADOW.lg, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", background: good ? PAL.yesBg : PAL.noBg, borderBottom: `1px solid ${c}33` }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>{good ? "✔" : "✘"}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: c }}>{badge}</span>
      </div>
      <div style={{ padding: "22px 26px" }}>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, background: COLORS.code.panel, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: "14px 18px", lineHeight: 1.4 }}>{code}</div>
        <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.muted, lineHeight: 1.4 }}>{note}</div>
      </div>
    </div>
  );
};

const PlaceCard: React.FC<{ icon: string; title: string; path: string; note: string; color: string; delay: number }> = ({ icon, title, path, note, color, delay }) => {
  const frame = useCurrentFrame();
  const a = appearUp(frame, delay, 18, 24);
  return (
    <div style={{ ...a, width: 480, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${color}`, boxShadow: SHADOW.lg, padding: "26px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 56, height: 56, borderRadius: "50%", background: `${color}18`, border: `2px solid ${color}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{icon}</span>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{title}</span>
      </div>
      <div style={{ fontFamily: FONT.monoCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.inkSoft, background: COLORS.code.panel, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md, padding: "12px 16px" }}>{path}</div>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color, lineHeight: 1.35 }}>{note}</div>
    </div>
  );
};

/** 真實抱怨「泡泡」卡：頭像 + 屏蔽帳號 + 平台標 + 英文原文 + 小字中譯。 */
const ComplaintCard: React.FC<{
  handle: string; platform: string; textEn: string; textZh: string; color: string; x: number; y: number; rot: number; delay: number;
}> = ({ handle, platform, textEn, textZh, color, x, y, rot, delay }) => {
  const frame = useCurrentFrame();
  const p = springPop(frame, FPS, { delay, from: 0.6, dist: 18 });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 552, opacity: p.opacity, transform: `${p.transform} rotate(${rot}deg)`, transformOrigin: "center", filter: "drop-shadow(0 18px 36px rgba(15,23,42,0.18))" }}>
      <div style={{ background: COLORS.surface, borderRadius: RADIUS.lg, border: `1.5px solid ${COLORS.border}`, padding: "18px 22px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
          <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: "50%", background: color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 20 }}>{handle.slice(0, 1).toUpperCase()}</span>
          <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 23, color: COLORS.ink }}>{handle}</span>
          <span style={{ marginLeft: "auto", fontFamily: FONT.ui, fontWeight: 800, fontSize: 18, color, background: `${color}1c`, padding: "4px 12px", borderRadius: RADIUS.pill }}>{platform}</span>
        </div>
        <div style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: 26, lineHeight: 1.36, color: COLORS.ink }}>&ldquo;{textEn}&rdquo;</div>
        <div style={{ marginTop: 9, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 21, color: COLORS.muted, lineHeight: 1.35 }}>{textZh}</div>
      </div>
    </div>
  );
};

/* ── one scene = one block, timed by its cues ─────────────────────────── */
const BlockScene: React.FC<{ block: SceneBlock; cues: Cue[]; dur: number; spec: VideoSpec; vo: Record<string, number>; voDir: string }> = ({ block, cues, dur, spec, vo, voDir }) => {
  const frame = useCurrentFrame();
  const hideBars = React.useContext(ReelCaptionContext);
  const at = (i: number) => cues[Math.min(i, cues.length - 1)].from;
  const caps = <CaptionTrack cues={cues} vo={vo} voDir={voDir} hideBars={hideBars} />;
  const acc = (k?: string) => accentColor(k);

  if (block.type === "cover") {
    // 封面卡第 0 幀即完整亮相（門面＝縮圖同款），符合「封面 0 秒亮相」鐵則；
    // 靠字幕＋旁白提供動態，不再讓元素逐個延遲組裝（否則開場約 8 秒都在長封面）。
    const title = appearUp(frame, -30, 20, 26);
    const termIn = appearUp(frame, -30, 18, 26);
    const chipsIn = ramp(frame, -30, -1);
    const sub = appearUp(frame, -30, 18, 20);
    return (
      <Shell name={spec.brand.name} durationInFrames={dur} showChrome={false} accent={acc("blue")} seed="cover">
        <div style={{ position: "absolute", left: 0, right: 0, top: 116, textAlign: "center", ...title }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 100, letterSpacing: -2, color: COLORS.ink, lineHeight: 1.06 }}>
            <span style={{ fontFamily: FONT.mono }}>{block.titlePre}</span>{" "}
            <span style={{ background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{block.titlePost}</span>
          </div>
        </div>
        {block.terminal ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", ...termIn }}>
            <Terminal title={block.terminal.title} lines={block.terminal.lines} width={1120} start={-200} step={18} />
          </div>
        ) : null}
        {block.chips?.length ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 712, display: "flex", justifyContent: "center", gap: 18, opacity: chipsIn, transform: `translateY(${(1 - chipsIn) * 16}px)` }}>
            {block.chips.map((c, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${acc(c.accent)}66`, boxShadow: SHADOW.md }}>
                {c.n ? <span style={{ width: 30, height: 30, borderRadius: "50%", background: acc(c.accent), color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.small }}>{c.n}</span> : null}
                <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: COLORS.ink }}>{c.t}</span>
              </div>
            ))}
          </div>
        ) : null}
        {block.index?.length ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 322, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            {block.index.map((it, i) => {
              const col = acc(it.accent);
              const ri = appearUp(frame, 150 + i * 12, 14, 18);
              return (
                <div key={i} style={{ ...ri, width: 940, display: "flex", alignItems: "center", gap: 20, padding: "14px 26px", borderRadius: RADIUS.lg, background: COLORS.surface, border: `1.5px solid ${col}55`, boxShadow: SHADOW.sm }}>
                  <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: col, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.body }}>{it.n}</span>
                  <span style={{ flexShrink: 0, fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink, letterSpacing: -0.5 }}>{it.title}</span>
                  <span style={{ marginLeft: "auto", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.small, color: COLORS.muted, textAlign: "right" }}>{it.tag}</span>
                </div>
              );
            })}
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: 836, textAlign: "center", ...sub }}>
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>{spec.brand.tagline}</span>
        </div>
        <Sfx src="pop" at={2} volume={0.4} />
        {caps}
      </Shell>
    );
  }

  if (block.type === "terminal") {
    return (
      <Shell name={spec.brand.name} durationInFrames={dur} accent={acc(block.accent)} kicker={block.kicker} seed={block.kicker}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
          <Heading zh={block.headingZh} en={block.headingEn} delay={at(0)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" }}>
          <Terminal title={block.terminal.title} lines={block.terminal.lines} width={1240} start={40} step={16} />
        </div>
        {block.stamps?.length ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", gap: 18 }}>
            {block.stamps.map((s, i) => <Stamp key={i} kind={s.kind} text={s.text} at={at(s.atCue)} rotate={i % 2 ? 2 : -2} />)}
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 180 }}>
          <KeyLine text={block.keyline} tone={acc(block.accent)} delay={at(block.keylineAtCue)} />
        </div>
        <Sfx src="ding" at={at(block.keylineAtCue)} volume={0.3} />
        {caps}
      </Shell>
    );
  }

  if (block.type === "compare") {
    return (
      <Shell name={spec.brand.name} durationInFrames={dur} accent={acc(block.accent)} kicker={block.kicker} seed={block.kicker}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
          <Heading zh={block.headingZh} en={block.headingEn} delay={at(0)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", gap: 40 }}>
          <CompareCard good={false} badge={block.bad.badge} code={block.bad.code} note={block.bad.note} delay={at(1)} />
          <CompareCard good badge={block.good.badge} code={block.good.code} note={block.good.note} delay={at(1) + 26} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 180 }}>
          <KeyLine text={block.keyline} tone={acc(block.accent)} delay={at(block.keylineAtCue)} />
        </div>
        <Sfx src="pop" at={at(1)} volume={0.32} />
        {caps}
      </Shell>
    );
  }

  if (block.type === "places") {
    return (
      <Shell name={spec.brand.name} durationInFrames={dur} accent={acc(block.accent)} kicker={block.kicker} seed={block.kicker}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
          <Heading zh={block.headingZh} en={block.headingEn} delay={at(0)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", gap: 28 }}>
          {block.items.map((it, i) => <PlaceCard key={i} icon={it.icon} title={it.title} path={it.path} note={it.note} color={acc(it.accent)} delay={at(Math.min(i + 1, block.cues.length - 1))} />)}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 180 }}>
          <KeyLine text={block.keyline} tone={acc(block.accent)} delay={at(block.keylineAtCue)} />
        </div>
        <Sfx src="pop" at={at(1)} volume={0.3} />
        {caps}
      </Shell>
    );
  }

  if (block.type === "pipeline") {
    const nodes = block.nodes.map((n) => ({ icon: n.icon, label: n.label, sub: n.sub, color: acc(n.accent ?? block.accent) }));
    return (
      <Shell name={spec.brand.name} durationInFrames={dur} accent={acc(block.accent)} kicker={block.kicker} seed={block.kicker}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center" }}>
          <Heading zh={block.headingZh} en={block.headingEn} delay={at(0)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center" }}>
          <Pipeline nodes={nodes} start={at(0) + 20} step={20} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 180 }}>
          <KeyLine text={block.keyline} tone={acc(block.accent)} delay={at(block.keylineAtCue)} />
        </div>
        <Sfx src="whoosh" at={at(0) + 20} volume={0.3} />
        {caps}
      </Shell>
    );
  }

  if (block.type === "image") {
    const fc = block.focus;
    // Ken Burns zoom: start at frame for fc.atCue, ramp scale 1→fc.scale over ~24f.
    const zStart = fc ? at(fc.atCue) : 0;
    const z = fc ? interpolate(frame, [zStart, zStart + 24], [1, fc.scale], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
    const ox = fc ? fc.x * 100 : 50;
    const oy = fc ? fc.y * 100 : 50;
    return (
      <Shell name={spec.brand.name} durationInFrames={dur} accent={acc(block.accent)} kicker={block.kicker} seed={block.kicker}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
          <Heading zh={block.headingZh} en={block.headingEn} delay={at(0)} />
        </div>
        <div style={{ position: "absolute", left: 130, right: 130, top: 250, bottom: block.keyline ? 200 : 120, borderRadius: RADIUS.lg, overflow: "hidden", border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.lg, background: COLORS.surface, ...appearUp(frame, at(0) + 8, 16, 20) }}>
          <Img src={staticFile(block.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: `${ox}% ${oy}%` }} />
          {block.annotations?.map((an, i) => {
            const ap = springPop(frame, FPS, { delay: at(an.atCue), from: 0.5, dist: 12 });
            return (
              <div key={i} style={{ position: "absolute", left: `${an.x * 100}%`, top: `${an.y * 100}%`, opacity: ap.opacity, transform: `translate(-50%,-50%) ${ap.transform}` }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: RADIUS.pill, background: acc(block.accent), color: "#fff", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, boxShadow: SHADOW.md, whiteSpace: "nowrap" }}>{an.text}</div>
              </div>
            );
          })}
        </div>
        {block.caption ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: block.keyline ? 150 : 70, textAlign: "center" }}>
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.small, color: COLORS.muted }}>{block.caption}</span>
          </div>
        ) : null}
        {block.keyline ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 70 }}>
            <KeyLine text={block.keyline} tone={acc(block.accent)} delay={at(Math.min(1, cues.length - 1))} size={TYPE.body} />
          </div>
        ) : null}
        {caps}
      </Shell>
    );
  }

  if (block.type === "spotlight") {
    const col = acc(block.accent);
    const card = appearUp(frame, at(0), 18, 24);
    return (
      <Shell name={spec.brand.name} durationInFrames={dur} accent={col} kicker={`${block.no} · ${block.kicker}`} seed={block.titleEn}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 196, display: "flex", justifyContent: "center" }}>
          <div style={{ ...card, position: "relative", width: 1200, borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${col}`, boxShadow: SHADOW.lg, padding: "52px 64px 56px" }}>
            <div aria-hidden style={{ position: "absolute", top: 26, right: 44, fontFamily: FONT.ui, fontWeight: 800, fontSize: 150, lineHeight: 1, color: `${col}1f`, letterSpacing: -4 }}>{block.no}</div>
            <div style={{ fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.display, letterSpacing: -2, color: COLORS.ink, lineHeight: 1.04 }}>{block.titleEn}</div>
            <div style={{ marginTop: 14, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: col, letterSpacing: -0.3 }}>{block.subZh}</div>
            <div style={{ marginTop: 18, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.body, color: COLORS.muted, lineHeight: 1.5, maxWidth: 980 }}>{block.desc}</div>
            <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: col }} />
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, letterSpacing: 1, color: col }}>核心特點</span>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              {block.bullets.map((b, i) => {
                const bi = appearUp(frame, at(Math.min(i + 1, cues.length - 1)), 14, 18);
                return (
                  <div key={i} style={{ ...bi, display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ width: 30, height: 30, flexShrink: 0, borderRadius: "50%", background: `${col}16`, border: `2px solid ${col}`, color: col, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: TYPE.tiny }}>✓</span>
                    <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.inkSoft, lineHeight: 1.3 }}>{b}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {block.keyline ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 110 }}>
            <KeyLine text={block.keyline} tone={col} delay={at(cues.length - 1)} size={TYPE.body} />
          </div>
        ) : null}
        <Sfx src="pop" at={at(0) + 8} volume={0.3} />
        {caps}
      </Shell>
    );
  }

  if (block.type === "complaints") {
    return (
      <Shell name={spec.brand.name} durationInFrames={dur} accent={acc(block.accent)} kicker={block.kicker} seed={block.kicker}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 64, display: "flex", justifyContent: "center", zIndex: 50 }}>
          <Heading zh={block.headingZh} en={block.headingEn} delay={at(0)} />
        </div>
        {block.items.map((it, i) => (
          <ComplaintCard
            key={i}
            handle={it.handle}
            platform={it.platform}
            textEn={it.textEn}
            textZh={it.textZh}
            color={acc(it.accent)}
            x={it.x * 1920}
            y={it.y * 1080}
            rot={it.rot}
            delay={at(Math.min(it.atCue, cues.length - 1)) + (i % 3) * 5}
          />
        ))}
        <Sfx src="pop" at={at(1)} volume={0.3} />
        <Sfx src="pop" at={at(Math.min(block.cues.length - 1, cues.length - 1))} volume={0.34} />
        {caps}
      </Shell>
    );
  }

  // outro
  const cardsLeave = leave(frame, at(block.cues.length - 1) - 6, 14);
  return (
    <Shell name={spec.brand.name} durationInFrames={dur} showChrome={false} accent={acc("blue")} seed="outro">
      <div style={{ position: "absolute", left: 0, right: 0, top: 86, display: "flex", justifyContent: "center", opacity: cardsLeave }}>
        <div style={{ ...appearUp(frame, at(0), 18, 22), textAlign: "center" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h1, letterSpacing: -1, color: COLORS.ink }}>{block.headingZh}</div>
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontWeight: 500, fontSize: TYPE.small, color: COLORS.muted }}>{block.headingEn}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 228, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: cardsLeave, transform: `translateY(${(1 - cardsLeave) * -20}px)` }}>
        {block.cards.map((c, i) => {
          const a = appearUp(frame, at(Math.min(i + 1, block.cues.length - 1)), 18, 24);
          const col = acc(c.accent);
          return (
            <div key={i} style={{ ...a, width: 1480, display: "flex", alignItems: "center", gap: 24, padding: "22px 34px", borderRadius: RADIUS.xl, background: COLORS.surface, border: `2px solid ${col}55`, boxShadow: SHADOW.lg }}>
              <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: "50%", background: `${col}16`, border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{c.emoji}</div>
              <div style={{ width: 48, flexShrink: 0, fontFamily: FONT.ui, fontWeight: 800, fontSize: 50, color: col, lineHeight: 1 }}>{i + 1}</div>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.body, color: COLORS.ink, lineHeight: 1.34 }}>{c.text}</span>
            </div>
          );
        })}
      </div>
      <OutroEnd frame={frame} at={at(block.cues.length - 1)} name={spec.brand.name} cuesLen={block.cues.length} />
      <Sfx src="pop" at={at(block.cues.length - 1) + 10} volume={0.34} />
      {caps}
    </Shell>
  );
};

const OutroEnd: React.FC<{ frame: number; at: number; name: string; cuesLen: number }> = ({ frame, at, name }) => {
  if (frame < at - 16) return null;
  const a = appearUp(frame, at, 18, 26);
  const ctas = [{ icon: "👍", t: "按讚", c: PAL.yes }, { icon: "🔔", t: "訂閱", c: COLORS.error }, { icon: "🔗", t: "分享", c: COLORS.remotion }];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: ramp(frame, at - 10, at + 8) }}>
      <div style={{ ...a, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 96, letterSpacing: -1, color: COLORS.ink }}>感謝 <span style={{ background: GRADIENT.claude, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>觀看</span>！</div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: TYPE.h3, color: COLORS.muted }}>覺得有幫助，就用一個動作支持 👇</div>
        <div style={{ display: "flex", gap: 26 }}>
          {ctas.map((cta) => (
            <div key={cta.t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 36px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `2px solid ${cta.c}`, boxShadow: SHADOW.md }}>
              <span style={{ fontSize: 40 }}>{cta.icon}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h2, color: cta.c }}>{cta.t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 30px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.sm }}>
          <BrandGlyph size={28} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{name}</span>
        </div>
      </div>
    </div>
  );
};

/** The whole video, data-driven from a VideoSpec + its VO manifest. */
export const Explainer: React.FC<{ spec: VideoSpec; vo: Record<string, number>; voDir: string }> = ({ spec, vo, voDir }) => {
  const built = spec.scenes.map((block) => ({ block, ...buildScene(block.cues, spec.script, vo, MIN_DUR[block.type]) }));
  const children: React.ReactNode[] = [];
  built.forEach((b, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={b.dur}>
        <BlockScene block={b.block} cues={b.cues} dur={b.dur} spec={spec} vo={vo} voDir={voDir} />
      </TransitionSeries.Sequence>,
    );
    if (i < built.length - 1) {
      children.push(<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />);
    }
  });
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Bgm src="bgm-piano.mp3" volume={0.13} />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
