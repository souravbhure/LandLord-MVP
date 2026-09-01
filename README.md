# Land Monetization Platform — MVP

Helps landowners who don't know how to monetize their land: register a plot,
get an instant rule-based recommendation (sale / lease / joint development /
etc.), and get listed to real leads once verified.

Built per the lean, solo-founder, 6-8 week roadmap in `docs/roadmap.md`. The
recommendation logic implements the scoring model in `docs/scoring-model.md`.

## What's built vs. stubbed

**Functional:**
- Land registration form (basic info + map boundary draw + auto sq. ft. calc via Turf.js)
- Advisory scoring engine (`src/lib/scoring.ts`) — pure logic, no external calls, fully testable
- Advisory result screen with primary + alternative recommendations and plain-language reasoning
- Public listing page with a lead-capture gate ("Get Owner Details")
- Admin review screen for manual verification (Submitted → Under Review → Needs Correction → Verified)
- Supabase schema with row-level security (`supabase/schema.sql`)

**Deliberately out of scope for v1** (see `docs/roadmap.md` for why):
- Aadhar/PAN government API verification
- AI-based document mismatch detection/translation — verification is manual for the pilot
- Payments, escrow, in-app negotiation
- Regional score calibration / comps-based valuation

## Setup

1. **Create a Supabase project** at supabase.com. In the SQL editor, run
   `supabase/schema.sql` to create the tables and RLS policies.
2. **Enable Phone Auth** in Supabase (Authentication → Providers → Phone),
   and connect an SMS provider (Twilio or MSG91) for OTP delivery.
3. **Get a Google Maps API key** at console.cloud.google.com — enable the
   Maps JavaScript API and the Drawing library, and enable billing (required
   even for the free tier).
4. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
   ```
5. Install and run:
   ```
   npm install
   npm run dev
   ```
6. Visit `/admin` to review submissions manually — no auth guard is on this
   route yet, add one before deploying anything but a local pilot.

## Deploying

Push this repo to GitHub, then import it in Vercel — it will auto-detect
Next.js. Add the same three env vars in the Vercel project settings.

## Next steps after this scaffold

Follow `docs/roadmap.md` week-by-week. The registration form, scoring engine,
listing page, and admin screen cover Weeks 2-5. Weeks 1, 6, 7, and 8
(infra setup, design polish, pilot outreach, and iteration) are execution
work outside what code alone can do.
