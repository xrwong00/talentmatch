import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return new NextResponse('Missing ELEVENLABS_API_KEY', { status: 500 });
    }

    const body = await req.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const voiceId = typeof body?.voiceId === 'string' && body.voiceId ? body.voiceId : 'Rachel';
    const modelId = typeof body?.modelId === 'string' && body.modelId ? body.modelId : 'eleven_multilingual_v2';

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: 'POST',
        headers: {
          'accept': 'audio/mpeg',
          'content-type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      return NextResponse.json({ error: 'TTS failed', details: errorText }, { status: 500 });
    }

    const headers = new Headers();
    headers.set('content-type', 'audio/mpeg');
    headers.set('cache-control', 'no-store');

    return new NextResponse(resp.body, { status: 200, headers });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}


