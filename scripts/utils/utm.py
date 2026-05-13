"""
UTM parameter helpers for affiliate marketing links.
"""

import sys
from pathlib import Path
from urllib.parse import urlparse, urlunparse, urlencode, parse_qs

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.utils.config import SITE_BASE_URL


def add_utm(
    url: str,
    source: str,
    medium: str,
    campaign: str,
    content: str = "",
) -> str:
    """
    Append UTM parameters to any URL, preserving existing query parameters.

    Parameters
    ----------
    url : str
        The destination URL (affiliate link or review page URL).
    source : str
        utm_source value (e.g. "twitter", "reddit").
    medium : str
        utm_medium value (e.g. "social", "email").
    campaign : str
        utm_campaign value (e.g. "review", "promo").
    content : str, optional
        utm_content value (e.g. subreddit name). Empty string is omitted.

    Returns
    -------
    str
        URL with UTM parameters appended.
    """
    parsed = urlparse(url)
    existing_params = parse_qs(parsed.query, keep_blank_values=True)

    utm_params: dict[str, str] = {
        "utm_source": source,
        "utm_medium": medium,
        "utm_campaign": campaign,
    }
    if content:
        utm_params["utm_content"] = content

    # Merge: UTM params override existing ones with the same key
    merged: dict[str, list[str]] = {**existing_params}
    for k, v in utm_params.items():
        merged[k] = [v]

    # Flatten back to single-value dict for urlencode
    flat = {k: v[0] for k, v in merged.items()}
    new_query = urlencode(flat)

    new_parsed = parsed._replace(query=new_query)
    return urlunparse(new_parsed)


def make_review_url(
    slug: str,
    source: str,
    medium: str,
    campaign: str = "review",
) -> str:
    """
    Build a full review page URL with UTM parameters.

    Parameters
    ----------
    slug : str
        The article slug (e.g. "logitech-mx-master-3s").
    source : str
        utm_source value.
    medium : str
        utm_medium value.
    campaign : str
        utm_campaign value (default "review").

    Returns
    -------
    str
        Full URL: {SITE_BASE_URL}/reviews/{slug}/ with UTM params.
    """
    base = SITE_BASE_URL.rstrip("/")
    review_url = f"{base}/reviews/{slug}/"
    return add_utm(review_url, source=source, medium=medium, campaign=campaign)
