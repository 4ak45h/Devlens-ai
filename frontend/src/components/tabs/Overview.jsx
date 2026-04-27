export default function Overview({ data }) {
  const o = data?.overview || {}

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00D9FF] pulse-dot" />
            <span className="font-mono text-xs text-[#00D9FF]">ANALYSIS COMPLETE</span>
          </div>
          <h1 className="text-3xl font-bold">
            {data?.repo_name || "Repository"}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            {data?.stars    && <span>⭐ {data.stars}</span>}
            {data?.language && <span>· {data.language}</span>}
            {data?.license  && <span>· {data.license}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <span className="font-mono text-xs border border-[#1E1E2E] px-2 py-1 rounded text-gray-400">PUBLIC</span>
          <span className="font-mono text-xs border border-[#1E1E2E] px-2 py-1 rounded text-gray-400">ANALYZED JUST NOW</span>
        </div>
      </div>

      {/* Tabs row */}
      <div className="flex gap-6 border-b border-[#1E1E2E] mb-8 text-sm">
        {["Overview", "Tech Stack", "Code Quality", "README"].map((t, i) => (
          <span key={t} className={`pb-3 cursor-default ${i === 0 ? "text-white border-b-2 border-[#00D9FF]" : "text-gray-500"}`}>
            {t}
          </span>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-3 gap-6">

        {/* Left: analysis content */}
        <div className="col-span-2 space-y-6">

          {/* What it does */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-3">
              <span>🎯</span> What this project does
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {o.summary || "Loading summary..."}
            </p>
          </div>

          {/* Architecture */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-4">
              <span>Λ</span> Architecture Pattern
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {(o.architecture_patterns || []).map(p => (
                <span key={p} className="bg-[#00D9FF15] border border-[#00D9FF30] text-[#00D9FF] text-xs font-mono px-3 py-1 rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Key observations */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6">
            <h2 className="flex items-center gap-2 font-semibold mb-4">
              <span>💡</span> Key Observations
            </h2>
            <ul className="space-y-3">
              {(o.key_observations || []).map((obs, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    i === 0 ? "bg-green-400" : "bg-amber-400"
                  }`} />
                  {obs}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: stat cards */}
        <div className="space-y-3">
          {[
            { label: "FILES ANALYZED",    value: data?.stats?.files_analyzed,  icon: "📁" },
            { label: "LINES OF CODE",     value: data?.stats?.lines_of_code,   icon: "📝" },
            { label: "PRIMARY LANGUAGE",  value: data?.stats?.primary_language,icon: "🔤" },
            { label: "DEPENDENCIES",      value: data?.stats?.dependencies,    icon: "📦" },
            { label: "ANALYSIS TIME",     value: data?.stats?.analysis_time,   icon: "⏱" },
          ].map(s => (
            <div key={s.label} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-4">
              <p className="font-mono text-xs text-gray-500 mb-1">{s.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">{s.value ?? "—"}</p>
                <span className="text-lg">{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}