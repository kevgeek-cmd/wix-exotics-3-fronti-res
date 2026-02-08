import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import CategoryList from "@/components/CategoryList";
import PromoBanner from "@/components/PromoBanner";
import VideoSection from "@/components/VideoSection";
import { wixClient } from "@/lib/wixClient";
import { products, collections } from "@wix/stores";
import siteConfig from "@/data/siteConfig.json";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  let allCollections: collections.Collection[] = [];
  const categoryProducts: { [key: string]: products.Product[] } = {};

  try {
    if (process.env.NEXT_PUBLIC_WIX_CLIENT_ID && process.env.NEXT_PUBLIC_WIX_CLIENT_ID !== "votre_client_id_ici") {
      // Fetch all collections
      const collectionsRes = await wixClient.collections.queryCollections().find();
      allCollections = collectionsRes.items;

      // Fetch 4 products for each collection
      for (const collection of allCollections) {
        const productsRes = await wixClient.products
          .queryProducts()
          .eq("collectionIds", collection._id)
          .limit(4)
          .find();
        categoryProducts[collection._id!] = productsRes.items;
      }
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des données Wix", err);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Promo Banner Section */}
      <PromoBanner promos={siteConfig.promos} />

      <main className="flex-grow">
        <div className="container mx-auto py-8">
          {/* Hero Banner */}
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
              <Link href="/shop" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold w-fit transition-colors text-center">
                {siteConfig.hero.buttonText}
              </Link>
            </div>
          </div>

          <CategoryList limit={siteConfig.categories.limit} />

          {/* Products by Category */}
          <div className="space-y-16">
            {allCollections.map((collection) => (
              categoryProducts[collection._id!]?.length > 0 && (
                <div key={collection._id}>
                  <ProductGrid 
                    title={collection.name || "Catégorie"} 
                    products={categoryProducts[collection._id!]} 
                  />
                  <div className="px-4 md:px-8 -mt-8">
                    <Link 
                      href={`/shop?cat=${collection._id}`}
                      className="inline-flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all"
                    >
                      Voir plus de {collection.name} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Visit All Products Button */}
          <div className="flex justify-center my-20">
            <Link 
              href="/shop" 
              className="group relative px-12 py-5 bg-slate-900 text-white rounded-full font-black text-xl shadow-xl hover:shadow-green-500/20 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-4">
                VISITER TOUS NOS PRODUITS
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-green-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-0 opacity-0 group-hover:opacity-100" />
            </Link>
          </div>

          <VideoSection videos={siteConfig.videos} />

          {/* Blog Section */}
          {siteConfig.blog.enabled && (
            <section className="py-20 bg-white -mx-4 md:-mx-8 px-4 md:px-8 border-t border-gray-100">
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{siteConfig.blog.title}</h2>
                    <div className="w-20 h-1.5 bg-green-600 mb-4 mx-auto md:mx-0 rounded-full" />
                    <p className="text-gray-700 text-lg max-w-xl">{siteConfig.blog.subtitle}</p>
                  </div>
                  <Link href="/blog" className="flex items-center gap-3 bg-green-50 text-green-600 px-8 py-3 rounded-full font-bold hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm">
                    Voir tout le blog <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col h-full">
                      <div className="relative h-64 overflow-hidden">
                        <Image 
                          src={`https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop&sig=${i}`}
                          alt="Blog post"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl text-xs font-black text-green-600 shadow-sm">
                          CONSEILS
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="text-sm text-gray-500 font-bold mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                          8 Fév 2026
                        </div>
                        <h3 className="text-2xl font-black mb-4 text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
                          Comment bien choisir ses produits bio ?
                        </h3>
                        <p className="text-gray-600 text-base mb-8 line-clamp-3 leading-relaxed">
                          Découvrez nos astuces pour reconnaître les meilleurs produits biologiques et locaux pour votre santé.
                        </p>
                        <div className="mt-auto">
                          <Link href="/blog/1" className="text-green-600 font-black flex items-center gap-2 group/btn">
                            Lire la suite 
                            <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
