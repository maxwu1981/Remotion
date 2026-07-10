/**
 * 知識地圖的共用幾何(海報、MapStage、EP00 板面共用,避免各算各的而漂移)。
 * 座標系都在 2200×1400 的「地圖內座標」,實際畫面再縮放/平移過去。
 */
import { categories, nodes, type CategoryId, type MapNode } from "./tree";

export const W = 2200;
export const H = 1400;
export const COL_PAD = 56;
export const COL_TOP = 248;
export const HEADER_Y = 196;
export const CARD_W = (W - COL_PAD * 2) / categories.length - 18;
export const CARD_H = 132;
export const ROW_H = 170;

export type Placed = MapNode & { x: number; y: number; cx: number; cy: number };

export const placed: Placed[] = categories.flatMap((cat) => {
  const colIndex = categories.findIndex((c) => c.id === cat.id);
  const colNodes = nodes
    .filter((n) => n.category === cat.id)
    .sort((a, b) => a.num - b.num);
  const x = COL_PAD + colIndex * ((W - COL_PAD * 2) / categories.length) + 9;
  return colNodes.map((n, i) => {
    const y = COL_TOP + i * ROW_H;
    return { ...n, x, y, cx: x + CARD_W / 2, cy: y + CARD_H / 2 };
  });
});

export const posOf = (id: string): Placed => placed.find((p) => p.id === id)!;

export const colX = (id: CategoryId): number =>
  COL_PAD + categories.findIndex((c) => c.id === id) * ((W - COL_PAD * 2) / categories.length) + 9;
