import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import SchemaMarkup from "./SchemaMarkup";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = [
    { name: "Home", url: siteConfig.domain },
    ...items.map((item) => ({
      name: item.label,
      url: item.href ? `${siteConfig.domain}${item.href}` : siteConfig.domain,
    })),
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span className="sr-only">Home</span>
        </Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-brand-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
