"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Phase = "reflect" | "choose" | "type" | "speak" | "analyzing" | "result";

// Minimal types to avoid any
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{ 0: { transcript: string } }>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface AnalyzeResultPath {
  title: string;
  confidence?: number;
  reasons?: string[];
}

interface AnalyzeResultStep {
  title: string;
  timeframe?: string;
  description?: string;
}

interface AnalyzeResultSuggestion {
  focusArea: string;
  action: string;
  resourceName: string;
  resourceDescription?: string;
  resourceUrl?: string;
}

interface AnalyzeResult {
  careerPaths: AnalyzeResultPath[];
  careerMap: AnalyzeResultStep[];
  suggestions?: AnalyzeResultSuggestion[];
}

const isAnalyzeResult = (value: unknown): value is AnalyzeResult => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AnalyzeResult>;
  return Array.isArray(candidate.careerPaths) && Array.isArray(candidate.careerMap);
};


interface DiscoverCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscoverCareerModal({ isOpen, onClose }: DiscoverCareerModalProps) {
  const [phase, setPhase] = useState<Phase>("reflect");
  const [timeLeft, setTimeLeft] = useState(180);
  const [inputText, setInputText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPhase("reflect");
    setTimeLeft(180);
    setInputText("");
    setTranscript("");
    setResult(null);
    setError(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || phase !== "reflect") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setPhase("choose");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isOpen, phase]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const beginSpeak = () => {
    const w = window as unknown as {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRecognition = w.webkitSpeechRecognition || w.SpeechRecognition;
    if (!SpeechRecognition) {
      setPhase("type");
      return;
    }
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let latest = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          latest += event.results[i][0].transcript;
        }
        setTranscript(latest);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
    }
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopSpeak = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const submitForAnalysis = async (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;

    setPhase("analyzing");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: cleaned }),
      });

      let payload: unknown = null;
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }

      if (!res.ok) {
        let message = "Failed to analyze your profile. Please try again.";
        if (payload && typeof payload === "object" && payload !== null) {
          const body = payload as { error?: unknown; details?: unknown };
          const base = typeof body.error === "string" ? body.error.trim() : "";
          const detail = typeof body.details === "string" ? body.details.trim() : "";
          const merged = [base, detail].filter(Boolean).join(" – ");
          if (merged) {
            message = merged;
          }
        }
        throw new Error(message);
      }

      if (!isAnalyzeResult(payload)) {
        throw new Error("Analysis returned incomplete data. Please refine your reflection and try again.");
      }

      const suggestions = Array.isArray(payload.suggestions)
        ? payload.suggestions.map((item, index) => {
            if (typeof item === "string") {
              return {
                focusArea: `Development focus ${index + 1}`,
                action: item,
                resourceName: "LinkedIn Learning",
              };
            }
            if (!item || typeof item !== "object") {
              return {
                focusArea: `Development focus ${index + 1}`,
                action: "Deepen capability through focused practice.",
                resourceName: "LinkedIn Learning",
              };
            }
            const entry = item as Partial<AnalyzeResultSuggestion>;
            const focus = entry.focusArea?.trim();
            const action = entry.action?.trim();
            const resource = entry.resourceName?.trim();
            return {
              focusArea: focus && focus.length > 0 ? focus : `Development focus ${index + 1}`,
              action: action && action.length > 0 ? action : "Deepen capability through focused practice.",
              resourceName: resource && resource.length > 0 ? resource : "LinkedIn Learning",
              resourceDescription: entry.resourceDescription,
              resourceUrl: entry.resourceUrl,
            };
          })
        : undefined;

      const enriched: AnalyzeResult = {
        careerPaths: payload.careerPaths,
        careerMap: payload.careerMap,
        suggestions,
      };

      setResult(enriched);

      try {
        sessionStorage.setItem("tm_ai_insights", JSON.stringify(enriched));
      } catch {
        // ignore persistence failures
      }

      setPhase("result");
    } catch (error) {
      console.error("Analysis error:", error);
      setResult(null);

      try {
        sessionStorage.removeItem("tm_ai_insights");
      } catch {
        // ignore persistence failures
      }

      const message =
        error instanceof Error && error.message
          ? error.message
          : "We couldn't analyze your profile. Please try again.";
      setError(message);
      setPhase("type");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Make the modal container flex-col with max height and an internal scrollable area */}
      <div className="bg-background text-foreground w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 rounded-full w-9 h-9 flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
        >
          ✕
        </button>

        {/* Scrollable content area so long results can be viewed fully */}
        <div className="overflow-y-auto p-6 sm:p-8 md:p-10">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-100">
              {error}
            </div>
          )}
        {phase === "reflect" && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-3xl font-bold mb-6 shadow-lg shadow-emerald-500/25">
              🧠
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Map Your 5-Year Career</h2>
            <p className="text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              Take 3 minutes to reflect on your skills, interests, and goals. AI will analyze your profile and predict your complete career progression.
            </p>
            <div className="mt-8">
              <div className="text-6xl font-bold text-emerald-600 mb-2">{formatTime(timeLeft)}</div>
              <div className="text-sm text-black/60 dark:text-white/60">Time to reflect</div>
            </div>
            <div className="mt-8">
              <button
                onClick={() => setPhase("choose")}
                className="inline-flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-6 h-11 text-sm font-semibold"
              >
                Skip reflection
              </button>
            </div>
          </div>
        )}

        {phase === "choose" && (
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">How would you like to share your profile?</h3>
            <p className="text-black/70 dark:text-white/70 max-w-2xl mx-auto mb-6">
              Type or speak your skills, interests, and goals. AI will analyze your profile and create your personalized 5-year career map.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setPhase("speak")}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 px-6 h-12 text-sm font-semibold hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500"
              >
                🎤 Speak
              </button>
              <button
                onClick={() => setPhase("type")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-12 text-sm font-semibold"
              >
                ⌨️ Type
              </button>
            </div>
          </div>
        )}

        {phase === "type" && (
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3">Share your profile</h3>
            <p className="text-black/70 dark:text-white/70 mb-4">
              Example: "I'm an engineering student skilled in circuit design and embedded systems. I enjoy IoT projects and want to work in hardware development."
            </p>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share your skills, interests, and goals..."
              className="w-full h-40 px-4 py-3 rounded-2xl border border-black/10 dark:border-white/20 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => submitForAnalysis(inputText)}
                disabled={!inputText.trim()}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-black/10 disabled:text-black/40 dark:disabled:bg-white/10 dark:disabled:text-white/40 text-white px-6 h-11 text-sm font-semibold"
              >
                Analyze
              </button>
            </div>
          </div>
        )}

        {phase === "speak" && (
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3">Speak your profile</h3>
            <p className="text-black/70 dark:text-white/70 mb-4">Click record and share your skills, interests, and career goals.</p>
            <div className="rounded-2xl border border-black/10 dark:border-white/20 p-4 bg-black/5 dark:bg-white/5 min-h-[96px]">
              <div className="text-sm opacity-80 whitespace-pre-wrap">{transcript || "Your speech will appear here..."}</div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              {!isRecording ? (
                <button onClick={beginSpeak} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-11 text-sm font-semibold">
                  🎤 Start recording
                </button>
              ) : (
                <button onClick={stopSpeak} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white px-6 h-11 text-sm font-semibold">
                  ⏹ Stop
                </button>
              )}
              <button
                onClick={() => submitForAnalysis(transcript)}
                disabled={!transcript.trim()}
                className="inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/20 px-6 h-11 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
              >
                Analyze
              </button>
            </div>
          </div>
        )}

        {phase === "analyzing" && (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-emerald-200 dark:border-emerald-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-lg font-semibold">Analyzing your reflection...</div>
            <div className="text-sm text-black/60 dark:text-white/60">Mapping career paths and progression</div>
          </div>
        )}

        {phase === "result" && result && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Your AI Career Insights</h3>

            <div className="mb-6">
              <div className="text-sm font-semibold mb-2">Suggested Career Paths</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.careerPaths.map((p) => (
                  <div key={p.title} className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{p.title}</div>
                      {typeof p.confidence === "number" && (
                        <div className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">
                          {(p.confidence * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                    {p.reasons && p.reasons.length > 0 && (
                      <ul className="mt-2 text-xs list-disc pl-4 opacity-80">
                        {p.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-semibold mb-2">Career Map (2–5 years)</div>
              <ol className="relative border-l border-emerald-300 dark:border-emerald-800 ml-2">
                {result.careerMap.map((s, idx) => (
                  <li key={idx} className="ml-4 py-3">
                    <div className="absolute -left-[6px] w-3 h-3 rounded-full bg-emerald-600"></div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-xs text-black/60 dark:text-white/60">{s.timeframe || ""}</div>
                    {s.description && (
                      <div className="text-sm mt-1 opacity-90">{s.description}</div>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-semibold mb-2">Suggestions</div>
                <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                  {result.suggestions.map((s, i) => (
                    <li key={i}>
                      <span className="font-semibold">{s.focusArea}:</span> {s.action}
                      {s.resourceName && (
                        <>
                          {" - "}
                          {s.resourceUrl ? (
                            <a
                              href={s.resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 dark:text-emerald-300 underline underline-offset-2"
                            >
                              {s.resourceName}
                            </a>
                          ) : (
                            <span className="text-emerald-700 dark:text-emerald-300">{s.resourceName}</span>
                          )}
                          {s.resourceDescription ? ` (${s.resourceDescription})` : null}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onClose();
                }}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-11 text-sm font-semibold"
              >
                Close & Continue
              </button>
              <Link 
                href="/profile/setup"
                className="inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/20 px-6 h-11 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5"
              >
                Update My Profile
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

