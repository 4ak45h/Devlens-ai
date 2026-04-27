import { useNavigate } from "react-router-dom";

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col antialiased font-body dark">
      {/* TopNavBar */}
      <nav className="bg-[#1b1b20] font-headline font-bold tracking-tight docked full-width top-0 sticky z-50 flex justify-between items-center px-6 py-3 w-full max-w-full">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-[#afecff] cursor-blink cursor-pointer" onClick={() => navigate("/")}>DevLens AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate("/how-it-works")}
            className="text-[#afecff] bg-[#1f1f25] px-3 py-1 rounded scale-95 transition-all"
          >
            How it works
          </button>
          <a
            className="text-[#c6c4da] hover:text-[#afecff] hover:bg-[#1f1f25] transition-colors duration-200 px-3 py-1 rounded scale-95"
            href="#"
          >
            Docs
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="bg-primary-container text-on-primary font-headline font-bold px-4 py-1.5 rounded hover:bg-primary-fixed transition-all text-sm"
          >
            GET STARTED
          </button>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center px-6 py-20 w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center flex flex-col items-center space-y-6 mb-20">
          <div className="inline-flex items-center px-4 py-1 bg-[#1f1f25] border border-outline-variant/20 rounded-full font-label text-[10px] text-primary tracking-widest uppercase">
            Simplified Intelligence
          </div>
          
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight max-w-4xl leading-tight">
            Understand your codebase in <span className="text-[#afecff]">three simple steps.</span>
          </h1>

          <p className="font-body text-lg text-secondary max-w-2xl leading-relaxed">
            Stop drowning in documentation. DevLens transforms complex repositories into clear, actionable insights through a streamlined AI-powered workflow.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-8 bg-primary-container text-on-primary font-headline font-bold px-10 py-4 rounded hover:bg-primary-fixed transition-all shadow-[0_0_20px_rgba(0,217,255,0.2)] uppercase text-sm tracking-wider"
          >
            Analyze My Project Now
          </button>
        </div>

        {/* Steps Section */}
        <div className="w-full flex flex-col items-center space-y-0 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute top-20 bottom-20 w-[1px] bg-gradient-to-b from-transparent via-outline-variant/30 to-transparent hidden md:block"></div>

          {/* Step 1 */}
          <div className="w-full max-w-3xl bg-[#1b1b20] rounded-2xl p-8 border border-outline-variant/10 flex items-start gap-8 group hover:border-primary/30 transition-all mb-12 relative z-10">
            <div className="w-16 h-16 bg-[#1f1f25] rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/15 group-hover:bg-primary-container transition-all">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-3xl">link</span>
            </div>
            <div>
              <span className="font-label text-[10px] text-primary-fixed-dim uppercase tracking-[0.2em] mb-2 block">Step 01</span>
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">Connect Your Repository</h3>
              <p className="font-body text-secondary text-sm leading-relaxed">
                Simply paste your GitHub, GitLab, or Bitbucket URL. Our secure engine initiates a transient, encrypted scan of your codebase without ever storing your private IP.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="w-full max-w-3xl bg-[#1b1b20] rounded-2xl p-8 border border-outline-variant/10 flex items-start gap-8 group hover:border-primary/30 transition-all mb-12 relative z-10">
            <div className="w-16 h-16 bg-[#1f1f25] rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/15 group-hover:bg-primary-container transition-all">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-3xl">psychology</span>
            </div>
            <div>
              <span className="font-label text-[10px] text-primary-fixed-dim uppercase tracking-[0.2em] mb-2 block">Step 02</span>
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">AI Deep Analysis</h3>
              <p className="font-body text-secondary text-sm leading-relaxed">
                Our proprietary LLM layer maps dependency graphs and identifies architectural patterns. It detects technical debt, security vulnerabilities, and logic inconsistencies in real-time.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="w-full max-w-3xl bg-[#1b1b20] rounded-2xl p-8 border border-outline-variant/10 flex items-start gap-8 group hover:border-primary/30 transition-all relative z-10">
            <div className="w-16 h-16 bg-[#1f1f25] rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/15 group-hover:bg-primary-container transition-all">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-3xl">insights</span>
            </div>
            <div>
              <span className="font-label text-[10px] text-primary-fixed-dim uppercase tracking-[0.2em] mb-2 block">Step 03</span>
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">Instant Visual Insights</h3>
              <p className="font-body text-secondary text-sm leading-relaxed">
                Receive a comprehensive dashboard featuring interactive architecture maps, health scores, and prioritized refactoring suggestions to keep your team moving fast.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center flex flex-col items-center space-y-6">
          <h2 className="font-headline text-3xl font-bold text-on-surface">Ready to see your code clearly?</h2>
          <p className="font-body text-secondary text-sm">Join 500+ engineering teams using DevLens to maintain world-class code quality.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-primary-container text-on-primary font-headline font-bold px-10 py-4 rounded hover:bg-primary-fixed transition-all uppercase text-sm tracking-wider"
          >
            Analyze My Project Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#131318] text-[#c6c4da] font-label text-[10px] uppercase docked full-width border-t border-[#3c494d]/15 flex justify-between items-center px-8 py-6 w-full mt-20">
        <div className="flex flex-col">
          <div className="font-bold text-[#afecff] mb-1">DevLens AI</div>
          <div>© 2026 Akash Jatikart</div>
        </div>
        <div className="flex gap-6">
          <a className="hover:text-[#afecff] transition-colors" href="#">Status</a>
          <a className="hover:text-[#afecff] transition-colors" href="#">API</a>
          <a className="hover:text-[#afecff] transition-colors" href="#">Privacy</a>
          <a className="hover:text-[#afecff] transition-colors" href="#">Terms</a>
        </div>
      </footer>
    </div>
  );
}
