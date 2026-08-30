# RVR 2014 Team Admin

Private team fund, accounts and information hub for the Rivervalley Rangers 2014 team.

## What is included

- Parent contributions with payer and payment-method records
- Expense recording and coach approval requests
- A transparent team-fund ledger
- Important dates and team activity ideas
- Club pitch, DDSL and safeguarding links
- Super Admin, Admin, Coach and Parent roles
- Approval-gated membership and an audit trail

## Access model

The hosted site requires sign-in. The first authenticated member becomes the Super Admin. Later visitors are held in a pending state until approved in the Admin portal.

- **Super Admin:** full control, including users and roles
- **Admin:** accounts, expenses, calendar, ideas and read-only member oversight
- **Coach:** team information plus expense requests, dates and ideas
- **Parent:** approved read access to transparent accounts and team information, plus activity ideas

All sensitive authorization checks run on the server. Parent views do not expose payer names in the public-facing dashboard or ledger.

## Local development

This project uses Vinext, React, Cloudflare D1 and Sites authentication. Install dependencies, apply the Drizzle migrations to the local D1 database, then run the development script.
