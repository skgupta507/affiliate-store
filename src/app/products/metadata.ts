import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/layout";

export const metadata: Metadata = {
  title: "All Products - Home Decor, Furniture, Lighting & More",
  description: "Browse 1000+ curated home decor products — furniture, lighting, wall art, rugs, cushions, curtains, vases, candles and more. Best deals from Amazon, Flipkart & direct purchases. Free shipping above ₹499.",
  keywords: [
    "buy home decor products online India",
    "home decoration products",
    "interior design products online",
    "affordable home decor",
    "furniture online India",
    "lighting products India",
    "wall art online India",
    "home accessories India",
    "cushions and throws online",
    "rugs carpets online India",
  ],
  openGraph: {
    title: `All Home Decor Products | ${SITE_NAME}`,
    description: "Browse curated home decor, furniture, lighting and more. Free shipping above ₹499.",
    url: `${SITE_URL}/products`,
    type: "website",
  },
  alternates: { canonical: `${SITE_URL}/products` },
};
