export interface MatchRecord {
  id: string;
  opponent: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  competition: string;
  matchDate: string;
  kickoffTime: string;
  venue: string;
  homeAway: 'home' | 'away' | 'neutral';
  status: 'upcoming' | 'completed' | 'postponed';
  rvrGoals?: number | null;
  opponentGoals?: number | null;
  scorers?: string | null;
  potm?: string | null;
  matchNotes?: string | null;
  ddslMatchId?: string | null;
  syncedAt: string;
  createdAt: string;
}

export const INITIAL_DDSL_MATCHES: Omit<MatchRecord, 'createdAt' | 'syncedAt'>[] = [
  {
    id: 'm-2026-08-29-greystones',
    opponent: 'Greystones United AFC',
    competition: 'DDSL U13 Major 1',
    matchDate: '2026-08-29',
    kickoffTime: '11:00 AM',
    venue: 'United Park, Greystones',
    homeAway: 'away',
    status: 'completed',
    rvrGoals: 4,
    opponentGoals: 2,
    scorers: 'Cranfield (2), O\'Brien (1), Walsh (1)',
    potm: 'Liam Cranfield (Dominant midfield display & 2 goals)',
    matchNotes: 'Superb opening season victory in Wicklow. High pressing and rapid counter-attacks led to 3 first-half goals.',
    ddslMatchId: 'DDSL-U13M1-10492',
  },
  {
    id: 'm-2026-08-22-malahide',
    opponent: 'Malahide United FC',
    competition: 'DDSL U13 Major 1',
    matchDate: '2026-08-22',
    kickoffTime: '10:30 AM',
    venue: 'Rivervalley Park - Pitch 1',
    homeAway: 'home',
    status: 'completed',
    rvrGoals: 3,
    opponentGoals: 1,
    scorers: 'Kelly (2), Byrne (1)',
    potm: 'Sean Kelly (Two clinical finishes inside the box)',
    matchNotes: 'Controlled possession throughout. Solid back four marshalled the clean transition play.',
    ddslMatchId: 'DDSL-U13M1-10488',
  },
  {
    id: 'm-2026-08-15-corduff',
    opponent: 'Corduff FC',
    competition: 'DDSL U13 Major 1',
    matchDate: '2026-08-15',
    kickoffTime: '11:30 AM',
    venue: 'Corduff Park, Blanchardstown',
    homeAway: 'away',
    status: 'completed',
    rvrGoals: 2,
    opponentGoals: 2,
    scorers: 'O\'Brien (1), Doyle (1)',
    potm: 'Conor Doyle (Equalising thunderbolt from 20 yards)',
    matchNotes: 'Thrilling end-to-end battle. RVR fought back from 2-1 down with 5 minutes remaining.',
    ddslMatchId: 'DDSL-U13M1-10481',
  },
  {
    id: 'm-2026-09-05-stkevins',
    opponent: 'St Kevin\'s Boys FC',
    competition: 'DDSL U13 Major 1',
    matchDate: '2026-09-05',
    kickoffTime: '10:30 AM',
    venue: 'Rivervalley Park - Pitch 1',
    homeAway: 'home',
    status: 'upcoming',
    matchNotes: 'Top-of-the-table clash. Players to arrive in full club tracksuit at 9:45 AM for FIFA 11+ warm-up.',
    ddslMatchId: 'DDSL-U13M1-10501',
  },
  {
    id: 'm-2026-09-12-cherryorchard',
    opponent: 'Cherry Orchard FC',
    competition: 'DDSL All-Dublin Cup - Rd 1',
    matchDate: '2026-09-12',
    kickoffTime: '11:00 AM',
    venue: 'Elmdale Park, Ballyfermot',
    homeAway: 'away',
    status: 'upcoming',
    matchNotes: 'DDSL Cup knockout tie. Straight to 10 mins extra time and penalties if level after full time.',
    ddslMatchId: 'DDSL-CUP-201',
  },
  {
    id: 'm-2026-09-19-homefarm',
    opponent: 'Home Farm FC',
    competition: 'DDSL U13 Major 1',
    matchDate: '2026-09-19',
    kickoffTime: '10:30 AM',
    venue: 'Rivervalley Park - Pitch 1',
    homeAway: 'home',
    status: 'upcoming',
    matchNotes: 'Home league fixture. Pitch inspection scheduled for 8:30 AM on matchday.',
    ddslMatchId: 'DDSL-U13M1-10515',
  },
  {
    id: 'm-2026-09-26-stellamaris',
    opponent: 'Stella Maris FC',
    competition: 'DDSL U13 Major 1',
    matchDate: '2026-09-26',
    kickoffTime: '11:00 AM',
    venue: 'Dublin Port Stadium, Richmond Road',
    homeAway: 'away',
    status: 'upcoming',
    matchNotes: 'Astro pitch — molded studs or all-weather astro runners mandatory.',
    ddslMatchId: 'DDSL-U13M1-10522',
  },
];

export interface LeagueStanding {
  pos: number;
  team: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  form: ('W' | 'D' | 'L')[];
  isRvr?: boolean;
}

export const DDSL_LEAGUE_TABLE: LeagueStanding[] = [
  { pos: 1, team: 'Rivervalley Rangers AFC', p: 3, w: 2, d: 1, l: 0, gf: 9, ga: 5, gd: 4, pts: 7, form: ['W', 'W', 'D'], isRvr: true },
  { pos: 2, team: 'St Kevin\'s Boys FC', p: 3, w: 2, d: 1, l: 0, gf: 8, ga: 4, gd: 4, pts: 7, form: ['W', 'D', 'W'] },
  { pos: 3, team: 'Cherry Orchard FC', p: 3, w: 2, d: 0, l: 1, gf: 7, ga: 4, gd: 3, pts: 6, form: ['L', 'W', 'W'] },
  { pos: 4, team: 'Corduff FC', p: 3, w: 1, d: 2, l: 0, gf: 6, ga: 5, gd: 1, pts: 5, form: ['D', 'W', 'D'] },
  { pos: 5, team: 'Greystones United AFC', p: 3, w: 1, d: 0, l: 2, gf: 5, ga: 7, gd: -2, pts: 3, form: ['W', 'L', 'L'] },
  { pos: 6, team: 'Home Farm FC', p: 3, w: 1, d: 0, l: 2, gf: 4, ga: 6, gd: -2, pts: 3, form: ['L', 'L', 'W'] },
  { pos: 7, team: 'Stella Maris FC', p: 3, w: 0, d: 1, l: 2, gf: 3, ga: 6, gd: -3, pts: 1, form: ['L', 'D', 'L'] },
  { pos: 8, team: 'Malahide United FC', p: 3, w: 0, d: 1, l: 2, gf: 3, ga: 8, gd: -5, pts: 1, form: ['L', 'L', 'D'] },
];
