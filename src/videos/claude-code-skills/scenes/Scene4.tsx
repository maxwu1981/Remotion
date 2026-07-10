import React from "react";
import { TYPE } from "../../../shared-skills/theme";
import { Sfx } from "../../../shared-skills/audio";
import type { SceneDef } from "../../../shared-skills/types";
import { Captions, buildScene } from "../captions";
import { Shell, Heading, KeyLine, Stamp, Terminal } from "../components";
import { MOTIF } from "../data";

const { cues: CUES, dur: DUR } = buildScene(
  ["s4-c1", "s4-c2", "s4-c3", "s4-c4", "s4-c5", "s4-c6", "s4-c7"],
  { lead: 14, minDur: 440 },
);
const at = (i: number) => CUES[i].from;

export const Scene4: React.FC = () => {
  return (
    <Shell durationInFrames={DUR} accent={MOTIF.lean} kicker="經驗 03 · 漸進式揭露" seed="s4">
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, display: "flex", justifyContent: "center" }}>
        <Heading zh="經驗三：SKILL.md 不要塞太多" en="Progressive disclosure — keep the main file lean" delay={at(0)} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 286, display: "flex", justifyContent: "center" }}>
        <Terminal
          title="my-skill/"
          width={1220}
          start={40}
          step={15}
          lines={[
            { k: "err", t: "把所有細節都塞進 SKILL.md → 太長、抓不到重點、載入慢" },
            { k: "cmt", t: "改成拆檔（漸進式揭露）：" },
            { k: "ok", t: "SKILL.md        ← 只留索引 + 最關鍵幾步" },
            { k: "out", t: "├─ reference.md   ← 細節" },
            { k: "out", t: "├─ examples.md    ← 長範例" },
            { k: "out", t: "└─ scripts/fill.py ← 腳本" },
            { k: "ok", t: "需要時 Claude 再去讀 → 主檔保持精簡" },
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", gap: 18 }}>
        <Stamp kind="no" text="✘ 全部塞進主檔" at={at(2)} size={TYPE.small} />
        <Stamp kind="yes" text="✔ 索引 + 參考檔" at={at(4)} size={TYPE.small} rotate={2} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118 }}>
        <KeyLine text="主檔只留索引 + 關鍵步驟，細節／範例／腳本拆到參考檔 — 要用再讀（漸進式揭露）" tone={MOTIF.lean} delay={at(4)} />
      </div>

      <Sfx src="pop" at={at(2)} volume={0.32} />
      <Sfx src="ding" at={at(6)} volume={0.32} />
      <Captions cues={CUES} />
    </Shell>
  );
};

export const scene4: SceneDef = {
  id: "s4",
  index: 4,
  kicker: "經驗 03 · 漸進式揭露",
  title: "Progressive disclosure",
  accent: MOTIF.lean,
  durationInFrames: DUR,
  Component: Scene4,
};
