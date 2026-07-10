#!/usr/bin/env node
// 把 VO-SCRIPT.md 的逐句旁白（"- <id> <text>"）解析成 spec.json 的 script 欄位。
// 用法：node scripts/vo-md-to-spec.mjs <VO-SCRIPT.md> <spec.json>
// 只解析「## 統計與備註」之前的內容，避免誤吃備註段裡「- c3-04 的...」這類引用句。
// 去除每句開頭的（畫面備註）與粗體 ** 記號，因為那些不進旁白/字幕。
import fs from "node:fs";

const [, , mdPath, specPath] = process.argv;
const md = fs.readFileSync(mdPath, "utf8");
const body = md.split(/^## 統計與備註/m)[0];

const script = {};
for (const line of body.split("\n")) {
  const m = line.match(/^- ([a-z][a-z0-9-]*) (.+)$/);
  if (!m) continue;
  let [, id, text] = m;
  text = text.replace(/^（[^）]*）\s*/, "").replace(/\*\*/g, "").trim();
  if (!text) continue;
  script[id] = text;
}

const spec = fs.existsSync(specPath) ? JSON.parse(fs.readFileSync(specPath, "utf8")) : {};
spec.script = script;
fs.writeFileSync(specPath, JSON.stringify(spec, null, 2) + "\n");
console.log(`已解析 ${Object.keys(script).length} 句旁白 → ${specPath}`);
