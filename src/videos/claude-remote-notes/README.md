# claude-remote-notes — Claude Code 手機／遠端全解析

A calm, technical light-theme explainer (1920×1080, 30fps, Traditional Chinese)
covering how Claude Code behaves on mobile / remote: shared conversation memory vs
isolated execution, `CLAUDE.md` as the memory file, containers, the sandbox fence,
and Dispatch. Composition id: **`ClaudeRemoteNotes`** (+ `ClaudeRemoteNotesPoster`).

## Structure

- `brand.ts` — on-screen identity (title, tagline, date chip).
- `script.json` — canonical narration (id → line). **Same text is captioned and spoken.**
- `data.ts` — content model: semantic palette (`PAL`), motif accents (`MOTIF`), and
  every on-screen table / glossary / card copy.
- `components.tsx` — chrome + UI primitives: `Shell`, `Heading`, `Stamp` (✔/✘/⚠),
  `Chip`, `KeyLine`, `SignalDots`, `FlowArrow`, `BrandGlyph`.
- `motifs.tsx` — the recurring physical-object vocabulary (reuse = meaning compounds):
  `Phone` 📱, `Container` ☁️/🖥 (wipeable work desk), `Warehouse` 🏛️ (GitHub vault),
  `ClaudeMdNote` 📝, `SandboxFence` 🔒, `DeviceToken`, `Cloud`, `MiniTerminal`.
- `scenes/` — `Cover` + `Scene1…9` + `Outro`. Each exports a component + a `SceneDef`.
- `captions.tsx` — `buildScene()` times cues to the measured VO and returns the scene
  length; visual beats in each scene are keyed to `CUES[i].from` so reveals stay
  locked to the voice once VO timing lands.

## Voiceover

```bash
npm run vo:claude-remote                              # zh-TW-HsiaoChenNeural (female)
VO_VOICE="zh-TW-YunJheNeural" npm run vo:claude-remote # male
```

Writes `public/vo/claude-remote-notes/<id>.mp3` + `vo-manifest.json`. With an empty
manifest the project still previews captions-only (each scene falls back to a fixed
per-line length).

## Render

```bash
npm run render:claude-remote        # → out/claude-remote-notes.mp4
```

All reusable code (theme, anim, audio, captions, Backdrop) is imported from
`../../shared-skills/…` — never copied in.
