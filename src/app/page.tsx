"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, Zap, Star, ShoppingCart, Truck, RotateCcw, Shield, Clock, ChevronRight, ExternalLink, Heart, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { useState } from "react";

export default function HomePage() {
  const { products, categories, recentlyViewed } = useStore();
  const [activeTab, setActiveTab] = useState<"new" | "trending" | "toprated">("new");

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 10);
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 10);
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  const topDeals = [...products]
    .filter((p) => p.price && p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discA = ((a.originalPrice! - a.price!) / a.originalPrice!) * 100;
      const discB = ((b.originalPrice! - b.price!) / b.originalPrice!) * 100;
      return discB - discA;
    })
    .slice(0, 10);
  const topRated = [...products]
    .filter((p) => p.rating && p.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);
  const recentlyViewedProducts = products.filter((p) => recentlyViewed.includes(p.id)).slice(0, 10);

  const tabProducts = activeTab === "new" ? recentProducts : activeTab === "trending" ? trendingProducts : topRated;

  return (
    <div>
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-[11px] font-medium">
        FREE SHIPPING on orders over ₹499 | Use code <span className="font-bold">DECOR10</span> for 10% off
      </div>

      {/* Hero + Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
          {/* Category Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-card border border-border rounded-lg p-3 sticky top-20">
              <h3 className="font-bold text-foreground text-xs mb-2 uppercase tracking-wide">Categories</h3>
              <div className="space-y-0.5 max-h-[320px] overflow-y-auto">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.name}`}
                    className="flex items-center justify-between py-1.5 px-2 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors group"
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Banner */}
          <div>
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-border h-[200px] sm:h-[260px]">
              <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                <div>
                  <p className="text-primary font-semibold text-xs mb-1">Trending Collection</p>
                  <h1 className="text-xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
                    Transform Your Space<br />with Beautiful Decor
                  </h1>
                  <p className="text-muted-foreground text-xs mb-4">Starting at ₹299</p>
                  <Link href="/products">
                    <button className="h-9 rounded-md bg-primary px-5 font-semibold text-xs text-primary-foreground shadow-[0_4px_12px_var(--glow-primary)] hover:scale-[1.02] transition-all flex items-center gap-1.5">
                      Shop Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mini banners */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { href: "/deals", label: "Flash Sale", sub: "Up to 50% Off", color: "text-primary" },
                { href: "/products?category=Lighting", label: "New Arrivals", sub: "Designer Lighting", color: "text-amber-600 dark:text-amber-400" },
                { href: "/products?category=Wall+Art+%26+Decor", label: "Best Sellers", sub: "Wall Art", color: "text-green-600 dark:text-green-400" },
              ].map((b) => (
                <Link key={b.label} href={b.href} className="p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
                  <p className={`text-[10px] ${b.color} font-semibold`}>{b.label}</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{b.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Categories - horizontal scroll */}
      <section className="lg:hidden px-4 py-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.name}`}>
              <div className="px-3 py-1.5 rounded-md bg-card border border-border whitespace-nowrap text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="px-4 sm:px-6 lg:px-8 py-3 border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Truck, label: "Free Delivery", desc: "Over ₹499" },
            { icon: RotateCcw, label: "Easy Returns", desc: "7 days" },
            { icon: Shield, label: "Secure Pay", desc: "100% safe" },
            { icon: Clock, label: "24/7 Support", desc: "Always here" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deal of the Day - Horizontal scroll */}
      {topDeals.length > 0 && (
        <HorizontalSection title="Deal of the Day" icon={<Zap className="w-4 h-4 text-amber-500" />} link="/deals">
          {topDeals.map((p) => <MiniProductCard key={p.id} product={p} />)}
        </HorizontalSection>
      )}

      {/* Product Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-3 border-b border-border">
            {[
              { id: "new" as const, label: "New Arrivals" },
              { id: "trending" as const, label: "Trending" },
              { id: "toprated" as const, label: "Top Rated" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {tabProducts.map((p) => <MiniProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Featured - Horizontal */}
      {featuredProducts.length > 0 && (
        <HorizontalSection title="Featured" icon={<Sparkles className="w-4 h-4 text-primary" />} link="/products?filter=featured">
          {featuredProducts.map((p) => <MiniProductCard key={p.id} product={p} />)}
        </HorizontalSection>
      )}

      {/* Recently Viewed - Horizontal */}
      {recentlyViewedProducts.length > 0 && (
        <HorizontalSection title="Recently Viewed" icon={<Clock className="w-4 h-4 text-blue-500" />}>
          {recentlyViewedProducts.map((p) => <MiniProductCard key={p.id} product={p} />)}
        </HorizontalSection>
      )}

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto rounded-lg bg-gradient-to-r from-primary/10 to-amber-500/10 border border-border p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-primary font-bold text-xs">25% DISCOUNT</p>
              <h2 className="text-lg font-bold text-foreground">Interior Design Collection</h2>
              <p className="text-muted-foreground text-xs">Save favorites, track orders, get exclusive deals.</p>
            </div>
            <Link href="/signup">
              <button className="h-9 rounded-md bg-primary px-5 font-semibold text-xs text-primary-foreground shadow-[0_4px_12px_var(--glow-primary)] hover:scale-[1.02] transition-all flex items-center gap-1.5 shrink-0">
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {products.length === 0 && (
        <section className="px-4 py-12 text-center">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-lg font-bold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground text-sm mb-4">We&apos;re curating the best interior products for you.</p>
          <Link href="/categories">
            <button className="h-9 rounded-md bg-primary px-5 text-xs font-semibold text-primary-foreground mx-auto flex items-center gap-1.5">
              Browse Categories <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </section>
      )}
    </div>
  );
}

/* Horizontal scrolling section like Anon */
function HorizontalSection({ title, icon, link, children }: {
  title: string;
  icon?: React.ReactNode;
  link?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            {icon}{title}
          </h2>
          {link && (
            <Link href={link} className="text-[11px] text-primary font-medium hover:underline flex items-center gap-0.5">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {children}
        </div>
      </div>
    </section>
  );
}

/* Compact product card for horizontal rows - Anon style */
function MiniProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist, incrementClicks, addToCart, cart } = useStore();
  const isAffiliate = product.isAffiliate || (product.affiliateUrl && product.affiliateUrl.trim() !== "");
  const isWishlisted = wishlist.includes(product.id);
  const isInCart = cart.some((item) => item.productId === product.id);
  const [added, setAdded] = useState(false);

  const discount = product.price && product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAction = () => {
    if (isAffiliate) {
      incrementClicks(product.id);
      window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
    } else {
      addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="shrink-0 w-[150px] sm:w-[160px] rounded-lg border border-border bg-card overflow-hidden group hover:shadow-sm transition-shadow">
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-[120px] bg-secondary/50 overflow-hidden">
          {product.image ? (
            <Image src={product.image} alt={product.title} fill sizes="160px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
              <ShoppingCart className="w-8 h-8" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500 text-white">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={`w-3 h-3 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-2">
        <p className="text-[10px] text-muted-foreground uppercase">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[11px] font-medium text-foreground line-clamp-2 leading-tight mt-0.5 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        {product.rating && (
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating!) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-1">
          {product.price && <span className="text-xs font-bold text-foreground">{formatPrice(product.price)}</span>}
          {product.originalPrice && product.originalPrice > (product.price || 0) && (
            <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={handleAction}
          className={`w-full mt-1.5 h-7 rounded text-[10px] font-semibold transition-all flex items-center justify-center gap-1 ${
            added || isInCart
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
              : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {isAffiliate ? (<>Buy Now <ExternalLink className="w-2.5 h-2.5" /></>) :
           added ? (<><Check className="w-2.5 h-2.5" /> Added</>) :
           isInCart ? (<><Check className="w-2.5 h-2.5" /> In Cart</>) :
           (<><ShoppingCart className="w-2.5 h-2.5" /> Add to Cart</>)}
        </button>
      </div>
    </div>
  );
}
