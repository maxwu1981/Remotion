// ──────────────────────────────────────────────────────────────────────────
// Ai-Wisdom-01 影片中心 — 設定檔 (這是你唯一需要編輯的檔案)
//
// 1) API_KEY: 到 Google Cloud Console 建立 YouTube Data API v3 金鑰，
//    並在「應用程式限制」設為 HTTP 參照網址：
//        https://maxwu1981.github.io/*
//        http://localhost:*
//    參照限制過的金鑰放在前端是安全的。
//
// 2) 頻道：填 CHANNEL_ID（最準）或 CHANNEL_HANDLE（@開頭都可）擇一即可。
//    不確定 ID 時，先填 handle，網站會自動解析。
// ──────────────────────────────────────────────────────────────────────────

window.SITE_CONFIG = {
  API_KEY: "AIzaSyDYcpb64UqN2nq7ZFZNuKpxXUDkui7N1bQ",

  // 兩者擇一（CHANNEL_ID 優先；留空字串代表不使用）
  CHANNEL_ID: "UCeIUOn3e8QzITwPhLaYK4Yw",
  CHANNEL_HANDLE: "@Ai-Wisdom-01",

  // 介面文字（中英混合）
  SITE_TITLE: "Ai-Wisdom-01",
  TAGLINE: "Claude AI 學習心得 · 影片中心",
  FOOTER: "© 2026 Ai-Wisdom-01 · Built with Claude Code",
};
