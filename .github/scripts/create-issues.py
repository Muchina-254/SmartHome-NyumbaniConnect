import requests
import yaml
import os

REPO = "Muchina-254/SmartHome-NyumbaniConnect"
TOKEN = os.environ["GH_TOKEN"]

with open(".github/fr_issues.yaml", "r") as f:
    issues = yaml.safe_load(f)

for issue in issues["issues"]:
    url = f"https://api.github.com/repos/{REPO}/issues"
    headers = {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github+json"
    }
    data = {
        "title": issue["title"],
        "body": issue["description"],
        "labels": issue["labels"],
        "assignees": issue["assignees"]
    }
    response = requests.post(url, json=data, headers=headers)
    print(f"Created: {issue['title']}, Status: {response.status_code}")
