import { NextResponse } from "next/server";
import { createClient } from "@vercel/kv";
import fs from "fs/promises";
import path from "path";

// Create KV client with support for both standard KV and Upstash Redis env vars
const kv = createClient({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const CONFIG_KEY = "site_config";

async function getInitialConfig() {
  const configPath = path.join(process.cwd(), "src", "data", "siteConfig.json");
  const data = await fs.readFile(configPath, "utf-8");
  return JSON.parse(data);
}

export async function GET() {
  try {
    let config = await kv.get(CONFIG_KEY);
    
    if (!config) {
      // If KV is empty, try to load from local file as fallback
      config = await getInitialConfig();
      // Optionally seed KV
      await kv.set(CONFIG_KEY, config);
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error("KV Read error:", error);
    // Fallback to local file in case KV is not configured yet
    try {
      const config = await getInitialConfig();
      return NextResponse.json(config);
    } catch {
      return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await kv.set(CONFIG_KEY, body);
    
    // Also update local file for development consistency if possible
    try {
      const configPath = path.join(process.cwd(), "src", "data", "siteConfig.json");
      await fs.writeFile(configPath, JSON.stringify(body, null, 2));
    } catch (e) {
      console.warn("Could not sync to local file (normal on Vercel):", e);
    }

    return NextResponse.json({ success: true, config: body });
  } catch (error) {
    console.error("KV Write error:", error);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
