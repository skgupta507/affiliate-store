"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import {
  Home,
  Bed,
  ChefHat,
  Droplets,
  Frame,
  Lamp,
  Armchair,
  Layers,
  Blinds,
  Heart,
  Flower2,
  Flame,
  Circle,
  Clock,
  Archive,
  TreePine,
  Shirt,
  Coffee,
  BookOpen,
  Laptop,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Living Room": <Home className="w-5 h-5" />,
  "Bedroom": <Bed className="w-5 h-5" />,
  "Kitchen & Dining": <ChefHat className="w-5 h-5" />,
  "Bathroom": <Droplets className="w-5 h-5" />,
  "Wall Art & Decor": <Frame className="w-5 h-5" />,
  "Lighting": <Lamp className="w-5 h-5" />,
  "Furniture": <Armchair className="w-5 h-5" />,
  "Rugs & Carpets": <Layers className="w-5 h-5" />,
  "Curtains & Blinds": <Blinds className="w-5 h-5" />,
  "Cushions & Throws": <Heart className="w-5 h-5" />,
  "Vases & Planters": <Flower2 className="w-5 h-5" />,
  "Candles & Fragrances": <Flame className="w-5 h-5" />,
  "Mirrors": <Circle className="w-5 h-5" />,
  "Clocks": <Clock className="w-5 h-5" />,
  "Storage & Organization": <Archive className="w-5 h-5" />,
  "Outdoor & Garden": <TreePine className="w-5 h-5" />,
  "Bedding & Linen": <Shirt className="w-5 h-5" />,
  "Table Decor": <Coffee className="w-5 h-5" />,
  "Shelves & Racks": <BookOpen className="w-5 h-5" />,
  "Electronics": <Laptop className="w-5 h-5" />,
};

const categoryColors = [
  "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
  "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
];

export default function CategoriesPage() {
  const { categories, products } = useStore();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Browse Categories
          </h1>
          <p className="text-muted-foreground text-sm">
            Explore our curated interior design and home decor collections.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {categories.map((category, index) => {
            const productCount = products.filter(
              (p) => p.category === category.name
            ).length;
            // Get a sample product image for the category
            const sampleProduct = products.find((p) => p.category === category.name && p.image);
            const categoryImage = category.image || sampleProduct?.image;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/products?category=${category.name}`}>
                  <div className="group rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all cursor-pointer overflow-hidden">
                    {/* Category Image */}
                    {categoryImage ? (
                      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                        <Image
                          src={categoryImage}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <h3 className="text-sm font-bold text-white drop-shadow-sm">{category.name}</h3>
                          <p className="text-[10px] text-white/80">{productCount} products</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div
                          className={`w-10 h-10 rounded-lg ${categoryColors[index % categoryColors.length]} flex items-center justify-center mb-3`}
                        >
                          {categoryIcons[category.name] || <Sparkles className="w-5 h-5" />}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {productCount} {productCount === 1 ? "product" : "products"}
                        </p>
                      </div>
                    )}

                    {/* Bottom bar for image cards */}
                    {!categoryImage && (
                      <div className="px-4 pb-3 pt-0 flex items-center justify-between">
                        <span className="text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          Shop Now <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Featured Categories Banner */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-border"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Can't decide?</h2>
                <p className="text-sm text-muted-foreground">Browse all {products.length} products across all categories.</p>
              </div>
              <Link href="/products">
                <button className="h-9 rounded-lg bg-primary px-5 font-semibold text-sm text-primary-foreground hover:scale-[1.02] transition-all flex items-center gap-1.5 shrink-0">
                  View All Products <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
