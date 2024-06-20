// app/api/hotpepper/route.js
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  const apiKey = process.env.NEXT_PUBLIC_HOTPEPPER_API_KEY;
  const apiUrl = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&keyword=${query}&format=json&count=5`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    console.log(NextResponse.json(data.results.shop));

    return NextResponse.json(data.results.shop);
  } catch (error) {
    console.error("Error fetching data from HotPepper API:", error);
    return NextResponse.json(
      { error: "Error fetching data from HotPepper API" },
      { status: 500 }
    );
  }
}
