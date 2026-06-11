-- ============================================
-- TheIdeaDecorator — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  "affiliateUrl" TEXT DEFAULT '',
  platform TEXT DEFAULT 'Other',
  category TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  price NUMERIC,
  "originalPrice" NUMERIC,
  currency TEXT DEFAULT 'INR',
  rating NUMERIC,
  "reviewCount" INTEGER,
  "isFeatured" BOOLEAN DEFAULT false,
  "isTrending" BOOLEAN DEFAULT false,
  clicks INTEGER DEFAULT 0,
  "createdAt" TEXT DEFAULT '',
  "updatedAt" TEXT DEFAULT '',
  stock INTEGER,
  sku TEXT,
  brand TEXT,
  weight TEXT,
  dimensions TEXT,
  specifications JSONB,
  "isAffiliate" BOOLEAN DEFAULT true,
  seller TEXT,
  "sellerRating" NUMERIC,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  slug TEXT,
  "viewCount" INTEGER DEFAULT 0,
  "purchaseCount" INTEGER DEFAULT 0,
  "costPrice" NUMERIC
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT DEFAULT '',
  icon TEXT,
  image TEXT,
  description TEXT,
  "productCount" INTEGER DEFAULT 0,
  "parentId" TEXT
);

-- 3. USER_DATA TABLE (for cross-device sync of cart, wishlist, orders, etc.)
CREATE TABLE IF NOT EXISTS user_data (
  user_id TEXT PRIMARY KEY,
  cart JSONB DEFAULT '[]'::jsonb,
  addresses JSONB DEFAULT '[]'::jsonb,
  orders JSONB DEFAULT '[]'::jsonb,
  wishlist JSONB DEFAULT '[]'::jsonb,
  watchlists JSONB DEFAULT '[]'::jsonb,
  recently_viewed JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- These allow your app to read/write without auth issues
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow public write products" ON products;
DROP POLICY IF EXISTS "Allow public read categories" ON categories;
DROP POLICY IF EXISTS "Allow public write categories" ON categories;
DROP POLICY IF EXISTS "Allow public read user_data" ON user_data;
DROP POLICY IF EXISTS "Allow public write user_data" ON user_data;

-- PRODUCTS: Anyone can read, authenticated/anon can write (for admin operations)
CREATE POLICY "Allow public read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow public write products" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- CATEGORIES: Anyone can read, authenticated/anon can write
CREATE POLICY "Allow public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public write categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);

-- USER_DATA: Anyone can read/write (user_id is used as the key)
CREATE POLICY "Allow public read user_data" ON user_data
  FOR SELECT USING (true);

CREATE POLICY "Allow public write user_data" ON user_data
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- ENABLE REALTIME (for live sync across devices)
-- ============================================

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE user_data;

-- ============================================
-- INDEXES (for better performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_platform ON products (platform);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products ("isFeatured");
CREATE INDEX IF NOT EXISTS idx_products_is_trending ON products ("isTrending");
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products ("createdAt");
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data (user_id);
