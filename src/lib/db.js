import { neon } from "@neondatabase/serverless";

function getClient() {
  return neon(process.env.DATABASE_URL);
}

// --- Init tables ---

export async function initDb() {
  const sql = getClient();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      plan TEXT DEFAULT 'free',
      creem_customer_id TEXT,
      creem_subscription_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE users ADD COLUMN IF NOT EXISTS creem_customer_id TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS creem_subscription_id TEXT;
    EXCEPTION WHEN others THEN NULL;
    END $$
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS monitors (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      url TEXT,
      status TEXT DEFAULT 'active',
      last_snapshot TEXT,
      last_checked_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS changes (
      id SERIAL PRIMARY KEY,
      monitor_id INTEGER NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
      field TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

// --- User helpers ---

export async function createUser(email, hashedPassword, name) {
  const sql = getClient();
  const result = await sql`
    INSERT INTO users (email, password, name) VALUES (${email}, ${hashedPassword}, ${name})
    RETURNING id
  `;
  return { lastInsertRowid: result[0]?.id };
}

export async function getUserByEmail(email) {
  const sql = getClient();
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  return rows[0] || null;
}

export async function getUserById(id) {
  const sql = getClient();
  const rows = await sql`SELECT id, email, name, plan, created_at FROM users WHERE id = ${id}`;
  return rows[0] || null;
}

export async function getUserPlan(userId) {
  const sql = getClient();
  const rows = await sql`SELECT plan FROM users WHERE id = ${userId}`;
  return rows[0]?.plan || 'free';
}

export async function getMonitorCountByUserId(userId) {
  const sql = getClient();
  const rows = await sql`SELECT COUNT(*) as count FROM monitors WHERE user_id = ${userId}`;
  return Number(rows[0]?.count || 0);
}

// --- Plan management helpers ---

export async function updateUserPlan(userId, plan) {
  const sql = getClient();
  return await sql`UPDATE users SET plan = ${plan} WHERE id = ${userId}`;
}

export async function updateUserPlanByEmail(email, plan, creemCustomerId, creemSubscriptionId) {
  const sql = getClient();
  return await sql`
    UPDATE users SET
      plan = ${plan},
      creem_customer_id = ${creemCustomerId || null},
      creem_subscription_id = ${creemSubscriptionId || null}
    WHERE email = ${email}
  `;
}

export async function getUserByCreemCustomerId(creemCustomerId) {
  const sql = getClient();
  const rows = await sql`SELECT * FROM users WHERE creem_customer_id = ${creemCustomerId}`;
  return rows[0] || null;
}

export async function downgradeUserByCreemSubscriptionId(subscriptionId) {
  const sql = getClient();
  return await sql`
    UPDATE users SET plan = 'free', creem_subscription_id = NULL
    WHERE creem_subscription_id = ${subscriptionId}
  `;
}

// --- Monitor helpers ---

export async function getMonitorsByUserId(userId) {
  const sql = getClient();
  return await sql`SELECT * FROM monitors WHERE user_id = ${userId} ORDER BY created_at DESC`;
}

export async function getMonitorById(id, userId) {
  const sql = getClient();
  const rows = await sql`SELECT * FROM monitors WHERE id = ${id} AND user_id = ${userId}`;
  return rows[0] || null;
}

export async function createMonitor(userId, data) {
  const sql = getClient();
  const result = await sql`
    INSERT INTO monitors (user_id, name, url)
    VALUES (${userId}, ${data.name}, ${data.url || null})
    RETURNING id
  `;
  return { lastInsertRowid: result[0]?.id };
}

export async function deleteMonitor(id, userId) {
  const sql = getClient();
  return await sql`DELETE FROM monitors WHERE id = ${id} AND user_id = ${userId}`;
}

export async function updateMonitorSnapshot(id, snapshot) {
  const sql = getClient();
  return await sql`
    UPDATE monitors SET last_snapshot = ${JSON.stringify(snapshot)}, last_checked_at = NOW() WHERE id = ${id}
  `;
}

// --- Change helpers ---

export async function getChangesByMonitorId(monitorId, dayLimit = null) {
  const sql = getClient();
  if (dayLimit) {
    return await sql`
      SELECT * FROM changes WHERE monitor_id = ${monitorId}
      AND detected_at >= NOW() - INTERVAL '1 day' * ${dayLimit}
      ORDER BY detected_at DESC LIMIT 50
    `;
  }
  return await sql`
    SELECT * FROM changes WHERE monitor_id = ${monitorId} ORDER BY detected_at DESC LIMIT 50
  `;
}

export async function createChange(monitorId, field, oldValue, newValue) {
  const sql = getClient();
  return await sql`
    INSERT INTO changes (monitor_id, field, old_value, new_value) VALUES (${monitorId}, ${field}, ${oldValue}, ${newValue})
  `;
}

// --- Waitlist helpers ---

export async function addToWaitlist(email) {
  const sql = getClient();
  const result = await sql`
    INSERT INTO waitlist (email) VALUES (${email})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  return result[0] || null;
}

export async function getWaitlistCount() {
  const sql = getClient();
  const rows = await sql`SELECT COUNT(*) as count FROM waitlist`;
  return rows[0]?.count || 0;
}

// --- Cron helpers ---

export async function getAllActiveMonitors() {
  const sql = getClient();
  return await sql`
    SELECT m.*, u.email as user_email
    FROM monitors m
    JOIN users u ON m.user_id = u.id
    WHERE m.status = 'active'
  `;
}
