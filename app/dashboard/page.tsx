"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import CareerDiscoveryModal from "@/app/components/CareerDiscoveryModal";
import CareerAgentChat from "@/app/components/CareerAgentChat";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  logo?: string;
  description: string;
  tags: string[];
};

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [isClient, setIsClient] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [applicationCount, setApplicationCount] = useState(0);
  const [savedJobCount, setSavedJobCount] = useState(0);

  function formatPostedAgo(dateString: string | null): string {
    if (!dateString) return "";
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - postedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return "1 week ago";
    return `${diffWeeks} weeks ago`;
  }

  async function handleSaveJob(jobId: string) {
    if (!user) return;

    try {
      const isSaved = savedJobIds.has(jobId);

      if (isSaved) {
        // Unsave job
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        if (error) throw error;

        setSavedJobIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        setSavedJobCount(prev => prev - 1);
      } else {
        // Save job
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId
          });

        if (error) throw error;

        setSavedJobIds(prev => new Set([...prev, jobId]));
        setSavedJobCount(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error saving job:', error);
      alert("Failed to save job. Please try again.");
    }
  }

  useEffect(() => {
    setIsClient(true);
    
    const checkProfile = async () => {
      if (!authLoading && !user) {
        router.push('/');
        return;
      }

      if (user) {
        // Load user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Load jobs from DB (with company join) - only active jobs
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('id,title,location,employment_type,salary,description,tags,posted_at,companies(name),is_active')
          .eq('is_active', true)
          .order('posted_at', { ascending: false });

        if (Array.isArray(jobsData)) {
          // Create a map to track unique jobs by id to prevent duplicates
          const uniqueJobsMap = new Map();
          
          jobsData.forEach((j: any) => {
            if (!uniqueJobsMap.has(j.id)) {
              uniqueJobsMap.set(j.id, {
                id: j.id,
                title: j.title,
                company: j.companies?.name || '',
                location: j.location || '',
                type: j.employment_type || '',
                salary: j.salary || '',
                posted: formatPostedAgo(j.posted_at),
                description: j.description || '',
                tags: Array.isArray(j.tags) ? j.tags : [],
              });
            }
          });
          
          const mapped: Job[] = Array.from(uniqueJobsMap.values());
          setJobs(mapped);
        }

        // Load saved jobs
        const { data: savedJobsData } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);

        if (savedJobsData) {
          const savedIds = new Set(savedJobsData.map(sj => sj.job_id));
          setSavedJobIds(savedIds);
          setSavedJobCount(savedIds.size);
        }

        // Load applications
        const { data: applicationsData } = await supabase
          .from('job_applications')
          .select('job_id')
          .eq('user_id', user.id);

        if (applicationsData) {
          const appliedIds = new Set(applicationsData.map(app => app.job_id));
          setAppliedJobIds(appliedIds);
          setApplicationCount(appliedIds.size);
        }

        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user, authLoading, router, supabase]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !locationFilter || job.location.includes(locationFilter);
    const matchesType = !jobTypeFilter || job.type === jobTypeFilter;

    return matchesSearch && matchesLocation && matchesType;
  });

  if (!isClient || authLoading || checkingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">💼</div>
          <div className="text-lg font-semibold">Loading Dashboard...</div>
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
            <Image src="/talentmatch-logo.png" alt="TalentMatch" width={32} height={32} />
            <span className="text-lg font-semibold">TalentMatch</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowCareerModal(true)}
              className="text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg hidden sm:block"
            >
              Discover My Career Path
            </button>
            <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition-colors hidden sm:block">
              Home
            </Link>
            <Link href="/profile/setup" className="text-sm font-medium hover:text-emerald-600 transition-colors hidden sm:block">
              Profile
            </Link>
            <button
              onClick={signOut}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors hidden sm:block"
            >
              Sign Out
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Job Seeker'}! 👋
          </h1>
          <p className="text-black/70 dark:text-white/70">
            Find your dream job in Malaysia's top companies
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl">
                💼
              </div>
              <div>
                <div className="text-2xl font-bold">{jobs.length}</div>
                <div className="text-sm text-black/60 dark:text-white/60">Available Jobs</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl">
                📝
              </div>
              <div>
                <div className="text-2xl font-bold">{applicationCount}</div>
                <div className="text-sm text-black/60 dark:text-white/60">Applications</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <div className="text-2xl font-bold">{savedJobCount}</div>
                <div className="text-sm text-black/60 dark:text-white/60">Saved Jobs</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {profile?.profile_completed ? '100' : '50'}%
                </div>
                <div className="text-sm text-black/60 dark:text-white/60">Profile Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-black/10 dark:border-white/15 shadow-lg mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Search Jobs</h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              Find the perfect role that matches your skills and aspirations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2">Keywords</label>
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              >
                <option value="">All Locations</option>
                <option value="Kuala Lumpur">Kuala Lumpur</option>
                <option value="Petaling Jaya">Petaling Jaya</option>
                <option value="Penang">Penang</option>
                <option value="Cyberjaya">Cyberjaya</option>
                <option value="Johor Bahru">Johor Bahru</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {(searchQuery || locationFilter || jobTypeFilter) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-black/60 dark:text-white/60">
                Found {filteredJobs.length} jobs
              </span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setLocationFilter("");
                  setJobTypeFilter("");
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear filters
              </button>
                          </div>
                        )}
                      </div>

        {/* Job Listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {searchQuery || locationFilter || jobTypeFilter ? 'Search Results' : 'Latest Jobs'}
            </h2>
            <span className="text-sm text-black/60 dark:text-white/60">
              {filteredJobs.length} jobs available
            </span>
                  </div>

          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center text-2xl flex-shrink-0">
                        {job.company[0]}
                      </div>
                      <div className="flex-1">
                        <Link href={`/jobs/${job.id}`}>
                          <h3 className="text-xl font-bold mb-1 hover:text-emerald-600 transition-colors cursor-pointer">
                            {job.title}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-black/60 dark:text-white/60 mb-3">
                          <Link 
                            href={`/company/${job.id}`}
                            className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            {job.company}
                          </Link>
                          <span>•</span>
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
                        <p className="text-sm text-black/70 dark:text-white/70 mb-3">
                          {job.description}
                        </p>
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
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <span className="text-xs text-black/50 dark:text-white/50">
                      {job.posted}
                    </span>
                    {appliedJobIds.has(job.id) ? (
                      <button 
                        disabled
                        className="px-6 py-2 font-semibold rounded-lg transition-all shadow-md bg-gray-400 cursor-not-allowed text-white whitespace-nowrap"
                      >
                        ✓ Applied
                      </button>
                    ) : (
                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-6 py-2 font-semibold rounded-lg transition-all shadow-md bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg text-center whitespace-nowrap"
                      >
                        Apply Now
                      </Link>
                    )}
                    <Link 
                      href={`/company/${job.id}`}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm text-center whitespace-nowrap"
                    >
                      AI Analysis
                    </Link>
                    <button 
                      onClick={() => handleSaveJob(job.id)}
                      className={`px-6 py-2 border rounded-lg transition-all text-sm font-medium whitespace-nowrap ${
                        savedJobIds.has(job.id)
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                          : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {savedJobIds.has(job.id) ? '⭐ Saved' : 'Save Job'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="bg-white dark:bg-gray-900 p-12 rounded-2xl border border-black/10 dark:border-white/15 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No jobs found</h3>
              <p className="text-black/60 dark:text-white/60 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setLocationFilter("");
                  setJobTypeFilter("");
                }}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/profile/setup"
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-2">✨</div>
            <h3 className="text-xl font-bold mb-1">Complete Your Profile</h3>
            <p className="text-emerald-50">
              Stand out to employers with a complete profile
            </p>
          </Link>

          <div 
            onClick={() => setShowAIAgent(true)}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-xl font-bold mb-1">AI Career Agent</h3>
            <p className="text-blue-50">
              Chat with your personal AI career mentor
            </p>
          </div>
        </div>
      </div>

      {/* Career Discovery Modal */}
      <CareerDiscoveryModal 
        isOpen={showCareerModal} 
        onClose={() => setShowCareerModal(false)} 
      />
      {/* AI Career Agent Modal */}
      {showAIAgent && (
        <CareerAgentChat onClose={() => setShowAIAgent(false)} />
      )}
    </div>
  );
}
