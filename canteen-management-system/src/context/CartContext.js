"use client";

import { createContext, useEffect, useState } from "react";
import { calculateCartTotal } from "@/utils/helpers";

export const CartContext = createContext(null);

function getInitialCart() {
  if (typeof window === "undefined") {
    return [];
  }
  const saved = localStorage.getItem("cms_cart");
  return saved ? JSON.parse(saved) : [];
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);

  useEffect(() => {
    localStorage.setItem("cms_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(food) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  }

  function updateQuantity(foodId, quantity) {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === foodId ? { ...item, quantity } : item))
    );
  }

  function removeFromCart(foodId) {
    setCartItems((prev) => prev.filter((item) => item._id !== foodId));
  }

  function clearCart() {
    setCartItems([]);
  }

  const value = {
    cartItems,
    totalItems: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: calculateCartTotal(cartItems),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
