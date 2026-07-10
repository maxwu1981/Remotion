import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT, GRADIENT, RADIUS, SHADOW, TYPE } from "../../shared-skills/theme";
import { Backdrop } from "../../shared-skills/components/Backdrop";
import { BrandGlyph } from "./components";
import { ChangedFile, CommitBox, Laptop, GitHubCloud, PushArrow } from "./motifs";
import { MOTIF, S2_COMMIT_NOTE } from "./data";

/**
 * Thumbnail / cover still — the master pipeline 改檔案 → commit → push as the hero,
 * big title, one-glance takeaways. Static (renders as a <Still>), no animation.
 */
export const Poster: React.FC = () => {
  const takeaways = [
    { c: MOTIF.commit, t: "commit ＝ 本地存檔" },
    { c: MOTIF.push, t: "push ＝ 上傳雲端" },
    { c: COLORS.success, t: "跟 Claude 說一句就好" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT.uiCjk, color: COLORS.ink }}>
      <Backdrop accent={MOTIF.commit} seed="git-poster" freeze />

      {/* kicker */}
      <div style={{ position: "absolute", top: 88, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.md }}>
          <BrandGlyph size={28} />
          <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, letterSpacing: 1, color: COLORS.inkSoft }}>從零搞懂 · 新手指南</span>
        </div>
      </div>

      {/* title */}
      <div style={{ position: "absolute", top: 188, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 118, letterSpacing: -2, color: COLORS.ink, lineHeight: 1.04 }}>
          Git <span style={{ fontFamily: FONT.mono }}>commit</span> 與{" "}
          <span style={{ background: GRADIENT.remotion, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontFamily: FONT.mono }}>push</span>
        </div>
        <div style={{ marginTop: 2, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 78, letterSpacing: -1, color: COLORS.inkSoft }}>新手指南</div>
      </div>

      {/* hero pipeline */}
      <div style={{ position: "absolute", top: 486, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <ChangedFile name="login.tsx" w={172} label="改檔案" />
        <div style={{ marginBottom: 40, fontSize: 56, color: COLORS.borderStrong }}>→</div>
        <Laptop w={440} label="你的電腦（本地）">
          <CommitBox note={S2_COMMIT_NOTE} w={300} flag={false} />
        </Laptop>
        <div style={{ marginBottom: 40 }}>
          <PushArrow h={140} progress={1} color={MOTIF.push} label="push" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <GitHubCloud w={300} label="GitHub 雲端" sub="遠端 · 有備份" glow={0.7} ok />
        </div>
      </div>

      {/* takeaways */}
      <div style={{ position: "absolute", top: 916, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
        {takeaways.map((k) => (
          <div key={k.t} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRadius: RADIUS.pill, background: COLORS.surface, border: `1.5px solid ${k.c}66`, boxShadow: SHADOW.md }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: k.c }} />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: TYPE.h3, color: COLORS.ink }}>{k.t}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
