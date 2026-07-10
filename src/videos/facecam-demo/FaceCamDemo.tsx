import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND_MARK, COLORS, FONT, RADIUS, SHADOW } from "../../shared-skills/theme";

const FPS = 30;
const SRC = "facecam/max-selfie.mp4"; // 1080x1920 30fps proxy（原檔 IMG_2787.MOV 4K60）

const fadeIn = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ────────────────────────────────────────────────────────────────
 * Demo A · 真實露臉小窗（webcam 風）疊在模擬教學畫面角落
 * 素材只取正面朝鏡頭的兩段：0–6s 與 15–21s
 * ──────────────────────────────────────────────────────────────── */

// 只取臉一直朝鏡頭的兩段：0–4.5s 與 15.5–21s（5s、9–13s 在轉頭，不用）
const SEG1_FRAMES = 135;
const SEG2_FRAMES = 165;
export const FACECAM_CORNER_FRAMES = SEG1_FRAMES + SEG2_FRAMES;

/** 圓形 webcam 小窗：直式畫面裁方形、對準臉部 */
const CamCircle: React.FC<{ startFromSec: number; size: number }> = ({ startFromSec, size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      overflow: "hidden",
      border: `6px solid ${COLORS.surface}`,
      boxShadow: SHADOW.lg,
      position: "relative",
    }}
  >
    <OffthreadVideo
      src={staticFile(SRC)}
      muted
      startFrom={startFromSec * FPS}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "50% 32%",
      }}
    />
  </div>
);

export const FaceCamCornerDemo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f - 10, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ background: COLORS.bg, fontFamily: FONT.uiCjk }}>
      {/* 模擬教學內容：置中終端卡（示意這裡是任何一支教學片的畫面） */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 1320,
            borderRadius: RADIUS.lg,
            background: COLORS.term.bg,
            boxShadow: SHADOW.md,
            overflow: "hidden",
            opacity: fadeIn(f, 0, 15),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", background: COLORS.term.bgTop }}>
            <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FF5F57" }} />
            <span style={{ width: 13, height: 13, borderRadius: 999, background: "#FEBC2E" }} />
            <span style={{ width: 13, height: 13, borderRadius: 999, background: "#28C840" }} />
            <span style={{ marginLeft: 10, fontFamily: FONT.monoCjk, fontSize: 22, color: COLORS.term.dim }}>
              （模擬教學內容畫面）
            </span>
          </div>
          <div style={{ padding: "36px 44px", fontFamily: FONT.monoCjk, fontSize: 28, lineHeight: 1.9 }}>
            <div style={{ color: COLORS.term.prompt }}>$ claude "幫我把這支影片加上露臉小窗"</div>
            <div style={{ color: COLORS.term.text, opacity: fadeIn(f, 40) }}>⏺ 讀取 facecam/max-selfie.mp4 …</div>
            <div style={{ color: COLORS.term.text, opacity: fadeIn(f, 80) }}>⏺ 裁成圓形小窗、疊到右下角 …</div>
            <div style={{ color: COLORS.term.green, opacity: fadeIn(f, 120) }}>✓ 完成 — 主講人全程露臉陪同</div>
            <div style={{ color: COLORS.term.dim, opacity: fadeIn(f, 200) }}>
              {"// 之後任何教學片都能一行掛上這個 <FaceCam /> 元件"}
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* 右下角圓形露臉小窗：兩段正面片段接續 */}
      <div style={{ position: "absolute", right: 64, bottom: 60, transform: `scale(${pop})` }}>
        <Sequence from={0} durationInFrames={SEG1_FRAMES} layout="none">
          <CamCircle startFromSec={0} size={320} />
        </Sequence>
        <Sequence from={SEG1_FRAMES} durationInFrames={SEG2_FRAMES} layout="none">
          <CamCircle startFromSec={15.5} size={320} />
        </Sequence>
        <div
          style={{
            position: "absolute",
            bottom: -14,
            left: "50%",
            transform: "translateX(-50%)",
            background: COLORS.ink,
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
            padding: "8px 22px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            boxShadow: SHADOW.md,
          }}
        >
          Max · {BRAND_MARK}
        </div>
      </div>

      {/* demo 標籤 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 64,
          fontSize: 30,
          fontWeight: 800,
          color: COLORS.muted,
          letterSpacing: 2,
        }}
      >
        Demo A · 真實露臉小窗（可掛進任何教學片）
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────────────────────────────────────────────
 * Demo B · 獨立露臉短片（9:16）：實拍為主角＋標題卡＋字幕＋BGM
 * BGM 先借用 bgm-crystal.mp3 當佔位；正式版另生專屬一首
 * ──────────────────────────────────────────────────────────────── */

export const FACE_REEL_FRAMES = 21 * FPS; // 630

const REEL_CAPTIONS: { text: string; from: number; dur: number }[] = [
  { text: "大家好，我是 Max", from: 66, dur: 90 },
  { text: "這是我的第一支露臉測試", from: 160, dur: 110 },
  { text: "各角度看看效果如何", from: 280, dur: 140 },
  { text: "喜歡的話，之後教學片就常見面！", from: 430, dur: 150 },
];

export const FaceIntroReelDemo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 開場標題卡（0:00 亮相，約 2.2 秒後讓位給畫面）
  const coverOpacity = interpolate(f, [56, 76], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titlePop = spring({ frame: f - 4, fps, config: { damping: 13, stiffness: 110 } });
  const endFade = interpolate(f, [FACE_REEL_FRAMES - 50, FACE_REEL_FRAMES - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0B0E1A", fontFamily: FONT.uiCjk }}>
      {/* 實拍全幅 */}
      <OffthreadVideo src={staticFile(SRC)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />

      {/* 字幕 */}
      {REEL_CAPTIONS.map((c) => {
        const o =
          fadeIn(f, c.from, 8) *
          interpolate(f, [c.from + c.dur - 8, c.from + c.dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={c.from}
            style={{
              position: "absolute",
              bottom: 220,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: o,
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(10,12,24,0.72)",
                color: "#fff",
                fontSize: 52,
                fontWeight: 800,
                padding: "18px 40px",
                borderRadius: 18,
                letterSpacing: 1,
              }}
            >
              {c.text}
            </span>
          </div>
        );
      })}

      {/* 開場標題卡 */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(160deg, rgba(8,10,22,0.92) 0%, rgba(8,10,22,0.78) 100%)",
          alignItems: "center",
          justifyContent: "center",
          opacity: coverOpacity,
          pointerEvents: "none",
        }}
      >
        <div style={{ transform: `scale(${titlePop})`, textAlign: "center", padding: "0 80px" }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#FFD479", letterSpacing: 6, marginBottom: 28 }}>
            Demo B · 獨立露臉短片
          </div>
          <div style={{ fontSize: 96, fontWeight: 900, color: "#fff", lineHeight: 1.25 }}>
            頻道主理人
            <br />
            首度露臉
          </div>
          <div style={{ marginTop: 36, fontSize: 34, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{BRAND_MARK}</div>
        </div>
      </AbsoluteFill>

      {/* 結尾淡出＋CTA */}
      <AbsoluteFill
        style={{
          background: "rgba(8,10,22,0.9)",
          alignItems: "center",
          justifyContent: "center",
          opacity: endFade,
          pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: "#fff" }}>感謝收看 🙏</div>
          <div style={{ marginTop: 24, fontSize: 38, fontWeight: 700, color: "#FFD479" }}>訂閱 · 按讚 · 分享</div>
        </div>
      </AbsoluteFill>

      {/* BGM（佔位：正式版另生專屬一首） */}
      <Audio src={staticFile("bgm-crystal.mp3")} volume={0.16} />
    </AbsoluteFill>
  );
};
