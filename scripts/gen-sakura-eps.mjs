#!/usr/bin/env node
/**
 * Generate 関西賞櫻 EP-series assets for one spot.
 *   node scripts/gen-sakura-eps.mjs <slug>
 *
 * For the spot: take ALL usable photos (sorted by IMG number, minus `exclude`),
 * copy them resized into public/trips/<slug>/ as <slug>_<imgnum>.jpg, chunk into
 * EPs of 18, and write src/videos/trip-reel/eps/<slug>.json holding the per-EP
 * TripReel + XhsCover configs (consumed by config.ts) plus a delivery plan
 * (consumed by deliver-sakura-eps.mjs). Slide labels come from IMG-number bands.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const REPO = "/Users/maxwu/Remotion";
const PER_EP = 18;

// ---- per-spot specs -------------------------------------------------------
const SPECS = {
  amano: {
    src: "/tmp/amano_all",
    title: "天桥立",
    subtitle: "海の京都·日本三景樱花季",
    folderBase: "2025赏樱1-天桥立",
    accent: "#DE6E9C",
    pillR: "日本三景",
    hookL: "日本三景·3.6km松林砂洲",
    hookR: "弯腰倒看·飞龙在天",
    exclude: ["2063", "2199", "2200", "2201"],
    bands: [
      [2002, 2007, "天桥立", "海の京都"],
      [2008, 2020, "智恩寺·廻旋桥", "砂洲入口"],
      [2021, 2078, "砂洲·松並木", "白砂青松"],
      [2079, 2111, "伞松公园", "飞龙观/股のぞき"],
      [2112, 2999, "飞龙观", "ビューランド空拍"],
    ],
    coverByEp: { 1: 2005, 2: 2049, 3: 2059, 4: 2086, 5: 2104, 6: 2191 },
    focusByEp: {},
  },
  ine: {
    src: "/tmp/ine_raw",
    title: "伊根的舟屋",
    subtitle: "海の京都·日本最美渔村",
    folderBase: "2025赏樱2-伊根の舟屋",
    accent: "#2E8B8B",
    pillR: "海の京都",
    hookL: "230间木屋泡在海上",
    hookR: "渔船直接开进家",
    exclude: ["2122", "2151", "2153", "2161"],
    bands: [
      [2113, 2125, "伊根湾", "遊覧船·村景"],
      [2126, 2139, "喂海鸥", "遊覧船名物"],
      [2140, 2159, "舟屋", "临水而建"],
      [2160, 2999, "伊根的舟屋", "海上人家"],
    ],
    coverByEp: { 1: 2124, 2: 2127, 3: 2156, 4: 2171 },
    focusByEp: {},
  },
};

const slug = process.argv[2];
const spec = SPECS[slug];
if (!spec) {
  console.error("unknown slug:", slug, "| known:", Object.keys(SPECS).join(","));
  process.exit(1);
}

const numOf = (f) => parseInt(f.match(/(\d+)/)[1], 10);
const cap = slug.charAt(0).toUpperCase() + slug.slice(1);

// gather usable, sorted
const all = fs
  .readdirSync(spec.src)
  .filter((f) => /\.(jpe?g)$/i.test(f))
  .sort((a, b) => numOf(a) - numOf(b));
const usable = all.filter((f) => !spec.exclude.includes(String(numOf(f))));

// copy resized to public/trips/<slug>/<slug>_<num>.jpg
const outDir = path.join(REPO, "public/trips", slug);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
for (const f of usable) {
  const num = numOf(f);
  const dst = path.join(outDir, `${slug}_${num}.jpg`);
  execFileSync("sips", ["--resampleHeightWidthMax", "2000", "-s", "format", "jpeg", path.join(spec.src, f), "--out", dst], { stdio: "ignore" });
}

const label = (num) => {
  for (const [a, b, l, s] of spec.bands) if (num >= a && num <= b) return { label: l, sub: s };
  return { label: spec.title };
};

// chunk — balanced: ceil(n/18) EPs, sizes as even as possible (avoids tiny trailing EP)
const numEps = Math.max(1, Math.ceil(usable.length / PER_EP));
const baseSz = Math.floor(usable.length / numEps);
const extra = usable.length % numEps;
const eps = [];
for (let e = 0, i = 0; e < numEps; e++) {
  const sz = baseSz + (e < extra ? 1 : 0);
  eps.push(usable.slice(i, i + sz));
  i += sz;
}
const total = eps.length;
const pad = (n) => String(n).padStart(2, "0");

const reels = [];
const covers = [];
const plan = [];
eps.forEach((chunk, idx) => {
  const ep = idx + 1;
  const nums = chunk.map(numOf);
  const slides = nums.map((num) => ({ image: `trips/${slug}/${slug}_${num}.jpg`, ...label(num) }));
  const reelId = `${cap}EP${pad(ep)}Reel`;
  const coverNum = spec.coverByEp[ep] && nums.includes(spec.coverByEp[ep]) ? spec.coverByEp[ep] : nums[0];
  const coverId = `${cap}EP${pad(ep)}Cover`;
  reels.push({
    id: reelId,
    cfg: {
      title: spec.title,
      subtitle: `${spec.subtitle} · EP${pad(ep)}`,
      handle: "@獨自旅遊亂走",
      outroTitle: `${spec.title}·全${total}辑`,
      outroSub: `EP${pad(ep)} / ${pad(total)}`,
      accent: spec.accent,
      coverSec: 2.4,
      slideSec: 2.2,
      outroSec: 3,
      slides,
    },
  });
  covers.push({
    id: coverId,
    cfg: {
      image: `trips/${slug}/${slug}_${coverNum}.jpg`,
      accent: spec.accent,
      pillL: "一个人旅行",
      pillR: spec.pillR,
      hookL: spec.hookL,
      hookR: spec.hookR,
      title: spec.title,
      subtitle: spec.subtitle,
      handle: "@独自旅游乱走",
      focus: spec.focusByEp[ep] || "50% 50%",
      ep: `EP${pad(ep)} / ${pad(total)}`,
    },
  });
  plan.push({ ep, reelId, coverId, folder: `${spec.folderBase}EP${pad(ep)}`, images: nums.map((n) => `${slug}_${n}.jpg`) });
});

const epsDir = path.join(REPO, "src/videos/trip-reel/eps");
fs.mkdirSync(epsDir, { recursive: true });
const outJson = { slug, title: spec.title, total, perEp: PER_EP, accent: spec.accent, reels, covers, plan };
fs.writeFileSync(path.join(epsDir, `${slug}.json`), JSON.stringify(outJson, null, 1));
console.log(`${slug}: usable=${usable.length} → ${total} EPs (×${PER_EP}); images→${outDir}; json→eps/${slug}.json`);
plan.forEach((p) => console.log(`  EP${pad(p.ep)} ${p.images.length}img cover=${p.coverId} folder=${p.folder}`));
