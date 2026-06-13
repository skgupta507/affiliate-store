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
              {
                href: "https://www.instagram.com/theideadecorator",
                label: "Instagram",
                color: "hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/30",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                ),
              },
              {
                href: "https://www.facebook.com/theideadecorator",
                label: "Facebook",
                color: "hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                ),
              },
              {
                href: "https://twitter.com/ideadecorator",
                label: "X (Twitter)",
                color: "hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                ),
              },
              {
                href: "https://www.pinterest.com/theideadecorator",
                label: "Pinterest",
                color: "hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                ),
              },
              {
                href: "https://www.youtube.com/@theideadecorator",
                label: "YouTube",
                color: "hover:bg-red-600/10 hover:text-red-600 hover:border-red-500/30",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                ),
              },
              {
                href: "https://wa.me/917892430507?text=Hi%2C%20I%20need%20help",
                label: "WhatsApp",
                color: "hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-all ${social.color}`}
              >
                {social.icon}
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
