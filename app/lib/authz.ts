import { members } from '../../db/schema';

/**
 * This is a single-owner private workspace. Vercel Deployment Protection is
 * the access boundary; the app deliberately has no account, session, or role
 * model of its own.
 */
export type Role = 'owner';
export type Member = typeof members.$inferSelect;

const OWNER: Member = {
  id: 'workspace-owner',
  email: 'owner@rivervalleyrangers.ie',
  displayName: 'Team Admin',
  role: 'owner' as Member['role'],
  approved: true,
  createdAt: '',
  updatedAt: '',
};

export async function getCurrentMember(): Promise<Member> {
  return OWNER;
}

export async function requireApprovedMember(): Promise<Member> {
  return OWNER;
}

export async function requireRole(_allowed: Role[]): Promise<Member> {
  return OWNER;
}

export function canManageAccounts(_role?: string): boolean {
  return true;
}

export function canManageMembers(_role?: string): boolean {
  return false;
}

export function canManageTeamContent(_role?: string): boolean {
  return true;
}

export function roleLabel(_role?: string): string {
  return 'Private workspace';
}
