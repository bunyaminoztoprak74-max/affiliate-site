import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                DeskSetup<span className="text-brand-400">Lab</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Expert, hands-on reviews of home office gear. We buy and test every product we recommend.
            </p>
            <div className="flex gap-3">
              {siteConfig.social.twitter && (
                <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-400 transition-colors text-sm">Twitter</a>
              )}
              {siteConfig.social.pinterest && (
                <a href={siteConfig.social.pinterest} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-400 transition-colors text-sm">Pinterest</a>
              )}
              {siteConfig.social.youtube && (
                <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-400 transition-colors text-sm">YouTube</a>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Picks */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Best Picks</h3>
            <ul className="space-y-2">
              <li><Link href="/best/standing-desks" className="text-sm text-gray-400 hover:text-white transition-colors">Best Standing Desks</Link></li>
              <li><Link href="/best/ergonomic-chairs" className="text-sm text-gray-400 hover:text-white transition-colors">Best Ergonomic Chairs</Link></li>
              <li><Link href="/best/monitors" className="text-sm text-gray-400 hover:text-white transition-colors">Best Monitors</Link></li>
              <li><Link href="/best/monitor-arms" className="text-sm text-gray-400 hover:text-white transition-colors">Best Monitor Arms</Link></li>
              <li><Link href="/best/desk-lamps" className="text-sm text-gray-400 hover:text-white transition-colors">Best Desk Lamps</Link></li>
              <li><Link href="/best/webcams" className="text-sm text-gray-400 hover:text-white transition-colors">Best Webcams</Link></li>
              <li><Link href="/best/headphones" className="text-sm text-gray-400 hover:text-white transition-colors">Best Office Headphones</Link></li>
              <li><Link href="/best/docking-stations" className="text-sm text-gray-400 hover:text-white transition-colors">Best Docking Stations</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/how-we-test" className="text-sm text-gray-400 hover:text-white transition-colors">How We Test</Link></li>
              <li><Link href="/disclosure" className="text-sm text-gray-400 hover:text-white transition-colors">Affiliate Disclosure</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/sitemap.xml" className="text-sm text-gray-400 hover:text-white transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Amazon Disclosure — REQUIRED */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            <strong className="text-gray-400">Amazon Associate Disclosure:</strong>{" "}
            DeskSetupLab is a participant in the Amazon Services LLC Associates Program, an affiliate advertising
            program designed to provide a means for sites to earn advertising fees by advertising and linking to
            Amazon.com. As an Amazon Associate, we earn from qualifying purchases. Amazon, the Amazon logo,
            AmazonSupply, and the AmazonSupply logo are trademarks of Amazon.com, Inc. or its affiliates.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Prices and availability are subject to change. Product prices and availability are accurate as of the
            date/time indicated and are subject to change. Any price and availability information displayed on
            Amazon at the time of purchase will apply to the purchase of this product. We independently select
            all products — we never accept payment to recommend items. Our editorial team tests each product
            hands-on before recommending it.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-600">
            © {year} DeskSetupLab. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/disclosure" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
