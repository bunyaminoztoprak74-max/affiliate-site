import { AFFILIATE_TAG, AMAZON_BASE_URL } from "./config";

/**
 * Generates a properly tagged Amazon affiliate URL.
 * Per Amazon Associates Operating Agreement, all links must include the tag.
 */
export function buildAffiliateUrl(asin: string, tag = AFFILIATE_TAG): string {
  return `${AMAZON_BASE_URL}/dp/${asin}?tag=${tag}&linkCode=ogi&th=1&psc=1`;
}

/**
 * Builds a search URL on Amazon with affiliate tag.
 */
export function buildSearchUrl(query: string, tag = AFFILIATE_TAG): string {
  const encoded = encodeURIComponent(query);
  return `${AMAZON_BASE_URL}/s?k=${encoded}&tag=${tag}`;
}

/**
 * Internal redirect URL — tracks clicks before sending to Amazon.
 * Route: /go/[asin]
 */
export function buildInternalAffiliateUrl(asin: string): string {
  return `/go/${asin}`;
}

/**
 * Formats price for display.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculates discount percentage.
 */
export function calcDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

/**
 * Amazon Product Advertising API v5 helper
 * Set env vars: AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG
 */
export async function fetchAmazonProduct(asin: string) {
  // PA-API 5.0 integration point
  // In production: use paapi5-nodejs-sdk or direct REST calls
  const partnerTag = process.env.AMAZON_PARTNER_TAG || AFFILIATE_TAG;
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;

  if (!accessKey || !secretKey) {
    console.warn("[Amazon PA-API] Missing credentials — returning null");
    return null;
  }

  // Full PA-API implementation would go here
  // Endpoint: webservices.amazon.com/paapi5/getitems
  return null;
}
