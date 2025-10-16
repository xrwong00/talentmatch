"use client";

import { useEffect, useState } from "react";

interface AISentimentSummaryProps {
  companyId: string;
}

type SentimentType = "Positive" | "Neutral" | "Negative";

interface SentimentData {
  sentiment: SentimentType;
  score: number;
  highlights: string[];
  concerns: string[];
  topRoles: string[];
}

export default function AISentimentSummary({ companyId }: AISentimentSummaryProps) {
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);

  useEffect(() => {
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      setSentiment({
        sentiment: "Positive",
        score: 8.2,
        highlights: [
          "Strong engineering culture with focus on innovation",
          "Excellent work-life balance for most roles",
          "Competitive salary packages for fresh graduates",
          "Good mentorship programs for interns and juniors",
        ],
        concerns: [
          "Limited remote work flexibility in some departments",
          "Career progression can be slow for mid-level roles",
        ],
        topRoles: ["Software Engineer", "Data Analyst", "Product Manager"],
      });
      setLoading(false);
    }, 800);
  }, [companyId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm mb-6 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!sentiment) return null;

  const getSentimentColor = () => {
    switch (sentiment.sentiment) {
      case "Positive":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "Neutral":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "Negative":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    }
  };

  const getSentimentIcon = () => {
    switch (sentiment.sentiment) {
      case "Positive":
        return "😊";
      case "Neutral":
        return "😐";
      case "Negative":
        return "😕";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm mb-6 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl">
          🤖
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Sentiment Analysis</h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            Based on {sentiment.topRoles.length} roles and verified reviews
          </p>
        </div>
      </div>

      {/* Overall Sentiment */}
      <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl border-2 mb-6 ${getSentimentColor()}`}>
        <span className="text-3xl">{getSentimentIcon()}</span>
        <div>
          <div className="text-sm font-medium opacity-80">Overall Sentiment</div>
          <div className="text-2xl font-bold">{sentiment.sentiment}</div>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-current opacity-50">
          <div className="text-3xl font-bold">{sentiment.score}/10</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Highlights */}
        <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
          <h3 className="font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
            <span className="text-xl">✨</span>
            Key Highlights
          </h3>
          <ul className="space-y-3">
            {sentiment.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                <span className="text-green-600 dark:text-green-500 mt-0.5">✓</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concerns */}
        <div className="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
          <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-4 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Areas to Consider
          </h3>
          <ul className="space-y-3">
            {sentiment.concerns.map((concern, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-400">
                <span className="text-orange-600 dark:text-orange-500 mt-0.5">!</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Most Reviewed Roles */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-sm">
          📊 Most Reviewed Roles:
        </h3>
        <div className="flex flex-wrap gap-2">
          {sentiment.topRoles.map((role, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

