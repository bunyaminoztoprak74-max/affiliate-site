#!/usr/bin/env python3
"""Morning pipeline: research trending products, update products.json, push to GitHub."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.affiliates.product_researcher import run as research_products
from scripts.push_to_github import push_file, get_repo

PRODUCTS_FILE = Path(__file__).parent.parent.parent / "products.json"


def main():
    print("=== MORNING RESEARCH ===")
    new_count = research_products()
    if new_count > 0:
        print(f"[OK] {new_count} new products added. Pushing products.json...")
        repo = get_repo()
        push_file(repo, PRODUCTS_FILE, commit_message=f"chore: update products.json with {new_count} new products")
    else:
        print("[INFO] No new products found.")


if __name__ == "__main__":
    main()
