import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  "Fetching repository structure",
  "Reading key files",
  "Detecting tech stack",
  "Analyzing code quality",
  "Generating improvement suggestions",
  "Writing README",
];

export default function LoadingPage() {
  const navigate = useNavigate();
  const repoUrl = sessionStorage.getItem("repoUrl") || "";
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const progressRef = useRef(null);

  useEffect(() => {
    // Redirect if no URL
    if (!repoUrl) {
      navigate("/");
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    // Clear any old analysis data
    sessionStorage.removeItem("analysisResult");

    // Animate progress while waiting
    let step = 0;
    progressRef.current = setInterval(() => {
      step++;
      if (step < STEPS.length - 1) {
        setCurrentStepIndex(step);
      }
    }, 2000);

    // Actual API call
    const doFetch = async () => {
      const API_URL = import.meta.env.VITE_API_URL + "/api/analyze";
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: repoUrl }),
        });

        clearInterval(progressRef.current);

        if (!res.ok) {
          let errorMsg = `Server error (${res.status})`;
          try {
            const errData = await res.json();
            errorMsg = errData.error || errorMsg;
          } catch {
            // Response wasn't JSON
          }
          setError(errorMsg);
          return;
        }

        const data = await res.json();

        // Success — store data and navigate
        setCurrentStepIndex(STEPS.length);
        sessionStorage.setItem("analysisResult", JSON.stringify(data));
        setTimeout(() => navigate("/results"), 800);

      } catch (err) {
        clearInterval(progressRef.current);
        console.error("Analysis fetch failed:", err);
        setError(
          err.message === "Failed to fetch"
            ? `Cannot connect to backend server. Make sure the backend is running.`
            : err.message
        );
      }
    };

    doFetch();

    return () => {
      clearInterval(progressRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-depsdeps

  const repoName = repoUrl
    ? repoUrl.replace("https://github.com/", "")
    : "unknown/repo";

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-body dark">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50">
        <div
          className="text-xl font-black text-primary font-headline tracking-tight cursor-blink cursor-pointer"
          onClick={() => navigate("/")}
        >
          DevLens AI
        </div>
      </div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-2xl px-6 py-12 flex flex-col items-center z-10 relative">
        <div className="text-center mb-12 flex flex-col items-center space-y-3 w-full">
          <span className="font-label text-sm text-primary uppercase tracking-wider">
            {error ? "Analysis Failed" : "Analyzing..."}
          </span>
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">
            {repoName.split("/").join(" / ")}
          </h1>
          <div className="px-4 py-1.5 bg-surface-container-low rounded font-label text-xs text-secondary border border-outline-variant/15 w-auto inline-block truncate max-w-full">
            {repoUrl}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="w-full bg-surface-container-low rounded-xl p-8 border border-error/30 mb-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-error text-2xl mt-1">error</span>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-on-surface mb-2">Analysis Failed</h3>
                <p className="text-sm text-secondary mb-4">{error}</p>
                <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/15 mb-4">
                  <p className="font-label text-xs text-secondary mb-2">Common fixes:</p>
                  <ul className="text-xs text-on-surface-variant space-y-1 font-label">
                    <li>• Make sure the backend is running: <code className="text-primary-container">cd backend && python run.py</code></li>
                    <li>• Ensure you have an active internet connection to fetch repository metadata</li>
                    <li>• Make sure the GitHub URL is valid and the repo is public</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setError(null);
                      hasFetched.current = false;
                      setCurrentStepIndex(0);
                      // Re-trigger the effect
                      window.location.reload();
                    }}
                    className="bg-primary-container text-on-primary font-label text-sm px-4 py-2 rounded hover:bg-primary transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-surface-container-high text-secondary font-label text-sm px-4 py-2 rounded border border-outline-variant/15 hover:bg-surface-variant transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Container */}
        {!error && (
          <div className="w-full bg-surface-container-low rounded-xl p-8 relative overflow-hidden border border-outline-variant/15 shadow-[0_8px_32px_-8px_rgba(0,217,255,0.05)]">
            <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

            <div className="flex flex-col space-y-6">
              {STEPS.map((stepName, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isPending = idx > currentStepIndex;

                return (
                  <div key={idx} className="flex items-start space-x-4 relative">
                    {isCurrent && (
                      <div className="absolute -left-2 -top-2 w-10 h-10 bg-primary-container rounded-full blur-[12px] opacity-20"></div>
                    )}

                    <div
                      className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        isDone
                          ? "bg-[#1b1b20] border border-[#3c494d]/30"
                          : isCurrent
                          ? "bg-surface-container-high border border-primary animate-pulse"
                          : "border border-outline-variant/30"
                      }`}
                    >
                      {isDone && (
                        <span className="material-symbols-outlined text-[14px] text-[#b5f5be]">
                          check
                        </span>
                      )}
                      {isCurrent && (
                        <span className="material-symbols-outlined text-[14px] text-primary animate-spin">
                          sync
                        </span>
                      )}
                      {isPending && (
                        <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30"></div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={`font-body text-sm font-medium ${
                          isDone
                            ? "text-on-surface"
                            : isCurrent
                            ? "text-primary"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {stepName}
                      </span>
                      <span
                        className={`font-label text-xs uppercase mt-1 flex items-center space-x-2 ${
                          isDone
                            ? "text-[#b5f5be]"
                            : isCurrent
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        {isDone && "Done"}
                        {isCurrent && (
                          <>
                            <span>In Progress</span>
                            <span className="flex space-x-0.5 ml-2">
                              <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
                              <span className="w-1 h-1 bg-primary rounded-full opacity-50 animate-pulse"></span>
                              <span className="w-1 h-1 bg-primary rounded-full opacity-20 animate-pulse"></span>
                            </span>
                          </>
                        )}
                        {isPending && "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-outline-variant/15 w-full">
              <div className="flex justify-between items-end mb-2">
                <span className="font-label text-[10px] text-secondary uppercase tracking-wider">
                  Overall Progress
                </span>
                <span className="font-label text-xs text-primary">
                  {Math.min(100, Math.round((currentStepIndex / STEPS.length) * 100))}%
                </span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full relative transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${Math.min(100, (currentStepIndex / STEPS.length) * 100)}%`,
                  }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-white opacity-30"></div>
                </div>
              </div>
              <p className="text-center font-body text-xs text-on-surface-variant mt-4">
                This usually takes 10–20 seconds
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Decorative Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 flex justify-around opacity-[0.03] overflow-hidden select-none"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex flex-col space-y-4 font-label text-xs text-primary-fixed mt-12">
          <span>/src/components/App.js</span>
          <span>/packages/core/src/index.js</span>
          <span>/scripts/build.js</span>
          <span>/server/handler.js</span>
        </div>
        <div className="flex flex-col space-y-4 font-label text-xs text-secondary mt-32">
          <span>{"import { useState, useEffect } from 'react';"}</span>
          <span>{"export const createRoot = (container) => {"}</span>
          <span>{"  return new AppRoot(container);"}</span>
        </div>
        <div className="flex flex-col space-y-4 font-label text-xs text-primary-fixed mt-2">
          <span>/packages/shared/symbols.js</span>
          <span>/packages/dom/src/client/index.js</span>
          <span>/packages/scheduler/src/Scheduler.js</span>
        </div>
      </div>
    </div>
  );
}