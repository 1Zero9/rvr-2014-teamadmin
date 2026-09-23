CREATE TABLE IF NOT EXISTS passkeys (
  id text PRIMARY KEY,
  credential_id text NOT NULL UNIQUE,
  public_key text NOT NULL,
  counter bigint NOT NULL DEFAULT 0,
  transports jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at text NOT NULL,
  last_used_at text
);
CREATE TABLE IF NOT EXISTS passkey_challenges (
  purpose text PRIMARY KEY,
  challenge text NOT NULL,
  expires_at text NOT NULL
);
