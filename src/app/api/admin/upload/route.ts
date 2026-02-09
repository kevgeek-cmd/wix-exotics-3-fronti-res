import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Try Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(file.name, file, {
          access: 'public',
        });
        return NextResponse.json({ success: true, url: blob.url });
      } catch (blobError) {
        console.error("Vercel Blob upload failed (falling back to local):", blobError);
      }
    } else {
        console.warn("Vercel Blob token missing, using local storage fallback.");
    }

    // 2. Fallback to local storage
    // Warning: On Vercel (Production), this file will be deleted on next deploy/restart.
    // This is mainly for local development.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename to be safe
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
