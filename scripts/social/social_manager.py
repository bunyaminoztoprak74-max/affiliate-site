"""
Orchestrator for all social media platforms.
Loads/saves data/social_posts.json.
"""

import sys
import json
from datetime import datetime, timezone
from pathlib import Path

import yaml
from slugify import slugify

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.utils.utm import make_review_url

DATA_DIR = Path(__file__).parent.parent.parent / "data"
SOCIAL_POSTS_FILE = DATA_DIR / "social_posts.json"


def _load_social_posts() -> list[dict]:
    """Load social_posts.json, returning an empty list if missing/corrupt."""
    if not SOCIAL_POSTS_FILE.exists():
        return []
    try:
        return json.loads(SOCIAL_POSTS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _save_social_posts(posts: list[dict]) -> None:
    """Persist social_posts.json."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SOCIAL_POSTS_FILE.write_text(
        json.dumps(posts, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def _parse_front_matter(article_path: Path) -> dict:
    """
    Parse YAML front matter from a Hugo Markdown file.

    Returns an empty dict if the file has no front matter or cannot be parsed.
    """
    try:
        text = article_path.read_text(encoding="utf-8")
    except OSError:
        return {}

    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}

    end = None
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            end = i
            break

    if end is None:
        return {}

    yaml_block = "\n".join(lines[1:end])
    try:
        return yaml.safe_load(yaml_block) or {}
    except yaml.YAMLError:
        return {}


class SocialManager:
    """Coordinate posting across Twitter, Reddit, and Pinterest."""

    def __init__(self) -> None:
        self._posters: dict = {}

        # Twitter
        try:
            from scripts.social.twitter_poster import TwitterPoster
            self._posters["twitter"] = TwitterPoster()
        except Exception as exc:
            print(f"[WARN] Could not initialise TwitterPoster: {exc}")

        # Reddit
        try:
            from scripts.social.reddit_poster import RedditPoster
            self._posters["reddit"] = RedditPoster()
        except Exception as exc:
            print(f"[WARN] Could not initialise RedditPoster: {exc}")

        # Pinterest
        try:
            from scripts.social.pinterest_poster import PinterestPoster
            self._posters["pinterest"] = PinterestPoster()
        except Exception as exc:
            print(f"[WARN] Could not initialise PinterestPoster: {exc}")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _find_article(self, product: dict, content_dir: Path) -> Path | None:
        """Locate the Markdown article file for a given product."""
        name = product.get("name", product.get("product_name", ""))
        slug = slugify(name)
        matches = list(content_dir.glob(f"*{slug}*.md"))
        return matches[0] if matches else None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def already_posted(self, product_id: str) -> bool:
        """Return True if this product already has at least one social post record."""
        posts = _load_social_posts()
        return any(p.get("product_id") == product_id for p in posts)

    def post_product_review(
        self,
        product: dict,
        article_path: Path,
    ) -> list[dict]:
        """
        Post a product review to all enabled social platforms.

        Skips posting if this product_id has already been posted.

        Parameters
        ----------
        product : dict
            Product record from products.json.
        article_path : Path
            Path to the Hugo Markdown article.

        Returns
        -------
        list[dict]
            Post records for all successful posts.
        """
        product_id = product.get("id", slugify(product.get("name", "")))

        if self.already_posted(product_id):
            print(f"  [Social] Skipping {product_id} — already posted.")
            return []

        front_matter = _parse_front_matter(article_path)

        product_name = front_matter.get("product_name") or product.get("name", "")
        category = front_matter.get("categories") or product.get("category", "general")
        affiliate_link = front_matter.get("affiliate_link") or product.get("affiliate_link", "")
        rating = front_matter.get("rating", 8)
        meta_description = front_matter.get("meta_description", "")

        # Build the review URL
        slug = slugify(product_name)
        review_url_base = make_review_url(slug, source="social", medium="social")

        # We'll pass a platform-neutral base URL; each poster adds its own UTM
        # Actually pass the slug so each poster can build UTM-specific URLs
        from scripts.utils.config import SITE_BASE_URL
        base_review_url = f"{SITE_BASE_URL.rstrip('/')}/reviews/{slug}/"

        all_results: list[dict] = []

        # Twitter
        twitter = self._posters.get("twitter")
        if twitter and getattr(twitter, "_enabled", False):
            try:
                from scripts.utils.utm import add_utm
                tw_review_url = add_utm(
                    base_review_url, source="twitter", medium="social", campaign="review"
                )
                result = twitter.post_review(
                    product_name=product_name,
                    review_url=tw_review_url,
                    affiliate_link=affiliate_link,
                    rating=rating,
                    summary=meta_description,
                    category=str(category),
                )
                if result:
                    result["product_id"] = product_id
                    result["product_name"] = product_name
                    all_results.append(result)
            except Exception as exc:
                print(f"  [ERROR] Twitter post failed for {product_name}: {exc}")

        # Reddit
        reddit = self._posters.get("reddit")
        if reddit and getattr(reddit, "_enabled", False):
            try:
                from scripts.utils.utm import add_utm
                rd_review_url = add_utm(
                    base_review_url, source="reddit", medium="social", campaign="review"
                )
                results = reddit.post_review(
                    product_name=product_name,
                    review_url=rd_review_url,
                    affiliate_link=affiliate_link,
                    category=str(category),
                    summary=meta_description,
                )
                for r in results:
                    r["product_id"] = product_id
                    r["product_name"] = product_name
                all_results.extend(results)
            except Exception as exc:
                print(f"  [ERROR] Reddit post failed for {product_name}: {exc}")

        # Pinterest
        pinterest = self._posters.get("pinterest")
        if pinterest and getattr(pinterest, "_enabled", False):
            try:
                from scripts.utils.utm import add_utm
                pt_review_url = add_utm(
                    base_review_url, source="pinterest", medium="social", campaign="review"
                )
                result = pinterest.create_pin(
                    product_name=product_name,
                    review_url=pt_review_url,
                    affiliate_link=affiliate_link,
                    description=meta_description,
                )
                if result:
                    result["product_id"] = product_id
                    result["product_name"] = product_name
                    all_results.append(result)
            except Exception as exc:
                print(f"  [ERROR] Pinterest post failed for {product_name}: {exc}")

        if all_results:
            existing_posts = _load_social_posts()
            existing_posts.extend(all_results)
            _save_social_posts(existing_posts)
            print(f"  [Social] {len(all_results)} post(s) saved for {product_name}.")

        return all_results

    def post_all_new(
        self,
        products: list[dict],
        content_dir: Path,
    ) -> int:
        """
        Post all products that have articles today and haven't been posted yet.

        Parameters
        ----------
        products : list[dict]
            Product list from products.json.
        content_dir : Path
            Directory containing Hugo Markdown articles.

        Returns
        -------
        int
            Number of products successfully posted.
        """
        posted_count = 0
        for product in products:
            article_path = self._find_article(product, content_dir)
            if article_path is None:
                continue
            results = self.post_product_review(product, article_path)
            if results:
                posted_count += 1
        return posted_count
