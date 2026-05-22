"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function SearchContent() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);

  // Sync URL query param to local state
  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.platform.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
    );
  }, [products, query]);

  const suggestions = useMemo(() => {
    const allTags = products.flatMap((p) => p.tags);
    const unique = [...new Set(allTags)];
    return unique.slice(0, 10);
  }, [products]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-foreground mb-6">Search Products</h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, category, or tag..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl"
              autoFocus
            />
          </div>

          {/* Suggestions */}
          {!query && suggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-muted-foreground">Try:</span>
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {query && (
          <div className="mb-6">
            <Badge variant="secondary">
              {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </Badge>
          </div>
        )}

        {query && results.length > 0 && <ProductGrid products={results} />}

        {query && results.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try different keywords or browse our categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-4 py-20 text-center text-muted-foreground">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
