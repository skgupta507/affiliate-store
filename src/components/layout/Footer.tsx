"use client";

import Link from "next/link";
import { Home, Mail, MapPin, MessageCircle, ChevronUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border mt-8 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">TheIdea</span>
                <span className="text-lg font-bold text-primary">Decorator</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-4">
              Your one-stop destination for curated home decor, interior design products, furniture, lighting, and lifestyle essentials. Shop directly or find the best deals from top brands.
            </p>

            {/* Support Email */}
            <a
              href="mailto:support@theideadecorator.in"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
            >
              <Mail className="w-4 h-4" />
              support@theideadecorator.in
            </a>

            {/* Address */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground mb-4">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/60" />
              <span>#541, Vidyasagar Saraiplaya, Thanisandra Main Road, Dr. SRK Nagar Post, Bangalore – 560077</span>
            </div>

            {/* Social */}
            <div className="flex gap-2">
              <a href="https://wa.me/917892430507?text=Hi%2C%20I%20need%20help" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Shop</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/products", label: "All Products" },
                { href: "/categories", label: "Categories" },
                { href: "/deals", label: "Today's Deals" },
                { href: "/products?filter=trending", label: "Trending" },
                { href: "/products?filter=featured", label: "Featured" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support + Legal */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Support & More</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/profile", label: "My Account" },
                { href: "/orders", label: "Track Orders" },
                { href: "/rewards", label: "Rewards Program" },
                { href: "/blog", label: "Blog" },
                { href: "/faq", label: "FAQ" },
                { href: "/support", label: "Help & Support" },
                { href: "/contact", label: "Contact Us" },
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/returns", label: "Returns & Refunds" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} TheIdeaDecorator. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground/60 text-xs">
              Some links may earn us a commission at no extra cost to you.
            </p>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              aria-label="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
