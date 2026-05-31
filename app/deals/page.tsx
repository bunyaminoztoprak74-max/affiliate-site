import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Clock } from "lucide-react";
import { buildMeta } from "@/lib/seo";

import { ALL_PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/amazon";
import AffiliateButton from "@/components/affiliate/AffiliateButton";
import RatingStars from "@/components/affiliate/RatingStars";
import Image from "next/image";

export const revalidate = 900;

export const metadata: Metadata = buildMeta({
  title: "Best Home Office Deals Today — DeskSetupLab",
  description: "The best deals on standing desks, ergonomic chairs, monitors, and home office gear. Updated daily.",
  path: "/deals",
});

export default function DealsPage() {
  // Filter products with a discount (originalPrice > price)
  const deals = ALL_PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
      const discB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
      return discB - discA;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Zap className="w-8 h-8 text-accent-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today&apos;s Best Deals</h1>
          <p className="text-gray-500 flex items-center gap-1.5 text-sm">
            <Clock className="w-4 h-4" />
            Updated {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Disclosure */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-8 text-xs text-amber-800">
        <strong>Affiliate Disclosure (Amazon Associate ID: affiliater07c-20):</strong> Prices shown are subject to change. We earn a commission when you purchase through our links.{" "}
        <Link href="/disclosure" className="underline">Learn more</Link>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No active deals right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((product) => {
            const discount = Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100);
            return (
              <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                <div className="relative bg-gray-50 aspect-square">
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discount}% OFF
                  </div>
                  <Image src={product.image} alt={product.name} fill className="object-contain p-8" sizes="300px" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                  <Link href={`/review/${product.slug}`} className="font-semibold text-gray-900 hover:text-brand-600 text-sm leading-tight block mb-2">
                    {product.name}
                  </Link>
                  <RatingStars rating={product.rating} size="sm" className="mb-3" />
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice!)}</span>
                    <span className="text-sm font-bold text-green-600">Save {formatPrice(product.originalPrice! - product.price)}</span>
                  </div>
                  <AffiliateButton href={product.affiliateUrl} label="Get This Deal" className="w-full justify-center" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
