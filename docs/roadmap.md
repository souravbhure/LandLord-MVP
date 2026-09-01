# Land Monetization Platform — MVP Roadmap (Solo Founder, 8 Weeks)

Built for: 1 person + AI tools + occasional freelancers. Goal: a live, usable MVP in 6–8 weeks that proves the core loop — **register land → get an instant recommendation → get listed → generate a real lead** — not a fully-featured platform.

---

## Step 1: Ruthlessly Scope the MVP

**IN for v1:**
- OTP signup/login (phone number only — skip Aadhar/PAN verification at signup)
- Land registration: basic info + map pin (auto sq. ft. calc) — this alone is enough to run the advisory engine
- Rule-based advisory scoring (from the model already drafted) → instant recommendation shown to user
- Manual doc upload (owner accepts they may be uploaded, but no automated verification yet)
- **Human-reviewed verification** (you or one freelancer, not an AI agent) — approve/reject with one-line reason
- Public listing page with lead-gen gate ("Get Owner Details" → capture buyer/lessee contact)
- Basic admin dashboard (just enough to review submissions and approve listings)

**OUT for v1 (defer to v2+):**
- Aadhar/PAN government API verification — huge compliance and integration lift, not needed to validate the idea
- AI document-mismatch/translation agent — do this manually for the first 20-30 users; you'll learn the real error patterns before automating them
- Payments/escrow, in-app negotiation, JV deal structuring tools
- Regional score calibration, comps-based valuation
- Mobile app — a responsive web app is enough to test demand

This cut list is what makes 6-8 weeks realistic. Every one of the deferred items is expensive precisely because it deals with verified government data or AI accuracy — not worth building before you know anyone wants the product.

---

## Step 2: Lean Tech Stack (solo + AI-friendly)

| Layer | Recommendation | Why |
|---|---|---|
| Frontend | Next.js + Tailwind | Fast to build with AI pair-coding, deploys instantly on Vercel |
| Backend/DB/Auth | Supabase | Handles OTP auth, Postgres DB, file storage, row-level security — out of the box, no backend team needed |
| Maps + area calc | Google Maps JS API + Turf.js | Turf.js computes polygon area from map-drawn boundary client-side, free |
| Hosting | Vercel (frontend) + Supabase (backend) | Free/cheap tiers cover MVP traffic entirely |
| Admin panel | Retool or a simple Supabase-connected internal page | Don't hand-build this — Retool free tier is enough for solo review workflows |
| Scoring engine | Plain server-side function (Node/Edge function) implementing the weighted matrix | No ML needed yet — it's a lookup + weighted sum |

This whole stack is buildable by one person using AI coding assistance without a dedicated engineer.

---

## Step 3: Week-by-Week Plan

**Week 1 — Foundation**
- Finalize MVP scope (above) and the exact fields in the registration form
- Set up Supabase project, Next.js repo, Vercel deployment pipeline
- Wireframe the 5 core screens (signup, registration, advisory result, listing page, admin review) — you already have most of this in your flow diagram

**Week 2 — Core Registration Flow**
- Build OTP signup/login
- Build land registration form (basic info + map pin + boundary draw + auto area calc)
- Store submissions in Supabase

**Week 3 — Advisory Engine**
- Implement the scoring matrix as a server function
- Build the "recommendation result" screen (primary + alternative path, plain-language reasoning)
- This is your core differentiator — worth the most polish time

**Week 4 — Verification & Admin**
- Build doc upload (land docs, owner docs, photos)
- Build the internal admin review screen (approve / needs-correction / reject, with a reason field)
- Wire up status flow: Submitted → Under Review → Needs Correction → Verified

**Week 5 — Listing & Lead Capture**
- Build the public listing page (using the sample card format you already designed)
- Build the "Get Owner Details" lead-capture gate (name/phone of interested buyer/lessee)
- Notify you (email/WhatsApp) when a lead comes in

**Week 6 — Freelancer Pass**
- Bring in a designer freelancer for a UI polish pass on the 5 core screens (1 week engagement is enough)
- Optionally, a legal/compliance freelancer to sanity-check your data handling of land ownership docs before real users upload sensitive documents

**Week 7 — Pilot with Real Users**
- Onboard 10-20 real landowners manually — likely reachable through your existing Zenzo/IDC network in Pune
- You personally do doc verification for these — this is your source of truth for what "verification errors" actually look like before you automate anything
- Track: completion rate through registration, advisory-result satisfaction (ask directly), time-to-verification, lead quality

**Week 8 — Iterate & Soft Launch**
- Fix the top 3-5 friction points found in the pilot
- Open sign-ups more broadly (local FB/WhatsApp groups, real estate broker networks, Zenzo Lab community)

---

## Step 4: Where Freelancers Plug In (occasional, not full-time)
- **UI/visual designer** — 1 short engagement in week 6, using your existing IDC design sensibility as the brief
- **Legal/compliance consultant** — one consult before real user docs start flowing, specifically on data handling of ownership documents and any state land-record disclosure rules
- **Local verification agent (later)** — once volume grows past what you can personally review, a part-time person to physically/manually cross-check docs — this is a v1.5 hire, not week-1

---

## Step 5: Compliance Flag (do this early, not last)
Since you're collecting land ownership documents (and eventually Aadhar/PAN), get a quick legal read on **India's DPDP Act 2023** data handling obligations before your pilot — even a lightweight consent flow and data-retention policy matters once real ownership documents are involved. This is cheap to do now and expensive to retrofit later.

---

## Step 6: MVP Success Metrics
Before building anything past this roadmap, you want clear signal on:
- **% of registrations that complete** the full flow (drop-off tells you where friction is)
- **% of users who say the advisory recommendation felt accurate/useful** (ask directly — this validates your core differentiator)
- **# of real leads generated** per listed plot
- **Time from submission to verified listing** (your ops bottleneck will show up here)

If these look promising after the Week 7-8 pilot, that's your signal to invest in the deferred items (AI verification agent, Aadhar/PAN integration, payments) rather than building them speculatively.
