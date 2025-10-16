"use client";

interface CompanyHeaderProps {
  company: {
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
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-lg mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-32"></div>
      <div className="p-8 -mt-16">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Company Logo */}
          <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center text-4xl font-bold text-emerald-600 flex-shrink-0">
            {company.logo}
          </div>

          {/* Company Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-black/60 dark:text-white/60">
                  <span className="flex items-center gap-1">
                    🏢 {company.industry}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    👥 {company.size}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    📍 {company.location}
                  </span>
                </div>
              </div>

              {/* Overall Rating */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-xl text-center">
                <div className="text-3xl font-bold">{company.overallRating}</div>
                <div className="text-xs text-emerald-100">Overall Rating</div>
                <div className="text-xs text-emerald-100 mt-1">{company.totalReviews} reviews</div>
              </div>
            </div>

            <p className="text-black/70 dark:text-white/70 mb-4">
              {company.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
              >
                🌐 Visit Website
              </a>
              <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                📤 Share
              </button>
              <button className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                ⭐ Save Company
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

