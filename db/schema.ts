import { boolean, index, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const members = pgTable('members', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  role: text('role', { enum: ['super_admin', 'admin', 'coach', 'parent'] }).notNull().default('parent'),
  approved: boolean('approved').notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  amountCents: integer('amount_cents').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  personName: text('person_name').notNull(),
  paymentMethod: text('payment_method'),
  status: text('status', { enum: ['pending', 'approved', 'paid', 'rejected'] }).notNull().default('paid'),
  occurredOn: text('occurred_on').notNull(),
  requestedBy: text('requested_by'),
  createdBy: text('created_by').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_transactions_type_date').on(table.type, table.occurredOn),
  index('idx_transactions_status').on(table.status),
]);

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  details: text('details'),
  eventDate: text('event_date').notNull(),
  location: text('location'),
  createdBy: text('created_by').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_events_event_date').on(table.eventDate),
]);

export const ideas = pgTable('ideas', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  details: text('details'),
  status: text('status', { enum: ['open', 'shortlisted', 'planned', 'closed'] }).notNull().default('open'),
  votes: integer('votes').notNull().default(0),
  proposedBy: text('proposed_by').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_ideas_created_at').on(table.createdAt),
]);

export const matches = pgTable('matches', {
  id: text('id').primaryKey(),
  opponent: text('opponent').notNull(),
  competition: text('competition').notNull(),
  matchDate: text('match_date').notNull(),
  kickoffTime: text('kickoff_time').notNull(),
  venue: text('venue').notNull(),
  homeAway: text('home_away', { enum: ['home', 'away', 'neutral'] }).notNull().default('home'),
  status: text('status', { enum: ['upcoming', 'completed', 'postponed'] }).notNull().default('upcoming'),
  rvrGoals: integer('rvr_goals'),
  opponentGoals: integer('opponent_goals'),
  scorers: text('scorers'),
  potm: text('potm'),
  matchNotes: text('match_notes'),
  ddslMatchId: text('ddsl_match_id'),
  syncedAt: text('synced_at').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_matches_match_date').on(table.matchDate),
  index('idx_matches_status').on(table.status),
  index('idx_matches_competition').on(table.competition),
]);

export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  summary: text('summary').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_audit_log_created_at').on(table.createdAt),
]);

export const photoAlbums = pgTable('photo_albums', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  shareUrl: text('share_url').notNull(),
  coverUrl: text('cover_url').notNull(),
  photoCount: integer('photo_count').notNull().default(0),
  albumDate: text('album_date').notNull(),
  photographer: text('photographer').notNull().default('Team Dad & Official Photographer'),
  matchOpponent: text('match_opponent'),
  createdAt: text('created_at').notNull(),
}, (table) => [
  index('idx_photo_albums_date').on(table.albumDate),
  index('idx_photo_albums_created_at').on(table.createdAt),
]);

export const coachingStaff = pgTable('coaching_staff', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  category: text('category', { enum: ['coach', 'admin', 'welfare', 'medic'] }).notNull().default('coach'),
  credentials: text('credentials'),
  phone: text('phone'),
  email: text('email'),
  notes: text('notes'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  index('idx_coaching_staff_order').on(table.sortOrder),
  index('idx_coaching_staff_created').on(table.createdAt),
]);


