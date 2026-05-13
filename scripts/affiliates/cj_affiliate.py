"""
CJ Affiliate and ShareASale product search clients.
"""

import sys
import time
import hmac
import hashlib
import xml.etree.ElementTree as ET
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.utils.config import (
    CJ_API_TOKEN,
    CJ_WEBSITE_ID,
    SHAREASALE_API_TOKEN,
    SHAREASALE_API_SECRET,
    SHAREASALE_AFFILIATE_ID,
    is_configured,
)

# ---------------------------------------------------------------------------
# CJ Affiliate
# ---------------------------------------------------------------------------

CJ_PRODUCT_SEARCH_URL = "https://product-search.api.cj.com/v2/product-search"


def search_cj_products(
    keywords: str,
    advertiser_ids: str = "",
    limit: int = 10,
) -> list[dict]:
    """
    Search CJ Affiliate product catalog.

    Parameters
    ----------
    keywords : str
        Search keywords.
    advertiser_ids : str
        Comma-separated CJ advertiser IDs to restrict search (optional).
    limit : int
        Max results to return.

    Returns
    -------
    list[dict]
        Each dict: {name, affiliate_link, affiliate_network, category, price, context}
    """
    if not is_configured("CJ_API_TOKEN", "CJ_WEBSITE_ID"):
        print("[WARN] CJ Affiliate credentials not configured — skipping.")
        return []

    headers = {
        "Authorization": f"Bearer {CJ_API_TOKEN}",
        "Accept": "application/json",
    }

    params: dict = {
        "website-id": CJ_WEBSITE_ID,
        "keywords": keywords,
        "records-per-page": limit,
    }
    if advertiser_ids:
        params["advertiser-ids"] = advertiser_ids

    try:
        response = requests.get(
            CJ_PRODUCT_SEARCH_URL,
            headers=headers,
            params=params,
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
    except Exception as exc:
        print(f"[ERROR] CJ Affiliate API request failed: {exc}")
        return []

    results = []
    products = data.get("products", {}).get("product", [])
    # API can return a single dict when there is only one result
    if isinstance(products, dict):
        products = [products]

    for item in products:
        name = item.get("name", "")
        buy_url = item.get("buy-url", "")
        description = item.get("description", "")
        price = item.get("price", "")
        category = item.get("category-name", "general")

        results.append({
            "name": name,
            "affiliate_link": buy_url,
            "affiliate_network": "cj",
            "category": category.lower().replace(" ", "-") if category else "general",
            "price": str(price),
            "context": description[:300] if description else "",
        })

    return results


# ---------------------------------------------------------------------------
# ShareASale
# ---------------------------------------------------------------------------

SHAREASALE_BASE_URL = "https://shareasale.com/x.cfm"


def _shareasale_auth_headers(action: str) -> dict:
    """Generate ShareASale HMAC-SHA256 auth headers for the given API action."""
    timestamp = str(int(time.time()))
    sig_raw = f"{SHAREASALE_API_TOKEN}:{timestamp}:{action}"
    signature = hmac.new(
        SHAREASALE_API_SECRET.encode("utf-8"),
        sig_raw.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    return {
        "x-ShareASale-Date": timestamp,
        "x-ShareASale-Authentication": signature,
    }


def search_shareasale_products(
    keywords: str,
    limit: int = 10,
) -> list[dict]:
    """
    Search ShareASale product datafeed.

    Parameters
    ----------
    keywords : str
        Search keywords.
    limit : int
        Max results to return.

    Returns
    -------
    list[dict]
        Each dict: {name, affiliate_link, affiliate_network, category, price, context}
    """
    if not is_configured(
        "SHAREASALE_API_TOKEN",
        "SHAREASALE_API_SECRET",
        "SHAREASALE_AFFILIATE_ID",
    ):
        print("[WARN] ShareASale credentials not configured — skipping.")
        return []

    action = "getProducts"
    headers = _shareasale_auth_headers(action)

    params = {
        "action": action,
        "Token": SHAREASALE_API_TOKEN,
        "version": "2.8",
        "affiliateId": SHAREASALE_AFFILIATE_ID,
        "keywords": keywords,
        "XMLFormat": "1",
        "limit": limit,
    }

    try:
        response = requests.get(
            SHAREASALE_BASE_URL,
            headers=headers,
            params=params,
            timeout=15,
        )
        response.raise_for_status()
        xml_text = response.text
    except Exception as exc:
        print(f"[ERROR] ShareASale API request failed: {exc}")
        return []

    results = []
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as exc:
        print(f"[ERROR] ShareASale XML parse error: {exc}")
        return []

    # ShareASale XML structure: <products><product>...</product></products>
    for product_el in root.findall(".//product"):
        def _text(tag: str) -> str:
            el = product_el.find(tag)
            return el.text.strip() if el is not None and el.text else ""

        name = _text("productname") or _text("name")
        affiliate_link = _text("linkurl") or _text("url")
        description = _text("description") or _text("shortdescription")
        price = _text("price") or _text("retailprice")
        category = _text("category")

        results.append({
            "name": name,
            "affiliate_link": affiliate_link,
            "affiliate_network": "shareasale",
            "category": category.lower().replace(" ", "-") if category else "general",
            "price": price,
            "context": description[:300] if description else "",
        })

    return results[:limit]


# ---------------------------------------------------------------------------
# Combined
# ---------------------------------------------------------------------------

def get_all_products(keywords: str) -> list[dict]:
    """
    Query both CJ Affiliate and ShareASale, return combined results.

    Parameters
    ----------
    keywords : str
        Search keywords.

    Returns
    -------
    list[dict]
        Combined product list from both networks.
    """
    cj_results = search_cj_products(keywords)
    shareasale_results = search_shareasale_products(keywords)
    return cj_results + shareasale_results
