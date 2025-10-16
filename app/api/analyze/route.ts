import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    // Using OpenAI Responses API with JSON schema to ensure structured output
    const schema = {
      name: "CareerInsights",
      schema: {
        type: "object",
        properties: {
          careerPaths: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                confidence: { type: "number" },
                reasons: { type: "array", items: { type: "string" } },
              },
              required: ["title"],
              additionalProperties: false,
            },
          },
          careerMap: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                timeframe: { type: "string" },
                description: { type: "string" },
              },
              required: ["title"],
              additionalProperties: false,
            },
          },
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                focusArea: { type: "string" },
                action: { type: "string" },
                resourceName: { type: "string" },
                resourceDescription: { type: "string" },
                resourceUrl: { type: "string" },
              },
              required: ["focusArea", "action", "resourceName"],
              additionalProperties: false,
            },
          },
        },
        required: ["careerPaths", "careerMap"],
        additionalProperties: false,
      },
      strict: true,
    } as const;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        // Provide a single input string with clear instructions. The Responses API
        // will validate and return JSON according to the provided schema.
        input:
          `You are a career guidance AI for Malaysian fresh graduates. Carefully analyse the candidate's reflection and align every recommendation with what they share. Do not default to tech roles unless the reflection indicates it. Reference the Malaysian job market and explain why each career path and step fits the reflection. Provide a 5-year career roadmap with at least 3 steps (Year 0-1, Year 2-3, Year 4-5). Provide skill-building suggestions that each include a relevant platform, academy, or programme available to Malaysian learners (local or reputable online).\n\nReflection: ${input}\n\nReturn ONLY JSON that strictly matches the provided schema.`,
        text: { format: { type: "json_schema", name: schema.name, json_schema: schema } },
        max_output_tokens: 1200,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      return new Response(JSON.stringify({ error: "OpenAI request failed", details }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    type Parsed = {
      careerPaths: { title: string; confidence?: number; reasons?: string[] }[];
      careerMap: { title: string; timeframe?: string; description?: string }[];
      suggestions?: {
        focusArea: string;
        action: string;
        resourceName: string;
        resourceDescription?: string;
        resourceUrl?: string;
      }[];
    };

    type OpenAIResponse = {
      output_parsed?: Parsed;
      parsed?: Parsed;
      output?: { content?: { json?: Parsed }[] }[];
      output_text?: string;
      choices?: { message?: { content?: string }; text?: string }[];
    };

    const data: OpenAIResponse = await response.json();

    // Responses API with json_schema returns output_parsed when successful
    let parsed: Parsed | undefined =
      data.output_parsed || data.parsed || data.output?.[0]?.content?.[0]?.json;

    if (!parsed) {
      const text = data.output_text || data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "";
      try {
        const attempt = JSON.parse(text);
        return new Response(JSON.stringify(attempt), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ error: "Invalid model response" }), {
          status: 502,
          headers: { "content-type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to analyze" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
