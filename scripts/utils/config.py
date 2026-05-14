"""
Central configuration loader — reads all credentials from environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Groq
# ---------------------------------------------------------------------------
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

# ---------------------------------------------------------------------------
# GitHub
# ---------------------------------------------------------------------------
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
# Fall back to GitHub Actions built-ins when running in CI
GITHUB_REPO   = os.environ.get("GITHUB_REPO") or os.environ.get("GITHUB_REPOSITORY", "")
GITHUB_BRANCH = os.environ.get("GITHUB_BRANCH") or os.environ.get("GITHUB_REF_NAME", "main")

# ---------------------------------------------------------------------------
# Amazon Product Advertising API 5.0
# ---------------------------------------------------------------------------
AMAZON_ACCESS_KEY = os.environ.get("AMAZON_ACCESS_KEY", "")
AMAZON_SECRET_KEY = os.environ.get("AMAZON_SECRET_KEY", "")
AMAZON_ASSOCIATE_TAG = os.environ.get("AMAZON_ASSOCIATE_TAG", "")
AMAZON_MARKETPLACE = os.environ.get("AMAZON_MARKETPLACE", "www.amazon.com")

# ---------------------------------------------------------------------------
# ClickBank
# ---------------------------------------------------------------------------
CLICKBANK_DEV_API_KEY = os.environ.get("CLICKBANK_DEV_API_KEY", "")
CLICKBANK_CLERK_API_KEY = os.environ.get("CLICKBANK_CLERK_API_KEY", "")

# ---------------------------------------------------------------------------
# CJ Affiliate
# ---------------------------------------------------------------------------
CJ_API_TOKEN = os.environ.get("CJ_API_TOKEN", "")
CJ_WEBSITE_ID = os.environ.get("CJ_WEBSITE_ID", "")

# ---------------------------------------------------------------------------
# ShareASale
# ---------------------------------------------------------------------------
SHAREASALE_API_TOKEN = os.environ.get("SHAREASALE_API_TOKEN", "")
SHAREASALE_API_SECRET = os.environ.get("SHAREASALE_API_SECRET", "")
SHAREASALE_AFFILIATE_ID = os.environ.get("SHAREASALE_AFFILIATE_ID", "")

# ---------------------------------------------------------------------------
# Twitter / X
# ---------------------------------------------------------------------------
TWITTER_API_KEY = os.environ.get("TWITTER_API_KEY", "")
TWITTER_API_SECRET = os.environ.get("TWITTER_API_SECRET", "")
TWITTER_ACCESS_TOKEN = os.environ.get("TWITTER_ACCESS_TOKEN", "")
# Accept both naming conventions (GitHub secret is TWITTER_ACCESS_TOKEN_SECRET)
TWITTER_ACCESS_SECRET = (
    os.environ.get("TWITTER_ACCESS_SECRET")
    or os.environ.get("TWITTER_ACCESS_TOKEN_SECRET", "")
)
# Bearer Token is optional — only needed for read-only API calls, not for posting
TWITTER_BEARER_TOKEN = os.environ.get("TWITTER_BEARER_TOKEN", "")

# ---------------------------------------------------------------------------
# Reddit
# ---------------------------------------------------------------------------
REDDIT_CLIENT_ID = os.environ.get("REDDIT_CLIENT_ID", "")
REDDIT_CLIENT_SECRET = os.environ.get("REDDIT_CLIENT_SECRET", "")
REDDIT_USERNAME = os.environ.get("REDDIT_USERNAME", "")
REDDIT_PASSWORD = os.environ.get("REDDIT_PASSWORD", "")

# ---------------------------------------------------------------------------
# Pinterest
# ---------------------------------------------------------------------------
PINTEREST_ACCESS_TOKEN = os.environ.get("PINTEREST_ACCESS_TOKEN", "")
PINTEREST_AD_ACCOUNT_ID = os.environ.get("PINTEREST_AD_ACCOUNT_ID", "")

# ---------------------------------------------------------------------------
# Site
# ---------------------------------------------------------------------------
SITE_BASE_URL = os.environ.get("SITE_BASE_URL", "")


def is_configured(*keys: str) -> bool:
    """Return True only if ALL given environment-variable names are non-empty."""
    env = {
        "GROQ_API_KEY": GROQ_API_KEY,
        "GITHUB_TOKEN": GITHUB_TOKEN,
        "GITHUB_REPO": GITHUB_REPO,
        "GITHUB_BRANCH": GITHUB_BRANCH,
        "AMAZON_ACCESS_KEY": AMAZON_ACCESS_KEY,
        "AMAZON_SECRET_KEY": AMAZON_SECRET_KEY,
        "AMAZON_ASSOCIATE_TAG": AMAZON_ASSOCIATE_TAG,
        "AMAZON_MARKETPLACE": AMAZON_MARKETPLACE,
        "CLICKBANK_DEV_API_KEY": CLICKBANK_DEV_API_KEY,
        "CLICKBANK_CLERK_API_KEY": CLICKBANK_CLERK_API_KEY,
        "CJ_API_TOKEN": CJ_API_TOKEN,
        "CJ_WEBSITE_ID": CJ_WEBSITE_ID,
        "SHAREASALE_API_TOKEN": SHAREASALE_API_TOKEN,
        "SHAREASALE_API_SECRET": SHAREASALE_API_SECRET,
        "SHAREASALE_AFFILIATE_ID": SHAREASALE_AFFILIATE_ID,
        "TWITTER_API_KEY": TWITTER_API_KEY,
        "TWITTER_API_SECRET": TWITTER_API_SECRET,
        "TWITTER_ACCESS_TOKEN": TWITTER_ACCESS_TOKEN,
        "TWITTER_ACCESS_SECRET": TWITTER_ACCESS_SECRET,
        "TWITTER_BEARER_TOKEN": TWITTER_BEARER_TOKEN,
        "REDDIT_CLIENT_ID": REDDIT_CLIENT_ID,
        "REDDIT_CLIENT_SECRET": REDDIT_CLIENT_SECRET,
        "REDDIT_USERNAME": REDDIT_USERNAME,
        "REDDIT_PASSWORD": REDDIT_PASSWORD,
        "PINTEREST_ACCESS_TOKEN": PINTEREST_ACCESS_TOKEN,
        "PINTEREST_AD_ACCOUNT_ID": PINTEREST_AD_ACCOUNT_ID,
        "SITE_BASE_URL": SITE_BASE_URL,
    }
    return all(env.get(k, "") != "" for k in keys)
