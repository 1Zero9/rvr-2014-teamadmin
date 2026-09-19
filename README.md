# RVR 2014 Team Admin

Private team fund, accounts and information hub for the Rivervalley Rangers 2014 team.

## What is included

- Parent contributions with payer and payment-method records
- Expense recording and coach approval requests
- A transparent team-fund ledger
- Important dates and team activity ideas
- Club pitch, DDSL and safeguarding links
- Super Admin, Admin, Coach and Parent roles
- A complete audit trail

## Access model

This is a single-owner workspace with no in-app account, password, session, or
role system. Enable Vercel Deployment Protection for the project; that is the
sole access boundary for the site and its data-changing endpoints.

## Local development & Deployment

This project uses Next.js 16 (App Router), React 19, and Drizzle ORM with LibSQL (Turso/SQLite).

- **Local:** Install dependencies with `npm install` and run `npm run dev`. It automatically uses a local SQLite file (`local.db`).
- **Database schema:** Update schema with `npm run db:push`.
- **Deployment (Vercel):** Connect repository to Vercel. In Vercel Project Settings, add `DATABASE_URL` (and `DATABASE_AUTH_TOKEN` if using Turso) as environment variables.
