import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryList from "@/components/CategoryList";
import siteConfig from "@/data/siteConfig.json";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header config={siteConfig} />
      <main className="flex-grow">
        <div className="bg-green-600 text-white py-12 mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Toutes nos catégories</h1>
            <p className="text-lg opacity-90">Découvrez notre large sélection de produits de qualité</p>
          </div>
        </div>
        
        {/* Render CategoryList without limit to show all */}
        <CategoryList />
      </main>
      <Footer config={siteConfig} />
    </div>
  );
}
