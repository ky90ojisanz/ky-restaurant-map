import { NextResponse } from "next/server";
import OpenAI from "openai";
import { load } from "cheerio";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function POST(request) {
  try {
    const { content, author } = await request.json();
    // ここでメッセージの解析を行います
    const analysis = {
      messageLength: content.length,
      name: await extractRestaurantNames(content),
    };

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Error analyzing message:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function extractRestaurantNames(content) {
  // ここでレストラン名を抽出する処理を実装します
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `I will extract and return words from the given text that are presumed to be the names of restaurants. If unsure, I will search the web and respond with the formal name of the restaurant that seems the closest match. If no words are presumed to be restaurant names, I will respond with "Nothing" only.`,
      },
      {
        role: "user",
        content: content,
      },
    ],
    model: "gpt-4o",
  });
  return chatCompletion.choices[0].message.content;
}
