"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Edit, ExternalLink, Star, Eye, X, Save, Upload } from "lucide-react";
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
  const { products, deleteProduct, updateProduct, categories } = useStore();
  const { success } = useToast();
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Edit form state — ALL fields
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editTrending, setEditTrending] = useState(false);
  const [editStock, setEditStock] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editDimensions, setEditDimensions] = useState("");
  const [editIsAffiliate, setEditIsAffiliate] = useState(true);
  const [editPlatform, setEditPlatform] = useState("");
  const [editCurrency, setEditCurrency] = useState("INR");

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.platform.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setEditTitle(product.title);
    setEditDescription(product.description);
    setEditImage(product.image);
    setEditUrl(product.affiliateUrl);
    setEditCategory(product.category);
    setEditTags(product.tags.join(", "));
    setEditPrice(product.price?.toString() || "");
    setEditOriginalPrice(product.originalPrice?.toString() || "");
    setEditRating(product.rating?.toString() || "");
    setEditFeatured(product.isFeatured);
    setEditTrending(product.isTrending);
    setEditStock(product.stock?.toString() || "");
    setEditSku(product.sku || "");
    setEditBrand(product.brand || "");
    setEditWeight(product.weight || "");
    setEditDimensions(product.dimensions || "");
    setEditIsAffiliate(product.isAffiliate);
    setEditPlatform(product.platform || "");
    setEditCurrency(product.currency || "INR");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = () => {
    if (!editProduct) return;
    if (!editTitle.trim()) return;

    updateProduct(editProduct.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      image: editImage.trim(),
      affiliateUrl: editUrl.trim(),
      category: editCategory,
      tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
      price: editPrice ? parseFloat(editPrice) : undefined,
      originalPrice: editOriginalPrice ? parseFloat(editOriginalPrice) : undefined,
      rating: editRating ? parseFloat(editRating) : undefined,
      isFeatured: editFeatured,
      isTrending: editTrending,
      stock: editStock ? parseInt(editStock) : undefined,
      sku: editSku.trim() || undefined,
      brand: editBrand.trim() || undefined,
      weight: editWeight.trim() || undefined,
      dimensions: editDimensions.trim() || undefined,
      isAffiliate: editIsAffiliate,
      platform: editPlatform.trim() || "Other",
      currency: editCurrency || "INR",
    });

    success("Product updated", `"${editTitle.trim()}" has been saved.`);
    setEditProduct(null);
  };

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

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products ({products.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
            <p className="text-center text-muted-foreground py-12">
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary border border-white/5 hover:border-border transition-all"
                >
                  <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden shrink-0">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <Eye className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{product.platform}</Badge>
                      <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                      {product.isFeatured && <Badge className="text-[10px]">Featured</Badge>}
                      {product.isTrending && <Badge variant="warning" className="text-[10px]">Trending</Badge>}
                      {!product.isAffiliate && <Badge variant="default" className="text-[10px] bg-green-500/10 text-green-500">Direct</Badge>}
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    {product.price && <p className="text-sm font-semibold text-foreground">{formatPrice(product.price, product.currency)}</p>}
                    <p className="text-xs text-muted-foreground">{product.clicks} clicks</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)} className="h-8 w-8 text-muted-foreground/60 hover:text-blue-400" title="Edit"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleFeatured(product)} className={`h-8 w-8 ${product.isFeatured ? "text-primary" : "text-muted-foreground/60"}`} title="Toggle featured"><Star className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => window.open(product.affiliateUrl, "_blank")} className="h-8 w-8 text-muted-foreground/60 hover:text-foreground" title="Open link"><ExternalLink className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.title)} className="h-8 w-8 text-muted-foreground/60 hover:text-red-400" title="Delete"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog — ALL FIELDS */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update all product details. Changes sync across all devices.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Title *</label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Product title" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Description</label>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} className="flex w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>

            {/* Image — URL + File Upload */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Product Image</label>
              <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <Input value={editImage} onChange={(e) => setEditImage(e.target.value)} placeholder="Image URL (https://...)" />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary text-xs text-muted-foreground cursor-pointer hover:text-foreground hover:bg-accent transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <span className="text-[10px] text-muted-foreground">Max 5MB • JPG, PNG, WebP</span>
                  </div>
                </div>
                {editImage && (
                  <div className="w-20 h-20 rounded-lg border border-border overflow-hidden shrink-0">
                    <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Type & Platform */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Product Type</label>
                <select value={editIsAffiliate ? "affiliate" : "direct"} onChange={(e) => setEditIsAffiliate(e.target.value === "affiliate")} className="flex h-10 w-full rounded-xl border border-border bg-secondary px-4 py-2 text-sm text-foreground">
                  <option value="affiliate">Affiliate (external link)</option>
                  <option value="direct">Direct Sell (your stock)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Platform</label>
                <Input value={editPlatform} onChange={(e) => setEditPlatform(e.target.value)} placeholder="Amazon, Flipkart, Own..." />
              </div>
            </div>

            {/* Affiliate URL */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{editIsAffiliate ? "Affiliate URL *" : "Product URL (optional)"}</label>
              <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://..." />
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Category</label>
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="flex h-10 w-full rounded-xl border border-border bg-secondary px-4 py-2 text-sm text-foreground">
                  <option value="">Select category</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Brand</label>
                <Input value={editBrand} onChange={(e) => setEditBrand(e.target.value)} placeholder="Brand name" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Tags (comma separated)</label>
              <Input value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="decor, modern, living room" />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Price (₹)</label>
                <Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Original Price (₹)</label>
                <Input type="number" value={editOriginalPrice} onChange={(e) => setEditOriginalPrice(e.target.value)} placeholder="1499" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Currency</label>
                <Input value={editCurrency} onChange={(e) => setEditCurrency(e.target.value)} placeholder="INR" />
              </div>
            </div>

            {/* Stock & SKU (for direct sell products) */}
            {!editIsAffiliate && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Stock Quantity</label>
                  <Input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} placeholder="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">SKU</label>
                  <Input value={editSku} onChange={(e) => setEditSku(e.target.value)} placeholder="TID-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Weight</label>
                  <Input value={editWeight} onChange={(e) => setEditWeight(e.target.value)} placeholder="500g" />
                </div>
              </div>
            )}

            {/* Dimensions */}
            {!editIsAffiliate && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Dimensions</label>
                <Input value={editDimensions} onChange={(e) => setEditDimensions(e.target.value)} placeholder="30 × 20 × 10 cm" />
              </div>
            )}

            {/* Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Rating (1-5)</label>
                <Input type="number" min="1" max="5" step="0.1" value={editRating} onChange={(e) => setEditRating(e.target.value)} placeholder="4.5" />
              </div>
            </div>

            {/* Flags */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-muted-foreground">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editTrending} onChange={(e) => setEditTrending(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-muted-foreground">Trending</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSaveEdit} className="flex-1 gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
