# Finn's Team

Private match and stats hub for a Rivervalley Rangers 2014 team, built on top
of the DDSL live league feed.

## What is included

- Home (`/portal`): league position, recent form, next fixture and latest result
- Matches (`/fixtures`): fixtures, results, the live DDSL league table, and
  opponent scouting
- Stats (`/stats`): private match-by-match record (screenshot import or
  manual entry), season goal/assist leaderboard, player-of-the-match awards
- Albums (`/albums`): linked Google Photos albums per match/event
- A complete audit trail of who changed what

Earlier versions of this app also had parent-contribution/expense tracking,
a team-fund ledger, a calendar/ideas board and a staff roster. Those routes
and their server actions were removed when the app was simplified to a
match/stats-focused private workspace (2026-09-26) — the underlying database
tables and historical records are untouched, only the UI and actions to
create *new* entries were removed. Reintroducing any of them means restoring
a route and its action, not rebuilding the schema.

## Access model

This is a private, single-owner workspace with one shared password. There are
no user accounts, roles, approval flows, or separate coach/parent logins.

Set `AUTH_PASSWORD` and `AUTH_SESSION_SECRET` (at least 32 random characters)
in Vercel before deploying. The shared password opens a signed 30-day session.

## Local development & Deployment

This project uses Next.js 16 (App Router), React 19, and Drizzle ORM with PostgreSQL.

- **Local:** Install dependencies with `npm install` and run `npm run dev`. Configure one of `POSTGRES_URL`, `PRISMA_DATABASE_URL`, or `DATABASE_URL`.
- **Database schema:** The historic Drizzle migration snapshots in `drizzle/` are SQLite-era metadata and cannot safely generate PostgreSQL migrations. Apply the explicit SQL files in `db/migrations/` in date order, including `20260926_goal_team.sql` which tags each goal event with the scoring team.
- **Deployment (Vercel):** Keep the same PostgreSQL connection variable in Project Settings. The private tracker and the rest of the workspace use that database.
