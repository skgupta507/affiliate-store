"use client";

import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="aspect-square bg-secondary/50 relative overflow-hidden">
              <div className="absolute inset-0 skeleton-shimmer" />
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-secondary rounded" />
              <div className="h-3 w-full bg-secondary rounded" />
              <div className="h-3 w-2/3 bg-secondary rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-20 bg-secondary rounded" />
                <div className="h-8 w-20 bg-secondary rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary border border-border flex items-center justify-center">
          <svg className="w-10 h-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
