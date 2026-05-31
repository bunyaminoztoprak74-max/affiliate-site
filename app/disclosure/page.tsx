import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMeta({
  title: "Affiliate Disclosure — DeskSetupLab",
  description: "DeskSetupLab's full affiliate disclosure. We are a participant in the Amazon Services LLC Associates Program.",
  path: "/disclosure",
});

export default function DisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Affiliate Disclosure</h1>
      <p className="text-gray-500 mb-10 text-sm">Last updated: January 1, {new Date().getFullYear()}</p>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-2">Amazon Associates Disclosure</h2>
          <p className="text-amber-800">
            <strong>DeskSetupLab</strong> (<em>desksetuplab.com</em>) is a participant in the{" "}
            <strong>Amazon Services LLC Associates Program</strong>, an affiliate advertising program designed to provide
            a means for sites to earn advertising fees by advertising and linking to Amazon.com.
          </p>
          <p className="text-amber-800 mt-3">
            <strong>Amazon Associate ID: affiliater07c-20</strong>
          </p>
          <p className="text-amber-800 mt-3">
            Amazon, the Amazon logo, AmazonSupply, and the AmazonSupply logo are trademarks of Amazon.com, Inc. or
            its affiliates.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">How This Works</h2>
          <p>
            When you click on a product link on DeskSetupLab and purchase the item, we may receive a small
            commission from Amazon at <strong>no additional cost to you</strong>. The price you pay is the
            same whether you use our affiliate link or navigate to Amazon directly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Our Editorial Independence</h2>
          <p>
            <strong>We never accept payment to feature or recommend a product.</strong> Our editorial team
            independently selects all products we test and review. Products are purchased with our own funds —
            not provided by manufacturers unless we specifically note otherwise.
          </p>
          <p>
            Our affiliate relationships have <strong>zero influence on our ratings, rankings, or recommendations</strong>.
            If a product fails our testing, we say so clearly — regardless of whether it earns us a commission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">FTC Compliance</h2>
          <p>
            In accordance with the{" "}
            <a href="https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
              FTC Endorsement Guidelines
            </a>
            , we clearly disclose our affiliate relationships on pages that contain affiliate links. You&apos;ll
            find disclosure notices at the top of all review and best-of pages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Price Accuracy</h2>
          <p>
            Product prices and availability are accurate as of the date/time they were last updated and are
            subject to change. Any price and availability information displayed on Amazon at the time of purchase
            will apply. We make every effort to keep pricing updated, but always verify the current price on Amazon
            before purchasing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Other Affiliate Programs</h2>
          <p>
            In addition to the Amazon Associates Program, DeskSetupLab may participate in other affiliate
            programs from time to time. All such relationships are disclosed on the relevant pages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
          <p>
            If you have questions about our affiliate disclosure or editorial process, please contact us at{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-brand-600 hover:underline">
              {siteConfig.email}
            </a>
            .
          </p>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Related:{" "}
            <Link href="/privacy-policy" className="text-brand-600 hover:underline">Privacy Policy</Link>
            {" · "}
            <Link href="/terms" className="text-brand-600 hover:underline">Terms of Service</Link>
            {" · "}
            <Link href="/how-we-test" className="text-brand-600 hover:underline">How We Test</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
