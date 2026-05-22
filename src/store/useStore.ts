"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Category, ThemeMode, User, Watchlist, CartItem, Order, Address } from "@/types";
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

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  cancelOrder: (orderId: string) => void;

  // Addresses
  addresses: Address[];
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

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
        { id: "1", name: "Living Room", slug: "living-room", productCount: 0 },
        { id: "2", name: "Bedroom", slug: "bedroom", productCount: 0 },
        { id: "3", name: "Kitchen & Dining", slug: "kitchen-dining", productCount: 0 },
        { id: "4", name: "Bathroom", slug: "bathroom", productCount: 0 },
        { id: "5", name: "Wall Art & Decor", slug: "wall-art-decor", productCount: 0 },
        { id: "6", name: "Lighting", slug: "lighting", productCount: 0 },
        { id: "7", name: "Furniture", slug: "furniture", productCount: 0 },
        { id: "8", name: "Rugs & Carpets", slug: "rugs-carpets", productCount: 0 },
        { id: "9", name: "Curtains & Blinds", slug: "curtains-blinds", productCount: 0 },
        { id: "10", name: "Cushions & Throws", slug: "cushions-throws", productCount: 0 },
        { id: "11", name: "Vases & Planters", slug: "vases-planters", productCount: 0 },
        { id: "12", name: "Candles & Fragrances", slug: "candles-fragrances", productCount: 0 },
        { id: "13", name: "Mirrors", slug: "mirrors", productCount: 0 },
        { id: "14", name: "Clocks", slug: "clocks", productCount: 0 },
        { id: "15", name: "Storage & Organization", slug: "storage-organization", productCount: 0 },
        { id: "16", name: "Outdoor & Garden", slug: "outdoor-garden", productCount: 0 },
        { id: "17", name: "Bedding & Linen", slug: "bedding-linen", productCount: 0 },
        { id: "18", name: "Table Decor", slug: "table-decor", productCount: 0 },
        { id: "19", name: "Shelves & Racks", slug: "shelves-racks", productCount: 0 },
        { id: "20", name: "Electronics", slug: "electronics", productCount: 0 },
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

      // Cart
      cart: [],
      addToCart: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find((item) => item.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { productId, quantity, addedAt: new Date().toISOString() }],
          };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.productId !== productId) };
          }
          return {
            cart: state.cart.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          };
        }),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((total, item) => {
          const product = state.products.find((p) => p.id === item.productId);
          return total + (product?.price || 0) * item.quantity;
        }, 0);
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Orders
      orders: [],
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        })),
      cancelOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: "cancelled" as const, updatedAt: new Date().toISOString() }
              : o
          ),
        })),

      // Addresses
      addresses: [],
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, { ...address, id: address.id || generateId() }] })),
      updateAddress: (id, updates) =>
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
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
      theme: "light",
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
      name: "theideadecorator-store",
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        wishlist: state.wishlist,
        cart: state.cart,
        orders: state.orders,
        addresses: state.addresses,
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
