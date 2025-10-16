"use client";

import { useEffect, useState } from "react";

interface VisualRatingsProps {
  companyId: string;
}

interface RatingData {
  category: string;
  icon: string;
  score: number;
  maxScore: number;
  color: string;
}

export default function VisualRatings({ companyId }: VisualRatingsProps) {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<RatingData[]>([]);

  useEffect(() => {
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      setRatings([
        {
          category: "Culture",
          icon: "🏛️",
          score: 8.7,
          maxScore: 10,
          color: "from-purple-500 to-purple-600",
        },
        {
          category: "Growth",
          icon: "📈",
          score: 7.9,
          maxScore: 10,
          color: "from-green-500 to-green-600",
        },
        {
          category: "Work-Life Balance",
          icon: "⚖️",
          score: 8.2,
          maxScore: 10,
          color: "from-blue-500 to-blue-600",
        },
        {
          category: "Pay Fairness",
          icon: "💰",
          score: 7.5,
          maxScore: 10,
          color: "from-yellow-500 to-yellow-600",
        },
      ]);
      setLoading(false);
    }, 600);
  }, [companyId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm mb-6 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm mb-6 p-8">
      <h2 className="text-xl font-bold mb-6">📊 Visual Ratings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ratings.map((rating, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-black/5 dark:border-white/5"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{rating.icon}</div>
              <h3 className="font-semibold text-sm text-black/70 dark:text-white/70">
                {rating.category}
              </h3>
            </div>

            {/* Circular Progress */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#gradient-{index})"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(rating.score / rating.maxScore) * 251.2} 251.2`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={`text-${rating.color.split('-')[1]}-500`} stopColor="currentColor" />
                    <stop offset="100%" className={`text-${rating.color.split('-')[3]}-600`} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{rating.score}</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${rating.color} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${(rating.score / rating.maxScore) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-black/50 dark:text-white/50 mt-2">
              <span>0</span>
              <span className="font-semibold">{rating.score}/{rating.maxScore}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-xs text-black/60 dark:text-white/60 text-center">
          Ratings are calculated based on verified reviews from past employees and interns over the last 12 months
        </p>
      </div>
    </div>
  );
}

