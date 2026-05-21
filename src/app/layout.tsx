import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "TheIdeaDecorator - Shop Smart, Live Beautiful",
  description:
    "Discover curated home decor, furniture, electronics, and lifestyle products. Shop the best deals with affiliate offers and direct purchases at TheIdeaDecorator.",
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "TheIdeaDecorator - Shop Smart, Live Beautiful",
    description:
      "Discover curated home decor, furniture, electronics, and lifestyle products. Best deals and direct purchases.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <GoogleAnalytics />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
