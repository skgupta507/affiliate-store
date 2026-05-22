"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
  "Living Room": <Home className="w-6 h-6" />,
  "Bedroom": <Bed className="w-6 h-6" />,
  "Kitchen & Dining": <ChefHat className="w-6 h-6" />,
  "Bathroom": <Droplets className="w-6 h-6" />,
  "Wall Art & Decor": <Frame className="w-6 h-6" />,
  "Lighting": <Lamp className="w-6 h-6" />,
  "Furniture": <Armchair className="w-6 h-6" />,
  "Rugs & Carpets": <Layers className="w-6 h-6" />,
  "Curtains & Blinds": <Blinds className="w-6 h-6" />,
  "Cushions & Throws": <Heart className="w-6 h-6" />,
  "Vases & Planters": <Flower2 className="w-6 h-6" />,
  "Candles & Fragrances": <Flame className="w-6 h-6" />,
  "Mirrors": <Circle className="w-6 h-6" />,
  "Clocks": <Clock className="w-6 h-6" />,
  "Storage & Organization": <Archive className="w-6 h-6" />,
  "Outdoor & Garden": <TreePine className="w-6 h-6" />,
  "Bedding & Linen": <Shirt className="w-6 h-6" />,
  "Table Decor": <Coffee className="w-6 h-6" />,
  "Shelves & Racks": <BookOpen className="w-6 h-6" />,
  "Electronics": <Laptop className="w-6 h-6" />,
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {categories.map((category, index) => {
            const productCount = products.filter(
              (p) => p.category === category.name
            ).length;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/products?category=${category.name}`}>
                  <div className="group p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
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
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
