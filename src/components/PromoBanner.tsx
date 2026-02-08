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
    <div className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePromos.map((promo) => (
            <Link 
              key={promo.id} 
              href={promo.link}
              className="group relative h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <Image 
                src={promo.imageUrl} 
                alt={promo.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <span className="text-white font-bold text-center drop-shadow-md text-lg">
                  {promo.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
