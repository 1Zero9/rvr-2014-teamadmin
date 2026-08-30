CREATE INDEX `idx_audit_log_created_at` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_events_event_date` ON `events` (`event_date`);--> statement-breakpoint
CREATE INDEX `idx_ideas_created_at` ON `ideas` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_transactions_type_date` ON `transactions` (`type`,`occurred_on`);--> statement-breakpoint
CREATE INDEX `idx_transactions_status` ON `transactions` (`status`);--> statement-breakpoint
PRAGMA optimize;
