"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

type Course = {
  id: string;
  title: string;
  instructor: string;
  organization: string;
  rating: number;
  level: string;
  duration: string;
  students: string;
  category: string;
  thumbnail: string;
};

export default function AcademyPage() {
  const { signOut } = useAuth();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Mock course data organized by categories
  // Talks and Workshops
  const suggestedTalks = [
    {
      id: "talk1",
      title: "Tech Career Masterclass: From Graduate to Industry Leader",
      speaker: "Dato' Seri Ahmad Abdullah",
      organization: "Microsoft Malaysia",
      date: "Nov 15, 2024",
      time: "2:00 PM",
      duration: "90 min",
      attendees: "2.5K+",
      type: "Live Workshop",
      thumbnail: "🎤",
      category: "Career Development",
    },
    {
      id: "talk2",
      title: "AI & Machine Learning: The Future of Malaysian Tech",
      speaker: "Dr. Sarah Chen",
      organization: "Google Asia Pacific",
      date: "Nov 18, 2024",
      time: "4:00 PM",
      duration: "60 min",
      attendees: "3.2K+",
      type: "Tech Talk",
      thumbnail: "🤖",
      category: "Technology",
    },
    {
      id: "talk3",
      title: "Building Startups in Malaysia: Success Stories & Insights",
      speaker: "Tan Wei Ming",
      organization: "Grab Malaysia",
      date: "Nov 20, 2024",
      time: "3:00 PM",
      duration: "75 min",
      attendees: "1.8K+",
      type: "Panel Discussion",
      thumbnail: "🚀",
      category: "Entrepreneurship",
    },
    {
      id: "talk4",
      title: "Design Thinking Workshop: Creating User-Centric Products",
      speaker: "Priya Sharma",
      organization: "Shopee Malaysia",
      date: "Nov 22, 2024",
      time: "10:00 AM",
      duration: "2 hours",
      attendees: "1.5K+",
      type: "Hands-on Workshop",
      thumbnail: "🎨",
      category: "Design",
    },
    {
      id: "talk5",
      title: "Cybersecurity Essentials for Modern Developers",
      speaker: "John Lim",
      organization: "AWS Malaysia",
      date: "Nov 25, 2024",
      time: "5:00 PM",
      duration: "90 min",
      attendees: "2.1K+",
      type: "Tech Talk",
      thumbnail: "🔒",
      category: "Security",
    },
  ];

  const trendingCourses: Course[] = [
    {
      id: "1",
      title: "Python for Data Science & Machine Learning",
      instructor: "Prof. Ahmad Razak",
      organization: "Data Science Institute",
      rating: 4.8,
      level: "Beginner",
      duration: "40 hrs",
      students: "45K+",
      category: "Data Science",
      thumbnail: "🐍",
    },
    {
      id: "2",
      title: "Advanced React & Redux",
      instructor: "Sarah Chen",
      organization: "Web Masters Academy",
      rating: 4.7,
      level: "Advanced",
      duration: "28 hrs",
      students: "32K+",
      category: "Web Development",
      thumbnail: "⚛️",
    },
    {
      id: "3",
      title: "UI/UX Design Masterclass",
      instructor: "Priya Sharma",
      organization: "Design Pro",
      rating: 4.9,
      level: "Intermediate",
      duration: "35 hrs",
      students: "28K+",
      category: "Design",
      thumbnail: "🎨",
    },
    {
      id: "4",
      title: "Cloud Computing with AWS",
      instructor: "Michael Tan",
      organization: "Cloud Masters",
      rating: 4.6,
      level: "Advanced",
      duration: "48 hrs",
      students: "26K+",
      category: "Cloud",
      thumbnail: "☁️",
    },
    {
      id: "5",
      title: "Digital Marketing Strategy 2024",
      instructor: "Nurul Ain",
      organization: "Marketing Academy",
      rating: 4.8,
      level: "Beginner",
      duration: "24 hrs",
      students: "38K+",
      category: "Marketing",
      thumbnail: "📱",
    },
  ];

  const newCourses: Course[] = [
    {
      id: "6",
      title: "Blockchain & Cryptocurrency Fundamentals",
      instructor: "David Lee",
      organization: "Blockchain Institute",
      rating: 4.7,
      level: "Intermediate",
      duration: "32 hrs",
      students: "19K+",
      category: "Blockchain",
      thumbnail: "🔗",
    },
    {
      id: "7",
      title: "Leadership & Team Management",
      instructor: "Dato' Hassan Ibrahim",
      organization: "Leadership Academy",
      rating: 4.9,
      level: "All Levels",
      duration: "20 hrs",
      students: "41K+",
      category: "Leadership",
      thumbnail: "👔",
    },
    {
      id: "8",
      title: "Artificial Intelligence & Deep Learning",
      instructor: "Dr. Chen Wei",
      organization: "AI Research Center",
      rating: 4.8,
      level: "Advanced",
      duration: "56 hrs",
      students: "22K+",
      category: "AI",
      thumbnail: "🤖",
    },
    {
      id: "9",
      title: "Cybersecurity Essentials",
      instructor: "John Tan",
      organization: "Security Institute",
      rating: 4.7,
      level: "Intermediate",
      duration: "36 hrs",
      students: "25K+",
      category: "Security",
      thumbnail: "🔒",
    },
    {
      id: "10",
      title: "Public Speaking & Communication",
      instructor: "Sarah Ahmad",
      organization: "Communication Hub",
      rating: 4.9,
      level: "Beginner",
      duration: "16 hrs",
      students: "52K+",
      category: "Soft Skills",
      thumbnail: "🎤",
    },
  ];

  const popularCourses: Course[] = [
    {
      id: "11",
      title: "Excel for Business & Data Analysis",
      instructor: "Lisa Wong",
      organization: "Business Analytics Pro",
      rating: 4.6,
      level: "Beginner",
      duration: "18 hrs",
      students: "67K+",
      category: "Business",
      thumbnail: "📊",
    },
    {
      id: "12",
      title: "Mobile App Development with Flutter",
      instructor: "Ahmad Farhan",
      organization: "Mobile Dev Academy",
      rating: 4.8,
      level: "Intermediate",
      duration: "42 hrs",
      students: "31K+",
      category: "Mobile",
      thumbnail: "📱",
    },
    {
      id: "13",
      title: "DevOps & CI/CD Pipeline",
      instructor: "Kevin Lim",
      organization: "DevOps Masters",
      rating: 4.7,
      level: "Advanced",
      duration: "38 hrs",
      students: "24K+",
      category: "DevOps",
      thumbnail: "⚙️",
    },
    {
      id: "14",
      title: "Financial Analysis & Investment",
      instructor: "Rachel Tan",
      organization: "Finance Academy",
      rating: 4.8,
      level: "Intermediate",
      duration: "30 hrs",
      students: "29K+",
      category: "Finance",
      thumbnail: "💰",
    },
    {
      id: "15",
      title: "Graphic Design with Adobe Suite",
      instructor: "Maya Ibrahim",
      organization: "Creative Studio",
      rating: 4.9,
      level: "Beginner",
      duration: "26 hrs",
      students: "44K+",
      category: "Design",
      thumbnail: "🖌️",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/talentmatch-logo.png" alt="TalentMatch" width={32} height={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Academy</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button className="text-gray-700 hover:text-purple-600 transition-colors">Home</button>
              <button className="text-gray-700 hover:text-purple-600 transition-colors">My Learning</button>
              <button className="text-gray-700 hover:text-purple-600 transition-colors">Categories</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
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

      {/* Suggested Talks & Workshops Section */}
      <div className="pt-24 pb-8 px-6 sm:px-10 md:px-16 lg:px-24 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent">
            Upcoming Talks & Workshops
          </h1>
          <p className="text-lg text-gray-600">
            Learn from industry experts and expand your network
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {suggestedTalks.map((talk) => (
            <div
              key={talk.id}
              className="flex-shrink-0 w-96 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group cursor-pointer"
            >
              <div className="relative h-40 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform">
                {talk.thumbnail}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-bold rounded-full">
                    {talk.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    {talk.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 leading-tight">
                  {talk.title}
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900">{talk.speaker}</p>
                  <p className="text-xs text-gray-600">{talk.organization}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{talk.date} • {talk.time}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>⏱️ {talk.duration}</span>
                    <span>👥 {talk.attendees} registered</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Rows */}
      <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-12 space-y-16 bg-white">
        {/* Trending Now */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            🔥 Trending Now
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {trendingCourses.map((course) => (
              <div
                key={course.id}
                className="relative flex-shrink-0 w-80 group cursor-pointer"
                onMouseEnter={() => setHoveredId(course.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 shadow-lg ${
                  hoveredId === course.id ? "scale-105 shadow-2xl z-30" : "scale-100"
                }`}>
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-8xl">
                    {course.thumbnail}
                  </div>
                  
                  {hoveredId === course.id && (
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-sm p-5 flex flex-col justify-between text-white">
                      <div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-purple-200 mb-3">{course.organization}</p>
                        <div className="flex items-center gap-3 text-xs mb-3">
                          <span className="text-yellow-300 font-semibold">★ {course.rating}</span>
                          <span className="px-2 py-1 bg-white/20 rounded">{course.level}</span>
                          <span>{course.duration}</span>
                        </div>
                        <p className="text-xs text-purple-200">{course.students} students</p>
                      </div>
                      <button className="w-full py-3 bg-white text-purple-900 font-bold rounded-lg hover:bg-purple-50 transition-all text-sm shadow-lg">
                        Enroll Now
                      </button>
                    </div>
                  )}
                </div>
                
                {hoveredId !== course.id && (
                  <div className="mt-3">
                    <h3 className="font-semibold text-sm line-clamp-1 text-gray-900">{course.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{course.instructor}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-yellow-500">★ {course.rating}</span>
                      <span className="text-xs text-gray-500">• {course.students}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* New Courses */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            ✨ New Courses
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {newCourses.map((course) => (
              <div
                key={course.id}
                className="relative flex-shrink-0 w-80 group cursor-pointer"
                onMouseEnter={() => setHoveredId(course.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 shadow-lg ${
                  hoveredId === course.id ? "scale-105 shadow-2xl z-30" : "scale-100"
                }`}>
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-8xl">
                    {course.thumbnail}
                  </div>
                  
                  {hoveredId === course.id && (
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/95 to-blue-900/95 backdrop-blur-sm p-5 flex flex-col justify-between text-white">
                      <div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-indigo-200 mb-3">{course.organization}</p>
                        <div className="flex items-center gap-3 text-xs mb-3">
                          <span className="text-yellow-300 font-semibold">★ {course.rating}</span>
                          <span className="px-2 py-1 bg-white/20 rounded">{course.level}</span>
                          <span>{course.duration}</span>
                        </div>
                        <p className="text-xs text-indigo-200">{course.students} students</p>
                      </div>
                      <button className="w-full py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-all text-sm shadow-lg">
                        Enroll Now
                      </button>
                    </div>
                  )}
                </div>
                
                {hoveredId !== course.id && (
                  <div className="mt-3">
                    <h3 className="font-semibold text-sm line-clamp-1 text-gray-900">{course.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{course.instructor}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-yellow-500">★ {course.rating}</span>
                      <span className="text-xs text-gray-500">• {course.students}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            ⭐ Most Popular
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {popularCourses.map((course) => (
              <div
                key={course.id}
                className="relative flex-shrink-0 w-80 group cursor-pointer"
                onMouseEnter={() => setHoveredId(course.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 shadow-lg ${
                  hoveredId === course.id ? "scale-105 shadow-2xl z-30" : "scale-100"
                }`}>
                  <div className="h-48 bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-8xl">
                    {course.thumbnail}
                  </div>
                  
                  {hoveredId === course.id && (
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-900/95 to-pink-900/95 backdrop-blur-sm p-5 flex flex-col justify-between text-white">
                      <div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-orange-200 mb-3">{course.organization}</p>
                        <div className="flex items-center gap-3 text-xs mb-3">
                          <span className="text-yellow-300 font-semibold">★ {course.rating}</span>
                          <span className="px-2 py-1 bg-white/20 rounded">{course.level}</span>
                          <span>{course.duration}</span>
                        </div>
                        <p className="text-xs text-orange-200">{course.students} students</p>
                      </div>
                      <button className="w-full py-3 bg-white text-orange-900 font-bold rounded-lg hover:bg-orange-50 transition-all text-sm shadow-lg">
                        Enroll Now
                      </button>
                    </div>
                  )}
                </div>
                
                {hoveredId !== course.id && (
                  <div className="mt-3">
                    <h3 className="font-semibold text-sm line-clamp-1 text-gray-900">{course.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{course.instructor}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-yellow-500">★ {course.rating}</span>
                      <span className="text-xs text-gray-500">• {course.students}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

