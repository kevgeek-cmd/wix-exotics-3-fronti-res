"use client";

import Image from "next/image";
import Link from "next/link";
import { getWixImageUrl } from "@/lib/wixImage";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { wixClient } from "@/lib/wixClient";
import { useState } from "react";
import { SiteConfig } from "@/lib/siteConfig";

interface CartContentProps {
  siteConfig: SiteConfig;
}

export default function CartContent({ siteConfig }: CartContentProps) {
  const { cart, removeItem, updateQuantity, isLoading } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const subtotal = cart?.lineItems?.reduce((acc, item) => {
    return acc + (Number(item.price?.amount) * (item.quantity || 1));
  }, 0) || 0;

  const formattedSubtotal = cart?.currency 
    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cart.currency }).format(subtotal)
    : (subtotal).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  const handleCheckout = async () => {
    if (!cart) return;
    setIsRedirecting(true);
    try {
      const { redirectSession } = await wixClient.redirects.createRedirectSession({
        ecomCheckout: {
          checkoutId: cart._id!,
        },
        callbacks: {
          postFlowUrl: window.location.origin + "/success",
          thankYouPageUrl: window.location.origin + "/success",
        },
      });
      
      if (redirectSession?.fullUrl) {
        // Redirection automatique vers le checkout Wix
        window.location.href = redirectSession.fullUrl;
      } else {
        alert("Erreur: Pas d'URL de redirection reçue de Wix.");
        setIsRedirecting(false);
      }
    } catch (err) {
      console.error("Checkout error", err);
      alert("Erreur lors de la redirection vers le paiement. Veuillez réessayer.");
      setIsRedirecting(false);
    }
  };

  if (!cart || cart.lineItems?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header config={siteConfig} />
        <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">Découvrez nos produits frais et ajoutez-les à votre panier.</p>
          <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
            Commencer vos achats
          </Link>
        </main>
        <Footer config={siteConfig} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header config={siteConfig} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre Panier</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cart.lineItems?.map((item) => (
                <li key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image 
                      src={getWixImageUrl(item.image) || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop"} 
                      alt={item.productName?.translated || "Produit"} 
                      fill
                      unoptimized={true}
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 mb-1">{item.productName?.translated}</h3>
                    <p className="text-green-600 font-bold">{item.price?.formattedAmount}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-full px-2">
                      <button 
                        onClick={() => updateQuantity(item._id!, Math.max(1, (item.quantity || 1) - 1))}
                        disabled={isLoading}
                        className="p-2 text-gray-600 hover:text-green-600 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id!, (item.quantity || 1) + 1)}
                        disabled={isLoading}
                        className="p-2 text-gray-600 hover:text-green-600 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item._id!)}
                      disabled={isLoading}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-bold text-gray-900">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600 font-bold">Gratuite</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">{formattedSubtotal}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isRedirecting}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isRedirecting ? "Redirection..." : (
                  <>
                    Passer à la caisse
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer config={siteConfig} />
    </div>
  );
}
