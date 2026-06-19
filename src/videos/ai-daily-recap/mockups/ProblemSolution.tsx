import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearScale, appearUp, enter } from "../../../shared-skills/anim";
import { ArrowIcon, CheckIcon, CrossIcon } from "./icons";

const Side: React.FC<{
  kind: "problem" | "solution";
  title: string;
  detail?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ kind, title, detail, style }) => {
  const isProblem = kind === "problem";
  const color = isProblem ? COLORS.error : COLORS.success;
  const bg = isProblem ? COLORS.errorBg : COLORS.successBg;
  return (
    <div
      style={{
        width: 560,
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderTop: `4px solid ${color}`,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOW.md,
        padding: 26,
        ...style,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          padding: "6px 14px",
          borderRadius: RADIUS.pill,
          background: bg,
          color,
          fontFamily: FONT.ui,
          fontWeight: 700,
          fontSize: TYPE.tiny,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isProblem ? (
            <CrossIcon size={14} color="#fff" />
          ) : (
            <CheckIcon size={14} color="#fff" />
          )}
        </span>
        {isProblem ? "PROBLEM" : "SOLUTION"}
      </div>
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 700,
          fontSize: TYPE.body,
          color: COLORS.ink,
          lineHeight: 1.35,
          marginBottom: detail ? 18 : 0,
        }}
      >
        {title}
      </div>
      {detail}
    </div>
  );
};

/**
 * A single before/after fix for Section 7. Problem card slides in, an arrow
 * draws, then the solution pops — all from the beat's local frame.
 */
export const ProblemSolution: React.FC<{
  problemTitle: string;
  solutionTitle: string;
  problemDetail?: React.ReactNode;
  solutionDetail?: React.ReactNode;
}> = ({ problemTitle, solutionTitle, problemDetail, solutionDetail }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        justifyContent: "center",
      }}
    >
      <div style={appearUp(frame, 6, 16, 30)}>
        <Side kind="problem" title={problemTitle} detail={problemDetail} />
      </div>
      <div
        style={{
          opacity: enter(frame, 26, 12),
          color: COLORS.muted,
          transform: `scale(${0.8 + enter(frame, 26, 12) * 0.2})`,
        }}
      >
        <ArrowIcon size={52} color={COLORS.faint} strokeWidth={2.4} />
      </div>
      <div style={appearScale(frame, 34, 20, 0.9)}>
        <Side kind="solution" title={solutionTitle} detail={solutionDetail} />
      </div>
    </div>
  );
};

/** A small monospace code chip, handy as a Problem/Solution detail. */
export const CodePill: React.FC<{
  text: string;
  tone?: "bad" | "good" | "neutral";
}> = ({ text, tone = "neutral" }) => {
  const color =
    tone === "bad"
      ? COLORS.error
      : tone === "good"
        ? COLORS.success
        : COLORS.inkSoft;
  const bg =
    tone === "bad"
      ? COLORS.errorBg
      : tone === "good"
        ? COLORS.successBg
        : COLORS.surfaceAlt;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT.mono,
        fontSize: TYPE.small,
        fontWeight: 600,
        color,
        background: bg,
        border: `1px solid ${color}33`,
        borderRadius: 8,
        padding: "7px 13px",
      }}
    >
      {text}
    </span>
  );
};
