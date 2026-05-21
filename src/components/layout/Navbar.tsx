"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Package,
  Home,
  Lamp,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, wishlist, cart, searchQuery, setSearchQuery, isUserLoggedIn, currentUser } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top line accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="header-backdrop backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-[0_4px_12px_var(--glow-primary)]">
                <Home className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-foreground">TheIdea</span>
                <span className="text-lg font-bold text-primary">Decorator</span>
              </div>
            </Link>

            {/* Desktop Nav - pill style like Myrtle */}
            <nav className="hidden md:flex items-center">
              <div className="nav-pill-bg rounded-full px-1.5 py-1 flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      pathname === link.href
                        ? "bg-primary text-primary-foreground shadow-[0_2px_8px_var(--glow-primary)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="hidden md:block overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                          window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                        }
                      }}
                      className="w-full h-8 px-3 rounded-full bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground font-bold"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User */}
              {isUserLoggedIn ? (
                <div className="hidden md:flex items-center gap-1">
                  <Link href="/orders" className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <Package className="w-4 h-4" />
                  </Link>
                  <Link href="/profile">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </Link>
                </div>
              ) : (
                <Link href="/user-login" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile menu */}
              <button
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 px-4 py-4 bg-background/95 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  My Orders
                </Link>
                {!isUserLoggedIn && (
                  <Link
                    href="/user-login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
