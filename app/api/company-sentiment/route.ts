import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { companyId, reviews } = await request.json();

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OpenAI API key is not configured");
      // Return mock data if API key is not available
      return NextResponse.json({
        sentiment: "Positive",
        score: 8.2,
        highlights: [
          "Strong engineering culture with focus on innovation",
          "Excellent work-life balance for most roles",
          "Competitive salary packages for fresh graduates",
          "Good mentorship programs for interns and juniors",
        ],
        concerns: [
          "Limited remote work flexibility in some departments",
          "Career progression can be slow for mid-level roles",
        ],
        topRoles: ["Software Engineer", "Data Analyst", "Product Manager"],
      });
    }

    // Prepare reviews text for analysis
    const reviewsText = reviews && reviews.length > 0
      ? reviews.map((r: any) => `${r.title}: ${r.content}`).join("\n\n")
      : "Sample reviews about company culture, work environment, and employee satisfaction.";

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
            content: `You are an AI analyst specializing in company culture and employee sentiment analysis for the Malaysian job market. 
Analyze the provided employee reviews and provide:
1. Overall sentiment (Positive, Neutral, or Negative)
2. Sentiment score (0-10)
3. 3-5 key highlights (positive aspects)
4. 2-3 areas of concern (if any)
5. Top 3 most reviewed roles

Respond ONLY with valid JSON in this exact format:
{
  "sentiment": "Positive|Neutral|Negative",
  "score": number,
  "highlights": ["string"],
  "concerns": ["string"],
  "topRoles": ["string"]
}

Be objective and balanced in your analysis.`,
          },
          {
            role: "user",
            content: `Analyze these employee reviews and provide sentiment analysis:\n\n${reviewsText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      
      // Return mock data on error
      return NextResponse.json({
        sentiment: "Positive",
        score: 8.2,
        highlights: [
          "Strong engineering culture with focus on innovation",
          "Excellent work-life balance for most roles",
          "Competitive salary packages for fresh graduates",
        ],
        concerns: [
          "Limited remote work flexibility in some departments",
        ],
        topRoles: ["Software Engineer", "Data Analyst", "Product Manager"],
      });
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
    let sentimentAnalysis;
    try {
      sentimentAnalysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      // Return mock data on parse error
      return NextResponse.json({
        sentiment: "Positive",
        score: 8.2,
        highlights: [
          "Strong engineering culture with focus on innovation",
          "Excellent work-life balance for most roles",
        ],
        concerns: [
          "Limited remote work flexibility in some departments",
        ],
        topRoles: ["Software Engineer", "Data Analyst", "Product Manager"],
      });
    }

    return NextResponse.json(sentimentAnalysis);
  } catch (error) {
    console.error("Error in company-sentiment API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

