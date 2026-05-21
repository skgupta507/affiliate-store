"use client";

import { use, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/products/ProductGrid";
import { formatPrice, getRelativeTime } from "@/lib/utils";
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
  } = useStore();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id);
    }
  }, [product, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
        <p className="text-white/50 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
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

  const handleBuyNow = () => {
    if (product.isAffiliate) {
      incrementClicks(product.id);
      window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
    } else {
      addToCart(product.id);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id);
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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link href="/" className="hover:text-white/60">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white/60">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-white/60">{product.category}</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image Column */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-28"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isFeatured && (
                    <Badge className="gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </Badge>
                  )}
                  {product.isTrending && (
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
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? "fill-red-500 text-red-500" : "text-white/70"
                    }`}
                  />
                </button>
              </div>

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
            </motion.div>
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
              <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
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
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  {product.reviewCount && (
                    <span className="text-sm text-white/50">
                      {product.reviewCount.toLocaleString()} ratings & reviews
                    </span>
                  )}
                </div>
              )}

              {/* Price Section */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {product.price && (
                    <span className="text-3xl font-bold text-white">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > (product.price || 0) && (
                    <span className="text-lg text-white/40 line-through">
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
                  <p className="text-xs text-white/30 mt-2">
                    Inclusive of all taxes. Price may vary on the seller&apos;s website.
                  </p>
                )}
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <Truck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-[10px] text-white/50">Free Delivery</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <RotateCcw className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-[10px] text-white/50">Easy Returns</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <ShieldCheck className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-[10px] text-white/50">Secure Payment</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-[10px] text-white/50">Genuine Product</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-white/70 mb-3">Description</h3>
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
                  {product.description || "No description available for this product."}
                </p>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
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
                  <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
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
                              : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
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
              <div className="flex items-center gap-4 text-xs text-white/40 pt-2">
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
              <div className="hidden lg:flex gap-3 pt-4 border-t border-white/10">
                {product.isAffiliate ? (
                  <Button size="lg" onClick={handleBuyNow} className="flex-1 gap-2 text-base">
                    Buy Now on {product.platform} <ExternalLink className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={handleAddToCart} className="flex-1 gap-2 text-base">
                      {isInCart ? "Added to Cart ✓" : "Add to Cart"} <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Link href="/cart">
                      <Button variant="outline" size="lg" className="gap-2">
                        Buy Now
                      </Button>
                    </Link>
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
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Similar Products</h2>
              <Link href={`/products?category=${product.category}`}>
                <Button variant="ghost" className="gap-1 text-white/60 text-sm">
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
              <h2 className="text-xl font-bold text-white">
                More from {product.platform}
              </h2>
            </div>
            <ProductGrid products={recommendedProducts} />
          </section>
        )}

        {/* You May Also Like */}
        {products.length > 5 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6">You May Also Like</h2>
            <ProductGrid
              products={products
                .filter((p) => p.id !== product.id && !relatedProducts.find((r) => r.id === p.id))
                .sort(() => Math.random() - 0.5)
                .slice(0, 4)}
            />
          </section>
        )}
      </div>
    </div>
  );
}
