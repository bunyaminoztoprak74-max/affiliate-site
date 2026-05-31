import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { buildMeta, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { getProductsByCategory } from "@/lib/products";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/categories";
import type { ProductCategory } from "@/types";
import TopPicks from "@/components/affiliate/TopPicks";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

export const revalidate = 86400;

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
    title: `How to Choose the Best ${cat.name} — Complete Buying Guide (${new Date().getFullYear()})`,
    description: `Everything you need to know before buying a ${cat.name.toLowerCase()}. Our expert guide covers what matters most so you never waste money.`,
    path: `/buying-guide/${slug}`,
  });
}

const GUIDE_CONTENT: Record<
  string,
  {
    intro: string;
    sections: { title: string; body: string }[];
    faqs: { q: string; a: string }[];
  }
> = {
  "standing-desks": {
    intro:
      "Switching to a standing desk is one of the best investments for your health and productivity. With hundreds of options from $200 to $2,000+, this guide walks you through every key decision.",
    sections: [
      {
        title: "1. Frame Stability: The #1 Factor",
        body: "Stability determines whether a standing desk is usable at height or a frustrating wobble-fest. Look for desks with cross-support beams, high-quality steel frames, and thick leg columns.",
      },
      {
        title: "2. Single Motor vs. Dual Motor",
        body: "Single-motor desks work fine for loads under 150 lbs. Dual-motor desks are quieter, faster, and lift 300-550 lbs. If you have multiple monitors, always go dual motor.",
      },
      {
        title: "3. Height Range: Know Your Numbers",
        body: "A desk should reach sitting height (29-30 inches) and standing height (around 45-46 inches for a 6-foot person). Most quality desks cover 22-48 inches, suitable for 4'10\" to 6'4\" users.",
      },
      {
        title: "4. Desktop Size and Material",
        body: "Minimum recommended size is 48x24 inches. 60x30 is ideal for dual monitors. MDF with laminate is affordable and durable. Bamboo is eco-friendly. Solid wood is premium but heavy.",
      },
      {
        title: "5. Memory Presets",
        body: "4 programmable presets let you switch between sitting and standing with one button. This makes standing desks 10x more likely to be used consistently.",
      },
    ],
    faqs: [
      {
        q: "How long should I stand at a standing desk?",
        a: "The ideal ratio is 1:1 — stand for 30 minutes, sit for 30 minutes. Never stand for more than 2 continuous hours. Use an anti-fatigue mat to reduce foot and leg fatigue.",
      },
      {
        q: "What is the best standing desk under $500?",
        a: "The FlexiSpot E7 Pro at $499 is our top pick under $500. It features a dual motor, 355 lb capacity, anti-collision tech, and a 5-year warranty.",
      },
      {
        q: "Do standing desks actually help your health?",
        a: "Yes, when used correctly. Alternating sitting and standing reduces back pain, improves energy, and lowers cardiovascular risk. Simply standing all day is not effective.",
      },
      {
        q: "How hard is it to assemble a standing desk?",
        a: "Most take 60-90 minutes with two people. Vari desks arrive 95% pre-assembled (5 minutes). FlexiSpot and UPLIFT take about 60 minutes each.",
      },
    ],
  },
  "ergonomic-chairs": {
    intro:
      "Most people spend 8-10 hours a day seated. A good ergonomic chair is not a luxury — it is essential. Here is how to choose the right one without overspending.",
    sections: [
      {
        title: "1. Lumbar Support: The Most Important Feature",
        body: "Proper lumbar support maintains the natural S-curve of your spine. Look for adjustable lumbar height and depth. The Herman Miller Aeron and Steelcase Leap set the industry standard.",
      },
      {
        title: "2. Seat Height and Depth",
        body: "Your feet should be flat on the floor with knees at 90 degrees. Seat depth should leave 2-3 fingers between the seat edge and the back of your knees.",
      },
      {
        title: "3. Armrest Adjustability",
        body: "4D armrests adjust up, down, in, out, forward, back, and pivot. They dramatically reduce shoulder and neck strain during typing.",
      },
      {
        title: "4. Mesh vs Foam vs Leather",
        body: "Mesh back with foam seat is the gold standard: breathable and comfortable. Leather looks premium but gets hot. Full mesh like the Aeron is the most breathable.",
      },
      {
        title: "5. Weight Capacity and Sizing",
        body: "Always check weight capacity. Chair sizing (small, medium, large) matters more than most people realize. Get the right size for your body type.",
      },
    ],
    faqs: [
      {
        q: "Is the Herman Miller Aeron worth $1,400?",
        a: "For people who sit 8+ hours daily with back pain, yes. The 12-year warranty alone justifies the price. For occasional use, the Secretlab TITAN at $549 is better value.",
      },
      {
        q: "What is the best ergonomic chair under $500?",
        a: "The Secretlab TITAN Evo at $549 (often on sale for $449) has a built-in lumbar system, memory foam head pillow, and a 5-year warranty.",
      },
      {
        q: "How long do ergonomic chairs last?",
        a: "A quality ergonomic chair lasts 8-15 years. Herman Miller and Steelcase offer 12-year warranties. Budget chairs typically fail within 2-3 years.",
      },
      {
        q: "Can an ergonomic chair fix back pain?",
        a: "It reduces back pain but does not cure it. Combine a quality chair with regular movement breaks, monitor at eye level, and keyboard at elbow height.",
      },
    ],
  },
};

export default async function BuyingGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catRaw = getCategoryBySlug(slug);
  if (!catRaw) notFound();
  const cat = catRaw;

  const products = getProductsByCategory(cat.slug as ProductCategory).slice(0, 5);
  const guide = GUIDE_CONTENT[slug] ?? {
    intro: `Choosing the right ${cat.name.toLowerCase()} can be overwhelming. This guide covers the key factors to consider.`,
    sections: [
      {
        title: "What to Look For",
        body: `When shopping for ${cat.name.toLowerCase()}, prioritize build quality, ergonomics, warranty, and value.`,
      },
    ],
    faqs: [
      {
        q: `What should I look for in a ${cat.name.toLowerCase()}?`,
        a: `Focus on build quality, warranty length, ergonomic adjustments, and value for money.`,
      },
    ],
  };

  const schemas = [
    faqSchema(guide.faqs.map((f) => ({ question: f.q, answer: f.a }))),
    breadcrumbSchema([
      { name: "Home", url: siteConfig.domain },
      { name: "Buying Guides", url: `${siteConfig.domain}/buying-guide` },
      {
        name: `${cat.name} Buying Guide`,
        url: `${siteConfig.domain}/buying-guide/${slug}`,
      },
    ]),
  ];

  return (
    <>
      <SchemaMarkup schema={schemas} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Breadcrumbs
          items={[
            { label: "Buying Guides", href: "/buying-guide" },
            { label: `${cat.name} Guide` },
          ]}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <span className="text-3xl block mb-3">{cat.icon}</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              How to Choose the Best {cat.name}: Complete Buying Guide (
              {new Date().getFullYear()})
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{guide.intro}</p>

            <div className="space-y-8 mb-12">
              {guide.sections.map((section, i) => (
                <div key={i} id={`section-${i}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 mb-8">
              {guide.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border border-gray-200 rounded-xl overflow-hidden"
                >
                  <summary className="p-5 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 list-none flex justify-between">
                    {faq.q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">
                      ▾
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
              <p className="font-semibold text-gray-900 mb-2">Ready to Buy?</p>
              <p className="text-sm text-gray-600 mb-4">
                See our curated picks — every product tested hands-on.
              </p>
              <Link
                href={`/best/${slug}`}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
              >
                See Best {cat.name}
              </Link>
            </div>

            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              DeskSetupLab is an Amazon Associate (ID: affiliater07c-20). Product links
              earn us a commission.{" "}
              <Link href="/disclosure" className="underline">
                Full disclosure
              </Link>
            </p>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {products.length > 0 && (
                <TopPicks products={products} title={`Best ${cat.name}`} />
              )}
              <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-3">In This Guide</h4>
                <ul className="space-y-2">
                  {guide.sections.map((s, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
