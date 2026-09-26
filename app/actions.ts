'use server';

import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getDb } from '../db';
import { auditLog, events, ideas, matchGoalEvents, matchPerformanceSummaries, matchSquadSelections, photoAlbums, playerMatchStats, transactions } from '../db/schema';
import type { ImportedMatch } from './lib/match-import';
import { AUTH_COOKIE_NAME, createSessionValue, requireApprovedMember, timingSafeStringEqual } from './lib/authz';

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
  const password = value(formData, 'password');
  const expected = process.env.AUTH_PASSWORD;
  if (!expected) throw new Error('AUTH_PASSWORD must be configured.');
  if (!timingSafeStringEqual(password, expected)) redirect('/login?error=invalid');

  (await cookies()).set(AUTH_COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect('/portal');
}

export async function recordTransaction(formData: FormData) {
  const member = await requireApprovedMember();
  const type = value(formData, 'type') === 'expense' ? 'expense' : 'income';
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
  const status = type === 'expense' ? 'approved' : 'paid';

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
  const member = await requireApprovedMember();
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

export async function saveImportedMatchAction(formData: FormData) {
  const member = await requireApprovedMember();
  const matchId = value(formData, 'matchId');
  let imported: ImportedMatch;
  try { imported = JSON.parse(value(formData, 'importedMatch')) as ImportedMatch; } catch { throw new Error('The imported match data is invalid. Please analyse the screenshots again.'); }
  if (!matchId || !Number.isInteger(imported.rvrGoals) || !Number.isInteger(imported.opponentGoals) || imported.rvrGoals < 0 || imported.opponentGoals < 0) throw new Error('Choose a match and confirm the score.');
  const clean = (name: string) => name.trim();
  const goals = imported.goals.filter((goal) => clean(goal.scorerName));
  const contributions = new Map<string, { goals: number; assists: number }>();
  for (const goal of goals) {
    if (goal.team === 'opponent') continue;
    const scorer = clean(goal.scorerName); const assist = clean(goal.assistName || '');
    const scorerRow = contributions.get(scorer) || { goals: 0, assists: 0 }; scorerRow.goals++; contributions.set(scorer, scorerRow);
    if (assist) { const assistRow = contributions.get(assist) || { goals: 0, assists: 0 }; assistRow.assists++; contributions.set(assist, assistRow); }
  }
  const selected = [
    ...imported.starters.map((player, sortOrder) => ({ ...player, selection: 'starting' as const, sortOrder })),
    ...imported.bench.map((player, sortOrder) => ({ ...player, selection: 'bench' as const, sortOrder })),
  ].filter((player) => clean(player.playerName));
  const updatedAt = now(); const db = getDb();
  await db.transaction(async (tx) => {
    await tx.insert(matchPerformanceSummaries).values({ matchId, rvrGoals: imported.rvrGoals, opponentGoals: imported.opponentGoals, playerOfMatch: imported.playerOfMatch || null, notes: imported.notes || null, updatedAt }).onConflictDoUpdate({ target: matchPerformanceSummaries.matchId, set: { rvrGoals: imported.rvrGoals, opponentGoals: imported.opponentGoals, playerOfMatch: imported.playerOfMatch || null, notes: imported.notes || null, updatedAt } });
    await tx.delete(playerMatchStats).where(eq(playerMatchStats.matchId, matchId));
    await tx.delete(matchGoalEvents).where(eq(matchGoalEvents.matchId, matchId));
    await tx.delete(matchSquadSelections).where(eq(matchSquadSelections.matchId, matchId));
    if (contributions.size) await tx.insert(playerMatchStats).values([...contributions.entries()].map(([playerName, stats]) => ({ id: id(), matchId, playerName, ...stats, createdAt: updatedAt, updatedAt })));
    if (goals.length) await tx.insert(matchGoalEvents).values(goals.map((goal, sortOrder) => ({ id: id(), matchId, minute: goal.minute, scorerName: clean(goal.scorerName), assistName: clean(goal.assistName || '') || null, team: goal.team === 'opponent' ? 'opponent' as const : 'rvr' as const, sortOrder, createdAt: updatedAt })));
    if (selected.length) await tx.insert(matchSquadSelections).values(selected.map((player) => ({ id: id(), matchId, playerName: clean(player.playerName), squadNumber: player.squadNumber, selection: player.selection, isCaptain: player.isCaptain, sortOrder: player.sortOrder, createdAt: updatedAt })));
  });
  await audit(member.id, 'import', 'match_performance', matchId, `Imported private match record (${imported.rvrGoals}-${imported.opponentGoals}) from screenshots.`);
  revalidatePath('/stats'); revalidatePath('/portal'); revalidatePath('/fixtures');
}

export async function updateMatchPerformanceAction(formData: FormData) {
  const member = await requireApprovedMember();
  const matchId = value(formData, 'matchId');
  const rvrGoals = Number(value(formData, 'rvrGoals'));
  const opponentGoals = Number(value(formData, 'opponentGoals'));
  if (!matchId || !Number.isInteger(rvrGoals) || !Number.isInteger(opponentGoals) || rvrGoals < 0 || opponentGoals < 0) throw new Error('Choose a match and confirm the score.');
  const playerOfMatch = value(formData, 'playerOfMatch') || null;
  const notes = value(formData, 'notes') || null;

  const clean = (name: string) => name.trim();
  const minutes = formData.getAll('goalMinute').map(String);
  const scorers = formData.getAll('goalScorer').map(String);
  const assists = formData.getAll('goalAssist').map(String);
  const teams = formData.getAll('goalTeam').map(String);
  const goals = scorers.map((scorerName, index) => ({
    minute: minutes[index]?.trim() ? Number(minutes[index]) : null,
    scorerName: clean(scorerName),
    assistName: clean(assists[index] || ''),
    team: teams[index] === 'opponent' ? 'opponent' as const : 'rvr' as const,
  })).filter((goal) => goal.scorerName);

  const contributions = new Map<string, { goals: number; assists: number }>();
  for (const goal of goals) {
    if (goal.team === 'opponent') continue;
    const scorerRow = contributions.get(goal.scorerName) || { goals: 0, assists: 0 }; scorerRow.goals++; contributions.set(goal.scorerName, scorerRow);
    if (goal.assistName) { const assistRow = contributions.get(goal.assistName) || { goals: 0, assists: 0 }; assistRow.assists++; contributions.set(goal.assistName, assistRow); }
  }

  const updatedAt = now(); const db = getDb();
  await db.transaction(async (tx) => {
    await tx.insert(matchPerformanceSummaries).values({ matchId, rvrGoals, opponentGoals, playerOfMatch, notes, updatedAt }).onConflictDoUpdate({ target: matchPerformanceSummaries.matchId, set: { rvrGoals, opponentGoals, playerOfMatch, notes, updatedAt } });
    await tx.delete(playerMatchStats).where(eq(playerMatchStats.matchId, matchId));
    await tx.delete(matchGoalEvents).where(eq(matchGoalEvents.matchId, matchId));
    if (contributions.size) await tx.insert(playerMatchStats).values([...contributions.entries()].map(([playerName, stats]) => ({ id: id(), matchId, playerName, ...stats, createdAt: updatedAt, updatedAt })));
    if (goals.length) await tx.insert(matchGoalEvents).values(goals.map((goal, sortOrder) => ({ id: id(), matchId, minute: goal.minute, scorerName: goal.scorerName, assistName: goal.assistName || null, team: goal.team, sortOrder, createdAt: updatedAt })));
  });
  await audit(member.id, 'update', 'match_performance', matchId, `Edited private match record (${rvrGoals}-${opponentGoals}).`);
  revalidatePath('/stats'); revalidatePath('/portal'); revalidatePath('/fixtures');
}

export async function addGooglePhotosAlbumAction(formData: FormData) {
  const member = await requireApprovedMember();
  const title = value(formData, 'title');
  const shareUrl = value(formData, 'shareUrl');
  let url: URL;
  try { url = new URL(shareUrl); } catch { throw new Error('Enter a valid Google Photos album link.'); }
  if (url.protocol !== 'https:' || !/(^|\.)photos\.app\.goo\.gl$|(^|\.)photos\.google\.com$/i.test(url.hostname) || !title) {
    throw new Error('Enter an album title and a valid HTTPS Google Photos link.');
  }
  const albumId = id();
  await getDb().insert(photoAlbums).values({
    id: albumId, title, shareUrl, coverUrl: '/hero-squad.jpg', photoCount: 0,
    albumDate: new Date().toISOString().slice(0, 10), photographer: 'Private album', samplePhotos: [], createdAt: now(),
  });
  await audit(member.id, 'create', 'photo_album', albumId, `Added Google Photos album: ${title}`);
  revalidatePath('/albums');
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
