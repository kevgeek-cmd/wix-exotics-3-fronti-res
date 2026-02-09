export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  link?: string;
}

export interface SiteConfig {
  topBanner: { text: string; enabled: boolean; speed: number };
  header: { logoUrl?: string };
  hero: { 
    title: string; 
    subtitle: string; 
    buttonText: string; 
    imageUrl: string; 
    link: string;
    imageFit?: string;
    imagePosition?: string;
    overlayOpacity?: number;
    height?: number;
  };
  categories: { limit: number };
  contact: { email: string; phone: string; address: string; mapUrl: string };
  footer: { 
    description: string; 
    socials: { facebook: string; twitter: string; instagram: string; youtube: string };
    copyright: string;
  };
  promos: { id: string; title: string; imageUrl: string; link: string; active: boolean }[];
  videos: { id: string; title: string; youtubeUrl: string }[];
  blog: { 
    enabled: boolean; 
    title: string; 
    subtitle: string; 
    articles: Article[];
  };
}

export async function getConfig(): Promise<SiteConfig> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  // 1. Try to fetch from API (works on both Client and Server)
  try {
    const res = await fetch(`${baseUrl}/api/admin/config`, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn("API fetch failed, attempting fallback", err);
  }

  // 2. Fallback to local file (ONLY on Server)
  if (typeof window === "undefined") {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const configPath = path.join(process.cwd(), "src", "data", "siteConfig.json");
      const data = await fs.promises.readFile(configPath, "utf-8");
      return JSON.parse(data);
    } catch (fileErr) {
      console.error("Critical error: Could not load config even from file", fileErr);
      throw fileErr;
    }
  }

  throw new Error("Could not fetch config and local fallback is not available on client");
}
