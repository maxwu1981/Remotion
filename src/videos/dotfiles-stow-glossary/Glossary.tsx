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
import type { VideoSpec } from "../_explainer/schema";
import { ExplainerObsidian, explainerObsidianFrames } from "../_explainer/ExplainerObsidian";
import { WhiteBg, ACC, darkCard, Glare, emberClip, rgba, accOf, hairline } from "../_explainer/obsidian-glass";
import glossarySpec from "../_explainer/specs/dotfiles-stow-glossary.json";
import glossaryVo from "../_explainer/specs/dotfiles-stow-glossary.vo.json";
import { HandsOnSegment, handsOnFrames } from "./HandsOn";

/**
 * 名詞小教室 — 今天 dotfiles/GNU Stow 片專屬的片尾段（同時當 9:16 Short）。
 * 手刻、自足：讀 dotfiles-stow-glossary.json 的 script（字幕）+ .vo.json（每句秒數）。
 * 搬家/收納比喻貫穿、朋友聊天語氣、每卡「比喻→白話定義→你會在哪看到它」。
 * 一次一張卡置中，16:9 與 9:16 都適用（用 useVideoConfig 切版）。
 * 完全不動 _explainer 共用模板（schema/Explainer/ExplainerObsidian），故每日工廠 VF-Daily 不受影響。
 */

const FPS = 30;
const LEAD = 14, TAIL = 16, XFADE = 12;
const script = glossarySpec.script as Record<string, string>;
const vo = glossaryVo as Record<string, number>;

type Term = {
  big: string; sub: string; emoji: string; metaphor: string; def: string; where: string; accent: string;
};
type Card =
  | { id: string; kind: "intro" }
  | { id: string; kind: "term"; no: number; term: Term }
  | { id: string; kind: "closing" };

/** 收尾句兩版：g8=獨立 Short 用「我們下次見」；g8b=Full 用「接下來動手做」銜接實操段。 */
type ClosingCueId = "g8" | "g8b";

const TERMS: Term[] = [
  { big: "設定檔", sub: "settings.json · CLAUDE.md", emoji: "🏠", metaphor: "你家的「使用說明書」", def: "記住你習慣的規則與偏好設定的檔案", where: "你家目錄的 ~/.claude/ 資料夾裡", accent: "claude" },
  { big: "dotfiles", sub: "點檔", emoji: "📦", metaphor: "一整箱貼好標籤的搬家紙箱", def: "用小點開頭、平常隱藏的設定檔集合", where: "檔名開頭的「.」，例如 .claude", accent: "blue" },
  { big: "symlink", sub: "符號連結 · 捷徑", emoji: "📌", metaphor: "寫著「東西在倉庫」的便利貼", def: "指向真正檔案所在位置的一個捷徑", where: "家目錄裡指向 git 倉庫的那個連結", accent: "violet" },
  { big: "GNU Stow", sub: "搬家工人", emoji: "🚚", metaphor: "一聲令下，把捷徑全貼到定位", def: "自動幫你建立 symlink 的老牌工具", where: "指令 stow -t ~ claude", accent: "green" },
  { big: "版本控制", sub: "git", emoji: "📸", metaphor: "每次整理都拍一張房間快照", def: "記錄每次修改、隨時能回復的系統", where: "git revert 把設定救回上一版", accent: "blue" },
  { big: "OAuth token", sub: "臨時門禁卡", emoji: "🎫", metaphor: "給服務進特定門的限定卡", def: "授權程式代你做事的臨時憑證", where: "存在 ~/.claude.json 裡", accent: "claude" },
  { big: "API 金鑰", sub: "私人鑰匙", emoji: "🔑", metaphor: "拿到就能假冒你、花你的錢", def: "呼叫服務、證明「你是你」的密鑰", where: "同樣藏在 claude.json，絕不外流", accent: "warn" },
];

const buildCards = (closingCueId: ClosingCueId): Card[] => [
  { id: "g0", kind: "intro" },
  ...TERMS.map((t, i): Card => ({ id: `g${i + 1}`, kind: "term", no: i + 1, term: t })),
  { id: closingCueId, kind: "closing" },
];

const cardFrames = (id: string) => Math.ceil((vo[id] ?? 3) * FPS) + LEAD + TAIL;

export function glossaryFrames(closingCueId: ClosingCueId = "g8"): number {
  const cards = buildCards(closingCueId);
  const total = cards.reduce((s, c) => s + cardFrames(c.id), 0);
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

/* ── 名詞小教室品牌小膠囊（搬家 motif 貫穿） ── */
const RoomPill: React.FC<{ f: number; progress?: string }> = ({ f, progress }) => (
  <div style={{ position: "absolute", top: 56, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16, opacity: fadeIn(f, 2, 12) }}>
    <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "10px 26px", display: "inline-flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 26 }}>🚚</span>
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
const TermCardView: React.FC<{ card: Extract<Card, { kind: "term" }>; portrait: boolean }> = ({ card, portrait }) => {
  const f = useCurrentFrame();
  const c = accOf(card.term.accent);
  const o = fadeIn(f, LEAD, 14);
  const cardW = portrait ? 960 : 1180;
  const bigSize = portrait ? 92 : 104;
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk }}>
      <RoomPill f={f} progress={`${card.no} / 7`} />
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
const IntroCardView: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 6, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)`, padding: "0 40px" }}>
        <div style={{ fontSize: portrait ? 120 : 130 }}>📖</div>
        <div style={{ ...emberClip, fontWeight: 800, fontSize: portrait ? 96 : 118, letterSpacing: 2, marginTop: 6 }}>名詞小教室</div>
        <div style={{ fontWeight: 600, fontSize: portrait ? 42 : 46, color: ACC.inkSoft, marginTop: 24, lineHeight: 1.4, maxWidth: portrait ? 900 : 1200 }}>剛剛那些技術名詞，<br />用搬家比喻，一次講到你懂</div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 收尾卡 ── */
const ClosingCardView: React.FC<{ portrait: boolean; bridge: boolean }> = ({ portrait, bridge }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 6, 16);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.uiCjk }}>
      <div style={{ textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 16}px)`, padding: "0 40px" }}>
        <div style={{ fontWeight: 800, fontSize: portrait ? 92 : 112, color: ACC.ink, lineHeight: 1.15 }}>下次看到，<br /><span style={emberClip}>就不怕了</span>！</div>
        <div style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: 14, ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), padding: "14px 34px" }}>
          <span style={{ fontSize: 30 }}>{bridge ? "🛠" : "🚚"}</span>
          <span style={{ fontWeight: 800, fontSize: portrait ? 34 : 36, color: "#fff" }}>{bridge ? "名詞小教室 · 接下來動手做" : "名詞小教室 · 我們下次見"}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OneCard: React.FC<{ card: Card; portrait: boolean }> = ({ card, portrait }) => {
  let visual: React.ReactNode;
  if (card.kind === "intro") visual = <IntroCardView portrait={portrait} />;
  else if (card.kind === "closing") visual = <ClosingCardView portrait={portrait} bridge={card.id === "g8b"} />;
  else visual = <TermCardView card={card} portrait={portrait} />;
  return (
    <AbsoluteFill>
      {visual}
      <Caption text={script[card.id] ?? ""} portrait={portrait} />
      <Sequence from={LEAD}>
        <Audio src={staticFile(`vo/dotfiles-stow-glossary/${card.id}.mp3`)} />
      </Sequence>
    </AbsoluteFill>
  );
};

/** 名詞小教室片段（自帶白底＋字幕＋旁白；不含 BGM，讓外層決定）。 */
export const GlossarySegment: React.FC<{ closingCueId?: ClosingCueId }> = ({ closingCueId = "g8" }) => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const cards = buildCards(closingCueId);
  return (
    <AbsoluteFill style={{ textSpacingTrim: "space-all" }}>
      <WhiteBg />
      <TransitionSeries>
        {cards.flatMap((card, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`c-${i}`} durationInFrames={cardFrames(card.id)}>
              <OneCard card={card} portrait={portrait} />
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

/* ── 兩支交付 composition ─────────────────────────────────── */

/** 三段式完整片總長：講解（主片）→ 名詞小教室（g8b 銜接版）→ 實際操作。 */
export function dotfilesStowFullFrames(spec: VideoSpec, mainVo: Record<string, number>): number {
  return explainerObsidianFrames(spec, mainVo) + glossaryFrames("g8b") + handsOnFrames();
}

/** 16:9 完整片：主片（ExplainerObsidian）＋ 名詞小教室 ＋ 實際操作，共用一條 BGM。 */
export const DotfilesStowFull: React.FC<{ spec: VideoSpec; vo: Record<string, number>; bgmSrc?: string }> = ({ spec, vo: mainVo, bgmSrc = "bgm-piano.mp3" }) => {
  const mainFrames = explainerObsidianFrames(spec, mainVo);
  const glossFrames = glossaryFrames("g8b");
  return (
    <AbsoluteFill>
      <WhiteBg />
      <Audio loop src={staticFile(bgmSrc)} volume={0.11} />
      <Sequence durationInFrames={mainFrames}>
        <ExplainerObsidian spec={spec} vo={mainVo} voDir="vo/current" />
      </Sequence>
      <Sequence from={mainFrames} durationInFrames={glossFrames}>
        <GlossarySegment closingCueId="g8b" />
      </Sequence>
      <Sequence from={mainFrames + glossFrames} durationInFrames={handsOnFrames()}>
        <HandsOnSegment />
      </Sequence>
    </AbsoluteFill>
  );
};

/** 9:16 Short：純名詞小教室 ＋ BGM。 */
export const DotfilesStowGlossaryShort: React.FC<{ bgmSrc?: string }> = ({ bgmSrc = "bgm-piano.mp3" }) => (
  <AbsoluteFill>
    <Audio loop src={staticFile(bgmSrc)} volume={0.11} />
    <GlossarySegment />
  </AbsoluteFill>
);
