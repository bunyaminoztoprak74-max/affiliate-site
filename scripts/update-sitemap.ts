#!/usr/bin/env tsx
/**
 * Sitemap Revalidation Script — DeskSetupLab
 * =============================================
 * Triggers Next.js ISR revalidation for all key pages
 * after new content is published.
 *
 * Usage:
 *   npx tsx scripts/update-sitemap.ts
 *   npx tsx scripts/update-sitemap.ts --page /review/flexispot-e7-standing-desk
 *
 * Env vars:
 *   NEXT_PUBLIC_SITE_URL — production URL
 *   REVALIDATION_SECRET — matches next.config revalidateSecret
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.desksetuplab.com";
const SECRET = process.env.REVALIDATION_SECRET ?? "dev-secret";

const specificPage = process.argv.find((a) => a.startsWith("--page="))?.split("=")[1];

const PRIORITY_PAGES = [
  "/",
  "/best/standing-desks",
  "/best/ergonomic-chairs",
  "/best/monitors",
  "/deals",
  "/sitemap.xml",
];

async function revalidatePage(path: string): Promise<void> {
  const url = `${BASE_URL}/api/revalidate?secret=${SECRET}&path=${encodeURIComponent(path)}`;
  try {
    const res = await fetch(url, { method: "POST" });
    const ok = res.ok ? "✅" : "❌";
    console.log(`${ok} [${res.status}] ${path}`);
  } catch (err) {
    console.error(`❌ Failed to revalidate ${path}:`, err);
  }
}

async function main() {
  console.log(`\n🔄 Triggering ISR revalidation on ${BASE_URL}...\n`);

  if (specificPage) {
    await revalidatePage(specificPage);
  } else {
    for (const page of PRIORITY_PAGES) {
      await revalidatePage(page);
    }
  }

  console.log("\n✅ Revalidation complete.\n");
}

main();
