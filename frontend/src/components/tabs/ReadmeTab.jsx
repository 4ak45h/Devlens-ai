import ReactMarkdown from "react-markdown"
import { useState } from "react"

export default function ReadmeTab({ data }) {
  const [copied, setCopied] = useState(false)
  const readme = data?.readme || "# No README generated"

  function handleCopy() {
    navigator.clipboard.writeText(readme)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Auto-generated README</h1>
          <p className="text-gray-500 text-sm">Ready to drop into your repository</p>
        </div>
        <button
          onClick={handleCopy}
          className={`border text-xs font-mono px-4 py-2 rounded transition-all ${
            copied
              ? "border-green-500/40 text-green-400"
              : "border-[#1E1E2E] text-gray-400 hover:border-[#00D9FF40] hover:text-[#00D9FF]"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy README"}
        </button>
      </div>

      {/* Markdown preview */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-8">
        <div className="font-mono text-xs text-gray-500 border-b border-[#1E1E2E] pb-3 mb-6 flex items-center gap-2">
          <span>📄</span> README.md
        </div>
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-code:text-[#00D9FF] prose-code:bg-[#00D9FF10] prose-code:px-1 prose-code:rounded
          prose-pre:bg-[#0A0A0F] prose-pre:border prose-pre:border-[#1E1E2E]
          prose-a:text-[#00D9FF] prose-strong:text-white
          prose-li:text-gray-300">
          <ReactMarkdown>{readme}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}