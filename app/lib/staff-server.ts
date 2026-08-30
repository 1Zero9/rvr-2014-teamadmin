import 'server-only';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { coachingStaff } from '@/db/schema';
import { INITIAL_STAFF, StaffMember } from './staff-data';

export async function getCoachingStaffFromDb(): Promise<StaffMember[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(coachingStaff).orderBy(asc(coachingStaff.sortOrder));

    if (rows.length === 0) {
      // Seed initial staff roster
      for (const s of INITIAL_STAFF) {
        await db.insert(coachingStaff).values({
          id: s.id,
          name: s.name,
          role: s.role,
          category: s.category,
          credentials: s.credentials,
          phone: s.phone,
          email: s.email,
          notes: s.notes,
          sortOrder: s.sortOrder,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        }).onConflictDoNothing();
      }
      return INITIAL_STAFF;
    }

    return rows as StaffMember[];
  } catch (error) {
    console.error('Error fetching coaching staff from DB, returning defaults:', error);
    return INITIAL_STAFF;
  }
}

export async function upsertStaffMember(data: {
  id?: string;
  name: string;
  role: string;
  category: 'coach' | 'admin' | 'welfare' | 'medic';
  credentials?: string;
  phone?: string;
  email?: string;
  notes?: string;
  sortOrder?: number;
}): Promise<StaffMember> {
  const db = getDb();
  const now = new Date().toISOString();
  const staffId = data.id || `staff-${Date.now()}`;

  const payload = {
    id: staffId,
    name: data.name,
    role: data.role,
    category: data.category,
    credentials: data.credentials || null,
    phone: data.phone || null,
    email: data.email || null,
    notes: data.notes || null,
    sortOrder: data.sortOrder ?? 1,
    createdAt: now,
    updatedAt: now,
  };

  await db
    .insert(coachingStaff)
    .values(payload)
    .onConflictDoUpdate({
      target: coachingStaff.id,
      set: {
        name: data.name,
        role: data.role,
        category: data.category,
        credentials: data.credentials || null,
        phone: data.phone || null,
        email: data.email || null,
        notes: data.notes || null,
        sortOrder: data.sortOrder ?? 1,
        updatedAt: now,
      },
    });

  return payload;
}

export async function deleteStaffMember(id: string): Promise<void> {
  const db = getDb();
  await db.delete(coachingStaff).where(eq(coachingStaff.id, id));
}
