import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/layout";

export const metadata: Metadata = {
  title: "Contact Us - TheIdeaDecorator | Support & Help",
  description: "Contact TheIdeaDecorator for order queries, product questions or support. Email: support@theideadecorator.in | Phone: +91 7892430507 | Address: 63, Vidyasagar Rd, HBR Layout, Bangalore 560077.",
  keywords: ["contact TheIdeaDecorator", "TheIdeaDecorator support", "home decor store contact Bangalore"],
  openGraph: {
    title: `Contact TheIdeaDecorator | Customer Support`,
    description: "Reach out to our support team for order queries, product questions or any help.",
    url: `${SITE_URL}/contact`,
  },
  alternates: { canonical: `${SITE_URL}/contact` },
};
