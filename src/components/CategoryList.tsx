"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { wixClient } from "@/lib/wixClient";
import { collections } from "@wix/stores";

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
  const [categories, setCategories] = useState<collections.Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await wixClient.collections.queryCollections().find();
        setCategories(response.items);
      } catch (err) {
        console.error("Erreur collections:", err);
      }
    };
    fetchCollections();
  }, []);

  const displayCategories = limit ? categories.slice(0, limit) : categories;

  if (categories.length === 0) return null;

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Nos Catégories</h2>
          {limit && categories.length > limit && (
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
            <motion.div key={category._id} variants={item}>
              <Link 
                href={`/shop?cat=${category._id}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group-hover:ring-4 ring-green-500/20">
                  <Image
                    src={category.media?.mainMedia?.image?.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"}
                    alt={category.name || "Catégorie"}
                    fill
                    unoptimized={category.media?.mainMedia?.image?.url?.includes("wixstatic.com")}
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
      </div>
    </div>
  );
}
