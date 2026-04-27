import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function isValidGithubUrl(val) {
    return /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(val);
  }

  function handleAnalyze(repoUrl) {
    const target = repoUrl || url;
    if (!isValidGithubUrl(target)) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }
    setError("");
    sessionStorage.setItem("repoUrl", target);
    navigate("/analyzing");
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col antialiased font-body dark">
      {/* TopNavBar */}
      <nav className="bg-[#1b1b20] font-headline font-bold tracking-tight docked full-width top-0 sticky z-50 flex justify-between items-center px-6 py-3 w-full max-w-full">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-[#afecff] cursor-blink">DevLens AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate("/how-it-works")}
            className="text-[#c6c4da] hover:text-[#afecff] hover:bg-[#1f1f25] transition-colors duration-200 px-3 py-1 rounded scale-95 duration-100"
          >
            How it works
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="github" className="text-[#c6c4da] hover:text-[#afecff] transition-colors">
            <span className="material-symbols-outlined">terminal</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-24 md:py-32 w-full max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="w-full text-center flex flex-col items-center space-y-8 mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-variant px-4 py-1.5 rounded-full font-label text-sm text-secondary-fixed">
            <span className="w-2 h-2 rounded-full bg-surface-tint shadow-[0_0_8px_rgba(0,217,255,0.6)] animate-pulse"></span>
            <span>DEMO MODE: SIMULATED AI ANALYSIS</span>
          </div>

          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight max-w-4xl leading-tight">
            Understand any codebase in <span className="text-primary-fixed-dim">seconds.</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-secondary max-w-2xl leading-relaxed">
            Paste a public GitHub repository URL. DevLens AI reads the code, detects the stack, reviews quality, and
            writes your README — instantly.
          </p>

          {/* URL Input */}
          <div className="w-full max-w-3xl mt-8 flex flex-col items-center">
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20 hover:border-surface-tint/50 transition-colors shadow-[0_0_15px_rgba(0,217,255,0.05)] focus-within:shadow-[0_0_20px_rgba(0,217,255,0.15)] focus-within:border-surface-tint w-full">
              <span className="material-symbols-outlined text-secondary pl-3">link</span>
              <input
                className="flex-grow bg-transparent border-none focus:ring-0 font-label text-on-surface placeholder:text-outline h-12 w-full outline-none"
                placeholder="https://github.com/username/repository"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <button
                onClick={() => handleAnalyze()}
                className="bg-primary-container text-on-primary font-headline font-bold px-8 py-3 rounded hover:bg-primary-fixed transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Analyze <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            {error && <p className="text-error text-sm font-label mt-2 w-full text-left">{error}</p>}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-outline font-label">
              <span className="material-symbols-outlined text-[16px]">public</span> Works with any public repository
              <span className="mx-2 text-outline-variant">•</span>
              <span className="material-symbols-outlined text-[16px]">bolt</span> Free to use
            </div>
          </div>
        </div>

        {/* Feature Strip */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 py-16 border-t border-outline-variant/15">
          <div className="flex flex-col space-y-3">
            <span className="material-symbols-outlined text-surface-tint text-3xl">account_tree</span>
            <h3 className="font-headline font-bold text-on-surface text-lg">Tech Stack Detection</h3>
            <p className="font-body text-secondary text-sm">Instantly identify languages, frameworks, and dependencies.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="material-symbols-outlined text-surface-tint text-3xl">fact_check</span>
            <h3 className="font-headline font-bold text-on-surface text-lg">Code Quality Review</h3>
            <p className="font-body text-secondary text-sm">Deep analysis of patterns, anti-patterns, and overall architecture.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="material-symbols-outlined text-surface-tint text-3xl">lightbulb</span>
            <h3 className="font-headline font-bold text-on-surface text-lg">Improvement Suggestions</h3>
            <p className="font-body text-secondary text-sm">Actionable insights to optimize performance and readability.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="material-symbols-outlined text-surface-tint text-3xl">description</span>
            <h3 className="font-headline font-bold text-on-surface text-lg">Auto-generated README</h3>
            <p className="font-body text-secondary text-sm">Comprehensive documentation written tailored to the codebase.</p>
          </div>
        </div>

        {/* Sample Repos */}
        <div className="w-full py-16 flex flex-col items-center">
          <h2 className="font-headline font-bold text-2xl text-on-surface mb-8">Try it with a popular repo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div
              onClick={() => handleAnalyze("https://github.com/facebook/react")}
              className="bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg p-6 border border-outline-variant/15 cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">book</span>
                  <span className="font-label font-bold text-on-surface">facebook/react</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-surface-tint transition-colors">
                  arrow_outward
                </span>
              </div>
              <div className="mt-auto pt-6 flex gap-4 font-label text-xs text-secondary">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#f7df1e]"></span> JavaScript
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">folder</span> 2.4k files
                </div>
              </div>
            </div>

            <div
              onClick={() => handleAnalyze("https://github.com/vercel/next.js")}
              className="bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg p-6 border border-outline-variant/15 cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">book</span>
                  <span className="font-label font-bold text-on-surface">vercel/next.js</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-surface-tint transition-colors">
                  arrow_outward
                </span>
              </div>
              <div className="mt-auto pt-6 flex gap-4 font-label text-xs text-secondary">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#3178c6]"></span> TypeScript
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">folder</span> 3.1k files
                </div>
              </div>
            </div>

            <div
              onClick={() => handleAnalyze("https://github.com/django/django")}
              className="bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg p-6 border border-outline-variant/15 cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">book</span>
                  <span className="font-label font-bold text-on-surface">django/django</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-surface-tint transition-colors">
                  arrow_outward
                </span>
              </div>
              <div className="mt-auto pt-6 flex gap-4 font-label text-xs text-secondary">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#3776ab]"></span> Python
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">folder</span> 6.8k files
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#131318] text-[#c6c4da] font-label text-[10px] uppercase docked full-width bottom-0 border-t border-[#3c494d]/15 flex justify-between items-center px-8 py-4 w-full">
        <div className="flex flex-col">
          <div>© 2026 Akash Jatikart</div>
          <div className="text-primary-container mt-1 normal-case tracking-normal">Demo Mode: Simulated AI Analysis (No API keys required)</div>
        </div>
        <div className="flex gap-6">
          <a className="text-[#c6c4da] hover:text-[#afecff] transition-colors" href="#">
            GitHub
          </a>
          <a className="text-[#c6c4da] hover:text-[#afecff] transition-colors" href="#">
            Documentation
          </a>
          <a className="text-[#c6c4da] hover:text-[#afecff] transition-colors" href="#">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}