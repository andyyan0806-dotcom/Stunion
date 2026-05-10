# Stunion

A web MVP for the Stunion tutor marketplace, built from the PRD.

## What’s included

- Tutor discovery with filters and subject-driven search
- Tutor profile pages with verified-badge placeholders
- Tutor onboarding flow for transcript, score, and demo submission
- Booking request workflow and admin dashboard stubs
- Supabase client setup and server-side booking/tutor data integration

## Tech stack

- Next.js 14
- React + TypeScript
- Supabase (server-side API routes)

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env values from Supabase to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Supabase setup

1. Create a new Supabase project.
2. Open the SQL editor and run `supabase/schema.sql` from this repo.
3. Add at least one `tutor` row to the `tutors` table with `status = 'verified'`.
4. Ensure the `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` values are set in `.env.local`.

## Available routes

- `/` — home
- `/tutors` — tutor discovery
- `/tutors/[id]` — tutor profile
- `/bookings` — booking request form
- `/admin` — admin dashboard stub
- `/api/tutors` — get verified tutors / create tutor
- `/api/bookings` — create booking request
- `/api/admin` — admin queue data

## Notes

- `supabase/schema.sql` contains the core MVP table definitions.
- The service role key is only used server-side in `lib/supabaseClient.ts` and must not be committed.
- Payment, SMS, and OTP provider integrations are still stubbed; Supabase is now wired for the core tutor and booking flows.
