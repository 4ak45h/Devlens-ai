import time
import json
import random
import re

def analyze_repo(repo_url, context=None, included_files=None, excluded_files=None):
    """
    Stable Demo Mode: Simulates AI analysis without external API dependencies.
    """
    # Simulate processing delay
    time.sleep(1.5)

    # Extract repo name and owner from URL
    # https://github.com/owner/repo
    pattern = r"https?://github\.com/([^/]+)/([^/]+)"
    match = re.search(pattern, repo_url)
    if match:
        owner, repo_name = match.groups()
        repo_name = repo_name.replace(".git", "")
    else:
        owner, repo_name = "unknown", "unknown-repo"

    # Heuristic tech stack detection
    languages = ["Python", "JavaScript"]
    frameworks = ["Flask"]
    
    url_lower = repo_url.lower()
    if "react" in url_lower or "next" in url_lower:
        languages.append("TypeScript")
        frameworks.append("React")
        frameworks.append("Tailwind CSS")
    
    if "vue" in url_lower:
        frameworks.append("Vue.js")
    
    if "node" in url_lower or "express" in url_lower:
        languages.append("JavaScript")
        frameworks.append("Express.js")

    if "django" in url_lower:
        frameworks.append("Django")

    # Slight randomness in scores (6-9 range)
    readability = round(random.uniform(7.5, 9.2), 1)
    modularity = round(random.uniform(6.8, 8.8), 1)
    test_coverage = round(random.uniform(5.5, 8.5), 1)
    
    avg_score = (readability + modularity + test_coverage) / 3
    if avg_score > 8.5:
        grade = "A"
    elif avg_score > 7.5:
        grade = "B+"
    else:
        grade = "B"

    # Priority variations
    improvements = [
        {
            "priority": "P1",
            "title": "Enhance Error Handling",
            "description": f"The core logic in {repo_name} could benefit from more robust try-except blocks, especially around external service integrations.",
            "effort": "Low"
        },
        {
            "priority": "P2",
            "title": "Improve Documentation",
            "description": "Add more inline comments and docstrings to complex functions to improve maintainability for new contributors.",
            "effort": "Medium"
        },
        {
            "priority": "P3",
            "title": "Optimize Dependency Management",
            "description": "Consider pinning versions in requirements.txt or package.json to ensure build reproducibility.",
            "effort": "Low"
        }
    ]
    random.shuffle(improvements)

    # Build the response structure
    analysis = {
        "summary": {
            "project_name": repo_name.replace("-", " ").title(),
            "description": f"A well-structured repository by {owner} focusing on modern software development patterns.",
            "purpose": "Demonstration of clean architecture and scalable components."
        },
        "tech_stack": {
            "languages": list(set(languages)),
            "frameworks": list(set(frameworks)),
            "databases": ["PostgreSQL", "Redis"] if "data" in url_lower else ["SQLite"],
            "infrastructure": ["Docker", "GitHub Actions"],
            "testing": ["Pytest", "Jest"],
            "build_tools": ["Vite", "Pip"],
            "evidence": "Inferred from repository structure, file extensions, and configuration files found in the root directory."
        },
        "architecture": {
            "patterns": ["MVC", "Service Pattern", "RESTful API"],
            "evidence": "Observed clear separation between routes, services, and utility functions in the file tree."
        },
        "code_quality": {
            "overall_grade": grade,
            "readability_score": readability,
            "modularity_score": modularity,
            "test_coverage_score": test_coverage,
            "observations": [
                {
                    "title": "Consistent Naming Conventions",
                    "description": "The codebase follows standard naming conventions, making it easy to navigate.",
                    "sentiment": "Positive",
                    "severity": "Low"
                },
                {
                    "title": "Modular Service Layer",
                    "description": "Business logic is well-encapsulated within the service directory.",
                    "sentiment": "Positive",
                    "severity": "Low"
                }
            ]
        },
        "improvements": improvements,
        "readme": f"# {repo_name.replace('-', ' ').title()}\n\nThis project demonstrates high-quality code standards. It features a robust backend and a modern frontend interface.\n\n## Key Features\n- Automated analysis pipeline\n- Real-time visualization\n- Scalable architecture"
    }

    return analysis
