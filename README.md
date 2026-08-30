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

The application is temporarily running in a single Super Admin setup mode with no application-level login. The Sites deployment remains owner-only so financial information is not exposed while a replacement authentication system is selected.

- **Super Admin:** full control, including users and roles
- **Admin:** accounts, expenses, calendar, ideas and read-only member oversight
- **Coach:** team information plus expense requests, dates and ideas
- **Parent:** approved read access to transparent accounts and team information, plus activity ideas

The role model and server-side authorization checks remain in the codebase for the replacement authentication system. Parent views do not expose payer names in the public-facing dashboard or ledger.

## Local development & Deployment

This project uses Next.js 16 (App Router), React 19, and Drizzle ORM with LibSQL (Turso/SQLite).

- **Local:** Install dependencies with `npm install` and run `npm run dev`. It automatically uses a local SQLite file (`local.db`).
- **Database schema:** Update schema with `npm run db:push`.
- **Deployment (Vercel):** Connect repository to Vercel. In Vercel Project Settings, add `DATABASE_URL` (and `DATABASE_AUTH_TOKEN` if using Turso) as environment variables.
