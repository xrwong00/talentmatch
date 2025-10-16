"use client";

interface Mission {
  id: string;
  title: string;
  description: string;
  category: "skill" | "portfolio" | "networking" | "learning";
  points: number;
  timeEstimate: string;
  completed: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export default function CareerMissions() {
  const missions: Mission[] = [
    {
      id: "1",
      title: "Build a Temperature Monitoring IoT Device",
      description: "Create a simple IoT project using Arduino/ESP32 to monitor temperature and send data to cloud. Add it to your GitHub portfolio.",
      category: "portfolio",
      points: 150,
      timeEstimate: "4-6 hours",
      completed: false,
      difficulty: "intermediate",
    },
    {
      id: "2",
      title: "Complete 'IoT Fundamentals' on Coursera",
      description: "Strengthen your foundation in IoT protocols and architecture. This course is recommended by employers in your target roles.",
      category: "learning",
      points: 100,
      timeEstimate: "3 weeks",
      completed: false,
      difficulty: "beginner",
    },
    {
      id: "3",
      title: "Contribute to Open Source Hardware Project",
      description: "Find an open-source hardware project on GitHub and make your first contribution. Great for networking and visibility.",
      category: "networking",
      points: 200,
      timeEstimate: "2-4 hours",
      completed: true,
      difficulty: "intermediate",
    },
    {
      id: "4",
      title: "Practice PCB Design with KiCad",
      description: "Design a simple LED blinker PCB using KiCad. This skill is required for 3 of your matched Day-1 roles.",
      category: "skill",
      points: 120,
      timeEstimate: "5-7 hours",
      completed: false,
      difficulty: "intermediate",
    },
    {
      id: "5",
      title: "Connect with 5 Hardware Engineers on LinkedIn",
      description: "Build your professional network by connecting with engineers at companies you're interested in. Include a personalized note.",
      category: "networking",
      points: 50,
      timeEstimate: "30 mins",
      completed: false,
      difficulty: "beginner",
    },
  ];

  const categoryIcons = {
    skill: "⚡",
    portfolio: "📁",
    networking: "🤝",
    learning: "📚",
  };

  const categoryColors = {
    skill: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    portfolio: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    networking: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    learning: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  };

  const difficultyColors = {
    beginner: "text-green-600 dark:text-green-400",
    intermediate: "text-yellow-600 dark:text-yellow-400",
    advanced: "text-red-600 dark:text-red-400",
  };

  const activeMissions = missions.filter((m) => !m.completed);
  const completedMissions = missions.filter((m) => m.completed);
  const totalPoints = missions.filter((m) => m.completed).reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="p-6 rounded-2xl border border-black/10 dark:border-white/15 bg-background">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Career Missions 🧭</h2>
          <p className="text-sm text-black/70 dark:text-white/70">
            AI-curated micro-tasks to strengthen your career profile
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalPoints}</div>
          <div className="text-xs text-black/60 dark:text-white/60">Career Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-black/60 dark:text-white/60">Progress</span>
          <span className="font-medium">
            {completedMissions.length} / {missions.length} missions
          </span>
        </div>
        <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
            style={{ width: `${(completedMissions.length / missions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Active Missions */}
      <div className="space-y-3 mb-6">
        {activeMissions.map((mission) => (
          <div
            key={mission.id}
            className={`p-4 rounded-xl border ${categoryColors[mission.category]} hover:shadow-lg transition-all`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{categoryIcons[mission.category]}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm leading-tight">{mission.title}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold ml-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {mission.points}
                  </div>
                </div>
                <p className="text-xs mb-3 opacity-90">{mission.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {mission.timeEstimate}
                    </span>
                    <span className={`capitalize ${difficultyColors[mission.difficulty]}`}>
                      {mission.difficulty}
                    </span>
                  </div>
                  <button className="px-3 py-1 rounded-full bg-white dark:bg-black text-xs font-semibold hover:scale-105 transition-transform">
                    Start
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Missions */}
      {completedMissions.length > 0 && (
        <div className="pt-4 border-t border-black/10 dark:border-white/15">
          <h3 className="text-sm font-semibold mb-3 text-black/60 dark:text-white/60">Completed</h3>
          <div className="space-y-2">
            {completedMissions.map((mission) => (
              <div
                key={mission.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 opacity-75"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <div className="flex-1 text-sm">{mission.title}</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  +{mission.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

