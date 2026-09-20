# RVR 2014 Team Admin

Private team fund, match and information hub for the Rivervalley Rangers 2014 team.

## What is included

- Parent contributions with payer and payment-method records
- Expense recording and coach approval requests
- A transparent team-fund ledger
- Important dates and team activity ideas
- Club pitch, DDSL and safeguarding links
- Private match tracker for real scorelines, scorers, assists and player of the match
- A complete audit trail

## Access model

This is a private, single-owner workspace with one shared password. There are
no user accounts, roles, approval flows, or separate coach/parent logins.

Set `AUTH_PASSWORD` and `AUTH_SESSION_SECRET` (at least 32 random characters)
in Vercel before deploying. The shared password opens a signed 30-day session.

## Local development & Deployment

This project uses Next.js 16 (App Router), React 19, and Drizzle ORM with PostgreSQL.

- **Local:** Install dependencies with `npm install` and run `npm run dev`. Configure one of `POSTGRES_URL`, `PRISMA_DATABASE_URL`, or `DATABASE_URL`.
- **Database schema:** The historic Drizzle migration snapshots in `drizzle/` are SQLite-era metadata and cannot safely generate PostgreSQL migrations. Apply the explicit SQL in `db/migrations/20260920_private_match_statistics.sql` to add the private tracker tables.
- **Deployment (Vercel):** Keep the same PostgreSQL connection variable in Project Settings. The private tracker and the rest of the workspace use that database.
