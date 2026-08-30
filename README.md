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

## Local development

This project uses Vinext, React and Cloudflare D1. Install dependencies, apply the Drizzle migrations to the local D1 database, then run the development script.
