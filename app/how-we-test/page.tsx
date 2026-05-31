import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import { CheckCircle, Clock, ShoppingBag, Users } from "lucide-react";

export const metadata: Metadata = buildMeta({
  title: "How We Test — DeskSetupLab Review Process",
  description: "Our rigorous, hands-on testing process for standing desks, ergonomic chairs, and home office gear. Here's exactly how we evaluate every product.",
  path: "/how-we-test",
});

const STEPS = [
  {
    icon: ShoppingBag,
    title: "We Buy Our Own Products",
    desc: "Every product we review is purchased with our own money from Amazon or authorized retailers. We never accept free products in exchange for positive coverage. This guarantees our reviews are 100% independent.",
  },
  {
    icon: Clock,
    title: "Minimum 40-Hour Real-World Use",
    desc: "We use every product for at least one full work week — minimum 40 hours. For ergonomic products, we test over multiple weeks to capture how the product feels as your body adapts.",
  },
  {
    icon: Users,
    title: "Multiple Reviewers When Possible",
    desc: "Body-type matters in ergonomics. Where possible, we test products across reviewers of different heights (5'3\" to 6'4\") and body types to ensure our recommendations work for most people.",
  },
  {
    icon: CheckCircle,
    title: "Standardized Testing Criteria",
    desc: "We test every product against the same criteria: build quality, ease of assembly, stability, adjustability, comfort, noise (for motorized products), and value for money.",
  },
];

export default function HowWeTestPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">How We Test</h1>
      <p className="text-xl text-gray-600 mb-12 leading-relaxed">
        Our review process is designed around one goal: telling you exactly what it&apos;s like to live with a product
        day-to-day. Here&apos;s how we do it.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {STEPS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-brand-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Rating System</h2>
        <p className="text-gray-600 mb-6">
          We rate products on a 0–10 scale across five dimensions: Build Quality, Ergonomics, Ease of Use, Value, and
          Longevity. The overall score is a weighted average.
        </p>
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">Score</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">Label</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["9.0–10", "Excellent", "Best-in-class. Buy with confidence."],
                ["8.0–8.9", "Great", "Highly recommended. Minor caveats only."],
                ["7.0–7.9", "Good", "Solid choice. Clearly defined trade-offs."],
                ["6.0–6.9", "Fair", "Below average. Better options exist."],
                ["< 6.0", "Poor", "Not recommended. Significant issues."],
              ].map(([score, label, meaning], i) => (
                <tr key={score} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900">{score}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-brand-700">{label}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-3">Affiliate Transparency</h2>
        <p className="text-amber-800 text-sm leading-relaxed">
          DeskSetupLab participates in the Amazon Services LLC Associates Program (Associate ID: affiliater07c-20).
          Our product links earn a small commission when you purchase, at no extra cost to you. This income helps
          fund our research and testing — but it <strong>never influences our recommendations</strong>. We have
          given poor reviews to products with high affiliate commissions, and excellent reviews to products with
          low commissions.
        </p>
      </section>
    </div>
  );
}
