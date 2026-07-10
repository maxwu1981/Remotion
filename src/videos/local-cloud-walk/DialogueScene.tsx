import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";

const FPS = 30, LEAD = 15, GAP = 8, TAIL = 22;

export type DLine = { id: string; who: "n" | "o"; text: string };

export function dialogueFrames(lines: DLine[], vo: Record<string, number>): number {
  let t = LEAD;
  for (const l of lines) t += Math.ceil((vo[l.id] ?? 3) * FPS) + GAP;
  return t - GAP + TAIL;
}

const Avatar: React.FC<{ n: boolean }> = ({ n }) => (
  <div style={{ flex: "none", width: 64, height: 64, borderRadius: "50%", background: n ? "#378ADD" : "#e0734a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 24 }}>{n ? "新" : "老"}</div>
);

const Bubble: React.FC<{ line: DLine; cur: boolean; op: number; ty: number }> = ({ line, cur, op, ty }) => {
  const n = line.who === "n";
  return (
    <div style={{ display: "flex", justifyContent: n ? "flex-start" : "flex-end", opacity: cur ? op : op * 0.5, transform: `translateY(${ty}px)` }}>
      <div style={{ display: "flex", gap: 16, flexDirection: n ? "row" : "row-reverse", alignItems: "flex-end", maxWidth: 1120 }}>
        <Avatar n={n} />
        <div style={{ background: n ? "rgba(55,138,221,.16)" : "rgba(224,115,74,.16)", border: `1.5px solid ${n ? "#378ADD" : "#e0734a"}`, borderRadius: 20, padding: "18px 26px", fontFamily: FONT.uiCjk, fontSize: cur ? 34 : 27, fontWeight: 600, color: "#f4f4f8", lineHeight: 1.45 }}>{line.text}</div>
      </div>
    </div>
  );
};

export const DialogueScene: React.FC<{ lines: DLine[]; vo: Record<string, number>; voDir: string }> = ({ lines, vo, voDir }) => {
  const frame = useCurrentFrame();
  let t = LEAD;
  const segs = lines.map((l) => {
    const f = Math.ceil((vo[l.id] ?? 3) * FPS);
    const s = { ...l, from: t, dur: f };
    t += f + GAP;
    return s;
  });
  let active = 0;
  for (let i = 0; i < segs.length; i++) if (frame >= segs[i].from) active = i;
  const visible = segs.slice(Math.max(0, active - 3), active + 1);

  return (
    <AbsoluteFill style={{ background: "#0a0a0f" }}>
      <div style={{ position: "absolute", top: 54, left: 0, right: 0, textAlign: "center", color: "#a9a9be", fontFamily: FONT.uiCjk, fontSize: 26, fontWeight: 600 }}>兩人對話 · 一次回顧</div>
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 220px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {visible.map((seg) => {
            const op = interpolate(frame, [seg.from, seg.from + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const ty = interpolate(frame, [seg.from, seg.from + 12], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <Bubble key={seg.id} line={seg} cur={segs[active].id === seg.id} op={op} ty={ty} />;
          })}
        </div>
      </AbsoluteFill>
      {segs.map((seg) => (
        <Sequence key={seg.id} from={seg.from} durationInFrames={seg.dur}>
          <Audio src={staticFile(`${voDir}/${seg.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
