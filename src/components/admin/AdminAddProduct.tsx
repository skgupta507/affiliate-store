"use client";

import { useState } from "react";
import { Link2, Loader2, Sparkles, AlertCircle, Upload, Image as ImageIcon, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Product type
  const [isAffiliate, setIsAffiliate] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [rating, setRating] = useState("");
  const [reviewCount, setReviewCount] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [seller, setSeller] = useState("");

  const handleFetchMetadata = async () => {
    if (!url || !isValidUrl(url)) {
      error("Invalid URL", "Please enter a valid product URL.");
      return;
    }

    const detectedPlatform = getAffiliatePlatform(url);
    if (detectedPlatform !== "Other") {
      setPlatform(detectedPlatform);
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
      if (result.originalPrice) {
        const numPrice = parseFloat(result.originalPrice.replace(/[^0-9.]/g, ""));
        if (!isNaN(numPrice)) setOriginalPrice(numPrice.toString());
      }
      if (result.category) setCategory(result.category);
      if (result.tags && result.tags.length > 0) setTags(result.tags.join(", "));
      if (result.rating) setRating(result.rating);
      if (result.reviewCount) setReviewCount(result.reviewCount);
      if (result.platform && result.platform !== "Other") setPlatform(result.platform);
      success("Metadata fetched!", "Product details extracted successfully.");
    } else {
      setFetchError(result.error || "Could not fetch metadata.");
    }

    setFetching(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (!image) {
          setImage(dataUrl);
        }
        setImages((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (index === 0 && updated.length > 0) {
        setImage(updated[0]);
      } else if (updated.length === 0) {
        setImage("");
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      error("Title required", "Please enter a product title.");
      return;
    }
    if (isAffiliate && (!url || !isValidUrl(url))) {
      error("Valid URL required", "Please enter a valid affiliate URL.");
      return;
    }

    const product: Product = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      images: images.length > 0 ? images : undefined,
      affiliateUrl: url.trim(),
      platform: platform.trim() || (isAffiliate ? getAffiliatePlatform(url) : "TheIdeaDecorator"),
      category: category || "Electronics",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      price: price ? parseFloat(price) : undefined,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      currency: "INR",
      rating: rating ? parseFloat(rating) : undefined,
      reviewCount: reviewCount ? parseInt(reviewCount) : undefined,
      isFeatured,
      isTrending,
      clicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAffiliate,
      stock: stock ? parseInt(stock) : undefined,
      sku: sku.trim() || undefined,
      brand: brand.trim() || undefined,
      weight: weight.trim() || undefined,
      dimensions: dimensions.trim() || undefined,
      seller: seller.trim() || undefined,
    };

    addProduct(product);
    success("Product added!", `"${title}" has been added to your store.`);

    // Reset form
    setUrl("");
    setTitle("");
    setDescription("");
    setImage("");
    setImages([]);
    setPlatform("");
    setCategory("");
    setTags("");
    setPrice("");
    setOriginalPrice("");
    setRating("");
    setReviewCount("");
    setIsFeatured(false);
    setIsTrending(false);
    setStock("");
    setSku("");
    setBrand("");
    setWeight("");
    setDimensions("");
    setSeller("");
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
          {/* Product Type Toggle */}
          <div className="mb-6 flex gap-2 p-1 rounded-xl bg-card border border-border">
            <button
              onClick={() => setIsAffiliate(true)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isAffiliate
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Affiliate Product
            </button>
            <button
              onClick={() => setIsAffiliate(false)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isAffiliate
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Direct Sell Product
            </button>
          </div>

          {/* URL Fetch Section (Affiliate only) */}
          {isAffiliate && (
            <div className="mb-8 p-4 rounded-xl bg-card border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
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
            </div>
          )}

          {/* Image Upload Section */}
          <div className="mb-8 p-4 rounded-xl bg-card border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Product Images
            </p>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg border border-border overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-purple-500/80 text-[8px] text-center text-foreground py-0.5">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border hover:border-purple-500/50 transition-colors text-muted-foreground hover:text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload Images</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <div className="flex-1">
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or paste image URL"
                />
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
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
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  rows={3}
                  className="flex w-full rounded-xl border border-border bg-card backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-secondary px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all appearance-none"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-secondary text-foreground">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-secondary text-foreground">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Brand
                </label>
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Tags (comma separated)
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="electronics, gadget, wireless"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Platform
                </label>
                <Input
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder={isAffiliate ? "Amazon, Flipkart, etc." : "TheIdeaDecorator"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Original Price (₹)
                </label>
                <Input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="1499"
                />
              </div>

              {/* Direct sell fields */}
              {!isAffiliate && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Stock Quantity
                    </label>
                    <Input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      SKU
                    </label>
                    <Input
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="TID-ELEC-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Weight
                    </label>
                    <Input
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="500g"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Dimensions
                    </label>
                    <Input
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="20 x 15 x 5 cm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Seller Name
                    </label>
                    <Input
                      value={seller}
                      onChange={(e) => setSeller(e.target.value)}
                      placeholder="TheIdeaDecorator"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
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
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Review Count
                </label>
                <Input
                  type="number"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                  placeholder="150"
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
                  className="w-4 h-4 rounded border-border bg-card text-primary focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-card text-primary focus:ring-ring"
                />
                <span className="text-sm text-muted-foreground">Trending Product</span>
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2">
              <PlusIcon className="w-4 h-4" /> Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
