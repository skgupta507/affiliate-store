import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export const SITE_URL = "https://theideadecorator.in";
export const SITE_NAME = "TheIdeaDecorator";
export const SITE_DESCRIPTION =
  "TheIdeaDecorator — Shop curated home decor, furniture, lighting, wall art, rugs, cushions and lifestyle products online. Best deals from Amazon, Flipkart & direct purchases. Free shipping above ₹499. Based in Bangalore, India.";

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `TheIdeaDecorator - Home Decor, Furniture & Interior Design Online India`,
    template: `%s | TheIdeaDecorator`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    // Brand keywords
    "TheIdeaDecorator",
    "The Idea Decorator",
    "theideadecorator.in",
    "idea decorator",
    // Product category keywords
    "home decor India",
    "home decoration online India",
    "buy home decor online",
    "interior design products India",
    "home accessories online India",
    "furniture online India",
    "wall art India",
    "lighting home decor",
    "rugs carpets online India",
    "cushions throws India",
    "curtains blinds online India",
    "vases planters India",
    "candles fragrances India",
    "mirrors home decor",
    "clocks decorative India",
    "bedding linen India",
    "table decor India",
    "shelves racks online",
    // Room-specific
    "living room decor ideas",
    "bedroom decoration India",
    "kitchen dining decor",
    "bathroom accessories India",
    "outdoor garden decor India",
    // Style keywords
    "modern home decor",
    "traditional Indian decor",
    "minimalist home decor",
    "bohemian decor India",
    "contemporary interior design",
    // Location
    "home decor Bangalore",
    "interior design products Bangalore",
    "online decor store India",
    // Affordability
    "affordable home decor India",
    "cheap home decor online",
    "best deals home decor",
    "discount home decoration",
    "home decor under 500 rupees",
    // Gifting
    "home decor gifts India",
    "housewarming gifts online",
    "wedding decor gifts India",
    "diwali decoration",
    // Shopping
    "buy furniture online India",
    "Amazon home decor deals",
    "Flipkart home decor",
    "best affiliate home decor",
    "home decor free shipping India",
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
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  openGraph: {
    title: "TheIdeaDecorator - Home Decor, Furniture & Interior Design Online India",
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "TheIdeaDecorator - Shop Smart, Live Beautiful",
      },
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
    title: "TheIdeaDecorator - Home Decor & Interior Design Online",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    site: "@ideadecorator",
    creator: "@ideadecorator",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
    },
  },
  category: "shopping",
  classification: "Home Decor, Interior Design, Ecommerce",
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore",
    "geo.position": "13.0470097;77.6305301",
    "ICBM": "13.0470097, 77.6305301",
    "og:locality": "Bangalore",
    "og:region": "Karnataka",
    "og:country-name": "India",
    "og:postal-code": "560077",
    "business:contact_data:email": "support@theideadecorator.in",
    "business:contact_data:phone_number": "+917892430507",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["LocalBusiness", "Store", "OnlineStore"],
                  "@id": `${SITE_URL}/#organization`,
                  "name": "TheIdeaDecorator",
                  "alternateName": ["The Idea Decorator", "Idea Decorator"],
                  "url": SITE_URL,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${SITE_URL}/icon-512.png`,
                    "width": 512,
                    "height": 512,
                  },
                  "image": `${SITE_URL}/icon-512.png`,
                  "description": "TheIdeaDecorator is an online home decor and interior design products store based in Bangalore, India. We offer curated home decoration products including furniture, lighting, wall art, rugs, cushions, and lifestyle accessories.",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "63, Vidyasagar Road, Ashwath Nagar, HBR Layout",
                    "addressLocality": "Bangalore",
                    "addressRegion": "Karnataka",
                    "postalCode": "560077",
                    "addressCountry": "IN",
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 13.0470097,
                    "longitude": 77.6305301,
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-7892430507",
                    "contactType": "customer service",
                    "email": "support@theideadecorator.in",
                    "availableLanguage": ["English", "Hindi", "Kannada"],
                    "contactOption": "TollFree",
                    "areaServed": "IN",
                  },
                  "sameAs": [
                    "https://www.instagram.com/theideadecorator",
                    "https://www.facebook.com/theideadecorator",
                    "https://twitter.com/ideadecorator",
                    "https://www.youtube.com/@theideadecorator",
                    "https://www.pinterest.com/theideadecorator",
                  ],
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      "opens": "09:00",
                      "closes": "19:00",
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": "Saturday",
                      "opens": "10:00",
                      "closes": "17:00",
                    },
                  ],
                  "priceRange": "₹₹",
                  "currenciesAccepted": "INR",
                  "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
                  "hasMap": "https://www.google.com/maps/place/TheIdeaDecorator",
                  "areaServed": {
                    "@type": "Country",
                    "name": "India",
                  },
                  "servesCuisine": null,
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": SITE_URL,
                  "name": "TheIdeaDecorator",
                  "description": "Online home decor and interior design products store in India",
                  "publisher": { "@id": `${SITE_URL}/#organization` },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": `${SITE_URL}/search?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                  "inLanguage": "en-IN",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <GoogleAnalytics />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
