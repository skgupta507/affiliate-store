"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SearchPage() {
  const { products } = useStore();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.platform.toLowerCase().includes(q)
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
          <h1 className="text-3xl font-bold text-white mb-6">Search Products</h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
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
              <span className="text-xs text-white/40">Try:</span>
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
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

        {query && <ProductGrid products={results} />}
      </div>
    </div>
  );
}
