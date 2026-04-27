export default function CodeQuality({ data }) {
  const q = data?.code_quality || {}

  const bars = [
    { label: "Readability",   score: q.readability   ?? 0 },
    { label: "Modularity",    score: q.modularity    ?? 0 },
    { label: "Documentation", score: q.documentation ?? 0 },
    { label: "Test Coverage", score: q.test_coverage ?? 0 },
    { label: "Consistency",   score: q.consistency   ?? 0 },
  ]

  function barColor(score) {
    if (score >= 75) return "#00D9FF"
    if (score >= 50) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Code Quality Audit</h1>
        <p className="text-gray-500 text-sm">AI-powered analysis of code structure and patterns</p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Score card */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6 flex flex-col items-center justify-center">
          <p className="font-mono text-xs text-gray-500 mb-3">OVERALL GRADE</p>
          <p className="text-6xl font-bold text-[#00D9FF]">{q.grade ?? "—"}</p>
          <p className="text-xs text-gray-500 mt-3 text-center">{q.summary ?? ""}</p>
          <div className="w-full mt-6 space-y-3">
            {bars.map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{b.label}</span>
                  <span style={{ color: barColor(b.score) }}>{b.score}%</span>
                </div>
                <div className="w-full h-1 bg-[#1E1E2E] rounded-full">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${b.score}%`, background: barColor(b.score) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div className="col-span-2 space-y-3">
          {(q.observations || []).map((obs, i) => (
            <div key={i}
              className={`bg-[#111118] border-l-2 border border-[#1E1E2E] rounded-xl p-4 ${
                obs.type === "positive" ? "border-l-green-500" :
                obs.type === "warning"  ? "border-l-amber-500" :
                "border-l-red-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">
                  {obs.type === "positive" ? "✅" :
                   obs.type === "warning"  ? "⚠️" : "🔴"}
                </span>
                <div>
                  <p className="font-semibold text-sm mb-1">{obs.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{obs.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {q.suggestions?.length > 0 && (
        <div className="mt-6 bg-[#111118] border border-[#1E1E2E] rounded-xl p-6">
          <h2 className="font-semibold mb-4">Suggested Improvements</h2>
          <ol className="space-y-2">
            {q.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-[#00D9FF] font-mono text-xs mt-0.5 shrink-0">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}