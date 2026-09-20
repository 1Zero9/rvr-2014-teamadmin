-- PostgreSQL migration for the private RVR performance tracker.
-- Apply once to the same Postgres database configured by POSTGRES_URL,
-- PRISMA_DATABASE_URL, or DATABASE_URL before using /stats.

CREATE TABLE IF NOT EXISTS match_performance_summaries (
  match_id text PRIMARY KEY,
  rvr_goals integer NOT NULL,
  opponent_goals integer NOT NULL,
  player_of_match text,
  notes text,
  updated_at text NOT NULL
);

CREATE TABLE IF NOT EXISTS player_match_stats (
  id text PRIMARY KEY,
  match_id text NOT NULL,
  player_name text NOT NULL,
  goals integer NOT NULL DEFAULT 0,
  assists integer NOT NULL DEFAULT 0,
  created_at text NOT NULL,
  updated_at text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_player_match_stats_match ON player_match_stats (match_id);
CREATE INDEX IF NOT EXISTS idx_player_match_stats_player ON player_match_stats (player_name);
