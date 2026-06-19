/**
 * One reusable, parametrized vertical (9:16) "作畫過程" video. Every painting is
 * just one PaintingConfig — feed it via the Studio schema editor, a per-painting
 * <Composition> in Root.tsx, or `--props` at render time. Duration is derived from
 * the three section lengths so it stays correct when any of them change.
 */
import { z } from "zod";
import type { CalculateMetadataFunction } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const paintingSchema = z.object({
  /** staticFile path under public/, e.g. "paintings/sigua-birds.jpg". */
  image: z.string(),
  /** 畫名 — big cover title. */
  title: z.string(),
  /** 落款 / 題詩 / 尺寸 — optional second line on the cover & outro. */
  subtitle: z.string().optional(),
  /** Direction the ink "paints" onto the paper. */
  direction: z.enum(["top", "left", "center"]).default("top"),
  /** 朱砂 seal / accent colour. */
  sealColor: z.string().default("#C0392B"),
  /** Section lengths in seconds. */
  coverSec: z.number().min(1).default(3),
  revealSec: z.number().min(4).default(20),
  outroSec: z.number().min(1).default(4),
});

export type PaintingConfig = z.infer<typeof paintingSchema>;

export const DEFAULT_PAINTING: PaintingConfig = {
  image: "paintings/sigua-birds.jpg",
  title: "絲瓜雙禽",
  subtitle: "建溪 · 寫意花鳥",
  direction: "top",
  sealColor: "#C0392B",
  coverSec: 3,
  revealSec: 20,
  outroSec: 4,
};

/** Total movie length in frames, derived from the section seconds. */
export const totalFrames = (p: PaintingConfig): number =>
  Math.round((p.coverSec + p.revealSec + p.outroSec) * FPS);

/** Section boundaries (start frame of each), so the master can place sequences. */
export const sectionFrames = (p: PaintingConfig) => {
  const cover = Math.round(p.coverSec * FPS);
  const reveal = Math.round(p.revealSec * FPS);
  const outro = Math.round(p.outroSec * FPS);
  return { cover, reveal, outro, coverStart: 0, revealStart: cover, outroStart: cover + reveal };
};

/**
 * Fills defaults and derives duration. Returning `props` ensures a partial
 * `--props` payload still arrives at the component fully populated.
 */
export const calculatePaintingMetadata: CalculateMetadataFunction<PaintingConfig> = ({ props }) => {
  const cfg = paintingSchema.parse(props);
  return {
    durationInFrames: totalFrames(cfg),
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    props: cfg,
    defaultOutName: `${cfg.title}_作畫`,
  };
};
