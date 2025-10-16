"use client";

import { useEffect, useState } from "react";

interface AlumniConnectProps {
  companyId: string;
}

interface AlumniProfile {
  id: string;
  name: string;
  role: string;
  tenure: string;
  university: string;
  degree: string;
  avatar: string;
  availability: "Available" | "Busy" | "Limited";
  expertise: string[];
  connectionRate: number;
}

export default function AlumniConnect({ companyId }: AlumniConnectProps) {
  const [loading, setLoading] = useState(true);
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);

  useEffect(() => {
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      setAlumni([
        {
          id: "1",
          name: "Aisha Rahman",
          role: "Senior Software Engineer",
          tenure: "3 years at company",
          university: "Universiti Malaya",
          degree: "Computer Science",
          avatar: "A",
          availability: "Available",
          expertise: ["Career Advice", "Technical Interview Prep", "Work Culture"],
          connectionRate: 95,
        },
        {
          id: "2",
          name: "Chen Wei",
          role: "Product Manager",
          tenure: "2 years at company",
          university: "Universiti Teknologi Malaysia",
          degree: "Software Engineering",
          avatar: "C",
          availability: "Limited",
          expertise: ["Product Management", "Career Transition", "Leadership"],
          connectionRate: 88,
        },
        {
          id: "3",
          name: "Priya Sharma",
          role: "Data Scientist",
          tenure: "4 years at company",
          university: "Universiti Putra Malaysia",
          degree: "Data Science",
          avatar: "P",
          availability: "Available",
          expertise: ["Data Science", "Machine Learning", "Career Growth"],
          connectionRate: 92,
        },
        {
          id: "4",
          name: "Hadi Ismail",
          role: "UX Designer",
          tenure: "1.5 years at company",
          university: "Universiti Sains Malaysia",
          degree: "Interactive Media",
          avatar: "H",
          availability: "Busy",
          expertise: ["UX Design", "Portfolio Building", "Design Tools"],
          connectionRate: 85,
        },
      ]);
      setLoading(false);
    }, 600);
  }, [companyId]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Limited":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Busy":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/15 shadow-sm p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xl">
            🤝
          </div>
          <div>
            <h2 className="text-xl font-bold">Connect with Alumni</h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              Get guidance from employees who worked at this company
            </p>
          </div>
        </div>
      </div>

      {/* Alumni Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {alumni.map((person) => (
          <div
            key={person.id}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-black/5 dark:border-white/5 hover:shadow-lg transition-all"
          >
            {/* Profile Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {person.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{person.name}</h3>
                <p className="text-sm text-black/70 dark:text-white/70 mb-1">
                  {person.role}
                </p>
                <p className="text-xs text-black/50 dark:text-white/50">
                  {person.tenure}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(person.availability)}`}>
                {person.availability}
              </span>
            </div>

            {/* Education */}
            <div className="mb-4 p-3 bg-white dark:bg-gray-900 rounded-lg border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-600 dark:text-blue-400">🎓</span>
                <div>
                  <div className="font-semibold">{person.degree}</div>
                  <div className="text-xs text-black/60 dark:text-white/60">{person.university}</div>
                </div>
              </div>
            </div>

            {/* Expertise Tags */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-black/60 dark:text-white/60 mb-2">
                Can help with:
              </div>
              <div className="flex flex-wrap gap-2">
                {person.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Connection Stats */}
            <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700 dark:text-green-400">Response Rate:</span>
                <span className="font-bold text-green-800 dark:text-green-300">
                  {person.connectionRate}%
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm">
                Request Mentorship
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1 text-sm">
              Why Connect with Alumni?
            </h3>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-400">
              <li>• Get insider insights about company culture and work environment</li>
              <li>• Learn about interview process and preparation tips</li>
              <li>• Understand career growth opportunities and paths</li>
              <li>• Receive guidance on skill development and performance expectations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA for becoming a mentor */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
        <p className="text-sm text-black/70 dark:text-white/70 mb-3">
          Are you a former employee? Share your experience and help future graduates!
        </p>
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
          Become a Mentor
        </button>
      </div>
    </div>
  );
}

