import Image from "next/image";
import AuthButtons from "./components/AuthButtons";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-24 pt-6 pb-20 md:pt-8 md:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/50 via-background to-blue-50/30 dark:from-emerald-950/20 dark:via-background dark:to-blue-950/10"></div>
        
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Image src="/talentmatch-logo.png" alt="TalentMatch" width={40} height={40} className="drop-shadow-sm" />
            <span className="text-xl font-semibold tracking-tight">TalentMatch</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Stories</a>
            <a href="#cta" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Get started</a>
            <AuthButtons />
          </div>
          <div className="md:hidden">
            <AuthButtons />
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mt-16 md:mt-20">
          <div>
          <h1 className="font-bold leading-[1.1] tracking-tight">
  <span className="block text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
    Discover your purpose.
  </span>
  <span className="block text-emerald-600 dark:text-emerald-400 mt-2 text-4xl sm:text-5xl md:text-6xl">
    Design your future.
  </span>
</h1>

            <p className="mt-6 text-lg sm:text-xl text-black/70 dark:text-white/70 leading-relaxed">
              Malaysia&apos;s AI-powered career platform that helps you to discover where you fit, how you&apos;ll grow, and the path that leads you to leadership.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-sm font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:scale-105"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border-2 border-black/10 dark:border-white/20 px-8 h-12 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/30 transition-all"
              >
                Explore features
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-black/60 dark:text-white/60">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-medium">Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">3-minute setup</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-rose-50/30 to-blue-50/20 dark:from-emerald-900/20 dark:via-rose-900/10 dark:to-blue-900/10 blur-3xl -z-10"></div>
        <Image
              src="/hero-illustration.png"
              alt="TalentMatch hero illustration"
              width={1600}
              height={1067}
              className="w-full h-auto drop-shadow-xl scale-110"
          priority
        />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 bg-gradient-to-b from-transparent via-black/[.02] to-transparent dark:via-white/[.02]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Your complete career evolution system</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70">AI-powered tools that predict, match, and guide your journey to career success</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Persona Profiling</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              Share your skills and aspirations in 3 minutes. AI analyzes your profile and predicts your complete career trajectory.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent hover:shadow-xl hover:shadow-blue-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Career Evolution Feed</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              See entry-level roles you can apply to today, plus senior positions showing where you&apos;ll be in 2–5 years.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Job Matching</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              AI matches you to roles that fit your skills, interests, and preferred locations across Malaysia.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent hover:shadow-xl hover:shadow-blue-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Interview Practice</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              Practice with real Malaysian interview questions and get instant AI feedback to improve your answers.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Employer Network</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              Connect with Malaysian SMEs and corporates actively hiring talented professionals across all career stages.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent hover:shadow-xl hover:shadow-blue-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Career Insights</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              Discover in-demand skills, realistic salary ranges, and growth opportunities in the Malaysian job market.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How it works</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70">Three simple steps to map your complete career path</p>
        </div>
        <ol className="grid md:grid-cols-3 gap-8 list-none relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 dark:from-emerald-800 dark:via-emerald-700 dark:to-emerald-800"></div>
          
          <li className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Profile</h3>
              <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                Spend 3 minutes reflecting on your skills and goals. AI analyzes your profile and maps your 5-year career progression.
              </p>
            </div>
          </li>
          <li className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">View Your Path</h3>
              <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                Discover entry roles to apply for today and senior positions you&apos;ll reach in 2–5 years with targeted growth.
              </p>
            </div>
          </li>
          <li className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/30 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply & Connect</h3>
              <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                Match with relevant roles and connect directly with top Malaysian employers.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 bg-gradient-to-b from-transparent via-black/[.02] to-transparent dark:via-white/[.02]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What people say</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70">Real stories from job seekers across Malaysia</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {[
            {
              quote:
                "The AI showed me I could become a Senior IoT Developer in 3 years. Now I see my career as a journey, not just a job hunt.",
              name: "Ahmad",
              title: "Engineering Graduate",
              avatar: "A",
            },
            {
              quote:
                "The Smart Job Matching connected me with roles I never knew existed. I got 3 interviews in my first week!",
              name: "Siti",
              title: "Software Developer",
              avatar: "S",
            },
            {
              quote:
                "The Company Insights feature completely changed how I research employers. It saves me hours of scrolling, and the culture and interview tabs give a real feel for what working there is like.",
              name: "Daniel",
              title: "Data Analyst",
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
              Map your career in 3 minutes
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              AI analyzes your profile and predicts your 5-year journey—from entry-level roles today to leadership positions tomorrow.
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
              Free to start • No credit card required • Takes just 3 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 md:px-16 lg:px-24 py-12 border-t border-black/10 dark:border-white/15">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/talentmatch-logo.png" alt="TalentMatch" width={28} height={28} />
            <div className="text-sm text-black/60 dark:text-white/60">
              © {new Date().getFullYear()} TalentMatch. Empowering career growth across Malaysia.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
