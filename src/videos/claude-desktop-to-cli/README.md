# claude-desktop-to-cli

「Claude 桌面版 → CLI：差異、安裝與換機備份」— a light-theme, technical-explainer
tutorial (1920×1080, 30fps). Cover + 5 sections + Outro.

- **Cover** — Code 分頁 ≡ 終端機 CLI（同引擎）。
- **01 桌面版 vs CLI** — 三個分頁是三個不同產品；只有 Code 跟 CLI 同引擎。
- **02 CLI 去哪拿** — 原生安裝器（自動更新）＋其他方式＋首次登入。
- **03 同機轉移** — Code/CLI 讀磁碟同一批檔；自動共用 vs 不共用；Continue in…；Memory 例外。
- **04 換電腦** — 本機優先；保留得了 / 保不住；最穩三步。
- **05 備份／還原腳本** — `claude-migrate.sh` backup / restore / check ＋手動 `tar`。
- **Outro** — 三點總整理 ＋ 感謝/訂閱 CTA。

## Files

- `brand.ts` — on-screen identity (title, tagline, date).
- `data.ts` — all copy + `MOTIF`/`PAL` palettes.
- `script.json` — narration text per cue id (captioned now, spoken later).
- `vo-manifest.json` — measured VO seconds (empty → captions-only).
- `captions.tsx` — `buildScene()` timing + `<Captions>` bound to `vo/claude-desktop-to-cli`.
- `components.tsx` — `Shell` chrome, `Heading`, `KeyLine`, `Stamp`, `Chip`, `Panel`, `FlowArrow`.
- `motifs.tsx` — synthesized mockups: `AppWindow` (3 tabs), `Terminal`, `EngineBlock`,
  `Disk`, `Laptop`, `Tarball`, `KeyChip`, `RepoBox`, `FileTree`.
- `scenes/` — `Cover` + `Scene1…5` + `Outro` (each exports a component + a `SceneDef`).
- `registry.ts` · `Master.tsx` · `Poster.tsx`.

Everything reusable (theme, anim, audio, captions, Backdrop, CaptionBar) is imported
from `../../shared-skills/…`.

## Render

```bash
npm run render:claude-cli       # → out/claude-desktop-to-cli.mp4
npx remotion still ClaudeDesktopToCliPoster out/claude-desktop-to-cli-poster.png
```

## Add voiceover later

Generate one mp3 per cue id into `public/vo/claude-desktop-to-cli/`, write measured
seconds into `vo-manifest.json` — the visual beats already key off cue timing, so
narration drops in with no scene changes.
