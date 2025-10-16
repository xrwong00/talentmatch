import Image from "next/image";
import HeroDiscoveryButton from "./components/HeroDiscoveryButton";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-24 pt-6 pb-20 md:pt-8 md:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/50 via-background to-blue-50/30 dark:from-emerald-950/20 dark:via-background dark:to-blue-950/10"></div>
        
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Image src="/talentmatch-logo.svg" alt="TalentMatch" width={40} height={40} className="drop-shadow-sm" />
            <span className="text-xl font-semibold tracking-tight">TalentMatch</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Stories</a>
            <a href="#cta" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Get started</a>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mt-16 md:mt-20">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              Don&apos;t just find jobs—
              <span className="block text-emerald-600 dark:text-emerald-400 mt-2">discover who you can become</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-black/70 dark:text-white/70 leading-relaxed">
              Malaysia&apos;s first AI career platform that predicts your path, matches Day-1 roles, and guides your evolution to senior positions—all personalized to you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <HeroDiscoveryButton />
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border-2 border-black/10 dark:border-white/20 px-8 h-12 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/30 transition-all"
              >
                Explore features
              </a>
            </div>
            <div className="mt-8 flex items-center gap-8 text-sm text-black/60 dark:text-white/60">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium">Trusted by Malaysian grads</span>
              </div>
              <div className="font-medium">Free forever for students</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 blur-3xl -z-10"></div>
        <Image
              src="/hero-illustration.svg"
              alt="TalentMatch hero illustration"
              width={640}
              height={480}
              className="w-full h-auto drop-shadow-2xl"
          priority
        />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 bg-gradient-to-b from-transparent via-black/[.02] to-transparent dark:via-white/[.02]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">See who you can become</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70">AI-powered tools that map your career evolution, not just your next job</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-2xl">
              🧠
            </div>
            <h3 className="text-lg font-semibold">AI Persona Profiling</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              3-minute reflection analysis that predicts your career path from Day-1 roles to senior positions in 2–5 years.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent hover:shadow-xl hover:shadow-blue-500/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-2xl">
              🌱
            </div>
            <h3 className="text-lg font-semibold">Career Evolution Feed</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Personalized job feed showing &ldquo;Day-1 roles&rdquo; you can start now and &ldquo;Next-step roles&rdquo; for your 2–5 year growth.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent hover:shadow-xl hover:shadow-purple-500/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-2xl">
              🧭
            </div>
            <h3 className="text-lg font-semibold">AI Career Missions</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Micro-tasks like &ldquo;Build this IoT project&rdquo; or &ldquo;Complete this course&rdquo; to strengthen your portfolio and close skill gaps.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-black/10 dark:border-white/15 bg-background hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Smart Skills Profile</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Showcase competencies from coursework, projects, and internships with evidence and endorsements.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-black/10 dark:border-white/15 bg-background hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">AI CV Builder</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Generate tailored CVs and cover letters aligned to Malaysian hiring expectations.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-black/10 dark:border-white/15 bg-background hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Job Matching</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Get matched to entry‑level roles based on your skills, interests, and location.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-black/10 dark:border-white/15 bg-background hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Interview Readiness</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Practice with common Malaysian interview scenarios and receive actionable feedback.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-black/10 dark:border-white/15 bg-background hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Employer Network</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Get discovered by SMEs and corporates hiring job‑ready graduates.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-black/10 dark:border-white/15 bg-background hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Career Insights</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Guidance on in‑demand skills, salary ranges, and growth paths in Malaysia.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Your career evolution journey</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70">From reflection to growth—AI guides you every step</p>
        </div>
        <ol className="grid md:grid-cols-3 gap-8 list-none relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 dark:from-emerald-800 dark:via-emerald-700 dark:to-emerald-800"></div>
          
          <li className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/25 mb-6">
                🧠
              </div>
              <h3 className="text-xl font-semibold mb-3">Reflect & Analyze</h3>
              <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                Take 3 minutes to share your skills and interests. AI predicts your career path from Day-1 to leadership.
              </p>
            </div>
          </li>
          <li className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/25 mb-6">
                🌱
              </div>
              <h3 className="text-xl font-semibold mb-3">See Your Evolution</h3>
              <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                Browse Day-1 roles you can start now, plus Next-step roles showing where you&apos;ll be in 2–5 years.
              </p>
            </div>
          </li>
          <li className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/25 mb-6">
                🧭
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Missions</h3>
              <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                Get AI-curated micro-tasks to strengthen skills and build portfolio projects that employers want to see.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 bg-gradient-to-b from-transparent via-black/[.02] to-transparent dark:via-white/[.02]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What graduates say</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70">Real stories from Malaysian students</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {[
            {
              quote:
                "The AI showed me I could become a Senior IoT Developer in 3 years. Now I see my career as a journey, not just a job hunt.",
              name: "Ahmad",
              title: "Engineering, UTM",
              avatar: "A",
            },
            {
              quote:
                "Career Missions gave me micro-tasks that actually mattered. I built 2 portfolio projects recruiters loved.",
              name: "Siti",
              title: "Computer Science, UM",
              avatar: "S",
            },
            {
              quote:
                "The Day-1 vs Next-step view changed everything. I finally understand where I&apos;m going, not just where I&apos;m starting.",
              name: "Daniel",
              title: "Data Science, UKM",
              avatar: "D",
            },
          ].map((t) => (
            <figure key={t.name} className="group p-8 rounded-2xl border border-black/10 dark:border-white/15 bg-background hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-black/60 dark:text-white/60">{t.title}</div>
                </div>
              </div>
              <blockquote className="text-sm leading-relaxed text-black/80 dark:text-white/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28">
        <div className="relative rounded-3xl border border-emerald-200 dark:border-emerald-800 p-12 md:p-16 text-center bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-blue-50/30 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-blue-950/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
          <div className="relative z-10">
            <div className="inline-block text-4xl mb-4">🚀</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              See who you&apos;ll become
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              Take the 3-minute AI reflection. Discover your career path from Day-1 roles to leadership positions—personalized for you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 text-base font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all">
                Start your career journey
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-full border-2 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 px-8 h-14 text-base font-semibold hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all">
                See how it works
              </a>
            </div>
            <p className="mt-6 text-sm text-black/60 dark:text-white/60">
              Free forever for students • No credit card • AI-powered career evolution
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 md:px-16 lg:px-24 py-12 border-t border-black/10 dark:border-white/15">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/talentmatch-logo.svg" alt="TalentMatch" width={28} height={28} />
            <div className="text-sm text-black/60 dark:text-white/60">
              © {new Date().getFullYear()} TalentMatch. Empowering Malaysian graduates.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
