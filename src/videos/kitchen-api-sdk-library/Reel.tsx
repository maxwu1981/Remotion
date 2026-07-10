import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FONT } from "../../shared-skills/theme";
import { Sfx } from "../../shared-skills/audio";
import { ApiCover, SERIES, EP } from "./Cover";
import VO from "./api.vo.json";

/**
 * 「拿別人的功能 = 去餐廳吃飯」9:16 情境幽默科普 Short（1080×1920, 30fps）· EP02。
 * 比喻：API=隔窗口點餐 / SDK=料理包帶回家自己煮 / 函式庫=現成醬料。
 * 規格沿用 EP01：0:00 封面閃卡 → 曉晴頭尾露臉 → 中間 2D 動畫短劇 + 綜藝 emoji 貼圖
 * + 中英雙語大字幕（API/SDK/函式庫 橙色高亮）+ 全套音效 + 廚房門轉場。
 * 旁白＝edge-tts 曉晴(zh-TW-HsiaoChenNeural)。釐清點「SDK 不是 API 的二選一」放慢強調。
 *
 * 抗抖：背景靜態、動畫在 hold 期間 settle 成靜止 → lossless 持幀近黑。
 */

const FPS = 30;
const ORANGE = "#F0A23C";
const VIOLET = "#B7A4FF";
const TEAL = "#6FD8C8";
const GREEN = "#7BE3A4";

const vo = (id: keyof typeof VO) => VO[id] as number;
const beat = (id: keyof typeof VO, tail = 18) => Math.ceil(vo(id) * FPS) + tail;

const VOA: React.FC<{ id: keyof typeof VO }> = ({ id }) => (
  <Audio src={staticFile(`vo/apisdk/${id}.mp3`)} />
);

const fade = (frame: number, inAt: number, dur = 12) =>
  interpolate(frame, [inAt, inAt + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const POP = Easing.bezier(0.34, 1.5, 0.5, 1);

/* ── shared pieces（與 EP01 同款）─────────────────────────── */

const Bg: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(125% 95% at 50% 16%, #1B3D6E 0%, #122A4E 46%, #08172E 100%)" }}>
    <AbsoluteFill
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1.5px, transparent 1.6px)",
        backgroundSize: "54px 54px",
        opacity: 0.5,
      }}
    />
  </AbsoluteFill>
);

const Sunny: React.FC<{ h?: number }> = ({ h = 780 }) => (
  <Img
    src={staticFile("thumb/sunny.png")}
    style={{ position: "absolute", right: -28, bottom: 0, height: h, objectFit: "contain", filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.45))" }}
  />
);

const Kicker: React.FC<{ text: string; color?: string }> = ({ text, color = "#EAF0FB" }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 78, left: 0, right: 0, textAlign: "center", opacity: fade(f, 2) }}>
      <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 38, letterSpacing: 4, color, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{text}</span>
    </div>
  );
};

/** 橙色高亮關鍵詞。 */
const O: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: ORANGE }}>{children}</span>
);

/** 中英雙語大字幕（底部，半透明襯底，手機可讀）。 */
const Caption: React.FC<{ zh: React.ReactNode; en: string }> = ({ zh, en }) => {
  const f = useCurrentFrame();
  const o = fade(f, 3);
  const y = interpolate(o, [0, 1], [18, 0]);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 104, textAlign: "center", opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ display: "inline-block", padding: "20px 34px", borderRadius: 24, background: "rgba(8,16,30,0.52)", backdropFilter: "blur(4px)" }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 58, lineHeight: 1.22, color: "#FFFFFF", textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>{zh}</div>
        <div style={{ marginTop: 10, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 32, lineHeight: 1.25, color: "rgba(220,230,246,0.82)" }}>{en}</div>
      </div>
    </div>
  );
};

/** 綜藝貼圖：彈入後靜止（不持續晃動，保持渲染穩定）。 */
const Sticker: React.FC<{ children: React.ReactNode; x: number; y: number; size?: number; delay?: number; rot?: number }> = ({ children, x, y, size = 90, delay = 0, rot = 0 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: POP });
  const o = interpolate(f, [delay, delay + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, fontSize: size, opacity: o, transform: `scale(${0.5 + 0.5 * t}) rotate(${rot}deg)`, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.4))" }}>{children}</div>
  );
};

/** 廚房門開場轉場：兩扇門蓋住 → 滑開露出場景。 */
const DoorOpen: React.FC<{ at?: number; dur?: number }> = ({ at = 0, dur = 15 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  if (p >= 1) return null;
  const shift = p * 560;
  const panel = (side: "L" | "R"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 542,
    [side === "L" ? "left" : "right"]: 0,
    background: side === "L" ? "linear-gradient(90deg,#0A1730 0%,#19355A 100%)" : "linear-gradient(270deg,#0A1730 0%,#19355A 100%)",
    transform: `translateX(${side === "L" ? -shift : shift}px)`,
    boxShadow: side === "L" ? "6px 0 30px rgba(0,0,0,0.55)" : "-6px 0 30px rgba(0,0,0,0.55)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: side === "L" ? "flex-end" : "flex-start",
  });
  const handle: React.CSSProperties = { width: 14, height: 150, borderRadius: 8, background: "rgba(240,162,60,0.85)", margin: "0 26px" };
  return (
    <>
      <div style={panel("L")}><div style={handle} /></div>
      <div style={panel("R")}><div style={handle} /></div>
    </>
  );
};

/* ── beats ─────────────────────────────────────────────────── */

/** S0 · 封面 0:00 閃卡。 */
const BCover: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fade(f, 0, 6) }}>
      <ApiCover />
      <Sfx src="kf-boom.mp3" at={1} volume={0.8} durationInFrames={60} />
    </AbsoluteFill>
  );
};

/** S1 · 曉晴 Hook：三個詞想成餐廳就懂。 */
const BHook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kicker text={`${EP} ・ ${SERIES}`} color={ORANGE} />
      <div style={{ position: "absolute", left: 70, top: 360, right: 360 }}>
        {["API ？", "SDK ？", "函式庫 ？"].map((t, i) => (
          <div key={t} style={{ marginBottom: 20, opacity: fade(f, 10 + i * 12), transform: `translateX(${(1 - fade(f, 10 + i * 12)) * -30}px)` }}>
            <span style={{ display: "inline-block", padding: "14px 30px", borderRadius: 16, background: "rgba(240,162,60,0.16)", border: `2px solid ${ORANGE}`, fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 60, color: "#FFE9CC" }}>{t}</span>
          </div>
        ))}
        <div style={{ marginTop: 26, opacity: fade(f, 60), fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 70, color: "#FFFFFF", textShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>
          想成<O>餐廳</O>就懂
        </div>
      </div>
      <Sunny h={820} />
      <Caption zh={<>API・SDK・函式庫 差在哪？</>} en={"API, SDK, library — what's the difference?"} />
      <Sfx src="kf-boom.mp3" at={2} volume={0.45} durationInFrames={60} />
      <VOA id="a_hook" />
    </AbsoluteFill>
  );
};

/** S2 · 核心問題：隔窗口點 vs 帶回家煮。 */
const BSetup: React.FC = () => {
  const f = useCurrentFrame();
  const card = (delay: number): React.CSSProperties => {
    const t = interpolate(f, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: POP });
    return {
      width: 430,
      padding: "34px 0",
      borderRadius: 26,
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.18)",
      textAlign: "center",
      opacity: interpolate(f, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      transform: `translateY(${(1 - t) * 30}px) scale(${0.85 + 0.15 * t})`,
    };
  };
  return (
    <AbsoluteFill>
      <Kicker text="其實只有一個問題 ▾" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", opacity: fade(f, 16) }}>
        <div style={{ fontSize: 150 }}>🤔</div>
        <div style={{ marginTop: 4, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 56, color: "#DCE6F6" }}>這頓飯，你要怎麼吃？</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", gap: 36 }}>
        <div style={card(34)}>
          <div style={{ fontSize: 110 }}>🪟</div>
          <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, color: "#FFE9CC" }}>隔窗口點</div>
        </div>
        <div style={{ alignSelf: "center", fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 88, color: ORANGE, opacity: fade(f, 50) }}>VS</div>
        <div style={card(48)}>
          <div style={{ fontSize: 110 }}>🏠</div>
          <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, color: "#FFE9CC" }}>帶回家煮</div>
        </div>
      </div>
      <Caption zh={<>隔窗口<O>點</O>？還是搬回家自己<O>煮</O>？</>} en={"Order at the window, or cook it at home?"} />
      <DoorOpen at={0} dur={15} />
      <Sfx src="kf-crow.mp3" at={18} volume={0.4} durationInFrames={40} />
      <VOA id="a_setup" />
    </AbsoluteFill>
  );
};

/** S3 · API＝隔窗口點餐（菜單→點→廚房端出，你不進廚房）。 */
const BApi: React.FC = () => {
  const f = useCurrentFrame();
  const ordered = f >= 70;
  const served = f >= 150;
  const slide = interpolate(f, [150, 176], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <AbsoluteFill>
      <Kicker text="API ＝ 隔窗口點餐 🧾" color={ORANGE} />
      {/* service window */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontSize: 210 }}>🪟</div>
          {/* kitchen behind the wall */}
          <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", fontSize: 92, opacity: 0.9 }}>🍳</div>
          {/* plate served out */}
          {served && (
            <div style={{ position: "absolute", bottom: -36, left: "50%", transform: `translateX(-50%) translateY(${slide}px)`, fontSize: 110 }}>🍽️</div>
          )}
        </div>
        <div style={{ marginTop: 10, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 52, color: served ? GREEN : "#DCE6F6" }}>
          {served ? "廚房做好，端出來 😋" : ordered ? "「我要這個！」" : "看菜單，跟服務生點…"}
        </div>
      </div>
      {/* order bubble */}
      {ordered && !served && (
        <div style={{ position: "absolute", left: 90, top: 330, opacity: fade(f, 70), fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: "#14142B", background: "rgba(255,255,255,0.95)", padding: "14px 24px", borderRadius: 18, boxShadow: "0 10px 28px rgba(0,0,0,0.4)" }}>🧾 點餐 → 廚房</div>
      )}
      <Sticker x={760} y={350} delay={40} size={96} rot={10}>🚫🚪</Sticker>
      <Caption zh={<><O>API</O>＝隔牆點餐，人家幫你做</>} en={"API = order at the window; they cook it for you"} />
      <DoorOpen at={0} dur={14} />
      <Sfx src="kf-gong.mp3" at={148} volume={0.5} durationInFrames={60} />
      <VOA id="a_api" />
    </AbsoluteFill>
  );
};

/** S4 · SDK＝料理包（開盒→食材/食譜/工具→自家廚房，內附點餐工具伏筆）。 */
const BSdk: React.FC = () => {
  const f = useCurrentFrame();
  const open = f >= 60;
  return (
    <AbsoluteFill>
      <Kicker text="SDK ＝ 一整盒料理包 📦" color={VIOLET} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center" }}>
        <div style={{ fontSize: 180, transform: `rotate(${open ? 0 : -4}deg)` }}>{open ? "📦" : "🎁"}</div>
      </div>
      {/* spilled contents */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 26 }}>
        {[
          { e: "🥬", t: "食材", d: 70 },
          { e: "📜", t: "食譜", d: 84 },
          { e: "🔧", t: "工具", d: 98 },
        ].map((c) => {
          const t = interpolate(f, [c.d, c.d + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: POP });
          return (
            <div key={c.t} style={{ width: 250, padding: "22px 0", borderRadius: 20, background: "rgba(183,164,255,0.12)", border: `1px solid ${VIOLET}55`, textAlign: "center", opacity: interpolate(f, [c.d, c.d + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${(1 - t) * 28}px) scale(${0.85 + 0.15 * t})` }}>
              <div style={{ fontSize: 84 }}>{c.e}</div>
              <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 42, color: "#EFE9FF" }}>{c.t}</div>
            </div>
          );
        })}
      </div>
      {/* foreshadow myth: kit even contains the ordering tool */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 930, textAlign: "center", opacity: fade(f, 150) }}>
        <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 46, color: VIOLET, background: "rgba(183,164,255,0.14)", padding: "12px 24px", borderRadius: 16, border: `2px solid ${VIOLET}66` }}>📦 還附「幫你點餐 🧾」的工具</span>
      </div>
      <Sticker x={150} y={360} delay={62} size={90} rot={-10}>🏠</Sticker>
      <Caption zh={<><span style={{ color: VIOLET }}>SDK</span>＝整盒帶回家，自己組</>} en={"SDK = the whole kit; you assemble it at home"} />
      <DoorOpen at={0} dur={14} />
      <Sfx src="kf-sparkle.mp3" at={60} volume={0.45} durationInFrames={50} />
      <VOA id="a_sdk" />
    </AbsoluteFill>
  );
};

/** S5 · 函式庫＝現成醬料（瓶子傾倒→滴入鍋→立刻有味）。 */
const BLib: React.FC = () => {
  const f = useCurrentFrame();
  const tilt = interpolate(f, [40, 64], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pouring = f >= 56 && f < 120;
  const flavored = f >= 120;
  return (
    <AbsoluteFill>
      <Kicker text="函式庫 ＝ 現成醬料 🧴" color={TEAL} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontSize: 220 }}>🍲</div>
          <div style={{ position: "absolute", top: -36, right: 40, fontSize: 130, transform: `rotate(${tilt}deg)`, transformOrigin: "bottom left", opacity: f >= 36 && f < 120 ? 1 : 0 }}>🧴</div>
          {pouring && [0, 1, 2].map((i) => {
            const yy = interpolate((f - 56 + i * 7) % 24, [0, 24], [0, 150]);
            return <div key={i} style={{ position: "absolute", top: 30 + yy, right: 150 + i * 12, width: 12, height: 12, borderRadius: "50%", background: TEAL, opacity: 0.85 }} />;
          })}
        </div>
        <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 54, color: flavored ? GREEN : "#DCE6F6" }}>
          {flavored ? "立刻就有味道 ✨" : "不用從頭熬，開罐就倒"}
        </div>
      </div>
      {flavored && <Sticker x={150} y={380} delay={120} size={100} rot={-8}>✨</Sticker>}
      {flavored && <Sticker x={820} y={400} delay={128} size={100} rot={10}>✨</Sticker>}
      <Caption zh={<><span style={{ color: TEAL }}>函式庫</span>＝開罐倒進去，立刻有味</>} en={"Library = a ready-made sauce; pour it in, done"} />
      <DoorOpen at={0} dur={14} />
      <Sfx src="kf-sparkle.mp3" at={118} volume={0.55} durationInFrames={60} />
      <VOA id="a_lib" />
    </AbsoluteFill>
  );
};

/** S6 · 一句話分清（API 隔牆 ｜ SDK＋函式庫 自家廚房）。 */
const BCombo: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [10, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const col = (delay: number): React.CSSProperties => ({
    flex: 1,
    padding: "30px 22px",
    borderRadius: 24,
    textAlign: "center",
    opacity: fade(f, delay),
    transform: `translateY(${(1 - fade(f, delay)) * 26}px)`,
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(240,162,60,0.30), transparent 62%)", opacity: glow }} />
      <Kicker text="一句話分清 ▾" color={ORANGE} />
      <div style={{ position: "absolute", left: 56, right: 56, top: 470, display: "flex", gap: 24 }}>
        <div style={{ ...col(16), background: "rgba(240,162,60,0.12)", border: `2px solid ${ORANGE}66` }}>
          <div style={{ fontSize: 110 }}>🪟</div>
          <div style={{ marginTop: 6, fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 48, color: "#FFE9CC" }}>API</div>
          <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: "#DCE6F6" }}>隔牆點餐<br />人家幫你做</div>
        </div>
        <div style={{ ...col(34), background: "rgba(111,216,200,0.10)", border: `2px solid ${TEAL}66` }}>
          <div style={{ fontSize: 110 }}>🏠</div>
          <div style={{ marginTop: 6, fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 44, color: "#D7F7F0" }}>SDK＋庫</div>
          <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: "#DCE6F6" }}>搬進你家<br />自己煮</div>
        </div>
      </div>
      <Caption zh={<><O>API</O> 人家做，<span style={{ color: TEAL }}>SDK／庫</span>自己煮</>} en={"API: they cook. SDK/library: you cook."} />
      <Sfx src="kf-sparkle.mp3" at={10} volume={0.5} durationInFrames={70} />
      <VOA id="a_combo" />
    </AbsoluteFill>
  );
};

/** S7 · 迷思破解：SDK 不是 API 的二選一（SDK 盒裝著打 API 的工具）。 */
const BMyth: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = f >= 150;
  return (
    <AbsoluteFill>
      <Kicker text="最容易搞混 ⚠️" color="#FFC36B" />
      <div style={{ position: "absolute", left: 56, right: 56, top: 360, textAlign: "center", opacity: fade(f, 8) }}>
        <div style={{ display: "inline-block", padding: "26px 36px", borderRadius: 26, background: "rgba(255,255,255,0.95)", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 56, lineHeight: 1.3, color: "#14142B" }}>SDK 跟 API<br />不是<span style={{ color: "#D9534F" }}>二選一</span></div>
        </div>
      </div>
      {/* SDK box containing the API tool */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: fade(f, 60) }}>
        <div style={{ position: "relative", display: "inline-block", padding: "30px 54px", borderRadius: 24, background: "rgba(183,164,255,0.14)", border: `3px dashed ${VIOLET}` }}>
          <div style={{ position: "absolute", top: -26, left: 26, fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 40, color: VIOLET, background: "#0C1A33", padding: "0 12px" }}>SDK 📦</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
            <span style={{ fontSize: 90 }}>🥬</span>
            <span style={{ fontSize: 90 }}>🔧</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 16, background: "rgba(240,162,60,0.18)", border: `2px solid ${ORANGE}`, transform: reveal ? "scale(1.06)" : "scale(1)" }}>
              <span style={{ fontSize: 64 }}>🧾</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 40, color: "#FFE9CC" }}>打 API 的工具</span>
            </span>
          </div>
        </div>
        {reveal && (
          <div style={{ marginTop: 22, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, color: GREEN, opacity: fade(f, 150) }}>SDK 盒子裡，常裝著 API ✓</div>
        )}
      </div>
      <Caption zh={<>SDK 盒子裡，常裝著打 <O>API</O> 的工具</>} en={"An SDK often bundles the tools that call an API"} />
      <DoorOpen at={0} dur={14} />
      <Sfx src="kf-sparkle.mp3" at={150} volume={0.5} durationInFrames={60} />
      <VOA id="a_myth" />
    </AbsoluteFill>
  );
};

/** S8 · 曉晴 Outro + CTA。 */
const BOutro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 64, right: 380, top: 300, opacity: fade(f, 6) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 92, lineHeight: 1.14, color: "#FFFFFF", textShadow: "0 5px 24px rgba(0,0,0,0.5)" }}>下次再聽到<br />不再<O>搞混</O></div>
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { e: "🔔", t: "訂閱", d: 24 },
            { e: "👍", t: "按讚", d: 36 },
            { e: "🔗", t: "分享給搞混的朋友", d: 48 },
          ].map((c) => (
            <div key={c.t} style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 28px", borderRadius: 999, background: "rgba(255,255,255,0.95)", width: "fit-content", opacity: fade(f, c.d), transform: `translateX(${(1 - fade(f, c.d)) * -24}px)` }}>
              <span style={{ fontSize: 46 }}>{c.e}</span>
              <span style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 44, color: "#14142B" }}>{c.t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34, opacity: fade(f, 60) }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 52, color: ORANGE }}>Ai-Wisdom</div>
          <div style={{ marginTop: 4, fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 36, color: "rgba(220,230,246,0.78)" }}>工程師黑話翻譯</div>
        </div>
        <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 26px", borderRadius: 999, background: "rgba(240,162,60,0.18)", border: `2px solid ${ORANGE}`, opacity: fade(f, 74) }}>
          <span style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 36, color: "#FFE9CC" }}>{EP} ✓ ・ EP03 待續 →</span>
        </div>
      </div>
      <Sunny h={860} />
      <Sfx src="kf-sparkle.mp3" at={6} volume={0.4} durationInFrames={60} />
      <VOA id="a_outro" />
    </AbsoluteFill>
  );
};

/* ── timeline ──────────────────────────────────────────────── */

const COVER = 66;
const TIMELINE: { Comp: React.FC; dur: number }[] = [
  { Comp: BCover, dur: COVER },
  { Comp: BHook, dur: beat("a_hook") },
  { Comp: BSetup, dur: beat("a_setup") },
  { Comp: BApi, dur: beat("a_api", 22) },
  { Comp: BSdk, dur: beat("a_sdk", 22) },
  { Comp: BLib, dur: beat("a_lib") },
  { Comp: BCombo, dur: beat("a_combo") },
  { Comp: BMyth, dur: beat("a_myth", 22) },
  { Comp: BOutro, dur: beat("a_outro", 22) },
];

export const APISDK_FRAMES = TIMELINE.reduce((s, b) => s + b.dur, 0);

export const ApiSdkReel: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      <Bg />
      <Audio src={staticFile("bgm-piano.mp3")} volume={0.06} loop />
      {TIMELINE.map((b, i) => {
        const from = at;
        at += b.dur;
        const C = b.Comp;
        return (
          <Sequence key={i} from={from} durationInFrames={b.dur} name={C.name || `beat-${i}`}>
            <C />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
