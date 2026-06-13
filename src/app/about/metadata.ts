import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/layout";

export const metadata: Metadata = {
  title: "About Us - TheIdeaDecorator | Home Decor Store Bangalore",
  description: "TheIdeaDecorator is a Bangalore-based online home decor store offering curated furniture, lighting, wall art, rugs and lifestyle products. Free shipping above ₹499. Secure payments. 7-day returns.",
  keywords: ["about TheIdeaDecorator", "home decor store Bangalore", "online decoration store India", "TheIdeaDecorator Bangalore"],
  openGraph: {
    title: `About TheIdeaDecorator | Home Decor Store Bangalore`,
    description: "Learn about TheIdeaDecorator — your trusted online home decor store based in Bangalore, India.",
    url: `${SITE_URL}/about`,
  },
  alternates: { canonical: `${SITE_URL}/about` },
};
