-- Run once when upgrading a database created before the idempotent Cash Out update.
-- Fresh installations already have this column in schema.sql and must NOT run this migration.
ALTER TABLE crash_rounds ADD COLUMN settled INTEGER NOT NULL DEFAULT 0;
-- Existing completed rounds must never be paid again after the upgrade.
UPDATE crash_rounds SET settled = 1 WHERE status IN ('cashed_out', 'crashed');
