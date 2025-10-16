"use client";

import { useState, useEffect } from "react";

interface AIPersonaModalProps {
  isOpen: boolean;
  onComplete: (reflection: string) => void;
}

export default function AIPersonaModal({ isOpen, onComplete }: AIPersonaModalProps) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isReflecting, setIsReflecting] = useState(true);
  const [reflection, setReflection] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isOpen || !isReflecting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsReflecting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isReflecting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSkipReflection = () => {
    setIsReflecting(false);
  };

  const handleSubmit = () => {
    if (!reflection.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      onComplete(reflection);
    }, 2000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In production, integrate with Web Speech API
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 relative">
        {isAnalyzing ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-emerald-200 dark:border-emerald-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold mb-3">Analyzing your profile...</h3>
            <p className="text-black/70 dark:text-white/70">
              Our AI is mapping your career potential and finding the best paths for you.
            </p>
          </div>
        ) : isReflecting ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-3xl font-bold mb-6 shadow-lg shadow-emerald-500/25">
              🧠
            </div>
            <h2 className="text-3xl font-bold mb-4">Discover Your Career Potential</h2>
            <p className="text-lg text-black/70 dark:text-white/70 mb-8">
              Take 3 minutes to reflect on your skills, strengths, and interests. This helps our AI understand who you are and predict your ideal career path.
            </p>

            <div className="mb-8">
              <div className="text-6xl font-bold text-emerald-600 mb-2">{formatTime(timeLeft)}</div>
              <div className="text-sm text-black/60 dark:text-white/60">Time to reflect</div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold mb-3">Think about:</h3>
              <ul className="space-y-2 text-sm text-black/70 dark:text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>What subjects or projects did you enjoy most in university?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>What technical or soft skills are you proud of?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>What kind of work environment excites you?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>Where do you see yourself in 2–5 years?</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSkipReflection}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-sm font-semibold shadow-lg shadow-emerald-600/25 transition-all"
            >
              {timeLeft === 0 ? "Continue" : "Skip & Continue"}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-3">Share Your Reflection</h2>
              <p className="text-black/70 dark:text-white/70">
                Tell us about your skills, interests, and career aspirations. Our AI will analyze your profile and predict your best career paths.
              </p>
            </div>

            <div className="mb-6">
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="e.g., I am an engineering student with great skills in soldering, circuit design, and embedded systems. I love working on IoT projects and want to work in hardware development..."
                className="w-full h-40 px-4 py-3 rounded-2xl border border-black/10 dark:border-white/20 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isRecording
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      Recording...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      Speak instead
                    </>
                  )}
                </button>
                <div className="text-sm text-black/60 dark:text-white/60">
                  {reflection.length} characters
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!reflection.trim()}
                className="flex-1 inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-black/10 disabled:text-black/40 dark:disabled:bg-white/10 dark:disabled:text-white/40 text-white px-8 h-12 text-sm font-semibold shadow-lg shadow-emerald-600/25 transition-all disabled:cursor-not-allowed disabled:shadow-none"
              >
                Analyze My Profile
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-black/60 dark:text-white/60">
              Your information is private and used only to personalize your experience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

