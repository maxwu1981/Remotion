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
import { KitchenCover, SERIES, EP } from "./Cover";
import VO from "./kitchen.vo.json";

/**
 * 「軟體開發 = 開餐廳廚房」9:16 情境幽默科普 Short（1080×1920, 30fps）。
 * 比喻：Git=時光機 / Linter=糾察隊 / 測試=皇家試毒官。
 * 規格：0:00 封面閃卡 → 曉晴頭尾露臉 → 中間 2D 動畫廚房短劇 + 大量綜藝 emoji
 * 貼圖 + 中英雙語大字幕（Git/Linter/測試 橙色高亮）+ 全套音效 + 廚房門轉場。
 * 旁白＝edge-tts 曉晴(zh-TW-HsiaoChenNeural)，前段連珠炮、結尾「快逃啊」極慢。
 *
 * 抗抖：背景靜態（不漂移）、動畫都會在 hold 期間 settle 成靜止 → lossless 持幀近黑。
 */

const FPS = 30;
const ORANGE = "#F0A23C";
const RED = "#FF8A8A";
const GREEN = "#7BE3A4";

const vo = (id: keyof typeof VO) => VO[id] as number;
const beat = (id: keyof typeof VO, tail = 18) => Math.ceil(vo(id) * FPS) + tail;

const VOA: React.FC<{ id: keyof typeof VO }> = ({ id }) => (
  <Audio src={staticFile(`vo/kitchen/${id}.mp3`)} />
);

const fade = (frame: number, inAt: number, dur = 12) =>
  interpolate(frame, [inAt, inAt + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const POP = Easing.bezier(0.34, 1.5, 0.5, 1);

/* ── shared pieces ─────────────────────────────────────────── */

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
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 60, lineHeight: 1.22, color: "#FFFFFF", textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>{zh}</div>
        <div style={{ marginTop: 10, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 33, lineHeight: 1.25, color: "rgba(220,230,246,0.82)" }}>{en}</div>
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

/** S0 · 封面 0:00 閃卡（靜態封面，frame 0 即滿版亮相 + Boom）。 */
const BCover: React.FC = () => (
  <AbsoluteFill>
    <KitchenCover />
    <Sfx src="kf-boom.mp3" at={1} volume={0.8} durationInFrames={60} />
  </AbsoluteFill>
);

/** S1 · 曉晴 Hook：Git/Linter/測試 想成廚房就懂。 */
const BHook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kicker text={`${EP} ・ ${SERIES}`} color={ORANGE} />
      <div style={{ position: "absolute", left: 70, top: 360, right: 360 }}>
        {["Git ？", "Linter ？", "測試 ？"].map((t, i) => (
          <div key={t} style={{ marginBottom: 20, opacity: fade(f, 10 + i * 12), transform: `translateX(${(1 - fade(f, 10 + i * 12)) * -30}px)` }}>
            <span style={{ display: "inline-block", padding: "14px 30px", borderRadius: 16, background: "rgba(240,162,60,0.16)", border: `2px solid ${ORANGE}`, fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 64, color: "#FFE9CC" }}>{t}</span>
          </div>
        ))}
        <div style={{ marginTop: 26, opacity: fade(f, 60), fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 70, color: "#FFFFFF", textShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>
          想成<O>廚房</O>就懂
        </div>
      </div>
      <Sunny h={820} />
      <Caption zh={<>Git・Linter・測試 是什麼？</>} en={"Git, Linter, tests — what are they?"} />
      <Sfx src="kf-boom.mp3" at={2} volume={0.45} durationInFrames={60} />
      <VOA id="k_hook" />
    </AbsoluteFill>
  );
};

/** S3 · 廚房比喻（廚房門開 + 三神器）。 */
const BKitchen: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kicker text="把寫程式想像成 ▾ 開餐廳" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", opacity: fade(f, 18) }}>
        <div style={{ fontSize: 200 }}>👨‍🍳</div>
        <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 52, color: "#DCE6F6" }}>一間好廚房的三樣法寶</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 28 }}>
        {[
          { e: "🕰️", t: "時光機", d: 40 },
          { e: "📏", t: "糾察隊", d: 58 },
          { e: "🥢", t: "試毒官", d: 76 },
        ].map((c) => {
          const t = interpolate(f, [c.d, c.d + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: POP });
          return (
            <div key={c.t} style={{ width: 290, padding: "28px 0", borderRadius: 22, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", textAlign: "center", opacity: interpolate(f, [c.d, c.d + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${(1 - t) * 30}px) scale(${0.85 + 0.15 * t})` }}>
              <div style={{ fontSize: 96 }}>{c.e}</div>
              <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 48, color: "#FFE9CC" }}>{c.t}</div>
            </div>
          );
        })}
      </div>
      <Caption zh={<>好廚房的三樣法寶：時光機・糾察隊・試毒官</>} en={"A kitchen's 3 tools: time machine, inspector, taster"} />
      <DoorOpen at={0} dur={15} />
      <Sfx src="kf-crow.mp3" at={18} volume={0.4} durationInFrames={40} />
      <VOA id="k_kitchen" />
    </AbsoluteFill>
  );
};

/** S4 · Git＝時光機（手滑倒鹽→湯毀→倒帶復原 + 真實實證泡泡）。 */
const BGit: React.FC = () => {
  const f = useCurrentFrame();
  const ruined = f >= 96 && f < 178;
  const restored = f >= 178;
  // salt jar tilt + pour
  const tilt = interpolate(f, [40, 66], [0, 128], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pouring = f >= 50 && f < 96;
  const rewindFlash = interpolate(f, [160, 176, 200], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Kicker text="Git ＝ 廚房的時光機 🕰️" color={ORANGE} />
      {/* pot */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontSize: 230 }}>{restored ? "🍲" : ruined ? "🥘" : "🍲"}</div>
          <div style={{ position: "absolute", top: -30, right: 40, fontSize: 120, transform: `rotate(${tilt}deg)`, transformOrigin: "bottom left", opacity: f >= 36 && f < 96 ? 1 : 0 }}>🧂</div>
          {pouring && [0, 1, 2, 3].map((i) => {
            const yy = interpolate((f - 50 + i * 6) % 26, [0, 26], [0, 150]);
            return <div key={i} style={{ position: "absolute", top: 30 + yy, right: 150 + i * 10, width: 10, height: 10, borderRadius: "50%", background: "#FFFFFF", opacity: 0.85 }} />;
          })}
        </div>
        <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 56, color: restored ? GREEN : ruined ? RED : "#DCE6F6" }}>
          {restored ? "沒事了！湯回來了 😋" : ruined ? "整鍋湯毀了 😱" : "熬了 8 小時的湯…"}
        </div>
      </div>
      {/* rewind flash */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: rewindFlash }}>
        <span style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 96, color: ORANGE, textShadow: `0 0 40px ${ORANGE}` }}>⏪ 倒回 −3:00</span>
      </div>
      {/* 真實實證泡泡（具名學術來源・逐字） */}
      <div style={{ position: "absolute", left: 56, right: 56, top: 138, opacity: fade(f, 120), transform: `translateY(${(1 - fade(f, 120)) * -16}px)` }}>
        <div style={{ padding: "20px 26px", borderRadius: 20, background: "rgba(255,255,255,0.95)", boxShadow: "0 14px 36px rgba(0,0,0,0.4)", borderLeft: `8px solid ${ORANGE}` }}>
          <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: 31, lineHeight: 1.32, color: "#14142B" }}>
            “How was I writing code all those previous years without such a tool?”
          </div>
          <div style={{ marginTop: 8, fontFamily: FONT.uiCjk, fontWeight: 600, fontSize: 25, color: "#697090" }}>
            — 真實心聲・愛丁堡大學資訊系課程部落格 blog.inf.ed.ac.uk
          </div>
        </div>
      </div>
      <Caption zh={<><O>Git</O>＝後悔藥，一鍵倒回三分鐘前</>} en={"Git = undo. Roll back 3 minutes, instantly."} />
      <DoorOpen at={0} dur={14} />
      <Sfx src="kf-rewind.mp3" at={160} volume={0.7} durationInFrames={30} />
      <VOA id="k_git" />
    </AbsoluteFill>
  );
};

/** S5 · Linter＝糾察隊（尺打手 + 紅燈 + 扣分）。 */
const BLinter: React.FC = () => {
  const f = useCurrentFrame();
  const slapAt = 70;
  const slapped = f >= slapAt;
  // ruler swings down to slap
  const swing = interpolate(f, [slapAt - 14, slapAt], [-70, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.9, 0.4) });
  const alert = slapped ? (Math.floor((f - slapAt) / 8) % 2 === 0 ? 1 : 0.25) : 0;
  return (
    <AbsoluteFill>
      <Kicker text="Linter ＝ 處女座糾察隊 📏" color={ORANGE} />
      {/* red alert wash */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(255,80,80,0.28), transparent 60%)", opacity: alert }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontSize: 190 }}>🔪</div>
          {/* ruler */}
          <div style={{ position: "absolute", top: -120, left: 150, fontSize: 150, transform: `rotate(${swing}deg)`, transformOrigin: "top left" }}>📏</div>
          {slapped && <div style={{ position: "absolute", top: 60, left: 70, fontSize: 90 }}>💥</div>}
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 720, textAlign: "center" }}>
        <div style={{ opacity: fade(f, 16), fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 56, color: "#FFE9CC" }}>「蒜頭只能切丁！」</div>
        {slapped && (
          <div style={{ marginTop: 16, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 72, color: RED, opacity: fade(f, slapAt) }}>砧板沒擦 — 扣 5 分！</div>
        )}
      </div>
      <Sticker x={120} y={360} delay={slapAt + 6} size={96} rot={-10}>🚨</Sticker>
      <Sticker x={840} y={390} delay={slapAt + 12} size={96} rot={12}>🚨</Sticker>
      <Caption zh={<><O>Linter</O>＝龜毛糾察隊，強制統一規格</>} en={"Linter = the nitpicker enforcing one style"} />
      <DoorOpen at={0} dur={14} />
      <Sfx src="kf-slap.mp3" at={slapAt} volume={0.85} durationInFrames={20} />
      <VOA id="k_linter" />
    </AbsoluteFill>
  );
};

/** S6 · 測試＝皇家試毒官（敲鑼 + 銀針 + 改版再驗）。 */
const BTest: React.FC = () => {
  const f = useCurrentFrame();
  const taste1 = f >= 90;
  const revamp = f >= 250;
  return (
    <AbsoluteFill>
      <Kicker text="測試 ＝ 皇家試毒官 🥢" color={ORANGE} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", opacity: fade(f, 16) }}>
        <div style={{ fontSize: 170 }}>🍽️👑</div>
        <div style={{ marginTop: 4, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 50, color: "#DCE6F6" }}>擺盤再美，會不會出事？</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 720, textAlign: "center", minHeight: 200 }}>
        {taste1 && !revamp && (
          <div style={{ opacity: fade(f, 90), fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 64, color: GREEN }}>試毒官先吃 → 沒毒，鹹度剛好 ✅</div>
        )}
        {revamp && (
          <div style={{ opacity: fade(f, 250) }}>
            <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 56, color: "#FFE9CC" }}>改版加新香料 🧪</div>
            <div style={{ marginTop: 12, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 64, color: GREEN }}>再驗一次 → 沒變毒藥 ☠️→✅</div>
          </div>
        )}
      </div>
      <Sticker x={130} y={360} delay={88} size={110} rot={-8}>🔔</Sticker>
      <Sticker x={840} y={380} delay={96} size={96} rot={10}>🥄</Sticker>
      <Caption zh={<><O>測試</O>＝試毒官，改版也先驗</>} en={"Tests = the taster, re-checking every change"} />
      <DoorOpen at={0} dur={14} />
      <Sfx src="kf-gong.mp3" at={86} volume={0.6} durationInFrames={60} />
      <Sfx src="kf-gong.mp3" at={248} volume={0.45} durationInFrames={60} />
      <VOA id="k_test" />
    </AbsoluteFill>
  );
};

/** S7 · 頂級廚房聖光（三神器集齊）。 */
const BMichelin: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [10, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(240,162,60,0.34), transparent 62%)", opacity: glow }} />
      <Kicker text="三樣都有 ＝ ▾" color={ORANGE} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", gap: 30 }}>
        {[
          { e: "🕰️", t: "Git", d: 12 },
          { e: "📏", t: "Linter", d: 26 },
          { e: "🥢", t: "測試", d: 40 },
        ].map((c) => (
          <div key={c.t} style={{ textAlign: "center", opacity: fade(f, c.d) }}>
            <div style={{ fontSize: 120 }}>{c.e}</div>
            <div style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 40, color: "#FFE9CC" }}>{c.t} <span style={{ color: GREEN }}>✓</span></div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", opacity: fade(f, 54) }}>
        <div style={{ fontSize: 120 }}>⭐🏅⭐</div>
        <div style={{ marginTop: 6, fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 92, color: "#FFFFFF", textShadow: `0 0 36px ${ORANGE}88` }}>頂級廚房團隊</div>
      </div>
      <Caption zh={<>三樣都有＝<O>頂級廚房</O>團隊</>} en={"All three? A top-tier kitchen team."} />
      <Sfx src="kf-sparkle.mp3" at={10} volume={0.55} durationInFrames={70} />
      <VOA id="k_michelin" />
    </AbsoluteFill>
  );
};

/** S8 · 快逃 setup（一間廚房三樣全沒有 + 瞳孔地震 + 拉弦）。 */
const BFleeSetup: React.FC = () => {
  const f = useCurrentFrame();
  const quake = f >= 60 ? Math.sin(f * 1.6) * (3 + (f - 60) * 0.12) : 0;
  const vig = interpolate(f, [40, 150], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, transparent 30%, rgba(0,0,0,0.85) 78%)", opacity: vig }} />
      <Kicker text="但如果一間廚房…" color="#FF8A8A" />
      <div style={{ position: "absolute", left: 56, right: 56, top: 420, textAlign: "center", opacity: fade(f, 8) }}>
        <div style={{ display: "inline-block", padding: "30px 40px", borderRadius: 28, background: "rgba(255,255,255,0.95)", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 58, lineHeight: 1.28, color: "#14142B" }}>「三樣全沒有，<br />煮壞照端上桌。」</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center", transform: `translateX(${quake}px)` }}>
        <div style={{ fontSize: 200 }}>😱</div>
      </div>
      <Caption zh={<>三樣全沒有，煮壞照端上桌</>} en={"No safety net — bad dishes go straight out"} />
      <Sfx src="kf-riser.mp3" at={30} volume={0.5} durationInFrames={150} />
      <VOA id="k_flee_setup" />
    </AbsoluteFill>
  );
};

/** S9 · 快！逃！啊！（黑底白字 + 玻璃碎，慢） */
const BFlee: React.FC = () => {
  const f = useCurrentFrame();
  const words = ["快", "逃", "啊"];
  return (
    <AbsoluteFill style={{ background: "#05080F" }}>
      {/* glass cracks */}
      <AbsoluteFill style={{ opacity: interpolate(f, [1, 9], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
          {[[540, 960, 120, 200], [540, 960, 980, 300], [540, 960, 200, 1700], [540, 960, 900, 1600], [540, 960, 60, 1000], [540, 960, 1020, 1100]].map((l, i) => (
            <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
          ))}
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
        {words.map((w, i) => {
          const d = 2 + i * 7;
          const t = interpolate(f, [d, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: POP });
          return (
            <span key={w} style={{ fontFamily: FONT.cjk, fontWeight: 800, fontSize: 260, color: "#FFFFFF", opacity: interpolate(f, [d, d + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${0.4 + 0.6 * t})`, textShadow: "0 0 40px rgba(255,255,255,0.3)" }}>{w}</span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 360, textAlign: "center", opacity: fade(f, 24), fontFamily: FONT.ui, fontWeight: 800, fontSize: 96, letterSpacing: 12, color: "rgba(255,255,255,0.85)" }}>RUN.</div>
      <Sfx src="kf-glass.mp3" at={2} volume={0.8} durationInFrames={40} />
      <VOA id="k_flee" />
    </AbsoluteFill>
  );
};

/** S10 · 曉晴 Outro + CTA。 */
const BOutro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 64, right: 380, top: 300, opacity: fade(f, 6) }}>
        <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 96, lineHeight: 1.14, color: "#FFFFFF", textShadow: "0 5px 24px rgba(0,0,0,0.5)" }}>看穿一間<br /><O>火燒廚房</O></div>
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { e: "🔔", t: "訂閱", d: 24 },
            { e: "👍", t: "按讚", d: 36 },
            { e: "🔗", t: "分享給火燒廚房的朋友", d: 48 },
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
          <span style={{ fontFamily: FONT.monoCjk, fontWeight: 800, fontSize: 36, color: "#FFE9CC" }}>{EP} ✓ ・ EP02 待續 →</span>
        </div>
      </div>
      <Sunny h={860} />
      <Sfx src="kf-sparkle.mp3" at={6} volume={0.4} durationInFrames={60} />
      <VOA id="k_outro" />
    </AbsoluteFill>
  );
};

/* ── timeline ──────────────────────────────────────────────── */

const COVER = 66;
const TIMELINE: { Comp: React.FC; dur: number }[] = [
  { Comp: BCover, dur: COVER },
  { Comp: BHook, dur: beat("k_hook") },
  { Comp: BKitchen, dur: beat("k_kitchen") },
  { Comp: BGit, dur: beat("k_git", 26) },
  { Comp: BLinter, dur: beat("k_linter") },
  { Comp: BTest, dur: beat("k_test") },
  { Comp: BMichelin, dur: beat("k_michelin") },
  { Comp: BFleeSetup, dur: beat("k_flee_setup") },
  { Comp: BFlee, dur: beat("k_flee", 12) },
  { Comp: BOutro, dur: beat("k_outro", 22) },
];

export const KITCHEN_FRAMES = TIMELINE.reduce((s, b) => s + b.dur, 0);

export const KitchenReel: React.FC = () => {
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
