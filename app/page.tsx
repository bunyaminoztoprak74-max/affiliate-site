import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Zap, Star, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { buildMeta, websiteSchema } from "@/lib/seo";
import { getFeaturedProducts, getProductsByCategory } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import ProductCard from "@/components/affiliate/ProductCard";
import AffiliateButton from "@/components/affiliate/AffiliateButton";
import SchemaMarkup from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/lib/config";


export const revalidate = 3600;

export const metadata: Metadata = buildMeta({
  title: `${siteConfig.name} — Expert Home Office Reviews You Can Trust`,
  description: "In-depth, hands-on reviews of standing desks, ergonomic chairs, monitors, and home office gear. Find the best setup for your budget.",
  path: "/",
});

const TRUST_BADGES = [
  { icon: Shield, label: "Hands-On Tested", desc: "We buy and test every product" },
  { icon: Zap, label: "Updated Weekly", desc: "Fresh picks every 7 days" },
  { icon: Star, label: "Expert Reviews", desc: "Rated by home office pros" },
  { icon: TrendingUp, label: "Best Value Focus", desc: "Best gear for your budget" },
];

const FEATURED_CATEGORIES = CATEGORIES.slice(0, 6);

export default function HomePage() {
  const topDesks = getProductsByCategory("standing-desks").slice(0, 3);
  const topChairs = getProductsByCategory("ergonomic-chairs").slice(0, 3);
  const featured = getFeaturedProducts(6);

  return (
    <>
      <SchemaMarkup schema={websiteSchema()} />

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.3),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-brand-700/50 border border-brand-600/40 px-4 py-1.5 rounded-full text-sm text-brand-200 mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Updated June 2026 — New picks added weekly
            </span>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6 text-balance">
              Home Office Reviews{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-cyan-300">
                You Can Trust
              </span>
            </h1>

            <p className="text-lg md:text-xl text-brand-200 mb-8 max-w-2xl leading-relaxed">
              We spend weeks testing standing desks, ergonomic chairs, monitors, and more — so you can build the perfect work setup without wasting money.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/best/standing-desks"
                className="inline-flex items-center gap-2 bg-white text-brand-900 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-all shadow-lg"
              >
                Best Standing Desks
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/best/ergonomic-chairs"
                className="inline-flex items-center gap-2 bg-brand-700/50 border border-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-all backdrop-blur-sm"
              >
                Best Chairs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ───────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Amazon Affiliate Disclosure ─────────────────── */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <p className="text-xs text-amber-800 text-center">
            <strong>Affiliate Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases at no extra cost to you.{" "}
            <Link href="/disclosure" className="underline hover:text-amber-900">Learn more</Link>
          </p>
        </div>
      </div>

      {/* ── Shop by Category ────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-1">Expertly curated picks in every category</p>
            </div>
            <Link href="/category" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              All categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/best/${cat.slug}`}
                className="group flex flex-col items-center gap-3 bg-white p-5 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Standing Desks ─────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Best Standing Desks</h2>
              <p className="text-gray-500 mt-1">Tested for stability, motor noise, and ergonomics</p>
            </div>
            <Link href="/best/standing-desks" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              See all picks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDesks.map((product, i) => (
              <ProductCard key={product.id} product={product} rank={i + 1} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/best/standing-desks"
              className="inline-flex items-center gap-2 border-2 border-brand-200 text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-all"
            >
              See all standing desk picks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Best Ergonomic Chairs ───────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Best Ergonomic Chairs</h2>
              <p className="text-gray-500 mt-1">Sat in for 8+ hours to find the best lumbar support</p>
            </div>
            <Link href="/best/ergonomic-chairs" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              See all picks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topChairs.map((product, i) => (
              <ProductCard key={product.id} product={product} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial CTA / Newsletter ──────────────────── */}
      <section className="py-20 bg-brand-900 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Weekly Desk Setup Deals</h2>
          <p className="text-brand-200 mb-8">
            Price drops, new reviews, and exclusive buying tips — delivered every Monday.
          </p>
          <form className="flex gap-3 max-w-md mx-auto" action="/api/subscribe" method="POST">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              type="submit"
              className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-brand-400 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ── How We Test ─────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Trust DeskSetupLab?</h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              We purchase every product with our own money, spend at least one full work week testing it, and only recommend it if we&apos;d buy it again. No sponsored content. No paid placements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { num: "200+", label: "Products Tested", desc: "Hands-on, not just spec-sheets" },
                { num: "4+ years", label: "In Business", desc: "Thousands of readers trust us" },
                { num: "0", label: "Paid Placements", desc: "Editorial independence always" },
              ].map(({ num, label, desc }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <p className="text-3xl font-bold text-brand-600 mb-1">{num}</p>
                  <p className="font-semibold text-gray-900 mb-1">{label}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
            <Link href="/how-we-test" className="inline-flex items-center gap-2 mt-8 text-brand-600 font-semibold hover:text-brand-700">
              How we test products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
