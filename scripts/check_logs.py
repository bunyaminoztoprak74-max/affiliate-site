import os, requests, sys
from dotenv import load_dotenv
load_dotenv()

token = os.environ['GITHUB_TOKEN']
repo = os.environ['GITHUB_REPO']
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}

# Verify repo access
r = requests.get(f'https://api.github.com/repos/{repo}', headers=headers)
print(f"Repo status: {r.status_code} - {r.json().get('full_name', r.json().get('message', 'unknown'))}")

# Check all runs (no filter)
r2 = requests.get(f'https://api.github.com/repos/{repo}/actions/runs', headers=headers)
print(f"Runs API status: {r2.status_code}")
data = r2.json()
runs = data.get('workflow_runs', [])
print(f"Total runs returned: {len(runs)} (total_count={data.get('total_count', '?')})")

for run in runs[:5]:
    print(f"  [{run['status']}] [{run['conclusion']}] {run['name']} - {run['created_at']} - id:{run['id']}")

# Also check recent commits to confirm pushes landed
r3 = requests.get(f'https://api.github.com/repos/{repo}/commits?per_page=5', headers=headers)
print(f"\nRecent commits:")
for c in r3.json()[:5]:
    sha = c['sha'][:7]
    msg = c['commit']['message'][:80]
    date = c['commit']['author']['date']
    print(f"  [{sha}] {date} - {msg}")
