"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Edit, ExternalLink, Star, Eye } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

export function AdminProducts() {
  const { products, deleteProduct, updateProduct } = useStore();
  const { success } = useToast();
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.platform.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteProduct(id);
      success("Product deleted", `"${title}" has been removed.`);
    }
  };

  const handleToggleFeatured = (product: Product) => {
    updateProduct(product.id, { isFeatured: !product.isFeatured });
    success(
      product.isFeatured ? "Removed from featured" : "Marked as featured",
      product.title
    );
  };

  const handleToggleTrending = (product: Product) => {
    updateProduct(product.id, { isTrending: !product.isTrending });
    success(
      product.isTrending ? "Removed from trending" : "Marked as trending",
      product.title
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products ({products.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-center text-white/40 py-12">
              {products.length === 0
                ? "No products yet. Add your first product!"
                : "No products match your search."}
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  {/* Image */}
                  <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <Eye className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">
                        {product.platform}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {product.category}
                      </Badge>
                      {product.isFeatured && (
                        <Badge className="text-[10px]">Featured</Badge>
                      )}
                      {product.isTrending && (
                        <Badge variant="warning" className="text-[10px]">
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden sm:block text-right">
                    {product.price && (
                      <p className="text-sm font-semibold text-white">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    )}
                    <p className="text-xs text-white/40">{product.clicks} clicks</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFeatured(product)}
                      className={`h-8 w-8 ${product.isFeatured ? "text-purple-400" : "text-white/30"}`}
                      title="Toggle featured"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(product.affiliateUrl, "_blank")}
                      className="h-8 w-8 text-white/30 hover:text-white"
                      title="Open link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id, product.title)}
                      className="h-8 w-8 text-white/30 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
