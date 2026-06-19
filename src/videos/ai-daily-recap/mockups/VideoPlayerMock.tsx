import React from "react";
import { COLORS, FONT, RADIUS, SHADOW, TYPE } from "../../../shared-skills/theme";
import { PlayIcon } from "./icons";
import type { Highlight } from "../data/episode";

const hiColor = (key: string) => COLORS.hi[key] ?? COLORS.remotion;

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export const VideoPlayerMock: React.FC<{
  width?: number;
  screen?: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLowerThird?: boolean;
  lowerThirdProgress?: number;
  highlights?: Highlight[];
  duration?: number;
  showMarkers?: boolean;
  markerLabels?: boolean;
  caption?: string;
  showCaption?: boolean;
  playhead?: number;
  endCard?: React.ReactNode;
  showEndCard?: boolean;
  style?: React.CSSProperties;
}> = ({
  width = 880,
  screen,
  title,
  subtitle,
  showLowerThird = false,
  lowerThirdProgress = 1,
  highlights = [],
  duration = 600,
  showMarkers = false,
  markerLabels = false,
  caption,
  showCaption = false,
  playhead = 0.32,
  endCard,
  showEndCard = false,
  style,
}) => {
  const height = (width * 9) / 16;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: RADIUS.lg,
        overflow: "hidden",
        position: "relative",
        background: "#0E1118",
        boxShadow: SHADOW.lg,
        border: `1px solid ${COLORS.border}`,
        ...style,
      }}
    >
      {/* screen content */}
      <div style={{ position: "absolute", inset: 0 }}>{screen}</div>

      {/* lower third */}
      {showLowerThird ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 64,
            padding: "0 34px",
            opacity: lowerThirdProgress,
            transform: `translateX(${(1 - lowerThirdProgress) * -30}px)`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "14px 22px",
              borderRadius: RADIUS.md,
              background: "rgba(14,17,24,0.78)",
              backdropFilter: "blur(4px)",
              borderLeft: `4px solid ${COLORS.remotion}`,
            }}
          >
            <div
              style={{
                fontFamily: FONT.ui,
                fontWeight: 800,
                fontSize: width * 0.034,
                color: "#fff",
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  fontFamily: FONT.ui,
                  fontSize: width * 0.019,
                  color: "rgba(255,255,255,0.72)",
                  marginTop: 4,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* burned-in caption */}
      {showCaption && caption ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 78,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: width * 0.8,
              padding: "8px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.72)",
              color: "#fff",
              fontFamily: FONT.ui,
              fontWeight: 600,
              fontSize: width * 0.024,
              textAlign: "center",
            }}
          >
            {caption}
          </div>
        </div>
      ) : null}

      {/* controls bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 56,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          background:
            "linear-gradient(0deg, rgba(8,10,16,0.92), rgba(8,10,16,0))",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlayIcon size={14} color="#fff" />
        </div>

        {/* progress track */}
        <div style={{ flex: 1, position: "relative", height: 24 }}>
          <div
            style={{
              position: "absolute",
              top: 9,
              left: 0,
              right: 0,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.22)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 9,
              left: 0,
              width: `${playhead * 100}%`,
              height: 5,
              borderRadius: 3,
              background: COLORS.remotion,
            }}
          />
          {/* playhead knob */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: `calc(${playhead * 100}% - 7px)`,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          />
          {/* highlight markers */}
          {showMarkers
            ? highlights.map((h, i) => {
                const x = Math.min(1, h.atSecond / duration);
                const c = hiColor(h.color);
                return (
                  <div key={i}>
                    <div
                      style={{
                        position: "absolute",
                        top: 5,
                        left: `calc(${x * 100}% - 5px)`,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: c,
                        border: "2px solid #0E1118",
                      }}
                    />
                    {markerLabels ? (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 22,
                          left: `${x * 100}%`,
                          transform: "translateX(-50%)",
                          padding: "3px 9px",
                          borderRadius: RADIUS.pill,
                          background: c,
                          color: "#fff",
                          fontFamily: FONT.ui,
                          fontWeight: 700,
                          fontSize: 12,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h.label}
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
        </div>

        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: TYPE.micro,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {fmt(playhead * duration)} / {fmt(duration)}
        </span>
      </div>

      {/* end-screen summary card */}
      {showEndCard ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,10,16,0.86)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {endCard}
        </div>
      ) : null}
    </div>
  );
};
