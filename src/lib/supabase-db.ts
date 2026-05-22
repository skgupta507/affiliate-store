"use client";

import { supabase, hasSupabase } from "./supabase";
import { Product, Category } from "@/types";

// --- Products ---

export async function saveProduct(product: Product): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("products")
    .upsert(product, { onConflict: "id" });
  if (error) console.error("Supabase saveProduct error:", error.message);
}

export async function updateProductInDb(id: string, updates: Partial<Product>): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);
  if (error) console.error("Supabase updateProduct error:", error.message);
}

export async function deleteProductFromDb(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  if (error) console.error("Supabase deleteProduct error:", error.message);
}

export async function getAllProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) {
    console.error("Supabase getAllProducts error:", error.message);
    return [];
  }
  return (data as Product[]) || [];
}

// --- Categories ---

export async function saveCategory(category: Category): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("categories")
    .upsert(category, { onConflict: "id" });
  if (error) console.error("Supabase saveCategory error:", error.message);
}

export async function deleteCategoryFromDb(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) console.error("Supabase deleteCategory error:", error.message);
}

export async function getAllCategories(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("categories")
    .select("*");
  if (error) {
    console.error("Supabase getAllCategories error:", error.message);
    return [];
  }
  return (data as Category[]) || [];
}

// --- Real-time subscriptions ---

export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("products-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      async () => {
        // On any change, refetch all products
        const products = await getAllProducts();
        callback(products);
      }
    )
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
}

export function subscribeToCategories(callback: (categories: Category[]) => void): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("categories-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "categories" },
      async () => {
        const categories = await getAllCategories();
        callback(categories);
      }
    )
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
}


// --- User Data (cross-device sync for cart, addresses, orders, wishlist) ---

export interface UserSyncData {
  cart: unknown[];
  addresses: unknown[];
  orders: unknown[];
  wishlist: string[];
  watchlists: unknown[];
  recently_viewed: string[];
}

export async function getUserData(userId: string): Promise<UserSyncData | null> {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    console.error("Supabase getUserData error:", error.message);
    return null;
  }
  return data as UserSyncData;
}

export async function saveUserData(userId: string, userData: Partial<UserSyncData>): Promise<void> {
  if (!supabase || !userId) return;
  const { error } = await supabase
    .from("user_data")
    .upsert(
      { user_id: userId, ...userData, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) console.error("Supabase saveUserData error:", error.message);
}

export function subscribeToUserData(userId: string, callback: (data: UserSyncData) => void): () => void {
  if (!supabase || !userId) return () => {};

  const channel = supabase
    .channel(`user-data-${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "user_data", filter: `user_id=eq.${userId}` },
      async () => {
        const data = await getUserData(userId);
        if (data) callback(data);
      }
    )
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
}
