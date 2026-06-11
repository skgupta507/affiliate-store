import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theideadecorator.in";

  const staticPages = [
    "",
    "/products",
    "/categories",
    "/deals",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/rewards",
    "/privacy-policy",
    "/terms",
    "/shipping-policy",
    "/returns",
  ];

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.7,
  }));
}
