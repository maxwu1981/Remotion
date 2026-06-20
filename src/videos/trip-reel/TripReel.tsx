/**
 * Vertical (1080×1920) travel photo reel. Cover → N Ken-Burns photo slides
 * (cross-faded) → outro. Frame-driven only, so it renders deterministically.
 * Driven entirely by one TripReelConfig (see config.ts).
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Bgm } from "../../shared-skills/audio";
import { appearUp, appearScale } from "../../shared-skills/anim";
import { FPS, TRANS, tripReelSchema, type TripReelConfig, type Slide } from "./config";

const TITLE = "'Hiragino Mincho ProN','Songti TC','Noto Serif CJK TC',serif";
const BODY = "'PingFang TC','Hiragino Sans','Noto Sans CJK TC',sans-serif";

/** Slow zoom + gentle directional drift across the slide's own frame range. */
const KenBurns: React.FC<{ src: string; durF: number; dir: number; from?: number }> = ({
  src,
  durF,
  dir,
  from = 1.06,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, durF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = from + 0.12 * p;
  const panX = Math.cos(dir) * 3 * (p - 0.5);
  const panY = Math.sin(dir) * 3 * (p - 0.5);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#15110c" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${panX}%, ${panY}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const SlideScene: React.FC<{ slide: Slide; dir: number; accent: string; durF: number }> = ({
  slide,
  dir,
  accent,
  durF,
}) => {
  const f = useCurrentFrame();
  const chip = appearUp(f, 6, 18, 30);
  return (
    <AbsoluteFill>
      <KenBurns src={slide.image} durF={durF} dir={dir} />
      <AbsoluteFill
        style={{ background: "linear-gradient(to bottom, rgba(18,14,10,0.74) 0%, rgba(0,0,0,0) 40%)" }}
      />
      <div style={{ position: "absolute", left: 64, top: 160, ...chip }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ width: 11, height: 60, background: accent, borderRadius: 4 }} />
          <div>
            <div
              style={{
                fontFamily: TITLE,
                fontWeight: 800,
                fontSize: 82,
                color: "#fff",
                letterSpacing: 4,
                textShadow: "0 3px 18px rgba(0,0,0,0.55)",
              }}
            >
              {slide.label}
            </div>
            {slide.sub ? (
              <div
                style={{
                  fontFamily: BODY,
                  fontSize: 40,
                  color: "#f3e6c8",
                  marginTop: 8,
                  letterSpacing: 3,
                  textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                {slide.sub}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cover: React.FC<{ cfg: TripReelConfig; durF: number }> = ({ cfg, durF }) => {
  const f = useCurrentFrame();
  const t = appearUp(f, 8, 22, 36);
  return (
    <AbsoluteFill>
      <KenBurns src={cfg.slides[0].image} durF={durF} dir={0.6} from={1.12} />
      <AbsoluteFill
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(18,14,10,0.62) 100%)" }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ ...t }}>
          <div style={{ width: 130, height: 6, background: cfg.accent, borderRadius: 3, margin: "0 auto 30px" }} />
          <div
            style={{
              fontFamily: TITLE,
              fontWeight: 900,
              fontSize: 118,
              color: "#fff",
              letterSpacing: 8,
              textShadow: "0 4px 26px rgba(0,0,0,0.6)",
            }}
          >
            {cfg.title}
          </div>
          {cfg.subtitle ? (
            <div
              style={{
                fontFamily: BODY,
                fontSize: 50,
                color: "#f3e6c8",
                marginTop: 26,
                letterSpacing: 6,
                textShadow: "0 2px 14px rgba(0,0,0,0.5)",
              }}
            >
              {cfg.subtitle}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ cfg: TripReelConfig }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const t = appearScale(f, 4, 24);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, #2a2118 0%, #15110c 70%)" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ ...t }}>
          {cfg.outroTitle ? (
            <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 100, color: "#fff", letterSpacing: 6 }}>
              {cfg.outroTitle}
            </div>
          ) : null}
          {cfg.outroSub ? (
            <div style={{ fontFamily: BODY, fontSize: 44, color: "#e9d49a", marginTop: 26, letterSpacing: 4 }}>
              {cfg.outroSub}
            </div>
          ) : null}
          <div
            style={{
              marginTop: 64,
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: 48,
              color: cfg.accent,
              letterSpacing: 6,
            }}
          >
            {cfg.handle}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TripReel: React.FC<TripReelConfig> = (raw) => {
  const cfg = tripReelSchema.parse(raw);
  const cf = Math.round(cfg.coverSec * FPS);
  const sf = Math.round(cfg.slideSec * FPS);
  const of = Math.round(cfg.outroSec * FPS);
  const trans = linearTiming({ durationInFrames: TRANS });

  return (
    <AbsoluteFill style={{ background: "#15110c" }}>
      <Bgm src="bgm-piano.mp3" volume={0.16} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={cf}>
          <Cover cfg={cfg} durF={cf} />
        </TransitionSeries.Sequence>
        {cfg.slides.map((s, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Transition presentation={fade()} timing={trans} />
            <TransitionSeries.Sequence durationInFrames={sf}>
              <SlideScene slide={s} dir={i * 1.3} accent={cfg.accent} durF={sf} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
        <TransitionSeries.Transition presentation={fade()} timing={trans} />
        <TransitionSeries.Sequence durationInFrames={of}>
          <Outro cfg={cfg} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
