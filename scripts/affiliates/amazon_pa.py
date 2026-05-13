"""
Amazon Product Advertising API 5.0 client with full AWS Signature v4 signing.
"""

import sys
import json
import time
import hmac
import hashlib
from datetime import datetime, timezone
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.utils.config import (
    AMAZON_ACCESS_KEY,
    AMAZON_SECRET_KEY,
    AMAZON_ASSOCIATE_TAG,
    AMAZON_MARKETPLACE,
    is_configured,
)

HOST = "webservices.amazon.com"
REGION = "us-east-1"
SERVICE = "ProductAdvertisingAPI"
ENDPOINT = f"https://{HOST}/paapi5/searchitems"
TARGET = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems"


# ---------------------------------------------------------------------------
# AWS Signature v4 helpers
# ---------------------------------------------------------------------------

def _sign(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()


def _get_signing_key(secret: str, date_stamp: str) -> bytes:
    k_date = _sign(("AWS4" + secret).encode("utf-8"), date_stamp)
    k_region = _sign(k_date, REGION)
    k_service = _sign(k_region, SERVICE)
    k_signing = _sign(k_service, "aws4_request")
    return k_signing


def _sha256_hex(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def _build_auth_header(payload_json: str) -> dict:
    """Build Authorization and required headers for a PA API 5.0 POST request."""
    now = datetime.now(tz=timezone.utc)
    amz_date = now.strftime("%Y%m%dT%H%M%SZ")
    date_stamp = now.strftime("%Y%m%d")

    canonical_headers = (
        "content-encoding:amz-1.0\n"
        "content-type:application/json; charset=utf-8\n"
        f"host:{HOST}\n"
        f"x-amz-date:{amz_date}\n"
        f"x-amz-target:{TARGET}\n"
    )
    signed_headers = "content-encoding;content-type;host;x-amz-date;x-amz-target"

    payload_hash = _sha256_hex(payload_json)

    canonical_request = "\n".join([
        "POST",
        "/paapi5/searchitems",
        "",  # no query string
        canonical_headers,
        signed_headers,
        payload_hash,
    ])

    credential_scope = f"{date_stamp}/{REGION}/{SERVICE}/aws4_request"
    string_to_sign = "\n".join([
        "AWS4-HMAC-SHA256",
        amz_date,
        credential_scope,
        _sha256_hex(canonical_request),
    ])

    signing_key = _get_signing_key(AMAZON_SECRET_KEY, date_stamp)
    signature = hmac.new(signing_key, string_to_sign.encode("utf-8"), hashlib.sha256).hexdigest()

    authorization = (
        f"AWS4-HMAC-SHA256 Credential={AMAZON_ACCESS_KEY}/{credential_scope}, "
        f"SignedHeaders={signed_headers}, "
        f"Signature={signature}"
    )

    return {
        "content-encoding": "amz-1.0",
        "content-type": "application/json; charset=utf-8",
        "host": HOST,
        "x-amz-date": amz_date,
        "x-amz-target": TARGET,
        "Authorization": authorization,
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def search_items(
    keywords: str,
    search_index: str = "All",
    item_count: int = 5,
) -> list[dict]:
    """
    Search for products via Amazon PA API 5.0.

    Returns a list of dicts with keys:
        name, asin, price, context, affiliate_link, affiliate_network, category
    """
    if not is_configured("AMAZON_ACCESS_KEY", "AMAZON_SECRET_KEY", "AMAZON_ASSOCIATE_TAG"):
        print("[WARN] Amazon PA API credentials not configured — skipping.")
        return []

    payload = {
        "Keywords": keywords,
        "SearchIndex": search_index,
        "ItemCount": item_count,
        "PartnerTag": AMAZON_ASSOCIATE_TAG,
        "PartnerType": "Associates",
        "Marketplace": AMAZON_MARKETPLACE,
        "Resources": [
            "ItemInfo.Title",
            "ItemInfo.Features",
            "Offers.Listings.Price",
        ],
    }
    payload_json = json.dumps(payload)

    headers = _build_auth_header(payload_json)

    try:
        response = requests.post(ENDPOINT, headers=headers, data=payload_json, timeout=15)
        response.raise_for_status()
        data = response.json()
    except Exception as exc:
        print(f"[ERROR] Amazon API request failed: {exc}")
        return []

    results = []
    items = data.get("SearchResult", {}).get("Items", [])
    for item in items:
        asin = item.get("ASIN", "")
        title = item.get("ItemInfo", {}).get("Title", {}).get("DisplayValue", keywords)
        features = item.get("ItemInfo", {}).get("Features", {}).get("DisplayValues", [])
        context = " ".join(features[:3]) if features else ""

        listings = (
            item.get("Offers", {})
            .get("Listings", [{}])
        )
        price = ""
        if listings:
            price_info = listings[0].get("Price", {})
            price = price_info.get("DisplayAmount", "")

        affiliate_link = f"https://www.amazon.com/dp/{asin}?tag={AMAZON_ASSOCIATE_TAG}"

        results.append({
            "name": title,
            "asin": asin,
            "price": price,
            "context": context,
            "affiliate_link": affiliate_link,
            "affiliate_network": "amazon",
            "category": search_index.lower() if search_index != "All" else "general",
        })

    return results


def get_trending_products(categories: list[str]) -> list[dict]:
    """
    Iterate over category list and search Amazon for trending products in each.

    Parameters
    ----------
    categories : list[str]
        Category keywords to search (e.g. ["electronics", "fitness equipment"]).

    Returns
    -------
    list[dict]
        Aggregated list of product dicts from all categories.
    """
    if not is_configured("AMAZON_ACCESS_KEY", "AMAZON_SECRET_KEY", "AMAZON_ASSOCIATE_TAG"):
        print("[WARN] Amazon PA API credentials not configured — skipping.")
        return []

    all_products: list[dict] = []
    for i, category in enumerate(categories):
        print(f"  [Amazon] Searching: {category}")
        products = search_items(keywords=category, search_index="All", item_count=5)
        # Tag each result with the queried category
        for p in products:
            if p["category"] == "general":
                p["category"] = category.lower().replace(" ", "-")
        all_products.extend(products)
        if i < len(categories) - 1:
            time.sleep(1)

    return all_products
