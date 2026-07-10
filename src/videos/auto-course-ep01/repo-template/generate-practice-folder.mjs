#!/usr/bin/env node
// EP01 練習資料夾產生器 — 跟著「非工程師的 Claude 自動化課 EP01」操作用
// 用法：node generate-practice-folder.mjs [目標資料夾路徑]（預設 ./claude-練習）
import fs from "node:fs";
import path from "node:path";

const target = process.argv[2] || "./claude-練習";

// 1x1 透明 PNG / 1x1 白色 JPEG，讓截圖類檔案在 Finder 也能出縮圖
const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);
const JPEG_1PX = Buffer.from(
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAAA//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==",
  "base64"
);

const categories = [
  {
    // Mac 螢幕截圖命名慣例
    files: Array.from({ length: 18 }, (_, i) => {
      const day = String(1 + (i % 28)).padStart(2, "0");
      const month = String(1 + (i % 12)).padStart(2, "0");
      const hour = 8 + (i % 10);
      const ampm = hour < 12 ? "上午" : "下午";
      const min = String((i * 7) % 60).padStart(2, "0");
      const sec = String((i * 13) % 60).padStart(2, "0");
      return `螢幕截圖 2026-${month}-${day} ${ampm}${hour % 12 || 12}.${min}.${sec}.png`;
    }),
    content: PNG_1PX,
  },
  {
    // 手機照片
    files: Array.from({ length: 16 }, (_, i) => `IMG_${4801 + i}.jpg`),
    content: JPEG_1PX,
  },
  {
    files: [
      "季度報告_Q1.docx", "會議紀錄_0312.pdf", "專案提案.docx", "使用手冊v2.pdf",
      "履歷_更新版.docx", "租賃合約.pdf", "讀書會筆記.docx", "產品規格書.pdf",
      "教學講義.docx", "保固說明.pdf", "課程大綱.docx", "銀行對帳單.pdf",
      "旅遊行程規劃.docx", "論文草稿_v3.pdf",
    ],
  },
  {
    files: [
      "發票_台灣大哥大_0421.pdf", "發票_中華電信_0518.pdf", "Amazon_Receipt_20260315.pdf",
      "發票_全聯_0602.pdf", "發票_7-11_0610.pdf", "Uber_Receipt_20260228.pdf",
      "發票_誠品書店_0115.pdf", "PChome_訂單明細.pdf", "發票_家樂福_0722.pdf",
      "Netflix_Invoice_202606.pdf",
    ],
  },
  {
    files: [
      "產品發表簡報.pptx", "季度檢討.pptx", "教育訓練投影片.pptx",
      "客戶提案簡報.pptx", "年度回顧.pptx",
    ],
  },
  {
    files: [
      "記帳本_2026.xlsx", "客戶名單.xlsx", "專案時程表.xlsx", "預算規劃.csv",
      "銷售數據_Q2.xlsx", "團隊分工表.xlsx", "庫存清單.csv", "出差費用結算.xlsx",
    ],
  },
  {
    files: ["生日派對.mp4", "產品Demo.mp4", "會議錄影_0409.mp4", "教學片段_剪輯前.mp4"],
  },
  {
    files: ["專案素材.zip", "舊照片備份.zip", "客戶提供資料.zip", "網站原始碼.zip"],
  },
  {
    files: [
      "ChromeInstaller.dmg", "待辦清單.txt", "雜項筆記.txt", "Zoom.dmg",
      "讀書心得.txt", "待整理.txt", "草稿.txt", "TODO.txt",
    ],
  },
];

fs.mkdirSync(target, { recursive: true });

let count = 0;
for (const cat of categories) {
  for (const name of cat.files) {
    fs.writeFileSync(path.join(target, name), cat.content ?? "");
    count++;
  }
}

console.log(`已在「${target}」產生 ${count} 個練習檔案。`);
console.log(`接下來對 Claude 說：「這個資料夾裡有哪些檔案？幫我照類型分類概述一下。」`);
