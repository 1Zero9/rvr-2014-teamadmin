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
