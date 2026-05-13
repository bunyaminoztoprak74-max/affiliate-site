"""
Orchestrator that queries all affiliate networks, deduplicates results,
and updates products.json with new product data.
"""

import sys
import json
from datetime import date
from pathlib import Path

from slugify import slugify

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.affiliates.amazon_pa import get_trending_products as amazon_trending
from scripts.affiliates.clickbank import get_top_products as clickbank_top
from scripts.affiliates.cj_affiliate import get_all_products as cj_all_products

PRODUCTS_FILE = Path(__file__).parent.parent.parent / "products.json"

DEFAULT_CATEGORIES = [
    "electronics",
    "home appliances",
    "fitness equipment",
    "software tools",
    "beauty",
]


def _normalize(product: dict) -> dict:
    """Ensure a product dict conforms to the unified schema."""
    name = product.get("name", "")
    return {
        "id": slugify(name),
        "name": name,
        "category": product.get("category", "general"),
        "affiliate_network": product.get("affiliate_network", "unknown"),
        "affiliate_link": product.get("affiliate_link", product.get("link", "")),
        "asin": product.get("asin", ""),
        "price": product.get("price", ""),
        "gravity_score": product.get("gravity_score", None),
        "context": product.get("context", ""),
        "tags": product.get("tags", []),
        "last_updated": date.today().isoformat(),
        "type": product.get("type", "reviews"),
    }


def research_trending(categories: list[str] | None = None) -> list[dict]:
    """
    Query all enabled affiliate networks for trending products.

    Deduplicates by product name (case-insensitive). Adds today's date
    as last_updated.

    Parameters
    ----------
    categories : list[str] | None
        Category list to search. Uses DEFAULT_CATEGORIES if None.

    Returns
    -------
    list[dict]
        Unified, deduplicated product list.
    """
    if categories is None:
        categories = DEFAULT_CATEGORIES

    all_products: list[dict] = []

    # Amazon PA API
    print("  [Research] Querying Amazon PA API...")
    try:
        amazon_products = amazon_trending(categories)
        all_products.extend(amazon_products)
        print(f"    Amazon: {len(amazon_products)} products found.")
    except Exception as exc:
        print(f"    [WARN] Amazon search failed: {exc}")

    # ClickBank
    print("  [Research] Querying ClickBank...")
    try:
        for cat in categories:
            cb_products = clickbank_top(category=cat, limit=5)
            all_products.extend(cb_products)
        print(f"    ClickBank: raw products collected.")
    except Exception as exc:
        print(f"    [WARN] ClickBank search failed: {exc}")

    # CJ Affiliate + ShareASale
    print("  [Research] Querying CJ Affiliate + ShareASale...")
    try:
        for cat in categories:
            combo_products = cj_all_products(keywords=cat)
            all_products.extend(combo_products)
        print(f"    CJ+ShareASale: raw products collected.")
    except Exception as exc:
        print(f"    [WARN] CJ/ShareASale search failed: {exc}")

    # Normalize
    normalized = [_normalize(p) for p in all_products if p.get("name")]

    # Deduplicate by name (case-insensitive), keeping the first occurrence
    seen: set[str] = set()
    unique: list[dict] = []
    for p in normalized:
        key = p["name"].lower().strip()
        if key not in seen:
            seen.add(key)
            unique.append(p)

    print(f"  [Research] Total unique products after dedup: {len(unique)}")
    return unique


def update_products_json(new_products: list[dict]) -> int:
    """
    Merge new products into products.json.

    Existing entries are matched by 'id'. Existing entries are updated in place;
    new products are appended. Backwards-compatible with the old plain-list format.

    Parameters
    ----------
    new_products : list[dict]
        Products returned by research_trending().

    Returns
    -------
    int
        Number of genuinely new products added (not updates).
    """
    existing: list[dict] = []
    if PRODUCTS_FILE.exists():
        try:
            existing = json.loads(PRODUCTS_FILE.read_text(encoding="utf-8"))
            if not isinstance(existing, list):
                existing = []
        except (json.JSONDecodeError, OSError):
            existing = []

    # Migrate old entries that lack an 'id' field
    for entry in existing:
        if "id" not in entry:
            entry["id"] = slugify(entry.get("name", entry.get("product_name", "")))

    existing_by_id: dict[str, int] = {p["id"]: i for i, p in enumerate(existing)}
    new_count = 0

    for product in new_products:
        pid = product["id"]
        if pid in existing_by_id:
            # Update existing entry (preserve fields not present in new data)
            idx = existing_by_id[pid]
            existing[idx].update(product)
        else:
            existing.append(product)
            existing_by_id[pid] = len(existing) - 1
            new_count += 1

    PRODUCTS_FILE.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return new_count


def run(categories: list[str] | None = None) -> int:
    """
    Full research pipeline: discover products, merge into products.json.

    Parameters
    ----------
    categories : list[str] | None
        Categories to research. Defaults to DEFAULT_CATEGORIES.

    Returns
    -------
    int
        Number of new products added to products.json.
    """
    if categories is None:
        categories = DEFAULT_CATEGORIES

    print(f"[Research] Starting product research for {len(categories)} categories...")
    products = research_trending(categories)
    new_count = update_products_json(products)

    print(f"[Research] Done. {new_count} new products added to products.json.")
    return new_count
