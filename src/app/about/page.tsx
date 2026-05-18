"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Shield, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">About AffiliateHub</h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            We curate the best deals from top e-commerce platforms to help you discover amazing products at great prices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: ShoppingBag,
              title: "Curated Selection",
              description:
                "Every product is hand-picked from trusted platforms like Amazon and Flipkart to ensure quality and value.",
            },
            {
              icon: Shield,
              title: "Trusted Platforms",
              description:
                "We only link to verified sellers on established e-commerce platforms. Your purchase is always secure.",
            },
            {
              icon: Zap,
              title: "Best Deals",
              description:
                "We track prices and highlight the best deals so you never miss a great offer on products you love.",
            },
            {
              icon: Heart,
              title: "Community Driven",
              description:
                "Our recommendations are based on real user feedback and trending products in the community.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-purple-400">1</span>
              </div>
              <h4 className="font-medium text-white mb-1">Browse</h4>
              <p className="text-sm text-white/40">Explore our curated collection of products</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-blue-400">2</span>
              </div>
              <h4 className="font-medium text-white mb-1">Compare</h4>
              <p className="text-sm text-white/40">Check prices, ratings, and reviews</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-green-400">3</span>
              </div>
              <h4 className="font-medium text-white mb-1">Purchase</h4>
              <p className="text-sm text-white/40">Buy directly from the trusted platform</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5"
        >
          <p className="text-sm text-yellow-200/70 text-center">
            <strong className="text-yellow-300">Disclosure:</strong> AffiliateHub contains affiliate links. When you purchase through our links, we may earn a small commission at no extra cost to you. This helps us maintain and improve the platform.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
