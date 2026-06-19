/**
 * TTS tools, from remotion_tts_data.json. Scores/metrics are kept exactly as in
 * the source; tags + descriptions are the English copy for this video, plus a
 * "for whom" one-liner and a brand accent used by the cards/charts.
 */
import { COLORS } from "../../shared-skills/theme";

export type Metrics = {
  naturalness: number;
  emotion: number;
  speed: number;
  costEfficiency: number;
};

export type Tool = {
  id: string;
  name: string;
  mosScore: number;
  overallScore: number;
  metrics: Metrics;
  tags: string[];
  description: string;
  forWhom: string;
  caveat: string;
  price: string; // short, for the comparison table
  priceNote: string; // full detail, for the deep-dive callout
  emoji: string;
  color: string;
};

/** Axis order used by the radar chart (label + key into Metrics, value 0–100). */
export const RADAR_AXES: { label: string; key: keyof Metrics }[] = [
  { label: "Natural", key: "naturalness" },
  { label: "Emotion", key: "emotion" },
  { label: "Speed", key: "speed" },
  { label: "Value", key: "costEfficiency" },
];

export const TOOLS: Record<string, Tool> = {
  elevenlabs: {
    id: "elevenlabs",
    name: "ElevenLabs",
    mosScore: 4.8,
    overallScore: 95,
    metrics: { naturalness: 96, emotion: 98, speed: 75, costEfficiency: 30 },
    tags: ["Industry standard", "Ultra-realistic", "Pricey"],
    description: "The industry benchmark — ultra-realistic for premium content, nailing every emotion, even shouts.",
    forWhom: "Max quality, budget OK",
    caveat: "Pay-per-character — gets pricey at scale.",
    price: "≈ $0.22 / 1K",
    priceNote: "Subscription from $5/mo — roughly $0.15–0.30 per 1,000 characters.",
    emoji: "👑",
    color: COLORS.hi.violet,
  },
  chattts: {
    id: "chattts",
    name: "ChatTTS",
    mosScore: 4.7,
    overallScore: 92,
    metrics: { naturalness: 94, emotion: 100, speed: 60, costEfficiency: 100 },
    tags: ["Open-source", "Dialogue specialist", "Laughs & breathing"],
    description: "Best for dialogue & podcasts — built-in breathing and laughter. Open-source, but you self-host.",
    forWhom: "Podcasts & dialogue",
    caveat: "Open-source — you self-host (Python, a GPU helps).",
    price: "Free*",
    priceNote: "Open-source & free — you only pay for your own GPU / compute.",
    emoji: "🎙️",
    color: COLORS.hi.emerald,
  },
  openaitts: {
    id: "openaitts",
    name: "OpenAI TTS",
    mosScore: 4.5,
    overallScore: 88,
    metrics: { naturalness: 90, emotion: 85, speed: 90, costEfficiency: 60 },
    tags: ["API favorite", "Clean & smooth", "Pay-as-you-go"],
    description: "Stable and low-latency with a clean, smooth voice — the go-to for API integrations.",
    forWhom: "Developers & automation",
    caveat: "Pay-as-you-go API — cheap, but not free.",
    price: "$0.015 / 1K",
    priceNote: "Pay-as-you-go: $15 per 1,000,000 characters (tts-1).",
    emoji: "👨‍💻",
    color: "#10A37F",
  },
  edgetts: {
    id: "edgetts",
    name: "Edge-TTS",
    mosScore: 4.2,
    overallScore: 85,
    metrics: { naturalness: 84, emotion: 70, speed: 95, costEfficiency: 100 },
    tags: ["Completely free", "Best value", "Microsoft tech"],
    description: "The king of free — unbeatable value for mass production, with a slight news-anchor tone.",
    forWhom: "Free, at scale",
    caveat: "Unofficial & free — slight news-anchor tone.",
    price: "Free",
    priceNote: "Completely free — unofficial use of Edge's read-aloud voices.",
    emoji: "💰",
    color: COLORS.remotion,
  },
  macsiri: {
    id: "macsiri",
    name: "Mac Siri",
    mosScore: 3.0,
    overallScore: 60,
    metrics: { naturalness: 60, emotion: 40, speed: 100, costEfficiency: 90 },
    tags: ["On-device", "Zero latency", "Robotic"],
    description: "A personal reading aid only — too robotic and stiff for public videos.",
    forWhom: "Don't — for videos",
    caveat: "Proofreading only — never publish with it.",
    price: "Free",
    priceNote: "Built into macOS — no cost at all.",
    emoji: "🚫",
    color: COLORS.muted,
  },
};

/** Highest → lowest overall score (used for the recap/cheat-sheet). */
export const TOOLS_RANKED: Tool[] = [
  TOOLS.elevenlabs,
  TOOLS.chattts,
  TOOLS.openaitts,
  TOOLS.edgetts,
  TOOLS.macsiri,
];
