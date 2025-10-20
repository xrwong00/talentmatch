import { NextRequest, NextResponse } from "next/server";

type CoachAction = "question" | "feedback" | "tips";

type ActionRequestBody = {
  action?: CoachAction;
  message?: string;
  conversationId?: string;
};

const ELEVEN_BASE_URL = "https://api.elevenlabs.io/v1/convai";

export async function POST(req: NextRequest) {
  try {
    const body: ActionRequestBody = await req.json();
    const action = body.action;

    if (!action) {
      return NextResponse.json(
        { error: "action is required" },
        { status: 400 }
      );
    }

    if (!["question", "feedback", "tips"].includes(action)) {
      return NextResponse.json(
        { error: "Unsupported action" },
        { status: 400 }
      );
    }

    if (action !== "question" && !body.message) {
      return NextResponse.json(
        { error: "message is required for this action" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID;

    if (!apiKey || !agentId) {
      return NextResponse.json(
        { error: "Missing ElevenLabs configuration" },
        { status: 500 }
      );
    }

    const headers = {
      "content-type": "application/json",
      "xi-api-key": apiKey,
      "xi-agent-id": agentId,
      accept: "application/json",
    };

    let conversationId = body.conversationId;

    if (!conversationId) {
      const createResp = await fetch(`${ELEVEN_BASE_URL}/conversations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      if (!createResp.ok) {
        const text = await createResp.text().catch(() => "");
        console.error("ElevenLabs conversation create error:", text);
        return NextResponse.json(
          { error: "Failed to create conversation", details: text },
          { status: 502 }
        );
      }

      const createJson = await createResp.json().catch(() => null);
      conversationId =
        createJson?.conversation?.id ||
        createJson?.conversation_id ||
        createJson?.id ||
        createJson?.data?.id;

      if (!conversationId) {
        return NextResponse.json(
          { error: "Conversation ID missing from ElevenLabs response" },
          { status: 500 }
        );
      }
    }

    const prompt = buildPrompt(action, body.message);

    const response = await fetch(
      `${ELEVEN_BASE_URL}/conversations/${conversationId}/responses`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          agent_id: agentId,
          modalities: ["text"],
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return NextResponse.json(
        { error: "ElevenLabs request failed", details: text },
        { status: 502 }
      );
    }

    const data = await response.json().catch(() => null);
    const rawText = extractTextResponse(data) ?? "";

    const payload = buildPayloadFromAction(action, rawText);

    return NextResponse.json({
      conversationId,
      raw: rawText,
      ...payload,
    });
  } catch (error) {
    console.error("Error in interview-coach API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildPrompt(action: CoachAction, content?: string): string {
  switch (action) {
    case "question":
      return `You are an AI interview coach helping fresh graduates secure their first roles in Malaysia. Ask exactly one behavioural or situational interview question suitable for an entry-level job. Provide your answer strictly in JSON with the structure: {"question":"string","context":"string","tips":["tip1","tip2"],"followUps":["follow up question 1","follow up question 2"]}. Keep strings concise (max 35 words) and avoid markdown or additional commentary.`;
    case "feedback":
      return `You are reviewing a fresh graduate's spoken interview response. Candidate answer: """${content ?? ""}""". Provide targeted feedback strictly as JSON with structure: {"rating":number (1-5),"summary":"string","strengths":["..."],"improvements":["..."],"followUpPrompt":"string coaching prompt for their next practice"}. Keep strengths and improvements to max 3 bullet points each. Avoid markdown, emojis, or extra text.`;
    case "tips":
      return `Offer three practical interview preparation drills for a fresh graduate based on this skill gap or concern: "${content ?? "general interview anxiety"}". Reply strictly as JSON with structure: {"drills":[{"title":"string","description":"string","howToPractice":"string"}]}. Keep descriptions under 35 words. Do not include extra narration.`;
    default:
      return content ?? "";
  }
}

function extractTextResponse(payload: unknown): string | null {
  if (!payload) return null;

  if (typeof payload === "string") {
    return payload;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = payload as Record<string, any>;

  if (typeof data?.text === "string") return data.text;
  if (typeof data?.response === "string") return data.response;
  if (typeof data?.response?.text === "string") return data.response.text;
  if (typeof data?.response?.output_text === "string")
    return data.response.output_text;

  const outputs =
    data?.response?.outputs ||
    data?.response?.messages ||
    data?.outputs ||
    data?.messages;

  if (Array.isArray(outputs)) {
    for (const output of outputs) {
      if (typeof output === "string") return output;
      if (typeof output?.text === "string") return output.text;
      if (typeof output?.output_text === "string") return output.output_text;
      if (Array.isArray(output?.content)) {
        for (const piece of output.content) {
          if (typeof piece === "string") return piece;
          if (typeof piece?.text === "string") return piece.text;
        }
      }
    }
  }

  return null;
}

function buildPayloadFromAction(action: CoachAction, rawText: string | null) {
  if (!rawText) {
    return {};
  }

  const parsed = safeJsonParse(rawText);

  switch (action) {
    case "question":
      return normalizeQuestionPayload(parsed, rawText);
    case "feedback":
      return normalizeFeedbackPayload(parsed, rawText);
    case "tips":
      return normalizeTipsPayload(parsed, rawText);
    default:
      return {};
  }
}

function safeJsonParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeQuestionPayload(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "question" in data &&
    typeof (data as { question: unknown }).question === "string"
  ) {
    const obj = data as {
      question: string;
      context?: string;
      tips?: unknown;
      followUps?: unknown;
    };
    return {
      question: obj.question,
      context: obj.context ?? "",
      tips: normalizeStringArray(obj.tips),
      followUps: normalizeStringArray(obj.followUps),
    };
  }

  return {
    question: fallback,
    context: "",
    tips: [],
    followUps: [],
  };
}

function normalizeFeedbackPayload(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "summary" in data &&
    typeof (data as { summary: unknown }).summary === "string"
  ) {
    const obj = data as {
      rating?: number;
      summary: string;
      strengths?: unknown;
      improvements?: unknown;
      followUpPrompt?: string;
    };

    return {
      rating: normalizeRating(obj.rating),
      summary: obj.summary,
      strengths: normalizeStringArray(obj.strengths),
      improvements: normalizeStringArray(obj.improvements),
      followUpPrompt: obj.followUpPrompt ?? "",
    };
  }

  return {
    rating: null,
    summary: fallback,
    strengths: [],
    improvements: [],
    followUpPrompt: "",
  };
}

function normalizeTipsPayload(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "drills" in data &&
    Array.isArray((data as { drills: unknown }).drills)
  ) {
    const obj = data as {
      drills: Array<{
        title?: string;
        description?: string;
        howToPractice?: string;
      }>;
    };

    return {
      drills: obj.drills.map((drill) => ({
        title: drill.title ?? "Practice suggestion",
        description: drill.description ?? "",
        howToPractice: drill.howToPractice ?? "",
      })),
    };
  }

  return {
    drills: fallback
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text, index) => ({
        title: `Drill ${index + 1}`,
        description: text,
        howToPractice: "",
      })),
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
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
