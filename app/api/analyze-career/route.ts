import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== "string" || input.trim().length < 50) {
      return NextResponse.json(
        { error: "Please provide a detailed description (at least 50 characters)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OpenAI API key is not configured");
      return NextResponse.json(
        { error: "AI service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a career counselor AI specialized in helping fresh graduates and early-career professionals in Malaysia. Analyze the user's input about their education, skills, and experience, and provide:
1. A suitable current/starting role title
2. 3-5 key strengths based on their description
3. A career progression path with 4-5 stages spanning 5-7 years
4. 3-5 actionable recommendations

For each career path stage, include:
- Job title
- Years of experience range (e.g., "0-2 years", "2-4 years")
- Description of responsibilities
- 4-6 key skills to develop
- Salary range in Malaysian Ringgit (RM)

Respond ONLY with valid JSON in this exact format:
{
  "currentRole": "string",
  "strengths": ["string"],
  "careerPaths": [
    {
      "title": "string",
      "yearsExperience": "string",
      "description": "string",
      "keySkills": ["string"],
      "salaryRange": "string"
    }
  ],
  "recommendations": ["string"]
}

Be realistic about Malaysian job market conditions and salary ranges. Focus on practical, achievable career progression.`,
          },
          {
            role: "user",
            content: input,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to analyze career path. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI service" },
        { status: 500 }
      );
    }

    // Parse the AI response
    let careerAnalysis;
    try {
      careerAnalysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      return NextResponse.json(
        { error: "Failed to parse career analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json(careerAnalysis);
  } catch (error) {
    console.error("Error in analyze-career API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

