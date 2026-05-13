"""
ClickBank Marketplace API client.
"""

import sys
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.utils.config import (
    CLICKBANK_DEV_API_KEY,
    CLICKBANK_CLERK_API_KEY,
    SHAREASALE_AFFILIATE_ID,
    is_configured,
)

BASE_URL = "https://api.clickbank.com/rest/1.3/"


def get_top_products(category: str = "", limit: int = 10) -> list[dict]:
    """
    Fetch top ClickBank products sorted by gravity.

    Parameters
    ----------
    category : str
        ClickBank marketplace category slug (e.g. "health", "ebusiness").
        Empty string fetches across all categories.
    limit : int
        Maximum number of products to return.

    Returns
    -------
    list[dict]
        Each dict has keys:
        name, affiliate_link, affiliate_network, category, context, gravity_score
    """
    if not is_configured("CLICKBANK_DEV_API_KEY", "CLICKBANK_CLERK_API_KEY"):
        print("[WARN] ClickBank credentials not configured — skipping.")
        return []

    headers = {
        "Authorization": f"{CLICKBANK_DEV_API_KEY}:{CLICKBANK_CLERK_API_KEY}",
        "Accept": "application/json",
    }

    params: dict = {
        "site": "CB",
        "sortField": "GRAVITY",
        "sortOrder": "DESC",
        "resultsPerPage": limit,
    }
    if category:
        params["category"] = category

    url = BASE_URL + "products/list"

    try:
        response = requests.get(url, headers=headers, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
    except Exception as exc:
        print(f"[ERROR] ClickBank API request failed: {exc}")
        return []

    results = []
    products = data.get("products", [])
    for item in products:
        site_info = item.get("site", {})
        stats = item.get("stats", {})

        name = site_info.get("title", "Unknown Product")
        description = site_info.get("description", "")
        gravity = stats.get("gravity", 0)
        vendor = item.get("site", {}).get("site", "")

        # ClickBank hoplink format: {affiliate_id}.{vendor}.hop.clickbank.net
        affiliate_id = SHAREASALE_AFFILIATE_ID or "affiliate"
        affiliate_link = f"https://{affiliate_id}.{vendor}.hop.clickbank.net/?tid=review"

        product_category = category if category else item.get("category", "general")

        results.append({
            "name": name,
            "affiliate_link": affiliate_link,
            "affiliate_network": "clickbank",
            "category": product_category,
            "context": description[:300] if description else "",
            "gravity_score": gravity,
        })

    return results
