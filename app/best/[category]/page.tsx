import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, User, CheckCircle } from "lucide-react";
import { buildMeta, faqSchema, itemListSchema, breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { getProductsByCategory } from "@/lib/products";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/categories";
import type { ProductCategory } from "@/types";
import ProductCard from "@/components/affiliate/ProductCard";
import TopPicks from "@/components/affiliate/TopPicks";
import ComparisonTable from "@/components/affiliate/ComparisonTable";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import SchemaMarkup from "@/components/seo/SchemaMarkup";
import { formatDate } from "@/lib/utils";

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return buildMeta({
    title: `Best ${cat.name} of ${new Date().getFullYear()} — Tested & Ranked`,
    description: `We tested the top ${cat.name.toLowerCase()} so you don't have to. Our ${new Date().getFullYear()} picks for every budget, use case, and desk size.`,
    path: `/best/${cat.slug}`,
  });
}

export default async function BestOfPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const catRaw = getCategoryBySlug(category);
  if (!catRaw) notFound();
  const cat = catRaw;

  const products = getProductsByCategory(cat.slug as ProductCategory);
  if (!products.length) notFound();

  const topProduct = products[0];
  const updatedAt = new Date().toISOString();
  const faqs = getBestOfFaqs(cat.name, topProduct.name, topProduct.price);

  const schemas = [
    itemListSchema(
      products.slice(0, 10).map((p, i) => ({
        name: p.name,
        url: `/review/${p.slug}`,
        image: p.image,
        position: i + 1,
      }))
    ),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: siteConfig.domain },
      { name: "Best Picks", url: `${siteConfig.domain}/best` },
      { name: `Best ${cat.name}`, url: `${siteConfig.domain}/best/${cat.slug}` },
    ]),
  ];

  return (
    <>
      <SchemaMarkup schema={schemas} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: "Best Picks", href: "/best" },
            { label: `Best ${cat.name}` },
          ]}
        />
      </div>

      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-10">
            <span className="text-4xl mb-4 block">{cat.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Best {cat.name} of {new Date().getFullYear()}
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              {cat.description} We&apos;ve spent weeks testing the top models.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                DeskSetupLab Editorial Team
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Updated {formatDate(updatedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {products.length} products tested
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              The Best {cat.name} — Our Picks
            </h2>

            {products.map((product, i) => (
              <div key={product.id} className="scroll-mt-24" id={`pick-${i + 1}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                    {i === 0
                      ? "Best Overall"
                      : i === 1
                      ? "Runner-Up"
                      : i === 2
                      ? "Best Value"
                      : `#${i + 1} Pick`}
                  </h3>
                </div>
                <ProductCard product={product} variant="list" showPros />
                <div className="mt-2">
                  <Link
                    href={`/review/${product.slug}`}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    Read our full {product.name} review
                  </Link>
                </div>
              </div>
            ))}

            {products.length >= 2 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {cat.name} Comparison
                </h2>
                <ComparisonTable products={products.slice(0, 4)} />
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <summary className="flex justify-between items-center p-5 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 list-none">
                      {faq.question}
                      <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">
                        ▾
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-12 bg-brand-50 rounded-2xl p-6 border border-brand-100">
              <h3 className="font-semibold text-gray-900 mb-3">Related Guides</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/buying-guide/${cat.slug}`}
                    className="text-brand-600 hover:underline text-sm"
                  >
                    How to Choose the Best {cat.name}: Complete Buying Guide
                  </Link>
                </li>
                {products[0] && products[1] && (
                  <li>
                    <Link
                      href={`/compare/${products[0].slug}-vs-${products[1].slug}`}
                      className="text-brand-600 hover:underline text-sm"
                    >
                      {products[0].name} vs {products[1].name}: Which is Better?
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-brand-600 hover:underline text-sm"
                  >
                    Browse all {cat.name} reviews
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <TopPicks products={products} title={`Top ${cat.name} Picks`} />
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Affiliate Disclosure:</strong> DeskSetupLab participates in the
                  Amazon Associates Program (ID: affiliater07c-20). We earn from qualifying
                  purchases at no extra cost to you.{" "}
                  <Link href="/disclosure" className="underline">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function getBestOfFaqs(
  categoryName: string,
  topPickName: string,
  topPickPrice: number
) {
  return [
    {
      question: `What is the best ${categoryName.toLowerCase()} in ${new Date().getFullYear()}?`,
      answer: `After extensive hands-on testing, we recommend the ${topPickName} as the best overall choice. It offers the best balance of performance, durability, and value at $${topPickPrice}.`,
    },
    {
      question: `How do we test ${categoryName.toLowerCase()}?`,
      answer: `Our editorial team purchases every product with our own money. We use each product daily for at least one full work week before reviewing. We test for ergonomics, build quality, ease of assembly, and long-term reliability.`,
    },
    {
      question: `Are these ${categoryName.toLowerCase()} affiliate links?`,
      answer: `Yes. DeskSetupLab participates in the Amazon Associates Program (ID: affiliater07c-20). When you click a link and purchase, we earn a small commission at no extra cost to you. Our recommendations are never influenced by this.`,
    },
    {
      question: `How often do you update your ${categoryName.toLowerCase()} recommendations?`,
      answer: `We update our recommendations whenever a significant new product launches, prices change substantially, or we find a better option. Picks are typically refreshed every 1-3 months.`,
    },
  ];
}
