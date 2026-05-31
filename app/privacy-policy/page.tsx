import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMeta({
  title: "Privacy Policy — DeskSetupLab",
  description: "DeskSetupLab's privacy policy. How we collect, use, and protect your personal data.",
  path: "/privacy-policy",
  noindex: false,
});

export default function PrivacyPolicyPage() {
  const year = new Date().getFullYear();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
      <p className="text-gray-500 mb-10 text-sm">Last updated: January 1, {year}</p>

      <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
          <p>
            DeskSetupLab (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates desksetuplab.com. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <p>
            <strong>Amazon Associate Disclosure:</strong> As an Amazon Associate (ID: affiliater07c-20), we participate
            in Amazon&apos;s affiliate program. Amazon&apos;s privacy practices are governed by{" "}
            <a href="https://www.amazon.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
              Amazon&apos;s Privacy Notice
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold text-gray-800">Automatically Collected</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Log data (IP address, browser type, pages visited, referring URL)</li>
            <li>Device information (browser, operating system)</li>
            <li>Usage data (time spent, clicks, scroll depth)</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Voluntarily Provided</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Email address (if you subscribe to our newsletter)</li>
            <li>Name and message (if you use our contact form)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Operate and improve our website</li>
            <li>Send newsletters (with your explicit consent)</li>
            <li>Analyze traffic and usage patterns via Google Analytics</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">4. Cookies</h2>
          <p>
            We use cookies for analytics (Google Analytics) and to remember your preferences. Amazon may also
            set cookies through affiliate links. You can disable cookies in your browser settings, though this
            may affect site functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">5. Third-Party Services</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Amazon Associates:</strong> Affiliate links use Amazon tracking cookies</li>
            <li><strong>Google Analytics:</strong> Anonymous traffic analysis</li>
            <li><strong>Vercel:</strong> Hosting and server-side analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">6. Data Retention</h2>
          <p>
            Newsletter subscriber data is retained until you unsubscribe. Analytics data is retained per
            the respective service&apos;s policy (Google Analytics: 26 months by default).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">7. Your Rights (GDPR/CCPA)</h2>
          <p>
            Depending on your location, you may have the right to: access your personal data, request deletion,
            opt out of data sale, or withdraw consent. Contact us at{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-brand-600 hover:underline">
              {siteConfig.email}
            </a>{" "}
            to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">8. Children&apos;s Privacy</h2>
          <p>
            Our site is not directed to children under 13. We do not knowingly collect personal data from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">9. Contact</h2>
          <p>
            Questions about this policy:{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-brand-600 hover:underline">
              {siteConfig.email}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
