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
