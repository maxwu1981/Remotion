import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import manifest from "./vo-captcha-manifest.json";

/**
 * 帳號授權安全 V2 · 第4章「CAPTCHA＝門口的保安（人機驗證）」(16:9, 1920×1080, 30fps)。
 * 播放順序 ch1→ch2→CAPTCHA→ch3(密碼)。沿用日式動漫 blur-fill / 概念錨 / 多聲線做法。
 * 術語鐵則：CAPTCHA 一律「人機驗證」，不講「驗證碼」(避免跟 ch3 兩步驗證的手機驗證碼撞名)。
 * 圖在 public/aas-v2/(guard/botswarm/challenge/passblock 為本章新生;frontdesk/hero 沿用前章)。
 */
const FPS = 30;
const ORANGE = "#E7902F";
const M = manifest as Record<string, number>;
const sec = (id: string) => Math.round((M[id] ?? 3) * FPS);

const LEAD = 14;
const GAP = 8;
const TAIL = 26;
const XFADE = 11;
const TITLE = 60; // 2s

const FRAME_W = 1920;
const FRAME_H = 1080;
const DIM: Record<string, [number, number]> = {
  "guard.png": [2752, 1536],
  "botswarm.png": [2752, 1536],
  "challenge.png": [2752, 1536],
  "passblock.png": [2752, 1536],
  "frontdesk.png": [572, 1024], // reuse ch.1 (直幅人物)
  "hero.png": [572, 1024], // reuse ch.1 (直幅人物)
};

const ANCHOR = (
  <>
    CAPTCHA＝門口的<span style={{ color: ORANGE }}>人機驗證</span>　·　擋的是<span style={{ color: ORANGE }}>機器人</span>海量試鑰匙，不是你
  </>
);

type Shot = { key: string; img: string; lines: string[]; caption: string; kb: "in" | "out"; topBanner?: boolean };

const SHOTS: Shot[] = [
  { key: "s1", img: "guard.png", lines: ["s1"], caption: "發鑰匙之前，門口還有一位保安", kb: "in" },
  { key: "s2", img: "botswarm.png", lines: ["s2"], caption: "有種訪客一秒試上千把鑰匙：機器人", kb: "out" },
  { key: "s3", img: "frontdesk.png", lines: ["s3"], caption: "保安只分：你是真人，還是機器人？", kb: "in" },
  { key: "s4", img: "challenge.png", lines: ["s4"], caption: "CAPTCHA＝出個「人會、機器人頭痛」的小題", kb: "in", topBanner: true },
  { key: "s5", img: "passblock.png", lines: ["s5"], caption: "真人輕鬆過・機器人海被擋在外面", kb: "out", topBanner: true },
  { key: "s6", img: "challenge.png", lines: ["s6"], caption: "認證(你是誰)　兩步驗證(真的是你)　CAPTCHA(你是真人?)", kb: "in", topBanner: true },
  { key: "s7", img: "guard.png", lines: ["s7"], caption: "保安替你擋掉不睡覺的機器人", kb: "out", topBanner: true },
  { key: "s8", img: "hero.png", lines: ["s8"], caption: "CAPTCHA＝門口人機驗證・專擋機器人試鑰匙", kb: "in" },
];

const shotFrames = (s: Shot) => LEAD + s.lines.reduce((a, id) => a + sec(id), 0) + (s.lines.length - 1) * GAP + TAIL;
export const CAPTCHA_FRAMES = TITLE + SHOTS.reduce((a, s) => a + shotFrames(s), 0) - SHOTS.length * XFADE;

const fadeIn = (frame: number, at: number, dur = 14) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const WatermarkPatch: React.FC = () => (
  <div style={{ position: "absolute", left: "80%", top: "78%", width: "14%", height: "17%", borderRadius: "50%", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }} />
);

const KenBurnsImg: React.FC<{ src: string; kb: "in" | "out"; dur: number }> = ({ src, kb, dur }) => {
  const f = useCurrentFrame();
  const [w, h] = DIM[src] || [1024, 572];
  const fit = Math.min(FRAME_W / w, FRAME_H / h);
  const boxW = w * fit;
  const boxH = h * fit;
  const from = kb === "in" ? 1.03 : 1.1;
  const to = kb === "in" ? 1.1 : 1.03;
  const scale = interpolate(f, [0, dur], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgScale = interpolate(f, [0, dur], [1.16, 1.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#140d07" }}>
      <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
        <Img src={staticFile(`aas-v2/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(32px) brightness(0.45)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: boxW, height: boxH, transform: `scale(${scale})` }}>
          <Img src={staticFile(`aas-v2/${src}`)} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
          <WatermarkPatch />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.62) 100%)" }} />
    </AbsoluteFill>
  );
};

const TopBanner: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 8, 16) }}>
      <div style={{ padding: "12px 34px", borderRadius: 999, background: "rgba(8,12,20,0.55)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", border: "1px solid rgba(255,255,255,0.12)" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 33, color: "#fff", letterSpacing: 0.5 }}>{ANCHOR}</span>
      </div>
    </div>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 90, textAlign: "center", opacity: fadeIn(f, LEAD - 6) }}>
      <div style={{ display: "inline-block", padding: "20px 40px", borderRadius: 22, background: "rgba(8,12,20,0.6)", backdropFilter: "blur(2px)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, lineHeight: 1.35, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.75)" }}>{text}</div>
      </div>
    </div>
  );
};

const ShotScene: React.FC<{ shot: Shot; dur: number }> = ({ shot, dur }) => {
  let off = LEAD;
  const audios = shot.lines.map((id) => {
    const at = off;
    off += sec(id) + GAP;
    return (
      <Sequence key={id} from={at}>
        <Audio src={staticFile(`vo/captcha/${id}.mp3`)} />
      </Sequence>
    );
  });
  return (
    <AbsoluteFill>
      <KenBurnsImg src={shot.img} kb={shot.kb} dur={dur} />
      {shot.topBanner && <TopBanner />}
      <Caption text={shot.caption} />
      {audios}
    </AbsoluteFill>
  );
};

const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#140d07" }}>
      <Img src={staticFile("aas-v2/botswarm.png")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5, transform: `scale(${interpolate(f, [0, TITLE], [1.06, 1.0])})` }} />
      <AbsoluteFill style={{ background: "rgba(8,10,16,0.55)", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", opacity: fadeIn(f, 4) }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, color: ORANGE, letterSpacing: 2 }}>旅館故事 · 第三章</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 74, color: "#fff", marginTop: 14, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>門口的保安，就是 CAPTCHA</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 33, color: "#e8e2d6", marginTop: 18 }}>分清楚你是真人，還是機器人</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CaptchaChapter: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {bgm && <Audio src={staticFile("bgm-crystal.mp3")} volume={0.12} />}
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TITLE}>
        <TitleCard />
      </TransitionSeries.Sequence>
      {SHOTS.flatMap((shot) => {
        const dur = shotFrames(shot);
        return [
          <TransitionSeries.Transition key={`tr-${shot.key}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
          <TransitionSeries.Sequence key={`seq-${shot.key}`} durationInFrames={dur}>
            <ShotScene shot={shot} dur={dur} />
          </TransitionSeries.Sequence>,
        ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
