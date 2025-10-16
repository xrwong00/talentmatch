"use client";

import { useEffect, useState } from "react";

interface ReviewsSectionProps {
  companyId: string;
  category: "culture" | "benefits" | "salary" | "interview";
}

interface Review {
  id: string;
  role: string;
  reviewer: {
    name: string;
    verified: boolean;
    tenure: string;
    position: string;
  };
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  tags: string[];
}

export default function ReviewsSection({ companyId, category }: ReviewsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      const mockReviews: Review[] = [
        {
          id: "1",
          role: "Software Engineer Intern",
          reviewer: {
            name: "Ahmad R.",
            verified: true,
            tenure: "6 months",
            position: "Former Intern",
          },
          rating: 9,
          date: "2 weeks ago",
          title: category === "culture" ? "Amazing learning environment" : 
                 category === "benefits" ? "Great benefits for interns" :
                 category === "salary" ? "Competitive salary for fresh grad" :
                 "Smooth interview process",
          content: category === "culture" 
            ? "The team is very supportive and encourages learning. Regular code reviews and pair programming sessions helped me grow significantly. The work environment is collaborative and inclusive."
            : category === "benefits"
            ? "Impressed with the intern benefits package including health insurance, learning stipend, and flexible working hours. They also provided mentorship programs and regular feedback sessions."
            : category === "salary"
            ? "Received RM 3,200/month as an intern which is above market rate. Full-time offer was RM 5,500 with annual bonus. Transparent about salary bands from the start."
            : "3-stage interview: HR screening, technical assessment, and final interview with team lead. Technical questions were fair and focused on problem-solving. Received feedback within 3 days.",
          helpful: 24,
          tags: category === "culture" ? ["Supportive", "Learning", "Collaborative"] :
                category === "benefits" ? ["Health Insurance", "Learning Budget", "Flexible Hours"] :
                category === "salary" ? ["Competitive", "Transparent", "Bonus"] :
                ["Fair", "Fast Response", "Good Communication"],
        },
        {
          id: "2",
          role: "Graduate Analyst",
          reviewer: {
            name: "Sarah L.",
            verified: true,
            tenure: "1 year 3 months",
            position: "Current Employee",
          },
          rating: 8,
          date: "1 month ago",
          title: category === "culture" ? "Good work-life balance" :
                 category === "benefits" ? "Comprehensive benefits package" :
                 category === "salary" ? "Fair compensation structure" :
                 "Challenging but fair interviews",
          content: category === "culture"
            ? "Management respects work-life balance. No expectation to work beyond hours. Team outings and bonding activities are frequent. Only improvement needed is more remote work flexibility."
            : category === "benefits"
            ? "Full medical coverage, annual leave is generous (18 days), professional development budget of RM 3,000/year. Parking subsidy and meal allowances included."
            : category === "salary"
            ? "Started at RM 4,800 for analyst role. Got 10% increment after first year. Salary is slightly below top tech companies but benefits package makes up for it."
            : "Had 4 rounds including case study presentation. Process took 3 weeks. Interviewers were professional and made me feel comfortable. Questions were relevant to the role.",
          helpful: 18,
          tags: category === "culture" ? ["Work-Life Balance", "Team Culture", "Management"] :
                category === "benefits" ? ["Medical", "Learning Budget", "Leave Policy"] :
                category === "salary" ? ["Fair Pay", "Increment", "Benefits"] :
                ["Professional", "Relevant", "Case Study"],
        },
        {
          id: "3",
          role: "Software Engineer",
          reviewer: {
            name: "Kevin T.",
            verified: true,
            tenure: "2 years",
            position: "Former Employee",
          },
          rating: 7,
          date: "2 months ago",
          title: category === "culture" ? "Solid culture with room for improvement" :
                 category === "benefits" ? "Good benefits, could be better" :
                 category === "salary" ? "Market competitive but not leading" :
                 "Standard tech interview process",
          content: category === "culture"
            ? "Engineering team has strong technical culture. Regular tech talks and knowledge sharing. However, decision-making can be slow due to bureaucracy. Overall positive experience."
            : category === "benefits"
            ? "Standard tech company benefits. Health insurance covers dependents. EPF contribution is good. Wish they had more flexible remote work options and better office facilities."
            : category === "salary"
            ? "Software engineer salary range: RM 6,000-8,000 for juniors, RM 8,000-12,000 for mid-level. Annual increment around 8-10%. Could be better compared to startups."
            : "Technical interview had 2 coding rounds, system design, and behavioral questions. Medium difficulty LeetCode style questions. Process was organized but quite lengthy (4 weeks).",
          helpful: 31,
          tags: category === "culture" ? ["Technical", "Knowledge Sharing", "Bureaucracy"] :
                category === "benefits" ? ["Standard", "Health Coverage", "EPF"] :
                category === "salary" ? ["Market Rate", "Increment", "Room for Improvement"] :
                ["Technical", "Organized", "Lengthy"],
        },
      ];

      setReviews(mockReviews);
      setRoles(["all", ...Array.from(new Set(mockReviews.map(r => r.role)))]);
      setLoading(false);
    }, 400);
  }, [companyId, category]);

  const filteredReviews = selectedRole === "all" 
    ? reviews 
    : reviews.filter(r => r.role === selectedRole);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Role Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-black/70 dark:text-white/70">Filter by role:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRole === role
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-black/70 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {role === "all" ? "All Roles" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-black/5 dark:border-white/5"
          >
            {/* Reviewer Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {review.reviewer.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{review.reviewer.name}</span>
                    {review.reviewer.verified && (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-black/60 dark:text-white/60">
                    {review.reviewer.position} • {review.role}
                  </div>
                  <div className="text-xs text-black/50 dark:text-white/50">
                    Worked for {review.reviewer.tenure} • {review.date}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {review.rating}
                </div>
                <div className="text-yellow-500 text-sm">★</div>
              </div>
            </div>

            {/* Review Content */}
            <h3 className="font-bold text-lg mb-2">{review.title}</h3>
            <p className="text-black/70 dark:text-white/70 leading-relaxed mb-4">
              {review.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {review.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-black/10 dark:border-white/10">
              <button className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <span>👍</span>
                <span>Helpful ({review.helpful})</span>
              </button>
              <button className="text-sm text-black/60 dark:text-white/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                💬 Comment
              </button>
              <button className="text-sm text-black/60 dark:text-white/60 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                🔗 Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Button */}
      <div className="mt-6">
        <button className="w-full px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-black/60 dark:text-white/60 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all font-semibold">
          ✍️ Share Your Experience
        </button>
      </div>
    </div>
  );
}

