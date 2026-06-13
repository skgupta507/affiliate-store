import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "linear-gradient(135deg, #c2410c, #ea580c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* House icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
            fill="white"
            opacity="0.95"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
