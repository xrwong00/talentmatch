"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface DomainTemplate {
  keywords: string[];
  negativeKeywords?: string[];
  build: (normalized: string, original: string) => AnalyzeResult;
}

const trimAndLower = (value: string) => value.trim().toLowerCase();

const summarizeReflection = (reflection: string) => {
  const cleaned = reflection.trim();
  return cleaned.length > 0 ? cleaned : "your reflection";
};

const engineeringTemplate: DomainTemplate = {
  keywords: [
    "engineering",
    "engineer",
    "embedded",
    "hardware",
    "mechatronic",
    "mechanical",
    "circuit",
    "iot",
    "manufactur",
    "robotics",
  ],
  negativeKeywords: ["software", "coding", "developer"],
  build: (_normalized, original) => ({
    careerPaths: [
      {
        title: "Hardware Design Engineer",
        confidence: 0.84,
        reasons: [
          `You highlighted an engineering background in ${summarizeReflection(original)}, which fits PCB and electronics design work.`,
        ],
      },
      {
        title: "Product Development Engineer",
        confidence: 0.78,
        reasons: ["Combines prototyping, testing, and cross-functional collaboration common in Malaysian electronics hubs."],
      },
      {
        title: "Automation & Mechatronics Specialist",
        confidence: 0.72,
        reasons: ["Engineering fundamentals translate well into factory automation and robotics roles across Penang and Selangor."],
      },
    ],
    careerMap: [
      {
        title: "Junior Test Engineer",
        timeframe: "Year 0-1",
        description: "Support PCB assembly testing, troubleshoot boards, and learn quality systems in manufacturing plants.",
      },
      {
        title: "Embedded Systems Engineer",
        timeframe: "Year 2-3",
        description: "Design firmware-hardware integration, build IoT prototypes, and coordinate with mechanical teams.",
      },
      {
        title: "Technical Project Lead",
        timeframe: "Year 4-5",
        description: "Own hardware roadmaps, manage vendor relationships, and mentor junior engineers.",
      },
    ],
    suggestions: [
      {
        focusArea: "Hands-on electronics",
        action: "Build prototype boards and run measurements to deepen hardware troubleshooting confidence.",
        resourceName: "Keysight University",
        resourceDescription: "Free instrument labs and PCB measurement lessons from a Malaysian-founded company",
        resourceUrl: "https://www.keysight.com/my/en/training-events/keysight-university.html",
      },
      {
        focusArea: "Manufacturing exposure",
        action: "Experience DFM and production collaboration through factory tours or industry-led workshops.",
        resourceName: "Penang Skills Development Centre (PSDC)",
        resourceDescription: "Advanced manufacturing courses popular with Malaysian E&E grads",
        resourceUrl: "https://www.psdc.org.my/",
      },
      {
        focusArea: "Professional credibility",
        action: "Join engineering bodies and log projects towards chartership.",
        resourceName: "Institution of Engineers Malaysia (IEM) Graduate Membership",
        resourceDescription: "Networking and professional development pathway for Malaysian engineers",
        resourceUrl: "https://www.myiem.org.my/",
      },
    ],
  }),
};

const softwareTemplate: DomainTemplate = {
  keywords: ["software", "developer", "coding", "programming", "web", "app"],
  build: (_normalized, original) => ({
    careerPaths: [
      {
        title: "Software Engineer",
        confidence: 0.83,
        reasons: [`${summarizeReflection(original)} points to programming interests aligned with build-focused roles.`],
      },
      {
        title: "Product Developer",
        confidence: 0.76,
        reasons: ["Pairs coding skills with user problem discovery for Malaysia's tech startups."],
      },
      {
        title: "Technical Consultant",
        confidence: 0.7,
        reasons: ["Transforms coding fluency into client-facing solution delivery roles."],
      },
    ],
    careerMap: [
      {
        title: "Junior Software Engineer",
        timeframe: "Year 0-1",
        description: "Ship features with guidance, write tests, and learn team delivery workflows.",
      },
      {
        title: "Product Engineer",
        timeframe: "Year 2-3",
        description: "Own user stories end-to-end, collaborate with designers, and improve reliability.",
      },
      {
        title: "Engineering Lead",
        timeframe: "Year 4-5",
        description: "Guide architecture, mentor juniors, and align tech initiatives to product goals.",
      },
    ],
    suggestions: [
      {
        focusArea: "Full-stack depth",
        action: "Strengthen React and Node fundamentals by shipping mini SaaS projects.",
        resourceName: "Scrimba Frontend Developer Career Path",
        resourceDescription: "Interactive lessons suitable for Malaysian learners",
        resourceUrl: "https://scrimba.com/learn/frontend",
      },
      {
        focusArea: "Product exposure",
        action: "Collaborate with local founders or hackathons to build real user-facing features.",
        resourceName: "MaGIC Global Accelerator Programme",
        resourceDescription: "Connects Malaysian tech talent with startups",
        resourceUrl: "https://www.mymagic.my/",
      },
      {
        focusArea: "Career signalling",
        action: "Publish a portfolio and write technical case studies to showcase impact.",
        resourceName: "Hashnode",
        resourceDescription: "Free developer blogging community",
        resourceUrl: "https://hashnode.com/",
      },
    ],
  }),
};

const actuarialTemplate: DomainTemplate = {
  keywords: ["actuarial", "statistics", "risk modelling", "insurance", "probability"],
  build: (_normalized, original) => ({
    careerPaths: [
      {
        title: "Actuarial Analyst",
        confidence: 0.84,
        reasons: [`${summarizeReflection(original)} signals quantitative strengths suited for pricing and reserving work.`],
      },
      {
        title: "Risk Consultant",
        confidence: 0.77,
        reasons: ["Applies actuarial techniques across enterprise risk and financial services."],
      },
      {
        title: "Insurance Product Strategist",
        confidence: 0.72,
        reasons: ["Supports long-term product planning using actuarial insights."],
      },
    ],
    careerMap: [
      {
        title: "Actuarial Trainee",
        timeframe: "Year 0-1",
        description: "Rotate across pricing, valuation, and data teams while passing core exams.",
      },
      {
        title: "Actuarial Associate",
        timeframe: "Year 2-3",
        description: "Lead reserving studies, model risk scenarios, and guide junior analysts.",
      },
      {
        title: "Lead Actuary / Risk Manager",
        timeframe: "Year 4-5",
        description: "Shape risk appetite, advise leadership, and manage multidisciplinary teams.",
      },
    ],
    suggestions: [
      {
        focusArea: "Professional exams",
        action: "Create a disciplined study plan for SOA/IFoA papers with weekly mock exams.",
        resourceName: "Actuarial Society of Malaysia (ASM)",
        resourceDescription: "Local exam prep workshops and networking",
        resourceUrl: "https://www.actuaries.org.my/",
      },
      {
        focusArea: "Industry tools",
        action: "Learn Prophet or SQL-based reserving tools through guided labs.",
        resourceName: "Sunway College Actuarial Science Courses",
        resourceDescription: "Workshops covering actuarial software exposure",
        resourceUrl: "https://sunway.edu.my/sunway-college/",
      },
      {
        focusArea: "Communication skills",
        action: "Present complex models through storytelling for non-technical stakeholders.",
        resourceName: "Toastmasters Malaysia",
        resourceDescription: "Clubs that sharpen presentation confidence",
        resourceUrl: "https://www.toastmasters.org/find-a-club",
      },
    ],
  }),
};

const designTemplate: DomainTemplate = {
  keywords: ["design", "sketch", "illustration", "product design", "ux", "ui", "creative", "architecture"],
  negativeKeywords: ["software"],
  build: (_normalized, original) => ({
    careerPaths: [
      {
        title: "Product Designer",
        confidence: 0.8,
        reasons: [`${summarizeReflection(original)} highlights creativity suited to user-centred design work.`],
      },
      {
        title: "UX Researcher",
        confidence: 0.73,
        reasons: ["Builds on curiosity and empathy to shape product decisions."],
      },
      {
        title: "Creative Technologist",
        confidence: 0.7,
        reasons: ["Pairs design intuition with prototyping for interactive experiences."],
      },
    ],
    careerMap: [
      {
        title: "Junior UX Designer",
        timeframe: "Year 0-1",
        description: "Conduct usability tests, translate insights into wireframes, and improve design systems.",
      },
      {
        title: "Product Designer",
        timeframe: "Year 2-3",
        description: "Drive end-to-end flows, partner with engineers, and measure user impact.",
      },
      {
        title: "Design Lead",
        timeframe: "Year 4-5",
        description: "Mentor designers, align brand consistency, and advocate for design strategy.",
      },
    ],
    suggestions: [
      {
        focusArea: "Portfolio depth",
        action: "Document projects with research goals, process, and measurable outcomes.",
        resourceName: "The Interaction Design Foundation (IxDF)",
        resourceDescription: "Affordable UX courses accessible from Malaysia",
        resourceUrl: "https://www.interaction-design.org/",
      },
      {
        focusArea: "User research",
        action: "Run interviews and usability tests with Malaysian users to understand local behaviours.",
        resourceName: "UX Malaysia Community",
        resourceDescription: "Meetups and talks tailored to local designers",
        resourceUrl: "https://www.uxmalaysia.com/",
      },
      {
        focusArea: "Prototyping skills",
        action: "Practice rapid prototyping with Figma, Framer, or Webflow.",
        resourceName: "Figma Learn",
        resourceDescription: "Official tutorials and community files",
        resourceUrl: "https://www.figma.com/resources/learn-design/",
      },
    ],
  }),
};

const generalTemplate: DomainTemplate = {
  keywords: [],
  build: (_normalized, original) => ({
    careerPaths: [
      {
        title: "Business Operations Associate",
        confidence: 0.72,
        reasons: ["Versatile role to explore interests while learning how organisations run."],
      },
      {
        title: "Project Coordinator",
        confidence: 0.69,
        reasons: ["Builds planning, communication, and stakeholder skills across sectors."],
      },
    ],
    careerMap: [
      {
        title: "Operations Executive",
        timeframe: "Year 0-1",
        description: "Improve internal processes, document SOPs, and support data tracking.",
      },
      {
        title: "Project Specialist",
        timeframe: "Year 2-3",
        description: "Coordinate initiatives, manage timelines, and resolve cross-team blockers.",
      },
      {
        title: "Strategy Manager",
        timeframe: "Year 4-5",
        description: "Lead strategic projects, drive change management, and mentor juniors.",
      },
    ],
    suggestions: [
      {
        focusArea: "Career clarity",
        action: `Expand ${summarizeReflection(original)} by journaling interests and tracking energy levels across tasks.`,
        resourceName: "MyStartr Career Programmes",
        resourceDescription: "Local workshops helping Malaysian grads explore careers",
        resourceUrl: "https://mystartr.com/",
      },
      {
        focusArea: "Core skills",
        action: "Develop spreadsheet, presentation, and stakeholder communication fundamentals.",
        resourceName: "Google Project Management Certificate",
        resourceDescription: "Structured operations toolkit with flexible schedule",
        resourceUrl: "https://www.coursera.org/professional-certificates/google-project-management",
      },
      {
        focusArea: "Professional network",
        action: "Attend industry meetups to test interests and learn hiring expectations.",
        resourceName: "Young Corporate Malaysians",
        resourceDescription: "Community events for Malaysian students and grads",
        resourceUrl: "https://www.youngcorporatemalaysians.com/",
      },
    ],
  }),
};

const templates: DomainTemplate[] = [softwareTemplate, engineeringTemplate, actuarialTemplate, designTemplate];

const generateFallbackInsights = (input: string): AnalyzeResult => {
  const normalized = trimAndLower(input);
  if (!normalized) return generalTemplate.build(normalized, input);

  const scored = templates
    .map((template) => {
      const positive =
        template.keywords.length === 0
          ? 0
          : template.keywords.reduce((acc, keyword) => (normalized.includes(keyword) ? acc + 1 : acc), 0);
      const negative =
        template.negativeKeywords?.reduce((acc, keyword) => (normalized.includes(keyword) ? acc + 1 : acc), 0) ?? 0;
      const score = positive - negative * 1.5;
      return { template, score };
    })
    .filter((entry) => entry.score > 0);

  const chosen = scored.sort((a, b) => b.score - a.score)[0]?.template ?? generalTemplate;
  return chosen.build(normalized, input);
};

interface DiscoverCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscoverCareerModal({ isOpen, onClose }: DiscoverCareerModalProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("reflect");
  const [timeLeft, setTimeLeft] = useState(180);
  const [inputText, setInputText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPhase("reflect");
    setTimeLeft(180);
    setInputText("");
    setTranscript("");
    setResult(null);
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
    if (!text || !text.trim()) return;
    setPhase("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });
      if (!res.ok) throw new Error("Failed to analyze");
      const data = (await res.json()) as AnalyzeResult;
      const enriched: AnalyzeResult = {
        ...data,
        suggestions: Array.isArray((data as { suggestions?: unknown }).suggestions)
          ? ((data as { suggestions?: unknown }).suggestions as unknown[]).map((item, index) => {
              if (typeof item === "string") {
                return {
                  focusArea: `Development focus ${index + 1}`,
                  action: item,
                  resourceName: "LinkedIn Learning",
                };
              }
              const entry = item as Partial<AnalyzeResultSuggestion>;
              return {
                focusArea: entry.focusArea && entry.focusArea.trim() ? entry.focusArea : `Development focus ${index + 1}`,
                action: entry.action && entry.action.trim() ? entry.action : "Deepen capability through focused practice.",
                resourceName:
                  entry.resourceName && entry.resourceName.trim() ? entry.resourceName : "LinkedIn Learning",
                resourceDescription: entry.resourceDescription,
                resourceUrl: entry.resourceUrl,
              };
            })
          : undefined,
      };
      setResult(enriched);
      // Persist to session and redirect to dashboard immediately
      try {
        sessionStorage.setItem("tm_ai_insights", JSON.stringify(enriched));
      } catch {}
      onClose();
      router.push("/dashboard");
      return;
    } catch {
      const fallback = generateFallbackInsights(text);
      setResult(fallback);
      try {
        sessionStorage.setItem("tm_ai_insights", JSON.stringify(fallback));
      } catch {}
      onClose();
      router.push("/dashboard");
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background text-foreground w-full max-w-3xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 relative">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 rounded-full w-9 h-9 flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
        >
          ✕
        </button>

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
              <Link href="/mentorship" className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-11 text-sm font-semibold">
                Find a Mentor
              </Link>
              <button
                onClick={() => {
                  try {
                    if (result) sessionStorage.setItem("tm_ai_insights", JSON.stringify(result));
                  } catch {}
                  onClose();
                  router.push("/dashboard");
                }}
                className="inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/20 px-6 h-11 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5"
              >
                View in Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
