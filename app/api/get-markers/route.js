import { NextResponse } from "next/server";
import db from "../../database/db";

export async function GET() {
  try {
    const rows = db.prepare("SELECT name, lat, lng FROM selected_shops").all();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching data from SQLite:", error);
    return NextResponse.json(
      { error: "Error fetching data from SQLite" },
      { status: 500 }
    );
  }
}
