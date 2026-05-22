"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { hasSupabase } from "@/lib/supabase";
import { getUserData, saveUserData, subscribeToUserData } from "@/lib/supabase-db";

/**
 * Syncs user-specific data (cart, addresses, orders, wishlist, watchlists)
 * with Supabase for cross-device persistence.
 * 
 * Only activates when a user is logged in.
 * Uses the user's email as the unique key.
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
  const userId = currentUser?.uid || currentUser?.email || "";

  // Get a hash of current user data to detect changes
  const getDataHash = () => {
    return JSON.stringify({ cart, addresses, orders, wishlist, watchlists, recentlyViewed });
  };

  // Load user data from Supabase on login
  useEffect(() => {
    if (!hasSupabase || !isUserLoggedIn || !userId) {
      initialized.current = false;
      return;
    }

    let mounted = true;

    async function loadUserData() {
      const data = await getUserData(userId);
      if (!mounted) return;

      if (data) {
        skipSync.current = true;
        const state: Record<string, unknown> = {};
        if (data.cart && Array.isArray(data.cart) && data.cart.length > 0) {
          state.cart = data.cart;
        }
        if (data.addresses && Array.isArray(data.addresses) && data.addresses.length > 0) {
          state.addresses = data.addresses;
        }
        if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          state.orders = data.orders;
        }
        if (data.wishlist && Array.isArray(data.wishlist) && data.wishlist.length > 0) {
          state.wishlist = data.wishlist;
        }
        if (data.watchlists && Array.isArray(data.watchlists) && data.watchlists.length > 0) {
          state.watchlists = data.watchlists;
        }
        if (data.recently_viewed && Array.isArray(data.recently_viewed) && data.recently_viewed.length > 0) {
          state.recentlyViewed = data.recently_viewed;
        }

        if (Object.keys(state).length > 0) {
          useStore.setState(state);
        }
      } else {
        // No data in Supabase yet — push local data up
        const localState = useStore.getState();
        await saveUserData(userId, {
          cart: localState.cart,
          addresses: localState.addresses,
          orders: localState.orders,
          wishlist: localState.wishlist,
          watchlists: localState.watchlists,
          recently_viewed: localState.recentlyViewed,
        });
      }

      prevDataHash.current = getDataHash();
      initialized.current = true;
    }

    loadUserData();

    // Subscribe to real-time changes from other devices
    const unsub = subscribeToUserData(userId, (data) => {
      if (!mounted) return;
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
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [isUserLoggedIn, userId]);

  // Sync local changes to Supabase
  useEffect(() => {
    if (!hasSupabase || !isUserLoggedIn || !userId || !initialized.current) return;

    if (skipSync.current) {
      skipSync.current = false;
      prevDataHash.current = getDataHash();
      return;
    }

    const currentHash = getDataHash();
    if (currentHash === prevDataHash.current) return;
    prevDataHash.current = currentHash;

    // Debounce: save after a short delay to batch rapid changes
    const timeout = setTimeout(() => {
      saveUserData(userId, {
        cart,
        addresses,
        orders,
        wishlist,
        watchlists,
        recently_viewed: recentlyViewed,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [cart, addresses, orders, wishlist, watchlists, recentlyViewed, isUserLoggedIn, userId]);

  return null;
}
