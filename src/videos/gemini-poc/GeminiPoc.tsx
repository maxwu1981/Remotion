import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";

/**
 * gemini-poc「AI 小幫手」9:16 PoC — Google Flow(Veo 3.1) 生的 clip 串成片。
 * 4 個 Veo shot（每段原生 8s，不裁，老闆 2026-06-25 拍板）以 fade 串接，
 * 疊 edge-tts 曉晴旁白（public/vo/gemini-poc）+ 大字幕 + 水晶鋼琴 BGM。
 * 旁白稿 = storyboard.ts 的 script（過稿版）；秒數見 gemini-poc.vo.json。
 */
const FPS = 30;
const CLIP = 8 * FPS; // 240 — 整段 8s 照用
const XFADE = 15; // 0.5s 交叉淡入
const VO_AT = 16; // 旁白在交叉淡入後才起（不被轉場吃掉）
const ORANGE = "#E7902F";

type ShotDef = { id: string; file: string; caption: string; cta?: boolean };

const SHOTS: ShotDef[] = [
  { id: "s1", file: "gemini-clips/gemini-poc/shots/s1.mp4", caption: "這是我的 AI 小幫手，一開機就準備上工。" },
  { id: "s2", file: "gemini-clips/gemini-poc/shots/s2.mp4", caption: "丟給它一個任務，它馬上看懂、立刻動手。" },
  { id: "s3", file: "gemini-clips/gemini-poc/shots/s3.mp4", caption: "再雜的活，它都能同時並行處理。" },
  { id: "s4", file: "gemini-clips/gemini-poc/shots/s4.mp4", caption: "搞定，比個讚——這就是 AI 幫你省力的樣子。", cta: true },
];

const fadeIn = (frame: number, inAt: number, dur = 12) =>
  interpolate(frame, [inAt, inAt + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 48, right: 48, bottom: 210, textAlign: "center", opacity: fadeIn(f, 6) }}>
      <div style={{ display: "inline-block", padding: "20px 36px", borderRadius: 26, background: "rgba(8,16,30,0.58)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 60, lineHeight: 1.3, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.7)" }}>{text}</div>
      </div>
    </div>
  );
};

const SubscribeCTA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, display: "flex", justifyContent: "center", gap: 20, opacity: fadeIn(f, 34) }}>
      {["👍 按讚", "🔔 訂閱", "🔗 分享"].map((t) => (
        <div key={t} style={{ padding: "16px 28px", borderRadius: 999, background: "rgba(255,255,255,0.95)", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: "#14142B" }}>{t}</div>
      ))}
    </div>
  );
};

const Shot: React.FC<{ shot: ShotDef }> = ({ shot }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile(shot.file)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <Caption text={shot.caption} />
    {shot.cta && <SubscribeCTA />}
    <Sequence from={VO_AT}>
      <Audio src={staticFile(`vo/gemini-poc/${shot.id}.mp3`)} />
    </Sequence>
  </AbsoluteFill>
);

export const GEMINI_POC_FRAMES = SHOTS.length * CLIP - (SHOTS.length - 1) * XFADE; // 915

export const GeminiPoc: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile("bgm-crystal.mp3")} volume={0.07} />
    <TransitionSeries>
      {SHOTS.flatMap((shot, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`seq-${shot.id}`} durationInFrames={CLIP}>
            <Shot shot={shot} />
          </TransitionSeries.Sequence>
        );
        if (i === SHOTS.length - 1) return [seq];
        return [
          seq,
          <TransitionSeries.Transition key={`tr-${shot.id}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
        ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
