import { NextRequest, NextResponse } from "next/server";

// Use Node runtime here since OpenAI TTS returns a stream easily consumable in Node
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      return new NextResponse("Missing OPENAI_API_KEY", { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const text = (body?.text ?? "").toString().trim();
    const voice = (body?.voice ?? "alloy").toString();
    const model = (body?.model ?? "gpt-4o-mini-tts").toString();
    const format = (body?.format ?? "mp3").toString();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const resp = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        voice,
        input: text,
        format,
      }),
    });

    if (!resp.ok) {
      const details = await resp.text().catch(() => "");
      return NextResponse.json({ error: "TTS failed", details }, { status: 502 });
    }

    const headers = new Headers();
    headers.set("content-type", format === "wav" ? "audio/wav" : "audio/mpeg");
    headers.set("cache-control", "no-store");
    return new NextResponse(resp.body, { status: 200, headers });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
