/**
 * Simple in-memory rate limiter for serverless environments.
 */

const rateMap = new Map();

export function rateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now - entry.start > windowMs) {
    rateMap.set(key, { start: now, count: 1 });
    return { success: true };
  }

  entry.count++;
  if (entry.count > maxAttempts) {
    return { success: false };
  }

  return { success: true };
}
