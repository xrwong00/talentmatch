"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Suggestion = {
  focusArea: string;
  action: string;
  resourceName: string;
  resourceDescription?: string;
  resourceUrl?: string;
};

type Insights = {
  careerPaths: { title: string; confidence?: number; reasons?: string[] }[];
  careerMap: { title: string; timeframe?: string; description?: string }[];
  suggestions?: Suggestion[];
};

export default function Dashboard() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const raw = sessionStorage.getItem("tm_ai_insights");
      if (raw) {
        const parsed = JSON.parse(raw) as Insights;
        if (Array.isArray((parsed as { suggestions?: unknown }).suggestions)) {
          parsed.suggestions = ((parsed as { suggestions?: unknown }).suggestions as unknown[]).map(
            (item, index) => {
              if (typeof item === "string") {
                return {
                  focusArea: `Development focus ${index + 1}`,
                  action: item,
                  resourceName: "LinkedIn Learning",
                };
              }
              const entry = item as Partial<Suggestion>;
              return {
                focusArea:
                  entry?.focusArea && entry.focusArea.trim()
                    ? entry.focusArea
                    : `Development focus ${index + 1}`,
                action:
                  entry?.action && entry.action.trim()
                    ? entry.action
                    : "Deepen capability through focused practice.",
                resourceName:
                  entry?.resourceName && entry.resourceName.trim()
                    ? entry.resourceName
                    : "LinkedIn Learning",
                resourceDescription: entry?.resourceDescription,
                resourceUrl: entry?.resourceUrl,
              };
            }
          );
        }
        setInsights(parsed);
      }
    } catch {}
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🧠</div>
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/talentmatch-logo.svg" alt="TalentMatch" width={32} height={32} />
            <span className="text-lg font-semibold">TalentMatch</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Your 5-Year Career Map</h1>
          <p className="text-black/70 dark:text-white/70">AI-predicted path from Day-1 to leadership</p>
        </div>

        {!insights ? (
          <div className="p-12 rounded-2xl border border-black/10 dark:border-white/15 bg-gradient-to-br from-emerald-50/50 to-blue-50/30 dark:from-emerald-950/20 dark:to-blue-950/10 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <div className="text-2xl font-bold mb-3">Ready to see your career path?</div>
            <p className="text-base text-black/70 dark:text-white/70 mb-8 max-w-md mx-auto">Take 3 minutes to share your skills and aspirations. AI will map your complete 5-year journey.</p>
            <Link href="/" className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-sm font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all">Map My Career Now</Link>
          </div>
        ) : (
          <>
            {/* Suggested Career Paths */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-blue-50/30 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl">🎯</div>
                <div className="flex-1">
                  <div className="text-lg font-bold mb-3">Your Best-Fit Career Paths</div>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {insights.careerPaths?.map((p) => (
                      <div key={p.title} className="p-3 rounded-xl border border-black/10 dark:border-white/15 bg-background flex items-center justify-between">
                        <div className="font-semibold">{p.title}</div>
                        {typeof p.confidence === "number" && (
                          <div className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">
                            {(p.confidence * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-base font-bold mb-3 mt-6">Your 5-Year Progression</div>
                  <ol className="relative border-l border-emerald-300 dark:border-emerald-800 ml-2">
                    {insights.careerMap?.map((s, idx) => (
                      <li key={idx} className="ml-4 py-3">
                        <div className="absolute -left-[6px] w-3 h-3 rounded-full bg-emerald-600"></div>
                        <div className="font-semibold">{s.title}</div>
                        <div className="text-xs text-black/60 dark:text-white/60">{s.timeframe || ""}</div>
                        {s.description && <div className="text-sm mt-1 opacity-90">{s.description}</div>}
                      </li>
                    ))}
                  </ol>

                  {insights.suggestions && insights.suggestions.length > 0 && (
                    <div className="mt-6">
                      <div className="text-base font-bold mb-3">Next Steps to Get There</div>
                      <ul className="list-disc pl-5 text-sm opacity-90 space-y-1">
                        {insights.suggestions.map((s, i) => (
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
