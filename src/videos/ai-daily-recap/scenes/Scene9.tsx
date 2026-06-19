import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp, springPop } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { LightStream } from "../../../shared-skills/components/lux";
import { LinkIcon, ScissorsIcon, SparkIcon, TranslateIcon, UploadIcon } from "../mockups/icons";

const IDS = ["s9-c1", "s9-c2", "s9-c3", "s9-c4", "s9-c5", "s9-c6", "s9-c7"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

const ACCENT = COLORS.hi.violet;

type RNode = { x: number; y: number; color: string; icon: React.ReactNode; label: string; sub: string; tag: string };

const NODES: RNode[] = [
  { x: 290, y: 556, color: COLORS.claude, icon: <SparkIcon size={40} color="#fff" />, label: "Claude Vision 讀截圖", sub: "從截圖自動抽出資料", tag: "01" },
  { x: 622, y: 412, color: "#FF0033", icon: <UploadIcon size={38} color="#fff" />, label: "自動上傳 YouTube", sub: "影片產生後直接發佈", tag: "02" },
  { x: 954, y: 584, color: COLORS.hi.amber, icon: <ScissorsIcon size={38} color="#fff" />, label: "自動剪 30 秒 Shorts", sub: "長片 → 短影音", tag: "03" },
  { x: 1286, y: 412, color: COLORS.hi.sky, icon: <TranslateIcon size={38} color="#fff" />, label: "字幕多國語言", sub: "英文 → 多語翻譯", tag: "04" },
  { x: 1606, y: 556, color: "#1877F2", icon: <LinkIcon size={36} color="#fff" />, label: "FB 自動帶 YT 連結", sub: "貼文自動填入連結", tag: "05" },
];

const RoadNode: React.FC<{ n: RNode; show: number }> = ({ n, show }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springPop(frame, fps, { delay: show, from: 0.6, dist: 16 });
  const pulse = 0.5 + 0.5 * Math.sin((frame - show) / 7);
  const lit = frame >= show;
  return (
    <div style={{ position: "absolute", left: n.x - 130, top: n.y - 60, width: 260, textAlign: "center", opacity: p.opacity, transform: p.transform }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `linear-gradient(140deg, ${n.color}, ${n.color}cc)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: lit ? `0 0 0 8px ${n.color}1f, 0 14px 36px ${n.color}${pulse > 0.5 ? "88" : "55"}` : `0 10px 24px ${n.color}44`,
            border: "3px solid rgba(255,255,255,0.85)",
          }}
        >
          {n.icon}
        </div>
      </div>
      <div style={{ marginTop: 14, fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.micro, letterSpacing: 1, color: n.color }}>{n.tag}</div>
      <div style={{ marginTop: 4, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.small, color: COLORS.ink }}>{n.label}</div>
      <div style={{ marginTop: 3, fontFamily: FONT.uiCjk, fontSize: TYPE.micro, color: COLORS.muted }}>{n.sub}</div>
    </div>
  );
};

export const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = appearUp(frame, at(0), 16, 22);
  const closing = springPop(frame, useVideoConfig().fps, { delay: at(6), from: 0.8, dist: 14 });

  return (
    <SceneShell kicker="09 / 09" title="未來藍圖 · Roadmap" accent={ACCENT} durationInFrames={DUR}>
      {/* subheading */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", ...intro }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: TYPE.h3, color: COLORS.inkSoft }}>
          接下來，往<span style={{ color: ACCENT }}>全自動發佈</span>一路擴充
        </span>
      </div>

      {/* glowing path segments between milestones */}
      {NODES.slice(0, -1).map((n, i) => {
        const a = NODES[i];
        const b = NODES[i + 1];
        const ctrl: [number, number] = [(a.x + b.x) / 2, Math.min(a.y, b.y) - 30];
        const prog = interpolate(frame, [at(1 + i), at(2 + i)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <LightStream
            key={i}
            from={[a.x, a.y]}
            to={[b.x, b.y]}
            ctrl={ctrl}
            progress={prog}
            color={ACCENT}
            particles={3}
            speed={70}
            particleFrom={at(2 + i)}
          />
        );
      })}

      {/* milestones */}
      {NODES.map((n, i) => (
        <RoadNode key={i} n={n} show={at(1 + i)} />
      ))}

      {/* closing banner */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 808, display: "flex", justifyContent: "center", opacity: closing.opacity, transform: closing.transform }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 28px",
            borderRadius: RADIUS.pill,
            background: `linear-gradient(135deg, ${ACCENT}, ${COLORS.remotion})`,
            color: "#fff",
            boxShadow: SHADOW.glow(ACCENT),
            fontFamily: FONT.uiCjk,
            fontWeight: 800,
            fontSize: TYPE.body,
          }}
        >
          一條龍的自動化，正在慢慢成形
        </div>
      </div>

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const scene9: SceneDef = {
  id: "s9",
  index: 9,
  kicker: "09 / 09",
  title: "未來藍圖 · Roadmap",
  accent: ACCENT,
  durationInFrames: DUR,
  Component: Scene9,
};
