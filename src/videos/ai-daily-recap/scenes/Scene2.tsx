import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import type { SceneDef } from "../../../shared-skills/types";
import { SceneShell } from "../SceneShell";
import { buildScene, Captions } from "../captions";
import { Card } from "../mockups/primitives";
import { LogoBadge, ToolKey } from "../mockups/nodes";
import { FileTree, TreeRow } from "../mockups/FileTree";

const IDS = ["s2-c1", "s2-c2", "s2-c3", "s2-c4", "s2-c5", "s2-c6", "s2-c7"];
const { cues: CUES, dur: DUR } = buildScene(IDS);
const at = (i: number) => CUES[i]?.from ?? 0;

const ACCENT = COLORS.hi.sky;

const LAYERS: { label: string; sub: string; color: string; tools: ToolKey[] }[] = [
  { label: "影像層", sub: "錄製 · 剪輯 · 算繪", color: COLORS.remotion, tools: ["remotion", "obs", "capcut"] },
  { label: "AI 層", sub: "轉錄 · 看圖 · 配音", color: COLORS.hi.violet, tools: ["whisper", "gpt4o", "tts"] },
  { label: "底層", sub: "音訊 · 執行環境", color: COLORS.hi.emerald, tools: ["ffmpeg", "node", "python"] },
];

const ROWS: TreeRow[] = [
  { name: "src", depth: 0, kind: "folder" },
  { name: "index.ts", depth: 1, kind: "file", note: "進入點" },
  { name: "Root.tsx", depth: 1, kind: "file", note: "註冊合成" },
  { name: "DailyRecap.tsx", depth: 1, kind: "file", note: "16:9" },
  { name: "DailyRecapReels.tsx", depth: 1, kind: "file", note: "9:16" },
  { name: "components", depth: 1, kind: "folder" },
  { name: "public", depth: 0, kind: "folder" },
  { name: "screen.mp4", depth: 1, kind: "file", note: "錄好的螢幕" },
  { name: "episode.json", depth: 0, kind: "file", note: "設定檔" },
  { name: "render.mjs", depth: 0, kind: "file", note: "輸出雙格式" },
  { name: "transcribe.py", depth: 0, kind: "file", note: "Whisper" },
  { name: "narrate.py", depth: 0, kind: "file", note: "AI 配音" },
];

const Layer: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const L = LAYERS[i];
  return (
    <div style={{ ...appearUp(frame, at(1 + i), 16, 22) }}>
      <Card glow={frame >= at(1 + i) && frame < at(1 + i) + 40 ? L.color : undefined} pad={20} style={{ width: 712 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 92, flexShrink: 0 }}>
            <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.body, color: L.color }}>{L.label}</div>
            <div style={{ fontFamily: FONT.uiCjk, fontSize: TYPE.micro, color: COLORS.muted, marginTop: 2 }}>{L.sub}</div>
          </div>
          <span style={{ width: 1, height: 64, background: COLORS.border }} />
          <div style={{ display: "flex", gap: 12 }}>
            {L.tools.map((t) => (
              <LogoBadge key={t} tool={t} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const treeIn = appearUp(frame, at(4), 16, 22);

  return (
    <SceneShell kicker="02 / 09" title="技術架構" accent={ACCENT} durationInFrames={DUR}>
      {/* left · the stack, in three layers */}
      <div style={{ position: "absolute", left: 96, top: 214, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.tiny, letterSpacing: 2, color: COLORS.muted, marginBottom: 2 }}>
          CORE TOOLS · 技術棧
        </div>
        {LAYERS.map((_, i) => (
          <Layer key={i} i={i} />
        ))}
      </div>

      {/* right · the file tree */}
      <div style={{ position: "absolute", left: 1118, top: 214, ...treeIn }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: TYPE.tiny, letterSpacing: 2, color: COLORS.muted, marginBottom: 16 }}>
          FILE STRUCTURE · 檔案結構
        </div>
        <FileTree
          rows={ROWS}
          title="ai-daily-recap"
          startFrame={at(4) + 8}
          perRow={4}
          width={680}
          activeRows={[3, 4, 10, 11]}
          activeColor={ACCENT}
          style={{ boxShadow: SHADOW.lg }}
        />
      </div>

      <Captions cues={CUES} />
    </SceneShell>
  );
};

export const scene2: SceneDef = {
  id: "s2",
  index: 2,
  kicker: "02 / 09",
  title: "技術架構",
  accent: ACCENT,
  durationInFrames: DUR,
  Component: Scene2,
};
