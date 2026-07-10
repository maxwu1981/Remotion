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
import manifest from "./vo-password-manifest.json";

/**
 * 帳號授權安全 V2 · 第3章「密碼＝你家的萬能鑰匙」(16:9, 1920×1080, 30fps)。
 * 沿用第1/2章的日式動漫 blur-fill / 概念錨 / 多聲線做法(見 [[video-concept-anchor-banner]])。
 * 系列根基：密碼是你在保護的東西,回扣「OAuth/token、API key 都是為了不必交出這把萬能鑰匙」。
 * 圖在 public/aas-v2/(masterkey/reuse-risk/manager/2fa 為本章新生;hero/keycard 沿用前章)。
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
  "hero.png": [572, 1024], // reuse ch.1 (直幅人物)
  "keycard.png": [2752, 1536], // reuse ch.1
  "masterkey.png": [2752, 1536],
  "reuse-risk.png": [2752, 1536],
  "manager.png": [2752, 1536],
  "2fa.png": [2752, 1536],
};

const ANCHOR = (
  <>
    密碼＝你家的<span style={{ color: ORANGE }}>萬能鑰匙</span>　·　別交出去、每處用不同把、再加<span style={{ color: ORANGE }}>第二道鎖</span>
  </>
);

type Shot = { key: string; img: string; lines: string[]; caption: string; kb: "in" | "out"; topBanner?: boolean };

const SHOTS: Shot[] = [
  { key: "s1", img: "hero.png", lines: ["s1"], caption: "密碼＝你的萬能鑰匙", kb: "in" },
  { key: "s2", img: "masterkey.png", lines: ["s2"], caption: "一把開全部・所以絕不隨便交出去", kb: "out", topBanner: true },
  { key: "s3", img: "keycard.png", lines: ["s3"], caption: "房卡、API key 存在＝為了不必交出密碼", kb: "in", topBanner: true },
  { key: "s4", img: "reuse-risk.png", lines: ["s4"], caption: "別重複用：一處外洩＝全部淪陷", kb: "in", topBanner: true },
  { key: "s5", img: "manager.png", lines: ["s5"], caption: "記不住？交給密碼管理器・只記一把主鑰匙", kb: "out", topBanner: true },
  { key: "s6", img: "2fa.png", lines: ["s6"], caption: "加第二道鎖＝兩步驗證（只有你手機才有）", kb: "in", topBanner: true },
  { key: "s7", img: "hero.png", lines: ["s7"], caption: "萬能鑰匙握在自己手上", kb: "out" },
  { key: "s8", img: "masterkey.png", lines: ["s8"], caption: "密碼＝萬能鑰匙　①不交出去　②每處不同把　③交給管理器　④加兩步驗證", kb: "in" },
];

const shotFrames = (s: Shot) => LEAD + s.lines.reduce((a, id) => a + sec(id), 0) + (s.lines.length - 1) * GAP + TAIL;
export const PASSWORD_FRAMES = TITLE + SHOTS.reduce((a, s) => a + shotFrames(s), 0) - SHOTS.length * XFADE;

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
        <Audio src={staticFile(`vo/password/${id}.mp3`)} />
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
      <Img src={staticFile("aas-v2/masterkey.png")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5, transform: `scale(${interpolate(f, [0, TITLE], [1.06, 1.0])})` }} />
      <AbsoluteFill style={{ background: "rgba(8,10,16,0.55)", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", opacity: fadeIn(f, 4) }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, color: ORANGE, letterSpacing: 2 }}>旅館故事 · 第四章</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 74, color: "#fff", marginTop: 14, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>你家的萬能鑰匙，就是密碼</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 33, color: "#e8e2d6", marginTop: 18 }}>一把開全部——所以，絕不隨便交出去</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PasswordChapter: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
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
