export type ImportedGoal = { minute: number | null; scorerName: string; assistName: string | null; team: 'rvr' | 'opponent' };
export type ImportedCard = { playerName: string; card: 'yellow' | 'red'; minute: number | null };
export type CompetitionType = 'league' | 'cup' | 'tournament';
export const COMPETITION_TYPES: { value: CompetitionType; label: string }[] = [
  { value: 'league', label: 'League' },
  { value: 'cup', label: 'Cup' },
  { value: 'tournament', label: 'Tournament' },
];
export type ImportedSquadPlayer = { playerName: string; squadNumber: number | null; isCaptain: boolean };
export type ImportedMatch = {
  rvrGoals: number;
  opponentGoals: number;
  playersOfMatch: string[];
  notes: string | null;
  goals: ImportedGoal[];
  cards: ImportedCard[];
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

/** Splits "A & B", "A, B" or "A and B" into separate names. */
export function splitPlayerNames(value: string | null | undefined): string[] {
  return (value || '').split(/\s*(?:&|,|;|\/|\band\b)\s*/i).map((name) => name.trim()).filter(Boolean);
}

/** Guess the competition type from a DDSL competition name. */
export function guessCompetitionType(name: string): CompetitionType {
  if (/cup|shield|trophy/i.test(name)) return 'cup';
  if (/tournament|blitz|festival/i.test(name)) return 'tournament';
  return 'league';
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** Parses DDSL's "03 Oct 2026" into a sortable timestamp; unknown dates sort as 0. */
export function parseDdslDate(date: string): number {
  const m = date.match(/(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})/);
  if (!m) return 0;
  const month = MONTHS.indexOf(m[2].toLowerCase());
  return month < 0 ? 0 : new Date(Number(m[3]), month, Number(m[1])).getTime();
}
