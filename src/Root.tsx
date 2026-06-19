import React from "react";
import { Composition, Folder, Still } from "remotion";
import { FPS, SCENES, getMovieFrames } from "./videos/autoline/registry";
import { Master, Poster } from "./videos/autoline/Master";
import { UPLOAD_FPS, UPLOAD_SCENES, getUploadMovieFrames } from "./videos/youtube-auto-upload/registry";
import { UploadMaster, UploadPoster } from "./videos/youtube-auto-upload/Master";
import { FPS as AIV_FPS, SCENES as AIV_SCENES, getMovieFrames as getAivFrames } from "./videos/ai-voice-comparison/registry";
import { Master as AivMaster, MasterChatTTS as AivMasterChatTTS } from "./videos/ai-voice-comparison/Master";
import { FPS as MCP_FPS, SCENES as MCP_SCENES, getMovieFrames as getMcpFrames } from "./videos/mcp-vs-api/registry";
import { Master as McpMaster } from "./videos/mcp-vs-api/Master";
import { Poster as McpPoster } from "./videos/mcp-vs-api/Poster";
import { ReelMaster as McpReelMaster } from "./videos/mcp-vs-api/reel/ReelMaster";
import { ReelPoster as McpReelPoster } from "./videos/mcp-vs-api/reel/ReelPoster";
import {
  FPS as RECAP_FPS,
  SCENES as RECAP_SCENES,
  getMovieFrames as getRecapFrames,
} from "./videos/ai-daily-recap/registry";
import { Master as RecapMaster } from "./videos/ai-daily-recap/Master";
import { Poster as RecapPoster } from "./videos/ai-daily-recap/Poster";
import { ReelMaster as RecapReelMaster } from "./videos/ai-daily-recap/reel/ReelMaster";
import { ReelPoster as RecapReelPoster } from "./videos/ai-daily-recap/reel/ReelPoster";
import { PaintingReveal } from "./videos/painting-reveal/PaintingReveal";
import { PaintingPoster } from "./videos/painting-reveal/Poster";
import {
  paintingSchema,
  DEFAULT_PAINTING,
  calculatePaintingMetadata,
  totalFrames,
  FPS as PR_FPS,
} from "./videos/painting-reveal/config";
import { PAINTINGS, paintingId } from "./videos/painting-reveal/paintings";
import { FPS as CRN_FPS, SCENES as CRN_SCENES, getMovieFrames as getCrnFrames } from "./videos/claude-remote-notes/registry";
import { Master as CrnMaster } from "./videos/claude-remote-notes/Master";
import { Poster as CrnPoster } from "./videos/claude-remote-notes/Poster";
import { ReelMaster as CrnReelMaster } from "./videos/claude-remote-notes/reel/ReelMaster";
import { ReelPoster as CrnReelPoster } from "./videos/claude-remote-notes/reel/ReelPoster";
import { TripReel } from "./videos/trip-reel/TripReel";
import {
  tripReelSchema,
  calculateTripReelMetadata,
  reelFrames,
  FPS as TRIP_FPS,
  KANAZAWA_REEL,
} from "./videos/trip-reel/config";

/**
 * Compositions:
 *   AutoUpload      — the YouTube Data API auto-upload tutorial (this video, 1920×1080, 30fps)
 *   AutoUploadPoster — its static title still
 *   Auto-Upload · Scenes/U1…9 — each sequence on its own, for fast iteration
 *
 *   ProductionLine  — the earlier "AutoLine" masterclass (kept for reference)
 *   Poster, Sequences/Seq1…6 — its still + per-sequence comps
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── 旅遊照片 reel(9:16, 30fps)— 一個 TripReel 套所有旅程,金澤先上 ── */}
      <Composition
        id="KanazawaReel"
        component={TripReel}
        schema={tripReelSchema}
        defaultProps={KANAZAWA_REEL}
        calculateMetadata={calculateTripReelMetadata}
        durationInFrames={reelFrames(KANAZAWA_REEL)}
        fps={TRIP_FPS}
        width={1080}
        height={1920}
      />

      {/* ── Newest: Claude Code 手機／遠端全解析 — 記憶、容器與 CLAUDE.md (1920×1080, 30fps) ── */}
      <Composition
        id="ClaudeRemoteNotes"
        component={CrnMaster}
        durationInFrames={getCrnFrames()}
        fps={CRN_FPS}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeRemoteNotesPoster" component={CrnPoster} width={1920} height={1080} />

      {/* vertical Reel / Shorts cut (9:16) — reuses the same master + narration */}
      <Composition
        id="ClaudeRemoteNotesReel"
        component={CrnReelMaster}
        durationInFrames={getCrnFrames()}
        fps={CRN_FPS}
        width={1080}
        height={1920}
      />
      <Still id="ClaudeRemoteNotesReelPoster" component={CrnReelPoster} width={1080} height={1920} />

      <Folder name="ClaudeRemote-Scenes">
        {CRN_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`CR-${s.id}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={CRN_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── ai-daily-recap · Remotion × Claude 自動化每日影片產線教學 (1920×1080, 30fps) ── */}
      <Composition
        id="DailyRecap"
        component={RecapMaster}
        durationInFrames={getRecapFrames()}
        fps={RECAP_FPS}
        width={1920}
        height={1080}
      />
      <Still id="DailyRecapPoster" component={RecapPoster} width={1920} height={1080} />

      {/* vertical Reel / Shorts cut (9:16) — reuses the same master + narration */}
      <Composition
        id="DailyRecapReel"
        component={RecapReelMaster}
        durationInFrames={getRecapFrames()}
        fps={RECAP_FPS}
        width={1080}
        height={1920}
      />
      <Still id="DailyRecapReelPoster" component={RecapReelPoster} width={1080} height={1920} />

      <Folder name="DailyRecap-Scenes">
        {RECAP_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`R${s.index}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={RECAP_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── 峻清书画 · 每幅畫的「作畫過程」直式短片 (9:16, 30fps) ──
          One parametrized template; each painting is just a PaintingConfig.
          Edit props live in Studio, or pick a painting from the Paintings folder. */}
      <Composition
        id="PaintingReveal"
        component={PaintingReveal}
        schema={paintingSchema}
        defaultProps={DEFAULT_PAINTING}
        calculateMetadata={calculatePaintingMetadata}
        durationInFrames={totalFrames(DEFAULT_PAINTING)}
        fps={PR_FPS}
        width={1080}
        height={1920}
      />
      <Still
        id="PaintingRevealPoster"
        component={PaintingPoster}
        schema={paintingSchema}
        defaultProps={DEFAULT_PAINTING}
        width={1080}
        height={1920}
      />
      <Folder name="Paintings">
        {PAINTINGS.map((p) => (
          <Composition
            key={paintingId(p)}
            id={`P-${paintingId(p)}`}
            component={PaintingReveal}
            schema={paintingSchema}
            defaultProps={p}
            calculateMetadata={calculatePaintingMetadata}
            durationInFrames={totalFrames(p)}
            fps={PR_FPS}
            width={1080}
            height={1920}
          />
        ))}
      </Folder>

      {/* ── Newest: MCP vs API explainer (中英對照, 1920×1080, 30fps) ── */}
      <Composition
        id="McpVsApi"
        component={McpMaster}
        durationInFrames={getMcpFrames()}
        fps={MCP_FPS}
        width={1920}
        height={1080}
      />
      <Still id="McpVsApiPoster" component={McpPoster} width={1920} height={1080} />

      {/* vertical Reel / Shorts cut (9:16) — reuses the same master + narration */}
      <Composition
        id="McpVsApiReel"
        component={McpReelMaster}
        durationInFrames={getMcpFrames()}
        fps={MCP_FPS}
        width={1080}
        height={1920}
      />
      <Still id="McpVsApiReelPoster" component={McpReelPoster} width={1080} height={1920} />

      <Folder name="MCP-API-Scenes">
        {MCP_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`M${s.index}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={MCP_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── AI voice picker ─────────────────────────────────────────── */}
      <Composition
        id="AIVoiceComparison"
        component={AivMaster}
        durationInFrames={getAivFrames()}
        fps={AIV_FPS}
        width={1920}
        height={1080}
      />
      {/* same video, ChatTTS (seed 23) narration instead of Ava */}
      <Composition
        id="AIVoiceComparisonChatTTS"
        component={AivMasterChatTTS}
        durationInFrames={getAivFrames()}
        fps={AIV_FPS}
        width={1920}
        height={1080}
      />
      <Folder name="AI-Voice-Scenes">
        {AIV_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`AV${s.index}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={AIV_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── Primary: the storyboard video ───────────────────────────── */}
      <Composition
        id="AutoUpload"
        component={UploadMaster}
        durationInFrames={getUploadMovieFrames()}
        fps={UPLOAD_FPS}
        width={1920}
        height={1080}
      />

      <Still id="AutoUploadPoster" component={UploadPoster} width={1920} height={1080} />

      <Folder name="Auto-Upload-Scenes">
        {UPLOAD_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`U${s.index}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={UPLOAD_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── Earlier AutoLine masterclass (kept) ─────────────────────── */}
      <Folder name="AutoLine">
        <Composition
          id="ProductionLine"
          component={Master}
          durationInFrames={getMovieFrames()}
          fps={FPS}
          width={1920}
          height={1080}
        />

        <Still id="Poster" component={Poster} width={1920} height={1080} />

        {SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`Seq${s.index}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>
    </>
  );
};
