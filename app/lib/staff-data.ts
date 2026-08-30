export interface StaffMember {
  id: string;
  name: string;
  role: string;
  category: 'coach' | 'admin' | 'welfare' | 'medic';
  credentials?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-lead-coach',
    name: 'Stephen Cranfield',
    role: 'Lead Coach',
    category: 'coach',
    credentials: 'UEFA / FAI Certified Coach · Tactical & Player Development',
    phone: null,
    email: 'stephen@rivervalleyrangers.ie',
    notes: 'Rivervalley Park · Matchday Lead',
    sortOrder: 1,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'staff-asst-coach',
    name: 'Assistant Coach',
    role: 'Assistant Coach',
    category: 'coach',
    credentials: 'Warm-Up, Agility, S&C & Goalkeeper Training',
    phone: null,
    email: 'coaching@rivervalleyrangers.ie',
    notes: 'FIFA 11+ Lead',
    sortOrder: 2,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'staff-admin-treasurer',
    name: 'Squad Administration',
    role: 'Team Admin & Treasurer',
    category: 'admin',
    credentials: 'Referee fees, tournament registration, and fund management',
    phone: null,
    email: 'admin@rivervalleyrangers.ie',
    notes: 'Squad Fund Portal',
    sortOrder: 3,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'staff-welfare',
    name: 'Club Safeguarding Officer',
    role: 'Child Welfare Officer',
    category: 'welfare',
    credentials: 'Garda Vetting, FAI Child Welfare & Player Safety',
    phone: null,
    email: 'safeguarding@rivervalleyrangers.ie',
    notes: 'Club Safeguarding Portal',
    sortOrder: 4,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
];
