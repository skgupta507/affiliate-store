"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink, Star, TrendingUp, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, truncateText, getRelativeTime } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, wishlist, incrementClicks } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const handleBuyNow = () => {
    incrementClicks(product.id);
    window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isFeatured && (
          <Badge variant="default" className="gap-1">
            <Sparkles className="w-3 h-3" /> Featured
          </Badge>
        )}
        {product.isTrending && (
          <Badge variant="warning" className="gap-1">
            <TrendingUp className="w-3 h-3" /> Trending
          </Badge>
        )}
        {new Date().getTime() - new Date(product.createdAt).getTime() < 7 * 86400000 && (
          <Badge variant="success">New</Badge>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-white/70"
          }`}
        />
      </button>

      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-white/0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <ShoppingBagIcon />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-[10px]">
            {product.platform}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {product.category}
          </Badge>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-1">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-white/50 line-clamp-2 mb-3">
          {truncateText(product.description, 80)}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                }`}
              />
            ))}
            <span className="text-xs text-white/40 ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            {product.price && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-white/40 line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>
            )}
          </div>
          <Button size="sm" onClick={handleBuyNow} className="gap-1">
            Buy Now <ExternalLink className="w-3 h-3" />
          </Button>
        </div>

        <p className="text-[10px] text-white/30 mt-2">
          Added {getRelativeTime(product.createdAt)}
        </p>
      </div>
    </motion.div>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
