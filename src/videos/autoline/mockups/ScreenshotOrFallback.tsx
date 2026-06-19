import React from "react";
import { Img, staticFile } from "remotion";
import { SCREENSHOTS } from "../screenshots";

/**
 * Renders a real screenshot from public/screenshots/<name> if its flag is on in
 * src/screenshots.ts; otherwise renders the coded `fallback`. This keeps the
 * project rendering whether or not the optional images are present.
 */
export const ScreenshotOrFallback: React.FC<{
  name: string;
  fallback: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ name, fallback, style }) => {
  if (SCREENSHOTS[name]) {
    return (
      <Img
        src={staticFile(`screenshots/${name}`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      />
    );
  }
  return <>{fallback}</>;
};
