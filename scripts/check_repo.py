import os, requests
from dotenv import load_dotenv
load_dotenv()

token = os.environ['GITHUB_TOKEN']
repo = os.environ['GITHUB_REPO']
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}

# Check root files
r = requests.get(f'https://api.github.com/repos/{repo}/contents/', headers=headers)
print('Root files in repo:')
for f in r.json():
    print(f"  {f['type']:5} {f['name']}")

# Check vercel.json content
r2 = requests.get(f'https://api.github.com/repos/{repo}/contents/vercel.json', headers=headers)
if r2.status_code == 200:
    import base64
    content = base64.b64decode(r2.json()['content']).decode()
    print(f'\nvercel.json in repo:\n{content}')
else:
    print(f'\nvercel.json not found ({r2.status_code})')

# Check .github
r3 = requests.get(f'https://api.github.com/repos/{repo}/contents/.github', headers=headers)
if r3.status_code == 200:
    print('\n.github contents:', [f['name'] for f in r3.json()])
else:
    print(f'\n.github not found (status {r3.status_code})')
