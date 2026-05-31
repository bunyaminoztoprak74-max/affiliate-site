import { NextRequest, NextResponse } from "next/server";
import { buildAffiliateUrl } from "@/lib/amazon";

/**
 * Affiliate redirect endpoint.
 * Route: /go/[asin]
 *
 * - Tracks click (extend with analytics here)
 * - Redirects to properly tagged Amazon URL
 * - Per Amazon Associates Operating Agreement:
 *   all links must include the Associate tag
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ asin: string }> }
) {
  const { asin } = await params;

  // Basic ASIN validation (Amazon ASINs are 10 alphanumeric chars)
  if (!asin || !/^[A-Z0-9]{10}$/i.test(asin)) {
    return NextResponse.redirect(new URL("/", _request.url));
  }

  const amazonUrl = buildAffiliateUrl(asin);

  // TODO: Log click to your analytics / DB here
  // await logClick({ asin, timestamp: Date.now(), ref: _request.headers.get("referer") });

  return NextResponse.redirect(amazonUrl, {
    status: 302, // Temporary redirect — important for affiliate tracking
    headers: {
      "Cache-Control": "no-store, no-cache", // Never cache affiliate redirects
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
