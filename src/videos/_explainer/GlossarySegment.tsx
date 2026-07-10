import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import type { VideoSpec } from "./schema";
import { ExplainerObsidian, explainerObsidianFrames } from "./ExplainerObsidian";
import { WhiteBg, ACC, darkCard, Glare, emberClip, rgba, accOf, hairline } from "./obsidian-glass";

/**
 * 名詞小教室 — 每日影片工廠可選的通用片尾段（同時當 9:16 Short）。
 * 資料驅動：讀 specs/current.glossary.json（motifEmoji/introHook/terms/script）＋
 * current.glossary.vo.json（每句秒數，make-vo-spec.py 產）。
 * 形式源自 2026-07-08 dotfiles/GNU Stow 片老闆驗證過的手刻版
 * （src/videos/dotfiles-stow-glossary/Glossary.tsx，原片不動）。
 * 每卡「比喻→白話定義→你會在哪看到它」，一次一張置中，16:9 與 9:16 都適用。
 * terms 為空陣列＝今天不做名詞段，ExplainerWithGlossary 自動退化成純主片。
 * 完全不動 _explainer 既有合約（schema/Explainer/ExplainerObsidian），VF-Daily 不受影響。
 */

export type GlossaryTerm = {
  big: string; sub: string; emoji: string; metaphor: string; def: string; where: string; accent: string;
};

export type GlossarySpec = {
  /** 貫穿整段的比喻 motif emoji（品牌膠囊＋收尾卡），預設 📖 */
  motifEmoji?: string;
  /** 開場卡鉤子（\n 換行），點出今天用什麼比喻 */
  introHook?: string;
  terms: GlossaryTerm[];
  /** 卡 id → 旁白句：g0=開場、g1..gN=每詞、g(N+1)=收尾（給 make-vo-spec.py 生 VO） */
  script: Record<string, string>;
};

const FPS = 30;
const LEAD = 14, TAIL = 16, XFADE = 12;

type Card =
  | { id: string; kind: "intro" }
  | { id: string; kind: "term"; no: number; term: GlossaryTerm }
  | { id: string; kind: "closing" };

const buildCards = (spec: GlossarySpec): Card[] => [
  { id: "g0", kind: "intro" },
  ...spec.terms.map((t, i): Card => ({ id: `g${i + 1}`, kind: "term", no: i + 1, term: t })),
  { id: `g${spec.terms.length + 1}`, kind: "closing" },
];

const cardFrames = (id: string, vo: Record<string, number>) =>
  Math.ceil((vo[id] ?? 3) * FPS) + LEAD + TAIL;

export function glossarySegmentFrames(spec: GlossarySpec, vo: Record<string, number>): number {
  if (spec.terms.length === 0) return FPS; // 停用時的 placeholder，讓 Studio 不炸；wrapper 不會排入這段
  const cards = buildCards(spec);
  const total = cards.reduce((s, c) => s + cardFrames(c.id, vo), 0);
  return total - XFADE * (cards.length - 1);
}

const fadeIn = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ── 底部字幕（跟主片同款玻璃底） ── */
const Caption: React.FC<{ text: string; portrait: boolean }> = ({ text, portrait }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, LEAD, 8);
  return (
    <div style={{ position: "absolute", left: portrait ? 48 : 90, right: portrait ? 48 : 90, bottom: portrait ? 130 : 54, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", maxWidth: portrait ? 980 : 1560, padding: portrait ? "18px 30px" : "16px 40px", borderRadius: 16, background: "rgba(13,19,34,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 10px 26px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.16)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: portrait ? 36 : 34, lineHeight: 1.45, color: "#fff", letterSpacing: 0.5 }}>{text}</div>
      </div>
    </div>
  );
};

/* ── 名詞小教室品牌小膠囊（motif emoji 貫穿） ── */
const RoomPill: React.FC<{ f: number; motif: string; progress?: string }> = ({ f, motif, progress }) => (
  <div style={{ position: "absolute", top: 56, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16, opacity: fadeIn(f, 2, 12) }}>
    <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 26px", display: "inline-flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 26 }}>{motif}</span>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: "#fff" }}>名詞小教室</span>
    </div>
    {progress && (
      <div style={{ ...darkCard(ACC.signal, { r: 999, glow: 0.5 }), padding: "10px 24px", display: "inline-flex", alignItems: "center" }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 28, letterSpacing: 1, color: "#fff" }}>{progress}</span>
      </div>
    )}
  </div>
);

/* ── 一張名詞卡 ── */
const TermCardView: React.FC<{ card: Extract<Card, { kind: "term" }>; total: number; motif: string; portrait: boolean }> = ({ card, total, motif, portrait }) => {
  const f = useCurrentFrame();
  const c = accOf(card.term.accent);
  const o = fadeIn(f, LEAD, 14);
  const cardW = portrait ? 960 : 1180;
  const bigSize = portrait ? 92 : 104;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <RoomPill f={f} motif={motif} progress={`${card.no} / ${total}`} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", bottom: portrait ? 120 : 60 }}>
        <div style={{ width: cardW, maxWidth: "90%", opacity: o, transform: `translateY(${(1 - o) * 18}px)` }}>
          {/* 大詞 + 副標 */}
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: bigSize, letterSpacing: -1, lineHeight: 1.05, color: ACC.ink }}>{card.term.big}</div>
            <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: portrait ? 38 : 40, marginTop: 8, color: c }}>{card.term.sub}</div>
          </div>
          {/* 深卡：比喻 → 白話 → 你會在哪看到它 */}
          <div style={{ ...darkCard(c, { r: 24, glow: 0.95 }), position: "relative", overflow: "hidden", padding: portrait ? "30px 34px" : "34px 44px" }}>
            <Glare />
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: portrait ? 60 : 66, flexShrink: 0 }}>{card.term.emoji}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: portrait ? 44 : 48, lineHeight: 1.2, color: "#fff" }}>{card.term.metaphor}</span>
            </div>
            <div style={{ ...hairline, margin: "22px 0" }} />
            <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: portrait ? 30 : 30, color: c, flexShrink: 0 }}>白話</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: portrait ? 34 : 36, lineHeight: 1.35, color: rgba("#ffffff", 0.9) }}>{card.term.def}</span>
            </div>
            <div style={{ position: "relative", marginTop: 24, display: "inline-flex", alignItems: "center", gap: 12, background: rgba("#060a14", 0.6), border: `1px solid ${rgba(c, 0.4)}`, borderRadius: 12, padding: portrait ? "14px 20px" : "14px 24px", maxWidth: "100%" }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>📍</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: portrait ? 28 : 30, color: rgba("#ffffff", 0.82), lineHeight: 1.3 }}>你會在哪看到它：{card.term.where}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── 開場儀式卡 ── */
const IntroCardView: React.FC<{ hook: string; portrait: boolean }> = ({ hook, portrait }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 6, 16);
  const lines = hook.split("\n");
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)`, padding: "0 40px" }}>
        <div style={{ fontSize: portrait ? 120 : 130 }}>📖</div>
        <div style={{ ...emberClip, fontWeight: 800, fontSize: portrait ? 96 : 118, letterSpacing: 2, marginTop: 6 }}>名詞小教室</div>
        <div style={{ fontWeight: 600, fontSize: portrait ? 42 : 46, color: ACC.inkSoft, marginTop: 24, lineHeight: 1.4, maxWidth: portrait ? 900 : 1200 }}>
          {lines.map((l, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {l}
            </React.Fragment>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 收尾卡 ── */
const ClosingCardView: React.FC<{ motif: string; portrait: boolean }> = ({ motif, portrait }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 6, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)`, padding: "0 40px" }}>
        <div style={{ fontWeight: 800, fontSize: portrait ? 92 : 112, color: ACC.ink, lineHeight: 1.15 }}>下次看到，<br /><span style={emberClip}>就不怕了</span>！</div>
        <div style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: 14, ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "14px 34px" }}>
          <span style={{ fontSize: 30 }}>{motif}</span>
          <span style={{ fontWeight: 800, fontSize: portrait ? 34 : 36, color: "#fff" }}>名詞小教室 · 我們下次見</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OneCard: React.FC<{ card: Card; spec: GlossarySpec; voDir: string; portrait: boolean }> = ({ card, spec, voDir, portrait }) => {
  const motif = spec.motifEmoji ?? "📖";
  let visual: React.ReactNode;
  if (card.kind === "intro") visual = <IntroCardView hook={spec.introHook ?? "剛剛影片裡的技術名詞，\n一個一個講到你懂"} portrait={portrait} />;
  else if (card.kind === "closing") visual = <ClosingCardView motif={motif} portrait={portrait} />;
  else visual = <TermCardView card={card} total={spec.terms.length} motif={motif} portrait={portrait} />;
  return (
    <AbsoluteFill>
      {visual}
      <Caption text={spec.script[card.id] ?? ""} portrait={portrait} />
      <Sequence from={LEAD}>
        <Audio src={staticFile(`${voDir}/${card.id}.mp3`)} />
      </Sequence>
    </AbsoluteFill>
  );
};

/** 名詞小教室片段（自帶白底＋字幕＋旁白；不含 BGM，讓外層決定）。 */
export const GlossarySegment: React.FC<{ spec: GlossarySpec; vo: Record<string, number>; voDir?: string }> = ({ spec, vo, voDir = "vo/current-glossary" }) => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  if (spec.terms.length === 0) {
    return <AbsoluteFill><WhiteBg /></AbsoluteFill>;
  }
  const cards = buildCards(spec);
  return (
    <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
      <WhiteBg />
      <TransitionSeries>
        {cards.flatMap((card, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`c-${i}`} durationInFrames={cardFrames(card.id, vo)}>
              <OneCard card={card} spec={spec} voDir={voDir} portrait={portrait} />
            </TransitionSeries.Sequence>
          );
          if (i === 0) return [seq];
          return [
            <TransitionSeries.Transition key={`t-${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
            seq,
          ];
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

/* ── 交付 composition ─────────────────────────────────── */

export function explainerWithGlossaryFrames(
  spec: VideoSpec,
  vo: Record<string, number>,
  glossary: GlossarySpec,
  glossaryVo: Record<string, number>,
): number {
  const main = explainerObsidianFrames(spec, vo);
  return glossary.terms.length > 0 ? main + glossarySegmentFrames(glossary, glossaryVo) : main;
}

/** 16:9 完整片：主片（ExplainerObsidian）＋ 片尾名詞小教室，共用一條 BGM。
 *  glossary.terms 為空 ＝ 自動退化成純主片（時長也同步縮回）。 */
export const ExplainerWithGlossary: React.FC<{
  spec: VideoSpec;
  vo: Record<string, number>;
  voDir?: string;
  glossary: GlossarySpec;
  glossaryVo: Record<string, number>;
  glossaryVoDir?: string;
  bgmSrc?: string;
}> = ({ spec, vo, voDir = "vo/current", glossary, glossaryVo, glossaryVoDir = "vo/current-glossary", bgmSrc = "bgm-piano.mp3" }) => {
  const mainFrames = explainerObsidianFrames(spec, vo);
  return (
    <AbsoluteFill>
      <WhiteBg />
      <Audio loop src={staticFile(bgmSrc)} volume={0.11} />
      <Sequence durationInFrames={mainFrames}>
        <ExplainerObsidian spec={spec} vo={vo} voDir={voDir} />
      </Sequence>
      {glossary.terms.length > 0 && (
        <Sequence from={mainFrames} durationInFrames={glossarySegmentFrames(glossary, glossaryVo)}>
          <GlossarySegment spec={glossary} vo={glossaryVo} voDir={glossaryVoDir} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

/** 9:16 Short：純名詞小教室 ＋ BGM。 */
export const GlossaryShort: React.FC<{
  spec: GlossarySpec;
  vo: Record<string, number>;
  voDir?: string;
  bgmSrc?: string;
}> = ({ spec, vo, voDir = "vo/current-glossary", bgmSrc = "bgm-piano.mp3" }) => (
  <AbsoluteFill>
    <Audio loop src={staticFile(bgmSrc)} volume={0.11} />
    <GlossarySegment spec={spec} vo={vo} voDir={voDir} />
  </AbsoluteFill>
);
