"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  Laptop,
  Shirt,
  Home,
  BookOpen,
  Dumbbell,
  Sparkles,
  Gamepad2,
  Car,
  ArrowRight,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Electronics: <Laptop className="w-8 h-8" />,
  Fashion: <Shirt className="w-8 h-8" />,
  "Home & Kitchen": <Home className="w-8 h-8" />,
  Books: <BookOpen className="w-8 h-8" />,
  Sports: <Dumbbell className="w-8 h-8" />,
  Beauty: <Sparkles className="w-8 h-8" />,
  Toys: <Gamepad2 className="w-8 h-8" />,
  Automotive: <Car className="w-8 h-8" />,
};

const categoryGradients = [
  "from-purple-500/20 to-blue-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-yellow-500/20 to-orange-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-violet-500/20 to-purple-500/20",
  "from-red-500/20 to-pink-500/20",
  "from-teal-500/20 to-green-500/20",
];

export default function CategoriesPage() {
  const { categories, products } = useStore();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Browse Categories
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Explore products organized by category. Find exactly what you&apos;re looking for.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const productCount = products.filter(
              (p) => p.category === category.name
            ).length;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/products?category=${category.name}`}>
                  <div className="group relative p-6 rounded-2xl border border-border bg-card backdrop-blur-xl hover:bg-secondary transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 cursor-pointer">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                        categoryGradients[index % categoryGradients.length]
                      } flex items-center justify-center mb-4 text-white/70 group-hover:text-foreground transition-colors`}
                    >
                      {categoryIcons[category.name] || <Sparkles className="w-8 h-8" />}
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-purple-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {productCount} {productCount === 1 ? "product" : "products"}
                    </p>

                    <ArrowRight className="absolute top-6 right-6 w-5 h-5 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
