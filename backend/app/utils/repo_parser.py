import re

def parse_github_url(url: str) -> dict:
    """
    Accepts formats:
      https://github.com/owner/repo
      https://github.com/owner/repo/tree/branch
    Returns: {"owner": str, "repo": str, "branch": str or None}
    """
    url = url.strip().rstrip("/")
    pattern = r"https?://github\.com/([^/]+)/([^/]+)(?:/tree/([^/]+))?"
    match = re.match(pattern, url)
    if not match:
        raise ValueError(f"Invalid GitHub URL: {url}")
    owner, repo, branch = match.groups()
    return {"owner": owner, "repo": repo.replace(".git", ""), "branch": branch}


# Files that carry the most signal for analysis
PRIORITY_EXTENSIONS = {
    "high": [".py", ".js", ".ts", ".jsx", ".tsx", ".go", ".rs", ".java", ".rb", ".php"],
    "medium": [".json", ".yaml", ".yml", ".toml", ".env.example", ".sh"],
    "low": [".md", ".txt", ".rst", ".html", ".css"],
}

SKIP_PATHS = [
    "node_modules", ".git", "dist", "build", "__pycache__",
    ".next", "venv", ".venv", "vendor", "coverage",
    "*.min.js", "*.lock", "package-lock.json", "yarn.lock",
]

PRIORITY_FILENAMES = [
    "main.py", "app.py", "index.js", "index.ts", "server.js",
    "package.json", "requirements.txt", "Dockerfile",
    "docker-compose.yml", "README.md", ".env.example",
    "settings.py", "config.py", "setup.py", "pyproject.toml",
]

def should_skip(path: str) -> bool:
    for skip in SKIP_PATHS:
        if skip.startswith("*"):
            if path.endswith(skip[1:]):
                return True
        elif skip in path:
            return True
    return False

def get_file_priority(path: str) -> int:
    """Returns 0 (skip), 1 (low), 2 (medium), 3 (high priority)"""
    if should_skip(path):
        return 0
    filename = path.split("/")[-1]
    if filename in PRIORITY_FILENAMES:
        return 4  # Top priority
    for ext in PRIORITY_EXTENSIONS["high"]:
        if path.endswith(ext):
            return 3
    for ext in PRIORITY_EXTENSIONS["medium"]:
        if path.endswith(ext):
            return 2
    for ext in PRIORITY_EXTENSIONS["low"]:
        if path.endswith(ext):
            return 1
    return 0
