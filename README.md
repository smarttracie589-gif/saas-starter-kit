# SaaS Starter Kit

A production-ready Next.js boilerplate with all the necessary infrastructure wired up. Focus on building your core product, not reinventing the wheel.

## What's Included

- **Authentication:** NextAuth.js (Email/Password credentials)
- **Database:** Neon Serverless PostgreSQL with pre-configured schemas
- **Payments:** Creem integration (Checkout, Webhooks, Subscription management)
- **Background Jobs:** Vercel Cron
- **Email:** Resend integration with HTML templates
- **Security:** Rate limiting, Waitlist

## Quick Start

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

3. **Initialize Database**
   Start the dev server and hit the init endpoint (you only need to do this once):
   ```bash
   npm run dev
   # Then visit: http://localhost:3000/api/init-db
   ```

## Customization

### 1. Rebranding & Pricing
Open `src/lib/config.js` to change the product name, branding, pricing, and plan limits. This is the central configuration file for the entire app.

### 2. Business Logic
This starter kit comes with an example "Website Uptime Monitor" to demonstrate how cron jobs, database, and emails work together.

To build your own product, modify `src/lib/dataSource.js`. The current example uses an HTTP ping, but you can change this to fetch data from any API, scrape a website, or perform any backend operation.

### 3. Database Schema
Check `src/lib/db.js` to modify the database schema. The `monitors` and `changes` tables are specific to the uptime monitor example and should be tailored to your use case. The `users` and `waitlist` tables handle the core SaaS infrastructure.

## Deployment

This project is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add your environment variables in the Vercel dashboard.
4. Deploy! Vercel will automatically configure the cron jobs based on `vercel.json`.
