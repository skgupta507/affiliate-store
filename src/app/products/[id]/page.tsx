"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useEffect } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, wishlist, toggleWishlist, incrementClicks, addToRecentlyViewed } = useStore();
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

  const handleBuyNow = () => {
    incrementClicks(product.id);
    window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
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
        {/* Back button */}
        <Link href="/products">
          <Button variant="ghost" className="gap-2 mb-6 text-white/60">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5"
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            )}

            {/* Badges overlay */}
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
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{product.platform}</Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/50">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            {product.price && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-white/40 line-through">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                    <Badge variant="success">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-white/60 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <Tag className="w-4 h-4 text-white/40" />
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-4 text-sm text-white/40 mb-8">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Added {getRelativeTime(product.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> {product.clicks} clicks
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button size="lg" onClick={handleBuyNow} className="flex-1 gap-2">
                Buy Now <ExternalLink className="w-4 h-4" />
              </Button>
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}
