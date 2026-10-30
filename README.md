# LumeFlow Creative — AI UGC Video Advertising Studio

Modern direct-to-consumer (DTC) advertising studio website built with Next.js (App Router, Turbopack), React 19, TypeScript, Supabase PostgreSQL, and Resend Daily Digest notifications.

---

## Architecture Overview

- **Frontend:** Next.js 16 + React 19 + TypeScript + Custom Design System.
- **Portfolio:** 3 integrated AI UGC concept demos (Skincare, Makeup, Pet Products) with native HTML5 video playback, poster thumbnails, and Google Drive mirrors.
- **Inbound Lead Storage:** `POST /api/contact` validates, sanitizes, and directly saves every inquiry into Supabase with `status='new'`. Individual emails are **never** fired on form submit to conserve Resend free-plan quota.
- **Quota-Conserving Daily Digest:** `GET /api/cron/digest` aggregates all new inquiries and sends a single consolidated digest email to `official.launchstack@gmail.com`. If zero inquiries were received, zero emails are sent.
- **Scheduled Job:** Runs via Vercel Cron (`vercel.json`), GitHub Actions, or Supabase `pg_cron`, protected by `CRON_SECRET`.
- **Duplicate Prevention:** Atomic `digested_at` timestamp flags prevent duplicate digest emails upon job retries.

---

## 1. Supabase Database Setup

### Step 1: Open Your Supabase Project
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard/project/gwyrtiaeyexlriuwwoyu).
2. Click **SQL Editor** in the left sidebar (`>_`).

### Step 2: Run the Database Migration
1. Copy the contents of [`supabase/schema.sql`](supabase/schema.sql).
2. Paste into the SQL Editor and click **Run**:
   - Creates the `public.leads` table with typed columns (`id`, `created_at`, `name`, `email`, `company`, `website`, `category`, `package_interest`, `project_details`, `budget`, `status`, `digested_at`).
   - Creates the `public.digest_logs` audit table.
   - Enables Row Level Security (RLS).
   - Allows public write-only insert (`anon`, `authenticated`) while **strictly preventing public reads, edits, or deletes**.
   - Grants full access to `service_role`.

---

## 2. Environment Variables Configuration

In `.env.local` (and your deployment platform's Environment Variables):

```ini
# ----------------------------------------------------------------------------
# 1. Supabase (Database for Lead Storage)
# ----------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://gwyrtiaeyexlriuwwoyu.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aeDYVWx8DaihFznHmSDlHw_3IrkRdiU

# Server-side mappings
SUPABASE_URL=https://gwyrtiaeyexlriuwwoyu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_aeDYVWx8DaihFznHmSDlHw_3IrkRdiU

# ----------------------------------------------------------------------------
# 2. Resend Email Notifications (Daily Digest)
# ----------------------------------------------------------------------------
RESEND_API_KEY=re_your_api_key_here
CONTACT_NOTIFICATION_EMAIL=official.launchstack@gmail.com
RESEND_FROM_EMAIL=LumeFlow Studio <onboarding@resend.dev>

# ----------------------------------------------------------------------------
# 3. Scheduled Job / Cron Security Secret
# ----------------------------------------------------------------------------
CRON_SECRET=lumeflow_cron_sec_8f91b72e5a40
```

---

## 3. Daily Digest & Scheduled Job Configuration

To conserve your Resend free quota (100 emails/day, 3,000/month), the system does not send an email for every visitor submission. Instead:
- Inquiries are safely logged in Supabase first.
- The scheduled cron endpoint (`/api/cron/digest`) batches all unnotified inquiries (`digested_at IS NULL`) and sends a single daily digest to `official.launchstack@gmail.com`.
- If no inquiries were received, zero emails are sent.
- If the cron job retries, the inquiries have already been marked with `digested_at = now()`, preventing duplicate emails.

### Option A: Vercel Cron (Recommended for Vercel Deployments)
The included [`vercel.json`](vercel.json) configures Vercel to invoke the digest daily:

```json
{
  "crons": [
    {
      "path": "/api/cron/digest",
      "schedule": "0 14 * * *"
    }
  ]
}
```
*Schedule:* `0 14 * * *` runs daily at 14:00 UTC (9:00 AM EST).
*Authentication:* In your Vercel Project Settings &rarr; Environment Variables, add `CRON_SECRET`. Vercel automatically includes `Authorization: Bearer <CRON_SECRET>` on every scheduled request.

### Option B: External Cron Service (cron-job.org / EasyCron)
1. URL: `https://yourdomain.com/api/cron/digest`
2. Schedule: Once daily (e.g., 9:00 AM)
3. HTTP Header: `Authorization: Bearer <your CRON_SECRET>` (or URL query parameter `?key=<your CRON_SECRET>`).

### Testing the Digest Locally
You can manually trigger and test the digest endpoint anytime using PowerShell or cURL:

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/digest" -Headers @{ Authorization = "Bearer lumeflow_cron_sec_8f91b72e5a40" }

# Bash / cURL
curl -H "Authorization: Bearer lumeflow_cron_sec_8f91b72e5a40" http://localhost:3000/api/cron/digest
```

---

## 4. How to View Inquiries in the Supabase Dashboard

By design, no public admin dashboard is exposed on the website to safeguard lead confidentiality.

To view, filter, and manage inbound leads securely:
1. Log in to [supabase.com](https://supabase.com) and open your project (`gwyrtiaeyexlriuwwoyu`).
2. Click **Table Editor** in the left navigation.
3. Select the **`leads`** table to view all submitted inquiries:
   - `created_at` timestamp
   - `name`, `email`, `company`, `website`
   - `category` (Skincare, Cosmetics, Pet Products, etc.)
   - `package_interest` & `budget`
   - `project_details`
   - `status` (default: `new`)
   - `digested_at` (shows when included in the daily digest to `official.launchstack@gmail.com`)
4. You can edit the `status` column directly (e.g. from `new` to `contacted`, `in_review`, `proposal_sent`, or `closed`).
5. Export inquiries to CSV anytime using the **Export** button in the top right.

---

## 5. Local Development Commands

```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Run production build & type check
npm run build
```
