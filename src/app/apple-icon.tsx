import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #18181b 0%, #09090b 100%)",
          borderRadius: 36,
          border: "3px solid rgba(245, 158, 11, 0.5)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            color: "#f59e0b",
            fontSize: 72,
            fontWeight: 800,
            fontFamily: "monospace",
            lineHeight: 0.9,
          }}
        >
          <span>{">"}</span>
          <span style={{ marginLeft: 28, color: "#fafafa", fontSize: 64 }}>_</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 22,
            right: 22,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#f59e0b",
            boxShadow: "0 0 24px rgba(245, 158, 11, 0.8)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
