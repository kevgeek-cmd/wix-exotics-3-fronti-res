import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

import { getConfig } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const config = await getConfig();
  return {
    title: config.general?.siteName || "Exotics 3 Frontières",
    description: config.footer?.description || "Votre épicerie bio en ligne préférée",
    icons: {
      icon: config.general?.faviconUrl || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
