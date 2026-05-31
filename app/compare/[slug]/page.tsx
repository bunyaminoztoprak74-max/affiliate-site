import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import { buildMeta, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { getProductBySlug, ALL_PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/amazon";
import { formatDate } from "@/lib/utils";
import AffiliateButton from "@/components/affiliate/AffiliateButton";
import RatingStars from "@/components/affiliate/RatingStars";
import ComparisonTable from "@/components/affiliate/ComparisonTable";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

export const revalidate = 86400;

/**
 * Generates comparison slugs automatically from all product pairs in the same category.
 * Format: [product1-slug]-vs-[product2-slug]
 */
export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let i = 0; i < ALL_PRODUCTS.length; i++) {
    for (let j = i + 1; j < ALL_PRODUCTS.length; j++) {
      const p1 = ALL_PRODUCTS[i];
      const p2 = ALL_PRODUCTS[j];
      if (p1.category === p2.category) {
        params.push({ slug: `${p1.slug}-vs-${p2.slug}` });
      }
    }
  }
  return params;
}

function parseComparisonSlug(slug: string) {
  // Try to split on "-vs-"
  const vsIdx = slug.indexOf("-vs-");
  if (vsIdx === -1) return null;
  const slug1 = slug.slice(0, vsIdx);
  const slug2 = slug.slice(vsIdx + 4);
  return { slug1, slug2 };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return {};

  const p1 = getProductBySlug(parsed.slug1);
  const p2 = getProductBySlug(parsed.slug2);
  if (!p1 || !p2) return {};

  return buildMeta({
    title: `${p1.name} vs ${p2.name} (${new Date().getFullYear()}) — Which is Better?`,
    description: `${p1.name} vs ${p2.name}: We compare specs, price, ergonomics, and real-world performance. Find out which one you should buy.`,
    path: `/compare/${slug}`,
  });
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) notFound();

  const p1 = getProductBySlug(parsed.slug1);
  const p2 = getProductBySlug(parsed.slug2);
  if (!p1 || !p2) notFound();

  const winner = p1.score && p2.score && p1.score > p2.score ? p1 : p2;
  const loser = winner.id === p1.id ? p2 : p1;

  const faqs = [
    { question: `Is ${p1.name} better than ${p2.name}?`, answer: `Based on our testing, the ${winner.name} edges out the ${loser.name} overall, scoring ${winner.score}/100 vs ${loser.score}/100. However, the best choice depends on your specific needs and budget.` },
    { question: `What is the price difference between ${p1.name} and ${p2.name}?`, answer: `The ${p1.name} costs ${formatPrice(p1.price)} while the ${p2.name} costs ${formatPrice(p2.price)} — a difference of ${formatPrice(Math.abs(p1.price - p2.price))}.` },
    { question: `Which is better for long work hours, ${p1.name} or ${p2.name}?`, answer: `For long work hours, we recommend the ${winner.name} due to its ${winner.pros[0]?.toLowerCase() ?? "superior ergonomic features"}. Both are solid choices, but the ${winner.name} has a slight edge in comfort.` },
  ];

  const schemas = [
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: siteConfig.domain },
      { name: "Compare", url: `${siteConfig.domain}/compare` },
      { name: `${p1.name} vs ${p2.name}`, url: `${siteConfig.domain}/compare/${slug}` },
    ]),
  ];

  return (
    <>
      <SchemaMarkup schema={schemas} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Breadcrumbs items={[{ label: "Compare", href: "/compare" }, { label: `${p1.name} vs ${p2.name}` }]} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {p1.name} vs {p2.name}
          </h1>
          <p className="text-lg text-gray-600">Which should you buy in {new Date().getFullYear()}?</p>
        </div>

        {/* Affiliate Disclosure */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-8 text-xs text-amber-800 text-center">
          <strong>Affiliate Disclosure (Amazon Associate ID: affiliater07c-20):</strong> Links below may earn us a commission at no extra cost to you.{" "}
          <Link href="/disclosure" className="underline">Learn more</Link>
        </div>

        {/* Head-to-head */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Product 1 */}
          <div className={`bg-white border-2 rounded-2xl p-5 text-center ${winner.id === p1.id ? "border-brand-400 shadow-md" : "border-gray-100"}`}>
            {winner.id === p1.id && (
              <div className="flex items-center justify-center gap-1 text-brand-600 text-xs font-bold mb-2">
                <Trophy className="w-4 h-4" /> Our Pick
              </div>
            )}
            <div className="relative w-24 h-24 mx-auto mb-3">
              <Image src={p1.image} alt={p1.name} fill className="object-contain" sizes="96px" />
            </div>
            <h2 className="font-semibold text-sm text-gray-900 mb-1">{p1.name}</h2>
            <p className="text-xl font-bold text-gray-900 mb-2">{formatPrice(p1.price)}</p>
            <RatingStars rating={p1.rating} size="sm" className="justify-center mb-3" />
            <AffiliateButton href={p1.affiliateUrl} size="sm" className="w-full justify-center" />
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-lg">
              VS
            </div>
          </div>

          {/* Product 2 */}
          <div className={`bg-white border-2 rounded-2xl p-5 text-center ${winner.id === p2.id ? "border-brand-400 shadow-md" : "border-gray-100"}`}>
            {winner.id === p2.id && (
              <div className="flex items-center justify-center gap-1 text-brand-600 text-xs font-bold mb-2">
                <Trophy className="w-4 h-4" /> Our Pick
              </div>
            )}
            <div className="relative w-24 h-24 mx-auto mb-3">
              <Image src={p2.image} alt={p2.name} fill className="object-contain" sizes="96px" />
            </div>
            <h2 className="font-semibold text-sm text-gray-900 mb-1">{p2.name}</h2>
            <p className="text-xl font-bold text-gray-900 mb-2">{formatPrice(p2.price)}</p>
            <RatingStars rating={p2.rating} size="sm" className="justify-center mb-3" />
            <AffiliateButton href={p2.affiliateUrl} size="sm" className="w-full justify-center" />
          </div>
        </div>

        {/* Full comparison table */}
        <ComparisonTable products={[p1, p2]} />

        {/* Winner section */}
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-brand-900 mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-600" />
            Our Verdict: {winner.name} Wins
          </h2>
          <p className="text-brand-800 mb-4">
            The {winner.name} edges out the {loser.name} with a score of {winner.score}/100 vs {loser.score}/100. It excels in {winner.pros.slice(0, 2).join(" and ").toLowerCase()}.
          </p>
          <p className="text-sm text-brand-700 mb-4">
            That said, the {loser.name} is a better choice if you prioritize {loser.pros[0]?.toLowerCase() ?? "value"} or have a tighter budget at {formatPrice(loser.price)}.
          </p>
          <AffiliateButton href={winner.affiliateUrl} price={winner.price} />
        </div>

        {/* Pros/Cons side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[p1, p2].map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
              </div>
              <div className="p-5 space-y-1">
                {p.pros.slice(0, 4).map((pro) => (
                  <div key={pro} className="flex gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {pro}
                  </div>
                ))}
                {p.cons.slice(0, 2).map((con) => (
                  <div key={con} className="flex gap-2 text-sm text-gray-500">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {con}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQs</h2>
        <div className="space-y-3 mb-12">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="p-5 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 list-none flex justify-between">
                {faq.question}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">▾</span>
              </summary>
              <div className="px-5 pb-5 pt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Internal links */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Related Reviews</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/review/${p1.slug}`} className="text-brand-600 hover:underline">→ Full {p1.name} Review</Link></li>
            <li><Link href={`/review/${p2.slug}`} className="text-brand-600 hover:underline">→ Full {p2.name} Review</Link></li>
            <li><Link href={`/best/${p1.category}`} className="text-brand-600 hover:underline">→ Best {p1.category.replace(/-/g, " ")} of {new Date().getFullYear()}</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}
