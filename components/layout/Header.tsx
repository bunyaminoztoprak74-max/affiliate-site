"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const NAV_ITEMS = [
  {
    label: "Best Picks",
    href: "/best",
    children: [
      { label: "Best Standing Desks", href: "/best/standing-desks" },
      { label: "Best Ergonomic Chairs", href: "/best/ergonomic-chairs" },
      { label: "Best Monitors", href: "/best/monitors" },
      { label: "Best Monitor Arms", href: "/best/monitor-arms" },
      { label: "Best Desk Lamps", href: "/best/desk-lamps" },
      { label: "Best Webcams", href: "/best/webcams" },
    ],
  },
  {
    label: "Reviews",
    href: "/review",
    children: [
      { label: "Standing Desk Reviews", href: "/category/standing-desks" },
      { label: "Chair Reviews", href: "/category/ergonomic-chairs" },
      { label: "Monitor Reviews", href: "/category/monitors" },
    ],
  },
  {
    label: "Compare",
    href: "/compare",
  },
  {
    label: "Buying Guides",
    href: "/buying-guide",
    children: [
      { label: "How to Choose a Standing Desk", href: "/buying-guide/standing-desk" },
      { label: "How to Choose an Ergonomic Chair", href: "/buying-guide/ergonomic-chair" },
      { label: "How to Set Up Your Monitor", href: "/buying-guide/monitor-setup" },
    ],
  },
  { label: "Deals", href: "/deals" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-white"
      }`}
    >
      {/* Affiliate Disclosure Banner */}
      <div className="bg-brand-700 text-white text-center text-xs py-1.5 px-4">
        <span>
          As an Amazon Associate, DeskSetupLab earns from qualifying purchases.{" "}
          <Link href="/disclosure" className="underline hover:text-brand-200 transition-colors">
            Learn more
          </Link>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-700 transition-colors">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              DeskSetup<span className="text-brand-600">Lab</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-all"
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-gray-800 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-1.5 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/deals"
                className="block w-full text-center bg-accent-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                🔥 Today&apos;s Deals
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
