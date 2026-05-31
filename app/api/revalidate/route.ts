import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation endpoint.
 * Called by scripts/update-sitemap.ts and webhooks.
 *
 * POST /api/revalidate?secret=xxx&path=/best/standing-desks
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const path = req.nextUrl.searchParams.get("path");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, timestamp: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ error: "Revalidation failed", details: String(err) }, { status: 500 });
  }
}
