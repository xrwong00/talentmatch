"use client";

import { useEffect, useState } from "react";

interface InterviewTimelineProps {
  companyId: string;
}

interface InterviewStage {
  step: number;
  title: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  tips: string[];
}

interface InterviewData {
  overallDifficulty: "Easy" | "Medium" | "Hard";
  totalDuration: string;
  successRate: number;
  stages: InterviewStage[];
  commonQuestions: string[];
}

export default function InterviewTimeline({ companyId }: InterviewTimelineProps) {
  const [loading, setLoading] = useState(true);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  useEffect(() => {
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      setInterviewData({
        overallDifficulty: "Medium",
        totalDuration: "3-4 weeks",
        successRate: 68,
        stages: [
          {
            step: 1,
            title: "HR Screening",
            duration: "30 mins",
            difficulty: "Easy",
            description: "Initial phone call to discuss background, motivation, and expectations",
            tips: [
              "Research the company beforehand",
              "Prepare your elevator pitch",
              "Ask about next steps",
            ],
          },
          {
            step: 2,
            title: "Technical Assessment",
            duration: "90 mins",
            difficulty: "Medium",
            description: "Online coding test with 2-3 algorithm problems",
            tips: [
              "Practice LeetCode medium problems",
              "Focus on time complexity",
              "Write clean, readable code",
            ],
          },
          {
            step: 3,
            title: "Technical Interview",
            duration: "60 mins",
            difficulty: "Medium",
            description: "Live coding session with senior engineer covering data structures and problem-solving",
            tips: [
              "Think out loud during problem-solving",
              "Ask clarifying questions",
              "Discuss trade-offs of solutions",
            ],
          },
          {
            step: 4,
            title: "Behavioral Interview",
            duration: "45 mins",
            difficulty: "Easy",
            description: "Discussion with team lead about past experiences, teamwork, and cultural fit",
            tips: [
              "Prepare STAR method examples",
              "Show enthusiasm for learning",
              "Ask about team dynamics",
            ],
          },
          {
            step: 5,
            title: "Final Interview",
            duration: "30 mins",
            difficulty: "Easy",
            description: "Discussion with hiring manager about role expectations and compensation",
            tips: [
              "Research market salary ranges",
              "Clarify role responsibilities",
              "Negotiate confidently but respectfully",
            ],
          },
        ],
        commonQuestions: [
          "Explain a challenging project you worked on",
          "How do you handle conflicts in a team?",
          "Design a URL shortener system",
          "Implement a binary search tree",
          "Why do you want to work here?",
          "Where do you see yourself in 3 years?",
        ],
      });
      setLoading(false);
    }, 700);
  }, [companyId]);

  const getDifficultyColor = (difficulty: "Easy" | "Medium" | "Hard") => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!interviewData) return null;

  return (
    <div className="mb-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">🎯 Interview Process Timeline</h3>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-700 dark:text-blue-400 mb-1">Overall Difficulty</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                {interviewData.overallDifficulty}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(interviewData.overallDifficulty)}`}>
                {interviewData.overallDifficulty}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-purple-700 dark:text-purple-400 mb-1">Total Duration</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {interviewData.totalDuration}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-700 dark:text-green-400 mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-300">
              {interviewData.successRate}%
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {interviewData.stages.map((stage, index) => (
            <div key={stage.step} className="relative pb-8 last:pb-0">
              {/* Connecting Line */}
              {index < interviewData.stages.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-emerald-500 to-blue-500 -z-10"></div>
              )}

              <div className="flex gap-4">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {stage.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-black/5 dark:border-white/5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-lg font-bold mb-1">{stage.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-black/60 dark:text-white/60">
                        <span>⏱️ {stage.duration}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(stage.difficulty)}`}>
                          {stage.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-black/70 dark:text-white/70 mb-4">
                    {stage.description}
                  </p>

                  {/* Tips */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-black/5 dark:border-white/5">
                    <div className="font-semibold text-sm mb-2 text-emerald-600 dark:text-emerald-400">
                      💡 Interview Tips:
                    </div>
                    <ul className="space-y-2">
                      {stage.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/70">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Questions */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
        <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-4 flex items-center gap-2">
          <span className="text-xl">❓</span>
          Common Interview Questions
        </h4>
        <div className="grid md:grid-cols-2 gap-3">
          {interviewData.commonQuestions.map((question, index) => (
            <div
              key={index}
              className="bg-white dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-700 text-sm"
            >
              <span className="text-orange-600 dark:text-orange-400 font-semibold mr-2">
                Q{index + 1}:
              </span>
              <span className="text-black/70 dark:text-white/70">{question}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

