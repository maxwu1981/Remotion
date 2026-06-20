#!/usr/bin/env node
/**
 * Bakes a STATIC, crawlable snapshot of the channel's videos into docs/index.html
 * so AI answer engines (ChatGPT / Perplexity / Claude / Google AI Overviews) — which
 * usually DON'T run JavaScript — can actually see and cite the video list. The live
 * app.js grid (search/sort/modal, view counts) still serves humans; this snapshot is
 * the no-JS fallback inside #grid plus a rich VideoObject ItemList JSON-LD in <head>.
 *
 *   node scripts/build-site-snapshot.mjs
 *
 * Reads the channel id + an UNRESTRICTED YouTube Data API key from the gitignored
 * automation/state/config.json (or env YT_API_KEY / YT_CHANNEL_ID). The browser key in
 * docs/config.js is referrer-restricted and can't be used server-side. Re-run any time
 * (e.g. from the daily 02:00 routine) to refresh the static list.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(readFileSync(join(root, "automation/state/config.json"), "utf8"));
const API_KEY = process.env.YT_API_KEY || cfg.youtube_server_api_key;
const CHANNEL_ID = process.env.YT_CHANNEL_ID || cfg.channel_id || "UCeIUOn3e8QzITwPhLaYK4Yw";
const API = "https://www.googleapis.com/youtube/v3";

if (!API_KEY) {
  console.error("✘ 缺 API key：設定 automation/state/config.json 的 youtube_server_api_key 或環境變數 YT_API_KEY");
  process.exit(1);
}

async function apiGet(path, params) {
  const url = new URL(API + path);
  Object.entries({ ...params, key: API_KEY }).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status} ${path}`);
  return data;
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function zhCount(n) {
  n = Number(n) || 0;
  if (n >= 1e8) return (n / 1e8).toFixed(1).replace(/\.0$/, "") + "億";
  if (n >= 1e4) return (n / 1e4).toFixed(1).replace(/\.0$/, "") + "萬";
  return String(n);
}
function ymd(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}

async function getVideos() {
  const ch = await apiGet("/channels", { part: "contentDetails", id: CHANNEL_ID });
  const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error("找不到頻道上傳清單，請確認 CHANNEL_ID");

  let ids = [], pageToken;
  do {
    const d = await apiGet("/playlistItems", { part: "contentDetails", playlistId: uploads, maxResults: 50, pageToken });
    ids.push(...(d.items || []).map((it) => it.contentDetails?.videoId).filter(Boolean));
    pageToken = d.nextPageToken;
  } while (pageToken);

  const vids = [];
  for (let i = 0; i < ids.length; i += 50) {
    const d = await apiGet("/videos", { part: "snippet,contentDetails,statistics", id: ids.slice(i, i + 50).join(",") });
    for (const x of d.items || []) {
      if (x.status?.privacyStatus && x.status.privacyStatus !== "public") continue;
      const sn = x.snippet || {};
      vids.push({
        id: x.id,
        title: sn.title || "",
        description: (sn.description || "").trim(),
        published: sn.publishedAt || "",
        thumb: (sn.thumbnails?.medium || sn.thumbnails?.default)?.url || "",
        duration: x.contentDetails?.duration || "",
        views: Number(x.statistics?.viewCount || 0),
      });
    }
  }
  vids.sort((a, b) => new Date(b.published) - new Date(a.published)); // newest first
  return vids;
}

function gridHtml(videos) {
  return videos
    .map((v) => {
      const meta = [ymd(v.published), v.views ? `${zhCount(v.views)} 次觀看` : ""].filter(Boolean)
        .map((t) => `<span>${esc(t)}</span>`).join("\n          ");
      return `      <a class="card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" data-id="${v.id}" data-title="${esc(v.title)}">
        <div class="card__thumbwrap">
          <img class="card__thumb" loading="lazy" src="${esc(v.thumb)}" alt="${esc(v.title)}" />
          <div class="card__play"><span>▶</span></div>
        </div>
        <div class="card__body">
          <h3 class="card__title">${esc(v.title)}</h3>
          <div class="card__meta">
          ${meta}
          </div>
        </div>
      </a>`;
    })
    .join("\n");
}

function schemaJson(videos) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ai-Wisdom-01 影片",
    itemListElement: videos.map((v, i) => {
      const item = {
        "@type": "VideoObject",
        name: v.title,
        description: v.description ? v.description.slice(0, 320) : v.title,
        thumbnailUrl: v.thumb,
        uploadDate: v.published,
        url: "https://www.youtube.com/watch?v=" + v.id,
        embedUrl: "https://www.youtube.com/embed/" + v.id,
      };
      if (v.duration) item.duration = v.duration;
      if (v.views)
        item.interactionStatistic = {
          "@type": "InteractionCounter",
          interactionType: { "@type": "WatchAction" },
          userInteractionCount: v.views,
        };
      return { "@type": "ListItem", position: i + 1, item };
    }),
  };
  // 內嵌到 <script> 時，把 < 轉義成 <，避免描述含 </script> 提前中斷標籤（JSON 仍合法）
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}

function replaceBlock(html, name, inner) {
  const re = new RegExp(`(<!-- SNAPSHOT:${name}:START -->)[\\s\\S]*?(<!-- SNAPSHOT:${name}:END -->)`);
  if (!re.test(html)) throw new Error(`index.html 缺少 SNAPSHOT:${name} 標記`);
  return html.replace(re, `$1\n${inner}\n      $2`);
}

(async () => {
  const videos = await getVideos();
  if (!videos.length) throw new Error("API 沒回傳任何公開影片，為安全起見不覆寫快照");

  const idxPath = join(root, "docs/index.html");
  let html = readFileSync(idxPath, "utf8");
  const stamp = `      <!-- 自動產生於 ${new Date().toISOString()}，共 ${videos.length} 支；勿手動編輯，改跑 npm run snapshot -->`;

  const schemaBlock =
    `  <script type="application/ld+json" id="staticVideoSchema">\n${schemaJson(videos)}\n  </script>`;
  html = replaceBlock(html, "SCHEMA", schemaBlock);
  html = replaceBlock(html, "GRID", `${stamp}\n${gridHtml(videos)}`);
  writeFileSync(idxPath, html);

  // 同步更新 sitemap 的 lastmod（爬取新鮮度訊號）
  const smPath = join(root, "docs/sitemap.xml");
  let sm = readFileSync(smPath, "utf8");
  const today = new Date().toISOString().slice(0, 10);
  sm = /<lastmod>/.test(sm)
    ? sm.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${today}</lastmod>`)
    : sm.replace(/(<\/loc>)/, `$1\n    <lastmod>${today}</lastmod>`);
  writeFileSync(smPath, sm);

  console.log(`✓ 靜態快照寫入 docs/index.html（${videos.length} 支影片）+ sitemap lastmod=${today}`);
})().catch((e) => {
  console.error("✘ 快照失敗：", e.message);
  process.exit(1);
});
