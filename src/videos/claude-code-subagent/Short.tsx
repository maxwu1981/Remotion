import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FONT } from "../../shared-skills/theme";

const VO = (id: string) => <Audio src={staticFile(`vo/subagent-short/${id}.mp3`)} />;

/**
 * 9:16「真實介面」Short — 1080×1920, 30fps.
 * 原則：內容最大化（手機可讀）、人物縮小當小角落、少留白。
 * 真實螢幕錄影(public/footage) 裁掉左側目錄欄＋放大只留關鍵對話；7 頁報告放大；
 * 曉晴 2D 小半身右下角；大字幕；真數字；outro CTA。字幕版（VO 之後配）。
 */
const ORANGE = "#E7902F";
const NAVY = "#0F1530";

const fade = (frame: number, inAt: number, dur = 12) =>
  interpolate(frame, [inAt, inAt + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Bg: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(165deg, #0E2A4E 0%, #1E5B9E 52%, #0A1626 100%)" }} />
);

/** 曉晴 2D 小半身，右下小角落（縮小，不搶內容）。 */
const SunnyMini: React.FC<{ h?: number }> = ({ h = 360 }) => (
  <Img src={staticFile("thumb/sunny.png")} style={{ position: "absolute", right: -14, bottom: 0, height: h, objectFit: "contain", filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.45))" }} />
);

/** mac 視窗框：裁掉左側目錄欄、放大只留關鍵對話內容。 */
const MacWindow: React.FC<{ src: string; startFrom: number; viewW: number; viewH: number; dispW: number; ox: number; oy: number; top: number; left?: number; canvasW?: number }> = ({ src, startFrom, viewW, viewH, dispW, ox, oy, top, left, canvasW = 1080 }) => (
  <div style={{ position: "absolute", top, left: left ?? (canvasW - viewW) / 2, width: viewW, borderRadius: 20, overflow: "hidden", background: NAVY, boxShadow: "0 26px 70px rgba(0,0,0,0.5)" }}>
    <div style={{ height: 42, background: "#1A2145", display: "flex", alignItems: "center", gap: 9, padding: "0 16px" }}>
      <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#E2604A" }} />
      <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#E8A53C" }} />
      <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#4FBF7B" }} />
    </div>
    <div style={{ width: viewW, height: viewH, overflow: "hidden", position: "relative" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={{ position: "absolute", width: dispW, left: -ox, top: -oy }} />
    </div>
  </div>
);

/** 大字幕（半透明底襯，避免壓在內容上看不清）。 */
const Caption: React.FC<{ lines: string[]; accentLine?: number }> = ({ lines, accentLine }) => (
  <div style={{ position: "absolute", left: 40, right: 40, bottom: 70, textAlign: "center" }}>
    <div style={{ display: "inline-block", padding: "16px 34px", borderRadius: 22, background: "rgba(8,16,30,0.55)" }}>
      {lines.map((t, i) => (
        <div key={i} style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: i === accentLine ? 78 : 64, lineHeight: 1.22, color: i === accentLine ? ORANGE : "#FFFFFF", textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>{t}</div>
      ))}
    </div>
  </div>
);

const Kicker: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 38, letterSpacing: 2, color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{text}</div>
);

/* ── scenes ─────────────────────────────────────────────── */

const SHook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 56, right: 56, top: 430, textAlign: "center", opacity: fade(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 48, color: "rgba(255,255,255,0.85)" }}>Claude Code 實測</div>
        <div style={{ marginTop: 30, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 150, lineHeight: 1.08, color: "#fff", textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}>
          <span style={{ color: ORANGE }}>5</span> 個分身
        </div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 150, lineHeight: 1.08, color: "#fff", textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}>該不該開？</div>
        <div style={{ marginTop: 40, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 48, color: "rgba(255,255,255,0.9)" }}>我真的開 5 個 subagent 實測</div>
      </div>
      <SunnyMini h={520} />
      {VO("sh_hook")}
    </AbsoluteFill>
  );
};

const SRun: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fade(f, 4) }}>
      <Kicker text="真實畫面 · 不是動畫" />
      <MacWindow src="footage/seg1.mov" startFrom={1500} viewW={1040} viewH={1020} dispW={1860} ox={350} oy={58} top={150} />
      <SunnyMini h={330} />
      <Caption lines={["開 5 個 subagent 並行查專案"]} />
      {VO("sh_run")}
    </AbsoluteFill>
  );
};

const SData: React.FC = () => {
  const f = useCurrentFrame();
  const card = (title: string, body: string, color: string, delay: number) => (
    <div style={{ width: 1000, background: "rgba(255,255,255,0.98)", borderRadius: 28, padding: "44px 50px", boxShadow: "0 20px 50px rgba(0,0,0,0.35)", borderLeft: `14px solid ${color}`, opacity: fade(f, delay), transform: `translateY(${(1 - fade(f, delay)) * 26}px)` }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, color: "#14142B" }}>{title}</div>
      <div style={{ marginTop: 14, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 76, color }}>{body}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Kicker text="實測數字 · 真的量了" />
      <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        {card("小任務 5 檔 × 10 行", "並行反而慢 24% ❌", "#E5484D", 4)}
        {card("重任務 56 檔 × 1547 行", "並行省 59% ✅", "#16A34A", 22)}
      </div>
      <SunnyMini h={330} />
      <Caption lines={["任務夠重，並行才划算"]} />
      {VO("sh_data")}
    </AbsoluteFill>
  );
};

const SBuild: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fade(f, 4) }}>
      <Kicker text="真實畫面 · 建構過程" />
      <MacWindow src="footage/seg2.mov" startFrom={2700} viewW={1040} viewH={1020} dispW={1860} ox={350} oy={58} top={150} />
      <SunnyMini h={330} />
      <Caption lines={["再請它生一份健檢報告"]} />
      {VO("sh_build")}
    </AbsoluteFill>
  );
};

const SDoc: React.FC = () => {
  const f = useCurrentFrame();
  const pages = ["docreport/page-1.png", "docreport/page-2.png", "docreport/page-4.png"];
  const idx = Math.min(2, Math.floor(f / 64));
  return (
    <AbsoluteFill>
      <Kicker text="完成 · 真實 7 頁報告" />
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fade(f, 4) }}>
        <div style={{ width: 940, height: 1340, background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 26px 70px rgba(0,0,0,0.5)" }}>
          <Img src={staticFile(pages[idx])} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </div>
      </div>
      <SunnyMini h={300} />
      <Caption lines={["7 頁報告，真的長出來了"]} accentLine={0} />
      {VO("sh_doc")}
    </AbsoluteFill>
  );
};

const SOutro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 56, right: 56, top: 470, textAlign: "center", opacity: fade(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 104, lineHeight: 1.16, color: "#fff", textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}>任務夠重<br />才開 subagent</div>
        <div style={{ marginTop: 56, display: "flex", justifyContent: "center", gap: 24 }}>
          {["👍 按讚", "🔔 訂閱", "🔗 分享"].map((t) => (
            <div key={t} style={{ padding: "22px 34px", borderRadius: 999, background: "rgba(255,255,255,0.96)", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: "#14142B" }}>{t}</div>
          ))}
        </div>
        <div style={{ marginTop: 50, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, color: ORANGE }}>Ai-Wisdom-01</div>
      </div>
      <SunnyMini h={520} />
      {VO("sh_outro")}
    </AbsoluteFill>
  );
};

export const SUBAGENT_SHORT_FRAMES = 1085;

export const SubagentShort: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    <Audio src={staticFile("bgm-piano.mp3")} volume={0.07} />
    <Sequence from={0} durationInFrames={94}><SHook /></Sequence>
    <Sequence from={94} durationInFrames={220}><SRun /></Sequence>
    <Sequence from={314} durationInFrames={256}><SData /></Sequence>
    <Sequence from={570} durationInFrames={167}><SBuild /></Sequence>
    <Sequence from={737} durationInFrames={179}><SDoc /></Sequence>
    <Sequence from={916} durationInFrames={169}><SOutro /></Sequence>
  </AbsoluteFill>
);

/* ── 16:9 橫版（真實介面，跟 Short 同調）1920×1080 ─────────── */

const WSunny: React.FC<{ h?: number }> = ({ h = 1020 }) => (
  <Img src={staticFile("thumb/sunny.png")} style={{ position: "absolute", right: -24, bottom: 0, height: h, objectFit: "contain", filter: "drop-shadow(0 6px 26px rgba(0,0,0,0.45))" }} />
);
const WKicker: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", top: 50, left: 84, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 42, letterSpacing: 1, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{text}</div>
);
const WCap: React.FC<{ lines: string[]; accentLine?: number }> = ({ lines, accentLine }) => (
  <div style={{ position: "absolute", left: 84, bottom: 70, maxWidth: 1320 }}>
    <div style={{ display: "inline-block", padding: "16px 34px", borderRadius: 20, background: "rgba(8,16,30,0.55)" }}>
      {lines.map((t, i) => (
        <div key={i} style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: i === accentLine ? 72 : 58, lineHeight: 1.2, color: i === accentLine ? ORANGE : "#fff", textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>{t}</div>
      ))}
    </div>
  </div>
);

const WHook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 300, opacity: fade(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 50, color: "rgba(255,255,255,0.85)" }}>Claude Code 實測</div>
        <div style={{ marginTop: 24, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 168, lineHeight: 1.06, color: "#fff", textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}><span style={{ color: ORANGE }}>5</span> 個分身</div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 168, lineHeight: 1.06, color: "#fff", textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}>該不該開？</div>
        <div style={{ marginTop: 34, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 50, color: "rgba(255,255,255,0.9)" }}>我真的開 5 個 subagent 實測給你看</div>
      </div>
      <WSunny />
      {VO("sh_hook")}
    </AbsoluteFill>
  );
};
const WRun: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fade(f, 4) }}>
      <WKicker text="真實畫面 · 不是動畫" />
      <MacWindow src="footage/seg1.mov" startFrom={1500} canvasW={1920} left={84} top={150} viewW={1240} viewH={770} dispW={3300} ox={690} oy={285} />
      <WSunny />
      <WCap lines={["開 5 個 subagent，並行查專案"]} />
      {VO("sh_run")}
    </AbsoluteFill>
  );
};
const WData: React.FC = () => {
  const f = useCurrentFrame();
  const card = (title: string, body: string, color: string, delay: number) => (
    <div style={{ width: 1180, background: "rgba(255,255,255,0.98)", borderRadius: 26, padding: "40px 52px", boxShadow: "0 20px 50px rgba(0,0,0,0.35)", borderLeft: `14px solid ${color}`, opacity: fade(f, delay), transform: `translateY(${(1 - fade(f, delay)) * 24}px)` }}>
      <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: "#14142B" }}>{title}</div>
      <div style={{ marginTop: 10, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 72, color }}>{body}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <WKicker text="實測數字 · 真的量了" />
      <div style={{ position: "absolute", top: 250, left: 84, display: "flex", flexDirection: "column", gap: 40 }}>
        {card("小任務 5 檔 × 10 行", "並行反而慢 24% ❌", "#E5484D", 4)}
        {card("重任務 56 檔 × 1547 行", "並行省 59% ✅", "#16A34A", 22)}
      </div>
      <WSunny />
      <WCap lines={["任務夠重，並行才划算"]} />
      {VO("sh_data")}
    </AbsoluteFill>
  );
};
const WBuild: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fade(f, 4) }}>
      <WKicker text="真實畫面 · 建構過程" />
      <MacWindow src="footage/seg2.mov" startFrom={2700} canvasW={1920} left={84} top={150} viewW={1240} viewH={770} dispW={3300} ox={690} oy={210} />
      <WSunny />
      <WCap lines={["再請它生一份健檢報告"]} />
      {VO("sh_build")}
    </AbsoluteFill>
  );
};
const WDoc: React.FC = () => {
  const f = useCurrentFrame();
  const pages = ["docreport/page-1.png", "docreport/page-2.png", "docreport/page-4.png"];
  const idx = Math.min(2, Math.floor(f / 56));
  return (
    <AbsoluteFill>
      <WKicker text="完成 · 真實 7 頁報告" />
      <div style={{ position: "absolute", top: 96, left: 360, opacity: fade(f, 4) }}>
        <div style={{ width: 660, height: 888, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 26px 70px rgba(0,0,0,0.5)" }}>
          <Img src={staticFile(pages[idx])} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        </div>
      </div>
      <WSunny />
      <WCap lines={["7 頁報告，真的長出來了"]} accentLine={0} />
      {VO("sh_doc")}
    </AbsoluteFill>
  );
};
const WOutro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 360, opacity: fade(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 116, lineHeight: 1.14, color: "#fff", textShadow: "0 5px 26px rgba(0,0,0,0.5)" }}>任務夠重<br />才開 subagent</div>
        <div style={{ marginTop: 50, display: "flex", gap: 24 }}>
          {["👍 按讚", "🔔 訂閱", "🔗 分享"].map((t) => (
            <div key={t} style={{ padding: "20px 34px", borderRadius: 999, background: "rgba(255,255,255,0.96)", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: "#14142B" }}>{t}</div>
          ))}
        </div>
        <div style={{ marginTop: 46, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, color: ORANGE }}>Ai-Wisdom-01</div>
      </div>
      <WSunny />
      {VO("sh_outro")}
    </AbsoluteFill>
  );
};

export const SubagentWide: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    <Audio src={staticFile("bgm-piano.mp3")} volume={0.07} />
    <Sequence from={0} durationInFrames={94}><WHook /></Sequence>
    <Sequence from={94} durationInFrames={220}><WRun /></Sequence>
    <Sequence from={314} durationInFrames={256}><WData /></Sequence>
    <Sequence from={570} durationInFrames={167}><WBuild /></Sequence>
    <Sequence from={737} durationInFrames={179}><WDoc /></Sequence>
    <Sequence from={916} durationInFrames={169}><WOutro /></Sequence>
  </AbsoluteFill>
);
