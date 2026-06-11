"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Shield, Zap, Heart, Truck, CreditCard, RotateCcw, Headphones } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About <span className="text-gradient">TheIdeaDecorator</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your one-stop marketplace for curated home decor, electronics, fashion, and lifestyle products. Shop directly or find the best affiliate deals from top brands.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: ShoppingBag,
              title: "Curated Marketplace",
              description:
                "We offer both direct purchases and curated affiliate deals from Amazon, Flipkart, and other trusted platforms.",
            },
            {
              icon: Shield,
              title: "Secure Shopping",
              description:
                "Every transaction is protected. Buy with confidence through our secure checkout or trusted partner platforms.",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              description:
                "Free delivery on orders above ₹499. Most orders delivered within 3-5 business days across India.",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              description:
                "7-day hassle-free return policy on direct purchases. No questions asked.",
            },
            {
              icon: CreditCard,
              title: "Multiple Payment Options",
              description:
                "Pay via UPI, credit/debit cards, net banking, or cash on delivery. Whatever works for you.",
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              description:
                "Our customer support team is always ready to help you with any queries or issues.",
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
              className="p-6 rounded-2xl border border-border bg-card backdrop-blur-xl"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl border border-border bg-card backdrop-blur-xl text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h4 className="font-medium text-foreground mb-1">Browse</h4>
              <p className="text-sm text-muted-foreground">Explore our curated collection</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-blue-400">2</span>
              </div>
              <h4 className="font-medium text-foreground mb-1">Add to Cart</h4>
              <p className="text-sm text-muted-foreground">Select products you love</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-green-400">3</span>
              </div>
              <h4 className="font-medium text-foreground mb-1">Checkout</h4>
              <p className="text-sm text-muted-foreground">Secure payment options</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-yellow-400">4</span>
              </div>
              <h4 className="font-medium text-foreground mb-1">Receive</h4>
              <p className="text-sm text-muted-foreground">Fast delivery to your door</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-2xl border border-border bg-card text-center"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Connect With Us</h2>
          <p className="text-sm text-muted-foreground mb-5">Follow us on social media for decor inspiration, new arrivals, and exclusive deals.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { href: "https://www.instagram.com/theideadecorator", label: "Instagram", color: "hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/30" },
              { href: "https://www.facebook.com/theideadecorator", label: "Facebook", color: "hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30" },
              { href: "https://twitter.com/ideadecorator", label: "X (Twitter)", color: "hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30" },
              { href: "https://www.pinterest.com/theideadecorator", label: "Pinterest", color: "hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30" },
              { href: "https://www.youtube.com/@theideadecorator", label: "YouTube", color: "hover:bg-red-600/10 hover:text-red-600 hover:border-red-500/30" },
              { href: "https://wa.me/917892430507?text=Hi%2C%20I%20need%20help", label: "WhatsApp", color: "hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-all ${social.color}`}
              >
                {social.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5"
        >
          <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
            <strong className="text-amber-600 dark:text-amber-400">Disclosure:</strong> TheIdeaDecorator contains both direct-sell products and affiliate links. When you purchase through affiliate links, we may earn a small commission at no extra cost to you. This helps us maintain and improve the platform.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
