"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Zap, Percent, Clock, TrendingUp } from "lucide-react";

export default function DealsPage() {
  const { products } = useStore();

  const topDeals = [...products]
    .filter((p) => p.price && p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discA = ((a.originalPrice! - a.price!) / a.originalPrice!) * 100;
      const discB = ((b.originalPrice! - b.price!) / b.originalPrice!) * 100;
      return discB - discA;
    });

  const under500 = products.filter((p) => p.price && p.price < 500);
  const under1000 = products.filter((p) => p.price && p.price >= 500 && p.price < 1000);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-300">Today&apos;s Best Deals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Deals & <span className="text-gradient">Discounts</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Handpicked deals with the biggest discounts. Updated daily.
          </p>
        </motion.div>

        {/* Deal Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Percent, label: "Active Deals", value: topDeals.length.toString(), color: "text-green-400" },
            { icon: Zap, label: "Max Discount", value: topDeals.length > 0 ? `${Math.round(((topDeals[0].originalPrice! - topDeals[0].price!) / topDeals[0].originalPrice!) * 100)}%` : "0%", color: "text-yellow-400" },
            { icon: Clock, label: "Under ₹500", value: under500.length.toString(), color: "text-blue-400" },
            { icon: TrendingUp, label: "Avg Savings", value: topDeals.length > 0 ? `${Math.round(topDeals.reduce((sum, p) => sum + ((p.originalPrice! - p.price!) / p.originalPrice!) * 100, 0) / topDeals.length)}%` : "0%", color: "text-purple-400" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl bg-card border border-border text-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Top Deals */}
        {topDeals.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Percent className="w-5 h-5 text-green-400" /> Biggest Discounts
            </h2>
            <ProductGrid products={topDeals} />
          </section>
        )}

        {/* Under ₹500 */}
        {under500.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-bold text-foreground mb-6">Under ₹500</h2>
            <ProductGrid products={under500} />
          </section>
        )}

        {/* Under ₹1000 */}
        {under1000.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-bold text-foreground mb-6">₹500 - ₹1000</h2>
            <ProductGrid products={under1000} />
          </section>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <Zap className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Deals Coming Soon</h2>
            <p className="text-muted-foreground">Check back soon for amazing discounts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
