"use client";

import Link from "next/link";
import { Home, Globe, Mail, MessageCircle } from "lucide-react";

export function Footer() {
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
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Your one-stop destination for curated home decor, interior design products, furniture, lighting, and lifestyle essentials. Shop directly or find the best deals from top brands.
            </p>
            <div className="flex gap-2 mt-4">
              {[MessageCircle, Globe, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
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

          {/* Account */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Account</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/profile", label: "My Profile" },
                { href: "/orders", label: "Orders" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/cart", label: "Cart" },
                { href: "/contact", label: "Help & Support" },
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
            © 2025 TheIdeaDecorator. All rights reserved.
          </p>
          <p className="text-muted-foreground/60 text-xs relative">
            Some links may earn us a commission at no extra cost to you.
            <a
              href="/login"
              className="absolute -right-3 -top-1 w-6 h-6 opacity-0 hover:opacity-100 transition-opacity duration-300"
              title=""
              aria-hidden="true"
            >
              <span className="block w-2 h-2 rounded-full bg-muted-foreground/20 hover:bg-primary/50 transition-colors" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
