"use client";

import { supabase, hasSupabase } from "./supabase";
import { Product, Category } from "@/types";

// --- Products ---

export async function saveProduct(product: Product): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("products")
      .upsert(product, { onConflict: "id" });
    if (error) console.warn("Supabase saveProduct skipped:", error.message);
  } catch {}
}

export async function updateProductInDb(id: string, updates: Partial<Product>): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);
    if (error) console.warn("Supabase updateProduct skipped:", error.message);
  } catch {}
}

export async function deleteProductFromDb(id: string): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (error) console.warn("Supabase deleteProduct skipped:", error.message);
  } catch {}
}

export async function getAllProducts(): Promise<Product[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("createdAt", { ascending: false });
    if (error) return [];
    return (data as Product[]) || [];
  } catch {
    return [];
  }
}

// --- Categories ---

export async function saveCategory(category: Category): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("categories")
      .upsert(category, { onConflict: "id" });
    if (error) console.warn("Supabase saveCategory skipped:", error.message);
  } catch {}
}

export async function deleteCategoryFromDb(id: string): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    if (error) console.warn("Supabase deleteCategory skipped:", error.message);
  } catch {}
}

export async function getAllCategories(): Promise<Category[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*");
    if (error) return [];
    return (data as Category[]) || [];
  } catch {
    return [];
  }
}

// --- Real-time subscriptions ---

export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        async () => {
          try {
            const products = await getAllProducts();
            callback(products);
          } catch {}
        }
      )
      .subscribe();

    return () => {
      try { supabase!.removeChannel(channel); } catch {}
    };
  } catch {
    return () => {};
  }
}

export function subscribeToCategories(callback: (categories: Category[]) => void): () => void {
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel("categories-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        async () => {
          try {
            const categories = await getAllCategories();
            callback(categories);
          } catch {}
        }
      )
      .subscribe();

    return () => {
      try { supabase!.removeChannel(channel); } catch {}
    };
  } catch {
    return () => {};
  }
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
  try {
    const { data, error } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      // Silently handle - don't break the app
      return null;
    }
    return data as UserSyncData | null;
  } catch {
    return null;
  }
}

export async function saveUserData(userId: string, userData: Partial<UserSyncData>): Promise<void> {
  if (!supabase || !userId) return;
  try {
    const { error } = await supabase
      .from("user_data")
      .upsert(
        { user_id: userId, ...userData, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    if (error) {
      // Log but don't throw - RLS errors are common when table isn't set up
      console.warn("Supabase saveUserData skipped:", error.message);
    }
  } catch {
    // Network or other error - silently skip
  }
}

export function subscribeToUserData(userId: string, callback: (data: UserSyncData) => void): () => void {
  if (!supabase || !userId) return () => {};

  try {
    const channel = supabase
      .channel(`user-data-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_data", filter: `user_id=eq.${userId}` },
        async () => {
          try {
            const data = await getUserData(userId);
            if (data) callback(data);
          } catch {}
        }
      )
      .subscribe();

    return () => {
      try { supabase!.removeChannel(channel); } catch {}
    };
  } catch {
    return () => {};
  }
}
