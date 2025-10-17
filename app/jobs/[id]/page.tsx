"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

type Job = {
  id: string;
  title: string;
  company: string;
  company_id: string;
  location: string;
  type: string;
  salary: string;
  posted_at: string;
  description: string;
  tags: string[];
  apply_url?: string;
};

type Company = {
  id: string;
  name: string;
  location: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
};

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const loadJobDetails = async () => {
      if (!params.id) return;

      try {
        // Load job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*, companies(*)')
          .eq('id', params.id)
          .single();

        if (jobError) throw jobError;

        if (jobData) {
          setJob({
            id: jobData.id,
            title: jobData.title,
            company: jobData.companies?.name || '',
            company_id: jobData.company_id,
            location: jobData.location || '',
            type: jobData.employment_type || '',
            salary: jobData.salary || '',
            posted_at: jobData.posted_at,
            description: jobData.description || '',
            tags: Array.isArray(jobData.tags) ? jobData.tags : [],
            apply_url: jobData.apply_url,
          });

          setCompany(jobData.companies);
        }

        // Check if user has applied or saved (if authenticated)
        if (user) {
          const { data: applicationData } = await supabase
            .from('job_applications')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', params.id)
            .single();

          setHasApplied(!!applicationData);

          const { data: savedData } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', params.id)
            .single();

          setIsSaved(!!savedData);
        }
      } catch (error) {
        console.error('Error loading job details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobDetails();
  }, [params.id, user, supabase]);

  const handleApply = async () => {
    if (!user) {
      alert('Please sign in to apply for jobs');
      router.push('/');
      return;
    }

    if (hasApplied) {
      alert("You've already applied to this job!");
      return;
    }

    setApplying(true);

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: params.id,
          status: 'pending'
        });

      if (error) throw error;

      setHasApplied(true);
      alert("Application submitted successfully! 🎉\n\nThe employer will review your profile and contact you if there's a match.");
    } catch (error: any) {
      console.error('Error applying to job:', error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      alert('Please sign in to save jobs');
      router.push('/');
      return;
    }

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', params.id);

        if (error) throw error;
        setIsSaved(false);
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: params.id
          });

        if (error) throw error;
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert("Failed to save job. Please try again.");
    }
  };

  function formatPostedAgo(dateString: string): string {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - postedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return "Posted 1 week ago";
    return `Posted ${diffWeeks} weeks ago`;
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">💼</div>
          <div className="text-lg font-semibold">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-2">Job not found</h1>
          <p className="text-black/70 dark:text-white/70 mb-4">
            This job posting may have been removed or doesn't exist.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 text-sm font-semibold transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-background to-blue-50/20 dark:from-emerald-950/10 dark:via-background dark:to-blue-950/10">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-black/10 dark:border-white/15 sticky top-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/talentmatch-logo.svg" alt="TalentMatch" width={32} height={32} />
            <span className="text-lg font-semibold">TalentMatch</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              ← Back to Dashboard
            </Link>
            {user && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                {user?.email?.[0].toUpperCase() || 'A'}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Job Header Card */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-black/10 dark:border-white/15 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center text-4xl">
                  {job.company[0]}
                </div>
              </div>

              {/* Job Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <span className="text-xs text-black/50 dark:text-white/50 whitespace-nowrap">
                    {formatPostedAgo(job.posted_at)}
                  </span>
                </div>
                
                <Link 
                  href={company?.website_url || '#'}
                  className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-3 inline-block"
                  target={company?.website_url ? "_blank" : "_self"}
                >
                  {job.company}
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-sm text-black/60 dark:text-white/60 mb-4">
                  <span className="flex items-center gap-1">
                    📍 {job.location}
                  </span>
                  <span>•</span>
                  <span>{job.type}</span>
                  <span>•</span>
                  <span className="font-semibold text-black dark:text-white">
                    {job.salary}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-black/10 dark:border-white/15">
              <button
                onClick={handleApply}
                disabled={hasApplied || applying}
                className={`px-8 py-3 font-semibold rounded-lg transition-all shadow-md flex-1 sm:flex-initial ${
                  hasApplied
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
                }`}
              >
                {applying ? 'Submitting...' : hasApplied ? '✓ Applied' : 'Apply Now'}
              </button>
              
              <button
                onClick={handleSaveJob}
                className={`px-6 py-3 border rounded-lg transition-all font-medium ${
                  isSaved
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {isSaved ? '⭐ Saved' : 'Save Job'}
              </button>

              {company?.website_url && (
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-black/10 dark:border-white/15 shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-black/80 dark:text-white/80 whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>

          {/* Company Information */}
          {company && (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-black/10 dark:border-white/15 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">About {company.name}</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">Location</h3>
                  <p className="text-black dark:text-white">{company.location || job.location}</p>
                </div>
                
                {company.website_url && (
                  <div>
                    <h3 className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">Website</h3>
                    <a
                      href={company.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {company.website_url}
                    </a>
                  </div>
                )}
              </div>

              {company.description && (
                <div>
                  <h3 className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">Company Overview</h3>
                  <p className="text-black/80 dark:text-white/80 leading-relaxed">
                    {company.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Back to Jobs Button */}
          <div className="mt-8 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border-2 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 px-8 py-3 font-semibold hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all"
            >
              ← Back to All Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

