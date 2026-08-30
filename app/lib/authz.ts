import { members } from '../../db/schema';

export type Role = 'super_admin' | 'admin' | 'coach' | 'parent';
export type Member = typeof members.$inferSelect;

const setupMember: Member = {
  id: 'temporary-setup-admin',
  email: 'setup@rvr2014.local',
  displayName: 'Team Admin',
  role: 'super_admin',
  approved: true,
  createdAt: '2026-08-30T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
};

// Temporary single-admin mode. Replace this function when the chosen
// application authentication provider is introduced.
export async function getCurrentMember(): Promise<Member> {
  return setupMember;
}

export async function requireApprovedMember() {
  return getCurrentMember();
}

export async function requireRole(allowed: Role[]) {
  const member = await getCurrentMember();
  if (!allowed.includes(member.role as Role)) throw new Error('You do not have permission to perform this action.');
  return member;
}

export function canManageAccounts(role: string) { return role === 'super_admin' || role === 'admin'; }
export function canManageMembers(role: string) { return role === 'super_admin'; }
export function roleLabel(role: string) { return ({ super_admin: 'Super Admin', admin: 'Admin', coach: 'Coach', parent: 'Parent' } as Record<string, string>)[role] ?? role; }
