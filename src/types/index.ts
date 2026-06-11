export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  affiliateUrl: string;
  platform: string;
  category: string;
  tags: string[];
  price?: number;
  originalPrice?: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  isFeatured: boolean;
  isTrending: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  // E-commerce fields
  stock?: number;
  sku?: string;
  brand?: string;
  weight?: string;
  dimensions?: string;
  specifications?: Record<string, string>;
  isAffiliate: boolean; // true = affiliate link, false = direct sell
  seller?: string;
  sellerRating?: number;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  // Social proof
  viewCount?: number;
  purchaseCount?: number;
  // Cost price for profit tracking
  costPrice?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  couponCode?: string;
  couponDiscount?: number;
  userId?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verifiedPurchase?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  productCount: number;
  parentId?: string;
}

export interface User {
  uid?: string;
  email: string;
  isAdmin: boolean;
  displayName?: string;
  photoURL?: string;
  provider?: "email" | "google" | "local";
  phone?: string;
  addresses?: Address[];
  loyaltyPoints?: number;
  loyaltyTier?: LoyaltyTier;
  referralCode?: string;
  referredBy?: string;
  totalSpent?: number;
  orderCount?: number;
  joinedAt?: string;
}

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export interface Watchlist {
  id: string;
  name: string;
  productIds: string[];
  createdAt: string;
}

export interface MetadataResult {
  title?: string;
  description?: string;
  image?: string;
  price?: string;
  originalPrice?: string;
  category?: string;
  tags?: string[];
  rating?: string;
  reviewCount?: string;
  platform?: string;
  siteName?: string;
  success: boolean;
  error?: string;
}

export interface AnalyticsData {
  totalProducts: number;
  totalClicks: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: Product[];
  clicksByDay: { date: string; clicks: number }[];
  platformDistribution: { platform: string; count: number }[];
  ordersByDay: { date: string; orders: number; revenue: number }[];
}

export type ThemeMode = "light" | "dark";

export interface StoreState {
  products: Product[];
  categories: Category[];
  wishlist: string[];
  cart: CartItem[];
  orders: Order[];
  recentlyViewed: string[];
  theme: ThemeMode;
  searchQuery: string;
  isAuthenticated: boolean;
  user: User | null;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder?: number;
  maxDiscount?: number;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
  applicableCategories?: string[];
  firstOrderOnly?: boolean;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  type: "discount" | "freeShipping" | "product";
  value: number;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  isPublished: boolean;
  relatedProducts?: string[];
  views: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "price_drop" | "back_in_stock" | "order_update" | "promotion" | "reward";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AffiliateStats {
  productId: string;
  clicks: number;
  platform: string;
  estimatedCommission: number;
  conversionRate?: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  orderId?: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

export interface TicketReply {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}
