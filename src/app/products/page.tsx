"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  const { products, categories } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    // Category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price range
    filtered = filtered.filter((p) => {
      const price = p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating
    if (ratingFilter > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= ratingFilter);
    }

    // Availability
    if (availabilityFilter === "in_stock") {
      filtered = filtered.filter((p) => p.isAffiliate || (p.stock !== undefined && p.stock > 0));
    } else if (availabilityFilter === "on_sale") {
      filtered = filtered.filter((p) => p.originalPrice && p.price && p.originalPrice > p.price);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "popular":
        filtered.sort((a, b) => b.clicks - a.clicks);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "discount":
        filtered.sort((a, b) => {
          const discA = a.originalPrice && a.price ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const discB = b.originalPrice && b.price ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return discB - discA;
        });
        break;
    }

    return filtered;
  }, [products, search, selectedCategory, sortBy, priceRange, ratingFilter, availabilityFilter]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Browse {products.length} curated affiliate deals
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-4 rounded-xl border border-border bg-card backdrop-blur-sm text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-secondary" : ""}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8"
          >
            <div className="p-4 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-4">
              {/* Categories */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === "all"
                        ? "bg-purple-500/20 text-primary border border-purple-500/30"
                        : "bg-card text-muted-foreground border border-border hover:bg-secondary"
                    }`}
                  >
                    All ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.name).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedCategory === cat.name
                            ? "bg-purple-500/20 text-primary border border-purple-500/30"
                            : "bg-card text-muted-foreground border border-border hover:bg-secondary"
                        }`}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Price Range</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">₹</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-20 h-8 px-2 rounded-lg border border-border bg-secondary text-xs text-foreground"
                      placeholder="Min"
                    />
                  </div>
                  <span className="text-muted-foreground">—</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">₹</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-20 h-8 px-2 rounded-lg border border-border bg-secondary text-xs text-foreground"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Rating & Availability */}
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Minimum Rating</p>
                  <div className="flex gap-1.5">
                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRatingFilter(r)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          ratingFilter === r ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "bg-card text-muted-foreground border border-border"
                        }`}
                      >
                        {r === 0 ? "All" : `${r}★+`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Availability</p>
                  <div className="flex gap-1.5">
                    {[
                      { value: "all", label: "All" },
                      { value: "in_stock", label: "In Stock" },
                      { value: "on_sale", label: "On Sale" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAvailabilityFilter(opt.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          availabilityFilter === opt.value ? "bg-green-500/20 text-green-500 border border-green-500/30" : "bg-card text-muted-foreground border border-border"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">{filteredProducts.length} products</Badge>
          {search && (
            <Badge variant="outline">
              Searching: &quot;{search}&quot;
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="default">{selectedCategory}</Badge>
          )}
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
