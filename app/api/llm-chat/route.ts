import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const url = "https://api.deepseek.com/v1/chat/completions";

  const body = {
    model: "deepseek-chat",
    messages,
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false
  };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const error = await resp.json();
      return NextResponse.json(error, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from DeepSeek API" },
      { status: 500 }
    );
  }
} 