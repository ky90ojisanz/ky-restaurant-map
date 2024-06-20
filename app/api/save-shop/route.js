import { NextResponse } from "next/server";
import db from "../../database/db";

export async function POST(request) {
  const { name, lat, lng } = await request.json();

  try {
    const insert = db.prepare(
      "INSERT INTO selected_shops (name, lat, lng) VALUES (?, ?, ?)"
    );
    insert.run(name, lat, lng);

    return NextResponse.json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving data to SQLite:", error);
    return NextResponse.json(
      { error: "Error saving data to SQLite" },
      { status: 500 }
    );
  }
}
