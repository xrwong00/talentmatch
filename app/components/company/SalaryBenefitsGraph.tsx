"use client";

import { useEffect, useState } from "react";

interface SalaryBenefitsGraphProps {
  companyId: string;
}

interface SalaryData {
  role: string;
  entry: { min: number; max: number; avg: number };
  midLevel: { min: number; max: number; avg: number };
  senior: { min: number; max: number; avg: number };
}

interface BenefitItem {
  name: string;
  icon: string;
  available: boolean;
  details?: string;
}

export default function SalaryBenefitsGraph({ companyId }: SalaryBenefitsGraphProps) {
  const [loading, setLoading] = useState(true);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      const mockSalary: SalaryData[] = [
        {
          role: "Software Engineer",
          entry: { min: 5000, max: 7000, avg: 6000 },
          midLevel: { min: 8000, max: 12000, avg: 10000 },
          senior: { min: 12000, max: 18000, avg: 15000 },
        },
        {
          role: "Data Analyst",
          entry: { min: 4500, max: 6500, avg: 5500 },
          midLevel: { min: 7000, max: 10000, avg: 8500 },
          senior: { min: 10000, max: 15000, avg: 12500 },
        },
        {
          role: "Product Manager",
          entry: { min: 6000, max: 8000, avg: 7000 },
          midLevel: { min: 10000, max: 14000, avg: 12000 },
          senior: { min: 15000, max: 22000, avg: 18000 },
        },
      ];

      const mockBenefits: BenefitItem[] = [
        { name: "Medical Insurance", icon: "🏥", available: true, details: "Full coverage + dependents" },
        { name: "Dental & Vision", icon: "👁️", available: true, details: "Annual checkup covered" },
        { name: "Annual Leave", icon: "🏖️", available: true, details: "18 days + public holidays" },
        { name: "Learning Budget", icon: "📚", available: true, details: "RM 3,000/year" },
        { name: "Flexible Hours", icon: "⏰", available: true, details: "Core hours: 10am-4pm" },
        { name: "Remote Work", icon: "🏠", available: true, details: "2 days/week" },
        { name: "Parking Subsidy", icon: "🚗", available: true, details: "Full coverage" },
        { name: "Meal Allowance", icon: "🍽️", available: true, details: "RM 15/day" },
        { name: "Gym Membership", icon: "💪", available: true, details: "Subsidized 50%" },
        { name: "Stock Options", icon: "📈", available: false },
        { name: "Performance Bonus", icon: "💰", available: true, details: "Up to 3 months" },
        { name: "Annual Increment", icon: "📊", available: true, details: "8-12% average" },
      ];

      setSalaryData(mockSalary);
      setSelectedRole(mockSalary[0].role);
      setBenefits(mockBenefits);
      setLoading(false);
    }, 600);
  }, [companyId]);

  if (loading) {
    return (
      <div className="mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const currentRole = salaryData.find(r => r.role === selectedRole);
  const maxSalary = Math.max(...salaryData.map(r => r.senior.max));

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-4">💰 Salary & Benefits Overview</h3>

      {/* Role Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-black/70 dark:text-white/70">
          Select Role:
        </label>
        <div className="flex flex-wrap gap-2">
          {salaryData.map((role) => (
            <button
              key={role.role}
              onClick={() => setSelectedRole(role.role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRole === role.role
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-black/70 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {role.role}
            </button>
          ))}
        </div>
      </div>

      {/* Salary Progression Graph */}
      {currentRole && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-6">
          <h4 className="font-bold mb-6 text-blue-900 dark:text-blue-300">
            📈 Salary Progression: {currentRole.role}
          </h4>

          <div className="space-y-6">
            {/* Entry Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">Entry Level (0-2 years)</span>
                <span className="text-sm text-black/60 dark:text-white/60">
                  RM {currentRole.entry.min.toLocaleString()} - RM {currentRole.entry.max.toLocaleString()}
                </span>
              </div>
              <div className="relative h-8 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-end pr-3"
                  style={{ width: `${(currentRole.entry.max / maxSalary) * 100}%` }}
                >
                  <span className="text-white text-xs font-bold">
                    Avg: RM {currentRole.entry.avg.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Mid Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">Mid Level (3-5 years)</span>
                <span className="text-sm text-black/60 dark:text-white/60">
                  RM {currentRole.midLevel.min.toLocaleString()} - RM {currentRole.midLevel.max.toLocaleString()}
                </span>
              </div>
              <div className="relative h-8 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-end pr-3"
                  style={{ width: `${(currentRole.midLevel.max / maxSalary) * 100}%` }}
                >
                  <span className="text-white text-xs font-bold">
                    Avg: RM {currentRole.midLevel.avg.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Senior Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">Senior Level (5+ years)</span>
                <span className="text-sm text-black/60 dark:text-white/60">
                  RM {currentRole.senior.min.toLocaleString()} - RM {currentRole.senior.max.toLocaleString()}
                </span>
              </div>
              <div className="relative h-8 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-end pr-3"
                  style={{ width: `${(currentRole.senior.max / maxSalary) * 100}%` }}
                >
                  <span className="text-white text-xs font-bold">
                    Avg: RM {currentRole.senior.avg.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Projection */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-sm text-blue-900 dark:text-blue-300">
                  5-Year Growth Projection
                </div>
                <div className="text-xs text-black/60 dark:text-white/60">
                  From RM {currentRole.entry.avg.toLocaleString()} to RM {currentRole.senior.avg.toLocaleString()} 
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-2">
                    (+{Math.round(((currentRole.senior.avg - currentRole.entry.avg) / currentRole.entry.avg) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Grid */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-black/10 dark:border-white/15">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <span className="text-xl">🎁</span>
          Benefits Package
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                benefit.available
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{benefit.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                    {benefit.name}
                    {benefit.available && (
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs">✓</span>
                    )}
                  </div>
                  {benefit.details && (
                    <div className="text-xs text-black/60 dark:text-white/60">
                      {benefit.details}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-xs text-yellow-800 dark:text-yellow-400">
          ℹ️ Salary ranges are based on verified employee reports and may vary based on experience, education, and negotiation. 
          Benefits may differ by role and employment type.
        </p>
      </div>
    </div>
  );
}

