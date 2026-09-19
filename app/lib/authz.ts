import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { members } from '../../db/schema';

export type Role = 'super_admin' | 'coach' | 'parent';
export type Member = typeof members.$inferSelect;

/** 'admin' and 'super_admin' were functionally identical everywhere except
 * one screen (who can edit member roles) - dropped as a separate role.
 * `role` is a TypeScript-level constraint on a plain text column, not a
 * real database enum, so an existing row (or an old session cookie) can
 * still carry the literal string 'admin' after this change. Normalize it
 * here, at the one place every role check ultimately reads through, rather
 * than risk someone silently losing account-management access because a
 * stale value no longer matches any check. */
export function normalizeRole(role: string | null | undefined): Role {
  if (role === 'admin') return 'super_admin';
  if (role === 'coach' || role === 'parent') return role;
  return 'super_admin';
}

export const AUTH_COOKIE_NAME = 'rvr_auth_session';
export const DEFAULT_INACTIVITY_TIMEOUT_MINUTES = 20;

export interface SessionData extends Partial<Member> {
  lastActiveAt?: number;
}

export async function getCurrentMember(): Promise<Member | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const data = JSON.parse(sessionCookie.value) as SessionData;
    if (!data.id || !data.role) {
      return null;
    }

    const timeoutMinutes = parseInt(
      process.env.SESSION_TIMEOUT_MINUTES || String(DEFAULT_INACTIVITY_TIMEOUT_MINUTES),
      10
    );
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const now = Date.now();

    // Inactivity timeout validation
    if (data.lastActiveAt && now - data.lastActiveAt > timeoutMs) {
      return null;
    }

    return {
      id: data.id,
      email: data.email ?? 'admin@rivervalleyrangers.ie',
      displayName: data.displayName ?? 'Team Administrator',
      role: normalizeRole(data.role),
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
  return normalizeRole(role) === 'super_admin';
}

export function canManageMembers(role: string) {
  return normalizeRole(role) === 'super_admin';
}

export function roleLabel(role: string) {
  return (
    ({
      super_admin: 'Super Admin',
      coach: 'Coach',
      parent: 'Parent',
    } as Record<string, string>)[normalizeRole(role)] ?? role
  );
}
