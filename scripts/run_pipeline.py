"""
Full pipeline: generate content → push to GitHub.
Usage: python scripts/run_pipeline.py

Supports both old schema (link field) and new schema (affiliate_link field).
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from scripts.generate_content import batch_generate
from scripts.push_to_github import push_new_posts

PRODUCTS_FILE = Path(__file__).parent.parent / "products.json"


def normalize_product(product: dict) -> dict:
    """
    Normalise a product dict so batch_generate always receives the expected keys.

    batch_generate expects: name, link, category, type, context
    New schema uses: affiliate_link instead of link
    This function ensures 'link' is always present, falling back to affiliate_link.
    """
    normalized = dict(product)
    # Ensure 'link' key is present for batch_generate compatibility
    if "link" not in normalized or not normalized["link"]:
        normalized["link"] = product.get("affiliate_link", "")
    # Ensure 'name' is present
    if "name" not in normalized or not normalized["name"]:
        normalized["name"] = product.get("product_name", "")
    return normalized


def load_products() -> list[dict]:
    if not PRODUCTS_FILE.exists():
        print(f"[ERROR] {PRODUCTS_FILE} not found.")
        print("Creating a sample products.json...")
        sample = [
            {
                "id": "example-product",
                "name": "Example Product",
                "affiliate_link": "https://amzn.to/example",
                "affiliate_network": "amazon",
                "asin": "",
                "category": "electronics",
                "type": "reviews",
                "price": "",
                "gravity_score": None,
                "context": "Add extra product details here for better article quality",
                "tags": [],
                "last_updated": "2026-05-13",
            }
        ]
        PRODUCTS_FILE.write_text(json.dumps(sample, ensure_ascii=False, indent=2), encoding="utf-8")
        print("products.json created. Add your products and run again.")
        sys.exit(0)

    raw = json.loads(PRODUCTS_FILE.read_text(encoding="utf-8"))
    return [normalize_product(p) for p in raw]


def main():
    print("=" * 50)
    print("  Affiliate Content Pipeline")
    print("=" * 50)

    products = load_products()
    print(f"\n{len(products)} product(s) found.\n")

    print("--- STEP 1: Content Generation ---")
    saved_paths = batch_generate(products)

    if not saved_paths:
        print("\nNo content generated. Exiting.")
        sys.exit(1)

    print("\n--- STEP 2: GitHub Push ---")
    pushed = push_new_posts(saved_paths)

    print("\n" + "=" * 50)
    print(f"  Pipeline complete: {pushed}/{len(products)} succeeded")
    print("=" * 50)


if __name__ == "__main__":
    main()
