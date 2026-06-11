"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { Product } from "@/types";

/**
 * Smart product recommendation engine based on:
 * - Browsing history (recently viewed)
 * - Cart contents
 * - Category affinity
 * - Purchase history
 */
export function useRecommendations(currentProductId?: string, limit: number = 7): {
  personalizedPicks: Product[];
  frequentlyBoughtTogether: Product[];
  basedOnHistory: Product[];
} {
  const { products, recentlyViewed, cart, orders } = useStore();

  return useMemo(() => {
    // Category affinity from recently viewed
    const viewedProducts = recentlyViewed
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];

    const categoryScores: Record<string, number> = {};
    viewedProducts.forEach((p, i) => {
      categoryScores[p.category] = (categoryScores[p.category] || 0) + (viewedProducts.length - i);
    });

    // Also consider cart items
    cart.forEach((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (p) categoryScores[p.category] = (categoryScores[p.category] || 0) + 5;
    });

    // Personalized picks: products from preferred categories, not already viewed/in cart
    const cartIds = new Set(cart.map((c) => c.productId));
    const viewedIds = new Set(recentlyViewed);
    const excludeIds = new Set([...cartIds, ...viewedIds]);
    if (currentProductId) excludeIds.add(currentProductId);

    const personalizedPicks = products
      .filter((p) => !excludeIds.has(p.id))
      .map((p) => ({ product: p, score: (categoryScores[p.category] || 0) + (p.isTrending ? 3 : 0) + (p.rating || 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.product);

    // Frequently bought together: products from same category as cart items
    const cartCategories = cart
      .map((item) => products.find((p) => p.id === item.productId)?.category)
      .filter(Boolean) as string[];

    const frequentlyBoughtTogether = products
      .filter((p) => cartCategories.includes(p.category) && !cartIds.has(p.id) && p.id !== currentProductId)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);

    // Based on history: similar to recently viewed
    const basedOnHistory = viewedProducts.length > 0
      ? products
          .filter((p) => !viewedIds.has(p.id) && p.id !== currentProductId)
          .filter((p) => viewedProducts.some((v) => v.category === p.category || v.tags.some((t) => p.tags.includes(t))))
          .sort((a, b) => (b.clicks + (b.rating || 0) * 10) - (a.clicks + (a.rating || 0) * 10))
          .slice(0, limit)
      : [];

    return { personalizedPicks, frequentlyBoughtTogether, basedOnHistory };
  }, [products, recentlyViewed, cart, orders, currentProductId, limit]);
}
