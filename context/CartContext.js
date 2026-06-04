"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { saveCartItems } from "@/lib/storage";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api
      .getCart()
      .then(({ items }) => {
        setCartItems(items);
        saveCartItems(items);
      })
      .catch(() => setCartItems([]))
      .finally(() => setReady(true));
  }, []);

  const syncItems = useCallback((items) => {
    setCartItems(items);
    saveCartItems(items);
  }, []);

  const addToCart = useCallback(async (tour) => {
    try {
      const { items } = await api.addToCart(tour);
      syncItems(items);
    } catch {
      setCartItems((prev) => {
        if (prev.some((t) => t.id === tour.id)) return prev;
        const next = [...prev, tour];
        saveCartItems(next);
        return next;
      });
    }
  }, [syncItems]);

  const removeFromCart = useCallback(async (tourId) => {
    try {
      const { items } = await api.removeFromCart(tourId);
      syncItems(items);
    } catch {
      setCartItems((prev) => {
        const next = prev.filter((t) => t.id !== tourId);
        saveCartItems(next);
        return next;
      });
    }
  }, [syncItems]);

  const clearCart = useCallback(async () => {
    try {
      const { items } = await api.clearCart();
      syncItems(items);
    } catch {
      syncItems([]);
    }
  }, [syncItems]);

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, removeFromCart, clearCart, ready }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
