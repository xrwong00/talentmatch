"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import CareerDiscoveryModal from "@/app/components/CareerDiscoveryModal";

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

  // Mock job data - In production, this would come from your database
  const [jobs] = useState<Job[]>([
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "Tech Innovation Sdn Bhd",
      location: "Kuala Lumpur",
      type: "Full-time",
      salary: "RM 8,000 - RM 12,000",
      posted: "2 days ago",
      description: "We're looking for an experienced software engineer to join our growing team...",
      tags: ["React", "Node.js", "TypeScript", "AWS"],
    },
    {
      id: "2",
      title: "Frontend Developer",
      company: "Digital Solutions Malaysia",
      location: "Petaling Jaya",
      type: "Full-time",
      salary: "RM 5,000 - RM 8,000",
      posted: "1 day ago",
      description: "Join our team to build amazing user experiences with modern web technologies...",
      tags: ["React", "Vue.js", "CSS", "JavaScript"],
    },
    {
      id: "3",
      title: "Backend Engineer",
      company: "StartUp Hub KL",
      location: "Kuala Lumpur",
      type: "Full-time",
      salary: "RM 6,000 - RM 10,000",
      posted: "3 days ago",
      description: "Help us build scalable backend systems for our growing platform...",
      tags: ["Python", "Django", "PostgreSQL", "Docker"],
    },
    {
      id: "4",
      title: "UX/UI Designer",
      company: "Creative Agency Sdn Bhd",
      location: "Penang",
      type: "Full-time",
      salary: "RM 4,500 - RM 7,000",
      posted: "4 days ago",
      description: "Create beautiful and intuitive designs for web and mobile applications...",
      tags: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "Cloud Systems Malaysia",
      location: "Cyberjaya",
      type: "Full-time",
      salary: "RM 7,000 - RM 11,000",
      posted: "5 days ago",
      description: "Manage and improve our cloud infrastructure and deployment pipelines...",
      tags: ["AWS", "Kubernetes", "CI/CD", "Terraform"],
    },
    {
      id: "6",
      title: "Data Analyst",
      company: "Analytics Corp",
      location: "Kuala Lumpur",
      type: "Contract",
      salary: "RM 5,500 - RM 8,500",
      posted: "1 week ago",
      description: "Analyze data to provide insights and support business decisions...",
      tags: ["Python", "SQL", "Power BI", "Excel"],
    },
  ]);

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
            <Image src="/talentmatch-logo.svg" alt="TalentMatch" width={32} height={32} />
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
                <div className="text-2xl font-bold">0</div>
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
                <div className="text-2xl font-bold">0</div>
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
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/50 cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center text-2xl flex-shrink-0">
                        {job.company[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 hover:text-emerald-600 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-black/60 dark:text-white/60 mb-3">
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {job.company}
                          </span>
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
                    <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                      Apply Now
                    </button>
                    <button className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-medium">
                      Save Job
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

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white hover:shadow-lg transition-all cursor-pointer">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-xl font-bold mb-1">AI Career Insights</h3>
            <p className="text-blue-50">
              Get personalized career recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Career Discovery Modal */}
      <CareerDiscoveryModal 
        isOpen={showCareerModal} 
        onClose={() => setShowCareerModal(false)} 
      />
    </div>
  );
}
