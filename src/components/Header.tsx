"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, User, Heart, ShoppingCart, Menu, ChevronDown, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { wixClient } from "@/lib/wixClient";
import { collections } from "@wix/stores";

const HeaderContent = () => {
  const { cart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<collections.Collection[]>([]);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await wixClient.collections.queryCollections().find();
        setCategories(response.items);
      } catch (err) {
        console.error("Erreur collections header:", err);
      }
    };
    fetchCollections();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const subtotal = cart?.lineItems?.reduce((acc, item) => {
    return acc + (Number(item.price?.amount) * (item.quantity || 1));
  }, 0) || 0;

  const formattedSubtotal = cart?.currency 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cart.currency }).format(subtotal)
    : (subtotal).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  return (
    <header className="w-full relative z-50">
      {/* Top Bar with Scrolling Info */}
      <div className="bg-green-600 text-white text-xs py-2 overflow-hidden border-b border-green-500/30">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-12">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Livraison gratuite & -40% sur vos 3 prochaines commandes ! Commandez maintenant.
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Besoin d&apos;aide ? +1800 900 122 — Français — EUR
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Livraison gratuite & -40% sur vos 3 prochaines commandes ! Commandez maintenant.
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Besoin d&apos;aide ? +1800 900 122 — Français — EUR
          </span>
        </div>
      </div>

      <div className="bg-white py-4 px-4 md:px-8 flex items-center justify-between gap-4 border-b">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-green-600 rounded-full p-2">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl md:text-2xl font-bold text-gray-800">Wix Exotics</span>
        </Link>

        {/* Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="w-full flex items-center border rounded-md overflow-hidden bg-gray-100 focus-within:ring-2 focus-within:ring-green-500 transition-all">
            <input 
              type="text" 
              placeholder="Rechercher des produits..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-transparent outline-none text-gray-800"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 cursor-pointer">
            <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            <div className="hidden lg:block text-sm">
              <p className="text-xs text-gray-500">Compte</p>
              <p className="font-semibold text-gray-800">Connexion</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 cursor-pointer">
            <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            <div className="hidden lg:block text-sm">
              <p className="text-xs text-gray-500">Favoris</p>
              <p className="font-semibold text-gray-800">0 Articles</p>
            </div>
          </div>
          <Link href="/cart" className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              {mounted && cart && cart.lineItems && cart.lineItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] md:text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                  {cart.lineItems.length}
                </span>
              )}
            </div>
            <div className="hidden lg:block text-sm">
              <p className="text-xs text-gray-500">Panier</p>
              <p className="font-semibold text-gray-800">
                {mounted ? formattedSubtotal : "0,00 €"}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation (Desktop) */}
      <div className="bg-white border-b py-3 px-4 md:px-8 hidden md:flex items-center justify-between">
        {/* Categories Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold shadow-sm"
          >
            <Menu className="w-4 h-4" />
            Toutes les Catégories
            <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="py-2">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link 
                      href={`/shop?cat=${cat._id}`} 
                      className="block px-6 py-3 hover:bg-green-50 hover:text-green-600 transition-colors text-gray-700"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li className="px-6 py-3 text-gray-400 text-sm">Chargement...</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Centered Menu */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10 text-sm font-bold text-gray-700">
          <Link href="/" className="hover:text-green-600 transition-colors uppercase tracking-wider border-b-2 border-transparent hover:border-green-600 pb-1">Accueil</Link>
          <Link href="/shop" className="hover:text-green-600 transition-colors uppercase tracking-wider border-b-2 border-transparent hover:border-green-600 pb-1">Boutique</Link>
          <Link href="/blog" className="hover:text-green-600 transition-colors uppercase tracking-wider border-b-2 border-transparent hover:border-green-600 pb-1">Blog</Link>
          <Link href="/contact" className="hover:text-green-600 transition-colors uppercase tracking-wider border-b-2 border-transparent hover:border-green-600 pb-1">Contact</Link>
        </div>

        <div className="w-48 invisible" aria-hidden="true" />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 ease-out">
            <div className="p-4 border-b flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="bg-green-600 rounded-full p-2">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800 uppercase tracking-tight">Wix Exotics</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Mobile Search */}
              <div className="p-4">
                <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl text-gray-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button type="submit" className="hidden">Rechercher</button>
                </form>
              </div>

              {/* Main Navigation */}
              <nav className="p-4 space-y-2 border-b">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Menu Principal</p>
                <Link 
                  href="/" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 font-bold hover:bg-green-50 hover:text-green-600 rounded-xl transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link 
                  href="/shop" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 font-bold hover:bg-green-50 hover:text-green-600 rounded-xl transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Boutique
                </Link>
                <Link 
                  href="/blog" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 font-bold hover:bg-green-50 hover:text-green-600 rounded-xl transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  href="/contact" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 font-bold hover:bg-green-50 hover:text-green-600 rounded-xl transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              {/* Categories Navigation */}
              <div className="p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Nos Catégories</p>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((cat) => (
                    <Link 
                      key={cat._id}
                      href={`/shop?cat=${cat._id}`}
                      className="px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all flex items-center justify-between group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="font-medium">{cat.name}</span>
                      <ChevronDown className="w-4 h-4 -rotate-90 text-gray-300 group-hover:text-green-500" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer Action */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Mon Compte</span>
                </div>
                <Link 
                  href="/cart" 
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Panier ({mounted ? cart?.lineItems?.length || 0 : 0})
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Header = () => {
  return (
    <Suspense fallback={<div className="h-20 bg-white" />}>
      <HeaderContent />
    </Suspense>
  );
};

export default Header;
