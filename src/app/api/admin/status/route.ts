import { NextResponse } from "next/server";

export async function GET() {
  const status = {
    vercel: {
      baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      kv: !!((process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) || (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)),
      blob: !!process.env.BLOB_READ_WRITE_TOKEN,
    },
    wix: {
      clientId: !!process.env.NEXT_PUBLIC_WIX_CLIENT_ID,
    }
  };

  return NextResponse.json(status);
}
