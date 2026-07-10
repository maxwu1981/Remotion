import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";

/**
 * 黑布哩｜大戰僵屍王 — 9:16 純配樂英雄蒙太奇。
 * Google Flow(Veo 3.1 Fast) 生的 11 段 clip（每段原生 8s, 720×1280, 24fps）以 fade 串接，
 * 0:00 封面卡 + 結尾卡（用 cover-bg/outro-bg 畫格）+ 戰鬥風短字幕 + 史詩萬聖節戰鬥 BGM（bgm-hbl-battle，Gemini Lyria 3 生，無旁白故當主聲軌音量大）。
 * 無旁白（老闆選純配樂蒙太奇）。分鏡 = storyboard.ts。
 */
const FPS = 30;
const CLIP = 8 * FPS; // 240 — 整段 8s 照用
const XFADE = 15; // 0.5s 交叉淡入
const COVER = 45; // 1.5s 封面
const OUTRO = 90; // 3s 結尾
const DIR = "gemini-clips/heibuli-vs-zombies";

type ShotDef = { id: string; caption: string; file?: string };

const SHOTS: ShotDef[] = [
  { id: "s1", caption: "夜色降臨…", file: "s1_v2" },
  { id: "s2", caption: "敵人來了", file: "s2_v2" },
  { id: "s3", caption: "閃！", file: "s3_v2" },
  { id: "s4", caption: "衝啊！", file: "s4_v2" },
  { id: "s5", caption: "撿到神劍 ⚔️", file: "s5_v2" },
  { id: "s6", caption: "橫掃骷髏！", file: "s6_v2" },
  { id: "s7", caption: "蓄力中…", file: "s7_v2" },
  { id: "s8", caption: "僵屍王登場！", file: "s8_v2" },
  { id: "s9", caption: "閃開！" },
  { id: "s10", caption: "終極一擊！" },
  { id: "s11", caption: "勝利！🎉" },
];

const fadeIn = (frame: number, inAt: number, dur = 12) =>
  interpolate(frame, [inAt, inAt + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 戰鬥風短字幕：底部置中，橙黃大字 + 黑描邊 + 半透明底襯，輕微彈入。 */
const Caption: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f - 6, fps, config: { damping: 12, stiffness: 180 }, durationInFrames: 20 });
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 220, textAlign: "center", opacity: fadeIn(f, 6) }}>
      <div
        style={{
          display: "inline-block",
          padding: "18px 40px",
          borderRadius: 24,
          background: "rgba(10,6,22,0.55)",
          border: "2px solid rgba(255,170,60,0.55)",
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT.uiCjk,
            fontWeight: 900,
            fontSize: 68,
            lineHeight: 1.2,
            color: "#FFD15C",
            WebkitTextStroke: "2px rgba(0,0,0,0.85)",
            textShadow: "0 4px 18px rgba(0,0,0,0.8)",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

const Shot: React.FC<{ shot: ShotDef }> = ({ shot }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile(`${DIR}/shots/${shot.file ?? shot.id}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <Caption text={shot.caption} />
  </AbsoluteFill>
);

/** 0:00 封面卡：暗化的僵屍王畫格 + 大標題 + 鉤子。 */
const Cover: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 13, stiffness: 160 }, durationInFrames: 24 });
  const titleScale = interpolate(pop, [0, 1], [0.8, 1]);
  return (
    <AbsoluteFill style={{ background: "#05030f" }}>
      <Img src={staticFile(`${DIR}/cover-bg.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,3,15,0.5) 0%, rgba(5,3,15,0.25) 45%, rgba(5,3,15,0.85) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${titleScale})` }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 900, fontSize: 64, color: "#FFD15C", letterSpacing: 4, marginBottom: 4, textShadow: "0 4px 16px rgba(0,0,0,0.9)" }}>
          🖤 黑布哩
        </div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 900, fontSize: 150, lineHeight: 1.05, color: "#fff", WebkitTextStroke: "3px rgba(0,0,0,0.85)", textShadow: "0 8px 30px rgba(120,40,200,0.7)" }}>
          大戰
        </div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 900, fontSize: 150, lineHeight: 1.05, color: "#7CFF6B", WebkitTextStroke: "3px rgba(0,0,0,0.85)", textShadow: "0 8px 30px rgba(40,200,80,0.7)" }}>
          僵屍王
        </div>
        <div style={{ marginTop: 28, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, color: "#fff", background: "rgba(180,50,60,0.85)", padding: "10px 30px", borderRadius: 999 }}>
          毛球英雄的逆襲 ⚔️
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 結尾卡：暗化的勝利畫格 + 標題 + 可愛收尾（無頻道角標，老闆指定獨立 IP）。 */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#05030f" }}>
      <Img src={staticFile(`${DIR}/outro-bg.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,3,15,0.35) 0%, rgba(5,3,15,0.8) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: fadeIn(f, 6), fontFamily: FONT.uiCjk, fontWeight: 900, fontSize: 120, color: "#FFD15C", WebkitTextStroke: "3px rgba(0,0,0,0.8)", textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>
          勝利！
        </div>
        <div style={{ opacity: fadeIn(f, 20), marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 56, color: "#fff" }}>
          🖤 黑布哩 · 下次再戰！
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const HEIBULI_VS_ZOMBIES_FRAMES =
  COVER + SHOTS.length * CLIP + OUTRO - (SHOTS.length + 1) * XFADE; // 45 + 2640 + 90 - 180 = 2595

export const HeibuliVsZombies: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile("bgm-hbl-battle.mp3")} volume={0.6} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={COVER}>
        <Cover />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />
      {SHOTS.flatMap((shot) => [
        <TransitionSeries.Sequence key={`seq-${shot.id}`} durationInFrames={CLIP}>
          <Shot shot={shot} />
        </TransitionSeries.Sequence>,
        <TransitionSeries.Transition key={`tr-${shot.id}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
      ])}
      <TransitionSeries.Sequence durationInFrames={OUTRO}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
