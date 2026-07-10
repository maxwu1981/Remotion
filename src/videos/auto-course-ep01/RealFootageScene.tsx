import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { buildScene } from "../_explainer/Explainer";
import { Glare, accOf, darkCard } from "../_explainer/obsidian-glass";
import { Brand, Caption, Kicker, TopBanner } from "../_explainer/ExplainerObsidian";
import type { VideoSpec } from "../_explainer/schema";

const FPS = 30;
const fadeIn = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/**
 * 嵌真人螢幕錄影的 bespoke 場景（不走 schema——8 種 JSON 積木都沒有「嵌真實影片」型別）。
 * 節奏策略：以已過稿的旁白時長為準，video 用 playbackRate 等比伸縮塞進同一個時長，
 * 不動旁白、不用二次裁剪畫面。CH4/CH5 落差都在 10~22%，螢幕錄影（打字/捲動）這個幅度肉眼不明顯；
 * HOOK 那種「6 句旁白 vs 整支 375s 錄影」落差太大（10x+），不適用這招，要另外剪高光蒙太奇。
 */
/** 遮蔽區塊：素材裡有私人帳號/信箱等不該外露的畫面，用色塊蓋掉而不是整段剪掉。
 * x/y/w/h 是相對「影片畫面本身」（不含視窗頂列）的比例（0–1）；from/to 是「素材原始秒數」（裁切前，未套 playbackRate）。 */
export type Redaction = { x: number; y: number; w: number; h: number; fromSec: number; toSec: number };

export const RealFootageScene: React.FC<{
  spec: VideoSpec;
  vo: Record<string, number>;
  voDir: string;
  videoSrc: string; // public/ 下路徑
  videoNativeDurationSec: number; // ffprobe 量到的已裁切素材長度
  cueIds: string[];
  kicker: string;
  accent?: string;
  anchor?: React.ReactNode | null;
  redactions?: Redaction[];
}> = ({ spec, vo, voDir, videoSrc, videoNativeDurationSec, cueIds, kicker, accent, anchor, redactions }) => {
  const f = useCurrentFrame();
  const c = accOf(accent);
  const { cues, dur } = buildScene(cueIds, spec.script, vo);
  const nativeFrames = videoNativeDurationSec * FPS;
  const playbackRate = nativeFrames / dur;
  const nativeSec = (f / FPS) * playbackRate;

  // 素材已在 ffmpeg 階段緊貼視窗邊界裁切（含原生紅黃綠燈+標題列），
  // 這裡不再疊一層假外框，卡片只負責「浮起感」（圓角+光暈+陰影），畫面本身就是那扇窗。
  const cardW = 1340;
  const cardH = 800;

  return (
    <AbsoluteFill>
      <Kicker text={kicker} c={c} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", bottom: 90 }}>
        <div style={{ ...darkCard(c, { r: 18, glow: 0.95 }), position: "relative", overflow: "hidden", width: cardW, height: cardH, opacity: fadeIn(f, 8, 14) }}>
          <Glare />
          <div style={{ position: "relative", width: cardW, height: cardH }}>
            <OffthreadVideo src={staticFile(videoSrc)} muted playbackRate={playbackRate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {redactions?.filter((r) => nativeSec >= r.fromSec && nativeSec <= r.toSec).map((r, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: r.x * cardW,
                  top: r.y * cardH,
                  width: r.w * cardW,
                  height: r.h * cardH,
                  background: "#0b1020",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Brand name={spec.brand.name} />
      {anchor && <TopBanner node={anchor} />}
      {cues.map((cue) => (
        <Caption key={cue.id} text={cue.text} at={cue.from} until={cue.from + cue.dur + 10} />
      ))}
      {cues.map((cue) => (
        <Sequence key={`a-${cue.id}`} from={cue.from}>
          <Audio src={staticFile(`${voDir}/${cue.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const realFootageSceneDuration = (cueIds: string[], spec: VideoSpec, vo: Record<string, number>): number =>
  buildScene(cueIds, spec.script, vo).dur;
