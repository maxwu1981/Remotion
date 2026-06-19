# Remotion Video Studio — modular, multi-video

A single Remotion project that holds **several videos** without re-scaffolding a
new project each time. Reusable building blocks live once in `src/shared-skills/`;
every video gets its own folder under `src/videos/`. Dependencies only ever flow
one way — `videos/* → shared-skills/*`, never the reverse.

Minimalist UI/UX throughout: a `#F8F9FA` canvas, glassmorphism, **Inter** +
**JetBrains Mono**, and physics-based motion driven by Remotion `spring()` /
`interpolate()` — **no CSS transitions anywhere**.

## Videos

| Video | Composition id | Render | What it is |
|-------|----------------|--------|------------|
| **Auto-Upload** (primary) | `AutoUpload` (+ `U1…U9`) | `npm run render` → `out/auto-upload.mp4` | 9-scene tutorial: automate YouTube uploads via the YouTube Data API (GCP project → OAuth + test users → credentials → terminal → browser auth → success → recap → CTA). ~1:47, soft-piano bed. |
| **AutoLine** | `ProductionLine` (+ `Seq1…6`) | `npm run render:autoline` → `out/production-line.mp4` | Older 6-scene explainer on a zero-touch AI video-*editing* pipeline (cut silence, re-voice, render 16:9 + 9:16). |

Each video also exposes its scenes as standalone compositions (`U1…U9`,
`Seq1…6`) and a `Poster` still, for fast iteration in Studio.

## Project layout

```
src/
  Root.tsx                      # registers every composition (both videos)
  index.ts                      # registerRoot(RemotionRoot)

  shared-skills/                # reusable, video-agnostic — write once, reuse everywhere
    theme.ts                    # design tokens (colors, type, shadows, gradients)
    anim.ts                     # spring / easing helpers
    audio.tsx                   # <Bgm> + <Sfx> (frame-aligned one-shots)
    captions.tsx                # <CaptionTrack> — timed subtitle cues (manifest-agnostic)
    types.ts                    # SceneDef
    components/                 # Backdrop, CaptionBar, Narration, logos, lux (glass cards,
                                #   light streams, arrow links, 3D windows, holo module)

  videos/
    youtube-auto-upload/        # the Auto-Upload video
      Master.tsx registry.ts brand.ts ui.tsx UploadShell.tsx
      captions.tsx              # thin wrapper → CaptionTrack bound to this video's VO
      vo-manifest.json  scenes/Scene1…9.tsx
    autoline/                   # the AutoLine video
      Master.tsx registry.ts brand.ts SceneShell.tsx Tooltip.tsx Stage.tsx
      screenshots.ts captions.tsx vo-manifest.json
      data/episode.ts  mockups/*  scenes/Scene1…6.tsx

scripts/                        # make-vo, make-vo-upload, make-sfx, make-bgm, make-bgm-piano, render-all, stills-upload
public/                         # bgm*.mp3, sfx one-shots, vo/ (autoline) + vo/upload/ (auto-upload)
```

## Run it

```bash
npm install
npm run dev               # Remotion Studio — pick a composition in the sidebar
npm run render            # Auto-Upload  → out/auto-upload.mp4
npm run render:autoline   # AutoLine     → out/production-line.mp4
npm run render:all        # Auto-Upload + each U-scene  (add -- --autoline for AutoLine too)
```

## Adding a new video

No new Remotion project needed:

1. **Copy the starter:** `cp -R src/videos/_template src/videos/<name>` — a ready,
   type-valid skeleton (Master, registry, brand, example scene, captions wrapper).
2. Edit `brand.ts`, build `scenes/`, and import shared pieces from `../../shared-skills/…`.
3. Register a `<Composition>` for it in `src/Root.tsx`.

See `src/videos/_template/README.md` for the full checklist.

`shared-skills/` grows over time, so each new video starts faster than the last.

## Voiceover

`CaptionTrack` is manifest-agnostic; each video injects its own measured VO via a
thin `captions.tsx` wrapper (`vo` map + `voDir`). `Narration` takes an optional `dir`.

```bash
npm run vo:upload         # Auto-Upload — edge-tts neural voice → public/vo/upload/
npm run vo                # AutoLine — macOS `say` → public/vo/
# pick a voice:  VO_VOICE="en-US-AndrewMultilingualNeural" npm run vo:upload
```

edge-tts is free (uses Edge's online neural voices, no API key) and needs network.

## Sound design

One-shots + a music bed live at the root of `public/` (`ui-pop`, `soft-whoosh`,
`clean-ding`, `typing`, `digital-processing`, `cash-register`, `bgm.mp3`,
`bgm-piano.mp3`). Each cue is delayed with a `<Sequence>` so it lands
frame-perfectly on its animation (see `src/shared-skills/audio.tsx`).

```bash
npm run sfx               # synthesize placeholder one-shots (ffmpeg)
npm run bgm               # lo-fi bed → public/bgm.mp3 (AutoLine)
npm run bgm:piano         # soft piano bed → public/bgm-piano.mp3 (Auto-Upload)
```

## Notes

- All motion is frame-based (`useCurrentFrame` + `interpolate`/`spring`, Bézier easing). No CSS transitions.
- All "randomness" uses Remotion's deterministic `random(seed)`.
- Type-check: `npm run tsc` · Lint: `npm run lint`.
