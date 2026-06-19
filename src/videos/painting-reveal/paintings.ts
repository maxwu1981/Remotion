/**
 * The painting library. Add one entry per painting — that's the whole "per
 * painting" workflow. Drives both the Studio preview folder (Root.tsx) and the
 * batch renderer (scripts/render-paintings.mjs).
 *
 * `image` is a staticFile path under public/. Keep the filename ASCII/slug-style
 * (the display 畫名 goes in `title`) so it's safe in composition ids, `--props`
 * JSON and output filenames.
 */
import type { PaintingConfig } from "./config";

export const PAINTINGS: PaintingConfig[] = [
  {
    image: "paintings/sigua-birds.jpg",
    title: "絲瓜雙禽",
    subtitle: "建溪 · 寫意花鳥",
    direction: "top",
    sealColor: "#C0392B",
    coverSec: 3,
    revealSec: 20,
    outroSec: 4,
  },
];

/** Filesystem/id-safe slug derived from the image filename. */
export const paintingId = (p: PaintingConfig): string =>
  p.image.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "painting";
