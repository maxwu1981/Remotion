import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { appearUp } from "../../../shared-skills/anim";
import { FolderIcon } from "./icons";
import { EXT_COLOR } from "./nodes";

export type TreeRow = {
  name: string;
  depth: number;
  kind: "folder" | "file";
  note?: string;
};

const extOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

const MiniFile: React.FC<{ name: string }> = ({ name }) => {
  const color = EXT_COLOR[extOf(name)] ?? COLORS.muted;
  return (
    <svg width={16} height={20} viewBox="0 0 16 20">
      <path
        d="M2 1h8l4 4v13a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z"
        fill="#fff"
        stroke={COLORS.borderStrong}
        strokeWidth={1.3}
      />
      <rect x="1" y="12.5" width="14" height="4.5" rx="1" fill={color} />
    </svg>
  );
};

export const FileTree: React.FC<{
  rows: TreeRow[];
  title?: string;
  startFrame?: number;
  perRow?: number;
  activeRows?: number[];
  activeColor?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({
  rows,
  title = "autorecap",
  startFrame = 0,
  perRow = 3,
  activeRows = [],
  activeColor = COLORS.remotion,
  width = 620,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width,
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOW.lg,
        overflow: "hidden",
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
          background: COLORS.surfaceAlt,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <FolderIcon size={18} color={COLORS.remotion} />
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: TYPE.tiny,
            fontWeight: 700,
            color: COLORS.inkSoft,
          }}
        >
          {title}/
        </span>
      </div>

      <div style={{ padding: "12px 0" }}>
        {rows.map((row, i) => {
          const at = startFrame + i * perRow;
          const anim = appearUp(frame, at, 10, 8);
          const active = activeRows.includes(i);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 18px",
                paddingLeft: 18 + row.depth * 30,
                background: active ? `${activeColor}14` : "transparent",
                borderLeft: active
                  ? `3px solid ${activeColor}`
                  : "3px solid transparent",
                ...anim,
              }}
            >
              {row.kind === "folder" ? (
                <FolderIcon size={18} color={COLORS.remotion} />
              ) : (
                <MiniFile name={row.name} />
              )}
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: TYPE.small,
                  fontWeight: row.kind === "folder" ? 700 : 500,
                  color: row.kind === "folder" ? COLORS.ink : COLORS.inkSoft,
                }}
              >
                {row.name}
                {row.kind === "folder" ? "/" : ""}
              </span>
              {row.note ? (
                <span
                  style={{
                    fontFamily: FONT.ui,
                    fontSize: TYPE.micro,
                    color: active ? activeColor : COLORS.faint,
                    marginLeft: 4,
                    fontWeight: 600,
                  }}
                >
                  {row.note}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
