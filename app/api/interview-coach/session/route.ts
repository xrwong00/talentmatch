import { NextRequest, NextResponse } from "next/server";

const ELEVEN_BASE_URL = "https://api.elevenlabs.io/v1/convai";

type SessionRequest = {
  conversationId?: string;
  sdpOffer?: string;
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID;

    if (!apiKey || !agentId) {
      return NextResponse.json(
        { error: "Missing ElevenLabs configuration" },
        { status: 500 }
      );
    }

    const body: SessionRequest = await req.json();
    let { conversationId } = body;
    const { sdpOffer } = body;

    if (!sdpOffer || typeof sdpOffer !== "string" || !sdpOffer.trim()) {
      return NextResponse.json(
        { error: "sdpOffer is required" },
        { status: 400 }
      );
    }

    const headers = {
      "content-type": "application/json",
      "xi-api-key": apiKey,
      "xi-agent-id": agentId,
      accept: "application/json",
    };

    // Skip pre-creating a conversation; the sessions endpoint can create one automatically.

    // Try multiple API shapes for compatibility with ElevenLabs ConvAI releases
    const attempts: { url: string; body: Record<string, unknown> }[] = [
      {
        url: `${ELEVEN_BASE_URL}/sessions`,
        body: {
          agent_id: agentId,
          ...(conversationId ? { conversation_id: conversationId } : {}),
          modalities: ["audio", "text"],
          transport: { type: "webrtc", webrtc: { sdp: sdpOffer } },
          metadata: { source: "talentmatch-ai-interview-coach" },
        },
      },
      {
        url: `${ELEVEN_BASE_URL}/agents/${encodeURIComponent(agentId)}/sessions`,
        body: {
          ...(conversationId ? { conversation_id: conversationId } : {}),
          modalities: ["audio"],
          transport: { type: "webrtc", webrtc: { sdp: sdpOffer } },
        },
      },
    ];

    if (conversationId) {
      attempts.push({
        url: `${ELEVEN_BASE_URL}/conversations/${encodeURIComponent(conversationId)}/sdp-offer`,
        body: { sdp: sdpOffer },
      });
    }

    let sessionJson: unknown = null;
    let lastErrorText = "";
    for (const attempt of attempts) {
      const resp = await fetch(attempt.url, {
        method: "POST",
        headers,
        body: JSON.stringify(attempt.body),
      });
      if (resp.ok) {
        sessionJson = await resp.json().catch(() => null);
        lastErrorText = "";
        break;
      }
      lastErrorText = await resp.text().catch(() => "");
    }

    if (!sessionJson) {
      // Fallback: explicitly create a conversation, then negotiate via a conversation endpoint
      let createdConversationId = conversationId ?? null;
      const createErrors = lastErrorText ? [lastErrorText] : ([] as string[]);

      if (!createdConversationId) {
        const createAttempts: { url: string; body: Record<string, unknown> }[] = [
          { url: `${ELEVEN_BASE_URL}/conversations`, body: { agent_id: agentId } },
          { url: `${ELEVEN_BASE_URL}/agents/${encodeURIComponent(agentId)}/conversations`, body: {} },
        ];

        for (const attempt of createAttempts) {
          const resp = await fetch(attempt.url, { method: "POST", headers, body: JSON.stringify(attempt.body) });
          if (resp.ok) {
            const json = await resp.json().catch(() => null);
            createdConversationId =
              json?.conversation?.id ||
              json?.conversation_id ||
              json?.id ||
              json?.data?.id || null;
            if (createdConversationId) break;
          }
          const t = await resp.text().catch(() => "");
          if (t) createErrors.push(t);
        }
      }

      if (!createdConversationId) {
        return NextResponse.json(
          { error: "Failed to create conversation", details: createErrors.join(" | ") },
          { status: 502 }
        );
      }

      // Now try conversation-scoped SDP endpoints
      const convOfferAttempts: { url: string; body: Record<string, unknown> }[] = [
        { url: `${ELEVEN_BASE_URL}/conversations/${encodeURIComponent(createdConversationId)}/webrtc`, body: { sdp: sdpOffer } },
        { url: `${ELEVEN_BASE_URL}/conversations/${encodeURIComponent(createdConversationId)}/sdp-offer`, body: { sdp: sdpOffer } },
      ];

      for (const attempt of convOfferAttempts) {
        const resp = await fetch(attempt.url, { method: "POST", headers, body: JSON.stringify(attempt.body) });
        if (resp.ok) {
          sessionJson = await resp.json().catch(() => null);
          conversationId = createdConversationId;
          lastErrorText = "";
          break;
        }
        lastErrorText = await resp.text().catch(() => "");
      }

      if (!sessionJson) {
        return NextResponse.json(
          { error: "Failed to negotiate session", details: lastErrorText },
          { status: 502 }
        );
      }
    }
    const sessionData =
      sessionJson?.session ||
      sessionJson?.data ||
      sessionJson;

    // If the server created a conversation implicitly, capture its id
    conversationId =
      conversationId ||
      sessionData?.conversation?.id ||
      sessionData?.conversation_id ||
      sessionJson?.conversation?.id ||
      sessionJson?.conversation_id ||
      null;

    const transport = sessionData?.transport || sessionJson?.transport;
    const webrtcInfo = transport?.webrtc || sessionData?.webrtc || sessionJson?.webrtc;

    const sdpAnswer =
      webrtcInfo?.sdp ||
      sessionData?.sdp ||
      sessionData?.sdp_answer ||
      sessionData?.answer ||
      sessionJson?.sdp ||
      sessionJson?.sdp_answer ||
      sessionJson?.answer ||
      null;

    if (!sdpAnswer || typeof sdpAnswer !== "string") {
      return NextResponse.json(
        { error: "Invalid SDP answer from ElevenLabs" },
        { status: 500 }
      );
    }

    const iceServers =
      webrtcInfo?.ice_servers ||
      webrtcInfo?.iceServers ||
      sessionJson?.ice_servers ||
      sessionJson?.iceServers ||
      sessionData?.ice_servers ||
      sessionData?.iceServers ||
      null;

    return NextResponse.json({
      conversationId: conversationId || undefined,
      sdpAnswer,
      iceServers,
    });
  } catch (error) {
    console.error("Error in interview-coach session API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
