import { NextRequest, NextResponse } from "next/server";

type CoachAction = "question" | "feedback" | "tips";

export async function POST(req: NextRequest) {
  try {
    const { action, message } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    if (!action || !["question", "feedback", "tips"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const prompt = buildPrompt(action as CoachAction, typeof message === "string" ? message : "");

    // Primary attempt: Responses API
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: prompt,
        max_output_tokens: 250,
        temperature: 0.5,
      }),
    });

    let text = "";
    if (!response.ok) {
      // Fallback to Chat Completions if Responses API is unavailable
      const cc = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a concise interview coach that returns strict JSON as instructed." },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
          max_tokens: 300,
        }),
      });
      if (!cc.ok) {
        const details = await cc.text().catch(() => "");
        return NextResponse.json({ error: "OpenAI request failed", details }, { status: 502 });
      }
      const ccData = await cc.json();
      text = ccData?.choices?.[0]?.message?.content || "";
    } else {
      const data = await response.json();
      text = extractOutputText(data) || "";
    }

    let payload: Record<string, unknown> = { raw: text };
    try {
      const parsed = JSON.parse(text);
      if (action === "question") {
        payload = {
          question: parsed?.question ?? "",
          context: parsed?.context ?? "",
          tips: parsed?.tips ?? [],
          followUps: parsed?.followUps ?? [],
        };
      } else if (action === "feedback") {
        payload = {
          rating: parsed?.rating ?? null,
          summary: parsed?.summary ?? text,
          strengths: parsed?.strengths ?? [],
          improvements: parsed?.improvements ?? [],
          followUpPrompt: parsed?.followUpPrompt ?? "",
        };
      } else if (action === "tips") {
        payload = { drills: parsed?.drills ?? [] };
      }
    } catch {
      // If the model returned plain text, keep it in raw
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function buildPrompt(action: CoachAction, content: string): string {
  switch (action) {
    case "question":
      return `You are an AI interview coach helping fresh graduates in Malaysia.
Ask exactly one behavioural or situational question suitable for entry level.
Reply as strict JSON: {"question":"string","context":"string","tips":["tip1","tip2"],"followUps":["q1","q2"]}.
Keep each field under 35 words.`;
    case "feedback":
      return `You are an interview coach.
Candidate answer: """${content}""".
Return strict JSON: {"rating":number(1-5),"summary":"string","strengths":["..."],"improvements":["..."],"followUpPrompt":"string"}.
No extra text.`;
    case "tips":
      return `Suggest three short practice drills for this concern: "${content || "general interview anxiety"}".
Return strict JSON: {"drills":[{"title":"string","description":"string","howToPractice":"string"}]}.`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractOutputText(data: any): string | null {
  return (
    data?.output_text ||
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.output?.[0]?.content?.[0]?.text ||
    null
  );
}
