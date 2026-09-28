export type ImportedGoal = { minute: number | null; scorerName: string; assistName: string | null; team: 'rvr' | 'opponent' };
export type ImportedSquadPlayer = { playerName: string; squadNumber: number | null; isCaptain: boolean };
export type ImportedMatch = {
  rvrGoals: number;
  opponentGoals: number;
  playerOfMatch: string | null;
  notes: string | null;
  goals: ImportedGoal[];
  starters: ImportedSquadPlayer[];
  bench: ImportedSquadPlayer[];
};

/**
 * The goal/assist/POTM screen in the source match app only shows a first
 * name and surname initial ("Dara C."), while the squad screen shows full
 * names ("Dara Cassidy"). Resolve the abbreviated form against the squad
 * list; leave it untouched if there's no confident single match, rather
 * than guessing a child's surname wrong.
 */
export function resolvePlayerName(name: string, fullNames: string[]): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  if (fullNames.includes(trimmed)) return trimmed;
  const match = trimmed.match(/^(.+?)\s+([A-Za-z])\.?$/);
  if (!match) return trimmed;
  const [, firstName, initial] = match;
  const candidates = fullNames.filter((full) => {
    const parts = full.trim().split(/\s+/);
    if (parts.length < 2) return false;
    return parts[0].toLowerCase() === firstName.toLowerCase() && parts[parts.length - 1][0]?.toLowerCase() === initial.toLowerCase();
  });
  return candidates.length === 1 ? candidates[0] : trimmed;
}
