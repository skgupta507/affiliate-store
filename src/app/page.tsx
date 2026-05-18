"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap, Shield, Clock, Heart, Tag, Star, Gift } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const { products, categories, recentlyViewed, wishlist } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  const topDeals = [...products]
    .filter((p) => p.price && p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discA = ((a.originalPrice! - a.price!) / a.originalPrice!) * 100;
      const discB = ((b.originalPrice! - b.price!) / b.originalPrice!) * 100;
      return discB - discA;
    })
    .slice(0, 4);
  const topRated = [...products]
    .filter((p) => p.rating && p.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);
  const recentlyViewedProducts = products.filter((p) => recentlyViewed.includes(p.id)).slice(0, 4);

  // Category stats
  const popularCategories = categories
    .map((cat) => ({
      ...cat,
      count: products.filter((p) => p.category === cat.name).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "6s" }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/70">Curated Affiliate Deals</span>
              <Badge variant="success" className="text-[10px]">New</Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Discover </span>
              <span className="text-gradient">Premium</span>
              <br />
              <span className="text-white">Product Deals</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10">
              Handpicked products from Amazon, Flipkart, and top brands. Find the best deals with our curated affiliate marketplace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Browse Products <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="gap-2">
                  Create Account <Gift className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
          >
            {[
              { label: "Products", value: products.length.toString(), icon: Zap },
              { label: "Categories", value: categories.length.toString(), icon: Tag },
              { label: "Platforms", value: "5+", icon: Shield },
              { label: "Deals Daily", value: "New", icon: Sparkles },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <stat.icon className="w-5 h-5 text-purple-400 mb-2 mx-auto" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Categories */}
      {popularCategories.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                Popular Categories
              </h2>
              <Link href="/categories">
                <Button variant="ghost" className="gap-1 text-white/60 text-sm">
                  All Categories <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {popularCategories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.name}`}>
                  <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer group">
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                    <span className="ml-2 text-xs text-white/30">({cat.count})</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Deals */}
      {topDeals.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-400" />
                  Top Deals
                </h2>
                <p className="text-sm text-white/50 mt-1">Biggest discounts right now</p>
              </div>
              <Link href="/products">
                <Button variant="ghost" className="gap-1 text-white/60">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={topDeals} />
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Featured Products
                </h2>
                <p className="text-sm text-white/50 mt-1">Hand-picked deals just for you</p>
              </div>
              <Link href="/products?filter=featured">
                <Button variant="ghost" className="gap-1 text-white/60">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  Trending Now
                </h2>
                <p className="text-sm text-white/50 mt-1">Most popular products this week</p>
              </div>
              <Link href="/products?filter=trending">
                <Button variant="ghost" className="gap-1 text-white/60">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={trendingProducts} />
          </div>
        </section>
      )}

      {/* Top Rated */}
      {topRated.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Top Rated
                </h2>
                <p className="text-sm text-white/50 mt-1">Highest rated by users</p>
              </div>
            </div>
            <ProductGrid products={topRated} />
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Recently Viewed
                </h2>
                <p className="text-sm text-white/50 mt-1">Continue where you left off</p>
              </div>
            </div>
            <ProductGrid products={recentlyViewedProducts} />
          </div>
        </section>
      )}

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Recently Added</h2>
                <p className="text-sm text-white/50 mt-1">Fresh deals added to our collection</p>
              </div>
              <Link href="/products">
                <Button variant="ghost" className="gap-1 text-white/60">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={recentProducts} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Never Miss a Deal
              </h2>
              <p className="text-white/50 mb-6 max-w-lg mx-auto">
                Create an account to save your favorite products, build watchlists, and get notified about price drops.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="glass" size="lg">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {products.length === 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-purple-400/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Coming Soon</h2>
            <p className="text-white/50 mb-6">
              We&apos;re curating the best deals for you. Check back soon for amazing products!
            </p>
            <Link href="/categories">
              <Button size="lg" className="gap-2">
                Browse Categories <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
