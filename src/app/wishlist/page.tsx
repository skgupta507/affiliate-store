"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { products, wishlist } = useStore();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 text-red-400" />
            My Wishlist
          </h1>
          <p className="text-white/50">
            {wishlistProducts.length} saved {wishlistProducts.length === 1 ? "item" : "items"}
          </p>
        </motion.div>

        {wishlistProducts.length > 0 ? (
          <ProductGrid products={wishlistProducts} />
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-lg font-semibold text-white/70 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-sm text-white/40 mb-6">
              Browse products and click the heart icon to save items here.
            </p>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Browse Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
