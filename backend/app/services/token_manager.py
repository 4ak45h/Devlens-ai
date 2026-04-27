# Removed tiktoken dependency for stable demo mode to ensure it's runnable without C++ build tools.
# Approximation: 1 token ~= 4 characters

def count_tokens(text: str) -> int:
    """Approximate token count without external dependencies."""
    return len(text) // 4

def get_encoding(name):
    # Mock encoding object to maintain compatibility if truncate_file uses it
    class MockEncoding:
        def encode(self, text): return [0] * (len(text) // 4)
        def decode(self, tokens): return "" # Not really used in a way that matters for demo
    return MockEncoding()

# enc = get_encoding("cl100k_base") # We will refactor truncate_file below to not use enc directly if possible


MAX_CONTEXT_TOKENS = 80_000   # Conservative limit — leaves room for prompt + response
MAX_FILE_TOKENS = 8_000       # No single file should dominate context

def truncate_file(content: str, max_tokens: int) -> str:
    """
    Truncate a file to max_tokens (approx 4 chars per token).
    """
    max_chars = max_tokens * 4
    if len(content) <= max_chars:
        return content

    # Keep 70% from top, 30% from bottom
    top_chars = int(max_chars * 0.7)
    bottom_chars = max_chars - top_chars
    
    top_content = content[:top_chars]
    bottom_content = content[-bottom_chars:]
    return top_content + "\n\n... [TRUNCATED] ...\n\n" + bottom_content

def build_context(files: list) -> dict:
    """
    Builds the final context string to send to Claude.

    Strategy:
    1. Always include config/manifest files first (package.json, requirements.txt, etc.)
    2. Fill remaining budget with code files, highest priority first
    3. Truncate individual files if needed
    4. Return the context + metadata about what was included/excluded

    Returns:
    {
        "context": str,           # The final string to include in the prompt
        "included_files": list,   # Files that made it in
        "excluded_files": list,   # Files that were cut
        "total_tokens": int,
    }
    """
    budget = MAX_CONTEXT_TOKENS
    included = []
    excluded = []
    context_parts = []

    # Sort: priority desc, then small files first (fit more files in budget)
    sorted_files = sorted(files, key=lambda f: (-f["priority"], len(f["content"])))

    for file in sorted_files:
        path = file["path"]
        content = file["content"]

        # Truncate long files
        content = truncate_file(content, MAX_FILE_TOKENS)

        header = f"\n\n{'='*60}\nFILE: {path}\n{'='*60}\n"
        block = header + content
        block_tokens = count_tokens(block)

        if block_tokens > budget:
            excluded.append(path)
            continue

        context_parts.append(block)
        included.append(path)
        budget -= block_tokens

    full_context = "".join(context_parts)

    return {
        "context": full_context,
        "included_files": included,
        "excluded_files": excluded,
        "total_tokens": MAX_CONTEXT_TOKENS - budget,
    }
