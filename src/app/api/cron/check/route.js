import { getAllActiveMonitors, updateMonitorSnapshot, createChange } from "@/lib/db";
import { sendChangeAlert } from "@/lib/email";
import { fetchCurrentData, getMonitoredFields } from "@/lib/dataSource";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monitors = await getAllActiveMonitors();
  const results = [];

  for (const monitor of monitors) {
    try {
      const current = await fetchCurrentData(monitor);
      if (!current) {
        results.push({ id: monitor.id, status: "skip", reason: "Fetch error" });
        continue;
      }

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
            await createChange(monitor.id, field, previous[field] || "", current[field] || "");
          }
        }
      }

      if (detectedChanges.length > 0) {
        await sendChangeAlert(monitor.user_email, monitor.name, detectedChanges);
      }

      await updateMonitorSnapshot(monitor.id, current);
      results.push({
        id: monitor.id,
        name: monitor.name,
        status: "checked",
        changes: detectedChanges.length,
      });
    } catch (error) {
      results.push({ id: monitor.id, status: "error", reason: error.message });
    }
  }

  return NextResponse.json({
    message: `Checked ${results.length} monitors`,
    results,
    timestamp: new Date().toISOString(),
  });
}
