# _template — starter for a new video

Copy this whole folder, rename it, and wire it up. **Do not register `_template`
itself in `Root.tsx`** — it's just a skeleton (it stays type-valid but is never bundled).

## Steps

1. **Copy:** `cp -R src/videos/_template src/videos/<your-video>`
2. **Brand:** edit `brand.ts`.
3. **Scenes:** build `scenes/` (one file per scene — export a component + a `SceneDef`).
   Add each scene to `SCENES` in `registry.ts`.
4. **Voiceover (optional):** generate one mp3 per cue id into `public/vo/<your-video>/`,
   write measured seconds into `vo-manifest.json`, and set `voDir` in `captions.tsx`
   to `vo/<your-video>`.
5. **Register** it in `src/Root.tsx`:
   ```tsx
   import { Master as MyMaster } from "./videos/<your-video>/Master";
   import { SCENES, FPS, getMovieFrames } from "./videos/<your-video>/registry";
   // …
   <Composition id="MyVideo" component={MyMaster} fps={FPS}
     durationInFrames={getMovieFrames()} width={1920} height={1080} />
   ```

Everything reusable (theme, anim, audio, captions, lux, logos, Backdrop) is imported
from `../../shared-skills/…`. **Never copy shared code into a video folder** — if a
component is needed by a 2nd video, promote it into `shared-skills/`.
