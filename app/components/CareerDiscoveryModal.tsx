"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type CareerPath = {
  title: string;
  yearsExperience: string;
  description: string;
  keySkills: string[];
  salaryRange: string;
  recommendedCompanies: string[];
};

type CareerAnalysis = {
  currentRole: string;
  strengths: string[];
  careerPaths: CareerPath[];
  recommendations: string[];
};

interface CareerDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CareerDiscoveryModal({ isOpen, onClose }: CareerDiscoveryModalProps) {
  const [stage, setStage] = useState<"countdown" | "input" | "analyzing" | "results">("countdown");
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
  const [inputMethod, setInputMethod] = useState<"speak" | "type" | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [careerAnalysis, setCareerAnalysis] = useState<CareerAnalysis | null>(null);
  const [error, setError] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;
    
    if (stage === "countdown" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (stage === "countdown" && countdown === 0) {
      setStage("input");
    }
  }, [isOpen, stage, countdown]);

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setStage("countdown");
      setCountdown(180);
      setInputMethod(null);
      setUserInput("");
      setIsRecording(false);
      setCareerAnalysis(null);
      setError("");
    }
  }, [isOpen]);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setUserInput((prev) => prev + finalTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError("Speech recognition error. Please try typing instead.");
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  };

  // Handle speak button click
  const handleSpeak = () => {
    setInputMethod("speak");
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      setIsRecording(true);
      recognitionRef.current.start();
    } else {
      setError("Speech recognition is not supported in your browser. Please use the Type option.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle type button click
  const handleType = () => {
    setInputMethod("type");
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Skip countdown
  const skipCountdown = () => {
    setStage("input");
  };

  // Analyze career input
  const analyzeCareer = async () => {
    if (!userInput.trim()) {
      setError("Please provide some input about your experience and skills.");
      return;
    }

    setStage("analyzing");
    setError("");

    try {
      const response = await fetch("/api/analyze-career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze career path");
      }

      const data = await response.json();
      setCareerAnalysis(data);
      setStage("results");
    } catch (err) {
      console.error("Error analyzing career:", err);
      setError("Failed to analyze your career path. Please try again.");
      setStage("input");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-blue-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              🚀 Discover Your Career Path
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Countdown Stage */}
          {stage === "countdown" && (
            <div className="text-center">
              <div className="mb-8">
                <div className="text-8xl font-bold text-emerald-600 mb-4">
                  {formatTime(countdown)}
                </div>
                <div className="inline-block px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 font-semibold">
                  Reflection Time
                </div>
              </div>
              
              <div className="max-w-2xl mx-auto mb-8">
                <p className="text-lg text-black/80 dark:text-white/80 leading-relaxed">
                  Take 3 minutes to reflect on your experience, skills, and strengths. 
                  Once ready, share your thoughts — either by typing or speaking.
                </p>
                <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                    💡 Think about:
                  </h3>
                  <ul className="text-left text-sm text-blue-800 dark:text-blue-400 space-y-2">
                    <li>• Your educational background and achievements</li>
                    <li>• Skills you've developed (technical and soft skills)</li>
                    <li>• Projects or work experience you're proud of</li>
                    <li>• What you enjoy doing and your career aspirations</li>
                    <li>• Your strengths and areas where you excel</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={skipCountdown}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                I'm Ready, Skip Countdown
              </button>
            </div>
          )}

          {/* Input Stage */}
          {stage === "input" && (
            <div>
              {!inputMethod ? (
                <div className="text-center">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-3">How would you like to share?</h3>
                    <p className="text-black/70 dark:text-white/70">
                      Choose your preferred method to tell us about yourself
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button
                      onClick={handleSpeak}
                      className="p-8 border-2 border-emerald-500 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                        🎤
                      </div>
                      <h4 className="text-xl font-bold mb-2">Speak</h4>
                      <p className="text-sm text-black/60 dark:text-white/60">
                        Use voice input to share your thoughts
                      </p>
                    </button>

                    <button
                      onClick={handleType}
                      className="p-8 border-2 border-blue-500 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                        ⌨️
                      </div>
                      <h4 className="text-xl font-bold mb-2">Type</h4>
                      <p className="text-sm text-black/60 dark:text-white/60">
                        Write about your experience and skills
                      </p>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">
                        {inputMethod === "speak" ? "🎤 Speak Your Mind" : "⌨️ Share Your Story"}
                      </h3>
                      <button
                        onClick={() => {
                          setInputMethod(null);
                          setUserInput("");
                          stopRecording();
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Change Method
                      </button>
                    </div>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      Tell us about your education, skills, experience, and career goals
                    </p>
                  </div>

                  {inputMethod === "speak" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        {isRecording ? (
                          <>
                            <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-red-600">Recording...</span>
                            <button
                              onClick={stopRecording}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                            >
                              Stop Recording
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleSpeak}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                          >
                            Start Recording
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <textarea
                      ref={textareaRef}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Example: I recently graduated with a degree in Computer Science. I'm skilled in Python, Java, and web development. I completed an internship where I built a data analytics dashboard. I'm passionate about solving problems with code and want to pursue a career in software development or data analysis..."
                      className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 resize-none"
                      readOnly={inputMethod === "speak" && isRecording}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-black/50 dark:text-white/50">
                        {userInput.length} characters
                      </span>
                      {userInput.length < 30 && (
                        <span className="text-xs text-orange-600">
                          Please provide more details (min 30 characters)
                        </span>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={analyzeCareer}
                      disabled={userInput.length < 30}
                      className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Analyze My Career Path 🚀
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analyzing Stage */}
          {stage === "analyzing" && (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Analyzing Your Career Path...</h3>
              <p className="text-black/70 dark:text-white/70 max-w-md mx-auto">
                Our AI is analyzing your skills, experience, and aspirations to create a personalized career roadmap for you.
              </p>
            </div>
          )}

          {/* Results Stage */}
          {stage === "results" && careerAnalysis && (
            <div>
              {/* Strengths */}
              {careerAnalysis.strengths && careerAnalysis.strengths.length > 0 && (
                <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💪</span>
                    Your Key Strengths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {careerAnalysis.strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Progression Map */}
              <div className="mb-8">
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="text-2xl">🗺️</span>
                  Your Career Progression Map
                </h4>
                <div className="space-y-4">
                  {careerAnalysis.careerPaths.map((path, index) => (
                    <div key={index} className="relative">
                      {index < careerAnalysis.careerPaths.length - 1 && (
                        <div className="absolute left-6 top-full w-0.5 h-4 bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                      )}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 transition-all shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="text-xl font-bold">{path.title}</h5>
                              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
                                {path.yearsExperience}
                              </span>
                            </div>
                            <p className="text-black/70 dark:text-white/70 mb-3">
                              {path.description}
                            </p>
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">
                                Key Skills to Develop:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {path.keySkills.map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-black/70 dark:text-white/70 rounded-lg text-sm"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-semibold">💰 Salary Range:</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {path.salaryRange}
                              </span>
                            </div>
                            {path.recommendedCompanies && path.recommendedCompanies.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-semibold text-black/60 dark:text-white/60 mb-2">
                                  🏢 Recommended Companies:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {path.recommendedCompanies.map((company, companyIndex) => (
                                    <span
                                      key={companyIndex}
                                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-200 dark:border-blue-800"
                                    >
                                      {company}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {careerAnalysis.recommendations && careerAnalysis.recommendations.length > 0 && (
                <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    Recommendations for Success
                  </h4>
                  <ul className="space-y-2">
                    {careerAnalysis.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-purple-800 dark:text-purple-300"
                      >
                        <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Find a Mentor CTA */}
              <div className="p-6 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl text-white">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🤝</div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-1">Ready to Accelerate Your Growth?</h4>
                    <p className="text-white/90 text-sm">
                      Connect with experienced mentors who can guide you on your career journey
                    </p>
                  </div>
                  <Link
                    href="/mentor"
                    className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all shadow-lg flex-shrink-0"
                  >
                    Find a Mentor
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    setStage("input");
                    setInputMethod(null);
                    setUserInput("");
                    setCareerAnalysis(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
                >
                  Start Over
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

