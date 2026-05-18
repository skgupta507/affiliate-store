"use client";

import Link from "next/link";
import { ShoppingBag, Globe, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AffiliateHub
              </span>
            </Link>
            <p className="text-white/50 text-sm max-w-md">
              Discover the best products from top brands. We curate affiliate deals from Amazon, Flipkart, and more to help you find great products at the best prices.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/products" className="text-white/50 hover:text-white text-sm transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-white/50 hover:text-white text-sm transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-white/50 hover:text-white text-sm transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-white/50 hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2025 AffiliateHub. All rights reserved.
          </p>
          <p className="text-white/30 text-xs relative">
            Affiliate links may earn us a commission at no extra cost to you.
            {/* Hidden admin access - invisible, appears only on hover over the period at the end */}
            <a
              href="/login"
              className="absolute -right-3 -top-1 w-6 h-6 opacity-0 hover:opacity-100 transition-opacity duration-300"
              title=""
              aria-hidden="true"
            >
              <span className="block w-2 h-2 rounded-full bg-white/20 hover:bg-purple-500/50 transition-colors" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
