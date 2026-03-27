/**
 * ============================================
 * Data Source — Website Uptime Monitor (Example)
 * ============================================
 * This file fetches current data for a monitor item.
 *
 * TO CUSTOMIZE: Replace fetchCurrentData() with your own
 * data fetching logic. The function should return an object
 * with key-value pairs representing the current state.
 * The cron job will compare this with the last snapshot
 * and alert on any changes.
 *
 * EXAMPLES of what you could monitor:
 * - Website uptime & response time (current implementation)
 * - Domain/SSL certificate expiry dates
 * - API endpoint health checks
 * - Price changes on competitor websites
 * - Social media follower counts
 * - Stock/inventory levels
 * - Any data accessible via HTTP
 */

/**
 * Fetches current data for a monitored item.
 * @param {Object} monitor - The monitor object from database
 * @param {string} monitor.name - Name of the monitor
 * @param {string} monitor.url - URL to monitor
 * @returns {Object|null} Current state snapshot, or null on error
 */
export async function fetchCurrentData(monitor) {
  if (!monitor.url) {
    console.error("Monitor has no URL:", monitor.name);
    return null;
  }

  try {
    const startTime = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(monitor.url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "SaaS-Monitor/1.0",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);
    const responseTime = Date.now() - startTime;

    // Try to extract page title from HTML
    let title = "";
    try {
      const text = await response.text();
      const match = text.match(/<title[^>]*>(.*?)<\/title>/i);
      title = match ? match[1].trim() : "";
    } catch {
      // Ignore text parsing errors
    }

    return {
      status: response.ok ? "UP" : "DOWN",
      statusCode: String(response.status),
      responseTime: `${responseTime}ms`,
      title: title || "(no title)",
    };
  } catch (error) {
    // Connection failures, timeouts, DNS errors
    return {
      status: "DOWN",
      statusCode: "0",
      responseTime: "timeout",
      title: error.message || "Connection failed",
    };
  }
}

/**
 * Returns the list of fields to compare between snapshots.
 * Only changes in these fields will trigger alerts.
 */
export function getMonitoredFields() {
  return ["status", "statusCode", "responseTime", "title"];
}
