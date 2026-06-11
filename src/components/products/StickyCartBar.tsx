"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ExternalLink, Heart, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StickyCartBarProps {
  title: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  isAffiliate: boolean;
  isInCart: boolean;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleWishlist: () => void;
}

export function StickyCartBar({
  title,
  price,
  originalPrice,
  image,
  isAffiliate,
  isInCart,
  isWishlisted,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
}: StickyCartBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px (past the main action buttons)
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              {/* Product Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {image && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 hidden sm:block">
                  <p className="text-sm font-medium text-foreground truncate">{title}</p>
                  <div className="flex items-center gap-2">
                    {price && <span className="text-sm font-bold text-foreground">{formatPrice(price)}</span>}
                    {originalPrice && originalPrice > (price || 0) && (
                      <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
                    )}
                  </div>
                </div>
                {/* Mobile price only */}
                <div className="sm:hidden min-w-0">
                  {price && <span className="text-sm font-bold text-foreground">{formatPrice(price)}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onToggleWishlist}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                {isAffiliate ? (
                  <button
                    onClick={onBuyNow}
                    className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5 hover:scale-[1.02] transition-all"
                  >
                    Buy Now <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onAddToCart}
                      className={`h-9 px-3 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-all ${
                        isInCart
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                          : "border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {isInCart ? <><Check className="w-3.5 h-3.5" /> In Cart</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add</>}
                    </button>
                    <button
                      onClick={onBuyNow}
                      className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5 hover:scale-[1.02] transition-all"
                    >
                      Buy Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
