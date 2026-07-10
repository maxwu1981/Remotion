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
import manifest from "./vo-apikey-manifest.json";

/**
 * 帳號授權安全 V2 · 第2章「API key＝洗衣廠司機」(16:9, 1920×1080, 30fps)。
 * 沿用第1章的日式動漫 blur-fill / 概念錨 / 多聲線做法(見 [[video-concept-anchor-banner]])。
 * 重心＝先講「為什麼用 API key、不用 OAuth/發房卡」(高頻＋不涉隱私)。
 * 圖在 public/aas-v2/(backdoor/driver/apikey/intruder 為本章新生;frontdesk/keycard 沿用第1章)。
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
  "backdoor.png": [1024, 572],
  "driver.png": [1024, 559],
  "apikey.png": [1024, 572],
  "intruder.png": [1024, 572],
  "frontdesk.png": [572, 1024], // reuse ch.1
  "keycard.png": [1024, 572], // reuse ch.1 (aspect)
};

const ANCHOR = (
  <>
    API key＝服務用的<span style={{ color: ORANGE }}>固定後門鑰匙</span>　·　不問同意、長期有效、外洩就<span style={{ color: ORANGE }}>換發</span>
  </>
);

type Shot = { key: string; img: string; lines: string[]; caption: string; kb: "in" | "out"; topBanner?: boolean };

const SHOTS: Shot[] = [
  { key: "s1", img: "backdoor.png", lines: ["s1"], caption: "還有一種訪客：天天來的「服務」", kb: "in" },
  { key: "s2", img: "driver.png", lines: ["s2"], caption: "高頻進出 × 不碰隱私", kb: "out" },
  { key: "s3", img: "frontdesk.png", lines: ["s3"], caption: "這種活，不走前台發房卡那套", kb: "in" },
  { key: "s4", img: "apikey.png", lines: ["s4"], caption: "API key＝固定後門鑰匙・不問同意", kb: "in", topBanner: true },
  { key: "s5", img: "keycard.png", lines: ["s5"], caption: "房卡＝客人/會失效　API key＝服務/長期", kb: "out", topBanner: true },
  { key: "s6", img: "intruder.png", lines: ["s6"], caption: "鑰匙外洩＝有人能裝成你", kb: "in", topBanner: true },
  { key: "s7", img: "apikey.png", lines: ["s7"], caption: "外洩就換發：換新的、舊的作廢", kb: "out", topBanner: true },
  { key: "s8", img: "backdoor.png", lines: ["s8"], caption: "API key＝固定後門鑰匙　①不涉隱私常進出　②權限大要保管　③外洩就換發", kb: "in" },
];

const shotFrames = (s: Shot) => LEAD + s.lines.reduce((a, id) => a + sec(id), 0) + (s.lines.length - 1) * GAP + TAIL;
export const API_KEY_FRAMES = TITLE + SHOTS.reduce((a, s) => a + shotFrames(s), 0) - SHOTS.length * XFADE;

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
        <Audio src={staticFile(`vo/apikey/${id}.mp3`)} />
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
      <Img src={staticFile("aas-v2/backdoor.png")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5, transform: `scale(${interpolate(f, [0, TITLE], [1.06, 1.0])})` }} />
      <AbsoluteFill style={{ background: "rgba(8,10,16,0.55)", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", opacity: fadeIn(f, 4) }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, color: ORANGE, letterSpacing: 2 }}>旅館故事 · 第二章</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 74, color: "#fff", marginTop: 14, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>後門的固定鑰匙，就是 API key</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 33, color: "#e8e2d6", marginTop: 18 }}>常來、不涉隱私，才不走發房卡那套</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ApiKeyChapter: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
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
