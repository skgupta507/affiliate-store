import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const SITE_URL = "https://theideadecorator.in";
const SITE_NAME = "TheIdeaDecorator";
const SITE_DESCRIPTION =
  "Discover curated home decor, furniture, lighting, and lifestyle products. Shop the best deals with affiliate offers and direct purchases at TheIdeaDecorator.";

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Shop Smart, Live Beautiful`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "home decor India",
    "interior design products",
    "home decoration online",
    "buy furniture online India",
    "wall art decor",
    "lighting home decor",
    "bedroom decor",
    "living room decoration",
    "cushions throws",
    "vases planters India",
    "curtains blinds online",
    "affordable home decor",
    "decor gifts",
    "Indian home decoration",
    "best deals home decor",
    "TheIdeaDecorator",
    "shop home decor Bangalore",
    "home accessories online",
    "rugs carpets India",
    "scented candles India",
    "modern home decor",
    "traditional Indian decor",
    "Flipkart home decor",
    "Amazon home decor deals",
  ],
  authors: [{ name: "TheIdeaDecorator", url: SITE_URL }],
  creator: "TheIdeaDecorator",
  publisher: "TheIdeaDecorator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  openGraph: {
    title: `${SITE_NAME} - Shop Smart, Live Beautiful`,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
        alt: "TheIdeaDecorator Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Shop Smart, Live Beautiful`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/icon-512.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen antialiased">
        <GoogleAnalytics />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
