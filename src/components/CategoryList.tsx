"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { name: "Viandes et Volailles", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80" },
  { name: "Produits Secs", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" },
  { name: "Produits Surgelés", image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80" },
  { name: "Savons", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=800&q=80" },
  { name: "Thés & Tisanes", image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80" },
  { name: "Tradition", image: "https://images.unsplash.com/photo-1604544203165-22003c4004c2?auto=format&fit=crop&w=800&q=80" },
  { name: "Ustensiles", image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80" },
  { name: "Poissons & Crustacés", image: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&w=800&q=80" },
  { name: "Produits Fumés", image: "https://images.unsplash.com/photo-1529310399831-ed472b81d589?auto=format&fit=crop&w=800&q=80" },
  { name: "Produits Africains", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" },
  { name: "Produits Capillaires", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=800&q=80" },
  { name: "Produits Cosmétiques", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=800&q=80" },
  { name: "Produits Frais", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80" },
  { name: "Gels Douche", image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80" },
  { name: "Hygiène", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80" },
  { name: "Hygiène Intime", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80" },
  { name: "Maquillage", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=800&q=80" },
  { name: "Mercerie", image: "https://images.unsplash.com/photo-1517254238541-4ef435520a02?auto=format&fit=crop&w=800&q=80" },
  { name: "Perruques & Mèches", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=800&q=80" },
  { name: "Boissons", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80" },
  { name: "Céréales", image: "https://images.unsplash.com/photo-1588710929895-684c72675e65?auto=format&fit=crop&w=800&q=80" },
  { name: "Conserves", image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80" },
  { name: "Epices", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" },
  { name: "Friandises", image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

interface CategoryListProps {
  limit?: number;
}

export default function CategoryList({ limit }: CategoryListProps) {
  const displayCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Nos Catégories</h2>
          {limit && (
            <Link 
              href="/categories" 
              className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors flex items-center gap-1"
            >
              Voir toutes nos catégories
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          )}
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {displayCategories.map((category) => (
            <motion.div key={category.name} variants={item}>
              <Link 
                href={`/category/${category.name.toLowerCase().replace(/ /g, "-")}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group-hover:ring-4 ring-green-500/20">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <span className="text-white font-extrabold text-lg md:text-xl drop-shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:tracking-wider uppercase">
                      {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {limit && (
          <div className="mt-8 text-center md:hidden">
             <Link 
              href="/categories" 
              className="inline-block bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              Voir toutes les catégories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
