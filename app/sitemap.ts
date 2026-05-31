import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { ALL_PRODUCTS } from "@/lib/products";
import { getAllCategorySlugs, CATEGORIES } from "@/lib/categories";

const BASE = siteConfig.domain;

function url(path: string, priority: number, changefreq: "daily" | "weekly" | "monthly"): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: changefreq,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const categorySlugs = getAllCategorySlugs();

  const staticPages = [
    url("/", 1.0, "daily"),
    url("/about", 0.5, "monthly"),
    url("/how-we-test", 0.5, "monthly"),
    url("/disclosure", 0.3, "monthly"),
    url("/privacy-policy", 0.3, "monthly"),
    url("/terms", 0.3, "monthly"),
    url("/contact", 0.4, "monthly"),
    url("/deals", 0.9, "daily"),
    url("/search", 0.5, "monthly"),
  ];

  // Best-of pages (highest SEO value)
  const bestPages = categorySlugs.map((slug) =>
    url(`/best/${slug}`, 0.95, "weekly")
  );

  // Category pages
  const categoryPages = categorySlugs.map((slug) =>
    url(`/category/${slug}`, 0.8, "weekly")
  );

  // Buying guide pages
  const buyingGuidePages = categorySlugs.map((slug) =>
    url(`/buying-guide/${slug}`, 0.85, "weekly")
  );

  // Product review pages
  const reviewPages = ALL_PRODUCTS.map((p) =>
    url(`/review/${p.slug}`, 0.9, "weekly")
  );

  // Comparison pages (auto-generated pairs within same category)
  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < ALL_PRODUCTS.length; i++) {
    for (let j = i + 1; j < ALL_PRODUCTS.length; j++) {
      const p1 = ALL_PRODUCTS[i];
      const p2 = ALL_PRODUCTS[j];
      if (p1.category === p2.category) {
        comparisonPages.push(url(`/compare/${p1.slug}-vs-${p2.slug}`, 0.8, "weekly"));
      }
    }
  }

  return [
    ...staticPages,
    ...bestPages,
    ...categoryPages,
    ...buyingGuidePages,
    ...reviewPages,
    ...comparisonPages,
  ];
}
