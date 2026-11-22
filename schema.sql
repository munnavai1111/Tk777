PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0 CHECK(balance >= 0),
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT,
  image_url TEXT NOT NULL DEFAULT '',
  game_type TEXT NOT NULL DEFAULT 'aviator',
  html_content TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_rounds (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  game_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  bet_amount INTEGER NOT NULL,
  multiplier REAL NOT NULL,
  payout INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crash_rounds (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  game_id TEXT NOT NULL,
  bet_amount INTEGER NOT NULL,
  crash_multiplier REAL NOT NULL,
  start_ms INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  cashout_multiplier REAL NOT NULL DEFAULT 0,
  payout INTEGER NOT NULL DEFAULT 0,
  settled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_rounds_user_created ON game_rounds(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_crash_user_status ON crash_rounds(user_id, status);

INSERT OR IGNORE INTO categories(id,name,image_url,sort_order) VALUES
('hot','Hot Games','',1),
('favorites','Favorites','',2),
('slots','Slots','',3),
('live','Live','',4),
('sports','Sports','',5),
('esports','E-sports','',6),
('poker','Poker','',7),
('fish','Fish','',8),
('lottery','Lottery','',9),
('mission','Mission','',10),
('vip','VIP','',11),
('promotion','Promotion','',12);

INSERT OR IGNORE INTO games(id,name,category_id,image_url,game_type,sort_order) VALUES
('aviator','Aviator','hot','','aviator',1),
('super-ace','Super Ace','slots','','superace',2);

INSERT OR IGNORE INTO settings(key,value) VALUES
('site_name','TK777'),('maintenance','false');
