"""
Twitter/X API v2 poster via Tweepy.
"""

import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.utils.config import (
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET,
    TWITTER_BEARER_TOKEN,
    is_configured,
)
from scripts.utils.utm import add_utm

try:
    import tweepy
    _TWEEPY_AVAILABLE = True
except ImportError:
    _TWEEPY_AVAILABLE = False


class TwitterPoster:
    """Post product reviews to Twitter/X and retrieve tweet metrics."""

    def __init__(self) -> None:
        self._enabled = False

        if not _TWEEPY_AVAILABLE:
            print("[WARN] tweepy is not installed — Twitter posting disabled.")
            return

        if not is_configured(
            "TWITTER_API_KEY",
            "TWITTER_API_SECRET",
            "TWITTER_ACCESS_TOKEN",
            "TWITTER_ACCESS_SECRET",
            "TWITTER_BEARER_TOKEN",
        ):
            print("[WARN] Twitter credentials not fully configured — Twitter posting disabled.")
            return

        try:
            self.client = tweepy.Client(
                bearer_token=TWITTER_BEARER_TOKEN,
                consumer_key=TWITTER_API_KEY,
                consumer_secret=TWITTER_API_SECRET,
                access_token=TWITTER_ACCESS_TOKEN,
                access_token_secret=TWITTER_ACCESS_SECRET,
                wait_on_rate_limit=True,
            )
            self._enabled = True
        except Exception as exc:
            print(f"[WARN] Twitter client initialisation failed: {exc}")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _category_hashtag(category: str) -> str:
        """Convert a category slug into a clean CamelCase hashtag."""
        parts = category.replace("-", " ").replace("_", " ").split()
        return "".join(p.capitalize() for p in parts)

    def _build_tweet(
        self,
        product_name: str,
        review_url: str,
        affiliate_link: str,
        rating: int | float,
        summary: str = "",
        category: str = "deals",
    ) -> str:
        hashtag = self._category_hashtag(category)
        utm_affiliate = add_utm(
            affiliate_link,
            source="twitter",
            medium="social",
            campaign="review",
        )

        lines = [f"🔍 {product_name} Review — {rating}/10"]
        if summary:
            lines.append(summary[:100])
        lines.append(f"Read full review: {review_url}")
        lines.append(f"Buy now: {utm_affiliate}")
        lines.append(f"#review #deals #{hashtag}")

        tweet = "\n".join(lines)

        # Truncate to 280 chars if necessary (keep hashtags at end)
        if len(tweet) > 280:
            # Trim summary more aggressively
            if summary:
                allowed_summary = max(0, 100 - (len(tweet) - 280))
                trimmed_summary = summary[:allowed_summary]
                lines[1] = trimmed_summary
                tweet = "\n".join(lines)
        # Hard cap at 280
        return tweet[:280]

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def post_review(
        self,
        product_name: str,
        review_url: str,
        affiliate_link: str,
        rating: int | float,
        summary: str = "",
        category: str = "deals",
    ) -> dict | None:
        """
        Post a product review tweet.

        Parameters
        ----------
        product_name : str
        review_url : str
            Full URL to the review article (with UTM params).
        affiliate_link : str
            Raw affiliate link (UTM params will be added).
        rating : int | float
            Product rating out of 10.
        summary : str
            Short summary sentence (optional, max 100 chars used).
        category : str
            Product category for the hashtag.

        Returns
        -------
        dict | None
            Post record or None on failure.
        """
        if not self._enabled:
            return None

        text = self._build_tweet(
            product_name=product_name,
            review_url=review_url,
            affiliate_link=affiliate_link,
            rating=rating,
            summary=summary,
            category=category,
        )

        try:
            response = self.client.create_tweet(text=text)
            tweet_id = str(response.data["id"])
            posted_at = datetime.now(tz=timezone.utc).isoformat()
            return {
                "platform": "twitter",
                "tweet_id": tweet_id,
                "text": text,
                "url": f"https://twitter.com/user/status/{tweet_id}",
                "posted_at": posted_at,
            }
        except Exception as exc:
            print(f"[ERROR] Twitter post failed: {exc}")
            return None

    def get_tweet_metrics(self, tweet_id: str) -> dict:
        """
        Retrieve public metrics for a tweet.

        Parameters
        ----------
        tweet_id : str

        Returns
        -------
        dict
            {impressions, likes, retweets, replies}
        """
        if not self._enabled:
            return {"impressions": 0, "likes": 0, "retweets": 0, "replies": 0}

        try:
            response = self.client.get_tweet(
                id=tweet_id,
                tweet_fields=["public_metrics"],
            )
            metrics = response.data.public_metrics or {}
            return {
                "impressions": metrics.get("impression_count", 0),
                "likes": metrics.get("like_count", 0),
                "retweets": metrics.get("retweet_count", 0),
                "replies": metrics.get("reply_count", 0),
            }
        except Exception as exc:
            print(f"[ERROR] Twitter metrics fetch failed for {tweet_id}: {exc}")
            return {"impressions": 0, "likes": 0, "retweets": 0, "replies": 0}
