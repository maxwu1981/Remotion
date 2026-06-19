import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";

type Token = { t: string; c: string };

const C = COLORS.code;

const tokenizeJson = (line: string): Token[] => {
  const re =
    /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(-?\d+\.?\d*)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])|(\s+)|(.)/g;
  const out: Token[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m[1]) out.push({ t: m[1], c: C.key });
    else if (m[2]) out.push({ t: m[2], c: C.string });
    else if (m[3]) out.push({ t: m[3], c: C.number });
    else if (m[4]) out.push({ t: m[4], c: C.keyword });
    else if (m[5]) out.push({ t: m[5], c: C.punct });
    else if (m[6]) out.push({ t: m[6], c: C.text });
    else out.push({ t: m[7], c: C.text });
  }
  return out;
};

const tokenizePy = (line: string): Token[] => {
  const re =
    /(#.*$)|(\b(?:import|from|def|return|for|in|if|elif|else|with|as|while|class|and|or|not|lambda)\b)|(\b(?:None|True|False)\b)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(-?\d+\.?\d*)|([A-Za-z_]\w*(?=\())|([{}()[\],:.=+\-*/])|(\s+)|(.)/g;
  const out: Token[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m[1]) out.push({ t: m[1], c: C.comment });
    else if (m[2]) out.push({ t: m[2], c: C.keyword });
    else if (m[3]) out.push({ t: m[3], c: C.number });
    else if (m[4]) out.push({ t: m[4], c: C.string });
    else if (m[5]) out.push({ t: m[5], c: C.number });
    else if (m[6]) out.push({ t: m[6], c: C.func });
    else if (m[7]) out.push({ t: m[7], c: C.punct });
    else if (m[8]) out.push({ t: m[8], c: C.text });
    else out.push({ t: m[9], c: C.text });
  }
  return out;
};

export const CodeBlock: React.FC<{
  code: string;
  language?: "json" | "py" | "plain";
  filename?: string;
  dotColor?: string;
  startFrame?: number;
  perLine?: number;
  reveal?: boolean;
  activeLines?: number[];
  activeColor?: string;
  width?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({
  code,
  language = "json",
  filename = "episode.json",
  dotColor = COLORS.hi.amber,
  startFrame = 0,
  perLine = 4,
  reveal = true,
  activeLines = [],
  activeColor = COLORS.remotion,
  width = 760,
  fontSize = TYPE.small,
  style,
}) => {
  const frame = useCurrentFrame();
  const lines = code.replace(/\n$/, "").split("\n");
  const tokenize =
    language === "json"
      ? tokenizeJson
      : language === "py"
        ? tokenizePy
        : (l: string): Token[] => [{ t: l, c: C.text }];

  return (
    <div
      style={{
        width,
        background: C.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOW.lg,
        overflow: "hidden",
        fontFamily: FONT.mono,
        ...style,
      }}
    >
      <div
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          background: C.panel,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: dotColor,
          }}
        />
        <span
          style={{
            fontSize: TYPE.tiny,
            fontWeight: 600,
            color: COLORS.muted,
          }}
        >
          {filename}
        </span>
      </div>

      <div style={{ padding: "18px 0" }}>
        {lines.map((line, i) => {
          const at = startFrame + i * perLine;
          const anim = reveal
            ? appearUp(frame, at, 12, 10)
            : { opacity: 1, transform: "none" };
          const isActive = activeLines.includes(i);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                padding: "1px 22px",
                background: isActive ? `${activeColor}14` : "transparent",
                borderLeft: isActive
                  ? `3px solid ${activeColor}`
                  : "3px solid transparent",
                ...anim,
              }}
            >
              <span
                style={{
                  width: 26,
                  flexShrink: 0,
                  textAlign: "right",
                  marginRight: 18,
                  fontSize: TYPE.micro,
                  color: C.gutter,
                  userSelect: "none",
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize,
                  lineHeight: 1.75,
                  whiteSpace: "pre",
                }}
              >
                {tokenize(line).map((tok, j) => (
                  <span key={j} style={{ color: tok.c }}>
                    {tok.t}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
