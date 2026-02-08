import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "src", "data", "siteConfig.json");

export async function GET() {
  try {
    const data = await fs.readFile(configPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(configPath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true, config: body });
  } catch {
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
