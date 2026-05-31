import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMeta, breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { getProductsByCategory } from "@/lib/products";
import { getCategoryBySlug, getAllCategorySlugs, CATEGORIES } from "@/lib/categories";
import type { ProductCategory } from "@/types";
import ProductCard from "@/components/affiliate/ProductCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return buildMeta({
    title: `${cat.name} Reviews — Best Picks & Buying Guides`,
    description: `Browse all ${cat.name.toLowerCase()} reviews. Find the best ${cat.name.toLowerCase()} for your home office, tested hands-on by the DeskSetupLab team.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catRaw = getCategoryBySlug(slug);
  if (!catRaw) notFound();
  const cat = catRaw;

  const products = getProductsByCategory(cat.slug as ProductCategory);

  const schemas = [
    breadcrumbSchema([
      { name: "Home", url: siteConfig.domain },
      { name: cat.name, url: `${siteConfig.domain}/category/${slug}` },
    ]),
  ];

  return (
    <>
      <SchemaMarkup schema={schemas} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs items={[{ label: cat.name }]} />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="text-4xl block mb-3">{cat.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {cat.name} Reviews
            </h1>
            <p className="text-gray-600 max-w-2xl">{cat.description}</p>
          </div>
          <Link
            href={`/best/${cat.slug}`}
            className="hidden md:flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors flex-shrink-0"
          >
            Best {cat.name} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {products.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{products.length} products reviewed</p>
              <Link href={`/buying-guide/${cat.slug}`} className="text-sm text-brand-600 hover:underline">
                Buying Guide &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} rank={i + 1} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">Reviews coming soon!</p>
            <p className="text-sm">
              We&apos;re currently testing {cat.name.toLowerCase()}. Check back shortly.
            </p>
          </div>
        )}

        <div className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Categories</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.filter((c) => c.slug !== slug)
              .slice(0, 6)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-brand-50 hover:text-brand-700 rounded-full text-sm font-medium text-gray-700 transition-colors"
                >
                  {c.icon} {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
