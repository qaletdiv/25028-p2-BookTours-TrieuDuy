"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCartItem, saveCartItem } from "@/lib/storage";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItem, setCartItem] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCartItem(getCartItem());
    setReady(true);
  }, []);

  const addToCart = (tour) => {
    setCartItem(tour);
    saveCartItem(tour);
  };

  const clearCart = () => {
    setCartItem(null);
    saveCartItem(null);
  };

  return (
    <CartContext.Provider value={{ cartItem, addToCart, clearCart, ready }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
