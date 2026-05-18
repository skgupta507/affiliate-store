import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
    }

    // Strategy 1: Try fetching via public OG metadata APIs (most reliable from datacenter IPs)
    const metaFromApi = await fetchViaMetadataApi(url);
    if (metaFromApi) {
      return NextResponse.json(metaFromApi);
    }

    // Strategy 2: Direct fetch with multiple user agents
    const html = await directFetch(url);
    if (html) {
      return processHtml(html, url);
    }

    // Strategy 3: Try via allorigins proxy
    const proxyHtml = await fetchViaProxy(url);
    if (proxyHtml) {
      return processHtml(proxyHtml, url);
    }

    return NextResponse.json(
      { success: false, error: "Could not fetch product details. The site may be blocking server requests. Please enter details manually." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please enter details manually." },
      { status: 200 }
    );
  }
}

// --- Strategy 1: Public metadata extraction APIs ---

async function fetchViaMetadataApi(url: string): Promise<any | null> {
  // Try jsonlink.io (free OG metadata API)
  try {
    const apiUrl = `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      if (data.title || data.description || data.images?.length) {
        const platform = detectPlatform(url);
        const filteredImage = filterProductImage(data.images, platform);
        return {
          success: true,
          title: data.title || undefined,
          description: data.description || undefined,
          image: filteredImage || undefined,
          price: undefined, // These APIs don't extract price
          originalPrice: undefined,
          category: inferCategoryFromText(data.title || "", data.description || ""),
          tags: extractTagsFromText(data.title, data.description),
          rating: undefined,
          reviewCount: undefined,
          platform,
          siteName: data.domain || undefined,
          resolvedUrl: data.url || url,
        };
      }
    }
  } catch {}

  // Try opengraph.io style (via allorigins as proxy to og scraper)
  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const json = await res.json();
      const data = json.data;
      if (data && (data.title || data.description || data.image)) {
        const platform = detectPlatform(url);
        return {
          success: true,
          title: data.title || undefined,
          description: data.description || undefined,
          image: data.image?.url || undefined,
          price: undefined,
          originalPrice: undefined,
          category: inferCategoryFromText(data.title || "", data.description || ""),
          tags: extractTagsFromText(data.title, data.description),
          rating: undefined,
          reviewCount: undefined,
          platform,
          siteName: data.publisher || undefined,
          resolvedUrl: data.url || url,
        };
      }
    }
  } catch {}

  return null;
}

// --- Strategy 2: Direct fetch with retries ---

async function directFetch(url: string): Promise<string | null> {
  const userAgents = [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Twitterbot/1.0",
  ];

  for (const ua of userAgents) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": ua,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "identity",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
      });

      if (res.ok) {
        const text = await res.text();
        if (text.length > 500) return text.slice(0, 200 * 1024);
      }
    } catch {
      continue;
    }
  }

  return null;
}

// --- Strategy 3: CORS proxy ---

async function fetchViaProxy(url: string): Promise<string | null> {
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
      if (res.ok) {
        const text = await res.text();
        if (text.length > 500) return text.slice(0, 200 * 1024);
      }
    } catch {
      continue;
    }
  }

  return null;
}

// --- Helpers for metadata API results ---

function filterProductImage(images: string[] | undefined, platform: string): string | undefined {
  if (!images || images.length === 0) return undefined;

  // Patterns that indicate a site logo, not a product image
  const logoPatterns = [
    /prime[-_]?logo/i,
    /amazon[-_]?logo/i,
    /flipkart[-_]?logo/i,
    /site[-_]?logo/i,
    /brand[-_]?logo/i,
    /favicon/i,
    /sprite/i,
    /icon[-_]?\d/i,
    /nav[-_]?logo/i,
    /header[-_]?logo/i,
    /og[-_]?default/i,
    /placeholder/i,
    /\/logo\./i,
    /\/logos\//i,
    /prime.*video/i,
    /ssl-images-amazon\.com\/images\/G\//i, // Amazon global assets (logos)
  ];

  // Try to find a product image (not a logo)
  for (const img of images) {
    if (!img) continue;
    const isLogo = logoPatterns.some((p) => p.test(img));
    if (!isLogo) {
      // Prefer images that look like product images
      if (img.includes("/images/I/") || // Amazon product images
          img.includes("rukminim") || // Flipkart CDN
          img.includes("media") ||
          img.includes("product") ||
          img.length > 60) { // Product image URLs tend to be longer
        return img;
      }
    }
  }

  // If no clear product image found, return first non-logo image
  for (const img of images) {
    if (!img) continue;
    const isLogo = logoPatterns.some((p) => p.test(img));
    if (!isLogo) return img;
  }

  // Last resort: return first image
  return images[0];
}

function inferCategoryFromText(title: string, description: string): string | undefined {
  const text = (title + " " + description).toLowerCase();
  const map: [string, string][] = [
    ["phone", "Electronics"], ["laptop", "Electronics"], ["headphone", "Electronics"],
    ["earbuds", "Electronics"], ["tablet", "Electronics"], ["camera", "Electronics"],
    ["watch", "Electronics"], ["speaker", "Electronics"], ["charger", "Electronics"],
    ["shirt", "Fashion"], ["dress", "Fashion"], ["shoes", "Fashion"], ["jacket", "Fashion"],
    ["jeans", "Fashion"], ["sneaker", "Fashion"], ["kurta", "Fashion"],
    ["kitchen", "Home & Kitchen"], ["furniture", "Home & Kitchen"], ["appliance", "Home & Kitchen"],
    ["book", "Books"], ["novel", "Books"],
    ["sport", "Sports"], ["fitness", "Sports"], ["gym", "Sports"],
    ["beauty", "Beauty"], ["skincare", "Beauty"], ["makeup", "Beauty"],
    ["toy", "Toys"], ["game", "Toys"],
    ["car", "Automotive"], ["bike", "Automotive"],
  ];
  for (const [keyword, category] of map) {
    if (text.includes(keyword)) return category;
  }
  return undefined;
}

function extractTagsFromText(title?: string, description?: string): string[] {
  const tags: Set<string> = new Set();
  const text = ((title || "") + " " + (description || "")).toLowerCase();
  const words = text.split(/[\s,\-|/]+/);
  const stopWords = new Set(["the", "a", "an", "and", "or", "for", "with", "in", "on", "at", "to", "of", "by", "is", "it", "its", "from", "buy", "online", "india", "best", "new", "free", "price", "this", "that", "your", "you", "are", "was", "were", "been", "have", "has", "had", "will", "can", "may"]);
  words.forEach((w) => {
    const clean = w.replace(/[^a-z0-9]/g, "");
    if (clean.length > 2 && clean.length < 20 && !stopWords.has(clean)) {
      tags.add(clean);
    }
  });
  return Array.from(tags).slice(0, 8);
}

function processHtml(html: string, finalUrl: string) {
  const platform = detectPlatform(finalUrl);

  const title = extractTitle(html);
  const description = extractDescription(html);
  const image = extractImage(html, finalUrl);
  const price = extractPrice(html, platform);
  const originalPrice = extractOriginalPrice(html, platform);
  const category = extractCategory(html, platform);
  const tags = extractTags(html, title, description);
  const rating = extractRating(html, platform);
  const reviewCount = extractReviewCount(html, platform);
  const siteName = extractMeta(html, "og:site_name");

  if (!title && !description && !image) {
    return NextResponse.json(
      { success: false, error: "Could not extract metadata from this page. The site may require JavaScript rendering." },
      { status: 200 }
    );
  }

  return NextResponse.json({
    success: true,
    title,
    description,
    image,
    price,
    originalPrice,
    category,
    tags,
    rating,
    reviewCount,
    platform,
    siteName,
    resolvedUrl: finalUrl,
  });
}

// --- Platform Detection ---

function detectPlatform(url: string): string {
  const hostname = url.toLowerCase();
  if (hostname.includes("amazon")) return "Amazon";
  if (hostname.includes("flipkart")) return "Flipkart";
  if (hostname.includes("myntra")) return "Myntra";
  if (hostname.includes("ajio")) return "Ajio";
  if (hostname.includes("meesho")) return "Meesho";
  if (hostname.includes("snapdeal")) return "Snapdeal";
  if (hostname.includes("ebay")) return "eBay";
  if (hostname.includes("aliexpress")) return "AliExpress";
  if (hostname.includes("nykaa")) return "Nykaa";
  if (hostname.includes("croma")) return "Croma";
  if (hostname.includes("tatacliq")) return "TataCliq";
  if (hostname.includes("jiomart")) return "JioMart";
  return "Other";
}

// --- Meta Extraction ---

function extractMeta(html: string, property: string): string | undefined {
  // Handle multi-line meta tags and various attribute orders
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${property}["']`, "i"),
    // itemprop variant
    new RegExp(`<meta[^>]*itemprop=["']${property}["'][^>]*content=["']([^"']+)["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1] && match[1].trim()) return decodeHtmlEntities(match[1].trim());
  }
  return undefined;
}

// --- Title ---

function extractTitle(html: string): string | undefined {
  // Priority: og:title > twitter:title > product name from JSON-LD > <title>
  const ogTitle = extractMeta(html, "og:title");
  if (ogTitle) return cleanTitle(ogTitle);

  const twitterTitle = extractMeta(html, "twitter:title");
  if (twitterTitle) return cleanTitle(twitterTitle);

  // JSON-LD product name
  const jsonLdName = extractFromJsonLd(html, "name");
  if (jsonLdName) return cleanTitle(jsonLdName);

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch?.[1]?.trim()) return cleanTitle(decodeHtmlEntities(titleMatch[1].trim()));

  return undefined;
}

function cleanTitle(title: string): string {
  // Remove common suffixes like " - Amazon.in", " | Flipkart", " - Buy Online"
  return title
    .replace(/\s*[-|:]\s*(Amazon\.in|Amazon\.com|Flipkart\.com|Flipkart|Myntra|Buy Online.*|Online.*India).*$/i, "")
    .replace(/\s*\(.*?\)\s*$/, "") // Remove trailing parenthetical
    .trim();
}

// --- Description ---

function extractDescription(html: string): string | undefined {
  const desc = extractMeta(html, "og:description") ||
    extractMeta(html, "description") ||
    extractMeta(html, "twitter:description") ||
    extractFromJsonLd(html, "description");

  if (desc) {
    // Trim to reasonable length
    return desc.length > 500 ? desc.slice(0, 500) + "..." : desc;
  }
  return undefined;
}

// --- Image ---

function extractImage(html: string, pageUrl: string): string | undefined {
  // 1. OG image (most reliable)
  const ogImage = extractMeta(html, "og:image");
  if (ogImage && isValidImageUrl(ogImage)) return resolveUrl(ogImage, pageUrl);

  // 2. Twitter image
  const twitterImage = extractMeta(html, "twitter:image") || extractMeta(html, "twitter:image:src");
  if (twitterImage && isValidImageUrl(twitterImage)) return resolveUrl(twitterImage, pageUrl);

  // 3. JSON-LD image
  const jsonLdImage = extractImageFromJsonLd(html);
  if (jsonLdImage) return resolveUrl(jsonLdImage, pageUrl);

  // 4. Amazon specific: landingImage or imgTagWrapperId
  const amazonPatterns = [
    /id=["']landingImage["'][^>]*src=["']([^"']+)["']/i,
    /id=["']imgBlkFront["'][^>]*src=["']([^"']+)["']/i,
    /data-old-hires=["']([^"']+)["']/i,
    /data-a-dynamic-image=["']\{["']([^"']+)["']/i,
  ];
  for (const pattern of amazonPatterns) {
    const match = html.match(pattern);
    if (match?.[1] && isValidImageUrl(match[1])) return match[1];
  }

  // 5. Flipkart specific
  const flipkartImg = html.match(/class=["'][^"']*_396cs4[^"']*["'][^>]*src=["']([^"']+)["']/i);
  if (flipkartImg?.[1] && isValidImageUrl(flipkartImg[1])) return flipkartImg[1];

  // 6. First large product image (generic fallback)
  const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*/gi);
  for (const m of imgMatches) {
    const src = m[1];
    if (isValidImageUrl(src) && isLikelyProductImage(src, m[0])) {
      return resolveUrl(src, pageUrl);
    }
  }

  return undefined;
}

function isValidImageUrl(url: string): boolean {
  if (!url || url.length < 10) return false;
  if (url.startsWith("data:")) return false;
  // Must look like an image URL or be from a CDN
  const lower = url.toLowerCase();
  return (
    lower.includes(".jpg") || lower.includes(".jpeg") || lower.includes(".png") ||
    lower.includes(".webp") || lower.includes("image") || lower.includes("/img") ||
    lower.includes("media") || lower.includes("cdn") || lower.includes("photo")
  );
}

function isLikelyProductImage(src: string, imgTag: string): boolean {
  // Skip tiny icons, logos, sprites
  const skipPatterns = /icon|logo|sprite|pixel|tracking|badge|star|rating|avatar|banner|ad[_-]/i;
  if (skipPatterns.test(src) || skipPatterns.test(imgTag)) return false;

  // Check for size hints suggesting a product image
  const widthMatch = imgTag.match(/width=["']?(\d+)/i);
  if (widthMatch && parseInt(widthMatch[1]) < 100) return false;

  return true;
}

function resolveUrl(url: string, pageUrl: string): string {
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return "https:" + url;
  try {
    return new URL(url, pageUrl).href;
  } catch {
    return url;
  }
}

// --- Price ---

function extractPrice(html: string, platform: string): string | undefined {
  // 1. JSON-LD price (most structured/reliable)
  const jsonLdPrice = extractPriceFromJsonLd(html);
  if (jsonLdPrice) return jsonLdPrice;

  // 2. Platform-specific patterns
  if (platform === "Amazon") {
    const amazonPatterns = [
      // Whole price span
      /class=["'][^"']*a-price-whole["'][^>]*>([\d,]+)/i,
      /id=["']priceblock_dealprice["'][^>]*>[₹$]?\s*([\d,]+\.?\d*)/i,
      /id=["']priceblock_ourprice["'][^>]*>[₹$]?\s*([\d,]+\.?\d*)/i,
      /class=["'][^"']*priceToPay[^"']*["'][^>]*>[^<]*<span[^>]*>([\d,]+)/i,
      /corePriceDisplay_desktop_feature_div[^]*?class=["']a-price-whole["'][^>]*>([\d,]+)/i,
      /"priceAmount":([\d.]+)/i,
    ];
    for (const pattern of amazonPatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const cleaned = match[1].replace(/[,\s]/g, "");
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num > 0) return num.toString();
      }
    }
  }

  if (platform === "Flipkart") {
    const flipkartPatterns = [
      /class=["'][^"']*Nx9bqj[^"']*["'][^>]*>[₹]?\s*([\d,]+)/i,
      /class=["'][^"']*_30jeq3[^"']*["'][^>]*>[₹]?\s*([\d,]+)/i,
      /class=["'][^"']*_16Jk6d["'][^>]*>[₹]?\s*([\d,]+)/i,
    ];
    for (const pattern of flipkartPatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const cleaned = match[1].replace(/[,\s]/g, "");
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num > 0) return num.toString();
      }
    }
  }

  // 3. itemprop price
  const itempropPrice = html.match(/itemprop=["']price["'][^>]*content=["']([^"']+)["']/i);
  if (itempropPrice?.[1]) {
    const num = parseFloat(itempropPrice[1].replace(/[,\s]/g, ""));
    if (!isNaN(num) && num > 0) return num.toString();
  }

  // 4. Generic price patterns
  const genericPatterns = [
    /["']price["']\s*:\s*["']?([\d,.]+)["']?/i,
    /class=["'][^"']*price[^"']*["'][^>]*>[₹$€£]?\s*([\d,]+\.?\d*)/i,
    /[₹]\s*([\d,]+\.?\d*)/,
  ];
  for (const pattern of genericPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const cleaned = match[1].replace(/[,\s]/g, "");
      const num = parseFloat(cleaned);
      if (!isNaN(num) && num > 1) return num.toString();
    }
  }

  return undefined;
}

function extractOriginalPrice(html: string, platform: string): string | undefined {
  if (platform === "Amazon") {
    const patterns = [
      /class=["'][^"']*a-text-price[^"']*["'][^>]*>[^<]*[₹$]\s*([\d,]+\.?\d*)/i,
      /class=["'][^"']*priceBlockStrikePriceString[^"']*["'][^>]*>[₹$]\s*([\d,]+\.?\d*)/i,
      /class=["'][^"']*basisPrice[^"']*["'][^]*?<span[^>]*>[₹$]?\s*([\d,]+)/i,
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const cleaned = match[1].replace(/[,\s]/g, "");
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num > 0) return num.toString();
      }
    }
  }

  if (platform === "Flipkart") {
    const patterns = [
      /class=["'][^"']*yRaY8j[^"']*["'][^>]*>[₹]?\s*([\d,]+)/i,
      /class=["'][^"']*_3I9_wc[^"']*["'][^>]*>[₹]?\s*([\d,]+)/i,
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const cleaned = match[1].replace(/[,\s]/g, "");
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num > 0) return num.toString();
      }
    }
  }

  return undefined;
}

// --- Category ---

function extractCategory(html: string, platform: string): string | undefined {
  // 1. Breadcrumbs (most reliable for category)
  if (platform === "Amazon") {
    const breadcrumb = html.match(/id=["']wayfinding-breadcrumbs[^"']*["'][^>]*>[^]*?<a[^>]*>([^<]+)/i);
    if (breadcrumb?.[1]) return decodeHtmlEntities(breadcrumb[1].trim());

    const navCat = html.match(/class=["'][^"']*nav-a-content["'][^>]*>([^<]+)/i);
    if (navCat?.[1]) return decodeHtmlEntities(navCat[1].trim());
  }

  if (platform === "Flipkart") {
    // Flipkart breadcrumb
    const breadcrumb = html.match(/class=["'][^"']*_1MR4o5[^"']*["'][^>]*>[^]*?<a[^>]*>([^<]+)/i);
    if (breadcrumb?.[1]) return decodeHtmlEntities(breadcrumb[1].trim());
  }

  // 2. JSON-LD category
  const categoryMatch = html.match(/"category"\s*:\s*"([^"]+)"/i);
  if (categoryMatch?.[1]) return decodeHtmlEntities(categoryMatch[1]);

  // 3. og:type or product:category
  const productCat = extractMeta(html, "product:category");
  if (productCat) return productCat;

  // 4. Infer from keywords/title
  const keywords = extractMeta(html, "keywords");
  if (keywords) {
    return inferCategoryFromKeywords(keywords);
  }

  return undefined;
}

function inferCategoryFromKeywords(keywords: string): string | undefined {
  const lower = keywords.toLowerCase();
  const categoryMap: [string, string][] = [
    ["electronics", "Electronics"],
    ["phone", "Electronics"],
    ["laptop", "Electronics"],
    ["computer", "Electronics"],
    ["headphone", "Electronics"],
    ["camera", "Electronics"],
    ["tablet", "Electronics"],
    ["watch", "Electronics"],
    ["fashion", "Fashion"],
    ["clothing", "Fashion"],
    ["shirt", "Fashion"],
    ["dress", "Fashion"],
    ["shoes", "Fashion"],
    ["sneaker", "Fashion"],
    ["jacket", "Fashion"],
    ["kitchen", "Home & Kitchen"],
    ["home", "Home & Kitchen"],
    ["furniture", "Home & Kitchen"],
    ["appliance", "Home & Kitchen"],
    ["book", "Books"],
    ["novel", "Books"],
    ["sport", "Sports"],
    ["fitness", "Sports"],
    ["gym", "Sports"],
    ["beauty", "Beauty"],
    ["skincare", "Beauty"],
    ["makeup", "Beauty"],
    ["cosmetic", "Beauty"],
    ["toy", "Toys"],
    ["game", "Toys"],
    ["car", "Automotive"],
    ["bike", "Automotive"],
    ["automotive", "Automotive"],
  ];

  for (const [keyword, category] of categoryMap) {
    if (lower.includes(keyword)) return category;
  }
  return undefined;
}

// --- Tags ---

function extractTags(html: string, title?: string, description?: string): string[] {
  const tags: Set<string> = new Set();

  // 1. Meta keywords
  const keywords = extractMeta(html, "keywords");
  if (keywords) {
    keywords.split(",").forEach((k) => {
      const trimmed = k.trim().toLowerCase();
      if (trimmed && trimmed.length > 2 && trimmed.length < 30) {
        tags.add(trimmed);
      }
    });
  }

  // 2. Extract meaningful words from title
  if (title) {
    const words = title.toLowerCase().split(/[\s,\-|]+/);
    const stopWords = new Set(["the", "a", "an", "and", "or", "for", "with", "in", "on", "at", "to", "of", "by", "is", "it", "its", "from", "buy", "online", "india", "best", "new", "free", "price"]);
    words.forEach((w) => {
      const clean = w.replace(/[^a-z0-9]/g, "");
      if (clean.length > 2 && clean.length < 20 && !stopWords.has(clean)) {
        tags.add(clean);
      }
    });
  }

  // Limit to 8 most relevant tags
  return Array.from(tags).slice(0, 8);
}

// --- Rating ---

function extractRating(html: string, platform: string): string | undefined {
  // JSON-LD rating
  const ratingMatch = html.match(/"ratingValue"\s*:\s*"?([\d.]+)"?/i);
  if (ratingMatch?.[1]) {
    const num = parseFloat(ratingMatch[1]);
    if (num > 0 && num <= 5) return num.toString();
  }

  if (platform === "Amazon") {
    const amazonRating = html.match(/class=["'][^"']*a-icon-alt["'][^>]*>([\d.]+)\s*out\s*of/i);
    if (amazonRating?.[1]) return amazonRating[1];
  }

  if (platform === "Flipkart") {
    const flipkartRating = html.match(/class=["'][^"']*_3LWZlK["'][^>]*>([\d.]+)/i);
    if (flipkartRating?.[1]) {
      const num = parseFloat(flipkartRating[1]);
      if (num > 0 && num <= 5) return num.toString();
    }
  }

  // itemprop ratingValue
  const itempropRating = html.match(/itemprop=["']ratingValue["'][^>]*content=["']([^"']+)["']/i);
  if (itempropRating?.[1]) {
    const num = parseFloat(itempropRating[1]);
    if (num > 0 && num <= 5) return num.toString();
  }

  return undefined;
}

// --- Review Count ---

function extractReviewCount(html: string, platform: string): string | undefined {
  // JSON-LD reviewCount
  const jsonLdCount = html.match(/"reviewCount"\s*:\s*"?(\d+)"?/i);
  if (jsonLdCount?.[1]) return jsonLdCount[1];

  const jsonLdRatingCount = html.match(/"ratingCount"\s*:\s*"?(\d+)"?/i);
  if (jsonLdRatingCount?.[1]) return jsonLdRatingCount[1];

  if (platform === "Amazon") {
    const amazonCount = html.match(/id=["']acrCustomerReviewText["'][^>]*>([\d,]+)\s*(rating|review)/i);
    if (amazonCount?.[1]) return amazonCount[1].replace(/,/g, "");

    const amazonCount2 = html.match(/([\d,]+)\s*(customer review|rating|global rating)/i);
    if (amazonCount2?.[1]) return amazonCount2[1].replace(/,/g, "");
  }

  if (platform === "Flipkart") {
    const flipkartCount = html.match(/([\d,]+)\s*Ratings?\s*&?\s*([\d,]+)?\s*Reviews?/i);
    if (flipkartCount?.[1]) return flipkartCount[1].replace(/,/g, "");
  }

  // itemprop reviewCount
  const itempropCount = html.match(/itemprop=["']reviewCount["'][^>]*content=["']([^"']+)["']/i);
  if (itempropCount?.[1]) return itempropCount[1];

  // Generic
  const genericCount = html.match(/([\d,]+)\s*(reviews?|ratings?)/i);
  if (genericCount?.[1]) {
    const num = parseInt(genericCount[1].replace(/,/g, ""));
    if (num > 0 && num < 1000000) return num.toString();
  }

  return undefined;
}

// --- JSON-LD Helpers ---

function extractFromJsonLd(html: string, field: string): string | undefined {
  const scripts = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const scriptMatch of scripts) {
    try {
      const json = JSON.parse(scriptMatch[1]);
      const value = findInJsonLd(json, field);
      if (value && typeof value === "string") return decodeHtmlEntities(value);
    } catch {
      continue;
    }
  }
  return undefined;
}

function extractImageFromJsonLd(html: string): string | undefined {
  const scripts = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const scriptMatch of scripts) {
    try {
      const json = JSON.parse(scriptMatch[1]);
      const img = findImageInJsonLd(json);
      if (img) return img;
    } catch {
      continue;
    }
  }
  return undefined;
}

function extractPriceFromJsonLd(html: string): string | undefined {
  const scripts = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const scriptMatch of scripts) {
    try {
      const json = JSON.parse(scriptMatch[1]);
      const price = findPriceInJsonLd(json);
      if (price) return price;
    } catch {
      continue;
    }
  }
  return undefined;
}

function findInJsonLd(obj: any, field: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  if (obj[field] && typeof obj[field] === "string") return obj[field];
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findInJsonLd(item, field);
      if (result) return result;
    }
  } else {
    for (const key of Object.keys(obj)) {
      if (key === field && typeof obj[key] === "string") return obj[key];
      const result = findInJsonLd(obj[key], field);
      if (result) return result;
    }
  }
  return undefined;
}

function findImageInJsonLd(obj: any): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  if (obj.image) {
    if (typeof obj.image === "string") return obj.image;
    if (Array.isArray(obj.image) && obj.image[0]) {
      return typeof obj.image[0] === "string" ? obj.image[0] : obj.image[0]?.url;
    }
    if (obj.image.url) return obj.image.url;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findImageInJsonLd(item);
      if (result) return result;
    }
  }
  return undefined;
}

function findPriceInJsonLd(obj: any): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  // Look for offers.price or offers.lowPrice
  if (obj.offers) {
    const offers = Array.isArray(obj.offers) ? obj.offers[0] : obj.offers;
    if (offers?.price) {
      const num = parseFloat(String(offers.price).replace(/[,\s]/g, ""));
      if (!isNaN(num) && num > 0) return num.toString();
    }
    if (offers?.lowPrice) {
      const num = parseFloat(String(offers.lowPrice).replace(/[,\s]/g, ""));
      if (!isNaN(num) && num > 0) return num.toString();
    }
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findPriceInJsonLd(item);
      if (result) return result;
    }
  } else {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        const result = findPriceInJsonLd(obj[key]);
        if (result) return result;
      }
    }
  }
  return undefined;
}

// --- Utilities ---

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}
