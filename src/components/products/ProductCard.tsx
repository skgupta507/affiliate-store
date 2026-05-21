"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink, Star, TrendingUp, Sparkles, ShoppingCart, Check } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { formatPrice, truncateText, getRelativeTime } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, wishlist, incrementClicks, addToCart, cart } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const isInCart = cart.some((item) => item.productId === product.id);
  const [justAdded, setJustAdded] = useState(false);

  const discount = product.price && product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleBuyNow = () => {
    if (product.isAffiliate) {
      incrementClicks(product.id);
      window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
    } else {
      addToCart(product.id);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group card-glow-hover rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isFeatured && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold border border-primary/20">
            <Sparkles className="w-2.5 h-2.5" /> Featured
          </span>
        )}
        {product.isTrending && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-500/20">
            <TrendingUp className="w-2.5 h-2.5" /> Trending
          </span>
        )}
        {discount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold border border-green-500/20">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center transition-all hover:scale-110 hover:border-primary/50"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
              <ShoppingBagIcon />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Platform & Category */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
            {product.platform}
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-border text-muted-foreground">
            {product.category}
          </span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {truncateText(product.description, 80)}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">
              <span className="text-xs font-bold text-green-600 dark:text-green-400">{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-green-500 text-green-500" />
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount?.toLocaleString() || 0})
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            {product.price && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>
            )}
          </div>
          {product.isAffiliate ? (
            <button
              onClick={handleBuyNow}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-[0_2px_8px_var(--glow-primary)] hover:scale-[1.02] transition-all"
            >
              Buy <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                justAdded || isInCart
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30"
                  : "bg-primary text-primary-foreground shadow-[0_2px_8px_var(--glow-primary)] hover:scale-[1.02]"
              }`}
            >
              {justAdded ? (
                <><Check className="w-3 h-3" /> Added</>
              ) : isInCart ? (
                <><Check className="w-3 h-3" /> In Cart</>
              ) : (
                <><ShoppingCart className="w-3 h-3" /> Add</>
              )}
            </button>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground/60 mt-2">
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
