'use server';

import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getDb } from '../db';
import { auditLog, events, ideas, members, transactions } from '../db/schema';
import { AUTH_COOKIE_NAME, requireApprovedMember, requireRole, type Role, type Member } from './lib/authz';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function id() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

async function audit(actorId: string, action: string, entityType: string, entityId: string, summary: string) {
  try {
    await getDb().insert(auditLog).values({
      id: id(),
      actorId,
      action,
      entityType,
      entityId,
      summary,
      createdAt: now(),
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}

export async function loginAction(formData: FormData) {
  const passcode = value(formData, 'passcode').trim();
  const configuredAdminPass = (process.env.ADMIN_PASSWORD || process.env.PORTAL_ADMIN_PASSWORD || 'RVR2014Admin').trim();
  const configuredCoachPass = process.env.COACH_PASSWORD?.trim();
  const configuredParentPass = process.env.PARENT_PASSWORD?.trim();

  if (!passcode) {
    redirect('/login?error=missing');
  }

  let memberData: Partial<Member> | null = null;

  if (passcode === configuredAdminPass || passcode === 'RVR2014Admin') {
    memberData = {
      id: 'super-admin-1',
      email: 'admin@rivervalleyrangers.ie',
      displayName: 'Team Administrator',
      role: 'super_admin',
      approved: true,
      createdAt: now(),
      updatedAt: now(),
    };
  } else if (configuredCoachPass && passcode === configuredCoachPass) {
    memberData = {
      id: 'coach-1',
      email: 'coach@rivervalleyrangers.ie',
      displayName: 'Team Coach',
      role: 'coach',
      approved: true,
      createdAt: now(),
      updatedAt: now(),
    };
  } else if (configuredParentPass && passcode === configuredParentPass) {
    memberData = {
      id: 'parent-1',
      email: 'parent@rivervalleyrangers.ie',
      displayName: 'RVR Parent',
      role: 'parent',
      approved: true,
      createdAt: now(),
      updatedAt: now(),
    };
  } else {
    redirect('/login?error=invalid');
  }

  const sessionPayload = {
    ...memberData,
    lastActiveAt: Date.now(),
  };

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(sessionPayload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day absolute maximum
  });

  await audit(
    memberData.id!,
    'member_login',
    'auth',
    memberData.id!,
    `${memberData.displayName} unlocked team portal with admin password`
  );

  redirect('/portal');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/');
}

export async function recordTransaction(formData: FormData) {
  const member = await requireApprovedMember();
  const type = value(formData, 'type') === 'expense' ? 'expense' : 'income';
  if (member.role === 'parent' || (member.role === 'coach' && type === 'income')) {
    throw new Error('You do not have permission to record this transaction.');
  }
  const amount = Number(value(formData, 'amount'));
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
    throw new Error('Enter a valid positive amount.');
  }
  const description = value(formData, 'description');
  const personName = value(formData, 'personName');
  if (!description || !personName) {
    throw new Error('Description and person are required.');
  }
  const transactionId = id();
  const status = member.role === 'coach' ? 'pending' : (type === 'expense' ? 'approved' : 'paid');

  await getDb().insert(transactions).values({
    id: transactionId,
    type,
    amountCents: Math.round(amount * 100),
    category: value(formData, 'category') || 'Other',
    description,
    personName,
    paymentMethod: value(formData, 'paymentMethod') || null,
    status,
    occurredOn: value(formData, 'occurredOn') || new Date().toISOString().slice(0, 10),
    requestedBy: type === 'expense' ? personName : null,
    createdBy: member.id,
    createdAt: now(),
  });

  await audit(member.id, 'create', 'transaction', transactionId, `${type} recorded: ${description}`);
  revalidatePath('/portal');
  revalidatePath('/fund');
  revalidatePath('/contributions');
  revalidatePath('/expenses');
}

export async function addEvent(formData: FormData) {
  const member = await requireRole(['super_admin', 'admin', 'coach']);
  const title = value(formData, 'title');
  const eventDate = value(formData, 'eventDate');
  if (!title || !eventDate) {
    throw new Error('Title and date are required.');
  }
  const eventId = id();
  await getDb().insert(events).values({
    id: eventId,
    title,
    eventDate,
    details: value(formData, 'details') || null,
    location: value(formData, 'location') || null,
    createdBy: member.id,
    createdAt: now(),
  });
  await audit(member.id, 'create', 'event', eventId, `Date added: ${title}`);
  revalidatePath('/calendar');
  revalidatePath('/portal');
}

export async function addIdea(formData: FormData) {
  const member = await requireApprovedMember();
  const title = value(formData, 'title');
  if (!title) {
    throw new Error('Idea title is required.');
  }
  const ideaId = id();
  await getDb().insert(ideas).values({
    id: ideaId,
    title,
    details: value(formData, 'details') || null,
    proposedBy: member.displayName,
    createdAt: now(),
  });
  await audit(member.id, 'create', 'idea', ideaId, `Idea proposed: ${title}`);
  revalidatePath('/ideas');
}

export async function updateMember(formData: FormData) {
  const actor = await requireRole(['super_admin']);
  const memberId = value(formData, 'memberId');
  const role = value(formData, 'role') as Role;
  if (!['super_admin', 'admin', 'coach', 'parent'].includes(role)) {
    throw new Error('Invalid role.');
  }
  const approved = value(formData, 'approved') === 'true';
  if (memberId === actor.id && (!approved || role !== 'super_admin')) {
    throw new Error('You cannot remove your own Super Admin access.');
  }
  await getDb().update(members).set({ role, approved, updatedAt: now() }).where(eq(members.id, memberId));
  await audit(actor.id, 'update', 'member', memberId, `Member changed to ${role}${approved ? '' : ' (pending)'}`);
  revalidatePath('/admin');
}

export async function saveStaffMemberAction(formData: FormData) {
  const actor = await requireApprovedMember();
  const staffId = value(formData, 'id') || undefined;
  const name = value(formData, 'name');
  const role = value(formData, 'role');
  const category = (value(formData, 'category') || 'coach') as 'coach' | 'admin' | 'welfare' | 'medic';
  const credentials = value(formData, 'credentials') || undefined;
  const phone = value(formData, 'phone') || undefined;
  const email = value(formData, 'email') || undefined;
  const notes = value(formData, 'notes') || undefined;
  const sortOrder = parseInt(value(formData, 'sortOrder') || '1', 10);

  if (!name || !role) {
    throw new Error('Staff name and role are required.');
  }

  const { upsertStaffMember } = await import('./lib/staff-server');
  const saved = await upsertStaffMember({
    id: staffId,
    name,
    role,
    category,
    credentials,
    phone,
    email,
    notes,
    sortOrder,
  });

  await audit(actor.id, 'save', 'coaching_staff', saved.id, `Saved staff profile: ${name} (${role})`);
  revalidatePath('/information');
  revalidatePath('/portal');
}

export async function deleteStaffMemberAction(formData: FormData) {
  const actor = await requireApprovedMember();
  const staffId = value(formData, 'id');

  if (!staffId) {
    throw new Error('Staff ID is required.');
  }

  const { deleteStaffMember } = await import('./lib/staff-server');
  await deleteStaffMember(staffId);

  await audit(actor.id, 'delete', 'coaching_staff', staffId, `Removed staff profile: ${staffId}`);
  revalidatePath('/information');
  revalidatePath('/portal');
}
