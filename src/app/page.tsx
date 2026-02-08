import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import CategoryList from "@/components/CategoryList";
import PromoBanner from "@/components/PromoBanner";
import VideoSection from "@/components/VideoSection";
import { wixClient } from "@/lib/wixClient";
import { products } from "@wix/stores";
import siteConfig from "@/data/siteConfig.json";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Promo Banner Section (Between Header and Body) */}
      <PromoBanner promos={siteConfig.promos} />

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

          {/* Video Section (Configurable) */}
          <VideoSection videos={siteConfig.videos} />

          {/* Blog Section (Configurable) */}
          {siteConfig.blog.enabled && (
            <section className="py-16 bg-gray-50 -mx-4 md:-mx-8 px-4 md:px-8">
              <div className="container mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{siteConfig.blog.title}</h2>
                    <p className="text-gray-600">{siteConfig.blog.subtitle}</p>
                  </div>
                  <Link href="/blog" className="flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">
                    Voir tout le blog <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Mock Blog Posts for Preview */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={`https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop&sig=${i}`}
                          alt="Blog post"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-green-600 font-medium mb-2">Conseils • 8 Fév 2026</div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors">Comment bien choisir ses produits bio ?</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          Découvrez nos astuces pour reconnaître les meilleurs produits biologiques et locaux pour votre santé.
                        </p>
                        <Link href="/blog/1" className="text-sm font-bold flex items-center gap-1">
                          Lire la suite <ArrowRight className="w-4 h-4" />
                        </Link>
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
