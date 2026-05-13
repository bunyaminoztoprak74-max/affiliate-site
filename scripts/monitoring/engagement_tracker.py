"""
Poll social platforms for latest engagement metrics on tracked posts.
"""

import sys
import json
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.monitoring.metrics_logger import log_metric

DATA_DIR = Path(__file__).parent.parent.parent / "data"
SOCIAL_POSTS_FILE = DATA_DIR / "social_posts.json"

LOOKBACK_DAYS = 30


def _load_social_posts() -> list[dict]:
    if not SOCIAL_POSTS_FILE.exists():
        return []
    try:
        data = json.loads(SOCIAL_POSTS_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def _is_recent(posted_at: str, days: int = LOOKBACK_DAYS) -> bool:
    """Return True if posted_at ISO timestamp is within the last N days."""
    try:
        post_date_str = posted_at[:10]  # "YYYY-MM-DD"
        post_date = date.fromisoformat(post_date_str)
        return post_date >= date.today() - timedelta(days=days)
    except (ValueError, TypeError):
        return False


class EngagementTracker:
    """Fetch and log engagement metrics for recent social posts."""

    def __init__(self) -> None:
        self._twitter = None
        self._reddit = None
        self._pinterest = None

        # Twitter
        try:
            from scripts.social.twitter_poster import TwitterPoster
            self._twitter = TwitterPoster()
        except Exception as exc:
            print(f"[WARN] EngagementTracker: Could not load TwitterPoster: {exc}")

        # Reddit
        try:
            from scripts.social.reddit_poster import RedditPoster
            self._reddit = RedditPoster()
        except Exception as exc:
            print(f"[WARN] EngagementTracker: Could not load RedditPoster: {exc}")

        # Pinterest
        try:
            from scripts.social.pinterest_poster import PinterestPoster
            self._pinterest = PinterestPoster()
        except Exception as exc:
            print(f"[WARN] EngagementTracker: Could not load PinterestPoster: {exc}")

    def fetch_all_metrics(self) -> list[dict]:
        """
        Fetch metrics for all recent social posts and log them.

        Only processes posts from the last LOOKBACK_DAYS days.

        Returns
        -------
        list[dict]
            All new metric records logged in this run.
        """
        posts = _load_social_posts()
        recent_posts = [p for p in posts if _is_recent(p.get("posted_at", ""))]

        print(f"  [Tracker] Processing {len(recent_posts)} recent posts (last {LOOKBACK_DAYS} days)...")
        new_records: list[dict] = []

        for post in recent_posts:
            platform = post.get("platform", "")
            product_id = post.get("product_id", "")
            product_name = post.get("product_name", "")
            metrics: dict = {}

            try:
                if platform == "twitter" and self._twitter and getattr(self._twitter, "_enabled", False):
                    tweet_id = post.get("tweet_id", "")
                    if tweet_id:
                        metrics = self._twitter.get_tweet_metrics(tweet_id)
                        post_id = tweet_id

                elif platform == "reddit" and self._reddit and getattr(self._reddit, "_enabled", False):
                    post_id_val = post.get("post_id", "")
                    if post_id_val:
                        metrics = self._reddit.get_post_metrics(post_id_val)
                        post_id = post_id_val

                elif platform == "pinterest" and self._pinterest and getattr(self._pinterest, "_enabled", False):
                    pin_id = post.get("pin_id", "")
                    if pin_id:
                        metrics = self._pinterest.get_pin_metrics(pin_id)
                        post_id = pin_id

                else:
                    continue

                if metrics and product_id:
                    log_metric(
                        product_id=product_id,
                        product_name=product_name,
                        platform=platform,
                        post_id=post_id,
                        metrics=metrics,
                    )
                    record = {
                        "product_id": product_id,
                        "product_name": product_name,
                        "platform": platform,
                        "post_id": post_id,
                        "metrics": metrics,
                    }
                    new_records.append(record)

            except Exception as exc:
                print(f"  [ERROR] Metrics fetch failed for {platform} post {post.get('post_id', post.get('tweet_id', post.get('pin_id', '?')))}: {exc}")

        return new_records

    def run(self) -> None:
        """Fetch all metrics and print a summary."""
        records = self.fetch_all_metrics()
        print(f"  [Tracker] Done. {len(records)} metric record(s) logged.")
