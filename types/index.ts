// ============================================================
// CORE TYPES — DeskSetupLab
// Amazon Associate ID: affiliater07c-20
// ============================================================

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  asin: string; // Amazon ASIN
  category: ProductCategory;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  rating: number; // 0-10
  reviewCount?: number;
  image: string;
  images?: string[];
  affiliateUrl: string; // generated via lib/amazon.ts
  shortDescription: string;
  longDescription?: string;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  badge?: "Best Overall" | "Best Value" | "Premium Pick" | "Editor's Choice" | "Budget Pick" | "Most Popular";
  inStock: boolean;
  lastUpdated: string; // ISO date
  score?: number; // Our editorial score 0-100
  tags?: string[];
}

export type ProductCategory =
  | "standing-desks"
  | "ergonomic-chairs"
  | "monitors"
  | "monitor-arms"
  | "desk-lamps"
  | "webcams"
  | "headphones"
  | "keyboard-wrist-rests"
  | "laptop-stands"
  | "cable-management"
  | "desk-organizers"
  | "desk-mats"
  | "under-desk-treadmills"
  | "office-keyboards"
  | "office-mice"
  | "docking-stations"
  | "desk-accessories";

export interface Category {
  slug: ProductCategory;
  name: string;
  description: string;
  icon: string;
  image?: string;
  productCount?: number;
  avgPrice?: number;
  commission: number; // %
}

export interface BestOfPage {
  slug: string; // e.g. "best-standing-desks"
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  category: ProductCategory;
  topPick: string; // product id
  products: string[]; // product ids in order
  faqs: FAQ[];
  buyingGuide: string; // markdown
  lastUpdated: string;
  reviewedBy: string;
}

export interface ReviewPage {
  slug: string; // e.g. "flexispot-e7-review"
  productId: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string; // MDX
  verdict: string;
  score: number; // 0-100
  testingPeriod: string; // "3 weeks"
  author: string;
  publishedAt: string;
  updatedAt: string;
}

export interface ComparisonPage {
  slug: string; // e.g. "flexispot-e7-vs-uplift-v2"
  title: string;
  metaTitle: string;
  metaDescription: string;
  product1Id: string;
  product2Id: string;
  winner?: string; // product id
  winnerReason?: string;
  content: string; // MDX
  faqs: FAQ[];
  lastUpdated: string;
}

export interface BuyingGuide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: ProductCategory;
  content: string; // MDX
  faqs: FAQ[];
  relatedProducts: string[];
  publishedAt: string;
  updatedAt: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Author {
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  expertise: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string; // MDX
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  featuredImage?: string;
  readingTime?: number;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SiteConfig {
  name: string;
  domain: string;
  tagline: string;
  description: string;
  affiliateTag: string;
  author: string;
  email: string;
  social: {
    twitter?: string;
    facebook?: string;
    pinterest?: string;
    youtube?: string;
  };
}
