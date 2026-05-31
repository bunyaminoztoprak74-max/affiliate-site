import type { Metadata } from "next";
import { siteConfig } from "./config";

interface MetaOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  noindex?: boolean;
}

/**
 * Generates complete Next.js Metadata object for any page.
 */
export function buildMeta(opts: MetaOptions): Metadata {
  const url = `${siteConfig.domain}${opts.path}`;
  const image = opts.image ?? `${siteConfig.domain}/og-default.png`;

  return {
    title: opts.title,
    description: opts.description,
    metadataBase: new URL(siteConfig.domain),
    alternates: { canonical: url },
    robots: opts.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      type: opts.type ?? "website",
      ...(opts.publishedAt && { publishedTime: opts.publishedAt }),
      ...(opts.updatedAt && { modifiedTime: opts.updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
      site: "@desksetuplab",
    },
  };
}

// ── Schema Generators ─────────────────────────────────────

/**
 * Organization schema — sitewide.
 */
export function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/logo.png`,
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "customer service",
    },
  };
}

/**
 * WebSite schema — enables sitelinks searchbox.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.domain}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Review / Product schema for single product review pages.
 */
export function productReviewSchema(opts: {
  productName: string;
  brand: string;
  description: string;
  image: string;
  reviewScore: number;
  reviewCount: number;
  price: number;
  currency?: string;
  url: string;
  reviewerName: string;
  publishedAt: string;
  updatedAt: string;
  pros: string[];
  cons: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${opts.productName} Review`,
    url: opts.url,
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt,
    author: { "@type": "Person", name: opts.reviewerName },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.domain },
    reviewRating: {
      "@type": "Rating",
      ratingValue: (opts.reviewScore / 10).toFixed(1),
      bestRating: "10",
      worstRating: "1",
    },
    positiveNotes: { "@type": "ItemList", itemListElement: opts.pros.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })) },
    negativeNotes: { "@type": "ItemList", itemListElement: opts.cons.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c })) },
    itemReviewed: {
      "@type": "Product",
      name: opts.productName,
      brand: { "@type": "Brand", name: opts.brand },
      description: opts.description,
      image: opts.image,
      offers: {
        "@type": "Offer",
        price: opts.price.toFixed(2),
        priceCurrency: opts.currency ?? "USD",
        url: opts.url,
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (opts.reviewScore / 10).toFixed(1),
        reviewCount: opts.reviewCount,
        bestRating: "10",
        worstRating: "1",
      },
    },
  };
}

/**
 * FAQ schema.
 */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * BreadcrumbList schema.
 */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * ItemList schema — for best-of pages with multiple products.
 */
export function itemListSchema(items: { name: string; url: string; image?: string; position: number }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      url: `${siteConfig.domain}${item.url}`,
      name: item.name,
      ...(item.image && { image: item.image }),
    })),
  };
}

/**
 * Article schema — for blog posts.
 */
export function articleSchema(opts: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image,
    author: { "@type": "Person", name: opts.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.domain}/logo.png` },
    },
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.domain}${opts.url}` },
  };
}
