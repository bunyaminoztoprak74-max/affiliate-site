#!/usr/bin/env python3
"""Evening pipeline: post new articles to social media, track initial metrics."""

import sys
import json
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.social.social_manager import SocialManager
from scripts.monitoring.engagement_tracker import EngagementTracker

PRODUCTS_FILE = Path(__file__).parent.parent.parent / "products.json"
SITE_DIR = Path(__file__).parent.parent.parent / "site"
DATA_DIR = Path(__file__).parent.parent.parent / "data"


def main():
    print("=== EVENING SOCIAL ===")
    products = json.loads(PRODUCTS_FILE.read_text())
    content_dir = SITE_DIR / "content" / "reviews"

    manager = SocialManager()
    today = date.today().isoformat()

    # Post today's new articles
    today_articles = list(content_dir.glob(f"{today}-*.md")) if content_dir.exists() else []
    if not today_articles:
        print("[INFO] No articles from today to post.")
    else:
        posted = manager.post_all_new(products, content_dir)
        print(f"[OK] Posted {posted} products to social media.")

    # Push updated social_posts.json and metrics.json to GitHub
    from scripts.push_to_github import push_file, get_repo
    repo = get_repo()
    for data_file in [DATA_DIR / "social_posts.json", DATA_DIR / "metrics.json"]:
        if data_file.exists():
            push_file(repo, data_file, commit_message=f"data: update {data_file.name}")

    # Track engagement on recent posts
    print("[INFO] Tracking engagement on recent posts...")
    tracker = EngagementTracker()
    tracker.run()


if __name__ == "__main__":
    main()
