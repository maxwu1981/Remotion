import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../shared-skills/theme";
import { SceneProps } from "./Scenes";
import { ACC, WhiteBg, darkCard, Glare, rgba } from "./glass";

/**
 * 5:40 pack 場景「真實金澤案例」(2026-07-04 老闆拍板:A/B 兩版都用)。
 * 正式版=PackRealCombo:清單期右掛真實案例面板(A),末句 c6-5 切全幅展示卡(B)+8s 靜默展示。
 * 素材鐵則:只用真的發過的金澤 vlog 素材(public/cases/*,文案逐字節錄自 文案.txt)。
 */

const rise = (f: number, at: number, d = 12) =>
  interpolate(f, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "60px 50px 96px" }}>
    <div style={{ transform: "scale(1.12)", transformOrigin: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
  </AbsoluteFill>
);

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ textAlign: "center", marginBottom: 22 }}>
    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 800, fontSize: 56, letterSpacing: 4, color: ACC.ink }}>{children}</div>
    <div style={{ width: 72, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${ACC.ember}, ${ACC.emberSoft})`, margin: "16px auto 0", boxShadow: `0 0 12px ${rgba(ACC.ember, 0.4)}` }} />
  </div>
);

/** 檔名籤(mono 小字,像資料夾裡的檔案名)。 */
const FileTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT.monoCjk, fontSize: 20, letterSpacing: 0.5, color: ACC.muted, textAlign: "center", marginTop: 10 }}>{children}</div>
);

/** 真實素材照片框(白框+接地影)。 */
const photoFrame: React.CSSProperties = {
  borderRadius: 14,
  overflow: "hidden",
  border: "3px solid #ffffff",
  boxShadow: `0 16px 36px ${rgba(ACC.xhs, 0.16)}, 0 4px 10px rgba(11,16,32,0.14)`,
  display: "block",
};

/** 「真實案例 · 已發布」mint 膠囊。 */
const RealPill: React.FC = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 22px", borderRadius: 999, background: `linear-gradient(135deg, ${ACC.mint} 0%, #3DD6A3 100%)`, color: "#fff", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 23, letterSpacing: 2, boxShadow: `0 0 14px ${rgba(ACC.mint, 0.35)}, inset 0 1px 0 ${rgba("#ffffff", 0.4)}` }}>
    ✓ 真實案例 · 已發布
  </span>
);

/** 金澤 vlog 三張實拍縮圖(9:16 直式)。 */
const Thumbs: React.FC<{ h: number; on: number }> = ({ h, on }) => (
  <div style={{ display: "flex", gap: 12, opacity: on }}>
    {[1, 2, 3].map((n) => (
      <Img key={n} src={staticFile(`cases/kanazawa-thumb-${n}.jpg`)} style={{ ...photoFrame, height: h, width: Math.round((h * 9) / 16), objectFit: "cover" }} />
    ))}
  </div>
);

/** 文案.txt 節錄卡(逐字節錄,只做截斷)。 */
const CopyCard: React.FC<{ w: number; big?: boolean; on: number }> = ({ w, big, on }) => (
  <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.xhs, { r: 18, glow: 0.5 }), width: w, padding: big ? "28px 34px" : "22px 26px", boxSizing: "border-box", opacity: on }}>
    <Glare />
    <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: big ? 31 : 27, lineHeight: 1.4, color: "#fff" }}>
      清晨6点·无人的金泽 实拍走完5个名所
    </div>
    <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: big ? 22 : 21, lineHeight: 1.55, color: rgba("#ffffff", 0.78), marginTop: big ? 12 : 10 }}>
      金泽好玩的几乎都挤在2公里内，但白天人很多。{big && <>我的走法是清晨6点出门，按「兼六园→金泽城→长町→东茶屋街→铃木大拙馆」绕一圈…</>}
    </div>
    {big && (
      <div style={{ position: "relative", fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 22, lineHeight: 1.55, color: rgba("#ffffff", 0.78), marginTop: 8 }}>
        📍兼六园：日本三名园之一，冬季清晨6点起早朝免费开园…
      </div>
    )}
    <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 8, marginTop: big ? 18 : 12 }}>
      {["#金泽旅行", "#金泽", "#兼六园", "#北陆旅行"].map((t) => (
        <span key={t} style={{ padding: "4px 14px", borderRadius: 999, background: rgba(ACC.xhs, 0.18), border: `1px solid ${rgba(ACC.xhs, 0.4)}`, fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: big ? 21 : 19, color: "#FF8FA3" }}>{t}</span>
      ))}
      <span style={{ padding: "4px 10px", fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: big ? 21 : 19, color: rgba("#ffffff", 0.5) }}>共 8 個</span>
    </div>
  </div>
);

/* ── 版本 A:內嵌 pack 場景(左=原四列清單縮窄,右=真實案例面板;不加片長) ── */
export const PackRealSceneA: React.FC<{ panelAt?: number; thumbsAt?: number }> = ({ panelAt = 96, thumbsAt = 118 }) => {
  const f = useCurrentFrame();
  const items: [string, string][] = [
    ["00 封面.jpg", "3:4 · 一定壓字"],
    ["01..N 圖片", "編號排好,字典序即順序"],
    ["文案.txt", "標題 / 正文 / 標籤"],
    ["同一行指令", "京都、金澤,任何一篇都一樣發"],
  ];
  return (
    <Wrap>
      <Title>一個資料夾 = 一篇筆記</Title>
      <div style={{ display: "flex", gap: 44, alignItems: "flex-start" }}>
        {/* 左:發布包格式清單(縮窄版) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 720 }}>
          {items.map(([h, s], i) => {
            const on = rise(f, 20 + i * 22, 13);
            return (
              <div key={h} style={{ opacity: on, transform: `translateY(${(1 - on) * 14}px)` }}>
                <div style={{ position: "relative", overflow: "hidden", ...darkCard(ACC.signal), padding: "16px 30px", display: "flex", alignItems: "center", gap: 20 }}>
                  <Glare />
                  <div style={{ position: "relative", fontFamily: FONT.mono, fontWeight: 800, fontSize: 38, color: ACC.gold, width: 44, textShadow: `0 0 14px ${rgba(ACC.gold, 0.45)}` }}>{i + 1}</div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 33, letterSpacing: 1, color: "#fff" }}>{h}</div>
                    <div style={{ fontFamily: FONT.uiCjk, fontWeight: 500, fontSize: 23, color: rgba("#ffffff", 0.72), marginTop: 4 }}>{s}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* 右:真實金澤案例面板 */}
        <div style={{ width: 660, opacity: rise(f, panelAt, 16), transform: `translateY(${(1 - rise(f, panelAt, 16)) * 18}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
            <RealPill />
            <span style={{ fontFamily: FONT.uiCjk, fontWeight: 700, fontSize: 26, color: ACC.inkSoft }}>金澤 vlog · 這包真的長這樣</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div>
              <Img src={staticFile("cases/kanazawa-cover.jpg")} style={{ ...photoFrame, width: 246, height: 328, objectFit: "cover" }} />
              <FileTag>00_封面.jpg</FileTag>
            </div>
            <div style={{ width: 376 }}>
              <CopyCard w={376} on={1} />
              <FileTag>文案.txt</FileTag>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <Thumbs h={150} on={rise(f, thumbsAt, 14)} />
            <FileTag>實拍畫面 · 抽自成片 kanazawa-vlog.mp4</FileTag>
          </div>
        </div>
      </div>
    </Wrap>
  );
};

/* ── 版本 B:全幅「真實案例」展示卡(c6-5 時切入收尾) ── */
export const RealCaseSceneB: React.FC<{ t0?: number }> = ({ t0 = 0 }) => {
  const f = useCurrentFrame();
  return (
    <Wrap>
      <Title>真實案例 · 金澤這包長這樣</Title>
      <div style={{ marginBottom: 16, opacity: rise(f, t0 + 18, 12) }}>
        <RealPill />
      </div>
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
        <div style={{ opacity: rise(f, t0 + 30, 14) }}>
          <Img src={staticFile("cases/kanazawa-cover.jpg")} style={{ ...photoFrame, width: 360, height: 480, objectFit: "cover" }} />
          <FileTag>00_封面.jpg · 3:4 壓字封面</FileTag>
        </div>
        <div style={{ width: 760 }}>
          <div style={{ opacity: rise(f, t0 + 56, 14) }}>
            <CopyCard w={760} big on={1} />
            <FileTag>文案.txt · 標題 / 正文 / 8 標籤</FileTag>
          </div>
          <div style={{ marginTop: 14 }}>
            <Thumbs h={150} on={rise(f, t0 + 84, 14)} />
            <FileTag>實拍畫面 · 抽自成片 kanazawa-vlog.mp4</FileTag>
          </div>
        </div>
      </div>
    </Wrap>
  );
};

/* ── 正式版 pack 場景:A 清單+面板 → c6-5 起 30 幀切 B 全幅卡(先收乾淨再進場,不疊影) ── */
export const PackRealCombo: React.FC<SceneProps> = ({ marks: m }) => {
  const f = useCurrentFrame();
  const switchAt = m[4].start + 30;
  const aOut = 1 - rise(f, switchAt, 10);
  return (
    <AbsoluteFill>
      {aOut > 0.001 && (
        <AbsoluteFill style={{ opacity: aOut }}>
          <PackRealSceneA panelAt={m[2].start + 6} thumbsAt={m[2].start + 36} />
        </AbsoluteFill>
      )}
      {f >= switchAt + 12 && (
        <AbsoluteFill style={{ opacity: rise(f, switchAt + 12, 14) }}>
          <RealCaseSceneB t0={switchAt + 12} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ── 樣張 Still 殼:白底+頂帶+字幕的靜態複製,只為讓老闆看真實版面佔位 ── */
const StillShell: React.FC<{ cap: string; children: React.ReactNode }> = ({ cap, children }) => (
  <AbsoluteFill style={{ textSpacingTrim: "space-all", fontFamily: FONT.uiCjk }}>
    <WhiteBg />
    {children}
    <div style={{ position: "absolute", top: 36, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "12px 38px", borderRadius: 999, background: "rgba(13,19,34,0.66)", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 10px 24px rgba(11,16,32,0.24)" }}>
        <span style={{ fontWeight: 700, fontSize: 31, color: "#f4f7fb", letterSpacing: 1 }}>一個資料夾 = <span style={{ color: ACC.ember }}>一篇筆記</span></span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 52, textAlign: "center" }}>
      <div style={{ display: "inline-block", maxWidth: 1620, padding: "16px 38px", borderRadius: 16, background: "rgba(13,19,34,0.72)", border: "1px solid rgba(255,255,255,0.14)" }}>
        <div style={{ fontWeight: 700, fontSize: 40, lineHeight: 1.42, color: "#fff", letterSpacing: 0.5 }}>{cap}</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const XhsAutoPackAStill: React.FC = () => (
  <StillShell cap="三樣:壓字封面、編號圖片、文案檔">
    {/* Still 的 frame=0,把時間軸前移讓 rise() 全部到位(Freeze 在 Still 下不生效) */}
    <Sequence from={-150}>
      <PackRealSceneA />
    </Sequence>
  </StillShell>
);

export const XhsAutoPackBStill: React.FC = () => (
  <StillShell cap="只要包格式對,任何一篇都同一行指令發出去">
    <Sequence from={-150}>
      <RealCaseSceneB />
    </Sequence>
  </StillShell>
);
