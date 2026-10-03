-- League / Cup / Tournament tag on each recorded match (everything so far is league).
ALTER TABLE match_performance_summaries ADD COLUMN IF NOT EXISTS competition_type text NOT NULL DEFAULT 'league';

-- One row per player of the match, so a match can have several.
CREATE TABLE IF NOT EXISTS match_potm_awards (
  id text PRIMARY KEY,
  match_id text NOT NULL,
  player_name text NOT NULL,
  created_at text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_match_potm_awards_match ON match_potm_awards (match_id);

-- Yellow and red cards.
CREATE TABLE IF NOT EXISTS match_cards (
  id text PRIMARY KEY,
  match_id text NOT NULL,
  player_name text NOT NULL,
  card text NOT NULL,
  minute integer,
  sort_order integer NOT NULL,
  created_at text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_match_cards_match ON match_cards (match_id);
