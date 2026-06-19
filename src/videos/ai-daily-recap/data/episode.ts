/**
 * The first real episode the pipeline produced — previewed in Section 4 (schema)
 * and Section 8 (showcase). Shape mirrors public/episode.json; `color` values are
 * keys into COLORS.hi (used for the progress-bar highlight markers).
 */
export type Highlight = { atSecond: number; label: string; color: string };
export type EpisodeCaption = { atSecond: number; text: string };
export type Stat = { label: string; value: string };

export type Episode = {
  day: string;
  date: string;
  title: string;
  subtitle: string;
  recordingDuration: number;
  highlights: Highlight[];
  captions: EpisodeCaption[];
  stats: Stat[];
};

export const EPISODE: Episode = {
  day: "001",
  date: "2026-05-30",
  title: "峻清書畫 × AI 自動發文 直播實錄",
  subtitle: "上傳一張畫作，AI 產出中英雙語文案並排程發佈到 Facebook",
  recordingDuration: 600, // ~10 min of raw footage
  highlights: [
    { atSecond: 40, label: "畫作上傳", color: "blue" },
    { atSecond: 180, label: "AI 文案", color: "violet" },
    { atSecond: 360, label: "中英雙語", color: "emerald" },
    { atSecond: 520, label: "FB 排程", color: "amber" },
  ],
  captions: [
    { atSecond: 0, text: "今天上傳老師的一幅新作。" },
    { atSecond: 180, text: "Claude 讀圖，寫出中英雙語貼文。" },
    { atSecond: 360, text: "自動帶上主題標籤與連結。" },
    { atSecond: 520, text: "一鍵排程，發佈到粉絲專頁。" },
  ],
  stats: [
    { label: "自動語音", value: "19 段" },
    { label: "影片長度", value: "約 10 分鐘" },
    { label: "手動剪輯", value: "0 分鐘" },
    { label: "輸出格式", value: "16:9 + 9:16" },
  ],
};
