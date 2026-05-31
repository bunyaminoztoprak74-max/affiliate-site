import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/amazon";
import AffiliateButton from "./AffiliateButton";
import RatingStars from "./RatingStars";
import { cn } from "@/lib/utils";

interface TopPicksProps {
  products: Product[];
  title?: string;
}

const BADGE_COLORS: Record<string, string> = {
  "Best Overall": "bg-brand-600 text-white",
  "Best Value": "bg-green-600 text-white",
  "Premium Pick": "bg-purple-600 text-white",
  "Editor's Choice": "bg-accent-500 text-white",
  "Budget Pick": "bg-emerald-600 text-white",
  "Most Popular": "bg-pink-600 text-white",
};

export default function TopPicks({ products, title = "Our Top Picks" }: TopPicksProps) {
  return (
    <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-6 my-8">
      <h2 className="text-xl font-bold text-gray-900 mb-5">{title}</h2>

      <div className="space-y-4">
        {products.slice(0, 5).map((product, i) => (
          <div
            key={product.id}
            className={cn(
              "flex items-center gap-4 bg-white rounded-xl p-4 border transition-all hover:border-brand-200 hover:shadow-sm",
              i === 0 ? "border-brand-300 ring-1 ring-brand-200" : "border-gray-100"
            )}
          >
            {/* Rank */}
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              i === 0 ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"
            )}>
              {i + 1}
            </div>

            {/* Image */}
            <div className="flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50">
              <Image src={product.image} alt={product.name} fill className="object-contain p-1" sizes="64px" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {product.badge && (
                <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1", BADGE_COLORS[product.badge] ?? "bg-gray-100 text-gray-700")}>
                  {product.badge}
                </span>
              )}
              <Link href={`/review/${product.slug}`} className="block font-semibold text-gray-900 hover:text-brand-600 text-sm leading-tight line-clamp-1">
                {product.name}
              </Link>
              <div className="flex items-center gap-3 mt-1">
                <RatingStars rating={product.rating} size="sm" />
                <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <AffiliateButton href={product.affiliateUrl} size="sm" label="Buy" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
