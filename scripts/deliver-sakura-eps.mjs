#!/usr/bin/env node
/**
 * Package a 関西賞櫻 EP series to Google Drive.
 *   node scripts/deliver-sakura-eps.mjs <slug>
 * Reads src/videos/trip-reel/eps/<slug>.json (plan) + rendered covers/reels in
 * out/, and writes each EP folder under 小紅書手動發布/<folder>/ =
 * 00_封面 + NN.jpg(该EP图) + <title>EPNN-reel.mp4 + 文案.txt. Reel double-backup.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const REPO = "/Users/maxwu/Remotion";
const DRIVE = "/Users/maxwu/Library/CloudStorage/GoogleDrive-finalaaaa@gmail.com/我的雲端硬碟/小紅書手動發布";
const OUTBK = "/Users/maxwu/Library/CloudStorage/GoogleDrive-finalaaaa@gmail.com/我的雲端硬碟/Remotion-輸出/旅遊Reel-完成品";

// caption per slug: base GEO body (shared) + per-EP section label + tags
const CAPTIONS = {
  amano: {
    titleCn: "天桥立",
    sections: ["抵达·智恩寺·砂洲入口", "砂洲漫步·松並木①", "砂洲漫步·松並木②·老松", "伞松公园·空拍①", "成相寺五重塔·籠神社·空拍②", "飞龙观·ビューランド全景"],
    base: `日本三景天桥立，是一条长约3.6km、种着约6700棵松的细长砂洲，横在宫津湾上。两大展望台：北侧伞松公园（股のぞき発祥地·昇龙观，缆车往返¥800）、南侧天桥立View Land（飞龙观，入园¥1,000）。京都出发特急「はしだて」约2小时直达，下站走或骑过3.6km砂洲、对岸搭缆车上展望台——弯腰从胯下倒看，砂洲就像飞向天空的桥。樱花季来最美。

✅适合：想避开京都人潮、爱海+山+樱一次拿下的人。🚫不建议：只有半天、怕舟车劳顿的人。
📍我的走法：京都特急→北侧伞松昇龙观+成相寺五重塔→骑车横穿砂洲→南侧飞龙观收尾。`,
    tags: "#天桥立 #海の京都 #日本三景 #关西旅行 #京都自由行 #日本樱花 #樱花季 #一个人旅行 #独自旅游乱走 #日本自由行",
  },
  ine: {
    titleCn: "伊根的舟屋",
    sections: ["伊根湾·遊覧船", "喂海鸥·遊覧船名物", "舟屋·临水而建", "舟屋全景·海上人家"],
    base: `伊根是被称作"日本最美渔村之一"的海の京都。约230间叫"舟屋"的木屋紧贴海面排成一圈，一楼直接停渔船、二楼住人，涨潮时整排房子像泡在海里。2005年整片舟屋群被选为"重要传统建造物群保存地区"（国家级保护）。

看法两种：大型【伊根湾めぐり遊覧船】约¥800，从海上看整排舟屋、船尾喂海鸥；小型【海上taxi】约¥1,000、约30分钟，离舟屋更近。岸上沿湾walk免费。最顺是先到天桥立，再坐路线巴士约57分钟到伊根，串成一天。

✅适合：爱小众渔村、爱坐船、想要"海+山+人家"慢节奏的人。🚫不建议：晕船、只想打卡一张就走的人。`,
    tags: "#伊根的舟屋 #伊根 #海の京都 #日本最美渔村 #关西旅行 #京都自由行 #天桥立 #一个人旅行 #独自旅游乱走 #日本自由行",
  },
};

const slug = process.argv[2];
const cap = CAPTIONS[slug];
const plan = JSON.parse(fs.readFileSync(path.join(REPO, `src/videos/trip-reel/eps/${slug}.json`), "utf8"));
if (!cap) { console.error("no caption template for", slug); process.exit(1); }

const pad = (n) => String(n).padStart(2, "0");
fs.mkdirSync(OUTBK, { recursive: true });

for (const ep of plan.plan) {
  const n = pad(ep.ep);
  const dst = path.join(DRIVE, ep.folder);
  fs.rmSync(dst, { recursive: true, force: true });
  fs.mkdirSync(dst, { recursive: true });
  // cover
  fs.copyFileSync(path.join(REPO, `out/${slug}-ep${n}-cover.jpg`), path.join(dst, "00_封面.jpg"));
  // images
  ep.images.forEach((img, i) => fs.copyFileSync(path.join(REPO, "public/trips", slug, img), path.join(dst, `${pad(i + 1)}.jpg`)));
  // reel
  const reel = path.join(REPO, `out/${slug}-ep${n}-reel-xhs.mp4`);
  const reelName = `${cap.titleCn}EP${n}-reel.mp4`;
  fs.copyFileSync(reel, path.join(dst, reelName));
  fs.copyFileSync(reel, path.join(OUTBK, reelName));
  // caption
  const sec = cap.sections[ep.ep - 1] || `EP${n}`;
  const text = `🌸${cap.titleCn}·樱花季全记录 EP${n}/${pad(plan.total)}（${sec}）\n\n${cap.base}\n\n📷 本篇EP${n}：${sec}（共${pad(plan.total)}辑，想看完整可翻其他辑）\n\n${cap.tags}`;
  fs.writeFileSync(path.join(dst, "文案.txt"), text);
  console.log(`delivered ${ep.folder}: 00_封面 + ${ep.images.length}图 + ${reelName} + 文案`);
}
console.log(`\n✅ ${slug}: ${plan.plan.length} EP folders → ${DRIVE}`);
