import type { Category, ProductCategory } from "@/types";

export const CATEGORIES: Category[] = [
  {
    slug: "standing-desks",
    name: "Standing Desks",
    description: "Electric and manual height-adjustable desks for a healthier workday.",
    icon: "🖥️",
    commission: 3,
  },
  {
    slug: "ergonomic-chairs",
    name: "Ergonomic Chairs",
    description: "Science-backed chairs that eliminate back pain and boost focus.",
    icon: "🪑",
    commission: 3,
  },
  {
    slug: "monitors",
    name: "Monitors",
    description: "4K, QHD, and ultrawide displays for every budget and use case.",
    icon: "🖥",
    commission: 2.5,
  },
  {
    slug: "monitor-arms",
    name: "Monitor Arms",
    description: "Free up desk space and achieve perfect ergonomic monitor positioning.",
    icon: "💪",
    commission: 3,
  },
  {
    slug: "desk-lamps",
    name: "Desk Lamps",
    description: "Eye-care LED lamps that reduce fatigue during long work sessions.",
    icon: "💡",
    commission: 3,
  },
  {
    slug: "webcams",
    name: "Webcams",
    description: "Look sharp on every video call with 4K and 1080p webcams.",
    icon: "📷",
    commission: 2.5,
  },
  {
    slug: "headphones",
    name: "Office Headphones",
    description: "Active noise-canceling headphones for deep work in any environment.",
    icon: "🎧",
    commission: 4,
  },
  {
    slug: "keyboard-wrist-rests",
    name: "Keyboard & Wrist Rests",
    description: "Mechanical keyboards and ergonomic wrist rests for all-day typing.",
    icon: "⌨️",
    commission: 3,
  },
  {
    slug: "laptop-stands",
    name: "Laptop Stands",
    description: "Elevate your laptop to eye level and say goodbye to neck pain.",
    icon: "💻",
    commission: 3,
  },
  {
    slug: "cable-management",
    name: "Cable Management",
    description: "Trays, clips, and boxes to tame the cable chaos under your desk.",
    icon: "🔌",
    commission: 3,
  },
  {
    slug: "desk-organizers",
    name: "Desk Organizers",
    description: "Keep your workspace clean and productive with smart organizers.",
    icon: "🗂️",
    commission: 3,
  },
  {
    slug: "desk-mats",
    name: "Desk Mats",
    description: "Premium leather and felt desk pads that elevate any setup.",
    icon: "🟫",
    commission: 3,
  },
  {
    slug: "under-desk-treadmills",
    name: "Under-Desk Treadmills",
    description: "Walk while you work and hit 10,000 steps without leaving your desk.",
    icon: "🏃",
    commission: 3,
  },
  {
    slug: "docking-stations",
    name: "Docking Stations",
    description: "USB-C and Thunderbolt hubs to connect everything with one cable.",
    icon: "🔗",
    commission: 2.5,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): ProductCategory[] {
  return CATEGORIES.map((c) => c.slug);
}
