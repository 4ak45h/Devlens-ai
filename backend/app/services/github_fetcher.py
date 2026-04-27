import requests
import os
import base64
from app.utils.repo_parser import get_file_priority

GITHUB_API = "https://api.github.com"

def _get_headers():
    """Build headers dynamically so env vars can be loaded at runtime."""
    token = os.getenv("GITHUB_TOKEN", "")
    headers = {"Accept": "application/vnd.github.v3+json"}
    # Only add auth if token looks real (not a placeholder)
    if token and not token.startswith("your_") and len(token) > 10:
        headers["Authorization"] = f"token {token}"
    return headers

def get_repo_metadata(owner: str, repo: str) -> dict:
    """Fetch real repository metadata from GitHub API."""
    url = f"{GITHUB_API}/repos/{owner}/{repo}"
    res = requests.get(url, headers=_get_headers())
    res.raise_for_status()
    data = res.json()

    # Format size: GitHub returns size in KB
    size_kb = data.get("size", 0)
    if size_kb >= 1_000_000:
        size_str = f"{size_kb / 1_000_000:.1f} GB"
    elif size_kb >= 1_000:
        size_str = f"{size_kb / 1_000:.1f} MB"
    else:
        size_str = f"{size_kb} KB"

    # Format star/fork counts
    def format_count(n):
        if n >= 1000:
            return f"{n/1000:.1f}k"
        return str(n)

    return {
        "default_branch": data.get("default_branch", "main"),
        "stars": data.get("stargazers_count", 0),
        "stars_display": format_count(data.get("stargazers_count", 0)),
        "forks": data.get("forks_count", 0),
        "forks_display": format_count(data.get("forks_count", 0)),
        "language": data.get("language", "Unknown"),
        "license": data.get("license", {}).get("spdx_id", "No License") if data.get("license") else "No License",
        "description": data.get("description", ""),
        "size_kb": size_kb,
        "size_display": size_str,
        "visibility": "public" if not data.get("private") else "private",
        "open_issues": data.get("open_issues_count", 0),
        "topics": data.get("topics", []),
    }

def get_repo_tree(owner: str, repo: str, branch: str) -> list:
    """Returns flat list of all file paths in the repo."""
    url = f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
    res = requests.get(url, headers=_get_headers())
    res.raise_for_status()
    data = res.json()
    return [item for item in data.get("tree", []) if item["type"] == "blob"]

def get_file_content(owner: str, repo: str, path: str) -> str:
    """Fetch a single file's content as a string."""
    url = f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}"
    res = requests.get(url, headers=_get_headers())
    if res.status_code == 404:
        return ""
    res.raise_for_status()
    data = res.json()
    if data.get("encoding") == "base64":
        try:
            return base64.b64decode(data["content"]).decode("utf-8", errors="replace")
        except Exception:
            return ""
    return data.get("content", "")

def count_lines(content: str) -> int:
    """Count lines of code in a file content string."""
    return len(content.strip().split("\n")) if content.strip() else 0

def fetch_repo_contents(owner: str, repo: str, branch: str = None) -> dict:
    """
    Main entry point. Returns repo files, metadata, and real statistics.
    """
    # Fetch metadata first (includes default_branch)
    metadata = get_repo_metadata(owner, repo)

    if not branch:
        branch = metadata["default_branch"]

    tree = get_repo_tree(owner, repo, branch)

    # Count lines of code (we'll update as we fetch content)
    total_loc = 0

    # Sort by priority — only fetch files we care about
    prioritized = []
    for item in tree:
        p = get_file_priority(item["path"])
        if p > 0:
            prioritized.append({"path": item["path"], "priority": p, "size": item.get("size", 0)})

    prioritized.sort(key=lambda x: (-x["priority"], x["size"]))

    # Fetch content for top N files (GitHub rate limits: 5000 req/hr with token)
    MAX_FILES = 60
    files = []
    for item in prioritized[:MAX_FILES]:
        content = get_file_content(owner, repo, item["path"])
        if content:
            total_loc += count_lines(content)
            files.append({
                "path": item["path"],
                "content": content,
                "priority": item["priority"],
            })

    # Format LOC display
    if total_loc >= 1000:
        loc_display = f"~{total_loc // 1000}k"
    else:
        loc_display = str(total_loc)

    # Detect dependencies count from package.json, requirements.txt, etc.
    dep_count = 0
    for f in files:
        if f["path"].endswith("package.json"):
            import json
            try:
                pkg = json.loads(f["content"])
                dep_count += len(pkg.get("dependencies", {}))
                dep_count += len(pkg.get("devDependencies", {}))
            except Exception:
                pass
        elif f["path"].endswith("requirements.txt"):
            dep_count += len([line for line in f["content"].strip().split("\n") if line.strip() and not line.startswith("#")])
        elif f["path"].endswith("pyproject.toml"):
            # Simple count of dependencies lines
            dep_count += f["content"].count("==") + f["content"].count(">=")

    return {
        "files": files,
        "total_files_in_repo": len(tree),
        "branch": branch,
        "metadata": metadata,
        "stats": {
            "total_files": len(tree),
            "files_analyzed": len(files),
            "total_loc": total_loc,
            "loc_display": loc_display,
            "dep_count": dep_count,
        },
    }
