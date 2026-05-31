import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, User, CheckCircle, Award, Package } from "lucide-react";
import { buildMeta, productReviewSchema, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { getProductBySlug, ALL_PRODUCTS, getRelatedProducts } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { formatPrice } from "@/lib/amazon";
import { formatDate } from "@/lib/utils";
import AffiliateButton from "@/components/affiliate/AffiliateButton";
import ProsConsBox from "@/components/affiliate/ProsConsBox";
import RatingStars from "@/components/affiliate/RatingStars";
import ComparisonTable from "@/components/affiliate/ComparisonTable";
import StickyAffiliateCTA from "@/components/affiliate/StickyAffiliateCTA";
import ProductCard from "@/components/affiliate/ProductCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

export const revalidate = 86400;

export async function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return buildMeta({
    title: `${product.name} Review (${new Date().getFullYear()}) — Is It Worth It?`,
    description: `Our hands-on ${product.name} review. Pros, cons, specs, and how it compares — everything you need before you buy.`,
    path: `/review/${product.slug}`,
    image: product.image,
    type: "article",
    updatedAt: product.lastUpdated,
  });
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(product, 3);

  const schemas = [
    productReviewSchema({
      productName: product.name,
      brand: product.brand,
      description: product.shortDescription,
      image: product.image,
      reviewScore: product.rating,
      reviewCount: product.reviewCount ?? 100,
      price: product.price,
      url: `${siteConfig.domain}/review/${product.slug}`,
      reviewerName: "DeskSetupLab Editorial Team",
      publishedAt: product.lastUpdated,
      updatedAt: product.lastUpdated,
      pros: product.pros,
      cons: product.cons,
    }),
    faqSchema([
      { question: `Is the ${product.name} worth it?`, answer: `${product.name} is ${product.rating >= 9 ? "absolutely worth it" : product.rating >= 8 ? "worth it for most people" : "a solid option for budget-conscious buyers"}. ${product.shortDescription}` },
      { question: `How much does the ${product.name} cost?`, answer: `The ${product.name} currently costs around ${formatPrice(product.price)}${product.originalPrice ? `, down from ${formatPrice(product.originalPrice)}` : ""}. Check Amazon for the latest price as it may vary.` },
      { question: `Where can I buy the ${product.name}?`, answer: `You can buy the ${product.name} on Amazon. Click the "Check Price on Amazon" button to see the current price and availability.` },
    ]),
    breadcrumbSchema([
      { name: "Home", url: siteConfig.domain },
      { name: category?.name ?? "Reviews", url: `${siteConfig.domain}/category/${product.category}` },
      { name: product.name, url: `${siteConfig.domain}/review/${product.slug}` },
    ]),
  ];

  const scoreLabel = product.score
    ? product.score >= 90 ? "Excellent" : product.score >= 80 ? "Great" : product.score >= 70 ? "Good" : "Fair"
    : "Good";

  const scoreBgClass = product.score
    ? product.score >= 90 ? "score-badge excellent" : product.score >= 80 ? "score-badge great" : "score-badge good"
    : "score-badge good";

  return (
    <>
      <SchemaMarkup schema={schemas} />
      <StickyAffiliateCTA product={product} />

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Breadcrumbs
          items={[
            { label: category?.name ?? "Reviews", href: `/category/${product.category}` },
            { label: `Best ${category?.name ?? "Picks"}`, href: `/best/${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* ── Review Header ─────────────────────────────── */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <header className="mb-10">
          {product.badge && (
            <span className="inline-block bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              {product.badge}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {product.name} Review ({new Date().getFullYear()})
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-5">
            {product.shortDescription}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              DeskSetupLab Editorial Team
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Updated {formatDate(product.lastUpdated)}
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              Tested 6+ weeks
            </span>
            <Link href="/disclosure" className="text-brand-600 hover:underline flex items-center gap-1">
              Affiliate Disclosure
            </Link>
          </div>

          {/* Hero image + buy box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={product.image}
                alt={`${product.name} review`}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Buy box */}
            <div className="flex flex-col justify-center">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </div>
                  <div className={`${scoreBgClass} text-center`}>
                    <div>
                      <div className="text-xl font-bold leading-none">{product.score}</div>
                      <div className="text-xs">{scoreLabel}</div>
                    </div>
                  </div>
                </div>

                <RatingStars rating={product.rating} className="mb-4" />

                <AffiliateButton href={product.affiliateUrl} price={product.price} size="lg" className="w-full justify-center mb-3" />

                <p className="text-xs text-center text-gray-400">
                  Via Amazon (affiliater07c-20) • Price may vary
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
                  {product.pros.slice(0, 3).map((pro) => (
                    <div key={pro} className="flex gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {pro}
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards */}
              {product.badge && (
                <div className="mt-4 flex items-center gap-3 bg-brand-50 rounded-xl p-4 border border-brand-100">
                  <Award className="w-8 h-8 text-brand-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-800 text-sm">{product.badge}</p>
                    <p className="text-xs text-brand-600">{new Date().getFullYear()} DeskSetupLab Award</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Affiliate Disclosure Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <strong>Affiliate Disclosure:</strong> DeskSetupLab participates in the Amazon Services LLC Associates Program (Amazon Associate ID: affiliater07c-20). Clicking our links and buying may earn us a commission at no extra cost to you. Our reviews are independent and never influenced by commissions.{" "}
            <Link href="/disclosure" className="underline">Full disclosure</Link>
          </div>
        </header>

        {/* ── Pros & Cons ───────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pros & Cons</h2>
          <ProsConsBox pros={product.pros} cons={product.cons} />
        </section>

        {/* ── Specs Table ───────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specs).map(([key, val], i) => (
                  <tr key={key} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-5 py-3 text-sm font-medium text-gray-600 w-1/3">{key}</td>
                    <td className="px-5 py-3 text-sm text-gray-900">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Our Verdict ───────────────────────────── */}
        <section className="mb-10 bg-brand-50 rounded-2xl p-6 border border-brand-100">
          <h2 className="text-xl font-bold text-brand-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Our Verdict
          </h2>
          <p className="text-brand-800 leading-relaxed mb-4">
            The {product.name} is {product.rating >= 9 ? "one of the best" : "a solid option"} in the {category?.name?.toLowerCase() ?? "home office"} market. {product.shortDescription}
          </p>
          <p className="text-brand-700 text-sm mb-5">
            <strong>Who should buy it:</strong> Anyone looking for a reliable {category?.name?.toLowerCase() ?? "home office"} upgrade with {product.pros[0]?.toLowerCase() ?? "excellent features"}.
          </p>
          <AffiliateButton href={product.affiliateUrl} price={product.price} size="lg" />
        </section>

        {/* ── FAQ ───────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: `Is the ${product.name} worth the money?`, a: `${product.rating >= 9 ? "Absolutely yes." : product.rating >= 8 ? "For most people, yes." : "It depends on your budget."} ${product.shortDescription} We rate it ${product.rating}/10.` },
              { q: `What warranty does the ${product.name} come with?`, a: `The ${product.name} comes with a ${product.specs["Warranty"] ?? "manufacturer's"} warranty. Check Amazon for current warranty details.` },
              { q: `Is the ${product.name} available on Amazon?`, a: `Yes, the ${product.name} is available on Amazon. Use our link to support DeskSetupLab while shopping (you pay the same price, we earn a small affiliate commission as Amazon Associates).` },
            ].map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex justify-between items-center p-5 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 list-none">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">▾</span>
                </summary>
                <div className="px-5 pb-5 pt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Related Products ──────────────────────── */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href={`/best/${product.category}`} className="text-brand-600 hover:underline text-sm font-medium">
                → See all Best {category?.name ?? "picks"}
              </Link>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
