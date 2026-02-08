import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import CategoryList from "@/components/CategoryList";
import { wixClient } from "@/lib/wixClient";
import { products } from "@wix/stores";
import siteConfig from "@/data/siteConfig.json";

export default async function Home() {
  let productList: products.Product[] = [];
  try {
    if (process.env.NEXT_PUBLIC_WIX_CLIENT_ID && process.env.NEXT_PUBLIC_WIX_CLIENT_ID !== "votre_client_id_ici") {
      const response = await wixClient.products.queryProducts().limit(20).descending("lastUpdated").find();
      productList = response.items;
    } else {
      console.warn("Wix Client ID non configuré. Utilisation de données vides.");
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des produits", err);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-8">
          {/* Hero Banner (Configurable) */}
          <div className="relative h-[400px] bg-gray-900 rounded-xl overflow-hidden mx-4 md:mx-8 mb-12">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <Image 
              src={siteConfig.hero.imageUrl}
              alt="Bannière" 
              fill
              className="object-cover"
              priority
            />
            <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
              <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-sm mb-4 w-fit">
                {siteConfig.hero.subtitle}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                {siteConfig.hero.title}
              </h1>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold w-fit transition-colors">
                {siteConfig.hero.buttonText}
              </button>
            </div>
          </div>

          <CategoryList limit={siteConfig.categories.limit} />

          <ProductGrid title="Nos Produits" products={productList} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
