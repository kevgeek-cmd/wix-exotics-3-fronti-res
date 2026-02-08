"use client";

import { useState, useEffect } from "react";
import { products, collections } from "@wix/stores";
import ProductGrid from "./ProductGrid";
import { wixClient } from "@/lib/wixClient";
import { Loader2, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface ShopContentProps {
  initialCollections: collections.Collection[];
  initialProducts: products.Product[];
  selectedCategoryId?: string;
}

export default function ShopContent({ 
  initialCollections, 
  initialProducts,
  selectedCategoryId 
}: ShopContentProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [activeTab, setActiveTab] = useState(selectedCategoryId || "all");
  const [productList, setProductList] = useState<products.Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let query = wixClient.products.queryProducts();

        if (searchQuery) {
          // Si on a une recherche, on cherche par nom ou description
          query = query.startsWith("name", searchQuery);
          // On peut aussi ajouter d'autres filtres si Wix le permet
          setActiveTab("search"); // Marquer qu'on est en mode recherche
        } else if (activeTab !== "all") {
          query = query.eq("collectionIds", activeTab);
        }

        const response = await query.find();
        setProductList(response.items);
      } catch (err) {
        console.error("Erreur lors de la récupération des produits", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab, searchQuery, initialProducts]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <h1 className="text-4xl font-black text-gray-900 mb-12 tracking-tight text-center">
        Notre Boutique
      </h1>

      {/* Categories Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {!searchQuery && (
          <button
            onClick={() => setActiveTab("all")}
            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === "all"
                ? "bg-green-600 text-white shadow-lg shadow-green-200 scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tous les produits
          </button>
        )}
        
        {searchQuery && (
          <div className="flex items-center gap-4 px-6 py-3 bg-green-50 text-green-700 rounded-full border border-green-100 font-bold">
            Résultats pour "{searchQuery}"
            <button 
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("q");
                window.history.replaceState(null, "", `?${params.toString()}`);
                setActiveTab("all");
              }}
              className="hover:text-green-900 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {!searchQuery && initialCollections.map((collection) => (
          <button
            key={collection._id}
            onClick={() => setActiveTab(collection._id!)}
            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === collection._id
                ? "bg-green-600 text-white shadow-lg shadow-green-200 scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {collection.name}
          </button>
        ))}
      </div>

      {/* Products Display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Chargement des produits...</p>
        </div>
      ) : productList.length > 0 ? (
        <ProductGrid 
          title={
            searchQuery 
              ? `Recherche : ${searchQuery}` 
              : activeTab === "all" 
                ? "Tous nos articles" 
                : initialCollections.find(c => c._id === activeTab)?.name || "Produits"
          } 
          products={productList} 
        />
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-4">
          <SearchX className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-gray-500 text-xl font-medium">Aucun produit trouvé.</p>
            <p className="text-gray-400">Essayez d'autres mots-clés ou changez de catégorie.</p>
          </div>
          {searchQuery && (
            <button 
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("q");
                window.history.replaceState(null, "", `?${params.toString()}`);
                setActiveTab("all");
              }}
              className="text-green-600 font-bold hover:underline mt-2"
            >
              Voir tous les produits
            </button>
          )}
        </div>
      )}
    </div>
  );
}
