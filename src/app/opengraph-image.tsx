import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TheIdeaDecorator - Shop Smart, Live Beautiful";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(194,65,12,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(234,88,12,0.06) 0%, transparent 50%)",
          }}
        />
        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #c2410c, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" fill="white" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#1c1917", lineHeight: 1.1 }}>
              TheIdea<span style={{ color: "#c2410c" }}>Decorator</span>
            </span>
            <span style={{ fontSize: 20, color: "#78716c", marginTop: 4 }}>Shop Smart, Live Beautiful</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#44403c",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          Curated Home Decor · Furniture · Lighting · Wall Art
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 12 }}>
          {["🚚 Free Shipping ₹499+", "🔒 Secure Payments", "↩️ 7-Day Returns", "⭐ Best Deals"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                background: "rgba(194,65,12,0.1)",
                border: "1.5px solid rgba(194,65,12,0.25)",
                borderRadius: 100,
                fontSize: 16,
                color: "#c2410c",
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: "absolute", bottom: 32, fontSize: 18, color: "#a8a29e" }}>
          theideadecorator.in
        </div>
      </div>
    ),
    { ...size }
  );
}
