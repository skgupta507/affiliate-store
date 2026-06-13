import type { MetadataRoute } from "next";

const BASE_URL = "https://theideadecorator.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // High priority pages
  const corePages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/deals`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/rewards`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/payment-methods`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/shipping-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/returns`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Blog posts
  const blogSlugs = [
    "10-living-room-decor-ideas",
    "choose-perfect-lighting-every-room",
    "smart-storage-solutions-indian-homes",
    "guide-choosing-curtains-blinds",
    "5-mistakes-avoid-decorating-bedroom",
    "create-cozy-reading-nook",
    "indoor-plants-indian-weather",
    "budget-bathroom-makeover-5000",
    "wall-art-trends-2025",
    "style-dining-table-like-pro",
    "vastu-tips-home-decor-placement",
    "monsoon-proof-home-decor-tips",
    "minimalist-home-decor-less-is-more",
    "diwali-decoration-ideas-every-budget",
    "home-office-setup-productivity-aesthetics",
    "rug-buying-guide-size-material-placement",
    "color-psychology-home-decor",
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Category pages
  const categories = [
    "Living Room", "Bedroom", "Kitchen & Dining", "Bathroom",
    "Wall Art & Decor", "Lighting", "Furniture", "Rugs & Carpets",
    "Curtains & Blinds", "Cushions & Throws", "Vases & Planters",
    "Candles & Fragrances", "Mirrors", "Clocks", "Storage & Organization",
    "Outdoor & Garden", "Bedding & Linen", "Table Decor", "Shelves & Racks", "Electronics",
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/products?category=${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...corePages, ...blogPages, ...categoryPages];
}
