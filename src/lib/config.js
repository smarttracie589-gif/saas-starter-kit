/**
 * ============================================
 * SaaS Starter Kit — Central Configuration
 * ============================================
 * Change these values to customize your SaaS product.
 * This is the ONLY file you need to edit to rebrand.
 */

export const SITE_CONFIG = {
  // --- Branding ---
  name: "SaaS Starter",
  tagline: "Ship your SaaS in days, not months",
  description: "A production-ready SaaS boilerplate with auth, payments, database, cron jobs, and email alerts — built with Next.js.",
  contactEmail: "hello@example.com",

  // --- URLs ---
  // Update this to your production domain
  siteUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",

  // --- Plan Limits ---
  plans: {
    free: {
      name: "Free",
      price: "0",
      maxMonitors: 1,
      historyDays: 7,
      description: "Perfect for trying things out",
      features: [
        "1 monitor",
        "Automated checks",
        "Email alerts",
        "7-day history",
      ],
    },
    pro: {
      name: "Pro",
      price: "9.99",
      originalPrice: "19.99",
      maxMonitors: 10,
      historyDays: null, // unlimited
      description: "For serious users — launch price",
      features: [
        "Up to 10 monitors",
        "Automated checks",
        "Instant email alerts",
        "Unlimited history",
        "Priority support",
      ],
    },
  },

  // --- Monitoring ---
  monitor: {
    // Fields to track for changes
    fields: ["status", "statusCode", "responseTime", "title"],
    // How often cron runs (display only — actual schedule in vercel.json)
    checkInterval: "Every 6 hours",
  },
};

// Plan limits helper
export const PLAN_LIMITS = {
  free: SITE_CONFIG.plans.free.maxMonitors,
  pro: SITE_CONFIG.plans.pro.maxMonitors,
};

export const PLAN_HISTORY = {
  free: SITE_CONFIG.plans.free.historyDays,
  pro: SITE_CONFIG.plans.pro.historyDays,
};
