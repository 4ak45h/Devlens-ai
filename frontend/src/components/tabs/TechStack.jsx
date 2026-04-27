const CATEGORY_COLORS = {
  frontend:  { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-400"   },
  backend:   { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
  testing:   { bg: "bg-pink-500/10",   border: "border-pink-500/30",   text: "text-pink-400"   },
  build:     { bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-400"  },
  database:  { bg: "bg-green-500/10",  border: "border-green-500/30",  text: "text-green-400"  },
  devops:    { bg: "bg-cyan-500/10",   border: "border-cyan-500/30",   text: "text-[#00D9FF]"  },
  default:   { bg: "bg-gray-500/10",   border: "border-gray-500/30",   text: "text-gray-400"   },
}

export default function TechStack({ data }) {
  const stack = data?.tech_stack || {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Technical Stack</h1>
        <p className="text-gray-500 text-sm">Detected technologies and frameworks</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stack).map(([category, techs]) => {
          const colors = CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.default
          return (
            <div key={category} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5">
              <h2 className="font-semibold text-sm capitalize mb-4 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${colors.text.replace("text-", "bg-")}`} />
                {category}
              </h2>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(techs) ? techs : [techs]).map(t => (
                  <span key={t}
                    className={`${colors.bg} ${colors.border} ${colors.text} border text-xs font-mono px-3 py-1 rounded-full`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}