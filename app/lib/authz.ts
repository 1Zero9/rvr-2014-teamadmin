import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { members } from '../../db/schema';

/** One shared password for this private workspace; no user accounts or roles. */
export type Role = 'owner';
export type Member = typeof members.$inferSelect;
export const AUTH_COOKIE_NAME = 'rvr_workspace_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const OWNER: Member = {
  id: 'workspace-owner', email: 'owner@rivervalleyrangers.ie', displayName: 'Team Admin',
  role: 'parent', approved: true, createdAt: '', updatedAt: '',
};

function secret() {
  const value = process.env.AUTH_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SESSION_SECRET must have at least 32 random characters.');
  return value;
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

/** Constant-time string comparison, for anywhere a secret gets compared to
 * user input (the login password, an API token, etc). A plain `===` leaks
 * how many leading characters matched via how long the comparison takes -
 * real for a short shared password, not just a timing-attack curiosity.
 * Mirrors the pattern already used for session-cookie validation below. */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still do a (mismatched-length) comparison so the early return above
    // isn't itself a length oracle - cheap, and avoids a second timing
    // signal for "how close is the length" on top of content.
    timingSafeEqual(bufA, Buffer.from(a));
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function valid(value: string | undefined) {
  if (!value) return false;
  const index = value.lastIndexOf('.');
  if (index < 1) return false;
  const payload = value.slice(0, index);
  const supplied = Buffer.from(value.slice(index + 1));
  const expected = Buffer.from(sign(payload));
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
  const [marker, expiresAt] = payload.split('.');
  return marker === 'workspace' && /^\d+$/.test(expiresAt ?? '') && Number(expiresAt) > Math.floor(Date.now() / 1000);
}

export function createSessionValue() {
  const payload = `workspace.${Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS}`;
  return `${payload}.${sign(payload)}`;
}

export async function getCurrentMember(): Promise<Member | null> {
  return valid((await cookies()).get(AUTH_COOKIE_NAME)?.value) ? OWNER : null;
}

export async function requireApprovedMember(): Promise<Member> {
  const member = await getCurrentMember();
  if (!member) redirect('/login');
  return member;
}

export function isAuthenticatedRequest(cookieValue: string | undefined): boolean {
  return valid(cookieValue);
}

export function canManageAccounts(_role?: string): boolean { return true; }
export function canManageMembers(_role?: string): boolean { return false; }
export function canManageTeamContent(_role?: string): boolean { return true; }
export function roleLabel(_role?: string): string { return 'Private workspace'; }
