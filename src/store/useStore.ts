"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Category, ThemeMode, User, Watchlist } from "@/types";
import { generateId } from "@/lib/utils";

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

  // Wishlist (simple favorites)
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Watchlists (named collections)
  watchlists: Watchlist[];
  createWatchlist: (name: string) => void;
  deleteWatchlist: (id: string) => void;
  renameWatchlist: (id: string, name: string) => void;
  addToWatchlist: (watchlistId: string, productId: string) => void;
  removeFromWatchlist: (watchlistId: string, productId: string) => void;

  // Recently Viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;

  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Auth (admin)
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  // User Auth (Firebase)
  currentUser: User | null;
  isUserLoggedIn: boolean;
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (updates: Partial<User>) => void;

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

      // Watchlists
      watchlists: [],
      createWatchlist: (name) =>
        set((state) => ({
          watchlists: [
            ...state.watchlists,
            { id: generateId(), name, productIds: [], createdAt: new Date().toISOString() },
          ],
        })),
      deleteWatchlist: (id) =>
        set((state) => ({
          watchlists: state.watchlists.filter((w) => w.id !== id),
        })),
      renameWatchlist: (id, name) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) => (w.id === id ? { ...w, name } : w)),
        })),
      addToWatchlist: (watchlistId, productId) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === watchlistId && !w.productIds.includes(productId)
              ? { ...w, productIds: [...w.productIds, productId] }
              : w
          ),
        })),
      removeFromWatchlist: (watchlistId, productId) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === watchlistId
              ? { ...w, productIds: w.productIds.filter((id) => id !== productId) }
              : w
          ),
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

      // Auth (admin)
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),

      // User Auth
      currentUser: null,
      isUserLoggedIn: false,
      setCurrentUser: (user) =>
        set({ currentUser: user, isUserLoggedIn: !!user }),
      updateUserProfile: (updates) =>
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
        })),

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
        watchlists: state.watchlists,
        recentlyViewed: state.recentlyViewed,
        theme: state.theme,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        currentUser: state.currentUser,
        isUserLoggedIn: state.isUserLoggedIn,
      }),
    }
  )
);
