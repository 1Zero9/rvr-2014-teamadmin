import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { members } from '../../db/schema';

export type Role = 'super_admin' | 'admin' | 'coach' | 'parent';
export type Member = typeof members.$inferSelect;

export const AUTH_COOKIE_NAME = 'rvr_auth_session';

export async function getCurrentMember(): Promise<Member | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const data = JSON.parse(sessionCookie.value) as Partial<Member>;
    if (!data.id || !data.role) {
      return null;
    }

    return {
      id: data.id,
      email: data.email ?? 'member@rvr2014.local',
      displayName: data.displayName ?? 'Team Member',
      role: (data.role as Role) ?? 'parent',
      approved: data.approved ?? true,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: data.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function requireApprovedMember(): Promise<Member> {
  const member = await getCurrentMember();
  if (!member) {
    redirect('/login');
  }
  return member;
}

export async function requireRole(allowed: Role[]): Promise<Member> {
  const member = await requireApprovedMember();
  if (!allowed.includes(member.role as Role)) {
    throw new Error('You do not have permission to perform this action.');
  }
  return member;
}

export function canManageAccounts(role: string) {
  return role === 'super_admin' || role === 'admin';
}

export function canManageMembers(role: string) {
  return role === 'super_admin';
}

export function roleLabel(role: string) {
  return (
    ({
      super_admin: 'Super Admin',
      admin: 'Admin',
      coach: 'Coach',
      parent: 'Parent',
    } as Record<string, string>)[role] ?? role
  );
}
