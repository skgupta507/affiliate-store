"use client";

import { MetadataResult } from "@/types";

/**
 * Fetches product metadata using the Next.js API route (edge function).
 * This avoids CORS issues entirely since the fetch happens server-side.
 */
export async function fetchMetadata(url: string): Promise<MetadataResult> {
  try {
    const response = await fetch("/api/metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (data.success) {
      return {
        title: data.title,
        description: data.description,
        image: data.image,
        price: data.price,
        originalPrice: data.originalPrice,
        category: data.category,
        tags: data.tags,
        rating: data.rating,
        platform: data.platform,
        siteName: data.siteName,
        success: true,
      };
    }

    return { success: false, error: data.error || "Could not fetch metadata." };
  } catch (err: any) {
    return {
      success: false,
      error: "Network error: " + (err?.message || "Could not reach the server."),
    };
  }
}
