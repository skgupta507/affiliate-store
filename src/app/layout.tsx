import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "AffiliateHub - Premium Product Deals",
  description:
    "Discover the best affiliate deals from Amazon, Flipkart, and more. Curated products with premium shopping experience.",
  openGraph: {
    title: "AffiliateHub - Premium Product Deals",
    description:
      "Discover the best affiliate deals from Amazon, Flipkart, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistMono.variable}>
      <body className="animated-gradient min-h-screen antialiased font-mono">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
