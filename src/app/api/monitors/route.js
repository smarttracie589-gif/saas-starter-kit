import { auth } from "@/lib/auth";
import { getMonitorsByUserId, createMonitor, getMonitorCountByUserId, getUserPlan } from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const monitors = await getMonitorsByUserId(userId);
  const plan = await getUserPlan(userId);
  const maxMonitors = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return NextResponse.json({ monitors, plan, maxMonitors, currentCount: monitors.length });
}

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  if (!data.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const userId = Number(session.user.id);
  const plan = await getUserPlan(userId);
  const currentCount = await getMonitorCountByUserId(userId);
  const maxMonitors = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  if (currentCount >= maxMonitors) {
    return NextResponse.json(
      { error: `Monitor limit reached (${maxMonitors}). Upgrade your plan to add more.` },
      { status: 403 }
    );
  }

  const result = await createMonitor(userId, data);
  return NextResponse.json(
    { message: "Monitor added", id: result.lastInsertRowid },
    { status: 201 }
  );
}
