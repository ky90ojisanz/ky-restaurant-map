import supabase from "../../database/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  if (req.method === "POST") {
    const body = await req.json();
    const { name, comment, genre, access, open, url, lat, lng } = body;
    // データをSupabaseに登録
    const { data, error } = await supabase
      .from("restaurants")
      .insert([{ name, comment, genre, access, open, url, lat, lng }]);

    if (error) {
      console.error("Error inserting data:", error);
      return NextResponse.json({ error: error.message });
    }
    return NextResponse.json({ message: "Insert Success" });
  } else {
    NextResponse.json({ message: "Method not allowed" });
  }
}
