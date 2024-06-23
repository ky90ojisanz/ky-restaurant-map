import supabase from "../../database/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  if (req.method === "GET") {
    try {
      // Supabaseからデータを取得
      const { data, error } = await supabase
        .from("restaurants") // ここでテーブル名を指定
        .select("*"); // すべてのカラムを選択

      if (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: error.message });
      }
      // データをクライアントに返す
      console.log(data);
      return NextResponse.json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Unexpected error occurred" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
