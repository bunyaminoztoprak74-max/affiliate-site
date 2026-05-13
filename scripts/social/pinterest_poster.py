"""
Pinterest API v5 poster.
"""

import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.utils.config import (
    PINTEREST_ACCESS_TOKEN,
    PINTEREST_AD_ACCOUNT_ID,
    is_configured,
)
from scripts.utils.utm import add_utm

PINTEREST_API_BASE = "https://api.pinterest.com/v5"

DEFAULT_PRODUCT_IMAGE = (
    "https://via.placeholder.com/600x900/1a1a2e/e94560?text=Review"
)


class PinterestPoster:
    """Create pins for product reviews on Pinterest and retrieve pin metrics."""

    def __init__(self) -> None:
        self._enabled = False

        if not is_configured("PINTEREST_ACCESS_TOKEN", "PINTEREST_AD_ACCOUNT_ID"):
            print("[WARN] Pinterest credentials not configured — Pinterest posting disabled.")
            return

        self._headers = {
            "Authorization": f"Bearer {PINTEREST_ACCESS_TOKEN}",
            "Content-Type": "application/json",
        }
        self._enabled = True

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _build_description(product_name: str, description: str = "") -> str:
        """Build an SEO-friendly pin description."""
        base = description.strip() if description else f"Honest {product_name} review with pros, cons, and verdict."
        hashtags = (
            f"#{product_name.replace(' ', '')} #Review #Deals #BuyGuide #ProductReview"
        )
        return f"{base}\n\n{hashtags}"

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def create_pin(
        self,
        product_name: str,
        review_url: str,
        affiliate_link: str,
        image_url: str = "",
        description: str = "",
    ) -> dict | None:
        """
        Create a Pinterest pin for a product review.

        Parameters
        ----------
        product_name : str
        review_url : str
            Full review article URL (UTM params added internally).
        affiliate_link : str
            Raw affiliate link (not used in pin body to comply with Pinterest TOS,
            the review URL is the primary link).
        image_url : str
            Image URL for the pin. Uses DEFAULT_PRODUCT_IMAGE if empty.
        description : str
            Pin description / SEO text. Auto-generated if empty.

        Returns
        -------
        dict | None
            Pin record or None on failure.
        """
        if not self._enabled:
            return None

        utm_review_url = add_utm(
            review_url,
            source="pinterest",
            medium="social",
            campaign="review",
        )

        pin_image_url = image_url if image_url else DEFAULT_PRODUCT_IMAGE
        pin_description = self._build_description(product_name, description)

        payload = {
            "title": f"{product_name} — Full Review",
            "description": pin_description,
            "link": utm_review_url,
            "alt_text": f"{product_name} product review",
            "board_id": PINTEREST_AD_ACCOUNT_ID,
            "media_source": {
                "source_type": "image_url",
                "url": pin_image_url,
            },
        }

        try:
            response = requests.post(
                f"{PINTEREST_API_BASE}/pins",
                headers=self._headers,
                json=payload,
                timeout=15,
            )
            response.raise_for_status()
            data = response.json()
            pin_id = data.get("id", "")
            posted_at = datetime.now(tz=timezone.utc).isoformat()
            return {
                "platform": "pinterest",
                "pin_id": pin_id,
                "url": f"https://www.pinterest.com/pin/{pin_id}/",
                "posted_at": posted_at,
            }
        except Exception as exc:
            print(f"[ERROR] Pinterest pin creation failed: {exc}")
            return None

    def get_pin_metrics(self, pin_id: str) -> dict:
        """
        Fetch analytics for a Pinterest pin.

        Parameters
        ----------
        pin_id : str

        Returns
        -------
        dict
            {impressions, saves, clicks}
        """
        if not self._enabled:
            return {"impressions": 0, "saves": 0, "clicks": 0}

        params: dict = {
            "ad_account_id": PINTEREST_AD_ACCOUNT_ID,
            "pin_metrics": "true",
        }

        try:
            response = requests.get(
                f"{PINTEREST_API_BASE}/pins/{pin_id}",
                headers=self._headers,
                params=params,
                timeout=15,
            )
            response.raise_for_status()
            data = response.json()
            metrics = data.get("pin_metrics", {})
            # Flatten lifetime metrics
            lifetime = metrics.get("lifetime_metrics", metrics)
            return {
                "impressions": lifetime.get("impression", 0),
                "saves": lifetime.get("save", 0),
                "clicks": lifetime.get("outbound_click", 0),
            }
        except Exception as exc:
            print(f"[ERROR] Pinterest metrics fetch failed for {pin_id}: {exc}")
            return {"impressions": 0, "saves": 0, "clicks": 0}
