import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const navigate = useNavigate();
  const repoUrl = sessionStorage.getItem("repoUrl") || "";
  const repoName = repoUrl.replace("https://github.com/", "");
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeSubTab, setActiveSubTab] = useState("Overview");
  const [copySuccess, setCopySuccess] = useState(false);
  const [data, setData] = useState(null);

  // Load real analysis data from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem("analysisResult");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setData(null);
      }
    }
  }, []);

  // Fallback values when no real data
  const analysis = data?.analysis || {};
  const meta = data?.meta || {};
  const repoInfo = data?.repo_info || {};

  const summary = analysis.summary || {};
  const techStack = analysis.tech_stack || {};
  const codeQuality = analysis.code_quality || {};
  const improvements = analysis.improvements || [];
  const architecture = analysis.architecture || {};
  const readme = analysis.readme || "";

  // Real stats from API
  const stats = {
    size: repoInfo.size_display || "—",
    filesAnalyzed: meta.files_analyzed || 0,
    totalFiles: meta.total_files_in_repo || 0,
    loc: meta.loc_display || "—",
    lang: { name: repoInfo.language || "—", percent: "" },
    deps: meta.dep_count || 0,
    time: meta.analysis_time || "—",
    stars: repoInfo.stars_display || "0",
    forks: repoInfo.forks_display || "0",
    license: repoInfo.license || "—",
    visibility: repoInfo.visibility || "public",
  };

  // ========== ACTIONS ==========

  function handleCopyReadme() {
    if (!readme) return;
    navigator.clipboard.writeText(readme).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  }

  function handleExportReport() {
    if (!data) return;
    const exportData = {
      repo_url: repoUrl,
      analyzed_at: new Date().toISOString(),
      repository: {
        name: repoName,
        stars: repoInfo.stars,
        forks: repoInfo.forks,
        language: repoInfo.language,
        license: repoInfo.license,
        size: repoInfo.size_display,
      },
      analysis_stats: {
        files_analyzed: meta.files_analyzed,
        total_files: meta.total_files_in_repo,
        lines_of_code: meta.total_loc,
        dependencies: meta.dep_count,
        analysis_time: meta.analysis_time,
        tokens_used: meta.tokens_used,
      },
      summary: analysis.summary,
      tech_stack: analysis.tech_stack,
      architecture: analysis.architecture,
      code_quality: analysis.code_quality,
      improvements: analysis.improvements,
      readme: analysis.readme,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devlens-report-${repoName.replace("/", "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // No data available message
  const noData = !data;

  // ========== TECH STACK CARDS ==========
  function buildStackCards() {
    const cards = [];
    if (techStack.frameworks?.length) {
      cards.push({ icon: "web", title: "Frameworks", items: techStack.frameworks, color: "text-primary-container" });
    }
    if (techStack.languages?.length) {
      cards.push({ icon: "code", title: "Languages", items: techStack.languages, color: "text-primary" });
    }
    if (techStack.testing?.length) {
      cards.push({ icon: "bug_report", title: "Testing", items: techStack.testing, color: "text-secondary" });
    }
    if (techStack.build_tools?.length) {
      cards.push({ icon: "build", title: "Build & Lint", items: techStack.build_tools, color: "text-tertiary" });
    }
    if (techStack.infrastructure?.length) {
      cards.push({ icon: "rocket_launch", title: "CI / CD", items: techStack.infrastructure, color: "text-primary-container" });
    }
    if (techStack.databases?.length) {
      cards.push({ icon: "database", title: "Databases", items: techStack.databases, color: "text-tertiary-container" });
    }
    // If nothing detected, show languages at minimum
    if (cards.length === 0 && repoInfo.language) {
      cards.push({ icon: "code", title: "Languages", items: [repoInfo.language], color: "text-primary" });
    }
    return cards;
  }

  // ========== CODE QUALITY ==========
  const qualityGrade = codeQuality.overall_grade || "—";
  const readabilityScore = codeQuality.readability_score || 0;
  const modularityScore = codeQuality.modularity_score || 0;
  const testCoverageScore = codeQuality.test_coverage_score || 0;
  const observations = codeQuality.observations || [];

  function getSeverityColor(severity) {
    if (severity === "critical") return "border-error text-error";
    if (severity === "warning") return "border-tertiary-container text-tertiary-container";
    return "border-primary-container text-primary-container";
  }
  function getSeverityIcon(severity, sentiment) {
    if (severity === "critical") return "warning";
    if (severity === "warning") return "lightbulb";
    if (sentiment === "positive") return "check_circle";
    return "info";
  }

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container dark">
      {/* TopNavBar */}
      <nav className="bg-[#1b1b20] text-[#00d9ff] font-headline font-bold tracking-tight top-0 sticky z-50 flex justify-between items-center px-6 py-3 w-full max-w-full border-b border-outline-variant/15">
        <div className="flex items-center gap-6">
          <div className="text-xl font-black text-[#afecff] cursor-blink cursor-pointer" onClick={() => navigate("/")}>DevLens AI</div>
          <div className="hidden md:flex items-center text-sm font-body text-secondary gap-2">
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate("/")}>Analysis</span>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-medium">{repoName}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-primary-container text-on-primary font-body font-medium text-sm px-4 py-2 rounded flex items-center gap-2 hover:bg-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Analysis
          </button>
          <div className="hidden md:flex items-center gap-4">
            <span 
              onClick={() => navigate("/how-it-works")}
              className="text-[#c6c4da] hover:text-[#afecff] hover:bg-[#1f1f25] transition-colors duration-200 cursor-pointer text-sm px-2 py-1 rounded"
            >
              How it works
            </span>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">hub</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar */}
        <aside className="bg-[#1b1b20] text-[#00d9ff] font-label uppercase tracking-wider text-xs border-r border-[#3c494d]/15 flex flex-col h-screen p-4 w-64 shrink-0 hidden lg:flex">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <img
                alt="Repository Owner Avatar"
                className="w-8 h-8 rounded-full border border-outline-variant/30"
                src={`https://github.com/${repoName.split("/")[0]}.png?size=100`}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div>
                <div className="text-on-surface font-body font-semibold text-sm capitalize">Repository Analysis</div>
                <div className="text-secondary font-label text-[10px]">Technical Audit</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 flex flex-col gap-1">
            {["Overview", "Architecture", "Stats", "Observations"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 px-3 py-2 text-left transition-all ${
                  activeTab === tab
                    ? "text-[#00d9ff] font-bold bg-[#1f1f25] border-l-4 border-[#00d9ff]"
                    : "text-[#c6c4da] hover:text-[#afecff] hover:bg-[#1f1f25] border-l-4 border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {tab === "Overview" ? "dashboard" : tab === "Architecture" ? "account_tree" : tab === "Stats" ? "query_stats" : "visibility"}
                </span>
                {tab}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <button
              onClick={handleExportReport}
              disabled={noData}
              className="bg-primary-container text-on-primary font-label text-xs py-2.5 px-4 rounded border border-outline-variant/15 hover:bg-primary transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export Report
            </button>
            <div className="flex flex-col gap-1 pt-4 border-t border-outline-variant/15">
              <a className="flex items-center gap-3 px-3 py-2 text-[#c6c4da] hover:text-[#afecff] hover:bg-[#1f1f25] transition-all" href="#">
                <span className="material-symbols-outlined text-[18px]">description</span> Docs
              </a>
              <a className="flex items-center gap-3 px-3 py-2 text-[#c6c4da] hover:text-[#afecff] hover:bg-[#1f1f25] transition-all" href={repoUrl} target="_blank" rel="noreferrer">
                <span className="material-symbols-outlined text-[18px]">terminal</span> GitHub
              </a>
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto bg-surface relative flex flex-col h-screen">
          {/* Header Area */}
          <div className="max-w-7xl mx-auto px-6 py-8 md:px-12 md:pt-12 md:pb-4 flex flex-col gap-8 w-full border-b border-outline-variant/15 bg-surface-container-lowest sticky top-0 z-30">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3 font-label text-xs">
                  <span className="bg-surface-variant text-on-surface px-2 py-1 rounded-sm flex items-center gap-1 border border-outline-variant/15 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                    {stats.visibility}
                  </span>
                  <span className="bg-surface-container text-secondary px-2 py-1 rounded-sm border border-outline-variant/15 uppercase">
                    {noData ? "NO DATA — RUN BACKEND" : "ANALYZED JUST NOW"}
                  </span>
                </div>
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface flex items-baseline gap-2">
                  {repoName.split("/")[0] || "owner"} <span className="text-outline-variant font-light">/</span> {repoName.split("/")[1] || "repo"}
                </h1>
                {activeTab === "Overview" && (
                  <div className="flex flex-wrap items-center gap-4 text-sm font-body text-secondary mt-2">
                    <span className="flex items-center gap-1"><span className="text-tertiary-container">⭐</span> {stats.stars}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="flex items-center gap-1"><span className="text-secondary-container">🍴</span> {stats.forks}</span>
                    <span className="text-outline-variant">•</span>
                    <span>{stats.lang.name}</span>
                    <span className="text-outline-variant">•</span>
                    <span>{stats.license}</span>
                  </div>
                )}
                {activeTab === "Observations" && (
                  <p className="font-label text-sm text-secondary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
                    ANALYSIS COMPLETE
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                {activeTab === "Observations" && (
                  <>
                    <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/15 flex flex-col hidden sm:flex">
                      <span className="font-label text-xs text-secondary">PROJECT SIZE</span>
                      <span className="font-label text-primary font-bold">{stats.size}</span>
                    </div>
                    <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/15 flex flex-col hidden sm:flex">
                      <span className="font-label text-xs text-secondary">FILES ANALYZED</span>
                      <span className="font-label text-primary font-bold">{stats.filesAnalyzed}</span>
                    </div>
                  </>
                )}
                {activeTab === "Overview" && (
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={handleCopyReadme}
                      disabled={!readme}
                      className="bg-surface-container-high text-primary font-label text-sm px-4 py-2 rounded flex items-center gap-2 border border-outline-variant/15 hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[18px]">{copySuccess ? "check" : "content_copy"}</span>
                      {copySuccess ? "Copied!" : "Copy README"}
                    </button>
                    <button
                      onClick={handleExportReport}
                      disabled={noData}
                      className="bg-primary-container text-on-primary font-body font-medium text-sm px-5 py-2 rounded flex items-center gap-2 hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export Report
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Page Tabs for Overview */}
            {activeTab === "Overview" && (
              <div className="flex items-center gap-6 mt-4 overflow-x-auto no-scrollbar">
                {["Overview", "Tech Stack", "Code Quality", "README"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`font-label text-sm pb-3 border-b-2 whitespace-nowrap transition-colors ${
                      activeSubTab === tab ? "text-primary border-primary" : "text-secondary hover:text-on-surface border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="max-w-7xl mx-auto px-6 py-6 md:px-12 w-full flex-1">

            {/* No data warning */}
            {noData && (
              <div className="bg-surface-container border border-tertiary-container/30 rounded-lg p-6 mb-6 flex items-start gap-4">
                <span className="material-symbols-outlined text-tertiary-container">warning</span>
                <div>
                  <h3 className="font-headline font-bold text-on-surface mb-1">No analysis data</h3>
                  <p className="text-sm text-secondary">The backend is not running or the analysis failed. Start the Flask backend with your Gemini API key to see real results.</p>
                  <code className="font-label text-xs text-primary-container mt-2 block">cd backend && python run.py</code>
                </div>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === "Overview" && activeSubTab === "Overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <section className="bg-surface-container-low rounded-lg p-6 md:p-8 border border-outline-variant/15 relative overflow-hidden group hover:bg-surface-container transition-colors duration-300">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary to-primary-container opacity-50"></div>
                    <h2 className="font-headline text-xl font-bold mb-4 text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                      What this project does
                    </h2>
                    <p className="font-body text-secondary text-sm leading-relaxed">
                      {summary.description || "No AI summary available. Run the backend to generate analysis."}
                    </p>
                    {summary.purpose && (
                      <p className="font-body text-on-surface-variant text-xs mt-4 pt-4 border-t border-outline-variant/15 italic">
                        <strong>Core purpose:</strong> {summary.purpose}
                      </p>
                    )}
                  </section>

                  {/* Architecture Pattern */}
                  <section className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/15 hover:bg-surface-container transition-colors duration-300">
                    <h2 className="font-headline text-lg font-bold mb-4 text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">architecture</span>
                      Architecture Pattern
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {(architecture.patterns || []).length > 0 ? (
                        architecture.patterns.map((p, i) => (
                          <span key={i} className="bg-surface-variant text-on-surface font-label text-xs px-3 py-1.5 rounded-sm border border-outline-variant/20 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ["#00d9ff", "#ffdeaa", "#b5f5be", "#ffb4ab"][i % 4] }}></span>
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-secondary text-sm">No patterns detected</span>
                      )}
                    </div>
                  </section>

                  {/* Key Observations */}
                  <section className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/15 hover:bg-surface-container transition-colors duration-300">
                    <h2 className="font-headline text-lg font-bold mb-4 text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary-container text-[20px]">lightbulb</span>
                      Key Observations
                    </h2>
                    <ul className="flex flex-col gap-4 font-body text-sm text-secondary">
                      {observations.length > 0
                        ? observations.slice(0, 5).map((obs, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{
                                background: obs.sentiment === "positive" ? "#b5f5be" : obs.sentiment === "negative" ? "#ffb4ab" : "#00d9ff"
                              }}></span>
                              <span>{obs.title}: {obs.description}</span>
                            </li>
                          ))
                        : <li className="text-secondary text-sm">No observations available</li>
                      }
                    </ul>
                  </section>
                </div>

                {/* Right Column (Stats) */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  {[
                    { label: "Files Analyzed", value: stats.filesAnalyzed, icon: "folder_open" },
                    { label: "Lines of Code", value: stats.loc, icon: "data_object" },
                    { label: "Primary Language", value: stats.lang.name, icon: "code" },
                    { label: "Dependencies", value: stats.deps, icon: "account_tree" },
                    { label: "Analysis Time", value: stats.time, icon: "timer", highlight: true },
                  ].map(s => (
                    <div key={s.label} className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/15 flex items-center justify-between hover:bg-surface-container transition-colors duration-300">
                      <div className="flex flex-col gap-1">
                        <span className="font-label text-xs text-secondary uppercase tracking-wider">{s.label}</span>
                        <span className={`font-label text-2xl font-medium ${s.highlight ? "text-primary" : "text-on-surface"}`}>{s.value}</span>
                      </div>
                      <span className={`material-symbols-outlined ${s.highlight ? "text-primary/40" : "text-outline-variant"} text-[32px]`}>{s.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OVERVIEW → Tech Stack sub-tab */}
            {activeTab === "Overview" && activeSubTab === "Tech Stack" && (
              <div className="flex flex-col gap-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buildStackCards().map((card, i) => (
                    <div key={i} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/15 flex flex-col hover:brightness-105 transition-all">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/15">
                        <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
                        <h3 className="font-headline text-lg">{card.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {card.items.map((item, j) => (
                          <span key={j} className="font-label text-xs bg-surface-variant text-on-surface-variant px-3 py-1.5 rounded-md flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary-container"></span> {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {techStack.evidence && (
                  <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/15">
                    <h3 className="font-headline text-sm font-bold text-secondary mb-2">Detection Evidence</h3>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed">{techStack.evidence}</p>
                  </div>
                )}
              </div>
            )}

            {/* OVERVIEW → Code Quality sub-tab */}
            {activeTab === "Overview" && activeSubTab === "Code Quality" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-1 bg-surface-container-low rounded-xl p-8 border border-outline-variant/15 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
                  <h4 className="font-label text-sm text-secondary mb-4 uppercase tracking-widest z-10">Overall Grade</h4>
                  <div className="text-8xl font-headline font-bold text-primary-container drop-shadow-[0_0_15px_rgba(0,217,255,0.3)] z-10">{qualityGrade}</div>
                  <div className="w-full mt-10 flex flex-col gap-4 z-10">
                    {[
                      { label: "Readability", value: readabilityScore, color: "bg-primary-container", textColor: "text-primary-container" },
                      { label: "Modularity", value: modularityScore, color: "bg-tertiary-container", textColor: "text-tertiary-container" },
                      { label: "Test Coverage", value: testCoverageScore, color: testCoverageScore < 50 ? "bg-error" : "bg-primary-container", textColor: testCoverageScore < 50 ? "text-error" : "text-primary-container" },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex justify-between font-label text-xs mb-2">
                          <span className="text-on-surface">{m.label}</span>
                          <span className={m.textColor}>{m.value}%</span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                          <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {observations.length > 0
                    ? observations.map((obs, i) => (
                        <div key={i} className={`bg-surface-container p-5 rounded-lg border-l-4 ${getSeverityColor(obs.severity)} flex gap-4 items-start shadow-sm hover:brightness-105 transition-all`}>
                          <span className={`material-symbols-outlined ${getSeverityColor(obs.severity).split(" ")[1]} mt-0.5`}>
                            {getSeverityIcon(obs.severity, obs.sentiment)}
                          </span>
                          <div>
                            <h4 className="font-headline text-on-surface mb-1">{obs.title}</h4>
                            <p className="text-sm text-secondary leading-relaxed">
                              {obs.description}
                              {obs.file_hint && <code className="font-label text-xs bg-surface-container-highest px-1.5 py-0.5 rounded text-primary-container ml-1">{obs.file_hint}</code>}
                            </p>
                          </div>
                        </div>
                      ))
                    : <p className="text-secondary text-sm">No quality observations available.</p>
                  }
                </div>
              </div>
            )}

            {/* OVERVIEW → README sub-tab */}
            {activeTab === "Overview" && activeSubTab === "README" && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline text-xl font-bold text-on-surface">Generated README</h2>
                  <button
                    onClick={handleCopyReadme}
                    disabled={!readme}
                    className="bg-primary-container text-on-primary font-label text-sm px-4 py-2 rounded flex items-center gap-2 hover:bg-primary transition-colors disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-[18px]">{copySuccess ? "check" : "content_copy"}</span>
                    {copySuccess ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>
                <div className="bg-surface-container-low rounded-lg p-6 md:p-8 border border-outline-variant/15">
                  {readme ? (
                    <pre className="font-body text-sm text-secondary whitespace-pre-wrap leading-relaxed overflow-x-auto">{readme}</pre>
                  ) : (
                    <p className="text-secondary text-sm">No README generated. Run the backend analysis first.</p>
                  )}
                </div>
              </div>
            )}

            {/* OBSERVATIONS TAB (side nav) */}
            {activeTab === "Observations" && (
              <div className="flex flex-col gap-12 mt-4 pb-12">
                {/* Tech Stack Bento Grid */}
                <section className="flex flex-col gap-6">
                  <h2 className="text-2xl font-headline text-primary">Technical Stack</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {buildStackCards().map((card, i) => (
                      <div key={i} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/15 flex flex-col hover:brightness-105 transition-all">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/15">
                          <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
                          <h3 className="font-headline text-lg">{card.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {card.items.map((item, j) => (
                            <span key={j} className="font-label text-xs bg-surface-variant text-on-surface-variant px-3 py-1.5 rounded-md flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary-container"></span> {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Code Quality Section */}
                <section className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-headline text-primary">Code Quality Audit</h2>
                    <span className="font-label text-xs text-secondary border border-outline-variant/30 px-3 py-1 rounded-full italic">Simulated AI Analysis (Demo)</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-surface-container-low rounded-xl p-8 border border-outline-variant/15 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
                      <h4 className="font-label text-sm text-secondary mb-4 uppercase tracking-widest z-10">Overall Grade</h4>
                      <div className="text-8xl font-headline font-bold text-primary-container drop-shadow-[0_0_15px_rgba(0,217,255,0.3)] z-10">{qualityGrade}</div>
                      <div className="w-full mt-10 flex flex-col gap-4 z-10">
                        {[
                          { label: "Readability", value: readabilityScore, color: "bg-primary-container", textColor: "text-primary-container" },
                          { label: "Modularity", value: modularityScore, color: "bg-tertiary-container", textColor: "text-tertiary-container" },
                          { label: "Test Coverage", value: testCoverageScore, color: testCoverageScore < 50 ? "bg-error" : "bg-primary-container", textColor: testCoverageScore < 50 ? "text-error" : "text-primary-container" },
                        ].map(m => (
                          <div key={m.label}>
                            <div className="flex justify-between font-label text-xs mb-2">
                              <span className="text-on-surface">{m.label}</span>
                              <span className={m.textColor}>{m.value}%</span>
                            </div>
                            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                              <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.value}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-4">
                      {observations.length > 0
                        ? observations.map((obs, i) => (
                            <div key={i} className={`bg-surface-container p-5 rounded-lg border-l-4 ${getSeverityColor(obs.severity)} flex gap-4 items-start shadow-sm hover:brightness-105 transition-all`}>
                              <span className={`material-symbols-outlined ${getSeverityColor(obs.severity).split(" ")[1]} mt-0.5`}>
                                {getSeverityIcon(obs.severity, obs.sentiment)}
                              </span>
                              <div>
                                <h4 className="font-headline text-on-surface mb-1">{obs.title}</h4>
                                <p className="text-sm text-secondary leading-relaxed">{obs.description}</p>
                              </div>
                            </div>
                          ))
                        : <p className="text-secondary text-sm">No quality observations available.</p>
                      }
                    </div>
                  </div>
                </section>

                {/* Improvements Section */}
                {improvements.length > 0 && (
                  <section className="flex flex-col gap-6">
                    <h2 className="text-2xl font-headline text-primary">Improvement Suggestions</h2>
                    <div className="flex flex-col gap-4">
                      {improvements.map((imp, i) => (
                        <div key={i} className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/15 flex gap-4 items-start hover:brightness-105 transition-all">
                          <span className={`font-label text-xs font-bold px-2 py-1 rounded ${
                            imp.priority === "P1" ? "bg-error-container text-on-error-container" :
                            imp.priority === "P2" ? "bg-tertiary-container text-on-tertiary-container" :
                            "bg-surface-variant text-on-surface-variant"
                          }`}>{imp.priority}</span>
                          <div className="flex-1">
                            <h4 className="font-headline text-on-surface mb-1">{imp.title}</h4>
                            <p className="text-sm text-secondary leading-relaxed">{imp.description}</p>
                            {imp.file_hint && (
                              <code className="font-label text-xs text-primary-container mt-2 inline-block">{imp.file_hint}</code>
                            )}
                          </div>
                          <span className={`font-label text-[10px] uppercase px-2 py-0.5 rounded border ${
                            imp.effort === "low" ? "text-[#b5f5be] border-[#b5f5be]/30" :
                            imp.effort === "medium" ? "text-tertiary-container border-tertiary-container/30" :
                            "text-error border-error/30"
                          }`}>{imp.effort}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* ARCHITECTURE TAB */}
            {activeTab === "Architecture" && (
              <div className="flex flex-col gap-6 mt-4">
                <div className="bg-surface-container-low rounded-lg p-6 md:p-8 border border-outline-variant/15">
                  <h2 className="font-headline text-xl font-bold mb-4 text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">architecture</span>
                    Architecture Patterns
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {(architecture.patterns || []).map((p, i) => (
                      <span key={i} className="bg-surface-variant text-on-surface font-label text-sm px-4 py-2 rounded-sm border border-outline-variant/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: ["#00d9ff", "#ffdeaa", "#b5f5be", "#ffb4ab"][i % 4] }}></span> {p}
                      </span>
                    ))}
                  </div>
                  {architecture.evidence && (
                    <p className="text-sm text-secondary leading-relaxed">{architecture.evidence}</p>
                  )}
                </div>
              </div>
            )}

            {/* STATS TAB */}
            {activeTab === "Stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {[
                  { label: "Total Files in Repo", value: stats.totalFiles, icon: "inventory_2" },
                  { label: "Files Analyzed", value: stats.filesAnalyzed, icon: "folder_open" },
                  { label: "Lines of Code", value: stats.loc, icon: "data_object" },
                  { label: "Primary Language", value: stats.lang.name, icon: "code" },
                  { label: "Dependencies", value: stats.deps, icon: "account_tree" },
                  { label: "Stars", value: stats.stars, icon: "star" },
                  { label: "Forks", value: stats.forks, icon: "fork_right" },
                  { label: "License", value: stats.license, icon: "gavel" },
                  { label: "Project Size", value: stats.size, icon: "hard_drive" },
                  { label: "Analysis Time", value: stats.time, icon: "timer", highlight: true },
                ].map(s => (
                  <div key={s.label} className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/15 flex items-center justify-between hover:bg-surface-container transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                      <span className="font-label text-xs text-secondary uppercase tracking-wider">{s.label}</span>
                      <span className={`font-label text-2xl font-medium ${s.highlight ? "text-primary" : "text-on-surface"}`}>{s.value}</span>
                    </div>
                    <span className={`material-symbols-outlined ${s.highlight ? "text-primary/40" : "text-outline-variant"} text-[32px]`}>{s.icon}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-[#131318] border-t border-[#3c494d]/15 flex justify-between items-center px-8 py-4 w-full mt-auto">
            <div className="flex flex-col">
              <div className="text-[#c6c4da] font-label text-[10px] uppercase">© 2026 Akash Jatikart</div>
              <div className="text-primary-container text-[10px] mt-0.5">Demo Mode: Simulated AI Analysis (No API keys required)</div>
            </div>
            <div className="flex items-center gap-6 text-[#c6c4da] font-label text-[10px] uppercase">
              <a className="hover:text-[#afecff] transition-colors" href="#">GitHub</a>
              <a className="hover:text-[#afecff] transition-colors" href="#">Documentation</a>
              <a className="hover:text-[#afecff] transition-colors" href="#">Privacy</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}