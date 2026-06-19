# git-commit-push-guide — Git commit 與 push 新手指南

A calm, beginner-first explainer (1920×1080, 30 fps, ~6.7 min). All on-screen
titles / labels / captions are Traditional Chinese; commands, filenames, product
names and technical terms stay in English.

## Compositions (registered in `src/Root.tsx`)

- `GitCommitPushGuide` — the full video (Cover + 8 sections + Outro).
- `GitCommitPushGuidePoster` — the thumbnail still.
- `GitGuide-Scenes/GG-*` — each scene on its own, for fast iteration.

## Structure

- `brand.ts` — on-screen identity (title, tagline, date).
- `data.ts` — **all copy + the motif/semantic palette** (edit text here, not in scenes).
- `script.json` — narration caption text (id → line). Same text is captioned and, later, spoken.
- `vo-manifest.json` — measured VO seconds. Empty `{}` → **captions-only** (render-safe, no audio files needed).
- `captions.tsx` — `buildScene()` lays cues back-to-back; length-based fallback paces them while captions-only.
- `components.tsx` — `Shell` (chrome), `Heading`, `Stamp`, `KeyLine`, `Chip`, `FlowArrow`, `BrandGlyph`, and the master **`Pipeline`** (改檔案 → commit → push).
- `motifs.tsx` — the recurring vocabulary + synthesized mockups: `ChangedFile` 📄, `CommitBox` 💾, `Laptop` 🖥, `GitHubCloud` ☁️, `PushArrow` ⬆, `ChatBubble` 💬, `AllowButton`, `Terminal`, `GuiApp`, `SlashMenu`, `PermissionDialog`, `Toast`.
- `scenes/` — one file per scene (`Cover`, `Scene1…8`, `Outro`); each exports a component + a `SceneDef` added to `registry.ts`.

Shared primitives (`theme`, `anim`, `audio`, `Backdrop`, `CaptionTrack`, `types`)
come from `../../shared-skills/` — never copied in.

## Sections

cover hook · 1 最關鍵的觀念 · 2 用比喻理解 · 3 什麼時候用 · 4 三種輸入方式 ·
5 關於 /commit · 6 桌面版實作步驟 · 7 新手常踩的坑 · 8 給你的小建議 · outro 三步驟總整理

## Preview / render

```bash
npm run dev                 # Remotion Studio → pick GitCommitPushGuide
npm run render:git          # → out/git-commit-push-guide.mp4
```

## Adding voiceover later

Generate one mp3 per cue id (the keys in `script.json`) into
`public/vo/git-commit-push-guide/`, write each measured length (seconds) into
`vo-manifest.json`, and the narration plays in sync automatically — every scene's
timing re-flows to the real VO lengths (replacing the captions-only fallback).
