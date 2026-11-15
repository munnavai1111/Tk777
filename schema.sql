-- ADDITIVE migration: run once on the EXISTING tk777-db D1 database.
-- This does not delete or recreate users, sessions, transactions or balances.
CREATE TABLE IF NOT EXISTS game_state (
 id INTEGER PRIMARY KEY CHECK(id=1), round INTEGER NOT NULL DEFAULT 1,
 phase TEXT NOT NULL DEFAULT 'waiting', round_started_at INTEGER NOT NULL,
 crash_multiplier REAL NOT NULL, next_multiplier REAL NOT NULL,
 last_crash REAL, crashed_at INTEGER, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS game_crash_history (
 id INTEGER PRIMARY KEY AUTOINCREMENT, round INTEGER NOT NULL,
 multiplier REAL NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_game_crash_history_created ON game_crash_history(id DESC);
CREATE TABLE IF NOT EXISTS game_bets (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL REFERENCES users(id), round INTEGER NOT NULL,
 slot INTEGER NOT NULL DEFAULT 0, stake REAL NOT NULL CHECK(stake>0),
 state TEXT NOT NULL CHECK(state IN ('pending','active','won','lost','cancelled')),
 cashout_multiplier REAL, payout REAL NOT NULL DEFAULT 0,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP, settled_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_game_bets_user_created ON game_bets(user_id,id DESC);
CREATE INDEX IF NOT EXISTS idx_game_bets_round_state ON game_bets(round,state);
CREATE UNIQUE INDEX IF NOT EXISTS idx_game_bets_open_slot ON game_bets(user_id,round,slot) WHERE state IN ('pending','active');
