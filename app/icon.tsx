import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        fontSize: 24,
        fontWeight: 700,
        color: "#f7f6f2",
        background: "#191c1d",
      }}
    >
      LOBO
    </div>,
    size,
  );
}
