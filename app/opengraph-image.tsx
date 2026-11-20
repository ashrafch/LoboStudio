import { ImageResponse } from "next/og";

export const alt = "LoboStudio · Architettura e ingegneria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 90,
        color: "#191c1d",
        background: "#f7f6f2",
      }}
    >
      <div style={{ fontSize: 35, color: "#7c503d" }}>LOBO STUDIO</div>
      <div style={{ fontSize: 87, marginTop: 30 }}>
        Architettura e ingegneria.
      </div>
    </div>,
    size,
  );
}
