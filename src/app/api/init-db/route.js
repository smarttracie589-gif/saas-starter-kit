import { initDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Block in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  // Simple protection
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDb();
    return NextResponse.json({ message: "Database tables initialized successfully" });
  } catch (error) {
    console.error("DB init error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
