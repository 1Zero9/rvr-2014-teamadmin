'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getDb } from '../db';
import { auditLog, events, ideas, members, transactions } from '../db/schema';
import { requireApprovedMember, requireRole, type Role } from './lib/authz';

function value(formData: FormData, key: string) { return String(formData.get(key) ?? '').trim(); }
function id() { return crypto.randomUUID(); }
function now() { return new Date().toISOString(); }
async function audit(actorId: string, action: string, entityType: string, entityId: string, summary: string) {
  await getDb().insert(auditLog).values({ id: id(), actorId, action, entityType, entityId, summary, createdAt: now() });
}

export async function recordTransaction(formData: FormData) {
  const member = await requireApprovedMember();
  const type = value(formData, 'type') === 'expense' ? 'expense' : 'income';
  if (member.role === 'parent' || (member.role === 'coach' && type === 'income')) throw new Error('You do not have permission to record this transaction.');
  const amount = Number(value(formData, 'amount'));
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) throw new Error('Enter a valid positive amount.');
  const description = value(formData, 'description');
  const personName = value(formData, 'personName');
  if (!description || !personName) throw new Error('Description and person are required.');
  const transactionId = id();
  const status = member.role === 'coach' ? 'pending' : (type === 'expense' ? 'approved' : 'paid');
  await getDb().insert(transactions).values({ id: transactionId, type, amountCents: Math.round(amount * 100), category: value(formData, 'category') || 'Other', description, personName, paymentMethod: value(formData, 'paymentMethod') || null, status, occurredOn: value(formData, 'occurredOn') || new Date().toISOString().slice(0, 10), requestedBy: type === 'expense' ? personName : null, createdBy: member.id, createdAt: now() });
  await audit(member.id, 'create', 'transaction', transactionId, `${type} recorded: ${description}`);
  revalidatePath('/'); revalidatePath('/fund'); revalidatePath('/contributions'); revalidatePath('/expenses');
}

export async function addEvent(formData: FormData) {
  const member = await requireRole(['super_admin', 'admin', 'coach']);
  const title = value(formData, 'title'); const eventDate = value(formData, 'eventDate');
  if (!title || !eventDate) throw new Error('Title and date are required.');
  const eventId = id();
  await getDb().insert(events).values({ id: eventId, title, eventDate, details: value(formData, 'details') || null, location: value(formData, 'location') || null, createdBy: member.id, createdAt: now() });
  await audit(member.id, 'create', 'event', eventId, `Date added: ${title}`); revalidatePath('/calendar'); revalidatePath('/');
}

export async function addIdea(formData: FormData) {
  const member = await requireApprovedMember(); const title = value(formData, 'title');
  if (!title) throw new Error('Idea title is required.'); const ideaId = id();
  await getDb().insert(ideas).values({ id: ideaId, title, details: value(formData, 'details') || null, proposedBy: member.displayName, createdAt: now() });
  await audit(member.id, 'create', 'idea', ideaId, `Idea proposed: ${title}`); revalidatePath('/ideas');
}

export async function updateMember(formData: FormData) {
  const actor = await requireRole(['super_admin']); const memberId = value(formData, 'memberId');
  const role = value(formData, 'role') as Role; if (!['super_admin', 'admin', 'coach', 'parent'].includes(role)) throw new Error('Invalid role.');
  const approved = value(formData, 'approved') === 'true';
  if (memberId === actor.id && (!approved || role !== 'super_admin')) throw new Error('You cannot remove your own Super Admin access.');
  await getDb().update(members).set({ role, approved, updatedAt: now() }).where(eq(members.id, memberId));
  await audit(actor.id, 'update', 'member', memberId, `Member changed to ${role}${approved ? '' : ' (pending)'}`); revalidatePath('/admin');
}
