import { NextRequest, NextResponse } from "next/server";

const CHATBOT_URL = process.env.CHATBOT_URL || "https://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${CHATBOT_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { response: `Server error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat proxy error:", error);
    return NextResponse.json(
      { response: "Sorry, I'm having trouble connecting to the chatbot service. Please make sure it's running." },
      { status: 503 }
    );
  }
}
