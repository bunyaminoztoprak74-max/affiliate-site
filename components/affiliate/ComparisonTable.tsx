import Image from "next/image";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/amazon";
import AffiliateButton from "./AffiliateButton";
import RatingStars from "./RatingStars";

interface ComparisonTableProps {
  products: Product[];
  compareKeys?: string[]; // spec keys to show
}

const DEFAULT_KEYS = ["Height Range", "Weight Capacity", "Motor", "Warranty"];

export default function ComparisonTable({ products, compareKeys = DEFAULT_KEYS }: ComparisonTableProps) {
  // Collect all spec keys across products
  const allSpecKeys = compareKeys.length
    ? compareKeys
    : Array.from(new Set(products.flatMap((p) => Object.keys(p.specs)))).slice(0, 8);

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm my-8">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-4 text-sm font-semibold text-gray-500 uppercase tracking-wide w-36">
              Spec
            </th>
            {products.map((p) => (
              <th key={p.id} className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-16 h-16 rounded-xl bg-white overflow-hidden border border-gray-100">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="64px" />
                  </div>
                  <Link href={`/review/${p.slug}`} className="text-xs font-semibold text-gray-900 hover:text-brand-600 text-center leading-tight">
                    {p.name}
                  </Link>
                  {p.badge && (
                    <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-medium rounded-full">
                      {p.badge}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Price row */}
          <tr className="border-b border-gray-100 bg-white">
            <td className="p-4 text-sm font-medium text-gray-600">Price</td>
            {products.map((p) => (
              <td key={p.id} className="p-4 text-center">
                <span className="text-lg font-bold text-gray-900">{formatPrice(p.price)}</span>
                {p.originalPrice && (
                  <span className="block text-xs text-gray-400 line-through">{formatPrice(p.originalPrice)}</span>
                )}
              </td>
            ))}
          </tr>

          {/* Rating row */}
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <td className="p-4 text-sm font-medium text-gray-600">Our Rating</td>
            {products.map((p) => (
              <td key={p.id} className="p-4">
                <div className="flex justify-center">
                  <RatingStars rating={p.rating} size="sm" />
                </div>
              </td>
            ))}
          </tr>

          {/* Spec rows */}
          {allSpecKeys.map((key, i) => (
            <tr key={key} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
              <td className="p-4 text-sm font-medium text-gray-600">{key}</td>
              {products.map((p) => {
                const val = p.specs[key];
                return (
                  <td key={p.id} className="p-4 text-sm text-center text-gray-700">
                    {val === undefined ? (
                      <span className="text-gray-300">—</span>
                    ) : val === "Yes" ? (
                      <CheckCircle className="w-5 h-5 text-success mx-auto" />
                    ) : val === "No" ? (
                      <XCircle className="w-5 h-5 text-danger mx-auto" />
                    ) : (
                      val
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* CTA row */}
          <tr className="bg-brand-50 border-t-2 border-brand-100">
            <td className="p-4 text-sm font-semibold text-gray-700">Buy Now</td>
            {products.map((p) => (
              <td key={p.id} className="p-4 text-center">
                <AffiliateButton href={p.affiliateUrl} size="sm" className="mx-auto" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
