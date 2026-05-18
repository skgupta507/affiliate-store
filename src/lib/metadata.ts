"use client";

import { MetadataResult } from "@/types";

const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy?quest=",
];

async function fetchWithProxy(url: string): Promise<string | null> {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        return await response.text();
      }
    } catch {
      continue;
    }
  }
  return null;
}

function extractMetaContent(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

function extractTitle(html: string): string | undefined {
  const ogTitle = extractMetaContent(html, "og:title");
  if (ogTitle) return ogTitle;

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return titleMatch?.[1]?.trim();
}

function extractDescription(html: string): string | undefined {
  return (
    extractMetaContent(html, "og:description") ||
    extractMetaContent(html, "description") ||
    extractMetaContent(html, "twitter:description")
  );
}

function extractImage(html: string): string | undefined {
  return (
    extractMetaContent(html, "og:image") ||
    extractMetaContent(html, "twitter:image") ||
    extractMetaContent(html, "twitter:image:src")
  );
}

function extractPrice(html: string): string | undefined {
  const pricePatterns = [
    /["']price["']\s*:\s*["']([^"']+)["']/i,
    /itemprop=["']price["'][^>]*content=["']([^"']+)["']/i,
    /class=["'][^"']*price[^"']*["'][^>]*>[\s]*[₹$€£]?\s*([\d,]+\.?\d*)/i,
    /[₹$€£]\s*([\d,]+\.?\d*)/,
  ];

  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  try {
    const html = await fetchWithProxy(url);

    if (!html) {
      return {
        success: false,
        error: "Could not fetch URL. CORS restrictions may apply. Please enter details manually.",
      };
    }

    const title = extractTitle(html);
    const description = extractDescription(html);
    const image = extractImage(html);
    const price = extractPrice(html);
    const siteName = extractMetaContent(html, "og:site_name");

    if (!title && !description && !image) {
      return {
        success: false,
        error: "Could not extract metadata. Please enter details manually.",
      };
    }

    return {
      title,
      description,
      image,
      price,
      siteName,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch metadata. Please enter details manually.",
    };
  }
}
