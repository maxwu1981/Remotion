/**
 * The full vertical (1080×1920) "作畫過程" video for one painting.
 *
 * A continuous rice-paper background sits behind three fading sequences:
 *   Cover (hook title) → Reveal (the painting paints itself) → Outro (落款 + CTA).
 * Everything is driven by the single PaintingConfig prop; duration comes from
 * calculatePaintingMetadata so the timeline always matches the section lengths.
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { Bgm } from "../../shared-skills/audio";
import { INK, FONTS } from "./brand";
import { Reveal } from "./reveal";
import { Cover } from "./cover";
import { Outro } from "./outro";
import { paintingSchema, sectionFrames, type PaintingConfig } from "./config";

const PAD = 70;
const STAGE_TOP = 470;
const STAGE_W = 1080 - PAD * 2;
const STAGE_H = 1080;

/** Warm 宣紙 canvas — static, continuous behind the whole piece. */
export const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(125% 80% at 50% 0%, ${INK.paperHi} 0%, ${INK.paper} 46%, ${INK.paperEdge} 100%)` }}>
    <AbsoluteFill
      style={{
        opacity: 0.045,
        backgroundImage: `repeating-linear-gradient(90deg, ${INK.ink} 0 1px, transparent 1px 5px)`,
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 260px rgba(28,24,20,0.16)" }} />
  </AbsoluteFill>
);

/** Small brand + 畫名 chip above the painting during the reveal. */
const TopBrand: React.FC<{ title: string; sealColor: string }> = ({ title, sealColor }) => (
  <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 34px", borderRadius: 999, background: "rgba(255,255,255,0.55)", border: `1px solid ${INK.paperEdge}`, backdropFilter: "blur(2px)" }}>
      <span style={{ width: 18, height: 18, borderRadius: 5, background: sealColor }} />
      <span style={{ fontFamily: FONTS.body, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: INK.inkSoft }}>峻清书画 · 作畫過程</span>
    </div>
    <div style={{ fontFamily: FONTS.title, fontWeight: 900, fontSize: 96, letterSpacing: 6, color: INK.ink, textShadow: "0 2px 0 rgba(255,255,255,0.5)" }}>
      {title}
    </div>
  </div>
);

/** The reveal section: header + the painting stage. */
const RevealScene: React.FC<{ cfg: PaintingConfig; revealFrames: number }> = ({ cfg, revealFrames }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <TopBrand title={cfg.title} sealColor={cfg.sealColor} />
      <div style={{ position: "absolute", left: PAD, top: STAGE_TOP, width: STAGE_W, height: STAGE_H }}>
        <Reveal image={cfg.image} direction={cfg.direction} sealColor={cfg.sealColor} revealFrames={revealFrames} />
      </div>
    </AbsoluteFill>
  );
};

export const PaintingReveal: React.FC<PaintingConfig> = (rawProps) => {
  // Fill defaults so a partial `--props` payload (or the Studio default) is safe.
  const cfg = paintingSchema.parse(rawProps);
  const { cover, reveal, outro, revealStart, outroStart } = sectionFrames(cfg);

  return (
    <AbsoluteFill style={{ fontFamily: FONTS.body, color: INK.ink }}>
      <PaperBg />
      <Bgm src="bgm-piano.mp3" volume={0.12} />

      <Sequence durationInFrames={cover} name="cover">
        <Cover image={cfg.image} title={cfg.title} subtitle={cfg.subtitle} sealColor={cfg.sealColor} />
      </Sequence>

      <Sequence from={revealStart} durationInFrames={reveal} name="reveal">
        <RevealScene cfg={cfg} revealFrames={reveal} />
      </Sequence>

      <Sequence from={outroStart} durationInFrames={outro} name="outro">
        <Outro image={cfg.image} title={cfg.title} subtitle={cfg.subtitle} sealColor={cfg.sealColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
