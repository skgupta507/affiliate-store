"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Category, ThemeMode, User } from "@/types";

interface AppState {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  incrementClicks: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Recently Viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;

  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Auth
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Products
      products: [],
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      incrementClicks: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, clicks: p.clicks + 1 } : p
          ),
        })),

      // Categories
      categories: [
        { id: "1", name: "Electronics", slug: "electronics", productCount: 0 },
        { id: "2", name: "Fashion", slug: "fashion", productCount: 0 },
        { id: "3", name: "Home & Kitchen", slug: "home-kitchen", productCount: 0 },
        { id: "4", name: "Books", slug: "books", productCount: 0 },
        { id: "5", name: "Sports", slug: "sports", productCount: 0 },
        { id: "6", name: "Beauty", slug: "beauty", productCount: 0 },
        { id: "7", name: "Toys", slug: "toys", productCount: 0 },
        { id: "8", name: "Automotive", slug: "automotive", productCount: 0 },
      ],
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),

      // Recently Viewed
      recentlyViewed: [],
      addToRecentlyViewed: (productId) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== productId);
          return { recentlyViewed: [productId, ...filtered].slice(0, 20) };
        }),

      // Theme
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      // Auth
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "affiliate-store",
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        theme: state.theme,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
