"""
Weekly performance report generator and product score updater.
"""

import sys
import json
from collections import defaultdict
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.monitoring.metrics_logger import get_metrics_summary, load_metrics

DATA_DIR = Path(__file__).parent.parent.parent / "data"
SOCIAL_POSTS_FILE = DATA_DIR / "social_posts.json"
PRODUCTS_FILE = Path(__file__).parent.parent.parent / "products.json"
REPORTS_DIR = DATA_DIR / "reports"


def _load_social_posts() -> list[dict]:
    if not SOCIAL_POSTS_FILE.exists():
        return []
    try:
        data = json.loads(SOCIAL_POSTS_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def _load_products() -> list[dict]:
    if not PRODUCTS_FILE.exists():
        return []
    try:
        data = json.loads(PRODUCTS_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


class WeeklyReporter:
    """Generate, save, and act on weekly performance reports."""

    def generate_report(self) -> str:
        """
        Build a Markdown weekly report covering the last 7 days.

        Returns
        -------
        str
            Formatted Markdown report string.
        """
        today = date.today().isoformat()
        summary = get_metrics_summary(days=7)
        posts = _load_social_posts()
        products = _load_products()

        # Posts per platform (all time, not just last 7 days — for the summary table)
        posts_by_platform: dict[str, int] = defaultdict(int)
        for post in posts:
            posts_by_platform[post.get("platform", "unknown")] += 1

        # Platform summary table
        platforms = sorted(
            set(list(posts_by_platform.keys()) + list(summary["by_platform"].keys()))
        )
        platform_rows = []
        for platform in platforms:
            p_posts = posts_by_platform.get(platform, 0)
            p_impressions = summary["by_platform"].get(platform, {}).get("impressions", 0)
            p_engagements = summary["by_platform"].get(platform, {}).get("engagements", 0)
            platform_rows.append(
                f"| {platform.capitalize()} | {p_posts} | {p_impressions:,} | {p_engagements:,} |"
            )

        platform_table = "\n".join([
            "| Platform | Posts | Impressions | Engagements |",
            "|----------|-------|-------------|-------------|",
        ] + platform_rows)

        # Top 5 products
        top_products = summary.get("top_products", [])[:5]
        top_product_lines = []
        for i, tp in enumerate(top_products, 1):
            name = tp.get("product_name") or tp.get("product_id", "Unknown")
            eng = tp.get("engagements", 0)
            top_product_lines.append(f"{i}. **{name}** — {eng:,} engagements")
        top_products_section = (
            "\n".join(top_product_lines) if top_product_lines else "_No data available._"
        )

        # Category analysis from products.json
        category_counts: dict[str, int] = defaultdict(int)
        for p in products:
            cat = p.get("category", "general")
            category_counts[cat] += 1

        sorted_cats = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
        top_3_categories = ", ".join(c for c, _ in sorted_cats[:3]) if sorted_cats else "N/A"
        bottom_categories = ", ".join(c for c, _ in sorted_cats[-3:]) if len(sorted_cats) > 3 else "N/A"

        report = f"""# Weekly Affiliate Marketing Report — {today}

## Summary
- **Period:** Last 7 days
- **Total Impressions:** {summary["total_impressions"]:,}
- **Total Clicks:** {summary["total_clicks"]:,}
- **Total Engagements:** {summary["total_engagements"]:,}

## Platform Summary
{platform_table}

## Top 5 Products by Engagement
{top_products_section}

## Recommendations
- Post more of: {top_3_categories}
- Underperforming: {bottom_categories}
- Focus on platforms with highest engagement rate for next week.
"""
        return report

    def save_report(self, report: str) -> Path:
        """
        Save report to data/reports/weekly_{date}.md.

        Parameters
        ----------
        report : str
            Markdown report string.

        Returns
        -------
        Path
            Path to the saved report file.
        """
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        filename = f"weekly_{date.today().isoformat()}.md"
        report_path = REPORTS_DIR / filename
        report_path.write_text(report, encoding="utf-8")
        print(f"  [Reporter] Report saved: {report_path}")
        return report_path

    def update_product_scores(self) -> None:
        """
        Update performance_score in products.json based on engagement metrics
        from the last 7 days.
        """
        products = _load_products()
        if not products:
            return

        summary = get_metrics_summary(days=7)
        engagement_by_product: dict[str, int] = {
            tp["product_id"]: tp["engagements"]
            for tp in summary.get("top_products", [])
        }

        if not engagement_by_product:
            print("  [Reporter] No engagement data — product scores unchanged.")
            return

        max_eng = max(engagement_by_product.values(), default=1)

        updated = 0
        for product in products:
            pid = product.get("id", "")
            if pid in engagement_by_product:
                raw = engagement_by_product[pid]
                # Normalise to 0–100 scale
                score = round((raw / max_eng) * 100, 2)
                product["performance_score"] = score
                updated += 1

        PRODUCTS_FILE.write_text(
            json.dumps(products, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"  [Reporter] Updated performance_score for {updated} product(s).")

    def run(self) -> None:
        """Generate report, save it, and update product scores."""
        print("  [Reporter] Generating weekly report...")
        report = self.generate_report()
        self.save_report(report)
        print("  [Reporter] Updating product scores...")
        self.update_product_scores()
        print("  [Reporter] Weekly report complete.")
