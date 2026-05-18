"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, Sparkles, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { fetchMetadata } from "@/lib/metadata";
import { isValidUrl, getAffiliatePlatform, generateId } from "@/lib/utils";
import { Product } from "@/types";

export function AdminAddProduct() {
  const { addProduct, categories } = useStore();
  const { success, error } = useToast();

  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [rating, setRating] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const handleFetchMetadata = async () => {
    if (!url || !isValidUrl(url)) {
      error("Invalid URL", "Please enter a valid product URL.");
      return;
    }

    setFetching(true);
    setFetchError("");

    const result = await fetchMetadata(url);

    if (result.success) {
      if (result.title) setTitle(result.title);
      if (result.description) setDescription(result.description);
      if (result.image) setImage(result.image);
      if (result.price) {
        const numPrice = parseFloat(result.price.replace(/[^0-9.]/g, ""));
        if (!isNaN(numPrice)) setPrice(numPrice.toString());
      }
      success("Metadata fetched!", "Product details extracted successfully.");
    } else {
      setFetchError(result.error || "Could not fetch metadata.");
    }

    setFetching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      error("Title required", "Please enter a product title.");
      return;
    }
    if (!url || !isValidUrl(url)) {
      error("Valid URL required", "Please enter a valid affiliate URL.");
      return;
    }

    const product: Product = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      affiliateUrl: url.trim(),
      platform: getAffiliatePlatform(url),
      category: category || "Electronics",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      price: price ? parseFloat(price) : undefined,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      currency: "INR",
      rating: rating ? parseFloat(rating) : undefined,
      reviewCount: Math.floor(Math.random() * 500) + 10,
      isFeatured,
      isTrending,
      clicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProduct(product);
    success("Product added!", `"${title}" has been added to your store.`);

    // Reset form
    setUrl("");
    setTitle("");
    setDescription("");
    setImage("");
    setCategory("");
    setTags("");
    setPrice("");
    setOriginalPrice("");
    setRating("");
    setIsFeatured(false);
    setIsTrending(false);
    setFetchError("");
  };

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* URL Fetch Section */}
          <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Paste Affiliate URL to Auto-Fill
            </p>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.amazon.in/dp/..."
                className="flex-1"
              />
              <Button
                onClick={handleFetchMetadata}
                disabled={fetching || !url}
                className="gap-2"
              >
                {fetching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Fetch
              </Button>
            </div>
            {fetchError && (
              <div className="mt-3 flex items-start gap-2 text-sm text-yellow-300/80">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}
            <p className="text-xs text-white/30 mt-2">
              Supports Amazon, Flipkart, and most e-commerce URLs. Manual entry available below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Product Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Product name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  rows={3}
                  className="flex w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.example.com/product.jpg"
                    className="flex-1"
                  />
                  {image && (
                    <div className="w-10 h-10 rounded-lg border border-white/10 overflow-hidden shrink-0">
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Tags (comma separated)
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="electronics, gadget, wireless"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Price (₹)
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Original Price (₹)
                </label>
                <Input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="1499"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Rating (1-5)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Platform
                </label>
                <Input
                  value={getAffiliatePlatform(url) || ""}
                  disabled
                  placeholder="Auto-detected from URL"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-white/70">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-white/70">Trending Product</span>
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
