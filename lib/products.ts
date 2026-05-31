import type { Product, ProductCategory } from "@/types";
import { buildInternalAffiliateUrl } from "./amazon";

// ── Product Database ──────────────────────────────────────
// In production: replace with DB queries or CMS API calls.

const RAW_PRODUCTS: Omit<Product, "affiliateUrl">[] = [
  // ── STANDING DESKS ────────────────────────────────────
  {
    id: "flexispot-e7",
    slug: "flexispot-e7-standing-desk",
    name: "FlexiSpot E7 Pro Standing Desk",
    brand: "FlexiSpot",
    asin: "B08DKQJ9X8",
    category: "standing-desks",
    price: 499,
    originalPrice: 629,
    rating: 9.2,
    reviewCount: 4821,
    image: "https://images-na.ssl-images-amazon.com/images/P/B08DKQJ9X8.01.LZZZZZZZ.jpg",
    shortDescription: "The best overall standing desk for most home offices — rock-solid frame, whisper-quiet motor, and a 355 lb lifting capacity.",
    pros: ["Extremely stable at standing height", "Dual-motor lifts 355 lbs", "Anti-collision feature", "5-year warranty", "Programmable memory presets"],
    cons: ["Assembly takes 45–60 min", "No built-in cable management tray"],
    specs: { "Height Range": "22.8\"–48.4\"", "Weight Capacity": "355 lbs", "Motor": "Dual", "Noise Level": "<45 dB", "Warranty": "5 years", "Frame Colors": "Black, White, Grey" },
    badge: "Best Overall",
    inStock: true,
    lastUpdated: "2026-03-01",
    score: 93,
    tags: ["home office", "dual motor", "heavy duty", "programmable"],
  },
  {
    id: "uplift-v2",
    slug: "uplift-v2-standing-desk",
    name: "UPLIFT V2 Standing Desk",
    brand: "UPLIFT Desk",
    asin: "B07MN3XTDZ",
    category: "standing-desks",
    price: 749,
    originalPrice: 899,
    rating: 9.5,
    reviewCount: 6203,
    image: "https://images-na.ssl-images-amazon.com/images/P/B07MN3XTDZ.01.LZZZZZZZ.jpg",
    shortDescription: "The gold standard of standing desks. Unmatched stability, 15-year warranty, and virtually unlimited customization.",
    pros: ["Industry-best stability", "15-year warranty", "Massive customization options", "Built-in collision detection", "BIFMA certified"],
    cons: ["Premium price point", "Delivery can take 2–3 weeks for custom configs"],
    specs: { "Height Range": "25.5\"–51.1\"", "Weight Capacity": "535 lbs", "Motor": "Dual", "Noise Level": "<45 dB", "Warranty": "15 years", "Frame Colors": "Black, White, Silver, Bamboo" },
    badge: "Premium Pick",
    inStock: true,
    lastUpdated: "2026-03-01",
    score: 97,
    tags: ["premium", "customizable", "BIFMA", "best stability"],
  },
  {
    id: "vari-electric",
    slug: "vari-electric-standing-desk",
    name: "Vari Electric Standing Desk 60\"",
    brand: "Vari",
    asin: "B07CYT9VL7",
    category: "standing-desks",
    price: 595,
    originalPrice: 695,
    rating: 8.8,
    reviewCount: 3104,
    image: "https://images-na.ssl-images-amazon.com/images/P/B07CYT9VL7.01.LZZZZZZZ.jpg",
    shortDescription: "The easiest standing desk to assemble — arrives 95% pre-assembled and takes under 5 minutes to set up.",
    pros: ["5-minute assembly", "Very stable", "Smooth motor", "Clean cable management"],
    cons: ["Less customization than competitors", "Slightly smaller height range"],
    specs: { "Height Range": "25\"–50.5\"", "Weight Capacity": "200 lbs", "Motor": "Single", "Assembly": "5 min", "Warranty": "5 years" },
    badge: "Editor's Choice",
    inStock: true,
    lastUpdated: "2026-02-15",
    score: 88,
    tags: ["easy assembly", "quick setup", "office"],
  },
  {
    id: "seiffen-laminated",
    slug: "seiffen-laminated-standing-desk",
    name: "Flexispot Seiffen Bamboo Standing Desk",
    brand: "FlexiSpot",
    asin: "B09BKRD5Q5",
    category: "standing-desks",
    price: 299,
    originalPrice: 399,
    rating: 8.4,
    reviewCount: 1876,
    image: "https://images-na.ssl-images-amazon.com/images/P/B09BKRD5Q5.01.LZZZZZZZ.jpg",
    shortDescription: "The best budget standing desk under $300. Solid performance without the premium price tag.",
    pros: ["Under $300", "Bamboo desktop looks premium", "Reliable motor", "Good stability for price"],
    cons: ["Single motor", "Lower weight capacity", "Fewer memory presets"],
    specs: { "Height Range": "28\"–47.6\"", "Weight Capacity": "176 lbs", "Motor": "Single", "Warranty": "3 years" },
    badge: "Best Value",
    inStock: true,
    lastUpdated: "2026-02-01",
    score: 81,
    tags: ["budget", "bamboo", "under $300"],
  },

  // ── ERGONOMIC CHAIRS ──────────────────────────────────
  {
    id: "herman-miller-aeron",
    slug: "herman-miller-aeron-review",
    name: "Herman Miller Aeron Chair",
    brand: "Herman Miller",
    asin: "B002LZYF6E",
    category: "ergonomic-chairs",
    price: 1445,
    rating: 9.7,
    reviewCount: 8912,
    image: "https://images-na.ssl-images-amazon.com/images/P/B002LZYF6E.01.LZZZZZZZ.jpg",
    shortDescription: "The industry benchmark. Thirty years of ergonomic science in one chair — the choice of Fortune 500 companies worldwide.",
    pros: ["Unrivaled lumbar support", "PostureFit SL technology", "12-year warranty", "3 size options (A/B/C)", "Exceptional breathability"],
    cons: ["Very expensive", "Takes time to dial in settings", "Armrests can be fiddly"],
    specs: { "Sizes": "A, B, C", "Weight Capacity": "350 lbs", "Warranty": "12 years", "Lumbar": "PostureFit SL", "Material": "8Z Pellicle mesh" },
    badge: "Best Overall",
    inStock: true,
    lastUpdated: "2026-03-01",
    score: 97,
    tags: ["premium", "lumbar", "mesh", "12-year warranty"],
  },
  {
    id: "steelcase-leap-v2",
    slug: "steelcase-leap-v2-review",
    name: "Steelcase Leap V2",
    brand: "Steelcase",
    asin: "B006H1QYBA",
    category: "ergonomic-chairs",
    price: 1299,
    rating: 9.5,
    reviewCount: 5234,
    image: "https://images-na.ssl-images-amazon.com/images/P/B006H1QYBA.01.LZZZZZZZ.jpg",
    shortDescription: "The best chair for people who move a lot — its LiveBack technology mirrors your every movement.",
    pros: ["LiveBack mimics spine movement", "Lower back firmness control", "Seat depth adjustment", "12-year warranty", "Highly adjustable arms"],
    cons: ["Expensive", "No headrest option", "Some find cushion too firm initially"],
    specs: { "Weight Capacity": "400 lbs", "Warranty": "12 years", "Back": "LiveBack", "Arm Types": "4D" },
    badge: "Premium Pick",
    inStock: true,
    lastUpdated: "2026-03-01",
    score: 95,
    tags: ["premium", "liveback", "movement", "adjustable"],
  },
  {
    id: "secretlab-titan",
    slug: "secretlab-titan-evo-review",
    name: "Secretlab TITAN Evo 2022",
    brand: "Secretlab",
    asin: "B09T9NWZ4G",
    category: "ergonomic-chairs",
    price: 549,
    rating: 8.9,
    reviewCount: 12430,
    image: "https://images-na.ssl-images-amazon.com/images/P/B09T9NWZ4G.01.LZZZZZZZ.jpg",
    shortDescription: "The best mid-range ergonomic chair — built-in lumbar, magnetic memory foam head pillow, and exceptional build quality.",
    pros: ["Built-in lumbar support system", "Magnetic memory foam head pillow", "NEO Hybrid Leatherette feels premium", "5-year warranty", "3 size options"],
    cons: ["Gaming aesthetic not for everyone", "Limited recline to 165°"],
    specs: { "Sizes": "Small, Regular, XL", "Weight Capacity": "395 lbs", "Warranty": "5 years", "Recline": "85°–165°", "Material": "NEO Hybrid Leatherette / SoftWeave" },
    badge: "Best Value",
    inStock: true,
    lastUpdated: "2026-02-20",
    score: 88,
    tags: ["mid-range", "gaming", "lumbar", "value"],
  },

  // ── MONITORS ──────────────────────────────────────────
  {
    id: "dell-u2723d",
    slug: "dell-ultrasharp-u2723d-review",
    name: "Dell UltraSharp 27\" 4K USB-C (U2723D)",
    brand: "Dell",
    asin: "B09TQQS74M",
    category: "monitors",
    price: 549,
    originalPrice: 699,
    rating: 9.3,
    reviewCount: 3241,
    image: "https://images-na.ssl-images-amazon.com/images/P/B09TQQS74M.01.LZZZZZZZ.jpg",
    shortDescription: "The best overall monitor for home offices — stunning 4K IPS Black panel, 90W USB-C charging, and near-perfect color accuracy.",
    pros: ["IPS Black — deepest blacks on an IPS panel", "90W USB-C power delivery", "Built-in KVM switch", "99% sRGB / 98% DCI-P3", "5-year Advanced Exchange warranty"],
    cons: ["Expensive for a 60Hz monitor", "Stands are bulky"],
    specs: { "Size": "27\"", "Resolution": "3840×2160 (4K)", "Panel": "IPS Black", "Refresh Rate": "60Hz", "USB-C PD": "90W", "Color Gamut": "99% sRGB" },
    badge: "Best Overall",
    inStock: true,
    lastUpdated: "2026-03-01",
    score: 93,
    tags: ["4K", "IPS", "USB-C", "color accurate"],
  },
  {
    id: "lg-27gp850",
    slug: "lg-27gp850-b-review",
    name: "LG 27GP850-B 27\" QHD 165Hz",
    brand: "LG",
    asin: "B08W4JBLHJ",
    category: "monitors",
    price: 299,
    originalPrice: 399,
    rating: 9.0,
    reviewCount: 7832,
    image: "https://images-na.ssl-images-amazon.com/images/P/B08W4JBLHJ.01.LZZZZZZZ.jpg",
    shortDescription: "The best monitor for mixed work and gaming — sharp QHD resolution, blazing 165Hz refresh, and Nano IPS technology.",
    pros: ["165Hz for smooth productivity & gaming", "Nano IPS wide color gamut", "1ms response time", "Great ergonomics", "G-Sync compatible"],
    cons: ["Stand wobbles slightly", "HDR 400 is mediocre"],
    specs: { "Size": "27\"", "Resolution": "2560×1440 (QHD)", "Panel": "Nano IPS", "Refresh Rate": "165Hz", "Response": "1ms GtG" },
    badge: "Editor's Choice",
    inStock: true,
    lastUpdated: "2026-02-15",
    score: 90,
    tags: ["QHD", "165Hz", "gaming", "Nano IPS"],
  },

  // ── MONITOR ARMS ──────────────────────────────────────
  {
    id: "ergotron-lx",
    slug: "ergotron-lx-desk-mount-review",
    name: "Ergotron LX Desk Monitor Arm",
    brand: "Ergotron",
    asin: "B00B21TLQU",
    category: "monitor-arms",
    price: 179,
    originalPrice: 199,
    rating: 9.4,
    reviewCount: 18932,
    image: "https://images-na.ssl-images-amazon.com/images/P/B00B21TLQU.01.LZZZZZZZ.jpg",
    shortDescription: "The best monitor arm for most people — silky smooth movement, rock-solid hold, and works with virtually any monitor.",
    pros: ["Effortless adjustment", "Holds position perfectly", "Works with 34\" 11kg monitors", "Clean cable management", "15-year warranty"],
    cons: ["Pricier than no-name alternatives", "Installation takes 20 min"],
    specs: { "Max Monitor Size": "34\"", "Weight Capacity": "7–11 kg (15–24 lbs)", "Tilt": "±85°", "Pan": "360°", "Warranty": "15 years" },
    badge: "Best Overall",
    inStock: true,
    lastUpdated: "2026-03-01",
    score: 94,
    tags: ["monitor arm", "ergotron", "premium", "adjustable"],
  },

  // ── DESK MATS ─────────────────────────────────────────
  {
    id: "grovemade-desk-mat",
    slug: "grovemade-desk-mat-review",
    name: "Grovemade Wool Felt Desk Pad",
    brand: "Grovemade",
    asin: "B07YVJXN2Y",
    category: "desk-mats",
    price: 95,
    rating: 8.8,
    reviewCount: 2143,
    image: "https://images-na.ssl-images-amazon.com/images/P/B07YVJXN2Y.01.LZZZZZZZ.jpg",
    shortDescription: "The most aesthetically premium desk mat — natural wool felt that looks stunning and protects your desktop.",
    pros: ["Premium wool felt construction", "Looks incredible on any desk", "Protects desktop surface", "Non-slip backing", "Sustainable materials"],
    cons: ["Expensive for a desk mat", "Light color shows stains"],
    specs: { "Size": "36\" × 20\"", "Material": "Natural Wool Felt", "Backing": "Non-slip silicone" },
    badge: "Premium Pick",
    inStock: true,
    lastUpdated: "2026-01-15",
    score: 87,
    tags: ["desk mat", "premium", "aesthetic", "wool felt"],
  },
];

// Inject affiliateUrl into every product
export const ALL_PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  affiliateUrl: buildInternalAffiliateUrl(p.asin),
}));

// ── Helpers ───────────────────────────────────────────────

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(cat: ProductCategory): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === cat).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return ALL_PRODUCTS.filter((p) => p.badge).slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return ALL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.includes(q))
  );
}
