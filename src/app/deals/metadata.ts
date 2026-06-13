import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/layout";

export const metadata: Metadata = {
  title: "Today's Best Deals - Up to 70% Off on Home Decor",
  description: "Shop today's best deals on home decor, furniture, lighting and more. Up to 70% off. Flash sale prices updated daily. Free shipping above ₹499 across India.",
  keywords: ["home decor deals India", "discount home decor", "flash sale home decoration", "cheap home decor online", "home decor sale India"],
  openGraph: {
    title: `Best Deals on Home Decor | ${SITE_NAME}`,
    description: "Up to 70% off on home decor, furniture, lighting and more. Flash sale prices updated daily.",
    url: `${SITE_URL}/deals`,
  },
  alternates: { canonical: `${SITE_URL}/deals` },
};
