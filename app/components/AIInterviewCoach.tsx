"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AIInterviewCoachProps {
  onClose: () => void;
}

type CoachAction = "question" | "feedback" | "tips";

type FeedbackSummary = {
  rating: number | null;
  summary: string;
  strengths: string[];
  improvements: string[];
  followUpPrompt?: string;
};

type PracticeDrill = {
  title: string;
  description: string;
  howToPractice: string;
};

type ElevenCoachResponse = Record<string, unknown> & {
  conversationId?: string;
  raw?: string;
};

// Leftover from ElevenLabs/WebRTC path. Not used in GPT mode.
const DEFAULT_ICE_SERVERS: RTCIceServer[] = [];

// Minimal Web Speech API types to avoid `any`.
type MinimalSpeechAlternative = { transcript?: string };
type MinimalSpeechResult = { isFinal?: boolean; 0?: MinimalSpeechAlternative };
type MinimalSREvent = { results?: ArrayLike<MinimalSpeechResult> };
type MinimalSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: MinimalSREvent) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export default function AIInterviewCoach({ onClose }: AIInterviewCoachProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [questionContext, setQuestionContext] = useState("");
  const [questionTips, setQuestionTips] = useState<string[]>([]);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<FeedbackSummary | null>(null);
  const [practiceDrills, setPracticeDrills] = useState<PracticeDrill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceConnecting, setVoiceConnecting] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);
  const lastEvaluatedRef = useRef<string>("");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const stopVoiceSession = useCallback(() => {
    // Stop any active speech recognition cleanly
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setVoiceConnecting(false);
    setVoiceActive(false);
  }, []);

  useEffect(() => {
    setIsLoading(false);
    return () => {
      stopVoiceSession();
    };
  }, [stopVoiceSession]);

  async function speak(text: string) {
    const safeText = text?.trim();
    if (!safeText) return;
    try {
      setIsSpeaking(true);
      // Stop any currently playing TTS to avoid overlaps/loops
      if (ttsAudioRef.current) {
        try {
          ttsAudioRef.current.pause();
          ttsAudioRef.current.src = "";
        } catch {}
      }
      const resp = await fetch("/api/voice-tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: safeText }),
      });
      if (!resp.ok) return;
      const arrayBuf = await resp.arrayBuffer();
      const blob = new Blob([arrayBuf], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      if (!ttsAudioRef.current) {
        ttsAudioRef.current = new Audio();
      }
      ttsAudioRef.current.src = url;
      await ttsAudioRef.current.play().catch(() => {});
    } catch {
      // Ignore playback failures to keep UX smooth
    } finally {
      setIsSpeaking(false);
    }
  }

  async function fetchCoach(action: CoachAction, message?: string) {
    const resp = await fetch("/api/voice-coach", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action,
        message,
      }),
    });

    const data: ElevenCoachResponse = await resp.json();

    if (!resp.ok) {
      const base =
        typeof data?.error === "string"
          ? data.error
          : "Unable to reach the interview coach. Please try again.";
      const details = typeof data?.details === "string" ? data.details : "";
      throw new Error(details ? `${base}: ${details}` : base);
    }

    if (typeof data?.conversationId === "string") {
      setConversationId(data.conversationId);
    }

    return data;
  }

  async function handleAskQuestion() {
    setError(null);
    setQuestionLoading(true);
    try {
      const data = await fetchCoach("question");
      const questionText =
        typeof data.question === "string"
          ? data.question
          : typeof data.raw === "string"
          ? data.raw
          : "";

      const context =
        typeof data.context === "string" ? data.context : questionContext;

      setQuestion(questionText);
      setQuestionContext(context);
      setQuestionTips(toStringArray(data.tips));
      setFollowUps(toStringArray(data.followUps));
      setPracticeDrills([]);
      setFeedback(null);
      setTranscript("");

      if (!voiceActive) {
        const speechParts = [questionText, context, ...toStringArray(data.tips)];
        const spoken = speechParts
          .map((item) => item.trim())
          .filter(Boolean)
          .join(". ");
        await speak(spoken || questionText);
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setQuestionLoading(false);
    }
  }

  async function evaluateAnswer(answer: string) {
    const cleaned = answer.trim();
    if (!cleaned) {
      setError("Record or paste an answer before requesting feedback.");
      return;
    }

    setError(null);
    setFeedbackLoading(true);
    try {
      const data = await fetchCoach("feedback", cleaned);
      const summary =
        typeof data.summary === "string"
          ? data.summary
          : typeof data.raw === "string"
          ? data.raw
          : "";

      const rating =
        typeof data.rating === "number"
          ? data.rating
          : typeof data.rating === "string"
          ? Number.parseFloat(data.rating)
          : null;

      setFeedback({
        rating: normalizeRating(rating),
        summary,
        strengths: toStringArray(data.strengths),
        improvements: toStringArray(data.improvements),
        followUpPrompt:
          typeof data.followUpPrompt === "string" ? data.followUpPrompt : "",
      });
      setPracticeDrills([]);
      if (!voiceActive) {
        await speak(summary);
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setFeedbackLoading(false);
    }
  }

  // Start a one-shot browser speech recognition capture and evaluate with GPT
  async function handleStart() {
    setTranscript("");
    setFeedback(null);
    setError(null);
    const speechWindow = window as unknown as {
      SpeechRecognition?: new () => MinimalSpeechRecognition;
      webkitSpeechRecognition?: new () => MinimalSpeechRecognition;
    };
    const SR = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.onresult = (event: MinimalSREvent) => {
        // Only evaluate once, when we have final results
        const results = event?.results || [];
        let finalText = "";
        for (let i = 0; i < results.length; i++) {
          const r = results[i] as MinimalSpeechResult;
          if (r?.isFinal) {
            finalText += ((r[0]?.transcript as string) || "") + " ";
          }
        }
        finalText = finalText.trim();
        if (finalText && finalText !== lastEvaluatedRef.current) {
          lastEvaluatedRef.current = finalText;
          setTranscript(finalText);
          void evaluateAnswer(finalText);
        }
      };
      recognition.onerror = () => {
        setVoiceActive(false);
      };
      recognition.onend = () => {
        setVoiceActive(false);
        recognitionRef.current = null;
      };
      setVoiceActive(true);
      recognitionRef.current = recognition;
      recognition.start();
      return;
    }
    // Fallback when speech recognition is not available
    setError(
      "Your browser doesn't support speech recognition. Type your answer below."
    );
  }

  // Removed manual feedback button; feedback triggers automatically after speech.

  async function handlePracticeTips() {
    setError(null);
    setTipsLoading(true);
    try {
      const topic =
        transcript.trim() ||
        (feedback?.followUpPrompt ?? "").trim() ||
        question ||
        "general interview preparation for fresh graduates";

      const data = await fetchCoach("tips", topic);
      const drillsRaw = Array.isArray(data.drills) ? data.drills : [];

      const drills = drillsRaw.map((drill, index) => {
        if (
          drill &&
          typeof drill === "object" &&
          ("title" in drill || "description" in drill || "howToPractice" in drill)
        ) {
          const entry = drill as PracticeDrill;
          return {
            title: entry.title || `Drill ${index + 1}`,
            description: entry.description || "",
            howToPractice: entry.howToPractice || "",
          };
        }
        const fallback = typeof drill === "string" ? drill : "";
        return {
          title: `Drill ${index + 1}`,
          description: fallback,
          howToPractice: "",
        };
      });

      setPracticeDrills(drills);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setTipsLoading(false);
    }
  }

  // Removed play-question button to simplify the flow.

  async function toggleVoiceSession() {
    if (voiceActive || voiceConnecting) {
      stopVoiceSession();
      return;
    }
    // Browser-based recognition + GPT TTS loop (simple conversational turn)
    setError(null);
    setVoiceConnecting(true);
    try {
      await handleStart();
      setVoiceActive(true);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setVoiceConnecting(false);
    }
  }

  function handleClose() {
    stopVoiceSession();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-semibold tracking-wide">
                AI
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Interview Coach</h2>
                <p className="text-xs text-indigo-100">
                Practice your interview skills with a GPT-powered voice coach
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white text-3xl leading-none transition-colors hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-gray-50 dark:bg-gray-800">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
              <div className="text-center">
                <div className="inline-block w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Loading AI Interview Coach...
                </p>
              </div>
            </div>
          )}

          {/* Remote audio not needed for GPT TTS; the audio element is created dynamically */}

          <div className="w-full h-full rounded-b-3xl overflow-auto p-6 flex flex-col gap-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}

            {voiceActive ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-200">
                Voice session active. Speak and we’ll transcribe then respond with GPT.
              </div>
            ) : voiceConnecting ? (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-200">
                Starting browser voice capture… Allow microphone access if prompted.
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAskQuestion}
                disabled={questionLoading || voiceConnecting}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  questionLoading
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {questionLoading ? "Generating..." : "New Interview Question"}
              </button>
              <button
                onClick={toggleVoiceSession}
                disabled={voiceConnecting}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  voiceActive
                    ? "bg-rose-500 hover:bg-rose-600"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {voiceActive ? "Stop Listening" : "Start Voice Session"}
              </button>
              <button
                onClick={handlePracticeTips}
                disabled={tipsLoading}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:border-blue-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                {tipsLoading ? "Loading drills..." : "Practice Drills"}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Launch a voice session to practice interview conversations in real time. You can still
              request drills by pasting a transcript below.
            </p>

            {question && (
              <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm dark:border-indigo-900/50 dark:bg-gray-900 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    Current interview question
                  </h3>
                  <span className="text-xs font-medium uppercase tracking-wide text-indigo-400 dark:text-indigo-500">
                    Focus
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{question}</p>
                {questionContext && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{questionContext}</p>
                )}
                {questionTips.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      How to approach
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                      {questionTips.map((tip, idx) => (
                        <li key={`tip-${idx}`} className="flex gap-2">
                          <span className="text-indigo-500 dark:text-indigo-300">-</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {followUps.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Possible follow-ups
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                      {followUps.map((item, idx) => (
                        <li key={`follow-${idx}`} className="flex gap-2">
                          <span className="text-indigo-500 dark:text-indigo-300">&gt;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
                Your answer
              </h3>
              <textarea
                value={transcript}
                onChange={(event) => {
                  setTranscript(event.target.value);
                }}
                placeholder="Paste your interview answer here or jot down key points after your voice session..."
                className="w-full min-h-[140px] p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm leading-relaxed"
              />
            </div>

            {feedback && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-700 dark:bg-emerald-900/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Coach feedback
                  </h3>
                  {feedback.rating !== null && (
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
                      Score: {feedback.rating.toFixed(1)} / 5
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-100 leading-relaxed">
                  {feedback.summary}
                </p>
                {feedback.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                      Strengths
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-100">
                      {feedback.strengths.map((item, idx) => (
                        <li key={`strength-${idx}`} className="flex gap-2">
                          <span className="text-emerald-500">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {feedback.improvements.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                      Improvement ideas
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-100">
                      {feedback.improvements.map((item, idx) => (
                        <li key={`improvement-${idx}`} className="flex gap-2">
                          <span className="text-emerald-500">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {feedback.followUpPrompt && (
                  <div className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-emerald-600 dark:bg-gray-900 dark:text-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                      Next practice prompt
                    </p>
                    <p className="mt-1">{feedback.followUpPrompt}</p>
                  </div>
                )}
              </div>
            )}

            {practiceDrills.length > 0 && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-700 dark:bg-blue-900/20 space-y-3">
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Practice drills
                </h3>
                <div className="space-y-3">
                  {practiceDrills.map((drill, idx) => (
                    <div
                      key={`drill-${idx}`}
                      className="rounded-xl border border-blue-100 bg-white p-3 text-sm dark:border-blue-700/60 dark:bg-gray-900/60"
                    >
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {drill.title || `Drill ${idx + 1}`}
                      </p>
                      {drill.description && (
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {drill.description}
                        </p>
                      )}
                      {drill.howToPractice && (
                        <>
                          <p className="mt-2 text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300">
                            How to practice
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            {drill.howToPractice}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function parseError(err: unknown) {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong. Please try again.";
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n|•|-|\u2022/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeRating(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value < 1) return 1;
    if (value > 5) return 5;
    return Math.round(value * 10) / 10;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return normalizeRating(parsed);
    }
  }
  return null;
}

function parseIceServers(raw: unknown): RTCIceServer[] {
  if (!raw || !Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === "string") {
        return { urls: entry } satisfies RTCIceServer;
      }
      if (typeof entry === "object") {
        const candidate = entry as Record<string, unknown>;
        const urlsCandidate =
          candidate.urls ??
          candidate.url ??
          candidate.uri ??
          candidate.uris ??
          null;
        if (
          typeof urlsCandidate === "string" ||
          Array.isArray(urlsCandidate)
        ) {
          const username =
            typeof candidate.username === "string" ? candidate.username : undefined;
          const credential =
            typeof candidate.credential === "string" ? candidate.credential : undefined;
          return {
            urls: urlsCandidate,
            username,
            credential,
          } satisfies RTCIceServer;
        }
      }
      return null;
    })
    .filter((server): server is RTCIceServer => Boolean(server && server.urls));
}

async function waitForIceGatheringComplete(pc: RTCPeerConnection) {
  if (pc.iceGatheringState === "complete") {
    return;
  }

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      pc.removeEventListener("icegatheringstatechange", checkState);
      resolve();
    }, 4000);

    function checkState() {
      if (pc.iceGatheringState === "complete") {
        clearTimeout(timeout);
        pc.removeEventListener("icegatheringstatechange", checkState);
        resolve();
      }
    }

    pc.addEventListener("icegatheringstatechange", checkState);
  });
}

