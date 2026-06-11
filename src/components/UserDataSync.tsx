"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { hasSupabase } from "@/lib/supabase";
import { getUserData, saveUserData, subscribeToUserData } from "@/lib/supabase-db";

/**
 * Syncs user-specific data (cart, addresses, orders, wishlist, watchlists)
 * with Supabase for cross-device persistence.
 * 
 * Completely error-safe — will never break the app even if Supabase is misconfigured.
 */
export function UserDataSync() {
  const isUserLoggedIn = useStore((s) => s.isUserLoggedIn);
  const currentUser = useStore((s) => s.currentUser);
  const cart = useStore((s) => s.cart);
  const addresses = useStore((s) => s.addresses);
  const orders = useStore((s) => s.orders);
  const wishlist = useStore((s) => s.wishlist);
  const watchlists = useStore((s) => s.watchlists);
  const recentlyViewed = useStore((s) => s.recentlyViewed);

  const initialized = useRef(false);
  const skipSync = useRef(false);
  const prevDataHash = useRef("");
  const syncFailed = useRef(false); // If sync fails once, stop retrying to avoid error spam
  const userId = currentUser?.uid || currentUser?.email || "";

  const getDataHash = () => {
    try {
      return JSON.stringify({ cart, addresses, orders, wishlist, watchlists, recentlyViewed });
    } catch {
      return "";
    }
  };

  // Load user data from Supabase on login
  useEffect(() => {
    if (!hasSupabase || !isUserLoggedIn || !userId) {
      initialized.current = false;
      return;
    }

    let mounted = true;

    async function loadUserData() {
      try {
        const data = await getUserData(userId);
        if (!mounted) return;

        if (data) {
          skipSync.current = true;
          const state: Record<string, unknown> = {};
          if (data.cart && Array.isArray(data.cart) && data.cart.length > 0) state.cart = data.cart;
          if (data.addresses && Array.isArray(data.addresses) && data.addresses.length > 0) state.addresses = data.addresses;
          if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) state.orders = data.orders;
          if (data.wishlist && Array.isArray(data.wishlist) && data.wishlist.length > 0) state.wishlist = data.wishlist;
          if (data.watchlists && Array.isArray(data.watchlists) && data.watchlists.length > 0) state.watchlists = data.watchlists;
          if (data.recently_viewed && Array.isArray(data.recently_viewed) && data.recently_viewed.length > 0) state.recentlyViewed = data.recently_viewed;

          if (Object.keys(state).length > 0) {
            useStore.setState(state);
          }
        } else {
          // Try to push local data — if this fails (RLS), just skip silently
          try {
            const localState = useStore.getState();
            await saveUserData(userId, {
              cart: localState.cart,
              addresses: localState.addresses,
              orders: localState.orders,
              wishlist: localState.wishlist,
              watchlists: localState.watchlists,
              recently_viewed: localState.recentlyViewed,
            });
          } catch {
            syncFailed.current = true;
          }
        }

        prevDataHash.current = getDataHash();
        initialized.current = true;
      } catch (err) {
        // Supabase failed (RLS, network, etc.) — just continue without sync
        console.warn("UserDataSync: Failed to load, continuing offline", err);
        syncFailed.current = true;
        initialized.current = true;
      }
    }

    loadUserData();

    // Subscribe to real-time changes (wrapped in try/catch)
    let unsub = () => {};
    try {
      unsub = subscribeToUserData(userId, (data) => {
        if (!mounted) return;
        try {
          skipSync.current = true;
          const state: Record<string, unknown> = {};
          if (data.cart) state.cart = data.cart;
          if (data.addresses) state.addresses = data.addresses;
          if (data.orders) state.orders = data.orders;
          if (data.wishlist) state.wishlist = data.wishlist;
          if (data.watchlists) state.watchlists = data.watchlists;
          if (data.recently_viewed) state.recentlyViewed = data.recently_viewed;
          useStore.setState(state);
          prevDataHash.current = JSON.stringify(state);
        } catch {
          // Ignore subscription errors
        }
      });
    } catch {
      // Subscription setup failed — continue without real-time sync
    }

    return () => {
      mounted = false;
      try { unsub(); } catch {}
    };
  }, [isUserLoggedIn, userId]);

  // Sync local changes to Supabase
  useEffect(() => {
    if (!hasSupabase || !isUserLoggedIn || !userId || !initialized.current || syncFailed.current) return;

    if (skipSync.current) {
      skipSync.current = false;
      prevDataHash.current = getDataHash();
      return;
    }

    const currentHash = getDataHash();
    if (currentHash === prevDataHash.current) return;
    prevDataHash.current = currentHash;

    const timeout = setTimeout(() => {
      saveUserData(userId, {
        cart,
        addresses,
        orders,
        wishlist,
        watchlists,
        recently_viewed: recentlyViewed,
      }).catch(() => {
        // If save fails (RLS policy), stop trying
        syncFailed.current = true;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [cart, addresses, orders, wishlist, watchlists, recentlyViewed, isUserLoggedIn, userId]);

  return null;
}
