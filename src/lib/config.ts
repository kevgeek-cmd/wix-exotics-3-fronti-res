import { createClient } from "@vercel/kv";
import fs from "fs/promises";
import path from "path";

// Define the configuration interface
export interface SiteConfig {
  topBanner: { text: string; enabled: boolean; speed: number };
  header?: { logoUrl?: string };
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
  contact: { 
    email: string; 
    phone: string; 
    address: string; 
    mapUrl: string;
  };
  footer: { 
    description: string; 
    socials: { facebook: string; twitter: string; instagram: string; youtube: string }; 
    copyright: string;
  };
  promos: Array<{
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    active: boolean;
  }>;
  videos: Array<{
    id: string;
    title: string;
    youtubeUrl: string;
  }>;
  blog: {
    enabled: boolean;
    title: string;
    subtitle: string;
    articles: Array<{
      id: string;
      title: string;
      excerpt: string;
      content: string;
      imageUrl: string;
      date: string;
    }>;
  };
}

// Create KV client with support for both standard KV and Upstash Redis env vars
const kv = createClient({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "https://fake-url.com", // Prevent crash if missing
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "fake-token",
});

const CONFIG_KEY = "site_config";

/**
 * Retrieves the site configuration.
 * Prioritizes Vercel KV (Redis), falls back to local JSON file.
 * This function is designed to run on the server (Server Components or API Routes).
 */
export async function getConfig(): Promise<SiteConfig> {
  // 1. Try to fetch from KV (if credentials exist)
  if (
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) && 
    (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  ) {
    try {
      const config = await kv.get<SiteConfig>(CONFIG_KEY);
      if (config) {
        return config;
      }
    } catch (error) {
      console.warn("KV Config Fetch Warning (falling back to local):", error);
    }
  }

  // 2. Fallback to local file (Always works in build/dev)
  try {
    const filePath = path.join(process.cwd(), "src", "data", "siteConfig.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as SiteConfig;
  } catch (error) {
    console.error("CRITICAL: Failed to load local siteConfig.json", error);
    // Return a safe empty default to prevent build crash
    return {} as SiteConfig;
  }
}
