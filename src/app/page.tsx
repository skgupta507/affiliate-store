"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap, Star, Gift, ShoppingCart, Truck, RotateCcw, CreditCard, Clock, Tag, Shield, Percent } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useState, useEffect } from "react";

const HERO_KEYWORDS = ["home decor", "furniture", "lighting", "wall art", "interiors", "lifestyle"];

function TextLoop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_KEYWORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      <span className="invisible select-none">home decor</span>
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 text-primary hero-accent-glow"
      >
        {HERO_KEYWORDS[index]}
      </motion.span>
    </span>
  );
}

export default function HomePage() {
  const { products, categories, recentlyViewed } = useStore();

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

  const popularCategories = categories
    .map((cat) => ({
      ...cat,
      count: products.filter((p) => p.category === cat.name).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="relative">
      {/* Hero Section - Myrtle-inspired with text loop */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-20 md:py-28">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-6 font-bold text-4xl sm:text-5xl md:text-7xl leading-tight">
              <span className="block text-foreground">Discover beautiful</span>
              <TextLoop />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mb-8 max-w-2xl text-balance text-muted-foreground text-lg md:text-xl"
          >
            Your one-stop marketplace for curated interior design, home decor, and lifestyle products. Shop directly or find the best deals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/products">
              <button className="group relative h-12 overflow-hidden rounded-lg bg-primary px-8 font-semibold text-primary-foreground shadow-[0_8px_24px_var(--glow-primary)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_32px_var(--glow-primary)]">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
                <span className="relative flex items-center gap-2">
                  Start Shopping
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </Link>
            <Link href="/deals">
              <button className="h-12 rounded-lg border-2 border-primary/30 bg-secondary/50 px-8 font-semibold text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-secondary flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Today&apos;s Deals
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Feature highlights - bento style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-16 max-w-3xl mx-auto w-full px-4"
        >
          {[
            { label: "Products", value: products.length.toString(), icon: ShoppingCart },
            { label: "Free Delivery", value: "₹499+", icon: Truck },
            { label: "Easy Returns", value: "7 Days", icon: RotateCcw },
            { label: "Secure Pay", value: "100%", icon: Shield },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-glow-hover p-4 rounded-xl bg-card border border-border text-center"
            >
              <stat.icon className="w-5 h-5 text-primary mb-2 mx-auto" />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Popular Categories */}
      {popularCategories.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Shop by Category
              </h2>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                All Categories <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularCategories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.name}`}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2.5 rounded-lg bg-card border border-border hover:border-primary/40 transition-all cursor-pointer card-hover-transition"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {cat.name}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">({cat.count})</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Deals */}
      {topDeals.length > 0 && (
        <Section
          title="Top Deals"
          subtitle="Biggest discounts right now"
          icon={<Percent className="w-5 h-5 text-green-500" />}
          link="/deals"
        >
          <ProductGrid products={topDeals} />
        </Section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <Section
          title="Featured Products"
          subtitle="Hand-picked for your home"
          icon={<Sparkles className="w-5 h-5 text-primary" />}
          link="/products?filter=featured"
        >
          <ProductGrid products={featuredProducts} />
        </Section>
      )}

      {/* Trending */}
      {trendingProducts.length > 0 && (
        <Section
          title="Trending Now"
          subtitle="Most popular this week"
          icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
          link="/products?filter=trending"
        >
          <ProductGrid products={trendingProducts} />
        </Section>
      )}

      {/* Top Rated */}
      {topRated.length > 0 && (
        <Section
          title="Top Rated"
          subtitle="Highest rated by customers"
          icon={<Star className="w-5 h-5 text-amber-500" />}
        >
          <ProductGrid products={topRated} />
        </Section>
      )}

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <Section
          title="Recently Viewed"
          subtitle="Continue where you left off"
          icon={<Clock className="w-5 h-5 text-blue-500" />}
        >
          <ProductGrid products={recentlyViewedProducts} />
        </Section>
      )}

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <Section
          title="Recently Added"
          subtitle="Fresh products in our collection"
          link="/products"
        >
          <ProductGrid products={recentProducts} />
        </Section>
      )}

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Never Miss a Deal
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Create an account to save favorites, track orders, build wishlists, and get notified about price drops.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/signup">
                  <button className="h-11 rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-[0_4px_12px_var(--glow-primary)] transition-all hover:scale-[1.02] flex items-center gap-2">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/products">
                  <button className="h-11 rounded-lg border border-border bg-secondary px-6 font-medium text-foreground transition-all hover:bg-accent">
                    Browse Products
                  </button>
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
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary border border-border flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              We&apos;re curating the best interior products for you. Check back soon!
            </p>
            <Link href="/categories">
              <button className="h-11 rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-[0_4px_12px_var(--glow-primary)] flex items-center gap-2 mx-auto">
                Browse Categories <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function Section({ title, subtitle, icon, link, children }: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  link?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {icon}
              {title}
            </h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {link && (
            <Link href={link} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
