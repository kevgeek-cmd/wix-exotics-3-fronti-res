"use client";

import Image from "next/image";
import Link from "next/link";

interface Promo {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  active: boolean;
}

interface PromoBannerProps {
  promos: Promo[];
}

export default function PromoBanner({ promos }: PromoBannerProps) {
  const activePromos = promos.filter((p) => p.active);

  if (activePromos.length === 0) return null;

  return (
    <div className="bg-white py-6 border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className={`grid gap-6 ${activePromos.length === 1 ? 'grid-cols-1' : activePromos.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {activePromos.map((promo) => (
            <Link 
              key={promo.id} 
              href={promo.link}
              className="group relative h-40 md:h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <Image 
                src={promo.imageUrl} 
                alt={promo.title} 
                fill 
                unoptimized={promo.imageUrl?.includes("wixstatic.com")}
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent group-hover:from-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <span className="text-white font-black text-2xl md:text-3xl max-w-[200px] leading-tight drop-shadow-lg">
                  {promo.title}
                </span>
                <span className="text-yellow-400 font-bold mt-2 flex items-center gap-2 group-hover:gap-4 transition-all">
                  Acheter <span className="text-lg">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
