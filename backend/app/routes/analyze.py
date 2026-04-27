import time
from flask import Blueprint, request, jsonify
from app.utils.repo_parser import parse_github_url
from app.services.github_fetcher import fetch_repo_contents
from app.services.token_manager import build_context
from app.services.demo_analyzer import analyze_repo

analyze_bp = Blueprint("analyze", __name__)

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    start_time = time.time()

    data = request.get_json()
    if not data or "url" not in data:
        return jsonify({"error": "Missing 'url' field"}), 400

    url = data["url"].strip()

    try:
        # Step 1: Parse the GitHub URL
        parsed = parse_github_url(url)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    try:
        # Step 2: Fetch repo contents from GitHub (now includes metadata)
        repo_data = fetch_repo_contents(
            owner=parsed["owner"],
            repo=parsed["repo"],
            branch=parsed.get("branch"),
        )
    except Exception as e:
        return jsonify({"error": f"GitHub fetch failed: {str(e)}"}), 502

    if not repo_data["files"]:
        return jsonify({"error": "No analyzable files found in this repository."}), 422

    try:
        # Step 3: Build token-limited context
        context_data = build_context(repo_data["files"])
    except Exception as e:
        return jsonify({"error": f"Context building failed: {str(e)}"}), 500

    try:
        # Step 4: Call Gemini for analysis
        analysis = analyze_repo(
            repo_url=url,
            context=context_data["context"],
            included_files=context_data["included_files"],
            excluded_files=context_data["excluded_files"],
        )
    except Exception as e:
        return jsonify({"error": f"AI analysis failed: {str(e)}"}), 500

    elapsed = round(time.time() - start_time, 1)

    # Step 5: Return enriched response with ALL real data
    return jsonify({
        "analysis": analysis,
        "meta": {
            "repo_url": url,
            "owner": parsed["owner"],
            "repo": parsed["repo"],
            "total_files_in_repo": repo_data["stats"]["total_files"],
            "files_analyzed": repo_data["stats"]["files_analyzed"],
            "files_excluded": len(context_data["excluded_files"]),
            "tokens_used": context_data["total_tokens"],
            "branch": repo_data["branch"],
            "analysis_time": f"{elapsed}s",
            "total_loc": repo_data["stats"]["total_loc"],
            "loc_display": repo_data["stats"]["loc_display"],
            "dep_count": repo_data["stats"]["dep_count"],
        },
        "repo_info": repo_data["metadata"],
    })
