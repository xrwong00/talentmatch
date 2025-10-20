"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

type Mentor = {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  expertise: string[];
  experience: string;
  availability: "Available" | "Limited" | "Busy";
  rating: number;
  sessions: number;
  avatar: string;
  location: string;
};

export default function MentorPage() {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const mentors: Mentor[] = [
    {
      id: "1",
      name: "Dato' Ahmad Abdullah",
      title: "VP of Engineering",
      company: "Grab Malaysia",
      industry: "Technology",
      expertise: ["Software Engineering", "Leadership", "System Design", "Career Growth"],
      experience: "15+ years",
      availability: "Limited",
      rating: 4.9,
      sessions: 127,
      avatar: "A",
      location: "Kuala Lumpur",
    },
    {
      id: "2",
      name: "Dr. Sarah Chen",
      title: "Head of AI Research",
      company: "Google Asia Pacific",
      industry: "Technology",
      expertise: ["Machine Learning", "AI", "Data Science", "Deep Learning"],
      experience: "12+ years",
      availability: "Available",
      rating: 4.8,
      sessions: 89,
      avatar: "S",
      location: "Singapore",
    },
    {
      id: "3",
      name: "Tan Wei Ming",
      title: "Co-founder & CEO",
      company: "TechStart Ventures",
      industry: "Entrepreneurship",
      expertise: ["Startup Strategy", "Fundraising", "Product Development", "Business"],
      experience: "10+ years",
      availability: "Available",
      rating: 4.9,
      sessions: 156,
      avatar: "T",
      location: "Penang",
    },
    {
      id: "4",
      name: "Priya Sharma",
      title: "Design Director",
      company: "Shopee Malaysia",
      industry: "Design",
      expertise: ["UX Design", "Product Design", "Design Strategy", "User Research"],
      experience: "8+ years",
      availability: "Busy",
      rating: 4.7,
      sessions: 94,
      avatar: "P",
      location: "Kuala Lumpur",
    },
    {
      id: "5",
      name: "John Lim",
      title: "Principal Security Engineer",
      company: "AWS Malaysia",
      industry: "Technology",
      expertise: ["Cybersecurity", "Cloud Security", "DevSecOps", "Compliance"],
      experience: "14+ years",
      availability: "Available",
      rating: 4.8,
      sessions: 112,
      avatar: "J",
      location: "Kuala Lumpur",
    },
    {
      id: "6",
      name: "Rachel Wong",
      title: "Marketing Director",
      company: "Lazada Malaysia",
      industry: "Marketing",
      expertise: ["Digital Marketing", "Brand Strategy", "Growth Marketing", "E-commerce"],
      experience: "11+ years",
      availability: "Limited",
      rating: 4.9,
      sessions: 143,
      avatar: "R",
      location: "Selangor",
    },
    {
      id: "7",
      name: "Hadi Ismail",
      title: "Senior Data Scientist",
      company: "Maybank",
      industry: "Finance",
      expertise: ["Data Analytics", "Financial Modeling", "Risk Analysis", "Business Intelligence"],
      experience: "9+ years",
      availability: "Available",
      rating: 4.6,
      sessions: 78,
      avatar: "H",
      location: "Kuala Lumpur",
    },
    {
      id: "8",
      name: "Lisa Tan",
      title: "HR Director",
      company: "Intel Malaysia",
      industry: "Human Resources",
      expertise: ["Career Development", "Talent Management", "Leadership", "HR Strategy"],
      experience: "13+ years",
      availability: "Limited",
      rating: 4.8,
      sessions: 167,
      avatar: "L",
      location: "Penang",
    },
  ];

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIndustry = !industryFilter || mentor.industry === industryFilter;
    const matchesExpertise =
      !expertiseFilter ||
      mentor.expertise.some((skill) => skill.toLowerCase().includes(expertiseFilter.toLowerCase()));

    return matchesSearch && matchesIndustry && matchesExpertise;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200";
      case "Limited":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200";
      case "Busy":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-background to-indigo-50/20 dark:from-purple-950/10 dark:via-background dark:to-indigo-950/10">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-black/10 dark:border-white/15 sticky top-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/talentmatch-logo.png" alt="TalentMatch" width={32} height={32} />
            <span className="text-lg font-semibold">TalentMatch</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Dashboard
            </Link>
            <button
              onClick={signOut}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🤝</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent">
              Connect with Industry Mentors
            </h1>
          </div>
          <p className="text-lg text-black/70 dark:text-white/70">
            Get personalized guidance from experienced professionals in your field
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-black/10 dark:border-white/15 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Mentors</label>
              <input
                type="text"
                placeholder="Name, company, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
              >
                <option value="">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expertise</label>
              <input
                type="text"
                placeholder="e.g., Leadership, AI, Marketing..."
                value={expertiseFilter}
                onChange={(e) => setExpertiseFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
              />
            </div>
          </div>

          {(searchQuery || industryFilter || expertiseFilter) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-black/60 dark:text-white/60">
                Found {filteredMentors.length} mentors
              </span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIndustryFilter("");
                  setExpertiseFilter("");
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Mentor Header */}
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white relative">
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(mentor.availability)} bg-white/90 backdrop-blur-sm`}>
                    {mentor.availability}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/40">
                    {mentor.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{mentor.name}</h3>
                    <p className="text-sm text-purple-100">{mentor.title}</p>
                  </div>
                </div>
              </div>

              {/* Mentor Content */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{mentor.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>📍 {mentor.location}</span>
                    <span>•</span>
                    <span>💼 {mentor.experience}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    {mentor.industry}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-bold">{mentor.rating}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {mentor.sessions} sessions completed
                  </span>
                </div>

                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>☕</span>
                  Request Coffee Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="bg-white dark:bg-gray-900 p-12 rounded-2xl border border-black/10 dark:border-white/15 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No mentors found</h3>
            <p className="text-black/60 dark:text-white/60 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setIndustryFilter("");
                setExpertiseFilter("");
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-start gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <h3 className="text-2xl font-bold mb-3">Why Connect with a Mentor?</h3>
              <ul className="space-y-2 text-purple-100">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Get personalized career guidance from industry experts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Learn insider tips about breaking into your desired industry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Expand your professional network with meaningful connections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Receive feedback on your career strategy and goals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="text-7xl mb-4">👑</div>
              <h2 className="text-3xl font-bold mb-3">Unlock Premium Access</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect with industry mentors and accelerate your career growth with one-on-one coffee chats!
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Premium Benefits:</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span className="text-sm">Unlimited coffee chat requests with mentors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span className="text-sm">Priority booking for popular mentors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span className="text-sm">Access to exclusive career workshops</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span className="text-sm">Personalized mentor matching algorithm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span className="text-sm">Access to alumni network from top companies</span>
                  </li>
                </ul>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">RM 49.90/month</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cancel anytime. No commitment.</p>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

