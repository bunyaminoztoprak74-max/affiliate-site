#!/usr/bin/env tsx
/**
 * AI Content Generation Script — DeskSetupLab
 * ================================================
 * Generates SEO-optimized product reviews and best-of pages
 * using OpenAI GPT-4o or Google Gemini.
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts --type review --product flexispot-e7
 *   npx tsx scripts/generate-content.ts --type best --category standing-desks
 *   npx tsx scripts/generate-content.ts --type blog --topic "standing desk benefits"
 *
 * Env vars required:
 *   OPENAI_API_KEY or GEMINI_API_KEY
 */

import * as fs from "fs";
import * as path from "path";

// ── CLI Args ─────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name: string) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : undefined;
};

const type = getArg("type") as "review" | "best" | "blog" | "comparison";
const topic = getArg("topic") ?? getArg("product") ?? getArg("category") ?? "";
const provider = (getArg("provider") ?? "openai") as "openai" | "gemini";
const dryRun = args.includes("--dry-run");

// ── AI Client Factory ─────────────────────────────────────
async function generateWithOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert home office product reviewer. Write detailed, honest, SEO-optimized content in MDX format. Always include proper headings, real specs, pros/cons, and buying advice. Maintain journalistic integrity — never oversell.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4000 },
      }),
    }
  );

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function generate(prompt: string): Promise<string> {
  return provider === "gemini" ? generateWithGemini(prompt) : generateWithOpenAI(prompt);
}

// ── Prompt Templates ──────────────────────────────────────
function reviewPrompt(productSlug: string): string {
  return `
Write a complete, hands-on product review for the home office product: "${productSlug}"

Format: MDX with frontmatter

Requirements:
- Title: "[Product Name] Review (${new Date().getFullYear()}) — Is It Worth It?"
- H2 sections: Overview, Key Features, Performance, Pros & Cons, Who It's For, Alternatives, Verdict
- Include real specs, dimensions, and pricing
- 1,500–2,000 words
- SEO-optimized: include keywords naturally
- Include Amazon affiliate disclosure note
- End with a clear buy/skip recommendation

Frontmatter fields:
- title, metaTitle, metaDescription, publishedAt, updatedAt, author, category, score (0-100), verdict
`;
}

function bestOfPrompt(category: string): string {
  return `
Write a "Best ${category} of ${new Date().getFullYear()}" article in MDX format.

Requirements:
- H1: "Best ${category} of ${new Date().getFullYear()} — Tested & Ranked"
- Intro paragraph (150 words): Why this category matters, how we tested
- List 5–7 products with: badge, name, price, pros, cons, who it's for, verdict
- H2 sections for each product: "1. [Product Name] — Best Overall", etc.
- Buying Guide section (300 words): 4 key things to look for
- FAQ section: 4 questions with detailed answers
- 2,500–3,000 words total
- Include affiliate disclosure
- Internal links to /review/[slug] pages

SEO requirements:
- Primary keyword: "best ${category.toLowerCase()}"
- Include LSI keywords naturally
`;
}

function blogPrompt(topic: string): string {
  return `
Write a blog post about: "${topic}" for a home office product review site.

Requirements:
- Informational/educational tone
- 1,000–1,500 words
- MDX format with frontmatter
- H2 and H3 structure
- Include actionable tips
- Naturally mention related products where relevant
- Include affiliate disclosure

Frontmatter: title, metaTitle, metaDescription, tags, category, publishedAt
`;
}

// ── Output Writer ─────────────────────────────────────────
function getOutputPath(contentType: string, slug: string): string {
  const dirMap: Record<string, string> = {
    review: "content/reviews",
    best: "content/best",
    blog: "content/blog",
    comparison: "content/comparisons",
  };
  const dir = path.join(process.cwd(), dirMap[contentType] ?? "content");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${slug}.mdx`);
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  if (!type || !topic) {
    console.error("Usage: tsx generate-content.ts --type [review|best|blog] --product/category/topic [name]");
    process.exit(1);
  }

  console.log(`\n🤖 Generating ${type} content for "${topic}" using ${provider}...`);

  let prompt = "";
  switch (type) {
    case "review":
      prompt = reviewPrompt(topic);
      break;
    case "best":
      prompt = bestOfPrompt(topic);
      break;
    case "blog":
      prompt = blogPrompt(topic);
      break;
    default:
      console.error("Unknown type:", type);
      process.exit(1);
  }

  if (dryRun) {
    console.log("\n--- PROMPT PREVIEW ---");
    console.log(prompt);
    console.log("--- END PROMPT ---\n");
    console.log("Dry run complete. Remove --dry-run to generate content.");
    return;
  }

  try {
    const content = await generate(prompt);
    const slug = topic.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const outputPath = getOutputPath(type, slug);

    fs.writeFileSync(outputPath, content, "utf8");
    console.log(`\n✅ Content written to: ${outputPath}`);
    console.log(`📄 Word count: ~${content.split(/\s+/).length}`);
  } catch (err) {
    console.error("\n❌ Generation failed:", err);
    process.exit(1);
  }
}

main();
