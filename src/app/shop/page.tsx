import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopContent from "@/components/ShopContent";
import { wixClient } from "@/lib/wixClient";
import { products, collections } from "@wix/stores";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const selectedCat = params.cat as string | undefined;
  const searchQuery = params.q as string | undefined;

  let allCollections: collections.Collection[] = [];
  let initialProducts: products.Product[] = [];

  try {
    // Fetch collections
    const collectionsRes = await wixClient.collections.queryCollections().find();
    allCollections = collectionsRes.items;

    // Fetch initial products (search, category, or all)
    let productsQuery = wixClient.products.queryProducts();
    
    if (searchQuery) {
      productsQuery = productsQuery.startsWith("name", searchQuery);
    } else if (selectedCat) {
      productsQuery = productsQuery.eq("collectionIds", selectedCat);
    } else {
      productsQuery = productsQuery.limit(20);
    }

    const productsRes = await productsQuery.find();
    initialProducts = productsRes.items;
  } catch (err) {
    console.error("Erreur shop page:", err);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50/50">
        <ShopContent 
          initialCollections={allCollections} 
          initialProducts={initialProducts}
          selectedCategoryId={selectedCat}
        />
      </main>
      <Footer />
    </div>
  );
}
