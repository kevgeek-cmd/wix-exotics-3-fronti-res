import { wixClient } from "@/lib/wixClient";
import AddToCart from "@/components/AddToCart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import siteConfig from "@/data/siteConfig.json";

import ProductImage from "@/components/ProductImage";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product;
  try {
    const response = await wixClient.products.queryProducts().eq("slug", slug).find();
    product = response.items[0];
  } catch (err) {
    console.error(err);
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header config={siteConfig} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8">
            {/* Image Section (Smaller: 5 columns = ~40%) */}
            <div className="md:col-span-5 relative">
              <ProductImage 
                src={product.media?.mainMedia?.image?.url || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=800&fit=crop"} 
                alt={product.name || "Product"} 
              />
              {product.ribbon && (
                <span className="absolute top-4 left-4 z-10 px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-sm">
                  {product.ribbon}
                </span>
              )}
            </div>

            {/* Info Section (Larger: 7 columns = ~60%) */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-green-600">{product.price?.formatted?.price}</span>
                {product.price?.formatted?.price !== product.price?.formatted?.discountedPrice && (
                   <span className="text-xl text-gray-400 line-through">{product.price?.formatted?.price}</span>
                )}
              </div>

              <div 
                className="prose prose-sm text-gray-600 mb-8"
                dangerouslySetInnerHTML={{ __html: product.description || "" }} 
              />

              <div className="flex gap-4 mt-auto">
                <AddToCart productId={product._id!} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer config={siteConfig} />
    </div>
  );
}