import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          borderRadius: 8,
          border: "2px solid rgba(245, 158, 11, 0.45)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            color: "#f59e0b",
            fontSize: 18,
            fontWeight: 800,
            fontFamily: "monospace",
            lineHeight: 1,
            marginLeft: 2,
          }}
        >
          <span>{">"}</span>
          <span style={{ marginLeft: 6, color: "#fafafa" }}>_</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 3,
            right: 3,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#f59e0b",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
