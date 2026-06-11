"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Category, ThemeMode, User, Watchlist, CartItem, Order, Address, Coupon, Review, BlogPost, Notification, SupportTicket, TicketReply, LoyaltyTier, FAQ, ProductQuestion } from "@/types";
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

  // Flash Sale Timer
  flashSaleEnd: string | null; // ISO date string
  setFlashSaleEnd: (date: string | null) => void;

  // Product Q&A
  productQuestions: ProductQuestion[];
  askQuestion: (productId: string, question: string) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  upvoteQuestion: (questionId: string) => void;
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
      blogPosts: [
        { id: "blog-1", title: "10 Living Room Decor Ideas That Transform Your Space", slug: "10-living-room-decor-ideas", excerpt: "Discover easy and affordable ways to elevate your living room with these trending decor ideas for 2025.", content: "Your living room is the heart of your home. Here are 10 ideas:\n\n1. Statement Wall Art\n2. Layer Your Lighting\n3. Add Texture with Throws\n4. Greenery & Planters\n5. Mirrors for Space\n6. Color Accent Cushions\n7. Coffee Table Styling\n8. Curtains that Flow\n9. Minimalist Shelving\n10. Scented Candles", coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", author: "TheIdeaDecorator", category: "Home Decor Tips", tags: ["living room", "decor", "interior design"], publishedAt: "2025-05-15T10:00:00Z", updatedAt: "2025-05-15T10:00:00Z", readTime: 5, isPublished: true, relatedProducts: [], views: 234 },
        { id: "blog-2", title: "How to Choose the Perfect Lighting for Every Room", slug: "choose-perfect-lighting-every-room", excerpt: "Learn the 3-layer lighting technique used by interior designers to create the perfect mood.", content: "Good lighting is the unsung hero of interior design.\n\nThe 3-Layer Approach:\n1. Ambient Lighting\n2. Task Lighting\n3. Accent Lighting\n\nUse warm white (2700K-3000K) for living spaces and cool white (4000K) for kitchens.", coverImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80", author: "TheIdeaDecorator", category: "Guides", tags: ["lighting", "interior design", "tips"], publishedAt: "2025-04-28T10:00:00Z", updatedAt: "2025-04-28T10:00:00Z", readTime: 4, isPublished: true, relatedProducts: [], views: 189 },
        { id: "blog-3", title: "Small Space? 8 Smart Storage Solutions for Indian Homes", slug: "smart-storage-solutions-indian-homes", excerpt: "Maximize every inch with clever storage hacks designed for compact Indian apartments.", content: "8 storage solutions for Indian homes:\n1. Vertical Wall Shelves\n2. Ottoman Storage\n3. Under-Bed Drawers\n4. Door-Back Organizers\n5. Multi-Function Furniture\n6. Kitchen Wall Racks\n7. Bathroom Corner Shelves\n8. Pooja Room Cabinets", coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", author: "TheIdeaDecorator", category: "Home Decor Tips", tags: ["storage", "small spaces", "indian homes"], publishedAt: "2025-04-10T10:00:00Z", updatedAt: "2025-04-10T10:00:00Z", readTime: 4, isPublished: true, relatedProducts: [], views: 312 },
        { id: "blog-4", title: "The Ultimate Guide to Choosing Curtains & Blinds", slug: "guide-choosing-curtains-blinds", excerpt: "Everything you need to know about fabric, length, color and style when picking window treatments.", content: "Curtains can make or break a room. Here's your complete guide to choosing the right window treatments for every room in your home.", coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80", author: "TheIdeaDecorator", category: "Guides", tags: ["curtains", "blinds", "windows", "guide"], publishedAt: "2025-03-25T10:00:00Z", updatedAt: "2025-03-25T10:00:00Z", readTime: 6, isPublished: true, relatedProducts: [], views: 156 },
        { id: "blog-5", title: "5 Mistakes to Avoid When Decorating Your Bedroom", slug: "5-mistakes-avoid-decorating-bedroom", excerpt: "Common bedroom decor mistakes that make your space look smaller, darker, or cluttered.", content: "Avoid these 5 common mistakes:\n1. Choosing the wrong bed size\n2. Ignoring lighting layers\n3. Too much furniture\n4. Neglecting the ceiling\n5. No personal touches", coverImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", author: "TheIdeaDecorator", category: "Home Decor Tips", tags: ["bedroom", "mistakes", "tips"], publishedAt: "2025-03-18T10:00:00Z", updatedAt: "2025-03-18T10:00:00Z", readTime: 4, isPublished: true, relatedProducts: [], views: 278 },
        { id: "blog-6", title: "How to Create a Cozy Reading Nook at Home", slug: "create-cozy-reading-nook", excerpt: "Transform any corner into a comfortable reading spot with these simple decor ideas.", content: "Every book lover deserves a reading nook. Here's how to create one:\n- Find a quiet corner\n- Add a comfortable chair or floor cushion\n- Install a reading lamp\n- Add shelves for books\n- Include a soft throw blanket\n- Keep a small side table for tea", coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", author: "TheIdeaDecorator", category: "DIY Ideas", tags: ["reading nook", "cozy", "books", "corner decor"], publishedAt: "2025-03-10T10:00:00Z", updatedAt: "2025-03-10T10:00:00Z", readTime: 3, isPublished: true, relatedProducts: [], views: 198 },
        { id: "blog-7", title: "Indoor Plants That Thrive in Indian Weather", slug: "indoor-plants-indian-weather", excerpt: "Low-maintenance plants perfect for Indian homes — survive heat, humidity, and low light.", content: "Best indoor plants for India:\n1. Snake Plant - almost indestructible\n2. Money Plant - grows anywhere\n3. Peace Lily - loves shade\n4. Areca Palm - natural air purifier\n5. Jade Plant - brings luck\n6. Spider Plant - filters toxins\n7. Rubber Plant - bold and beautiful", coverImage: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80", author: "TheIdeaDecorator", category: "Home Decor Tips", tags: ["plants", "indoor", "indian homes", "green"], publishedAt: "2025-03-05T10:00:00Z", updatedAt: "2025-03-05T10:00:00Z", readTime: 5, isPublished: true, relatedProducts: [], views: 445 },
        { id: "blog-8", title: "Budget-Friendly Bathroom Makeover Ideas Under ₹5000", slug: "budget-bathroom-makeover-5000", excerpt: "Give your bathroom a fresh new look without breaking the bank. Simple swaps that make a big difference.", content: "Transform your bathroom on a budget:\n- New shower curtain (₹500-800)\n- Matching towel set (₹600-1000)\n- Wall-mounted organizer (₹400-700)\n- Scented candles or diffuser (₹300-500)\n- New mirror frame (₹500-1000)\n- Plants that love humidity (₹200-400)", coverImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80", author: "TheIdeaDecorator", category: "Budget Decor", tags: ["bathroom", "budget", "makeover", "affordable"], publishedAt: "2025-02-28T10:00:00Z", updatedAt: "2025-02-28T10:00:00Z", readTime: 4, isPublished: true, relatedProducts: [], views: 367 },
        { id: "blog-9", title: "Wall Art Trends 2025: What's Hot This Year", slug: "wall-art-trends-2025", excerpt: "From maximalist gallery walls to minimalist line art — the biggest wall decor trends this year.", content: "2025 Wall Art Trends:\n1. Oversized abstract paintings\n2. Textured wall hangings\n3. Metal wall sculptures\n4. Botanical prints\n5. Personalized photo walls\n6. Neon signs\n7. Woven tapestries\n8. Geometric mirrors as art", coverImage: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80", author: "TheIdeaDecorator", category: "Trends", tags: ["wall art", "trends", "2025", "decor"], publishedAt: "2025-02-20T10:00:00Z", updatedAt: "2025-02-20T10:00:00Z", readTime: 5, isPublished: true, relatedProducts: [], views: 289 },
        { id: "blog-10", title: "How to Style Your Dining Table Like a Pro", slug: "style-dining-table-like-pro", excerpt: "From everyday setups to festive tablescapes — learn the art of dining table styling.", content: "Dining table styling tips:\n- Start with a table runner or placemats\n- Add a centerpiece (candles, flowers, or a bowl)\n- Use matching dinnerware\n- Layer textures with napkins\n- Keep it proportional to table size\n- Change seasonally for freshness", coverImage: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80", author: "TheIdeaDecorator", category: "Home Decor Tips", tags: ["dining", "table decor", "styling", "entertaining"], publishedAt: "2025-02-14T10:00:00Z", updatedAt: "2025-02-14T10:00:00Z", readTime: 4, isPublished: true, relatedProducts: [], views: 201 },
        { id: "blog-11", title: "Vastu Tips for Home Decor: Placement Guide", slug: "vastu-tips-home-decor-placement", excerpt: "Align your decor with Vastu Shastra principles for positive energy flow in your home.", content: "Vastu-compliant decor tips:\n- Place mirrors on North or East walls\n- Keep the center of home clutter-free\n- Use warm colors in South/Southwest\n- Place water elements in Northeast\n- Avoid dark art in bedrooms\n- Keep kitchen organized (Fire element)", coverImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80", author: "TheIdeaDecorator", category: "Guides", tags: ["vastu", "indian homes", "placement", "energy"], publishedAt: "2025-02-08T10:00:00Z", updatedAt: "2025-02-08T10:00:00Z", readTime: 5, isPublished: true, relatedProducts: [], views: 534 },
        { id: "blog-12", title: "Monsoon-Proof Your Home: Decor Tips for Rainy Season", slug: "monsoon-proof-home-decor-tips", excerpt: "Protect your furniture and keep your home looking fresh during India's monsoon season.", content: "Monsoon decor survival guide:\n- Switch to synthetic/polyester curtains\n- Use moisture-resistant cushion covers\n- Add indoor plants that love humidity\n- Use anti-fungal paint in bathrooms\n- Keep wooden furniture away from windows\n- Add doormats and shoe racks at entries", coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", author: "TheIdeaDecorator", category: "Seasonal", tags: ["monsoon", "seasonal", "protection", "indian homes"], publishedAt: "2025-01-30T10:00:00Z", updatedAt: "2025-01-30T10:00:00Z", readTime: 4, isPublished: true, relatedProducts: [], views: 412 },
        { id: "blog-13", title: "Minimalist Home Decor: Less Is More", slug: "minimalist-home-decor-less-is-more", excerpt: "How to embrace minimalism without making your home feel cold or empty.", content: "Minimalism done right:\n- Choose quality over quantity\n- Stick to a neutral color palette\n- Every item should have purpose\n- Embrace negative space\n- Hidden storage is your friend\n- Add warmth with textures, not clutter\n- One statement piece per room", coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80", author: "TheIdeaDecorator", category: "Trends", tags: ["minimalist", "simple", "clean", "modern"], publishedAt: "2025-01-22T10:00:00Z", updatedAt: "2025-01-22T10:00:00Z", readTime: 4, isPublished: true, relatedProducts: [], views: 267 },
        { id: "blog-14", title: "Diwali Decoration Ideas for Every Budget", slug: "diwali-decoration-ideas-every-budget", excerpt: "From simple diyas to elaborate rangoli setups — festive decor ideas for Diwali.", content: "Diwali decor on every budget:\n\nUnder ₹500: Diyas, candles, marigold strings\nUnder ₹2000: Fairy lights, lanterns, rangoli stencils\nUnder ₹5000: Statement lighting, cushion covers, table runners\nPremium: Brass urlis, designer diyas, ethnic wall hangings", coverImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80", author: "TheIdeaDecorator", category: "Seasonal", tags: ["diwali", "festival", "indian", "decoration"], publishedAt: "2025-01-15T10:00:00Z", updatedAt: "2025-01-15T10:00:00Z", readTime: 5, isPublished: true, relatedProducts: [], views: 678 },
        { id: "blog-15", title: "Home Office Setup: Productivity Meets Aesthetics", slug: "home-office-setup-productivity-aesthetics", excerpt: "Design a workspace that boosts focus and looks Instagram-worthy.", content: "Perfect home office setup:\n1. Ergonomic chair (invest here)\n2. Adjustable desk or desk riser\n3. Good monitor positioning\n4. Task lighting (no glare)\n5. Cable management\n6. A plant for freshness\n7. Personal touches (photos, art)\n8. Noise-canceling elements", coverImage: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80", author: "TheIdeaDecorator", category: "Guides", tags: ["home office", "workspace", "productivity", "WFH"], publishedAt: "2025-01-08T10:00:00Z", updatedAt: "2025-01-08T10:00:00Z", readTime: 5, isPublished: true, relatedProducts: [], views: 389 },
        { id: "blog-16", title: "Rug Buying Guide: Size, Material & Placement", slug: "rug-buying-guide-size-material-placement", excerpt: "The definitive guide to choosing the right rug for your living room, bedroom, and dining area.", content: "Rug Guide:\n\nLiving Room: Rug should fit under front legs of all furniture\nBedroom: Place under 2/3 of the bed\nDining: Must extend 60cm beyond chairs\n\nMaterials: Wool (luxury), Cotton (easy wash), Jute (natural), Synthetic (budget)", coverImage: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80", author: "TheIdeaDecorator", category: "Guides", tags: ["rugs", "carpets", "guide", "buying"], publishedAt: "2025-01-02T10:00:00Z", updatedAt: "2025-01-02T10:00:00Z", readTime: 6, isPublished: true, relatedProducts: [], views: 234 },
        { id: "blog-17", title: "Color Psychology in Home Decor: What Each Color Means", slug: "color-psychology-home-decor", excerpt: "Understanding how colors affect mood and which ones to use in different rooms.", content: "Color meanings in decor:\n- Blue: Calm, trust (bedrooms, bathrooms)\n- Green: Nature, balance (any room)\n- Yellow: Energy, happiness (kitchens)\n- Red: Passion, appetite (dining areas, accents)\n- White: Clean, spacious (small rooms)\n- Grey: Sophisticated, neutral (modern homes)\n- Orange: Warmth, creativity (offices, playrooms)", coverImage: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80", author: "TheIdeaDecorator", category: "Guides", tags: ["colors", "psychology", "mood", "painting"], publishedAt: "2024-12-20T10:00:00Z", updatedAt: "2024-12-20T10:00:00Z", readTime: 5, isPublished: true, relatedProducts: [], views: 456 },
      ],
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

      // Flash Sale Timer
      flashSaleEnd: null,
      setFlashSaleEnd: (date) => set({ flashSaleEnd: date }),

      // Product Q&A
      productQuestions: [],
      askQuestion: (productId, question) =>
        set((state) => ({
          productQuestions: [
            {
              id: generateId(),
              productId,
              userId: state.currentUser?.uid || state.currentUser?.email || "anonymous",
              userName: state.currentUser?.displayName || "Anonymous",
              question,
              upvotes: 0,
              createdAt: new Date().toISOString(),
            },
            ...state.productQuestions,
          ],
        })),
      answerQuestion: (questionId, answer) =>
        set((state) => ({
          productQuestions: state.productQuestions.map((q) =>
            q.id === questionId ? { ...q, answer, answeredBy: "TheIdeaDecorator", answeredAt: new Date().toISOString() } : q
          ),
        })),
      upvoteQuestion: (questionId) =>
        set((state) => ({
          productQuestions: state.productQuestions.map((q) =>
            q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
          ),
        })),
    }),
    {
      name: "theideadecorator-store",
      version: 2,
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
        productQuestions: state.productQuestions,
        flashSaleEnd: state.flashSaleEnd,
      }),
      migrate: (persistedState: unknown, version: number) => {
        // If coming from old version or corrupted state, merge with defaults
        const state = persistedState as Record<string, unknown> || {};
        if (version < 2) {
          // Ensure new fields exist
          if (!state.productQuestions) state.productQuestions = [];
          if (!state.priceAlerts) state.priceAlerts = [];
          if (!state.tickets) state.tickets = [];
          if (!state.notifications) state.notifications = [];
          if (!state.coupons) state.coupons = [];
          if (!state.reviews) state.reviews = [];
          if (!state.appliedCoupon) state.appliedCoupon = null;
        }
        return state;
      },
    }
  )
);
