import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { products } from '@wix/stores';
import Link from 'next/link';
import Image from 'next/image';

interface ProductGridProps {
  title: string;
  products?: products.Product[];
}

const ProductGrid = ({ title, products = [] }: ProductGridProps) => {
  return (
    <div className="px-4 md:px-8 mb-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/product/${product.slug}`} key={product._id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:border-green-600 transition-all group relative">
            {product.ribbon && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white rounded-md z-10 bg-red-500">
                {product.ribbon}
              </span>
            )}
            <div className="h-48 overflow-hidden relative bg-gray-100">
              <Image 
                src={product.media?.mainMedia?.image?.url || "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop"} 
                alt={product.name || "Produit"} 
                fill
                unoptimized={product.media?.mainMedia?.image?.url?.includes("wixstatic.com")}
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
              <div className="flex items-center justify-between mt-4">
                <span className="text-green-600 font-bold text-lg">{product.price?.formatted?.price}</span>
                <button className="bg-green-100 text-green-600 p-2 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
