import Image from "next/image";
import Link from "next/link";
import { CheckCircle, XCircle, BadgeCheck } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/amazon";
import AffiliateButton from "./AffiliateButton";
import RatingStars from "./RatingStars";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  rank?: number;
  variant?: "card" | "list" | "compact";
  showPros?: boolean;
  className?: string;
}

const BADGE_STYLES: Record<string, string> = {
  "Best Overall": "bg-brand-600 text-white",
  "Best Value": "bg-success text-white",
  "Premium Pick": "bg-purple-600 text-white",
  "Editor's Choice": "bg-accent-500 text-white",
  "Budget Pick": "bg-green-600 text-white",
  "Most Popular": "bg-pink-600 text-white",
};

export default function ProductCard({
  product,
  rank,
  variant = "card",
  showPros = true,
  className,
}: ProductCardProps) {
  const discountPercent =
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  if (variant === "list") {
    return (
      <div className={cn("flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all group", className)}>
        {rank && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
            {rank}
          </div>
        )}

        <div className="flex-shrink-0 relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50">
          <Image src={product.image} alt={product.name} fill className="object-contain p-2" sizes="96px" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              {product.badge && (
                <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1", BADGE_STYLES[product.badge] ?? "bg-gray-100 text-gray-700")}>
                  {product.badge}
                </span>
              )}
              <Link href={`/review/${product.slug}`} className="block font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2 group-hover:text-brand-600">
                {product.name}
              </Link>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{product.shortDescription}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <RatingStars rating={product.rating} size="sm" />
            <AffiliateButton href={product.affiliateUrl} size="sm" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all p-3 flex gap-3 items-center", className)}>
        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <Image src={product.image} alt={product.name} fill className="object-contain p-1" sizes="48px" />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/review/${product.slug}`} className="text-sm font-medium text-gray-900 hover:text-brand-600 line-clamp-1">{product.name}</Link>
          <p className="text-sm font-bold text-brand-600">{formatPrice(product.price)}</p>
        </div>
        <AffiliateButton href={product.affiliateUrl} size="sm" label="Buy" />
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col", className)}>
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.badge && (
          <div className={cn("absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1", BADGE_STYLES[product.badge] ?? "bg-gray-100 text-gray-700")}>
            <BadgeCheck className="w-3 h-3" />
            {product.badge}
          </div>
        )}
        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
            -{discountPercent}%
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 300px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{product.brand}</p>
        <Link
          href={`/review/${product.slug}`}
          className="font-semibold text-gray-900 hover:text-brand-600 transition-colors mb-2 line-clamp-2"
        >
          {product.name}
        </Link>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">{product.shortDescription}</p>

        <RatingStars rating={product.rating} size="sm" className="mb-3" />

        {showPros && product.pros.length > 0 && (
          <div className="space-y-1 mb-4">
            {product.pros.slice(0, 3).map((pro) => (
              <div key={pro} className="flex gap-1.5 text-xs text-gray-600">
                <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                <span>{pro}</span>
              </div>
            ))}
            {product.cons.length > 0 && (
              <div className="flex gap-1.5 text-xs text-gray-400">
                <XCircle className="w-3.5 h-3.5 text-danger flex-shrink-0 mt-0.5" />
                <span>{product.cons[0]}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
          <AffiliateButton href={product.affiliateUrl} price={product.price} className="w-full justify-center" />
        </div>
      </div>
    </div>
  );
}
