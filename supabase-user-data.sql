-- Run this in your Supabase SQL Editor to create the user_data table
-- This table stores per-user data for cross-device sync (cart, addresses, orders, wishlist)

CREATE TABLE IF NOT EXISTS user_data (
  user_id TEXT PRIMARY KEY,
  cart JSONB DEFAULT '[]'::jsonb,
  addresses JSONB DEFAULT '[]'::jsonb,
  orders JSONB DEFAULT '[]'::jsonb,
  wishlist JSONB DEFAULT '[]'::jsonb,
  watchlists JSONB DEFAULT '[]'::jsonb,
  recently_viewed JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE user_data;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
