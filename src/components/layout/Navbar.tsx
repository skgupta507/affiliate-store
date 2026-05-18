"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  User,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, wishlist, searchQuery, setSearchQuery, isUserLoggedIn, currentUser } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AffiliateHub
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      pathname === link.href
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Search */}
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="hidden md:block"
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 px-3 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      autoFocus
                    />
                  </motion.div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-white/60 hover:text-white"
                >
                  <Search className="w-4 h-4" />
                </Button>

                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white">
                    <Heart className="w-4 h-4" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[10px] flex items-center justify-center text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-white/60 hover:text-white"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                {/* User profile/login */}
                {isUserLoggedIn ? (
                  <Link href="/profile" className="hidden md:block">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-white/20 hover:border-purple-500/50 transition-all"
                      />
                    ) : (
                      <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                        <User className="w-4 h-4" />
                      </Button>
                    )}
                  </Link>
                ) : (
                  <Link href="/user-login" className="hidden md:block">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1">
                      <User className="w-4 h-4" /> Login
                    </Button>
                  </Link>
                )}

                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white/60 hover:text-white"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 px-4 py-4"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      pathname === link.href
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
