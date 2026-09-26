'use server';

import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getDb } from '../db';
import { auditLog, matchGoalEvents, matchPerformanceSummaries, matchSquadSelections, photoAlbums, playerMatchStats } from '../db/schema';
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

export async function saveImportedMatchAction(formData: FormData) {
  const member = await requireApprovedMember();
  const matchId = value(formData, 'matchId');
  let imported: ImportedMatch;
  try { imported = JSON.parse(value(formData, 'importedMatch')) as ImportedMatch; } catch { throw new Error('The imported match data is invalid. Please analyse the screenshots again.'); }
  if (!matchId || !Number.isInteger(imported.rvrGoals) || !Number.isInteger(imported.opponentGoals) || imported.rvrGoals < 0 || imported.opponentGoals < 0) throw new Error('Choose a match and confirm the score.');
  const clean = (name: string) => name.trim();
  // The DDSL live match centre only ever names RVR's own scorers; an
  // unidentified opponent scorer comes through as the literal placeholder
  // "Player". Treat that as an opponent goal regardless of what the model
  // (or a person editing the form) tagged it as.
  const isOpponentGoal = (goal: ImportedMatch['goals'][number]) => goal.team === 'opponent' || clean(goal.scorerName).toLowerCase() === 'player';
  const goals = imported.goals.filter((goal) => clean(goal.scorerName) || goal.team === 'opponent');
  const contributions = new Map<string, { goals: number; assists: number }>();
  for (const goal of goals) {
    if (isOpponentGoal(goal)) continue;
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
    if (goals.length) await tx.insert(matchGoalEvents).values(goals.map((goal, sortOrder) => ({ id: id(), matchId, minute: goal.minute, scorerName: clean(goal.scorerName), assistName: clean(goal.assistName || '') || null, team: isOpponentGoal(goal) ? 'opponent' as const : 'rvr' as const, sortOrder, createdAt: updatedAt })));
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
  const goals = scorers.map((scorerName, index) => {
    const cleanScorer = clean(scorerName);
    // "Player" is the DDSL live match centre's placeholder for an
    // unidentified opponent scorer - always treat it as an opponent goal,
    // whatever the team dropdown was left on.
    const team = teams[index] === 'opponent' || cleanScorer.toLowerCase() === 'player' ? 'opponent' as const : 'rvr' as const;
    return {
      minute: minutes[index]?.trim() ? Number(minutes[index]) : null,
      scorerName: cleanScorer,
      assistName: clean(assists[index] || ''),
      team,
    };
  }).filter((goal) => goal.scorerName || goal.team === 'opponent');

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
