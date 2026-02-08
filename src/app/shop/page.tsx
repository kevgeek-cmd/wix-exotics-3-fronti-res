import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopContent from "@/components/ShopContent";
import { wixClient } from "@/lib/wixClient";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const selectedCat = params.cat as string | undefined;

  let collections: any[] = [];
  let initialProducts: any[] = [];

  try {
    // Fetch collections
    const collectionsRes = await wixClient.collections.queryCollections().find();
    collections = collectionsRes.items;

    // Fetch initial products (all or by selected cat)
    const productsQuery = wixClient.products.queryProducts();
    if (selectedCat) {
      productsQuery.eq("collectionIds", selectedCat);
    } else {
      productsQuery.limit(20);
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
          initialCollections={collections} 
          initialProducts={initialProducts}
          selectedCategoryId={selectedCat}
        />
      </main>
      <Footer />
    </div>
  );
}
