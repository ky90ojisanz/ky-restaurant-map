import supabase from "../../database/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (req.method === "GET") {
    try {
      // URLからnameパラメータを取得
      const { searchParams } = new URL(req.url);
      const name = searchParams.get("name");

      // Supabaseクエリを作成
      let query = supabase.from("restaurants").select("*");

      // nameパラメータが指定されている場合、where句を追加
      if (name) {
        query = query.eq("name", name);
      }

      // クエリを実行
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // データをクライアントに返す
      return NextResponse.json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Unexpected error occurred" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
