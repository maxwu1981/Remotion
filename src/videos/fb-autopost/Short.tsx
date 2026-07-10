import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import vo from "../_explainer/specs/fb-autopost.vo.json";
import { WhiteBg, ACC, darkCard, Glare, emberClip, rgba, accOf } from "./glass";

/**
 * fb-autopost 9:16 Short（1080×1920, 30fps）— 引流到長片。
 * 複用長片曉晴 VO(cv1 鉤子 + gp2 完整 prompt)+ BGM；黑曜石直式版。
 */
const FPS = 30;
const V = vo as Record<string, number>;
const f2 = (id: string) => Math.round((V[id] ?? 3) * FPS);
const LEAD = 12, GAP = 8, TAIL = 16, XF = 10, CTA = 120;
const fadeIn = (f: number, at: number, d = 10) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const hookDur = LEAD + f2("cv1") + TAIL;
const promptDur = LEAD + f2("gp2") + TAIL;
export const fbShortFrames = () => hookDur + promptDur + CTA - 2 * XF;

const Cap: React.FC<{ text: string; from: number; dur: number }> = ({ text, from, dur }) => {
  const f = useCurrentFrame();
  const o = fadeIn(f, from, 6) * (1 - fadeIn(f, from + dur - 6, 6));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 120, textAlign: "center", opacity: o }}>
      <div style={{ display: "inline-block", padding: "18px 30px", borderRadius: 18, background: "rgba(13,19,34,0.74)", border: "1px solid rgba(255,255,255,0.14)" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 40, lineHeight: 1.4, color: "#fff" }}>{text}</span>
      </div>
    </div>
  );
};

const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 4, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, alignItems: "center", justifyContent: "flex-start", paddingTop: 190 }}>
      <div style={{ opacity: o, transform: `translateY(${(1 - o) * 18}px)`, textAlign: "center" }}>
        <div style={{ ...darkCard(ACC.ember, { r: 999, glow: 0.5 }), display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 30px", marginBottom: 40 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: ACC.ember, boxShadow: `0 0 10px ${rgba(ACC.ember, 0.8)}` }} />
          <span style={{ fontWeight: 700, fontSize: 34, letterSpacing: 3, color: "#fff" }}>生活應用系列</span>
        </div>
        <div style={{ fontFamily: FONT.monoCjk, fontWeight: 700, fontSize: 84, color: ACC.ink }}>Facebook</div>
        <div style={{ ...emberClip, background: "linear-gradient(160deg,#F09A6B,#D97757 45%,#B54C29)", WebkitBackgroundClip: "text", backgroundClip: "text", fontWeight: 800, fontSize: 168, letterSpacing: -3, lineHeight: 1.02 }}>每天<br />自動發文</div>
      </div>
      {/* 4 chips 2x2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 70, opacity: o }}>
        {[["40", "天沒碰鍵盤", "claude"], ["0", "元月費", "green"], ["2", "步 API 發文", "blue"], ["34", "篇自動貼文", "violet"]].map(([n, t, a], i) => {
          const c = accOf(a);
          return (
            <div key={i} style={{ ...darkCard(c, { r: 20, glow: 0.8 }), position: "relative", overflow: "hidden", padding: "24px 34px", display: "flex", alignItems: "baseline", gap: 14 }}>
              <Glare />
              <span style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 76, color: "#fff", textShadow: `0 0 18px ${rgba(c, 0.6)}` }}>{n}</span>
              <span style={{ position: "relative", fontWeight: 600, fontSize: 34, color: rgba("#ffffff", 0.85) }}>{t}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PROMPT_LINES = [
  "① 建 Meta App，指出 App ID / App Secret",
  "② 權限加 pages_manage_posts + pages_read_engagement",
  "③ fb_exchange_token 換 60 天長效 → Page Token",
  "④ /photos published=false → /feed 組成貼文",
  "⑤ 每天抓資料夾；發過不重發；沒新圖回收輪播",
  "⑥ 掛 cron 每天 07:11 自動跑",
  "⑦ Token 剩 14 天提醒",
];
const PromptScene: React.FC = () => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 6, 14);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 34, opacity: fadeIn(f, 2, 12) }}>
        <span style={{ fontSize: 46 }}>🎁</span>
        <div style={{ fontWeight: 800, fontSize: 60, color: ACC.ink, marginTop: 8 }}>完整 <span style={emberClip}>prompt</span></div>
        <div style={{ fontWeight: 600, fontSize: 36, color: ACC.inkSoft, marginTop: 6 }}>整段複製，一次貼給 Claude</div>
      </div>
      <div style={{ ...darkCard(ACC.ember, { r: 24, glow: 0.95 }), position: "relative", overflow: "hidden", width: "100%", padding: "34px 36px", opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
        <Glare />
        <div style={{ position: "relative", fontFamily: FONT.monoCjk, fontSize: 32, color: "#fff", marginBottom: 20 }}>
          <span style={{ color: ACC.gold }}>$</span> 「幫我做一套 FB 粉專每天自動發文系統，用 Meta 官方 Graph API：」
        </div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
          {PROMPT_LINES.map((t, i) => (
            <div key={i} style={{ fontFamily: FONT.monoCjk, fontSize: 30, color: rgba("#ffffff", 0.82) }}>{t}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const o = fadeIn(f, 4, 14);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", opacity: o }}>
        <div style={{ fontWeight: 800, fontSize: 74, color: ACC.ink }}>完整教學 <span style={emberClip}>→ 主頻道</span></div>
        <div style={{ fontWeight: 600, fontSize: 40, color: ACC.inkSoft, marginTop: 20 }}>說明欄有完整 prompt，可複製 👇</div>
        <div style={{ marginTop: 50, display: "inline-flex", alignItems: "center", gap: 14, ...darkCard(ACC.ember, { r: 999, glow: 0.7 }), padding: "18px 44px" }}>
          <span style={{ fontWeight: 800, fontSize: 44, color: "#fff" }}>🔔 訂閱 Ai-Wisdom</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FbAutopostShort: React.FC = () => (
  <AbsoluteFill>
    <WhiteBg />
    <Audio loop src={staticFile("bgm-fb-autopost.mp3")} volume={0.13} />
    <Sequence from={LEAD} durationInFrames={f2("cv1")}><Audio src={staticFile("vo/fb-autopost/cv1.mp3")} /></Sequence>
    <Sequence from={hookDur - XF + LEAD} durationInFrames={f2("gp2")}><Audio src={staticFile("vo/fb-autopost/gp2.mp3")} /></Sequence>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={hookDur}>
        <><HookScene /><Cap text="連續 40 天每天自動發文，我一次都沒碰 FB 後台" from={LEAD} dur={f2("cv1")} /></>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: XF })} />
      <TransitionSeries.Sequence durationInFrames={promptDur}>
        <><PromptScene /><Cap text="每一步合成一段完整 prompt，貼給 Claude 就幫你建好" from={LEAD} dur={f2("gp2")} /></>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: XF })} />
      <TransitionSeries.Sequence durationInFrames={CTA}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
