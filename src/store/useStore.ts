"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Category, ThemeMode, User, Watchlist, CartItem, Order, Address, Coupon, Review, BlogPost, Notification, SupportTicket, TicketReply, LoyaltyTier, FAQ } from "@/types";
import { generateId } from "@/lib/utils";

interface AppState {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  incrementClicks: (id: string) => void;
  incrementViewCount: (id: string) => void;

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

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getCouponDiscount: () => number;

  // Reviews
  reviews: Review[];
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  markReviewHelpful: (id: string) => void;
  getProductReviews: (productId: string) => Review[];

  // Blog
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;

  // Loyalty
  addLoyaltyPoints: (points: number) => void;
  redeemLoyaltyPoints: (points: number) => boolean;
  getLoyaltyTier: () => LoyaltyTier;

  // Support Tickets
  tickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "replies" | "status">) => void;
  updateTicketStatus: (id: string, status: SupportTicket["status"]) => void;
  addTicketReply: (ticketId: string, reply: Omit<TicketReply, "id" | "createdAt">) => void;

  // FAQs
  faqs: FAQ[];
  addFaq: (faq: FAQ) => void;
  updateFaq: (id: string, updates: Partial<FAQ>) => void;
  deleteFaq: (id: string) => void;

  // Price Alerts
  priceAlerts: { productId: string; targetPrice: number }[];
  addPriceAlert: (productId: string, targetPrice: number) => void;
  removePriceAlert: (productId: string) => void;
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
      incrementViewCount: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, viewCount: (p.viewCount || 0) + 1 } : p
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
      clearCart: () => set({ cart: [], appliedCoupon: null }),
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

      // Coupons
      coupons: [],
      addCoupon: (coupon) =>
        set((state) => ({ coupons: [...state.coupons, coupon] })),
      updateCoupon: (id, updates) =>
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCoupon: (id) =>
        set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id) })),
      appliedCoupon: null,
      applyCoupon: (code) => {
        const state = get();
        const coupon = state.coupons.find(
          (c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive
        );
        if (!coupon) return { success: false, message: "Invalid coupon code" };
        if (new Date(coupon.validUntil) < new Date()) return { success: false, message: "Coupon has expired" };
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { success: false, message: "Coupon usage limit reached" };
        const cartTotal = state.getCartTotal();
        if (coupon.minOrder && cartTotal < coupon.minOrder) return { success: false, message: `Minimum order of ₹${coupon.minOrder} required` };
        if (coupon.firstOrderOnly && state.orders.length > 0) return { success: false, message: "This coupon is for first orders only" };
        set({ appliedCoupon: coupon });
        return { success: true, message: `Coupon "${coupon.code}" applied! You save ${coupon.type === "percentage" ? `${coupon.discount}%` : `₹${coupon.discount}`}` };
      },
      removeCoupon: () => set({ appliedCoupon: null }),
      getCouponDiscount: () => {
        const state = get();
        if (!state.appliedCoupon) return 0;
        const cartTotal = state.getCartTotal();
        if (state.appliedCoupon.type === "percentage") {
          const discount = (cartTotal * state.appliedCoupon.discount) / 100;
          return state.appliedCoupon.maxDiscount ? Math.min(discount, state.appliedCoupon.maxDiscount) : discount;
        }
        return state.appliedCoupon.discount;
      },

      // Reviews
      reviews: [],
      addReview: (review) =>
        set((state) => ({ reviews: [review, ...state.reviews] })),
      deleteReview: (id) =>
        set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),
      markReviewHelpful: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, helpful: r.helpful + 1 } : r
          ),
        })),
      getProductReviews: (productId) => {
        return get().reviews.filter((r) => r.productId === productId);
      },

      // Blog
      blogPosts: [],
      addBlogPost: (post) =>
        set((state) => ({ blogPosts: [...state.blogPosts, post] })),
      updateBlogPost: (id, updates) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteBlogPost: (id) =>
        set((state) => ({ blogPosts: state.blogPosts.filter((p) => p.id !== id) })),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 50) })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },

      // Loyalty
      addLoyaltyPoints: (points) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, loyaltyPoints: (state.currentUser.loyaltyPoints || 0) + points }
            : null,
        })),
      redeemLoyaltyPoints: (points) => {
        const state = get();
        if (!state.currentUser || (state.currentUser.loyaltyPoints || 0) < points) return false;
        set({
          currentUser: {
            ...state.currentUser!,
            loyaltyPoints: (state.currentUser!.loyaltyPoints || 0) - points,
          },
        });
        return true;
      },
      getLoyaltyTier: () => {
        const state = get();
        const totalSpent = state.currentUser?.totalSpent || 0;
        if (totalSpent >= 50000) return "platinum";
        if (totalSpent >= 25000) return "gold";
        if (totalSpent >= 10000) return "silver";
        return "bronze";
      },

      // Support Tickets
      tickets: [],
      createTicket: (ticket) =>
        set((state) => ({
          tickets: [
            {
              ...ticket,
              id: generateId(),
              status: "open" as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              replies: [],
            },
            ...state.tickets,
          ],
        })),
      updateTicketStatus: (id, status) =>
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
          ),
        })),
      addTicketReply: (ticketId, reply) =>
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  replies: [...t.replies, { ...reply, id: generateId(), createdAt: new Date().toISOString() }],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        })),

      // FAQs
      faqs: [
        { id: "1", question: "What is your return policy?", answer: "We offer a 7-day easy return policy on all products. Items must be in original packaging and unused condition.", category: "Returns", order: 1 },
        { id: "2", question: "How long does delivery take?", answer: "Standard delivery takes 3-5 business days. Express delivery is available for select locations and takes 1-2 days.", category: "Shipping", order: 2 },
        { id: "3", question: "What payment methods do you accept?", answer: "We accept UPI, Credit/Debit Cards, Net Banking, Wallets (via Razorpay & PayU), and Cash on Delivery.", category: "Payment", order: 3 },
        { id: "4", question: "How do I track my order?", answer: "Go to the Orders page from your profile. Click on any order to see tracking details and delivery status.", category: "Orders", order: 4 },
        { id: "5", question: "Are affiliate products shipped by you?", answer: "No, affiliate products are sold by partner platforms (Amazon, Flipkart, etc.). You'll be redirected to their site for purchase. We earn a small commission at no extra cost to you.", category: "General", order: 5 },
        { id: "6", question: "How does the loyalty program work?", answer: "Earn 1 point per ₹10 spent. Points can be redeemed for discounts on future orders. Higher tiers unlock better benefits!", category: "Loyalty", order: 6 },
        { id: "7", question: "Can I cancel my order?", answer: "Yes, you can cancel pending or confirmed orders from the Orders page. Once shipped, cancellation is not possible but you can initiate a return.", category: "Orders", order: 7 },
        { id: "8", question: "Do you offer free shipping?", answer: "Yes! Orders above ₹499 qualify for free shipping. Otherwise a flat ₹49 delivery charge applies.", category: "Shipping", order: 8 },
      ],
      addFaq: (faq) => set((state) => ({ faqs: [...state.faqs, faq] })),
      updateFaq: (id, updates) =>
        set((state) => ({
          faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
      deleteFaq: (id) => set((state) => ({ faqs: state.faqs.filter((f) => f.id !== id) })),

      // Price Alerts
      priceAlerts: [],
      addPriceAlert: (productId, targetPrice) =>
        set((state) => ({
          priceAlerts: [...state.priceAlerts.filter((a) => a.productId !== productId), { productId, targetPrice }],
        })),
      removePriceAlert: (productId) =>
        set((state) => ({
          priceAlerts: state.priceAlerts.filter((a) => a.productId !== productId),
        })),
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
        coupons: state.coupons,
        reviews: state.reviews,
        blogPosts: state.blogPosts,
        notifications: state.notifications,
        tickets: state.tickets,
        faqs: state.faqs,
        priceAlerts: state.priceAlerts,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);
