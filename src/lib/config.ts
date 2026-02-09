import 'server-only';
import { createClient } from "@vercel/kv";
import fs from "fs/promises";
import path from "path";
import { SiteConfig } from "./siteConfig";

// Re-export type for convenience (only safe if this file is not imported by client components)
// Better to import type from siteConfig.ts directly in client components.
export type { SiteConfig };

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
