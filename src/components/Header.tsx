"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { cart } = useCart();

  const subtotal = cart?.lineItems?.reduce((acc, item) => {
    return acc + (Number(item.price?.amount) * (item.quantity || 1));
  }, 0) || 0;

  const formattedSubtotal = cart?.currency 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cart.currency }).format(subtotal)
    : (subtotal).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="bg-green-600 text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>Livraison gratuite & -40% sur vos 3 prochaines commandes ! Commandez maintenant.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Besoin d&apos;aide ? +1800 900 122</span>
          <span>Français</span>
          <span>EUR</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-green-600 rounded-full p-2">
            <ShoppingBagIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">EKOMART</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl w-full relative">
          <div className="flex items-center border rounded-md overflow-hidden bg-gray-100">
            <input 
              type="text" 
              placeholder="Rechercher des produits..." 
              className="w-full px-4 py-2 bg-transparent outline-none text-gray-800"
            />
            <button className="bg-green-600 text-white px-6 py-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer">
            <User className="w-6 h-6 text-gray-600" />
            <div className="hidden lg:block text-sm">
              <p className="text-xs text-gray-500">Compte</p>
              <p className="font-semibold text-gray-800">Connexion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Heart className="w-6 h-6 text-gray-600" />
            <div className="hidden lg:block text-sm">
              <p className="text-xs text-gray-500">Favoris</p>
              <p className="font-semibold text-gray-800">0 Articles</p>
            </div>
          </div>
          <Link href="/cart" className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              {cart && cart.lineItems && cart.lineItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.lineItems.length}
                </span>
              )}
            </div>
            <div className="hidden lg:block text-sm">
              <p className="text-xs text-gray-500">Panier</p>
              <p className="font-semibold text-gray-800">{formattedSubtotal}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b py-3 px-4 md:px-8 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-8 text-sm font-medium text-gray-700">
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md">
            <Menu className="w-4 h-4" />
            Toutes les Catégories
          </button>
          <Link href="/" className="hover:text-green-600">Accueil</Link>
          <Link href="/shop" className="hover:text-green-600">Boutique</Link>
          <Link href="/blog" className="hover:text-green-600">Blog</Link>
          <Link href="/contact" className="hover:text-green-600">Contact</Link>
        </div>
      </div>
    </div>
  );
};

const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default Header;
