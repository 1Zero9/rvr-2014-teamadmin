import { eq } from 'drizzle-orm';
import { getDb } from '../../db';
import { members } from '../../db/schema';
import { getChatGPTUser, requireChatGPTUser } from '../chatgpt-auth';

export type Role = 'super_admin' | 'admin' | 'coach' | 'parent';
export type Member = typeof members.$inferSelect;

export async function getCurrentMember(): Promise<Member> {
  const identity = (await getChatGPTUser()) ?? (await requireChatGPTUser('/'));
  const db = getDb();
  const byId = await db.select().from(members).where(eq(members.id, identity.userId)).limit(1);
  if (byId[0]) return byId[0];

  const existing = await db.select({ id: members.id }).from(members).limit(1);
  const now = new Date().toISOString();
  const member: typeof members.$inferInsert = {
    id: identity.userId,
    email: identity.email.toLowerCase(),
    displayName: identity.fullName ?? identity.email.split('@')[0],
    role: existing.length === 0 ? 'super_admin' : 'parent',
    approved: existing.length === 0,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(members).values(member);
  return member as Member;
}

export async function requireApprovedMember() {
  const member = await getCurrentMember();
  if (!member.approved) throw new Error('Your access is awaiting approval from a team administrator.');
  return member;
}

export async function requireRole(allowed: Role[]) {
  const member = await requireApprovedMember();
  if (!allowed.includes(member.role as Role)) throw new Error('You do not have permission to perform this action.');
  return member;
}

export function canManageAccounts(role: string) { return role === 'super_admin' || role === 'admin'; }
export function canManageMembers(role: string) { return role === 'super_admin'; }
export function roleLabel(role: string) { return ({ super_admin: 'Super Admin', admin: 'Admin', coach: 'Coach', parent: 'Parent' } as Record<string, string>)[role] ?? role; }
