"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { hasSupabase } from "@/lib/supabase";
import {
  getAllProducts,
  getAllCategories,
  saveProduct,
  deleteProductFromDb,
  updateProductInDb,
  saveCategory,
  deleteCategoryFromDb,
  subscribeToProducts,
  subscribeToCategories,
} from "@/lib/supabase-db";

/**
 * Syncs Zustand store with Supabase for cross-device persistence.
 * - On mount: fetches all data from Supabase and subscribes to real-time changes.
 * - On local changes: writes to Supabase automatically.
 */
export function FirestoreSync() {
  const initialized = useRef(false);
  const prevProductIds = useRef<string>("");
  const prevCategoryIds = useRef<string>("");
  const skipNextSync = useRef(false);

  const products = useStore((s) => s.products);
  const categories = useStore((s) => s.categories);

  // Initial load + real-time subscription
  useEffect(() => {
    if (!hasSupabase) return;

    let mounted = true;

    async function init() {
      // Fetch initial data
      const [dbProducts, dbCategories] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);

      if (!mounted) return;

      if (dbProducts.length > 0) {
        skipNextSync.current = true;
        useStore.setState({ products: dbProducts });
        prevProductIds.current = JSON.stringify(dbProducts.map((p) => `${p.id}:${p.updatedAt}`).sort());
      } else {
        // If Supabase is empty but local has data, push local to Supabase
        const localProducts = useStore.getState().products;
        if (localProducts.length > 0) {
          for (const p of localProducts) {
            await saveProduct(p);
          }
        }
        prevProductIds.current = JSON.stringify(localProducts.map((p) => `${p.id}:${p.updatedAt}`).sort());
      }

      if (dbCategories.length > 0) {
        skipNextSync.current = true;
        useStore.setState({ categories: dbCategories });
        prevCategoryIds.current = JSON.stringify(dbCategories.map((c) => c.id).sort());
      } else {
        const localCategories = useStore.getState().categories;
        for (const c of localCategories) {
          await saveCategory(c);
        }
        prevCategoryIds.current = JSON.stringify(localCategories.map((c) => c.id).sort());
      }

      initialized.current = true;
    }

    init();

    // Real-time subscriptions
    const unsubProducts = subscribeToProducts((dbProducts) => {
      if (!mounted) return;
      skipNextSync.current = true;
      useStore.setState({ products: dbProducts });
      prevProductIds.current = JSON.stringify(dbProducts.map((p) => `${p.id}:${p.updatedAt}`).sort());
    });

    const unsubCategories = subscribeToCategories((dbCategories) => {
      if (!mounted) return;
      if (dbCategories.length > 0) {
        skipNextSync.current = true;
        useStore.setState({ categories: dbCategories });
        prevCategoryIds.current = JSON.stringify(dbCategories.map((c) => c.id).sort());
      }
    });

    return () => {
      mounted = false;
      unsubProducts();
      unsubCategories();
    };
  }, []);

  // Sync product changes to Supabase
  useEffect(() => {
    if (!hasSupabase || !initialized.current) return;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }

    // Use a hash that includes product data (updatedAt changes on edit), not just IDs
    const currentHash = JSON.stringify(products.map((p) => `${p.id}:${p.updatedAt}`).sort());
    if (currentHash === prevProductIds.current) return;

    const prevIds = new Set<string>(
      (() => {
        try {
          const parsed = JSON.parse(prevProductIds.current || "[]");
          // Handle both old format (just IDs) and new format (id:updatedAt)
          return parsed.map((s: string) => s.split(":")[0]);
        } catch { return []; }
      })()
    );
    const currentIdSet = new Set(products.map((p) => p.id));

    // Save new/updated products
    for (const product of products) {
      saveProduct(product);
    }

    // Delete removed products
    for (const id of prevIds) {
      if (!currentIdSet.has(id)) {
        deleteProductFromDb(id);
      }
    }

    prevProductIds.current = currentHash;
  }, [products]);

  // Sync category changes to Supabase
  useEffect(() => {
    if (!hasSupabase || !initialized.current) return;
    if (skipNextSync.current) return;

    const currentIds = JSON.stringify(categories.map((c) => c.id).sort());
    if (currentIds === prevCategoryIds.current) return;

    const prevIds = new Set<string>(
      prevCategoryIds.current ? JSON.parse(prevCategoryIds.current) : []
    );
    const currentIdSet = new Set(categories.map((c) => c.id));

    for (const cat of categories) {
      saveCategory(cat);
    }

    for (const id of prevIds) {
      if (!currentIdSet.has(id)) {
        deleteCategoryFromDb(id);
      }
    }

    prevCategoryIds.current = currentIds;
  }, [categories]);

  return null;
}
