// ── Ai-Wisdom-01 影片中心 ──────────────────────────────────────────────────
// 全部資料即時來自 YouTube Data API v3。設定請見 config.js。

const CFG = window.SITE_CONFIG || {};
const API = "https://www.googleapis.com/youtube/v3";

const $ = (sel) => document.querySelector(sel);
const gridEl = $("#grid");
const statusEl = $("#status");

let state = { videos: [], sort: "newest", q: "" };

// ── helpers ────────────────────────────────────────────────────────────────
function zhCount(n) {
  n = Number(n) || 0;
  if (n >= 1e8) return (n / 1e8).toFixed(1).replace(/\.0$/, "") + "億";
  if (n >= 1e4) return (n / 1e4).toFixed(1).replace(/\.0$/, "") + "萬";
  return n.toLocaleString("zh-Hant");
}
function fmtDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleDateString("zh-Hant", { year: "numeric", month: "2-digit", day: "2-digit" });
}
function esc(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
async function api(path, params) {
  const url = new URL(API + path);
  Object.entries({ ...params, key: CFG.API_KEY }).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  return data;
}

// ── data fetch ───────────────────────────────────────────────────────────
async function getChannel() {
  const params = { part: "snippet,contentDetails,statistics" };
  if (CFG.CHANNEL_ID) params.id = CFG.CHANNEL_ID;
  else params.forHandle = CFG.CHANNEL_HANDLE;
  const data = await api("/channels", params);
  const ch = data.items?.[0];
  if (!ch) throw new Error("找不到頻道，請確認 config.js 的 CHANNEL_ID / CHANNEL_HANDLE。");
  return ch;
}

async function getUploads(playlistId) {
  let items = [], pageToken;
  do {
    const data = await api("/playlistItems", {
      part: "snippet,contentDetails", playlistId, maxResults: 50, pageToken,
    });
    items = items.concat(data.items || []);
    pageToken = data.nextPageToken;
  } while (pageToken);
  return items
    .map((it) => ({
      id: it.contentDetails?.videoId,
      title: it.snippet?.title,
      published: it.contentDetails?.videoPublishedAt || it.snippet?.publishedAt,
      thumb: (it.snippet?.thumbnails?.medium || it.snippet?.thumbnails?.default)?.url,
      views: 0,
    }))
    .filter((v) => v.id && v.title !== "Private video" && v.title !== "Deleted video");
}

async function attachStats(videos) {
  for (let i = 0; i < videos.length; i += 50) {
    const batch = videos.slice(i, i + 50);
    const data = await api("/videos", { part: "statistics", id: batch.map((v) => v.id).join(",") });
    const map = Object.fromEntries((data.items || []).map((x) => [x.id, Number(x.statistics?.viewCount || 0)]));
    batch.forEach((v) => (v.views = map[v.id] ?? 0));
  }
}

// ── render ─────────────────────────────────────────────────────────────────
function renderHero(ch) {
  const id = ch.id;
  const sub = `https://www.youtube.com/channel/${id}?sub_confirmation=1`;
  const s = ch.snippet, st = ch.statistics;
  $("#brandName").textContent = CFG.SITE_TITLE || s.title;
  $("#heroTitle").textContent = CFG.SITE_TITLE || s.title;
  $("#heroTagline").textContent = CFG.TAGLINE || s.description?.split("\n")[0] || "";
  const av = s.thumbnails?.medium?.url || s.thumbnails?.default?.url;
  if (av) { $("#heroAvatar").src = av; $("#heroAvatar").alt = s.title; }
  $("#navSubscribe").href = sub;
  $("#heroSubscribe").href = sub;
  $("#footerText").textContent = CFG.FOOTER || "";
  const stats = [];
  if (st?.subscriberCount) stats.push(`<span class="stat"><b>${zhCount(st.subscriberCount)}</b> 訂閱</span>`);
  if (st?.videoCount) stats.push(`<span class="stat"><b>${zhCount(st.videoCount)}</b> 部影片</span>`);
  if (st?.viewCount) stats.push(`<span class="stat"><b>${zhCount(st.viewCount)}</b> 總觀看</span>`);
  $("#heroStats").innerHTML = stats.join("");
}

function visibleVideos() {
  let list = state.videos;
  if (state.q) {
    const q = state.q.toLowerCase();
    list = list.filter((v) => v.title.toLowerCase().includes(q));
  }
  list = [...list].sort((a, b) =>
    state.sort === "popular" ? b.views - a.views : new Date(b.published) - new Date(a.published)
  );
  return list;
}

function renderGrid() {
  const list = visibleVideos();
  if (!list.length) {
    gridEl.innerHTML = "";
    statusEl.textContent = state.q ? `找不到符合「${state.q}」的影片。` : "目前沒有影片。";
    return;
  }
  statusEl.textContent = "";
  gridEl.innerHTML = list
    .map(
      (v) => `
    <article class="card" data-id="${v.id}" data-title="${esc(v.title)}">
      <div class="card__thumbwrap">
        <img class="card__thumb" loading="lazy" src="${v.thumb}" alt="${esc(v.title)}" />
        <div class="card__play"><span>▶</span></div>
      </div>
      <div class="card__body">
        <h3 class="card__title">${esc(v.title)}</h3>
        <div class="card__meta">
          <span>${fmtDate(v.published)}</span>
          ${v.views ? `<span>${zhCount(v.views)} 次觀看</span>` : ""}
        </div>
      </div>
    </article>`
    )
    .join("");
}

function renderSkeleton(n = 8) {
  gridEl.innerHTML = Array.from({ length: n })
    .map(() => `<div class="skeleton"><div class="sk"></div><div class="sk-line"></div><div class="sk-line short"></div></div>`)
    .join("");
}

// ── structured data (GEO): expose the live video list to AI/search crawlers ──
function injectVideoSchema(videos) {
  if (!videos.length) return;
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ai-Wisdom-01 影片",
    itemListElement: videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        thumbnailUrl: v.thumb,
        uploadDate: v.published,
        url: "https://www.youtube.com/watch?v=" + v.id,
        embedUrl: "https://www.youtube.com/embed/" + v.id,
      },
    })),
  };
  document.getElementById("videoSchema")?.remove();
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.id = "videoSchema";
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

// ── modal ──────────────────────────────────────────────────────────────────
function openModal(id, title) {
  $("#modalTitle").textContent = title;
  $("#player").innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $("#modal").hidden = true;
  $("#player").innerHTML = "";
  document.body.style.overflow = "";
}

// ── events ─────────────────────────────────────────────────────────────────
gridEl.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openModal(card.dataset.id, card.dataset.title);
});
$("#modal").addEventListener("click", (e) => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
$("#searchInput").addEventListener("input", (e) => { state.q = e.target.value.trim(); renderGrid(); });
document.querySelectorAll(".sort__btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sort__btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.sort = btn.dataset.sort;
    renderGrid();
  })
);

// ── boot ───────────────────────────────────────────────────────────────────
async function boot() {
  if (!CFG.API_KEY || CFG.API_KEY.startsWith("PASTE_")) {
    statusEl.className = "status status--error";
    statusEl.innerHTML = "尚未設定 API 金鑰 — 請編輯 <code>config.js</code> 填入 YouTube Data API key。";
    return;
  }
  renderSkeleton();
  try {
    const ch = await getChannel();
    renderHero(ch);
    const uploads = ch.contentDetails?.relatedPlaylists?.uploads;
    state.videos = await getUploads(uploads);
    renderGrid();                 // 先用最新排序顯示
    injectVideoSchema(state.videos);
    await attachStats(state.videos);
    if (state.sort === "popular") renderGrid();   // 觀看數到齊後若在最熱模式再排一次
  } catch (err) {
    gridEl.innerHTML = "";
    statusEl.className = "status status--error";
    const handle = (CFG.CHANNEL_HANDLE || "").replace(/^@/, "");
    const link = CFG.CHANNEL_ID
      ? `https://www.youtube.com/channel/${CFG.CHANNEL_ID}`
      : `https://www.youtube.com/@${handle}`;
    statusEl.innerHTML = `載入失敗：${esc(err.message)}<br/>你仍可<a href="${link}" target="_blank" rel="noopener">直接前往 YouTube 頻道</a>。`;
  }
}

boot();
