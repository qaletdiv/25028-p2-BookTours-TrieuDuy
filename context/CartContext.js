"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCartItems, saveCartItems } from "@/lib/storage";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCartItems(getCartItems());
    setReady(true);
  }, []);

  const addToCart = useCallback((tour) => {
    setCartItems((prev) => {
      if (prev.some((t) => t.id === tour.id)) return prev;
      const next = [...prev, tour];
      saveCartItems(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((tourId) => {
    setCartItems((prev) => {
      const next = prev.filter((t) => t.id !== tourId);
      if (next.length === prev.length) return prev;
      saveCartItems(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems((prev) => {
      if (prev.length === 0) return prev;
      saveCartItems([]);
      return [];
    });
  }, []);

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
