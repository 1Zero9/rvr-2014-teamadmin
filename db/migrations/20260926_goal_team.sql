-- Tags each goal event with the scoring team so opponent goals stop being
-- folded into Finn's team's own player stats.
ALTER TABLE match_goal_events ADD COLUMN IF NOT EXISTS team text NOT NULL DEFAULT 'rvr';
