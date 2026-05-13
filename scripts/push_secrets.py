"""
Push .env values as GitHub Actions repository secrets.

GitHub requires each secret value to be encrypted with the repo's libsodium
public key before it can be stored. PyNaCl handles that here.

Only the keys listed in WORKFLOW_SECRETS are uploaded — credentials not used
by any workflow (OPENAI_API_KEY, GEMINI_API_KEY) are intentionally excluded.
"""

import base64
import os
import sys
from pathlib import Path

import requests
from dotenv import dotenv_values
from nacl import encoding, public

# ---------------------------------------------------------------------------
# Secrets that are actually referenced in .github/workflows/*.yml
# Keys present in .env but NOT in this set are left alone.
# ---------------------------------------------------------------------------
WORKFLOW_SECRETS = {
    "GROQ_API_KEY",
    "GITHUB_TOKEN",
    "GITHUB_REPO",
    "GITHUB_BRANCH",
    "SITE_BASE_URL",
    # Amazon
    "AMAZON_ACCESS_KEY",
    "AMAZON_SECRET_KEY",
    "AMAZON_ASSOCIATE_TAG",
    "AMAZON_MARKETPLACE",
    # ClickBank
    "CLICKBANK_DEV_API_KEY",
    "CLICKBANK_CLERK_API_KEY",
    # CJ Affiliate
    "CJ_API_TOKEN",
    "CJ_WEBSITE_ID",
    # ShareASale
    "SHAREASALE_API_TOKEN",
    "SHAREASALE_API_SECRET",
    "SHAREASALE_AFFILIATE_ID",
    # Twitter / X
    "TWITTER_API_KEY",
    "TWITTER_API_SECRET",
    "TWITTER_ACCESS_TOKEN",
    "TWITTER_ACCESS_SECRET",
    "TWITTER_BEARER_TOKEN",
    # Reddit
    "REDDIT_CLIENT_ID",
    "REDDIT_CLIENT_SECRET",
    "REDDIT_USERNAME",
    "REDDIT_PASSWORD",
    # Pinterest
    "PINTEREST_ACCESS_TOKEN",
    "PINTEREST_AD_ACCOUNT_ID",
}


def _encrypt(public_key_b64: str, secret_value: str) -> str:
    """Encrypt *secret_value* using the repo's libsodium public key."""
    pk_bytes = base64.b64decode(public_key_b64)
    sealed_box = public.SealedBox(public.PublicKey(pk_bytes))
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")


def _get_public_key(repo: str, token: str) -> tuple[str, str]:
    """Return (key_id, public_key_b64) for the repo's Actions secrets."""
    url = f"https://api.github.com/repos/{repo}/actions/secrets/public-key"
    resp = requests.get(url, headers={"Authorization": f"token {token}"}, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    return data["key_id"], data["key"]


def _upsert_secret(repo: str, token: str, name: str, encrypted_value: str, key_id: str) -> int:
    """Create or update a single secret. Returns the HTTP status code."""
    url = f"https://api.github.com/repos/{repo}/actions/secrets/{name}"
    resp = requests.put(
        url,
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
        },
        json={"encrypted_value": encrypted_value, "key_id": key_id},
        timeout=10,
    )
    return resp.status_code


def main() -> None:
    env_path = Path(__file__).parent.parent / ".env"
    env = dotenv_values(env_path)

    token = env.get("GITHUB_TOKEN") or os.environ.get("GITHUB_TOKEN", "")
    repo  = env.get("GITHUB_REPO")  or os.environ.get("GITHUB_REPO", "")

    if not token or not repo:
        print("[ERROR] GITHUB_TOKEN and GITHUB_REPO must be set in .env", file=sys.stderr)
        sys.exit(1)

    # Secrets to push = intersection of what's in .env and WORKFLOW_SECRETS
    to_push = {k: v for k, v in env.items() if k in WORKFLOW_SECRETS and v}
    skipped = WORKFLOW_SECRETS - set(to_push)

    print(f"Repo  : {repo}")
    print(f"Found : {len(to_push)} secret(s) to push")
    if skipped:
        print(f"Empty / missing (will be skipped): {', '.join(sorted(skipped))}\n")

    key_id, pub_key = _get_public_key(repo, token)

    ok = failed = 0
    for name, value in sorted(to_push.items()):
        try:
            encrypted = _encrypt(pub_key, value)
            status = _upsert_secret(repo, token, name, encrypted, key_id)
            if status in (201, 204):
                label = "CREATED" if status == 201 else "UPDATED"
                print(f"  [{label}] {name}")
                ok += 1
            else:
                print(f"  [WARN]    {name} — unexpected status {status}")
                failed += 1
        except Exception as exc:
            print(f"  [ERROR]   {name}: {exc}")
            failed += 1

    print(f"\nDone — {ok} pushed, {failed} failed.")


if __name__ == "__main__":
    main()
