import Link from "next/link";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateButtonProps {
  href: string;
  price?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  asin?: string;
}

export default function AffiliateButton({
  href,
  price,
  label = "Check Price on Amazon",
  size = "md",
  variant = "primary",
  className,
}: AffiliateButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary: "bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md",
    secondary: "bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md",
    outline: "border-2 border-accent-500 text-accent-600 hover:bg-accent-50",
  };

  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer nofollow sponsored" : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 group",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <ShoppingCart className="w-4 h-4 flex-shrink-0" />
      <span className="flex flex-col items-start">
        <span>{label}</span>
        {price && (
          <span className="text-xs font-normal opacity-80">
            from ${price.toFixed(0)}
          </span>
        )}
      </span>
      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
