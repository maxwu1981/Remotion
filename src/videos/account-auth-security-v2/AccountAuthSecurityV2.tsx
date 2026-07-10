import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FONT } from "../../shared-skills/theme";
import manifest from "./vo-manifest.json";

/**
 * 帳號授權安全 V2 故事版 — 樣板段落「房卡 = access token」(16:9, 1920×1080, 30fps)。
 *
 * 電影感 3D 旅館世界角色對話劇。8 鏡靜圖(Gemini Nano Banana Pro 生的 master,public/aas-v2/)
 * + Remotion 慢 Ken Burns(純縮放、單調、防抖) + fade 串接 + edge-tts 多聲線廣播劇 + 水晶鋼琴 BGM。
 *
 * 防抖紀律(見記憶 video-qa-gate 第3種抖動):字幕只用 opacity 淡入(不 translateY)、
 * Ken Burns 慢而線性、轉場短 fade、無小元件連續彈跳。
 *
 * 注意:這支樣板的畫面先用 5 張定妝 master 撐(每鏡挑最合適的 + 不同取景),
 * 之後 8 張「bespoke 分鏡圖」生好可逐鏡換掉 SHOTS[i].img。
 */
const FPS = 30;
const ORANGE = "#E7902F";
const M = manifest as Record<string, number>;
const sec = (id: string) => Math.round((M[id] ?? 3) * FPS);

const LEAD = 14; // VO 起唸前的鋪陳(讓轉場+字幕先進)
const GAP = 8; // 同鏡多句之間的停頓
const TAIL = 26; // 最後一句唸完後的留白
const XFADE = 11; // 鏡與鏡之間交叉淡入(短,防疊影抖動)
const TITLE = 60; // 開場概念標題卡 2s(老闆要放慢,別太快跳過)

type Shot = {
  key: string;
  img: string;
  lines: string[]; // vo-manifest 的 id(依序)
  caption: string; // 中文硬字幕(術語保留英文)
  kb: "in" | "out"; // Ken Burns 縮放方向(交替增加變化)
  topBanner?: boolean; // 頂部固定錨句(只在「認證/授權」那幾鏡出現,老闆 2026-07-01 定)
};

const SHOTS: Shot[] = [
  { key: "s1", img: "hero.png", lines: ["s1"], caption: "你的「萬能鑰匙」＝密碼 Password", kb: "in" },
  { key: "s2", img: "frontdesk.png", lines: ["s2"], caption: "不必把密碼交出去", kb: "out" },
  { key: "s3", img: "frontdesk.png", lines: ["s3a", "s3b"], caption: "先經過你本人同意（認證）", kb: "in", topBanner: true },
  { key: "s4", img: "keycard.png", lines: ["s4"], caption: "access token（存取令牌）≠ 密碼．只開你允許的門", kb: "in", topBanner: true },
  { key: "s5", img: "hero.png", lines: ["s5"], caption: "卡發出去了　遙控器在你手上", kb: "out", topBanner: true },
  { key: "s6", img: "doors.png", lines: ["s6"], caption: "卡只開「被授權」的門　沒授權的，本來就開不了", kb: "in", topBanner: true },
  { key: "s7", img: "keycard.png", lines: ["s7"], caption: "隨時可撤銷．密碼從未交出", kb: "out" },
  { key: "s8", img: "lobby.png", lines: ["s8"], caption: "access token＝① 限定權限　② 可撤銷　③ 在程式手上的房卡", kb: "in" },
];

const shotFrames = (s: Shot) =>
  LEAD + s.lines.reduce((a, id) => a + sec(id), 0) + (s.lines.length - 1) * GAP + TAIL;

export const AAS_V2_FRAMES =
  TITLE + SHOTS.reduce((a, s) => a + shotFrames(s), 0) - SHOTS.length * XFADE; // TITLE→s1→…→s8 = SHOTS.length 個轉場

const fadeIn = (frame: number, at: number, dur = 14) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const FRAME_W = 1920;
const FRAME_H = 1080;
/** 日式動漫圖是 Gemini 隨機挑的長寬(人物直幅、場景橫幅),用實際尺寸做 blur-fill 排版。 */
const DIM: Record<string, [number, number]> = {
  "hero.png": [572, 1024],
  "frontdesk.png": [572, 1024],
  "robot.png": [1024, 559],
  "keycard.png": [1024, 572],
  "lobby.png": [1024, 572],
  "doors.png": [1024, 572],
};

/** 蓋掉 Gemini 右下角 ✦ 浮水印:小圓 backdrop-blur,放在「圖的實框」內→跟著圖縮放、永遠蓋住那一點。 */
const WatermarkPatch: React.FC = () => (
  <div style={{ position: "absolute", left: "80%", top: "78%", width: "14%", height: "17%", borderRadius: "50%", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }} />
);

/**
 * blur-fill Ken Burns:①同圖 cover+模糊+壓暗當滿版底(接任何長寬)②清晰原圖 contain 置中、慢縮放。
 * 直幅人物→兩側柔焦補滿;橫幅場景→幾乎滿版。純縮放不位移→防抖(見 [[video-qa-gate]])。
 */
const KenBurnsImg: React.FC<{ src: string; kb: "in" | "out"; dur: number }> = ({ src, kb, dur }) => {
  const f = useCurrentFrame();
  const [w, h] = DIM[src] || [1024, 572];
  const fit = Math.min(FRAME_W / w, FRAME_H / h);
  const boxW = w * fit;
  const boxH = h * fit;
  const from = kb === "in" ? 1.03 : 1.1;
  const to = kb === "in" ? 1.1 : 1.03;
  const scale = interpolate(f, [0, dur], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgScale = interpolate(f, [0, dur], [1.16, 1.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#140d07" }}>
      <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
        <Img src={staticFile(`aas-v2/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(32px) brightness(0.45)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: boxW, height: boxH, transform: `scale(${scale})` }}>
          <Img src={staticFile(`aas-v2/${src}`)} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
          <WatermarkPatch />
        </div>
      </AbsoluteFill>
      {/* 底部暗角漸層,讓字幕清楚 */}
      <AbsoluteFill
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.62) 100%)" }}
      />
    </AbsoluteFill>
  );
};

/** 頂部固定錨句(只在認證/授權那幾鏡出現):優雅半透明藥丸,小字,淡入。 */
const TopBanner: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fadeIn(f, 8, 16) }}>
      <div style={{ padding: "12px 34px", borderRadius: 999, background: "rgba(8,12,20,0.55)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", border: "1px solid rgba(255,255,255,0.12)" }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 33, color: "#fff", letterSpacing: 0.5 }}>
          密碼＝證明你是誰<span style={{ color: ORANGE }}>（認證）</span>　·　房卡＝受限的權限<span style={{ color: ORANGE }}>（授權）</span>
        </span>
      </div>
    </div>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 90, textAlign: "center", opacity: fadeIn(f, LEAD - 6) }}>
      <div style={{ display: "inline-block", padding: "20px 40px", borderRadius: 22, background: "rgba(8,12,20,0.6)", backdropFilter: "blur(2px)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 52, lineHeight: 1.35, color: "#fff", textShadow: "0 3px 16px rgba(0,0,0,0.75)" }}>{text}</div>
      </div>
    </div>
  );
};

const ShotScene: React.FC<{ shot: Shot; dur: number }> = ({ shot, dur }) => {
  let off = LEAD;
  const audios = shot.lines.map((id) => {
    const at = off;
    off += sec(id) + GAP;
    return (
      <Sequence key={id} from={at}>
        <Audio src={staticFile(`vo/account-auth-security-v2/${id}.mp3`)} />
      </Sequence>
    );
  });
  return (
    <AbsoluteFill>
      <KenBurnsImg src={shot.img} kb={shot.kb} dur={dur} />
      {shot.topBanner && <TopBanner />}
      <Caption text={shot.caption} />
      {audios}
    </AbsoluteFill>
  );
};

const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1a120b" }}>
      <Img src={staticFile("aas-v2/lobby.png")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5, transform: `scale(${interpolate(f, [0, TITLE], [1.06, 1.0])})` }} />
      <AbsoluteFill style={{ background: "rgba(8,10,16,0.55)", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", opacity: fadeIn(f, 4) }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, color: ORANGE, letterSpacing: 2 }}>旅館故事 · 第一章</div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 78, color: "#fff", marginTop: 14, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
            房卡，就是 access token
          </div>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 34, color: "#e8e2d6", marginTop: 18 }}>限定權限．可撤銷．密碼從不交出</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const AccountAuthSecurityV2: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {bgm && <Audio src={staticFile("bgm-crystal.mp3")} volume={0.12} />}
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TITLE}>
        <TitleCard />
      </TransitionSeries.Sequence>
      {SHOTS.flatMap((shot) => {
        const dur = shotFrames(shot);
        return [
          <TransitionSeries.Transition key={`tr-${shot.key}`} presentation={fade()} timing={linearTiming({ durationInFrames: XFADE })} />,
          <TransitionSeries.Sequence key={`seq-${shot.key}`} durationInFrames={dur}>
            <ShotScene shot={shot} dur={dur} />
          </TransitionSeries.Sequence>,
        ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
