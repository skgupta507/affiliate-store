"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/products/ProductGrid";
import { formatPrice, getRelativeTime } from "@/lib/utils";
import { ReviewSection } from "@/components/products/ReviewSection";
import { ProductQA } from "@/components/products/ProductQA";
import { DeliveryEstimator } from "@/components/products/DeliveryEstimator";
import { StickyCartBar } from "@/components/products/StickyCartBar";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/SEO";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Share2,
  Star,
  TrendingUp,
  Sparkles,
  Clock,
  Tag,
  BarChart3,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  List,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    products,
    wishlist,
    toggleWishlist,
    incrementClicks,
    addToRecentlyViewed,
    watchlists,
    addToWatchlist,
    addToCart,
    cart,
    reviews,
    addReview,
    markReviewHelpful,
    orders,
    incrementViewCount,
  } = useStore();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id);
      incrementViewCount(product.id);
    }
  }, [product, addToRecentlyViewed, incrementViewCount]);

  if (!product) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const recommendedProducts = products
    .filter((p) => p.id !== product.id && p.platform === product.platform)
    .slice(0, 4);
  const discount = product.price && product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isInCart = cart.some((item) => item.productId === product.id);
  const isAffiliate = product.isAffiliate || (product.affiliateUrl && product.affiliateUrl.trim() !== "");

  const handleBuyNow = () => {
    if (isAffiliate) {
      incrementClicks(product.id);
      window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
    } else {
      // Buy Now: add to cart and go directly to checkout
      if (!isInCart) addToCart(product.id);
      window.location.href = "/checkout";
    }
  };

  const handleAddToCart = () => {
    if (isAffiliate) {
      incrementClicks(product.id);
      window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
    } else {
      addToCart(product.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* SEO Structured Data */}
        <ProductJsonLd
          product={product}
          reviews={reviews.filter((r) => r.productId === product.id)}
          url={typeof window !== "undefined" ? window.location.href : ""}
        />
        <BreadcrumbJsonLd items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: product.category, url: `/products?category=${product.category}` },
          { name: product.title, url: `/products/${product.id}` },
        ]} />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-muted-foreground">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-muted-foreground">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-muted-foreground">{product.category}</Link>
          <span>/</span>
          <span className="text-muted-foreground truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image Gallery Column */}
          <div className="lg:col-span-5">
            <ProductImageGallery
              images={[product.image, ...(product.images || [])].filter(Boolean) as string[]}
              title={product.title}
              isFeatured={product.isFeatured}
              isTrending={product.isTrending}
              discount={discount}
              isWishlisted={isWishlisted}
              onToggleWishlist={() => toggleWishlist(product.id)}
            />

              {/* Action buttons below image on mobile */}
              <div className="flex gap-3 mt-4 lg:hidden">
                <Button size="lg" onClick={handleBuyNow} className="flex-1 gap-2">
                  Buy Now <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => toggleWishlist(product.id)}>
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Platform & Category */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{product.platform}</Badge>
                <Badge variant="outline">{product.category}</Badge>
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              {product.rating && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-sm font-bold text-green-400">{product.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-green-400 text-green-400" />
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < product.rating!
                            ? "fill-yellow-400/50 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  {product.reviewCount && (
                    <span className="text-sm text-muted-foreground">
                      {product.reviewCount.toLocaleString()} ratings & reviews
                    </span>
                  )}
                </div>
              )}

              {/* Price Section */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {product.price && (
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > (product.price || 0) && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-lg font-semibold text-green-400">
                      {discount}% off
                    </span>
                  )}
                </div>
                {product.price && (
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    Inclusive of all taxes. Price may vary on the seller&apos;s website.
                  </p>
                )}
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                  <Truck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Free Delivery</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                  <RotateCcw className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Easy Returns</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                  <ShieldCheck className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Secure Payment</p>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Genuine Product</p>
                </div>
              </div>

              {/* Social Proof / Urgency */}
              <div className="space-y-2">
                {!product.isAffiliate && product.stock !== undefined && product.stock > 0 && product.stock <= 10 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-red-500 text-xs font-semibold">🔥 Only {product.stock} left in stock — order soon!</span>
                  </div>
                )}
                {product.purchaseCount && product.purchaseCount > 0 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-green-600 dark:text-green-400 text-xs font-medium">✓ {product.purchaseCount} purchased this week</span>
                  </div>
                )}
                {product.viewCount && product.viewCount > 10 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">👁 {product.viewCount} people viewed this recently</span>
                  </div>
                )}
              </div>

              {/* Delivery Estimator */}
              <DeliveryEstimator isAffiliate={!!isAffiliate} />

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description || "No description available for this product."}
                </p>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Watchlist */}
              {watchlists.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <List className="w-4 h-4" /> Add to Watchlist
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {watchlists.map((wl) => {
                      const isInList = wl.productIds.includes(product.id);
                      return (
                        <button
                          key={wl.id}
                          onClick={() => !isInList && addToWatchlist(wl.id, product.id)}
                          disabled={isInList}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isInList
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-card text-muted-foreground border border-border hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {isInList ? "✓ " : "+ "}{wl.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Added {getRelativeTime(product.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" /> {product.clicks} clicks
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> {product.platform}
                </span>
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex gap-3 pt-4 border-t border-border">
                {product.isAffiliate ? (
                  <Button size="lg" onClick={handleBuyNow} className="flex-1 gap-2 text-base">
                    Buy Now on {product.platform} <ExternalLink className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={handleAddToCart} variant="outline" className="flex-1 gap-2 text-base">
                      {isInCart ? "Added to Cart ✓" : "Add to Cart"} <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Button size="lg" onClick={handleBuyNow} className="flex-1 gap-2 text-base">
                      Buy Now <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => toggleWishlist(product.id)}
                  className="gap-2"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare} className="gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>

              {/* Stock Status */}
              {!product.isAffiliate && (
                <div className="pt-3">
                  {product.stock === undefined ? null : product.stock > 10 ? (
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1">✓ In Stock</p>
                  ) : product.stock > 0 ? (
                    <p className="text-xs text-amber-500 font-medium flex items-center gap-1">⚠ Only {product.stock} left in stock</p>
                  ) : (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">✕ Out of Stock</p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <ReviewSection
            productId={product.id}
            reviews={reviews.filter((r) => r.productId === product.id)}
            onAddReview={(review) => {
              // Check if user purchased this product for "verified purchase" badge
              const hasPurchased = orders.some((o) =>
                o.status !== "cancelled" && o.items.some((item) => item.productId === product.id)
              );
              addReview({ ...review, verifiedPurchase: hasPurchased });
            }}
          />
        </section>

        {/* Q&A Section */}
        <section className="mt-16">
          <ProductQA productId={product.id} />
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Similar Products</h2>
              <Link href={`/products?category=${product.category}`}>
                <Button variant="ghost" className="gap-1 text-muted-foreground text-sm">
                  View All <ArrowLeft className="w-3 h-3 rotate-180" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}

        {/* Recommended */}
        {recommendedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                More from {product.platform}
              </h2>
            </div>
            <ProductGrid products={recommendedProducts} />
          </section>
        )}

        {/* You May Also Like */}
        {products.length > 5 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">You May Also Like</h2>
            <ProductGrid
              products={products
                .filter((p) => p.id !== product.id && !relatedProducts.find((r) => r.id === p.id))
                .sort(() => Math.random() - 0.5)
                .slice(0, 4)}
            />
          </section>
        )}
      </div>

      {/* Sticky Add-to-Cart Bar */}
      <StickyCartBar
        title={product.title}
        price={product.price}
        originalPrice={product.originalPrice}
        image={product.image}
        isAffiliate={!!isAffiliate}
        isInCart={isInCart}
        isWishlisted={isWishlisted}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={() => toggleWishlist(product.id)}
      />
    </div>
  );
}


/* ============================================
   Product Image Gallery — Amazon-style carousel
   with thumbnails, arrows, and zoom
   ============================================ */
function ProductImageGallery({
  images,
  title,
  isFeatured,
  isTrending,
  discount,
  isWishlisted,
  onToggleWishlist,
}: {
  images: string[];
  title: string;
  isFeatured: boolean;
  isTrending: boolean;
  discount: number;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Ensure at least one image placeholder
  const allImages = images.length > 0 ? images : [];

  const goNext = () => {
    if (allImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const goPrev = () => {
    if (allImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToIndex = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [allImages.length]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-28"
    >
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-card group cursor-zoom-in"
        onClick={() => allImages.length > 0 && setIsZoomed(true)}
      >
        {allImages.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <Image
                src={allImages[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain p-4"
                priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        )}

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 border border-border shadow-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 border border-border shadow-md flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
            {currentIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isFeatured && (
            <Badge className="gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </Badge>
          )}
          {isTrending && (
            <Badge variant="warning" className="gap-1">
              <TrendingUp className="w-3 h-3" /> Trending
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="success" className="text-sm font-bold">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                idx === currentIndex
                  ? "border-primary shadow-md ring-2 ring-primary/20"
                  : "border-border hover:border-muted-foreground/50 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10"
            >
              ✕
            </button>

            {/* Navigation in zoom */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Zoomed Image */}
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-[90vw] h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allImages[currentIndex]}
                alt={`${title} - Full size ${currentIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>

            {/* Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                {currentIndex + 1} / {allImages.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
