"""
Affiliate content generator — produces Hugo-compatible Markdown via Groq API.
"""

import os
import json
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq
from slugify import slugify

load_dotenv()

client = Groq(api_key=os.environ["GROQ_API_KEY"])

SITE_DIR = Path(__file__).parent.parent / "site"
TEMPLATE_PATH = Path(__file__).parent.parent / "templates" / "post_template.md"

SYSTEM_PROMPT = """You are an expert affiliate marketing content writer targeting a global English-speaking audience.
Your goal: write SEO-optimized, conversion-focused product review articles.
Rules:
- Write in clear, natural American English
- Use H2 headings to structure the article
- Present a balanced view: honest pros AND cons
- Include a strong call-to-action (CTA)
- Maintain a trustworthy, helpful tone — never hype
- Aim for readers who are comparison-shopping and close to a buying decision
- Always respond with valid JSON only, no markdown code fences
"""


def generate_post(product_name: str, affiliate_link: str, category: str, extra_context: str = "") -> dict:
    """Generate a full blog post for the given product; returns structured JSON."""

    user_prompt = f"""
Product: {product_name}
Category: {category}
Affiliate Link: {affiliate_link}
{f'Additional context: {extra_context}' if extra_context else ''}

Return a JSON object with exactly these keys:
{{
  "title": "Article title (under 60 characters, compelling for search)",
  "meta_description": "SEO meta description (150-160 characters, include product name)",
  "rating": <integer 1-10>,
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "content": "Full article body in Markdown (minimum 600 words)"
}}

The content must include these sections in order:
- Introductory paragraph (hook the reader, state what this review covers)
- ## Key Features
- ## Pros and Cons
- ## Who Is It Best For?
- ## Price and Value
- ## Final Verdict
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.7,
        response_format={"type": "json_object"},
    )

    data = json.loads(response.choices[0].message.content)
    data["product_name"] = product_name
    data["affiliate_link"] = affiliate_link
    data["categories"] = category
    # Consistent placeholder image keyed on product slug
    from slugify import slugify as _sl
    _slug = _sl(product_name)
    data["image"] = f"https://picsum.photos/seed/{_slug}/800/450"
    return data


def save_post(data: dict, content_type: str = "reviews") -> Path:
    """Save generated content as a Hugo-compatible Markdown file."""

    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    date_str = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
    tags_str = ", ".join(f'"{t}"' for t in data.get("tags", []))

    post_content = template.format(
        title=data["title"],
        date=date_str,
        categories=f'"{data["categories"]}"',
        tags=tags_str,
        affiliate_link=data["affiliate_link"],
        product_name=data["product_name"],
        rating=data["rating"],
        image=data.get("image", ""),
        meta_description=data["meta_description"],
        content=data["content"],
    )

    filename = f"{datetime.now().strftime('%Y-%m-%d')}-{slugify(data['product_name'])}.md"
    output_dir = SITE_DIR / "content" / content_type
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename

    output_path.write_text(post_content, encoding="utf-8")
    print(f"[OK] Saved: {output_path}")
    return output_path


def batch_generate(products: list[dict]) -> list[Path]:
    """Generate content for multiple products."""
    paths = []
    for i, product in enumerate(products, 1):
        print(f"\n[{i}/{len(products)}] Processing: {product['name']}")
        try:
            data = generate_post(
                product_name=product["name"],
                affiliate_link=product["link"],
                category=product.get("category", "general"),
                extra_context=product.get("context", ""),
            )
            path = save_post(data, content_type=product.get("type", "reviews"))
            paths.append(path)
        except Exception as e:
            print(f"[ERROR] {product['name']}: {e}")
    return paths


if __name__ == "__main__":
    sample_products = [
        {
            "name": "Xiaomi Redmi Note 13 Pro",
            "link": "https://amzn.to/example1",
            "category": "smartphones",
            "type": "reviews",
            "context": "Mid-range, AMOLED display, 200MP camera, 5000mAh battery, 67W fast charging",
        },
        {
            "name": "Logitech MX Master 3S",
            "link": "https://amzn.to/example2",
            "category": "computer-accessories",
            "type": "reviews",
            "context": "Silent clicks, ergonomic design, multi-device support, MagSpeed scroll wheel, 70-day battery",
        },
    ]

    saved = batch_generate(sample_products)
    print(f"\nDone — {len(saved)} articles generated.")
