export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  productCount: number;
}

export interface User {
  uid?: string;
  email: string;
  isAdmin: boolean;
  displayName?: string;
  photoURL?: string;
  provider?: "email" | "google" | "local";
}

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
  platform?: string;
  siteName?: string;
  success: boolean;
  error?: string;
}

export interface AnalyticsData {
  totalProducts: number;
  totalClicks: number;
  totalCategories: number;
  topProducts: Product[];
  clicksByDay: { date: string; clicks: number }[];
  platformDistribution: { platform: string; count: number }[];
}

export type ThemeMode = "light" | "dark";

export interface StoreState {
  products: Product[];
  categories: Category[];
  wishlist: string[];
  recentlyViewed: string[];
  theme: ThemeMode;
  searchQuery: string;
  isAuthenticated: boolean;
  user: User | null;
}
