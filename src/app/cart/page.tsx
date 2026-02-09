import CartContent from "@/components/CartContent";
import { getConfig } from "@/lib/config";

export default async function CartPage() {
  const siteConfig = await getConfig();
  
  return <CartContent siteConfig={siteConfig} />;
}
