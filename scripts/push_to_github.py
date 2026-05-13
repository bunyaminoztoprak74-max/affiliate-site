"""
GitHub'a otomatik push — üretilen Hugo içeriğini repoya yükler.
"""

import os
import base64
from pathlib import Path
from datetime import datetime

from dotenv import load_dotenv
from github import Github, GithubException

load_dotenv()

GITHUB_TOKEN = os.environ["GITHUB_TOKEN"]
GITHUB_REPO = os.environ["GITHUB_REPO"]          # "username/repo-name"
GITHUB_BRANCH = os.environ.get("GITHUB_BRANCH", "main")

SITE_DIR = Path(__file__).parent.parent / "site"


def get_repo():
    g = Github(GITHUB_TOKEN)
    return g.get_repo(GITHUB_REPO)


def file_to_github_path(local_path: Path) -> str:
    """Yerel yolu GitHub repo yoluna çevirir (site/ altındaki her şey)."""
    return local_path.relative_to(SITE_DIR.parent).as_posix()


def push_file(repo, local_path: Path, commit_message: str | None = None) -> bool:
    """Tek bir dosyayı GitHub'a push eder (create veya update)."""
    github_path = file_to_github_path(local_path)
    content = local_path.read_bytes()
    message = commit_message or f"chore: add {local_path.name} [{datetime.now().strftime('%Y-%m-%d %H:%M')}]"

    try:
        existing = repo.get_contents(github_path, ref=GITHUB_BRANCH)
        repo.update_file(github_path, message, content, existing.sha, branch=GITHUB_BRANCH)
        print(f"[GÜNCELLEME] {github_path}")
    except GithubException as e:
        if e.status == 404:
            repo.create_file(github_path, message, content, branch=GITHUB_BRANCH)
            print(f"[YENİ] {github_path}")
        else:
            raise
    return True


def push_new_posts(paths: list[Path]) -> int:
    """Belirtilen dosya listesini toplu olarak GitHub'a yükler."""
    if not paths:
        print("Yüklenecek dosya yok.")
        return 0

    repo = get_repo()
    success = 0
    for path in paths:
        try:
            push_file(repo, path)
            success += 1
        except Exception as e:
            print(f"[HATA] {path.name}: {e}")

    print(f"\n{success}/{len(paths)} dosya GitHub'a yüklendi.")
    return success


def push_entire_site() -> int:
    """site/ dizininin tamamını GitHub'a senkronize eder."""
    repo = get_repo()
    all_files = [f for f in SITE_DIR.rglob("*") if f.is_file()]

    print(f"Toplam {len(all_files)} dosya senkronize edilecek...")
    success = 0
    for f in all_files:
        try:
            push_file(repo, f, commit_message="chore: sync site files")
            success += 1
        except Exception as e:
            print(f"[HATA] {f}: {e}")

    print(f"\nSenkronizasyon tamamlandı: {success}/{len(all_files)}")
    return success


if __name__ == "__main__":
    import sys

    if "--all" in sys.argv:
        push_entire_site()
    else:
        # Son üretilen içerik dosyalarını bul (bugün oluşturulanlar)
        today = datetime.now().strftime("%Y-%m-%d")
        content_dir = SITE_DIR / "content"
        new_files = list(content_dir.rglob(f"{today}-*.md"))

        if new_files:
            print(f"Bugün oluşturulan {len(new_files)} dosya yükleniyor...")
            push_new_posts(new_files)
        else:
            print("Bugün oluşturulmuş yeni dosya bulunamadı. --all ile tüm siteyi senkronize edebilirsin.")
