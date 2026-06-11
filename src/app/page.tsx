"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Zap, Star, ShoppingCart, Truck, RotateCcw, Shield, Clock, ChevronRight, ChevronLeft, ExternalLink, Heart, Check, Search, Flame } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { useState, useEffect } from "react";
import { useRecommendations } from "@/components/products/Recommendations";
import { OrganizationJsonLd } from "@/components/SEO";
import { CountdownTimer } from "@/components/CountdownTimer";

export default function HomePage() {
  const { products, categories, recentlyViewed } = useStore();
  const [activeTab, setActiveTab] = useState<"new" | "trending" | "toprated">("new");
  const [heroSlide, setHeroSlide] = useState(0);
  const { personalizedPicks } = useRecommendations();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 14);
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 14);
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 14);
  const topDeals = [...products]
    .filter((p) => p.price && p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discA = ((a.originalPrice! - a.price!) / a.originalPrice!) * 100;
      const discB = ((b.originalPrice! - b.price!) / b.originalPrice!) * 100;
      return discB - discA;
    })
    .slice(0, 7);
  const topRated = [...products]
    .filter((p) => p.rating && p.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 14);
  const recentlyViewedProducts = products.filter((p) => recentlyViewed.includes(p.id)).slice(0, 7);
  const bestSellers = [...products]
    .sort((a, b) => (b.purchaseCount || 0) + b.clicks - ((a.purchaseCount || 0) + a.clicks))
    .slice(0, 7);

  // Top 3 categories with products for category rows
  const topCategories = categories
    .map((cat) => ({ ...cat, products: products.filter((p) => p.category === cat.name) }))
    .filter((cat) => cat.products.length >= 3)
    .slice(0, 3);

  const tabProducts = activeTab === "new" ? recentProducts : activeTab === "trending" ? trendingProducts : topRated;

  // Hero carousel auto-rotate
  const heroSlides = [
    { title: "Transform Your Space\nwith Beautiful Decor", subtitle: "Trending Collection", cta: "Shop Now", price: "Starting at ₹299", href: "/products", color: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
    { title: "Up to 50% Off\non Lighting & Lamps", subtitle: "Flash Sale", cta: "Shop Deals", price: "Limited time only", href: "/deals", color: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30" },
    { title: "New Arrivals\nWall Art Collection", subtitle: "Just Launched", cta: "Explore", price: "Handcrafted pieces", href: "/products?category=Wall+Art+%26+Decor", color: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* SEO Structured Data */}
      <OrganizationJsonLd
        name="TheIdeaDecorator"
        url="https://theideadecorator.in"
        logo="/logo.svg"
        description="Discover curated home decor, furniture, electronics, and lifestyle products."
      />

      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-[11px] font-medium">
        FREE SHIPPING on orders over ₹499 | Use code <span className="font-bold">DECOR10</span> for 10% off
      </div>

      {/* Hero Search Bar */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for furniture, lighting, wall art, decor..."
              className="w-full h-12 pl-12 pr-24 rounded-full bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent((e.target as HTMLInputElement).value.trim())}`;
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = (e.currentTarget as HTMLElement).previousElementSibling as HTMLInputElement;
                if (input?.value.trim()) window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:scale-[1.02] transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Hero + Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-3">
          {/* Category Sidebar - ALL categories */}
          <div className="hidden lg:block">
            <div className="bg-card border border-border rounded-lg p-3">
              <h3 className="font-bold text-foreground text-xs mb-2 uppercase tracking-wide">Categories</h3>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.name}`}
                    className="flex items-center justify-between py-1.5 px-2 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors group"
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Banner Carousel */}
          <div>
            <div className="relative rounded-lg overflow-hidden border border-border h-[180px] sm:h-[240px]">
              {heroSlides.map((slide, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 flex items-center px-6 sm:px-10 bg-gradient-to-r ${slide.color} transition-opacity duration-500 ${i === heroSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                  <div>
                    <p className="text-primary font-semibold text-xs mb-1">{slide.subtitle}</p>
                    <h1 className="text-xl sm:text-3xl font-bold text-foreground leading-tight mb-2 whitespace-pre-line">
                      {slide.title}
                    </h1>
                    <p className="text-muted-foreground text-xs mb-3">{slide.price}</p>
                    <Link href={slide.href}>
                      <button className="h-8 rounded-md bg-primary px-4 font-semibold text-xs text-primary-foreground shadow-[0_4px_12px_var(--glow-primary)] hover:scale-[1.02] transition-all flex items-center gap-1.5">
                        {slide.cta} <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
              {/* Carousel Controls */}
              <button onClick={() => setHeroSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/70 border border-border flex items-center justify-center text-foreground opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setHeroSlide((s) => (s + 1) % heroSlides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/70 border border-border flex items-center justify-center text-foreground opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setHeroSlide(i)} className={`w-2 h-2 rounded-full transition-all ${i === heroSlide ? "bg-primary w-5" : "bg-foreground/30"}`} />
                ))}
              </div>
            </div>
            {/* Mini banners */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { href: "/deals", label: "Flash Sale", sub: "Up to 50% Off", color: "text-primary" },
                { href: "/products?category=Lighting", label: "New Arrivals", sub: "Designer Lighting", color: "text-amber-600 dark:text-amber-400" },
                { href: "/products?category=Wall+Art+%26+Decor", label: "Best Sellers", sub: "Wall Art", color: "text-green-600 dark:text-green-400" },
              ].map((b) => (
                <Link key={b.label} href={b.href} className="p-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
                  <p className={`text-[10px] ${b.color} font-semibold`}>{b.label}</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{b.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Categories - ALL categories horizontal scroll */}
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
      <section className="px-4 sm:px-6 lg:px-8 py-2 border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { icon: Truck, label: "Free Delivery", desc: "Over ₹499" },
            { icon: RotateCcw, label: "Easy Returns", desc: "7 days" },
            { icon: Shield, label: "Secure Pay", desc: "100% safe" },
            { icon: Clock, label: "24/7 Support", desc: "Always here" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 py-1">
              <item.icon className="w-3.5 h-3.5 text-primary shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Countdown */}
      {topDeals.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Flash Sale — Ends Today!</p>
                  <p className="text-[10px] text-muted-foreground">Up to {topDeals[0] && topDeals[0].originalPrice && topDeals[0].price ? Math.round(((topDeals[0].originalPrice - topDeals[0].price) / topDeals[0].originalPrice) * 100) : 50}% off on top picks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CountdownTimer />
                <Link href="/deals">
                  <button className="h-8 rounded-md bg-red-500 px-4 font-semibold text-xs text-white hover:scale-[1.02] transition-all flex items-center gap-1.5">
                    View Deals <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Deal of the Day - 7 per row grid */}
      {topDeals.length > 0 && (
        <GridSection title="Deal of the Day" icon={<Zap className="w-3.5 h-3.5 text-amber-500" />} link="/deals">
          {topDeals.map((p) => <MiniProductCard key={p.id} product={p} />)}
        </GridSection>
      )}

      {/* Product Tabs - 7 per row grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-3">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {tabProducts.map((p) => <MiniProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Featured - 7 per row grid */}
      {featuredProducts.length > 0 && (
        <GridSection title="Featured" icon={<Sparkles className="w-3.5 h-3.5 text-primary" />} link="/products?filter=featured">
          {featuredProducts.map((p) => <MiniProductCard key={p.id} product={p} />)}
        </GridSection>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <GridSection title="Best Sellers" icon={<Star className="w-3.5 h-3.5 text-amber-500" />} link="/products">
          {bestSellers.map((p) => <MiniProductCard key={p.id} product={p} />)}
        </GridSection>
      )}

      {/* Category Product Rows */}
      {topCategories.map((cat) => (
        <GridSection key={cat.id} title={`Top in ${cat.name}`} icon={<Sparkles className="w-3.5 h-3.5 text-primary" />} link={`/products?category=${cat.name}`}>
          {cat.products.slice(0, 7).map((p) => <MiniProductCard key={p.id} product={p} />)}
        </GridSection>
      ))}

      {/* Brands We Source From */}
      {products.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Trusted Brands & Platforms</p>
            <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap opacity-60">
              {["Amazon", "Flipkart", "Myntra", "Ajio", "Meesho", "Pepperfry"].map((brand) => (
                <span key={brand} className="text-sm sm:text-base font-bold text-muted-foreground">{brand}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed - 7 per row grid */}
      {recentlyViewedProducts.length > 0 && (
        <GridSection title="Recently Viewed" icon={<Clock className="w-3.5 h-3.5 text-blue-500" />}>
          {recentlyViewedProducts.map((p) => <MiniProductCard key={p.id} product={p} />)}
        </GridSection>
      )}

      {/* Personalized Recommendations */}
      {personalizedPicks.length > 0 && (
        <GridSection title="Recommended For You" icon={<Sparkles className="w-3.5 h-3.5 text-purple-500" />} link="/products">
          {personalizedPicks.map((p) => <MiniProductCard key={p.id} product={p} />)}
        </GridSection>
      )}

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto rounded-lg bg-gradient-to-r from-primary/10 to-amber-500/10 border border-border p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-primary font-bold text-xs">25% DISCOUNT</p>
              <h2 className="text-base font-bold text-foreground">Interior Design Collection</h2>
              <p className="text-muted-foreground text-xs">Save favorites, track orders, get exclusive deals.</p>
            </div>
            <Link href="/signup">
              <button className="h-8 rounded-md bg-primary px-4 font-semibold text-xs text-primary-foreground shadow-[0_4px_12px_var(--glow-primary)] hover:scale-[1.02] transition-all flex items-center gap-1.5 shrink-0">
                Shop Now <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {products.length === 0 && (
        <section className="px-4 py-10 text-center">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-lg font-bold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground text-sm mb-4">We&apos;re curating the best interior products for you.</p>
          <Link href="/categories">
            <button className="h-8 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground mx-auto flex items-center gap-1.5">
              Browse Categories <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </section>
      )}
    </div>
  );
}

/* Grid section - 7 per row, same as Deal of the Day */
function GridSection({ title, icon, link, children }: {
  title: string;
  icon?: React.ReactNode;
  link?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-3">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
          {children}
        </div>
      </div>
    </section>
  );
}

/* Compact product card - same size everywhere */
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
    <div className="rounded-lg border border-border bg-card overflow-hidden group hover:shadow-sm transition-shadow">
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[5/4] bg-secondary/50 overflow-hidden">
          {product.image ? (
            <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
              <ShoppingCart className="w-6 h-6" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500 text-white">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={`w-2.5 h-2.5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-2">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[11px] font-medium text-foreground line-clamp-2 leading-tight mt-0.5 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        {product.rating && (
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-2 h-2 ${i < Math.floor(product.rating!) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 mt-1">
          {product.price && <span className="text-[11px] font-bold text-foreground">{formatPrice(product.price)}</span>}
          {product.originalPrice && product.originalPrice > (product.price || 0) && (
            <span className="text-[9px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={handleAction}
          className={`w-full mt-1.5 h-6 rounded text-[10px] font-semibold transition-all flex items-center justify-center gap-1 ${
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
