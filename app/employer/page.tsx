'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import EmployerLoginModal from '@/app/components/EmployerLoginModal';

export default function EmployerPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUserType() {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
        
        setIsEmployer(profile?.user_type === 'employer');
      } else {
        setIsEmployer(false);
      }
      setLoading(false);
    }
    
    if (!authLoading) {
      checkUserType();
    }
  }, [user, authLoading, supabase]);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <div className="font-sans min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative px-6 sm:px-10 md:px-16 lg:px-24 pt-6 pb-20 md:pt-8 md:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-background to-purple-50/30 dark:from-blue-950/20 dark:via-background dark:to-purple-950/10"></div>
        
        <nav className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/talentmatch-logo.png" alt="TalentMatch" width={40} height={40} className="drop-shadow-sm" />
            <span className="text-xl font-semibold tracking-tight">TalentMatch</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              For Job Seekers
            </Link>
            {loading || authLoading ? (
              <div className="w-20 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ) : user && isEmployer ? (
              <>
                <span className="text-sm text-black/70 dark:text-white/70 hidden md:inline">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-5 py-2 text-sm font-semibold text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
                >
                  Sign Out
                </button>
                <Link 
                  href="/employer/dashboard"
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center mt-16 md:mt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            Hire job-ready talent
            <span className="block text-blue-600 dark:text-blue-400 mt-2">across Malaysia</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-black/70 dark:text-white/70 leading-relaxed max-w-2xl mx-auto">
            Access a curated network of skilled graduates and professionals with verified portfolios, clear career trajectories, and proven competencies.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border-2 border-black/10 dark:border-white/20 px-8 h-12 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/30 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 bg-gradient-to-b from-transparent via-black/[.02] to-transparent dark:via-white/[.02]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Why companies choose TalentMatch</h2>
          <p className="mt-4 text-base sm:text-lg text-black/70 dark:text-white/70">
            Find, evaluate, and hire the right talent faster
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group p-8 rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent hover:shadow-xl hover:shadow-blue-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Skills</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              Every candidate has a verified portfolio with project evidence, certifications, and skills assessments.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent hover:shadow-xl hover:shadow-purple-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              AI-powered matching connects you with candidates whose skills and career goals align with your roles.
            </p>
          </div>
          <div className="group p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Faster Hiring</h3>
            <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
              Reduce time-to-hire with pre-screened candidates, structured profiles, and instant communication.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28">
        <div className="relative rounded-3xl border border-blue-200 dark:border-blue-800 p-12 md:p-16 text-center bg-gradient-to-br from-blue-50 via-blue-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-blue-950/20 dark:to-purple-950/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Ready to build your team?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              Join Malaysian companies hiring top talent through TalentMatch.
            </p>
            <div className="mt-8">
              <a 
                href="mailto:employers@talentmatch.my"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-base font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all"
              >
                Contact Sales
              </a>
            </div>
            <p className="mt-6 text-sm text-black/60 dark:text-white/60">
              Get in touch to learn more about our employer solutions
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

      {/* Login Modal */}
      <EmployerLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

