import { auth } from "@/lib/auth";
import { getMonitorById, updateMonitorSnapshot, createChange } from "@/lib/db";
import { sendChangeAlert } from "@/lib/email";
import { fetchCurrentData, getMonitoredFields } from "@/lib/dataSource";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const monitor = await getMonitorById(Number(id), Number(session.user.id));
  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  // Fetch current data from data source
  const current = await fetchCurrentData(monitor);
  if (!current) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 502 }
    );
  }

  // Compare with last snapshot
  const detectedChanges = [];
  if (monitor.last_snapshot) {
    const previous = JSON.parse(monitor.last_snapshot);
    const fields = getMonitoredFields();

    for (const field of fields) {
      if (previous[field] !== current[field]) {
        detectedChanges.push({
          field,
          old_value: previous[field] || "(empty)",
          new_value: current[field] || "(empty)",
        });
        await createChange(
          monitor.id,
          field,
          previous[field] || "",
          current[field] || ""
        );
      }
    }
  }

  // If changes found, send email alert
  if (detectedChanges.length > 0) {
    await sendChangeAlert(session.user.email, monitor.name, detectedChanges);
  }

  // Update snapshot
  await updateMonitorSnapshot(monitor.id, current);

  return NextResponse.json({
    message: detectedChanges.length > 0 ? "Changes detected!" : "No changes",
    changes: detectedChanges,
    snapshot: current,
  });
}
