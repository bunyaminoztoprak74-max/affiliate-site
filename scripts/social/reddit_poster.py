"""
Reddit poster via PRAW — posts review threads to relevant subreddits.
"""

import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.utils.config import (
    REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET,
    REDDIT_USERNAME,
    REDDIT_PASSWORD,
    is_configured,
)
from scripts.utils.utm import add_utm

try:
    import praw
    _PRAW_AVAILABLE = True
except ImportError:
    _PRAW_AVAILABLE = False

# ---------------------------------------------------------------------------
# Subreddit mapping
# ---------------------------------------------------------------------------

SUBREDDIT_MAP: dict[str, list[str]] = {
    "electronics": ["electronics", "gadgets", "deals"],
    "smartphones": ["Android", "smartphones", "deals"],
    "computer-accessories": ["MechanicalKeyboards", "buildapc", "deals"],
    "fitness-equipment": ["homegym", "fitness", "deals"],
    "home-appliances": ["homeautomation", "homeimprovement", "deals"],
    "software-tools": ["software", "productivity", "deals"],
    "beauty": ["SkincareAddiction", "beauty", "deals"],
    "default": ["deals", "buyitforlife"],
}


class RedditPoster:
    """Post product review threads to Reddit and retrieve post metrics."""

    def __init__(self) -> None:
        self._enabled = False

        if not _PRAW_AVAILABLE:
            print("[WARN] praw is not installed — Reddit posting disabled.")
            return

        if not is_configured(
            "REDDIT_CLIENT_ID",
            "REDDIT_CLIENT_SECRET",
            "REDDIT_USERNAME",
            "REDDIT_PASSWORD",
        ):
            print("[WARN] Reddit credentials not fully configured — Reddit posting disabled.")
            return

        try:
            self.reddit = praw.Reddit(
                client_id=REDDIT_CLIENT_ID,
                client_secret=REDDIT_CLIENT_SECRET,
                username=REDDIT_USERNAME,
                password=REDDIT_PASSWORD,
                user_agent=f"AffiliatePoster/1.0 by u/{REDDIT_USERNAME}",
            )
            self._enabled = True
        except Exception as exc:
            print(f"[WARN] Reddit client initialisation failed: {exc}")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _get_subreddits(self, category: str) -> list[str]:
        """Return up to 2 subreddit names for the given category."""
        key = category.lower().replace(" ", "-")
        subreddits = SUBREDDIT_MAP.get(key, SUBREDDIT_MAP["default"])
        return subreddits[:2]

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def post_review(
        self,
        product_name: str,
        review_url: str,
        affiliate_link: str,
        category: str,
        summary: str = "",
    ) -> list[dict]:
        """
        Post a self-text review thread to up to 2 relevant subreddits.

        Parameters
        ----------
        product_name : str
        review_url : str
            Full URL to the review article.
        affiliate_link : str
            Raw affiliate link (UTM params will be added per subreddit).
        category : str
            Product category slug.
        summary : str
            Brief summary for the post body (optional).

        Returns
        -------
        list[dict]
            One record per successful post.
        """
        if not self._enabled:
            return []

        subreddits = self._get_subreddits(category)
        results: list[dict] = []

        title = f"{product_name} Review — Honest Take After 2 Weeks"

        for subreddit_name in subreddits:
            utm_affiliate = add_utm(
                affiliate_link,
                source="reddit",
                medium="social",
                campaign="review",
                content=subreddit_name,
            )

            body_parts = []
            if summary:
                body_parts.append(summary)
            body_parts.append(f"\nFull review with pros/cons: {review_url}\n")
            body_parts.append(f"*Affiliate link: {utm_affiliate}*\n")
            body_parts.append("*I may earn a small commission at no extra cost to you.*")
            body = "\n".join(body_parts)

            try:
                subreddit = self.reddit.subreddit(subreddit_name)
                submission = subreddit.submit(
                    title=title,
                    selftext=body,
                    flair_id=None,
                )
                posted_at = datetime.now(tz=timezone.utc).isoformat()
                results.append({
                    "platform": "reddit",
                    "post_id": submission.id,
                    "subreddit": subreddit_name,
                    "title": title,
                    "url": f"https://www.reddit.com{submission.permalink}",
                    "posted_at": posted_at,
                })
                print(f"  [Reddit] Posted to r/{subreddit_name}: {submission.id}")
            except Exception as exc:
                print(f"  [ERROR] Reddit post to r/{subreddit_name} failed: {exc}")

        return results

    def get_post_metrics(self, post_id: str) -> dict:
        """
        Fetch engagement metrics for a Reddit submission.

        Parameters
        ----------
        post_id : str
            Reddit submission ID (e.g. "abc123").

        Returns
        -------
        dict
            {score, upvote_ratio, num_comments, created_utc}
        """
        if not self._enabled:
            return {"score": 0, "upvote_ratio": 0.0, "num_comments": 0, "created_utc": 0}

        try:
            submission = self.reddit.submission(id=post_id)
            return {
                "score": submission.score,
                "upvote_ratio": submission.upvote_ratio,
                "num_comments": submission.num_comments,
                "created_utc": int(submission.created_utc),
            }
        except Exception as exc:
            print(f"[ERROR] Reddit metrics fetch failed for {post_id}: {exc}")
            return {"score": 0, "upvote_ratio": 0.0, "num_comments": 0, "created_utc": 0}
