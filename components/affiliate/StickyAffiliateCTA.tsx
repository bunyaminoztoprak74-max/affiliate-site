"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/amazon";
import AffiliateButton from "./AffiliateButton";
import RatingStars from "./RatingStars";

interface StickyAffiliateCTAProps {
  product: Product;
}

export default function StickyAffiliateCTA({ product }: StickyAffiliateCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > 600 && !dismissed);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 animate-slide-up">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        {/* Image */}
        <div className="flex-shrink-0 relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 hidden sm:block">
          <Image src={product.image} alt={product.name} fill className="object-contain p-1" sizes="48px" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</p>
          <div className="flex items-center gap-3">
            <RatingStars rating={product.rating} size="sm" showNumber={false} />
            <span className="text-sm font-bold text-brand-600">{formatPrice(product.price)}</span>
            {product.badge && (
              <span className="hidden sm:inline-block px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-medium rounded-full">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <AffiliateButton href={product.affiliateUrl} size="sm" className="flex-shrink-0" />

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
