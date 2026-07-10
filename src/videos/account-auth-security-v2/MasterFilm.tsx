import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FONT } from "../../shared-skills/theme";
import { AccountAuthSecurityV2, AAS_V2_FRAMES } from "./AccountAuthSecurityV2";
import { ApiKeyChapter, API_KEY_FRAMES } from "./ApiKeyChapter";
import { CaptchaChapter, CAPTCHA_FRAMES } from "./CaptchaChapter";
import { PasswordChapter, PASSWORD_FRAMES } from "./PasswordChapter";
import { AasV2Cover, ChapterCover, CHAPTER_COVERS } from "./Cover";
import frame from "./vo-frame-manifest.json";

/**
 * 帳號授權安全 V2 · 完整長片組裝 (16:9, 1920×1080, 30fps)。
 * 曉晴開場 → ch1 認證/授權/OAuth·token → ch2 API key → CAPTCHA → ch3 密碼(壓軸) → 曉晴 CTA 片尾。
 * 順序 2026-07-02 老闆拍板;曉晴只頭尾露臉(品牌臉)。
 */
const FPS = 30;
const ORANGE = "#E7902F";
const BG = "#140d07";
const FM = frame as Record<string, number>;
const sec = (id: string) => Math.round((FM[id] ?? 3) * FPS);

const LEAD = 16;
const GAP = 10;
const TAIL = 30;

export const COVER_FRAMES = 45; // 1.5s 封面閃卡(守「封面 0:00 亮相」鐵則)
export const CHAPCOVER_FRAMES = 90; // 每章 3s EP00 章封面
export const OPEN_FRAMES = LEAD + sec("o1") + GAP + sec("o2") + TAIL;
export const OUTRO_FRAMES = LEAD + sec("o3") + GAP + sec("o4") + TAIL;

const CoverFlash: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [COVER_FRAMES - 8, COVER_FRAMES - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <AasV2Cover />
    </AbsoluteFill>
  );
};

const fadeIn = (f: number, at: number, dur = 16) =>
  interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const SunnyStage: React.FC<{ children: React.ReactNode; dir: string }> = ({ children, dir }) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 300], [1.0, 1.04], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 34% 42%, #241708 0%, ${BG} 70%)`, overflow: "hidden" }}>
      {/* 曉晴 品牌臉 右側 */}
      <div style={{ position: "absolute", right: -20, bottom: -30, height: 1180, display: "flex", alignItems: "flex-end", opacity: fadeIn(f, 6, 20), transform: `scale(${drift})`, transformOrigin: "bottom right" }}>
        <div style={{ position: "absolute", right: 60, bottom: 40, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(231,144,47,0.22) 0%, rgba(231,144,47,0) 70%)" }} />
        <Img src={staticFile(dir)} style={{ height: "100%", filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.5))" }} />
      </div>
      {children}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 70, right: 720, bottom: 96, opacity: fadeIn(f, 2, 12) }}>
      <div style={{ display: "inline-block", padding: "18px 34px", borderRadius: 20, background: "rgba(8,12,20,0.62)", backdropFilter: "blur(2px)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, lineHeight: 1.4, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.75)" }}>{text}</div>
      </div>
    </div>
  );
};

const OpeningScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SunnyStage dir="thumb/sunny.png">
      <div style={{ position: "absolute", left: 70, top: 150, right: 700, opacity: fadeIn(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 34, color: ORANGE, letterSpacing: 2 }}>帳號授權安全 · 一支旅館故事</div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 900, fontSize: 92, lineHeight: 1.18, color: "#fff", marginTop: 20, textShadow: "0 4px 22px rgba(0,0,0,0.6)" }}>
          把密碼交給 AI，<br />安全嗎？
        </div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 32, color: "#e8e2d6", marginTop: 26, lineHeight: 1.5 }}>
          認證 · 授權 · access token · API key · CAPTCHA<br />一次看懂
        </div>
      </div>
      <Sequence from={LEAD} durationInFrames={sec("o1") + GAP}>
        <Caption text="把密碼交給 AI、App，背後發生什麼事？該給嗎？" />
        <Audio src={staticFile("vo/aas-frame/o1.mp3")} />
      </Sequence>
      <Sequence from={LEAD + sec("o1") + GAP}>
        <Caption text="別急著把萬能鑰匙交出去——跟我走進這間旅館。" />
        <Audio src={staticFile("vo/aas-frame/o2.mp3")} />
      </Sequence>
    </SunnyStage>
  );
};

const CtaPills: React.FC = () => {
  const f = useCurrentFrame();
  const items = ["訂閱", "按讚", "分享"];
  return (
    <div style={{ position: "absolute", left: 70, right: 720, bottom: 210, display: "flex", gap: 22, opacity: fadeIn(f, 4, 14) }}>
      {items.map((t, i) => (
        <div key={t} style={{ padding: "16px 34px", borderRadius: 999, background: i === 0 ? ORANGE : "rgba(255,255,255,0.10)", border: `2px solid ${i === 0 ? ORANGE : "rgba(255,255,255,0.35)"}`, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: "#fff" }}>{t}</div>
      ))}
    </div>
  );
};

const OutroScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SunnyStage dir="thumb/sunny.png">
      <div style={{ position: "absolute", left: 70, top: 170, right: 700, opacity: fadeIn(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 34, color: ORANGE, letterSpacing: 2 }}>一句話收尾</div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 900, fontSize: 84, lineHeight: 1.2, color: "#fff", marginTop: 18, textShadow: "0 4px 22px rgba(0,0,0,0.6)" }}>
          萬能鑰匙，<br />握在自己手上
        </div>
      </div>
      <Sequence from={LEAD} durationInFrames={sec("o3") + GAP}>
        <Caption text="認證授權・token・API key・CAPTCHA・密碼——它們各自在保護什麼，你懂了。" />
        <Audio src={staticFile("vo/aas-frame/o3.mp3")} />
      </Sequence>
      <Sequence from={LEAD + sec("o3") + GAP}>
        <CtaPills />
        <Caption text="喜歡就訂閱、按讚、分享，我們下支影片見！" />
        <Audio src={staticFile("vo/aas-frame/o4.mp3")} />
      </Sequence>
      <div style={{ position: "absolute", right: 60, top: 60, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>Ai-Wisdom</div>
    </SunnyStage>
  );
};

export const MASTER_FRAMES =
  COVER_FRAMES + OPEN_FRAMES + 4 * CHAPCOVER_FRAMES + AAS_V2_FRAMES + API_KEY_FRAMES + CAPTCHA_FRAMES + PASSWORD_FRAMES + OUTRO_FRAMES;

export const MasterFilm: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* 單一連續 BGM(loop 蓋滿全片)+頭尾淡入淡出,取代各段各自的 BGM */}
    <Audio
      src={staticFile("bgm-crystal.mp3")}
      loop
      volume={(f) =>
        interpolate(f, [0, 30, MASTER_FRAMES - 75, MASTER_FRAMES - 1], [0, 0.12, 0.12, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Series>
      <Series.Sequence durationInFrames={COVER_FRAMES}>
        <CoverFlash />
      </Series.Sequence>
      <Series.Sequence durationInFrames={OPEN_FRAMES}>
        <OpeningScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CHAPCOVER_FRAMES}>
        <ChapterCover {...CHAPTER_COVERS[0]} hold={CHAPCOVER_FRAMES} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={AAS_V2_FRAMES}>
        <AccountAuthSecurityV2 bgm={false} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CHAPCOVER_FRAMES}>
        <ChapterCover {...CHAPTER_COVERS[1]} hold={CHAPCOVER_FRAMES} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={API_KEY_FRAMES}>
        <ApiKeyChapter bgm={false} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CHAPCOVER_FRAMES}>
        <ChapterCover {...CHAPTER_COVERS[2]} hold={CHAPCOVER_FRAMES} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CAPTCHA_FRAMES}>
        <CaptchaChapter bgm={false} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CHAPCOVER_FRAMES}>
        <ChapterCover {...CHAPTER_COVERS[3]} hold={CHAPCOVER_FRAMES} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={PASSWORD_FRAMES}>
        <PasswordChapter bgm={false} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={OUTRO_FRAMES}>
        <OutroScene />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
