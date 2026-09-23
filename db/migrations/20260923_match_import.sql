-- Private match-import detail. Source screenshots are deliberately not stored.
CREATE TABLE IF NOT EXISTS match_goal_events (
  id text PRIMARY KEY,
  match_id text NOT NULL,
  minute integer,
  scorer_name text NOT NULL,
  assist_name text,
  sort_order integer NOT NULL,
  created_at text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_match_goal_events_match ON match_goal_events (match_id);

CREATE TABLE IF NOT EXISTS match_squad_selections (
  id text PRIMARY KEY,
  match_id text NOT NULL,
  player_name text NOT NULL,
  squad_number integer,
  selection text NOT NULL,
  is_captain boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL,
  created_at text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_match_squad_selections_match ON match_squad_selections (match_id);
