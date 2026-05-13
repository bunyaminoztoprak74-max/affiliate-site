#!/usr/bin/env python3
"""Weekly analysis: fetch all metrics, generate report, optimize product selection."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.monitoring.engagement_tracker import EngagementTracker
from scripts.monitoring.weekly_reporter import WeeklyReporter
from scripts.push_to_github import push_file, get_repo

DATA_DIR = Path(__file__).parent.parent.parent / "data"
PRODUCTS_FILE = Path(__file__).parent.parent.parent / "products.json"


def main():
    print("=== WEEKLY ANALYSIS ===")

    print("[1/3] Fetching latest engagement metrics...")
    tracker = EngagementTracker()
    tracker.run()

    print("[2/3] Generating weekly report...")
    reporter = WeeklyReporter()
    reporter.run()

    print("[3/3] Pushing updated data files...")
    repo = get_repo()
    for f in [DATA_DIR / "metrics.json", PRODUCTS_FILE]:
        if f.exists():
            push_file(repo, f, commit_message=f"data: weekly update {f.name}")

    report_dir = DATA_DIR / "reports"
    if report_dir.exists():
        for report in sorted(report_dir.glob("weekly_*.md"))[-1:]:
            push_file(repo, report, commit_message=f"report: {report.name}")

    print("[DONE] Weekly analysis complete.")


if __name__ == "__main__":
    main()
