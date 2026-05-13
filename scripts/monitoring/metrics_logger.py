"""
Read/write metrics.json — append, query, and summarise engagement metrics.
"""

import sys
import json
from datetime import date, datetime, timezone, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

DATA_DIR = Path(__file__).parent.parent.parent / "data"
METRICS_FILE = DATA_DIR / "metrics.json"


# ---------------------------------------------------------------------------
# Low-level I/O
# ---------------------------------------------------------------------------

def _load_raw() -> list[dict]:
    """Load metrics.json, returning [] on missing/corrupt file."""
    if not METRICS_FILE.exists():
        return []
    try:
        data = json.loads(METRICS_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def _save_raw(records: list[dict]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    METRICS_FILE.write_text(
        json.dumps(records, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def log_metric(
    product_id: str,
    product_name: str,
    platform: str,
    post_id: str,
    metrics: dict,
) -> None:
    """
    Append a metric record to metrics.json.

    Parameters
    ----------
    product_id : str
    product_name : str
    platform : str
        One of "twitter", "reddit", "pinterest".
    post_id : str
        Platform-specific post/tweet/pin ID.
    metrics : dict
        Engagement metrics dict (keys vary by platform).
    """
    records = _load_raw()
    record = {
        "date": date.today().isoformat(),
        "product_id": product_id,
        "product_name": product_name,
        "platform": platform,
        "post_id": post_id,
        "metrics": metrics,
        "logged_at": datetime.now(tz=timezone.utc).isoformat(),
    }
    records.append(record)
    _save_raw(records)


def load_metrics() -> list[dict]:
    """Return the full metrics log."""
    return _load_raw()


def get_metrics_for_product(product_id: str) -> list[dict]:
    """Return all metric records for a specific product."""
    return [r for r in _load_raw() if r.get("product_id") == product_id]


def get_metrics_summary(days: int = 7) -> dict:
    """
    Aggregate metrics for the last N days.

    Returns
    -------
    dict
        {
          "total_impressions": int,
          "total_clicks": int,
          "total_engagements": int,
          "by_platform": {platform: {impressions, engagements}},
          "top_products": [{"product_id", "product_name", "engagements"}, ...],
          "period_days": days,
        }
    """
    cutoff = date.today() - timedelta(days=days)
    records = [
        r for r in _load_raw()
        if r.get("date", "") >= cutoff.isoformat()
    ]

    total_impressions = 0
    total_clicks = 0
    total_engagements = 0
    by_platform: dict[str, dict] = {}
    product_engagement: dict[str, dict] = {}

    for r in records:
        m = r.get("metrics", {})
        platform = r.get("platform", "unknown")
        pid = r.get("product_id", "")
        pname = r.get("product_name", "")

        # Aggregate impressions
        impressions = (
            m.get("impressions", 0)
            or m.get("impression_count", 0)
        )
        # Aggregate clicks / saves / comments as "engagements"
        engagements = (
            m.get("likes", 0)
            + m.get("retweets", 0)
            + m.get("replies", 0)
            + m.get("score", 0)
            + m.get("num_comments", 0)
            + m.get("saves", 0)
            + m.get("clicks", 0)
        )
        clicks = m.get("clicks", 0) + m.get("retweets", 0)

        total_impressions += impressions
        total_clicks += clicks
        total_engagements += engagements

        if platform not in by_platform:
            by_platform[platform] = {"impressions": 0, "engagements": 0}
        by_platform[platform]["impressions"] += impressions
        by_platform[platform]["engagements"] += engagements

        if pid not in product_engagement:
            product_engagement[pid] = {"product_name": pname, "engagements": 0}
        product_engagement[pid]["engagements"] += engagements

    top_products = sorted(
        [{"product_id": k, **v} for k, v in product_engagement.items()],
        key=lambda x: x["engagements"],
        reverse=True,
    )[:10]

    return {
        "total_impressions": total_impressions,
        "total_clicks": total_clicks,
        "total_engagements": total_engagements,
        "by_platform": by_platform,
        "top_products": top_products,
        "period_days": days,
    }
