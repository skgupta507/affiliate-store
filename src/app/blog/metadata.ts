import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/layout";

export const metadata: Metadata = {
  title: "Blog - Home Decor Tips, Interior Design Guides & Ideas",
  description: "Read our home decor blog for styling tips, interior design guides, budget decoration ideas, Vastu tips, Diwali decoration, monsoon home care and more. Expert advice for Indian homes.",
  keywords: ["home decor blog India", "interior design tips", "home decoration ideas", "decor styling guide", "Indian home decor tips", "vastu home decor", "budget home decor ideas"],
  openGraph: {
    title: `Home Decor Blog & Interior Design Tips | ${SITE_NAME}`,
    description: "Expert home decor tips, styling guides and interior design ideas for Indian homes.",
    url: `${SITE_URL}/blog`,
  },
  alternates: { canonical: `${SITE_URL}/blog` },
};
