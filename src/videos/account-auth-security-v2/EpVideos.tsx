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
import { ChapterCover, CHAPTER_COVERS } from "./Cover";
import frame from "./vo-frame-manifest.json";

/**
 * 帳號授權安全 V2 · 4 章切成獨立影片 EP02–EP05 (16:9, 1920×1080, 30fps)。
 * 系列「新手知道一下比較好的名詞」(EP01=廚房 Git/Linter/測試)。
 * 每支 = EP章封面(3s,含EP徽章) → 章內容(動漫章名卡+8鏡) → 曉晴CTA短片尾;單一 loop BGM。
 */
const FPS = 30;
const ORANGE = "#E7902F";
const BG = "#140d07";
const FM = frame as Record<string, number>;
const O4 = Math.round((FM["o4"] ?? 11) * FPS);

const CHAP_COVER = 90; // 3s
export const EP_OUTRO_FRAMES = 14 + O4 + 26;

const fadeIn = (f: number, at: number, dur = 14) =>
  interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 曉晴 CTA 短片尾(o4 一句:萬能鑰匙握在自己手上+訂閱/按讚/分享) */
const EpOutro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at 34% 42%, #241708 0%, ${BG} 70%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -20, bottom: -30, height: 1180, display: "flex", alignItems: "flex-end", opacity: fadeIn(f, 6, 20) }}>
        <div style={{ position: "absolute", right: 60, bottom: 40, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(231,144,47,0.22) 0%, rgba(231,144,47,0) 70%)" }} />
        <Img src={staticFile("thumb/sunny.png")} style={{ height: "100%", filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.5))" }} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 190, right: 700, opacity: fadeIn(f, 4) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 34, color: ORANGE, letterSpacing: 2 }}>一句話收尾</div>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 900, fontSize: 84, lineHeight: 1.2, color: "#fff", marginTop: 18, textShadow: "0 4px 22px rgba(0,0,0,0.6)" }}>
          萬能鑰匙，<br />握在自己手上
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 720, bottom: 220, display: "flex", gap: 22, opacity: fadeIn(f, 20, 14) }}>
        {["訂閱", "按讚", "分享"].map((t, i) => (
          <div key={t} style={{ padding: "16px 34px", borderRadius: 999, background: i === 0 ? ORANGE : "rgba(255,255,255,0.10)", border: `2px solid ${i === 0 ? ORANGE : "rgba(255,255,255,0.35)"}`, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: "#fff" }}>{t}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 70, right: 720, bottom: 96, opacity: fadeIn(f, 10, 12) }}>
        <div style={{ display: "inline-block", padding: "18px 34px", borderRadius: 20, background: "rgba(8,12,20,0.62)" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: "#fff" }}>完整版「一支旅館故事」在頻道置頂 · 訂閱看更多</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 60, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>Ai-Wisdom</div>
      <Sequence from={14}>
        <Audio src={staticFile("vo/aas-frame/o4.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};

type ChapterComp = React.FC<{ bgm?: boolean }>;

const makeEp = (idx: number, ep: string, Chapter: ChapterComp, chapterFrames: number, totalFrames: number): React.FC => {
  const Ep: React.FC = () => (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio
        src={staticFile("bgm-crystal.mp3")}
        loop
        volume={(f) =>
          interpolate(f, [0, 30, totalFrames - 60, totalFrames - 1], [0, 0.12, 0.12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <Series>
        <Series.Sequence durationInFrames={CHAP_COVER}>
          <ChapterCover {...CHAPTER_COVERS[idx]} hold={CHAP_COVER} ep={ep} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={chapterFrames}>
          <Chapter bgm={false} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={EP_OUTRO_FRAMES}>
          <EpOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
  return Ep;
};

export const EP02_FRAMES = CHAP_COVER + AAS_V2_FRAMES + EP_OUTRO_FRAMES;
export const EP03_FRAMES = CHAP_COVER + API_KEY_FRAMES + EP_OUTRO_FRAMES;
export const EP04_FRAMES = CHAP_COVER + CAPTCHA_FRAMES + EP_OUTRO_FRAMES;
export const EP05_FRAMES = CHAP_COVER + PASSWORD_FRAMES + EP_OUTRO_FRAMES;

export const EpAccessToken = makeEp(0, "EP02", AccountAuthSecurityV2, AAS_V2_FRAMES, EP02_FRAMES);
export const EpApiKey = makeEp(1, "EP03", ApiKeyChapter, API_KEY_FRAMES, EP03_FRAMES);
export const EpCaptcha = makeEp(2, "EP04", CaptchaChapter, CAPTCHA_FRAMES, EP04_FRAMES);
export const EpPassword = makeEp(3, "EP05", PasswordChapter, PASSWORD_FRAMES, EP05_FRAMES);
