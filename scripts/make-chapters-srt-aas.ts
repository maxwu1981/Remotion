/**
 * Derive YouTube chapter timestamps + a .srt subtitle file for the 帳號授權安全
 * explainer, straight from the scene data (single source of truth, can't drift).
 * Mirrors the timing in captions.tsx (buildScene) and Master.tsx (TransitionSeries
 * overlap), so the timestamps line up with the rendered video.
 *
 *   npx tsx scripts/make-chapters-srt-aas.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { SCENES as SPECS, RECAP_A, RECAP_B, type SceneSpec } from "../src/videos/account-auth-security/content";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const videoDir = join(root, "src", "videos", "account-auth-security");
const outDir = join(root, "out", "youtube-videos", "帳號授權安全");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const TEXT: Record<string, string> = JSON.parse(readFileSync(join(videoDir, "script.json"), "utf8"));
const VO: Record<string, number> = JSON.parse(readFileSync(join(videoDir, "vo-manifest.json"), "utf8"));

const FPS = 30;
const TRANSITION = 14;
const fallbackSeconds = (t: string) => Math.max(2.4, Math.min(7.5, 0.7 + t.length * 0.14));

type Cue = { id: string; text: string; from: number; dur: number };
function buildScene(ids: string[], o: { lead?: number; gap?: number; tail?: number; minDur?: number } = {}) {
  const lead = o.lead ?? 12, gap = o.gap ?? 10, tail = o.tail ?? 18;
  let t = lead;
  const cues: Cue[] = ids.map((id) => {
    const frames = Math.ceil((VO[id] ?? fallbackSeconds(TEXT[id] ?? id)) * FPS);
    const cue = { id, text: TEXT[id] ?? id, from: t, dur: frames };
    t += frames + gap;
    return cue;
  });
  return { cues, dur: Math.max(t - gap + tail, o.minDur ?? 0) };
}

/** The movie's scenes in order, each with its cues + length — matches registry.ts. */
type Scene = { id: string; cues: Cue[]; dur: number };
const scenes: Scene[] = [
  { id: "cv", ...buildScene(["cv-1", "cv-2"], { lead: 8, minDur: 320 }) },
  ...SPECS.map((s: SceneSpec) => ({ id: s.id, ...buildScene(s.cueIds, { minDur: s.minDur ?? 0 }) })),
  { id: "recap-1", ...buildScene(RECAP_A, { lead: 12, minDur: 420 }) },
  { id: "recap-2", ...buildScene(RECAP_B, { lead: 12, minDur: 420 }) },
  { id: "ot", ...buildScene(["ot-cta"], { lead: 10, tail: 60, minDur: 360 }) },
];

/** Global start frame of each scene (TransitionSeries overlaps TRANSITION per cut). */
const starts: number[] = [];
let acc = 0;
scenes.forEach((s, i) => {
  starts.push(acc - TRANSITION * i);
  acc += s.dur;
});

/* --------------------------------------------------------------- chapters --- */

const chapterTitle = (id: string): { key: string; title: string } | null => {
  if (id === "cv") return { key: "00", title: "封面 · 帳號授權安全（鑰匙比喻）" };
  if (id.startsWith("s0")) return { key: "0", title: "一張圖看懂四個角色：密碼 / OAuth / Token / CAPTCHA" };
  if (id.startsWith("s10")) return { key: "10", title: "10 · Claude 到底能不能按 CAPTCHA" };
  if (id.startsWith("s1")) return { key: "1", title: "1 · 認證 vs 授權：先分清楚這兩個" };
  if (id.startsWith("s2")) return { key: "2", title: "2 · 密碼 = 萬能鑰匙" };
  if (id.startsWith("s3")) return { key: "3", title: "3 · OAuth = 不交出密碼也能授權的制度" };
  if (id.startsWith("s4")) return { key: "4", title: "4 · Token = 限定通行證（重點）" };
  if (id.startsWith("s5")) return { key: "5", title: "5 · 為什麼這樣更安全（遛狗的人）" };
  if (id.startsWith("s6")) return { key: "6", title: "6 · 旅館模型：角色會互換" };
  if (id.startsWith("s7")) return { key: "7", title: "7 · 兩種 token：身分卡 vs 工作門卡" };
  if (id.startsWith("s8")) return { key: "8", title: "8 · CAPTCHA = 門口的警衛" };
  if (id.startsWith("s9")) return { key: "9", title: "9 · 為什麼有些事只能你本人做" };
  if (id.startsWith("recap")) return { key: "11", title: "一頁速查（總整理）" };
  if (id === "ot") return { key: "99", title: "結尾" };
  return null;
};

const mmss = (frame: number): string => {
  const s = Math.max(0, Math.round(frame / FPS));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return (h ? `${h}:${String(m).padStart(2, "0")}` : `${m}`) + `:${String(ss).padStart(2, "0")}`;
};

const chapters: string[] = [];
const seen = new Set<string>();
scenes.forEach((s, i) => {
  const c = chapterTitle(s.id);
  if (!c || seen.has(c.key)) return;
  seen.add(c.key);
  // YouTube requires the first chapter at 0:00.
  const stamp = chapters.length === 0 ? "0:00" : mmss(starts[i]);
  chapters.push(`${stamp} ${c.title}`);
});
const chaptersTxt = chapters.join("\n") + "\n";
writeFileSync(join(outDir, "chapters.txt"), chaptersTxt);

/* -------------------------------------------------------------------- srt --- */

const srtTime = (frame: number): string => {
  const ms = Math.max(0, Math.round((frame / FPS) * 1000));
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), milli = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(s)},${p(milli, 3)}`;
};

type Entry = { start: number; end: number; text: string };
const entries: Entry[] = [];
scenes.forEach((s, i) => {
  s.cues.forEach((cue) => entries.push({ start: starts[i] + cue.from, end: starts[i] + cue.from + cue.dur, text: cue.text }));
});
entries.sort((a, b) => a.start - b.start);
// clamp each caption so it ends before the next one starts
for (let i = 0; i < entries.length - 1; i++) entries[i].end = Math.min(entries[i].end, entries[i + 1].start - 1);

const srt = entries
  .map((e, i) => `${i + 1}\n${srtTime(e.start)} --> ${srtTime(Math.max(e.end, e.start + 15))}\n${e.text}\n`)
  .join("\n");
writeFileSync(join(outDir, "account-auth-security.zh.srt"), srt + "\n");

const totalFrames = acc - TRANSITION * (scenes.length - 1);
console.log("chapters.txt:\n" + chaptersTxt);
console.log(`✓ SRT: ${entries.length} cues  ·  total ${mmss(totalFrames)} (${totalFrames} frames)`);
console.log(`→ ${outDir}`);
