/**
 * On-screen identity for the Auto-Upload tutorial (the YouTube Data API
 * storyboard). Kept separate from AutoLine's BRAND so the two videos in this
 * repo each keep their own wordmark. Hero renders as `<pre><post>` with `post`
 * accent-colored, e.g. Auto·Upload.
 */
export const UPLOAD_BRAND = {
  pre: "Auto",
  post: "Upload",
  name: "AutoUpload",
  course: "YOUTUBE API",
  hero: ["SET UP ONCE,", "AUTO-UPLOAD FOREVER"] as const,
  tagline: "From email → script → a public YouTube video. Zero manual steps.",
};
