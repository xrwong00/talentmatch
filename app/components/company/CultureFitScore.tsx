"use client";

import { useEffect, useState } from "react";

interface CultureFitScoreProps {
  companyId: string;
  userId?: string;
}

interface FitCategory {
  name: string;
  icon: string;
  userScore: number;
  companyScore: number;
  match: number;
}

interface CultureFitData {
  overallFit: number;
  categories: FitCategory[];
  strengths: string[];
  considerations: string[];
}

export default function CultureFitScore({ companyId, userId }: CultureFitScoreProps) {
  const [loading, setLoading] = useState(true);
  const [fitData, setFitData] = useState<CultureFitData | null>(null);

  useEffect(() => {
    // Simulate API call - Replace with actual API that uses user profile data
    setTimeout(() => {
      setFitData({
        overallFit: 85,
        categories: [
          {
            name: "Work Style",
            icon: "💼",
            userScore: 8,
            companyScore: 9,
            match: 88,
          },
          {
            name: "Innovation Focus",
            icon: "💡",
            userScore: 9,
            companyScore: 9,
            match: 95,
          },
          {
            name: "Team Collaboration",
            icon: "🤝",
            userScore: 8,
            companyScore: 8,
            match: 90,
          },
          {
            name: "Work-Life Balance",
            icon: "⚖️",
            userScore: 9,
            companyScore: 8,
            match: 85,
          },
          {
            name: "Growth Mindset",
            icon: "📈",
            userScore: 9,
            companyScore: 7,
            match: 75,
          },
          {
            name: "Flexibility",
            icon: "🔄",
            userScore: 8,
            companyScore: 7,
            match: 80,
          },
        ],
        strengths: [
          "Your innovation mindset aligns perfectly with the company's culture",
          "Strong match in collaborative work style",
          "Similar values regarding work-life balance",
        ],
        considerations: [
          "Company's growth opportunities might be slightly below your expectations",
          "Remote work flexibility could be more limited than you prefer",
        ],
      });
      setLoading(false);
    }, 700);
  }, [companyId, userId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm mb-6 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!fitData) return null;

  const getFitColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getFitLabel = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Great Match";
    if (score >= 70) return "Good Match";
    if (score >= 60) return "Fair Match";
    return "Consider Carefully";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm mb-6 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl">
          🎯
        </div>
        <div>
          <h2 className="text-xl font-bold">Culture Fit Score</h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            Based on your profile and career preferences
          </p>
        </div>
      </div>

      {/* Overall Fit Score */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-shrink-0">
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#gradient-fit)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(fitData.overallFit / 100) * 439.6} 439.6`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient-fit" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="text-pink-500" stopColor="currentColor" />
                  <stop offset="100%" className="text-purple-600" stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getFitColor(fitData.overallFit)}`}>
                {fitData.overallFit}%
              </span>
              <span className="text-xs text-black/60 dark:text-white/60 mt-1">
                {getFitLabel(fitData.overallFit)}
              </span>
            </div>
          </div>
        </div>

        {/* Fit Breakdown */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fitData.categories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-black/5 dark:border-white/5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-semibold text-sm">{category.name}</span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                    category.match >= 80
                      ? "bg-gradient-to-r from-green-400 to-green-500"
                      : category.match >= 60
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                      : "bg-gradient-to-r from-red-400 to-red-500"
                  }`}
                  style={{ width: `${category.match}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-black/60 dark:text-white/60">You: {category.userScore}/10</span>
                <span className={getFitColor(category.match)}>{category.match}%</span>
                <span className="text-black/60 dark:text-white/60">Company: {category.companyScore}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <h3 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2 text-sm">
            <span>✨</span>
            Why You'll Thrive Here
          </h3>
          <ul className="space-y-2">
            {fitData.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-green-700 dark:text-green-400">
                <span className="text-green-600 dark:text-green-500 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
          <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-2 text-sm">
            <span>💭</span>
            Things to Consider
          </h3>
          <ul className="space-y-2">
            {fitData.considerations.map((consideration, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-orange-700 dark:text-orange-400">
                <span className="text-orange-600 dark:text-orange-500 mt-0.5">!</span>
                <span>{consideration}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
        <p className="text-sm text-black/70 dark:text-white/70 mb-3">
          Want to improve your culture fit score? Complete your profile to get more accurate matches.
        </p>
        <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
          Complete Your Profile
        </button>
      </div>
    </div>
  );
}

