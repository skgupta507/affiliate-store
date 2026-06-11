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
 * Completely error-safe — will never break navigation or interactivity.
 */
export function FirestoreSync() {
  const initialized = useRef(false);
  const prevProductIds = useRef<string>("");
  const prevCategoryIds = useRef<string>("");
  const skipNextSync = useRef(false);
  const syncFailed = useRef(false);

  const products = useStore((s) => s.products);
  const categories = useStore((s) => s.categories);

  // Initial load + real-time subscription
  useEffect(() => {
    if (!hasSupabase) return;

    let mounted = true;

    async function init() {
      try {
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
          const localProducts = useStore.getState().products;
          if (localProducts.length > 0) {
            for (const p of localProducts) {
              try { await saveProduct(p); } catch { syncFailed.current = true; break; }
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
            try { await saveCategory(c); } catch { syncFailed.current = true; break; }
          }
          prevCategoryIds.current = JSON.stringify(localCategories.map((c) => c.id).sort());
        }

        initialized.current = true;
      } catch (err) {
        console.warn("FirestoreSync: Init failed, continuing offline", err);
        syncFailed.current = true;
        initialized.current = true;
      }
    }

    init();

    // Real-time subscriptions (wrapped for safety)
    let unsubProducts = () => {};
    let unsubCategories = () => {};

    try {
      unsubProducts = subscribeToProducts((dbProducts) => {
        if (!mounted) return;
        try {
          skipNextSync.current = true;
          useStore.setState({ products: dbProducts });
          prevProductIds.current = JSON.stringify(dbProducts.map((p) => `${p.id}:${p.updatedAt}`).sort());
        } catch {}
      });

      unsubCategories = subscribeToCategories((dbCategories) => {
        if (!mounted) return;
        try {
          if (dbCategories.length > 0) {
            skipNextSync.current = true;
            useStore.setState({ categories: dbCategories });
            prevCategoryIds.current = JSON.stringify(dbCategories.map((c) => c.id).sort());
          }
        } catch {}
      });
    } catch {}

    return () => {
      mounted = false;
      try { unsubProducts(); } catch {}
      try { unsubCategories(); } catch {}
    };
  }, []);

  // Sync product changes to Supabase
  useEffect(() => {
    if (!hasSupabase || !initialized.current || syncFailed.current) return;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }

    const currentHash = JSON.stringify(products.map((p) => `${p.id}:${p.updatedAt}`).sort());
    if (currentHash === prevProductIds.current) return;

    const prevIds = new Set<string>(
      (() => {
        try {
          const parsed = JSON.parse(prevProductIds.current || "[]");
          return parsed.map((s: string) => s.split(":")[0]);
        } catch { return []; }
      })()
    );
    const currentIdSet = new Set(products.map((p) => p.id));

    // Save new/updated products (don't await, fire and forget)
    for (const product of products) {
      saveProduct(product).catch(() => { syncFailed.current = true; });
    }

    // Delete removed products
    for (const id of prevIds) {
      if (!currentIdSet.has(id)) {
        deleteProductFromDb(id).catch(() => {});
      }
    }

    prevProductIds.current = currentHash;
  }, [products]);

  // Sync category changes to Supabase
  useEffect(() => {
    if (!hasSupabase || !initialized.current || syncFailed.current) return;
    if (skipNextSync.current) return;

    const currentIds = JSON.stringify(categories.map((c) => c.id).sort());
    if (currentIds === prevCategoryIds.current) return;

    const prevIds = new Set<string>(
      (() => { try { return JSON.parse(prevCategoryIds.current || "[]"); } catch { return []; } })()
    );
    const currentIdSet = new Set(categories.map((c) => c.id));

    for (const cat of categories) {
      saveCategory(cat).catch(() => { syncFailed.current = true; });
    }

    for (const id of prevIds) {
      if (!currentIdSet.has(id)) {
        deleteCategoryFromDb(id).catch(() => {});
      }
    }

    prevCategoryIds.current = currentIds;
  }, [categories]);

  return null;
}
