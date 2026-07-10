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
import { XhsCover, xhsCoverSchema, COVER_W, COVER_H } from "./videos/trip-reel/XhsCover";
import { XHS_COVERS } from "./videos/trip-reel/config";
import {
  tripReelSchema,
  calculateTripReelMetadata,
  reelFrames,
  FPS as TRIP_FPS,
  TRIP_REELS,
} from "./videos/trip-reel/config";
import { Master as GitMaster } from "./videos/git-commit-push-guide/Master";
import { Poster as GitPoster } from "./videos/git-commit-push-guide/Poster";
import {
  FPS as GIT_FPS,
  SCENES as GIT_SCENES,
  getMovieFrames as getGitFrames,
} from "./videos/git-commit-push-guide/registry";
import { Master as GitV2Master } from "./videos/git-commit-push-guide-v2/Master";
import { Poster as GitV2Poster } from "./videos/git-commit-push-guide-v2/Poster";
import {
  FPS as GIT_V2_FPS,
  SCENES as GIT_V2_SCENES,
  getMovieFrames as getGitV2Frames,
} from "./videos/git-commit-push-guide-v2/registry";
import { ClaudeCodeMapPoster } from "./videos/claude-code-map/MapPoster";
import { EP00Master, FPS as MAP_FPS, getEp00Frames } from "./videos/claude-code-map/EP00Master";
import { ThumbEP00 } from "./videos/claude-code-map/ThumbEP00";
import { EP01Master, getEp01Frames } from "./videos/claude-code-map/EP01Master";
import { ThumbEP01 } from "./videos/claude-code-map/ThumbEP01";
import { EP02Master, getEp02Frames } from "./videos/claude-code-map/EP02Master";
import { ThumbEP02 } from "./videos/claude-code-map/ThumbEP02";
import { EP03Master, getEp03Frames } from "./videos/claude-code-map/EP03Master";
import { ThumbEP03 } from "./videos/claude-code-map/ThumbEP03";
import { GENERATED_EPISODES } from "./videos/claude-code-map/generatedEpisodes";
import { Master as InstallMaster } from "./videos/claude-code-install/Master";
import { Poster as InstallPoster } from "./videos/claude-code-install/Poster";
import { FPS as INSTALL_FPS, SCENES as INSTALL_SCENES, getMovieFrames as getInstallFrames } from "./videos/claude-code-install/registry";
import { Master as SkillsMaster } from "./videos/claude-code-skills/Master";
import { Poster as SkillsPoster } from "./videos/claude-code-skills/Poster";
import { FPS as SKILLS_FPS, SCENES as SKILLS_SCENES, getMovieFrames as getSkillsFrames } from "./videos/claude-code-skills/registry";
import { Master as DesktopMaster } from "./videos/claude-desktop-to-cli/Master";
import { Poster as DesktopPoster } from "./videos/claude-desktop-to-cli/Poster";
import { FPS as DESKTOP_FPS, SCENES as DESKTOP_SCENES, getMovieFrames as getDesktopFrames } from "./videos/claude-desktop-to-cli/registry";
import { Master as AasMaster } from "./videos/account-auth-security/Master";
import { Poster as AasPoster } from "./videos/account-auth-security/Poster";
import { FPS as AAS_FPS, SCENES as AAS_SCENES, ALT_SCENES as AAS_ALT_SCENES, getMovieFrames as getAasFrames } from "./videos/account-auth-security/registry";
import { Explainer, explainerFrames } from "./videos/_explainer/Explainer";
import { RoundupReel, roundupReelFrames } from "./videos/_explainer/Reel";
import { RoundupPoster } from "./videos/_explainer/Poster";
import { SlashCover } from "./videos/_explainer/SlashCover";
import { SlashCoverGlass } from "./videos/_explainer/SlashCoverGlass";
import { SlashCoverWhiteGlass } from "./videos/_explainer/SlashCoverWhiteGlass";
import { SlashCoverNeonGlass } from "./videos/_explainer/SlashCoverNeonGlass";
import type { VideoSpec } from "./videos/_explainer/schema";
import localCloudSpec from "./videos/_explainer/specs/local-cloud.json";
import localCloudVo from "./videos/_explainer/specs/local-cloud.vo.json";
import whatsappDebugSpec from "./videos/_explainer/specs/whatsapp-debug.json";
import whatsappDebugVo from "./videos/_explainer/specs/whatsapp-debug.vo.json";
import currentSpec from "./videos/_explainer/specs/current.json";
import currentVo from "./videos/_explainer/specs/current.vo.json";
import roundupCcSpec from "./videos/_explainer/specs/roundup-cc.json";
import roundupCcVo from "./videos/_explainer/specs/roundup-cc.vo.json";
import fbAutopostSpec from "./videos/_explainer/specs/fb-autopost.json";
import fbAutopostVo from "./videos/_explainer/specs/fb-autopost.vo.json";
import { FbAutopostObsidian, FbAutopostThumb, fbObsidianFrames } from "./videos/fb-autopost/Obsidian";
import { ClaudeCodeMdMemoryObsidian, ClaudeCodeMdMemoryThumb, claudeMdMemoryObsidianFrames } from "./videos/claude-code-md-memory/Obsidian";
import { ClaudeCodeAgentViewObsidian, ClaudeCodeAgentViewThumb, claudeCodeAgentViewObsidianFrames } from "./videos/claude-code-agent-view/Obsidian";
import { ClaudeCodeRemoteControlObsidian, ClaudeCodeRemoteControlThumb, claudeCodeRemoteControlObsidianFrames } from "./videos/claude-code-remote-control/Obsidian";
import { AutoCourseEp01Obsidian, AutoCourseEp01Thumb, autoCourseEp01ObsidianFrames } from "./videos/auto-course-ep01/Obsidian";
import { AutoCourseEp01Ch4Test, autoCourseEp01Ch4TestFrames } from "./videos/auto-course-ep01/Ch4Test";
import { AutoCourseEp01Ch5Test, autoCourseEp01Ch5TestFrames } from "./videos/auto-course-ep01/Ch5Test";
import { ExplainerObsidian, explainerObsidianFrames } from "./videos/_explainer/ExplainerObsidian";
import { ExplainerWithGlossary, GlossaryShort, explainerWithGlossaryFrames, glossarySegmentFrames } from "./videos/_explainer/GlossarySegment";
import type { GlossarySpec } from "./videos/_explainer/GlossarySegment";
import currentGlossary from "./videos/_explainer/specs/current.glossary.json";
import currentGlossaryVo from "./videos/_explainer/specs/current.glossary.vo.json";
import { DotfilesStowFull, DotfilesStowGlossaryShort, dotfilesStowFullFrames, glossaryFrames } from "./videos/dotfiles-stow-glossary/Glossary";
import { FbAutopostShort, fbShortFrames } from "./videos/fb-autopost/Short";
import { RemotionAutoVideoObsidian, ravObsidianFrames } from "./videos/remotion-autovideo/Obsidian";
import { RemotionAutoVideoThumb } from "./videos/remotion-autovideo/Thumb";
import { IgAutopostObsidian, IgAutopostThumb, igObsidianFrames } from "./videos/ig-autopost/Obsidian";
import { PinterestObsidian, pinterestObsidianFrames } from "./videos/pinterest-autopost/Obsidian";
import { ShopifyAutolistObsidian, ShopifyAutolistThumb, shopifyObsidianFrames } from "./videos/shopify-autolist/Obsidian";
import { HfVoiceidObsidian, HfVoiceidThumb, hfVoiceidObsidianFrames } from "./videos/hf-voiceid/Obsidian";
import { ShopifyAutolistShort, shopifyShortFrames } from "./videos/shopify-autolist/Short";
import subagentSpec from "./videos/claude-code-subagent/spec.json";
import subagentVo from "./videos/claude-code-subagent/vo.json";
import { SubagentThumbDefault } from "./videos/claude-code-subagent/Thumb";
import {
  ChannelBannerA,
  ChannelBannerB,
  ChannelBannerC,
  ChannelAvatarA,
  ChannelAvatarB,
  ChannelAvatarC,
} from "./videos/channel-branding/Branding";
import { SubagentShort, SubagentWide, SUBAGENT_SHORT_FRAMES } from "./videos/claude-code-subagent/Short";
import { SubagentTutorial, SUBAGENT_TUTORIAL_FRAMES } from "./videos/claude-code-subagent/Tutorial";
import { Sample as LCWSample, sampleFrames } from "./videos/local-cloud-walk/Sample";
import { LocalCloudWalk, masterFrames as lcwMasterFrames } from "./videos/local-cloud-walk/Master";
import { LocalCloudPoster } from "./videos/local-cloud-walk/Poster";
import { SpotSample, spotSampleFrames } from "./videos/local-cloud-walk/SpotSample";
import { SpotMaster, spotMasterFrames } from "./videos/local-cloud-walk/SpotMaster";
import { LocalCloudShort, shortFrames as lcShortFrames } from "./videos/local-cloud-walk/Short";
import { KitchenReel, KITCHEN_FRAMES } from "./videos/kitchen-git-linter-test/Reel";
import { KitchenCover, KitchenCoverWide } from "./videos/kitchen-git-linter-test/Cover";
import { ApiSdkReel, APISDK_FRAMES } from "./videos/kitchen-api-sdk-library/Reel";
import { ApiCover } from "./videos/kitchen-api-sdk-library/Cover";
import { GeminiPoc, GEMINI_POC_FRAMES } from "./videos/gemini-poc/GeminiPoc";
import { AccountAuthSecurityV2, AAS_V2_FRAMES } from "./videos/account-auth-security-v2/AccountAuthSecurityV2";
import { ApiKeyChapter, API_KEY_FRAMES } from "./videos/account-auth-security-v2/ApiKeyChapter";
import { PasswordChapter, PASSWORD_FRAMES } from "./videos/account-auth-security-v2/PasswordChapter";
import { CaptchaChapter, CAPTCHA_FRAMES } from "./videos/account-auth-security-v2/CaptchaChapter";
import { MasterFilm, MASTER_FRAMES } from "./videos/account-auth-security-v2/MasterFilm";
import { AasV2Cover, ChapterCover, CHAPTER_COVERS } from "./videos/account-auth-security-v2/Cover";
import { EpAccessToken, EpApiKey, EpCaptcha, EpPassword, EP02_FRAMES, EP03_FRAMES, EP04_FRAMES, EP05_FRAMES } from "./videos/account-auth-security-v2/EpVideos";
import { HeibuliVsZombies, HEIBULI_VS_ZOMBIES_FRAMES } from "./videos/heibuli-vs-zombies/HeibuliVsZombies";
import { LocalAccessEP06, LOCAL_ACCESS_FRAMES } from "./videos/local-access-advantage/Master";
import { LocalAccessCover } from "./videos/local-access-advantage/Cover";
import { LinkedinAiMakeover, LINKEDIN_MAKEOVER_FRAMES } from "./videos/linkedin-ai-makeover/Master";
import { MakeoverCover } from "./videos/linkedin-ai-makeover/Cover";
import { XhsAutoEP01, XhsAutoPoster, XHS_AUTO_FRAMES } from "./videos/xhs-automation-tutorial/Master";
import { XhsAutoCover } from "./videos/xhs-automation-tutorial/Cover";
import { XhsAutoPackAStill, XhsAutoPackBStill } from "./videos/xhs-automation-tutorial/RealCase";
import { YtUploadEP02, YtUploadPoster, YT_UPLOAD_FRAMES } from "./videos/youtube-upload-ep02/Master";
import { YtUploadCover } from "./videos/youtube-upload-ep02/Cover";
import { ClaudeCodePlanMode, PLAN_MODE_FRAMES } from "./videos/claude-code-plan-mode/Master";
import { PlanModeCover } from "./videos/claude-code-plan-mode/Cover";
import { FaceCamCornerDemo, FaceIntroReelDemo, FACECAM_CORNER_FRAMES, FACE_REEL_FRAMES } from "./videos/facecam-demo/FaceCamDemo";

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
      {/* ── 生活應用 EP03 · 小紅書發文全自動化(EP00 玻璃進化版精修, 16:9, 1920×1080, 30fps;comp id 沿用 XhsAutoEP01) ── */}
      <Folder name="XhsAutoEP01">
        <Composition
          id="XhsAutoEP01"
          component={XhsAutoEP01}
          durationInFrames={XHS_AUTO_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Still id="XhsAutoEP01Cover" component={XhsAutoCover} width={1920} height={1080} />
        <Still id="XhsAutoEP01Poster" component={XhsAutoPoster} width={1920} height={1080} />
        <Still id="XhsAutoPackA" component={XhsAutoPackAStill} width={1920} height={1080} />
        <Still id="XhsAutoPackB" component={XhsAutoPackBStill} width={1920} height={1080} />
      </Folder>

      {/* ── 實戰自動化 EP02 · YouTube 上片全自動化(黑曜石 v3+實錄截圖, 16:9, 1920×1080, 30fps) ── */}
      <Folder name="YtUploadEP02">
        <Composition
          id="YtUploadEP02"
          component={YtUploadEP02}
          durationInFrames={YT_UPLOAD_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Still id="YtUploadEP02Cover" component={YtUploadCover} width={1920} height={1080} />
        <Still id="YtUploadEP02Poster" component={YtUploadPoster} width={1920} height={1080} />
      </Folder>

      {/* ── EP06 本地存取優勢(新手名詞系列) · 本機路徑 vs 雲端(銀玻璃資訊面板風, 16:9, 1920×1080, 30fps) ── */}
      <Folder name="LocalAccessEP06">
        <Composition
          id="LocalAccessEP06"
          component={LocalAccessEP06}
          durationInFrames={LOCAL_ACCESS_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Still id="LocalAccessEP06Cover" component={LocalAccessCover} width={1920} height={1080} />
      </Folder>

      {/* ── 丟一份舊履歷給 AI,LinkedIn/GitHub 全自動翻新(銀玻璃資訊面板風, 16:9, 1920×1080, 30fps) ── */}
      <Folder name="LinkedinAiMakeover">
        <Composition
          id="LinkedinAiMakeover"
          component={LinkedinAiMakeover}
          durationInFrames={LINKEDIN_MAKEOVER_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Still id="LinkedinAiMakeoverCover" component={MakeoverCover} width={1920} height={1080} />
      </Folder>

      {/* ── 新手知道一下比較好的名詞 EP07 · Claude Code Plan Mode(黑曜石高級感精修版, 16:9, 1920×1080, 30fps) ── */}
      <Folder name="ClaudeCodePlanMode">
        <Composition
          id="ClaudeCodePlanMode"
          component={ClaudeCodePlanMode}
          durationInFrames={PLAN_MODE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Still id="ClaudeCodePlanModeCover" component={PlanModeCover} width={1920} height={1080} />
      </Folder>

      {/* ── 老闆露臉合成 demo（2026-07-09 評估用，未定版）：A=教學片角落小窗 B=獨立露臉短片 ── */}
      <Folder name="FaceCamDemo">
        <Composition
          id="FaceCamCornerDemo"
          component={FaceCamCornerDemo}
          durationInFrames={FACECAM_CORNER_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="FaceIntroReelDemo"
          component={FaceIntroReelDemo}
          durationInFrames={FACE_REEL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      {/* ── 帳號授權安全 V2 故事版 · 樣板「房卡=access token」(16:9, 1920×1080, 30fps) ── */}
      <Composition
        id="AccountAuthSecurityV2"
        component={AccountAuthSecurityV2}
        durationInFrames={AAS_V2_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 帳號授權安全 V2 · 第2章「API key=洗衣廠司機」(16:9, 1920×1080, 30fps) ── */}
      <Composition
        id="ApiKeyChapter"
        component={ApiKeyChapter}
        durationInFrames={API_KEY_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 帳號授權安全 V2 · 第3章「密碼=你家的萬能鑰匙」(16:9, 1920×1080, 30fps) ── */}
      <Composition
        id="PasswordChapter"
        component={PasswordChapter}
        durationInFrames={PASSWORD_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 帳號授權安全 V2 · 第4章「CAPTCHA=門口的保安」(16:9, 1920×1080, 30fps) ── */}
      <Composition
        id="CaptchaChapter"
        component={CaptchaChapter}
        durationInFrames={CAPTCHA_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 帳號授權安全 V2 · 完整長片(曉晴頭尾+4章) (16:9, 1920×1080, 30fps) ── */}
      <Composition
        id="AasMasterFilm"
        component={MasterFilm}
        durationInFrames={MASTER_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Google Flow(Veo 3.1) 生 clip 串接 PoC「AI 小幫手」(9:16, 1080×1920, 30fps) ── */}
      <Composition
        id="GeminiPoc"
        component={GeminiPoc}
        durationInFrames={GEMINI_POC_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── 黑布哩｜大戰僵屍王（Flow/Veo 生 11 段串接, 純配樂英雄蒙太奇, 9:16, 1080×1920, 30fps）── */}
      <Composition
        id="HeibuliVsZombies"
        component={HeibuliVsZombies}
        durationInFrames={HEIBULI_VS_ZOMBIES_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── 廚房比喻：Git / Linter / 測試 = 時光機 / 糾察隊 / 試毒官（9:16 情境幽默科普 Short, 1080×1920, 30fps）── */}
      <Composition
        id="KitchenGitLinterTest"
        component={KitchenReel}
        durationInFrames={KITCHEN_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still id="KitchenGitLinterTestCover" component={KitchenCover} width={1080} height={1920} />
      <Still id="KitchenGitLinterTestCoverWide" component={KitchenCoverWide} width={1920} height={1080} />

      {/* ── EP02 餐廳比喻：API / SDK / 函式庫 = 隔窗口點餐 / 料理包 / 現成醬料（9:16 Short, 1080×1920, 30fps）── */}
      <Composition
        id="KitchenApiSdkLibrary"
        component={ApiSdkReel}
        durationInFrames={APISDK_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still id="KitchenApiSdkLibraryCover" component={ApiCover} width={1080} height={1920} />

      {/* ── Claude 本地 vs 雲端 explainer（資料驅動 _explainer + 旁白）(1920×1080, 30fps) ── */}
      <Composition
        id="ClaudeLocalCloud"
        component={Explainer}
        defaultProps={{
          spec: localCloudSpec as unknown as VideoSpec,
          vo: localCloudVo as Record<string, number>,
          voDir: "vo/claude-local-cloud",
        }}
        durationInFrames={explainerFrames(
          localCloudSpec as unknown as VideoSpec,
          localCloudVo as Record<string, number>,
        )}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeLocalCloudPoster" component={LocalCloudPoster} width={1920} height={1080} />

      {/* ── WhatsApp 排查實戰（資料驅動 _explainer + zh-TW-HsiaoChen 旁白）(1920×1080, 30fps) ── */}
      <Composition
        id="WhatsAppDebug"
        component={Explainer}
        defaultProps={{
          spec: whatsappDebugSpec as unknown as VideoSpec,
          vo: whatsappDebugVo as Record<string, number>,
          voDir: "vo/whatsapp-debug",
        }}
        durationInFrames={explainerFrames(
          whatsappDebugSpec as unknown as VideoSpec,
          whatsappDebugVo as Record<string, number>,
        )}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── FB 每天自動發文串接教學（生活應用系列 · 資料驅動 _explainer）(1920×1080, 30fps) ── */}
      <Composition
        id="FbAutopost"
        component={Explainer}
        defaultProps={{
          spec: fbAutopostSpec as unknown as VideoSpec,
          vo: fbAutopostVo as Record<string, number>,
          voDir: "vo/fb-autopost",
        }}
        durationInFrames={explainerFrames(
          fbAutopostSpec as unknown as VideoSpec,
          fbAutopostVo as Record<string, number>,
        )}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── FB 每天自動發文教學 · 黑曜石精修版（生活應用系列）(1920×1080, 30fps) ── */}
      <Composition
        id="FbAutopostObsidian"
        component={FbAutopostObsidian}
        durationInFrames={fbObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="FbAutopostThumb" component={FbAutopostThumb} width={1920} height={1080} />

      {/* ── Claude Code CLAUDE.md 記憶檔教學 · 黑曜石精修版（深度教學系列）(1920×1080, 30fps) ── */}
      <Composition
        id="ClaudeCodeMdMemoryObsidian"
        component={ClaudeCodeMdMemoryObsidian}
        durationInFrames={claudeMdMemoryObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeMdMemoryThumb" component={ClaudeCodeMdMemoryThumb} width={1920} height={1080} />

      {/* ── Claude Code Agent View 背景代理教學 · 黑曜石深度教學版（每日工廠 2026-07-07 選題升級）(1920×1080, 30fps) ── */}
      <Composition
        id="ClaudeCodeAgentViewObsidian"
        component={ClaudeCodeAgentViewObsidian}
        durationInFrames={claudeCodeAgentViewObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeAgentViewThumb" component={ClaudeCodeAgentViewThumb} width={1920} height={1080} />

      {/* ── Claude Code Remote Control 手機遙控教學 · 黑曜石深度教學版（2026-07-08 老闆指定主題）(1920×1080, 30fps) ── */}
      <Composition
        id="ClaudeCodeRemoteControlObsidian"
        component={ClaudeCodeRemoteControlObsidian}
        durationInFrames={claudeCodeRemoteControlObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeRemoteControlThumb" component={ClaudeCodeRemoteControlThumb} width={1920} height={1080} />

      {/* ── 非工程師的 Claude 自動化課 EP01 · 黑曜石旗艦跟操片（2026-07-09 WIP，只有 3/N 場景）(1920×1080, 30fps) ── */}
      <Composition
        id="AutoCourseEp01Obsidian"
        component={AutoCourseEp01Obsidian}
        durationInFrames={autoCourseEp01ObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="AutoCourseEp01Thumb" component={AutoCourseEp01Thumb} width={1920} height={1080} />

      {/* ⚠️ 暫時測試 comp：驗證真人錄影 playbackRate 貼合旁白節奏，老闆確認後可刪 */}
      <Composition
        id="AutoCourseEp01Ch4Test"
        component={AutoCourseEp01Ch4Test}
        durationInFrames={autoCourseEp01Ch4TestFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AutoCourseEp01Ch5Test"
        component={AutoCourseEp01Ch5Test}
        durationInFrames={autoCourseEp01Ch5TestFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="FbAutopostShort"
        component={FbAutopostShort}
        durationInFrames={fbShortFrames()}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Remotion 自動生成影片教學 · 黑曜石（生活應用 EP05 · 教觀眾照做每步給 prompt）(1920×1080, 30fps) ── */}
      <Composition
        id="RemotionAutoVideoObsidian"
        component={RemotionAutoVideoObsidian}
        durationInFrames={ravObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="RemotionAutoVideoThumb" component={RemotionAutoVideoThumb} width={1920} height={1080} />

      {/* ── Pinterest 自動發文引流 · 黑曜石（生活應用系列 · 故事解說片）(1920×1080, 30fps) ── */}
      <Composition
        id="PinterestObsidian"
        component={PinterestObsidian}
        durationInFrames={pinterestObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── IG 每天自動發文教學 · 黑曜石（生活應用系列 EP05）(1920×1080, 30fps) ── */}
      <Composition
        id="IgAutopostObsidian"
        component={IgAutopostObsidian}
        durationInFrames={igObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="IgAutopostThumb" component={IgAutopostThumb} width={1920} height={1080} />

      {/* ── Hugging Face 聽聲音辨識發言人 · 黑曜石（生活應用系列 EP09）(1920×1080, 30fps) ── */}
      <Composition
        id="HfVoiceidObsidian"
        component={HfVoiceidObsidian}
        durationInFrames={hfVoiceidObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="HfVoiceidThumb" component={HfVoiceidThumb} width={1920} height={1080} />

      {/* ── Shopify 一句話自動上架 · 黑曜石（生活應用系列 EP08）(1920×1080, 30fps) ── */}
      <Composition
        id="ShopifyAutolistObsidian"
        component={ShopifyAutolistObsidian}
        durationInFrames={shopifyObsidianFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="ShopifyAutolistThumb" component={ShopifyAutolistThumb} width={1920} height={1080} />
      <Composition
        id="ShopifyAutolistShort"
        component={ShopifyAutolistShort}
        durationInFrames={shopifyShortFrames()}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── 每日影片工廠（資料驅動 ExplainerObsidian 黑曜石皮，每天換 current.json）(1920×1080, 30fps) ──
          2026-07-08 起預設改黑曜石風（原淺色 Explainer 皮仍在，供其他 comp 沿用，未刪）。 */}
      <Composition
        id="VF-Daily"
        component={ExplainerObsidian}
        defaultProps={{
          spec: currentSpec as unknown as VideoSpec,
          vo: currentVo as Record<string, number>,
          voDir: "vo/current",
          bgmSrc: "bgm-piano.mp3",
        }}
        durationInFrames={explainerObsidianFrames(
          currentSpec as unknown as VideoSpec,
          currentVo as Record<string, number>,
        )}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 每日影片工廠（可選）：主片 + 片尾「名詞小教室」一次算成 (1920×1080, 30fps) ──
          資料驅動通用版（_explainer/GlossarySegment.tsx）；名詞段讀 current.glossary.json/.vo，
          terms 為空＝自動退化成純主片。名詞密度高的題目才用（ORCHESTRATOR.md runbook A 步驟 3b）。 */}
      <Composition
        id="VF-DailyFull"
        component={ExplainerWithGlossary}
        defaultProps={{
          spec: currentSpec as unknown as VideoSpec,
          vo: currentVo as Record<string, number>,
          voDir: "vo/current",
          glossary: currentGlossary as unknown as GlossarySpec,
          glossaryVo: currentGlossaryVo as Record<string, number>,
          glossaryVoDir: "vo/current-glossary",
          bgmSrc: "bgm-piano.mp3",
        }}
        durationInFrames={explainerWithGlossaryFrames(
          currentSpec as unknown as VideoSpec,
          currentVo as Record<string, number>,
          currentGlossary as unknown as GlossarySpec,
          currentGlossaryVo as Record<string, number>,
        )}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 名詞小教室 9:16 Short（純片尾段，讀 current.glossary.json）(1080×1920, 30fps) ── */}
      <Composition
        id="VF-DailyGlossaryShort"
        component={GlossaryShort}
        defaultProps={{
          spec: currentGlossary as unknown as GlossarySpec,
          vo: currentGlossaryVo as Record<string, number>,
          voDir: "vo/current-glossary",
          bgmSrc: "bgm-piano.mp3",
        }}
        durationInFrames={glossarySegmentFrames(
          currentGlossary as unknown as GlossarySpec,
          currentGlossaryVo as Record<string, number>,
        )}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── 今日 dotfiles/GNU Stow 片：主片 + 片尾「名詞小教室」一次算成 (1920×1080, 30fps) ──
          內建重算、不動每日工廠共用模板；主片讀 current.json/current.vo，片尾為手刻 GlossarySegment。 */}
      <Composition
        id="DotfilesStowFull"
        component={DotfilesStowFull}
        defaultProps={{
          spec: currentSpec as unknown as VideoSpec,
          vo: currentVo as Record<string, number>,
          bgmSrc: "bgm-piano.mp3",
        }}
        durationInFrames={dotfilesStowFullFrames(
          currentSpec as unknown as VideoSpec,
          currentVo as Record<string, number>,
        )}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 名詞小教室 9:16 Short（純片尾段）(1080×1920, 30fps) ── */}
      <Composition
        id="DotfilesStowGlossaryShort"
        component={DotfilesStowGlossaryShort}
        defaultProps={{ bgmSrc: "bgm-piano.mp3" }}
        durationInFrames={glossaryFrames()}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── 工具盤點卡：Claude Code 這 6 招就夠（資料驅動 _explainer + spotlight 場景）(1920×1080, 30fps) ── */}
      <Composition
        id="RoundupClaudeCode"
        component={Explainer}
        defaultProps={{
          spec: roundupCcSpec as unknown as VideoSpec,
          vo: roundupCcVo as Record<string, number>,
          voDir: "vo/roundup-cc",
        }}
        durationInFrames={explainerFrames(
          roundupCcSpec as unknown as VideoSpec,
          roundupCcVo as Record<string, number>,
        )}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 工具盤點卡 9:16 直幅原生 Reel（同 spec/VO，滿版卡片）(1080×1920, 30fps) ── */}
      <Composition
        id="RoundupClaudeCodeReel"
        component={RoundupReel}
        defaultProps={{
          spec: roundupCcSpec as unknown as VideoSpec,
          vo: roundupCcVo as Record<string, number>,
          voDir: "vo/roundup-cc",
        }}
        durationInFrames={roundupReelFrames(
          roundupCcSpec as unknown as VideoSpec,
          roundupCcVo as Record<string, number>,
        )}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── 自訂指令故事片 封面（EP00 公式，靜態 Still）── */}
      <Still id="SlashCover" component={SlashCover} width={1920} height={1080} />
      <Still id="SlashCoverGlass" component={SlashCoverGlass} width={1920} height={1080} />
      <Still id="SlashCoverWhiteGlass" component={SlashCoverWhiteGlass} width={1920} height={1080} />
      <Still id="SlashCoverNeonGlass" component={SlashCoverNeonGlass} width={1920} height={1080} />

      {/* ── 頻道識別重設計 2026-07：三版 banner + avatar（靜態 Still）── */}
      <Folder name="channel-branding">
        <Still id="ChannelBannerA" component={ChannelBannerA} width={2560} height={1440} />
        <Still id="ChannelBannerB" component={ChannelBannerB} width={2560} height={1440} />
        <Still id="ChannelBannerC" component={ChannelBannerC} width={2560} height={1440} />
        <Still id="ChannelAvatarA" component={ChannelAvatarA} width={800} height={800} />
        <Still id="ChannelAvatarB" component={ChannelAvatarB} width={800} height={800} />
        <Still id="ChannelAvatarC" component={ChannelAvatarC} width={800} height={800} />
      </Folder>

      {/* ── 工具盤點卡 封面 / 縮圖（影片同款索引封面，靜態 Still）── */}
      <Still
        id="RoundupClaudeCodePoster"
        component={RoundupPoster}
        defaultProps={{ spec: roundupCcSpec as unknown as VideoSpec, variant: "wide" as const }}
        width={1920}
        height={1080}
      />
      <Still
        id="RoundupClaudeCodePosterReel"
        component={RoundupPoster}
        defaultProps={{ spec: roundupCcSpec as unknown as VideoSpec, variant: "reel" as const }}
        width={1080}
        height={1920}
      />

      {/* ── 風格 B 打樣：Claude Code subagent（資料驅動 _explainer + 風格B封面）(1920×1080, 30fps) ── */}
      <Composition
        id="ClaudeCodeSubagent"
        component={Explainer}
        defaultProps={{
          spec: subagentSpec as unknown as VideoSpec,
          vo: subagentVo as Record<string, number>,
          voDir: "vo/claude-code-subagent",
        }}
        durationInFrames={explainerFrames(
          subagentSpec as unknown as VideoSpec,
          subagentVo as Record<string, number>,
        )}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeSubagentThumb" component={SubagentThumbDefault} width={1280} height={720} />
      <Composition
        id="SubagentShort"
        component={SubagentShort}
        durationInFrames={SUBAGENT_SHORT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SubagentWide"
        component={SubagentWide}
        durationInFrames={SUBAGENT_SHORT_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SubagentTutorial"
        component={SubagentTutorial}
        durationInFrames={SUBAGENT_TUTORIAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── 樣板：local-cloud-walk（真圖縮放+發亮，深色，沿用 v1 旁白）── */}
      <Composition id="LCWSample" component={LCWSample} durationInFrames={sampleFrames()} fps={30} width={1920} height={1080} />
      {/* ── v3 樣板：淺色 + 瞬切放大 + 聚光 + 大標 ── */}
      <Composition id="LCWSpot" component={SpotSample} durationInFrames={spotSampleFrames()} fps={30} width={1920} height={1080} />
      <Composition id="LocalCloudWalkV4" component={SpotMaster} durationInFrames={spotMasterFrames()} fps={30} width={1920} height={1080} />
      <Composition id="LocalCloudShort" component={LocalCloudShort} durationInFrames={lcShortFrames()} fps={30} width={1080} height={1920} />
      {/* ── v2 完整片：真圖縮放+發亮 + 雙人對話結尾（深色，16:9）── */}
      <Composition id="LocalCloudWalk" component={LocalCloudWalk} durationInFrames={lcwMasterFrames()} fps={30} width={1920} height={1080} />

      {/* ── Claude Code 經驗系列(重建)：安裝 / Skills / 桌面版→CLI (1920×1080, 30fps) ── */}
      <Composition
        id="ClaudeCodeInstall"
        component={InstallMaster}
        durationInFrames={getInstallFrames()}
        fps={INSTALL_FPS}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeInstallPoster" component={InstallPoster} width={1920} height={1080} />
      <Folder name="ClaudeCodeInstall-Scenes">
        {INSTALL_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`CI-${s.id}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={INSTALL_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      <Composition
        id="ClaudeCodeSkills"
        component={SkillsMaster}
        durationInFrames={getSkillsFrames()}
        fps={SKILLS_FPS}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeSkillsPoster" component={SkillsPoster} width={1920} height={1080} />
      <Folder name="ClaudeCodeSkills-Scenes">
        {SKILLS_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`CS-${s.id}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={SKILLS_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      <Composition
        id="ClaudeDesktopToCli"
        component={DesktopMaster}
        durationInFrames={getDesktopFrames()}
        fps={DESKTOP_FPS}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeDesktopToCliPoster" component={DesktopPoster} width={1920} height={1080} />
      <Folder name="ClaudeDesktopToCli-Scenes">
        {DESKTOP_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`CD-${s.id}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={DESKTOP_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── 帳號授權安全 · 鑰匙比喻(逐字解說, 16:9, 30fps) ── */}
      <Composition
        id="AccountAuthSecurity"
        component={AasMaster}
        durationInFrames={getAasFrames()}
        fps={AAS_FPS}
        width={1920}
        height={1080}
      />
      <Still id="AccountAuthSecurityPoster" component={AasPoster} width={1920} height={1080} />
      <Still id="AasV2Cover" component={AasV2Cover} width={1920} height={1080} />
      <Composition id="AasChCover1" component={() => <ChapterCover {...CHAPTER_COVERS[0]} />} durationInFrames={90} fps={30} width={1920} height={1080} />
      <Composition id="AasChCover3" component={() => <ChapterCover {...CHAPTER_COVERS[2]} />} durationInFrames={90} fps={30} width={1920} height={1080} />
      {/* 新手名詞系列 EP02–EP05(4 章切單支;16:9) */}
      <Composition id="AasEp02" component={EpAccessToken} durationInFrames={EP02_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="AasEp03" component={EpApiKey} durationInFrames={EP03_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="AasEp04" component={EpCaptcha} durationInFrames={EP04_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="AasEp05" component={EpPassword} durationInFrames={EP05_FRAMES} fps={30} width={1920} height={1080} />
      <Folder name="AccountAuthSecurity-Scenes">
        {[...AAS_SCENES, ...AAS_ALT_SCENES].map((s) => (
          <Composition
            key={s.id}
            id={`AAS-${s.id}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={AAS_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── Claude Code 新手知識地圖系列 · EP00 總覽(橫式 16:9)+ 海報 ── */}
      <Composition
        id="ClaudeCodeMapEP00"
        component={EP00Master}
        durationInFrames={getEp00Frames()}
        fps={MAP_FPS}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeMapPoster" component={ClaudeCodeMapPoster} width={2200} height={1400} />
      <Still id="ClaudeCodeMapEP00Thumb" component={ThumbEP00} width={1280} height={720} />

      {/* EP01 · Claude Code 是什麼(橫式 16:9) */}
      <Composition
        id="ClaudeCodeMapEP01"
        component={EP01Master}
        durationInFrames={getEp01Frames()}
        fps={MAP_FPS}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeMapEP01Thumb" component={ThumbEP01} width={1280} height={720} />

      {/* EP02 · 代理迴圈(橫式 16:9) */}
      <Composition
        id="ClaudeCodeMapEP02"
        component={EP02Master}
        durationInFrames={getEp02Frames()}
        fps={MAP_FPS}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeMapEP02Thumb" component={ThumbEP02} width={1280} height={720} />

      {/* EP03 · 在哪裡用(橫式 16:9) */}
      <Composition
        id="ClaudeCodeMapEP03"
        component={EP03Master}
        durationInFrames={getEp03Frames()}
        fps={MAP_FPS}
        width={1920}
        height={1080}
      />
      <Still id="ClaudeCodeMapEP03Thumb" component={ThumbEP03} width={1280} height={720} />

      {/* EP04–EP30 · 自動產生(NodeEpisode 引擎),橫式 16:9 + 縮圖 */}
      {GENERATED_EPISODES.map((e) => (
        <React.Fragment key={e.id}>
          <Composition id={e.id} component={e.Comp} durationInFrames={e.getFrames()} fps={MAP_FPS} width={1920} height={1080} />
          <Still id={e.thumbId} component={e.Thumb} width={1280} height={720} />
        </React.Fragment>
      ))}

      {/* ── Newest: Git commit 與 push 新手指南 — 新手向教學 (1920×1080, 30fps) ── */}
      <Composition
        id="GitCommitPushGuide"
        component={GitMaster}
        durationInFrames={getGitFrames()}
        fps={GIT_FPS}
        width={1920}
        height={1080}
      />
      <Still id="GitCommitPushGuidePoster" component={GitPoster} width={1920} height={1080} />
      <Folder name="GitGuide-Scenes">
        {GIT_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`GG-${s.id}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={GIT_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── v2: Git 新手指南（＋Roadmap 全集地圖 ＋ 💎PromptGem 挖寶段）— 另開一支，上面原版不動 ── */}
      <Composition
        id="GitCommitPushGuideV2"
        component={GitV2Master}
        durationInFrames={getGitV2Frames()}
        fps={GIT_V2_FPS}
        width={1920}
        height={1080}
      />
      <Still id="GitCommitPushGuideV2Poster" component={GitV2Poster} width={1920} height={1080} />
      <Folder name="GitGuideV2-Scenes">
        {GIT_V2_SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`GG2-${s.id}`}
            component={s.Component}
            durationInFrames={s.durationInFrames}
            fps={GIT_V2_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>

      {/* ── 旅遊照片 reel(9:16, 30fps)— 一個 TripReel 套所有旅程(金澤/富山/新潟/大阪/京都/犬山) ── */}
      <Folder name="Trip-Reels">
        {TRIP_REELS.map((r) => (
          <Composition
            key={r.id}
            id={r.id}
            component={TripReel}
            schema={tripReelSchema}
            defaultProps={r.cfg}
            calculateMetadata={calculateTripReelMetadata}
            durationInFrames={reelFrames(r.cfg)}
            fps={TRIP_FPS}
            width={1080}
            height={1920}
          />
        ))}
      </Folder>

      {/* ── 小紅書 3:4 封面(1080×1440 Still)— 一個 XhsCover 套所有景點 ── */}
      <Folder name="Xhs-Covers">
        {XHS_COVERS.map((c) => (
          <Still
            key={c.id}
            id={c.id}
            component={XhsCover}
            schema={xhsCoverSchema}
            defaultProps={c.cfg}
            width={COVER_W}
            height={COVER_H}
          />
        ))}
      </Folder>

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
