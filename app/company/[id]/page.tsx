"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import CompanyHeader from "@/app/components/company/CompanyHeader";
import AISentimentSummary from "@/app/components/company/AISentimentSummary";
import VisualRatings from "@/app/components/company/VisualRatings";
import ReviewsSection from "@/app/components/company/ReviewsSection";
import InterviewTimeline from "@/app/components/company/InterviewTimeline";
import SalaryBenefitsGraph from "@/app/components/company/SalaryBenefitsGraph";
import CultureFitScore from "@/app/components/company/CultureFitScore";
import AlumniConnect from "@/app/components/company/AlumniConnect";

type TabType = "culture" | "benefits" | "salary" | "interview";

type CompanyData = {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  overallRating: number;
  totalReviews: number;
};

export default function CompanyInsightsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("culture");
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock company data - Replace with actual API call
  const [company] = useState<CompanyData>({
    id: params.id as string,
    name: "Tech Innovation Sdn Bhd",
    logo: "T",
    industry: "Technology",
    size: "500-1000 employees",
    location: "Kuala Lumpur, Malaysia",
    website: "www.techinnovation.com.my",
    description: "Leading technology company specializing in software development and digital transformation",
    overallRating: 8.5,
    totalReviews: 247,
  });

  useEffect(() => {
    setIsClient(true);
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (!isClient || authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏢</div>
          <div className="text-lg font-semibold">Loading Company Insights...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-background to-blue-50/20 dark:from-emerald-950/10 dark:via-background dark:to-blue-950/10">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-black/10 dark:border-white/15 sticky top-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/talentmatch-logo.png" alt="TalentMatch" width={32} height={32} />
            <span className="text-lg font-semibold">TalentMatch</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-8">
        {/* Company Header */}
        <CompanyHeader company={company} />

        {/* AI Sentiment Summary */}
        <AISentimentSummary companyId={company.id} />

        {/* Culture Fit Score */}
        <CultureFitScore companyId={company.id} userId={user?.id} />

        {/* Visual Ratings */}
        <VisualRatings companyId={company.id} />

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-black/10 dark:border-white/15 overflow-x-auto">
            <button
              onClick={() => setActiveTab("culture")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "culture"
                  ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              🏛️ Culture
            </button>
            <button
              onClick={() => setActiveTab("benefits")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "benefits"
                  ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              🎁 Benefits
            </button>
            <button
              onClick={() => setActiveTab("salary")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "salary"
                  ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              💰 Salary
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "interview"
                  ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              🎯 Interview
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "culture" && (
              <ReviewsSection companyId={company.id} category="culture" />
            )}
            {activeTab === "benefits" && (
              <ReviewsSection companyId={company.id} category="benefits" />
            )}
            {activeTab === "salary" && (
              <div>
                <SalaryBenefitsGraph companyId={company.id} />
                <div className="mt-6">
                  <ReviewsSection companyId={company.id} category="salary" />
                </div>
              </div>
            )}
            {activeTab === "interview" && (
              <div>
                <InterviewTimeline companyId={company.id} />
                <div className="mt-6">
                  <ReviewsSection companyId={company.id} category="interview" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alumni Connect */}
        <AlumniConnect companyId={company.id} />
      </div>
    </div>
  );
}

