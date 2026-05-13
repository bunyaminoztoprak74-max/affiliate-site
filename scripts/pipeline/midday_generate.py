#!/usr/bin/env python3
"""Midday pipeline: generate articles for new products, push site to GitHub."""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.generate_content import batch_generate
from scripts.push_to_github import push_new_posts, push_file, get_repo

PRODUCTS_FILE = Path(__file__).parent.parent.parent / "products.json"
SITE_DIR = Path(__file__).parent.parent.parent / "site"


def main():
    print("=== MIDDAY GENERATE ===")
    products = json.loads(PRODUCTS_FILE.read_text())

    # Only generate for products without an existing article today
    from datetime import date
    today = date.today().isoformat()
    content_dir = SITE_DIR / "content" / "reviews"
    existing = (
        {p.stem.replace(f"{today}-", "") for p in content_dir.glob(f"{today}-*.md")}
        if content_dir.exists()
        else set()
    )

    to_generate = []
    for p in products:
        from slugify import slugify
        slug = slugify(p.get("name", p.get("product_name", "")))
        if slug not in existing:
            to_generate.append({
                "name": p.get("name", p.get("product_name", "")),
                "link": p.get("affiliate_link", p.get("link", "")),
                "category": p.get("category", "general"),
                "type": p.get("type", "reviews"),
                "context": p.get("context", ""),
            })

    if not to_generate:
        print("[INFO] No new articles to generate today.")
        return

    print(f"[INFO] Generating {len(to_generate)} articles...")
    saved = batch_generate(to_generate)
    if saved:
        print(f"[OK] Generated {len(saved)} articles. Pushing...")
        push_new_posts(saved)


if __name__ == "__main__":
    main()
