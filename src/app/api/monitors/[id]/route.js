import { auth } from "@/lib/auth";
import { getMonitorById, deleteMonitor, getChangesByMonitorId, getUserPlan } from "@/lib/db";
import { PLAN_HISTORY } from "@/lib/config";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = Number(session.user.id);
  const monitor = await getMonitorById(Number(id), userId);
  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const plan = await getUserPlan(userId);
  const dayLimit = PLAN_HISTORY[plan] || PLAN_HISTORY.free;
  const changes = await getChangesByMonitorId(monitor.id, dayLimit);

  return NextResponse.json({ monitor, changes, plan });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteMonitor(Number(id), Number(session.user.id));
  return NextResponse.json({ message: "Monitor deleted" });
}
