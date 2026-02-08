"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function AddToCart({ productId }: { productId: string }) {
  const { addItem, isLoading } = useCart();

  return (
    <button
      onClick={() => addItem(productId, 1)}
      disabled={isLoading}
      className="flex-1 bg-green-600 text-white py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="w-6 h-6" />
      {isLoading ? "Ajout en cours..." : "Ajouter au Panier"}
    </button>
  );
}