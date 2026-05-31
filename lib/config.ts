import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "DeskSetupLab",
  domain: "https://www.desksetuplab.com",
  tagline: "Expert Home Office Reviews You Can Trust",
  description:
    "In-depth, hands-on reviews of standing desks, ergonomic chairs, monitors, and home office gear. Tested by real people so you buy right the first time.",
  affiliateTag: "affiliater07c-20",
  author: "DeskSetupLab Editorial Team",
  email: "hello@desksetuplab.com",
  social: {
    twitter: "https://twitter.com/desksetuplab",
    pinterest: "https://pinterest.com/desksetuplab",
    youtube: "https://youtube.com/@desksetuplab",
  },
};

export const AFFILIATE_TAG = "affiliater07c-20";

export const AMAZON_BASE_URL = "https://www.amazon.com";

// Revalidation intervals (seconds)
export const ISR_REVALIDATE = {
  homepage: 3600,       // 1 hour
  bestOf: 86400,        // 24 hours
  review: 86400,
  comparison: 86400,
  category: 3600,
  blog: 3600,
  deals: 900,           // 15 minutes
};
