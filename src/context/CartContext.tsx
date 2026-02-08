"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { currentCart } from "@wix/ecom";
import { wixClient } from "@/lib/wixClient";

interface CartContextType {
  cart: currentCart.Cart | null;
  addItem: (productId: string, quantity: number, options?: Record<string, unknown>) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  isLoading: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<currentCart.Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to save Wix tokens to localStorage
  const saveTokens = () => {
    if (typeof window !== "undefined") {
      const tokens = wixClient.auth.getTokens();
      localStorage.setItem("wix_tickets", JSON.stringify(tokens));
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await wixClient.currentCart.getCurrentCart();
        setCart(cart);
        saveTokens(); // Save tokens after fetching cart (might have been refreshed)
      } catch (err) {
        console.log("No active cart found or error fetching cart", err);
      }
    };
    fetchCart();
  }, []);

  const addItem = async (productId: string, quantity: number, options?: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const { cart } = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e", // Wix Stores App ID
              catalogItemId: productId,
              options: options,
            },
            quantity: quantity,
          },
        ],
      });
      if (cart) {
        setCart(cart);
        saveTokens(); // Important: Save tokens after adding item (session created)
      }
    } catch (err) {
      console.error("Error adding item to cart", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineItemId: string) => {
    setIsLoading(true);
    try {
      const { cart } = await wixClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
      if (cart) {
        setCart(cart);
        saveTokens();
      }
    } catch (err) {
      console.error("Error removing item from cart", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const { cart } = await wixClient.currentCart.updateCurrentCartLineItemQuantity([
        {
          _id: lineItemId,
          quantity: quantity,
        },
      ]);
      if (cart) {
        setCart(cart);
        saveTokens();
      }
    } catch (err) {
      console.error("Error updating cart quantity", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
