"""Push entire project (excluding site/public build artifacts) to GitHub."""
import os
import base64
from pathlib import Path
from dotenv import load_dotenv
from github import Github, GithubException

load_dotenv()

TOKEN = os.environ["GITHUB_TOKEN"]
REPO_NAME = os.environ["GITHUB_REPO"]
BRANCH = os.environ.get("GITHUB_BRANCH", "main")
ROOT = Path(__file__).parent.parent

EXCLUDE_DIRS = {".git", "__pycache__", "site/public", ".venv", "venv", "node_modules"}
EXCLUDE_FILES = {".env"}
INCLUDE_EXTS = {".py", ".json", ".yml", ".yaml", ".toml", ".md", ".txt", ".example"}

def should_include(path: Path) -> bool:
    rel = path.relative_to(ROOT).as_posix()
    # Exclude build artifacts and secrets
    for excl in EXCLUDE_DIRS:
        if rel.startswith(excl) or f"/{excl}/" in rel:
            return False
    if path.name in EXCLUDE_FILES:
        return False
    if path.suffix in INCLUDE_EXTS or path.name in {".env.example"}:
        return True
    return False

def push_file(repo, local_path: Path, message: str) -> str:
    github_path = local_path.relative_to(ROOT).as_posix()
    content = local_path.read_bytes()
    try:
        existing = repo.get_contents(github_path, ref=BRANCH)
        if existing.sha == _sha(content):
            return "unchanged"
        repo.update_file(github_path, message, content, existing.sha, branch=BRANCH)
        return "updated"
    except GithubException as e:
        if e.status == 404:
            repo.create_file(github_path, message, content, branch=BRANCH)
            return "created"
        raise

def _sha(content: bytes) -> str:
    import hashlib
    header = f"blob {len(content)}\0".encode()
    return hashlib.sha1(header + content).hexdigest()

def main():
    g = Github(auth=__import__("github").Auth.Token(TOKEN))
    repo = g.get_repo(REPO_NAME)

    files = [f for f in ROOT.rglob("*") if f.is_file() and should_include(f)]
    print(f"Pushing {len(files)} files to {REPO_NAME}...")

    counts = {"created": 0, "updated": 0, "unchanged": 0, "error": 0}
    for f in sorted(files):
        rel = f.relative_to(ROOT).as_posix()
        try:
            status = push_file(repo, f, f"chore: sync {rel}")
            counts[status] += 1
            if status != "unchanged":
                print(f"  [{status.upper()}] {rel}")
        except Exception as e:
            counts["error"] += 1
            print(f"  [ERROR] {rel}: {e}")

    print(f"\nDone — created:{counts['created']} updated:{counts['updated']} unchanged:{counts['unchanged']} errors:{counts['error']}")

if __name__ == "__main__":
    main()
