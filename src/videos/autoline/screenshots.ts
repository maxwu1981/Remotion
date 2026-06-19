/**
 * Optional real screenshots. The build ships with coded mockups everywhere; to
 * swap in a real screenshot, drop the file in `public/screenshots/` and flip its
 * flag to `true` here. Left `false`, the coded fallback is used (so the project
 * always renders, with or without the images).
 */
export const SCREENSHOTS: Record<string, boolean> = {
  "remotion-studio.png": false, // Section 5 — `npm start`
  "obs.png": false, // Sections 1 & 3 — OBS capture
  "vscode-episode.png": false, // Section 4/7 — editor
  "episode-001.png": false, // Section 8 — finished player frame
};
