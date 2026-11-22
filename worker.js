const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

const parseDepositContent = raw => {
  const defaults = {
    fields: {
      pageTitle: "Deposit",
      numberLabel: "NUMBER · COPY ONLY",
      copyButton: "Copy",
      numberNotice: "এটি শুধু সেন্ড মানি নম্বর। কোনো ক্যাশ আউট করবেন না।",
      paymentTitle: "পেমেন্ট পদ্ধতি (Wallet)",
      amountLabel: "পরিমাণ",
      amountPlaceholder: "Amount লিখুন",
      referenceLabel: "Transaction ID",
      referencePlaceholder: "Transaction ID লিখুন",
      referenceHint: "সঠিক Transaction ID লিখুন। এটি আসল ডকুমেন্ট।",
      submitButton: "Submit Request",
      historyTitle: "আমার Requests",
      loadingText: "লোড হচ্ছে…",
      backButton: "Member Center",
      chooseMethodError: "আগে একটি পেমেন্ট পদ্ধতি সিলেক্ট করুন।",
      amountError: "সঠিক Amount লিখুন।",
      referenceError: "Transaction ID লিখুন।",
      successMessage: "ডিপজিট Request জমা হয়েছে। ২ মিনিটের মধ্যে টাকা জমা হবে।",
      emptyHistory: "এখনো কোনো Request নেই",
      historySuffix: "(টাকা)",
      statusPending: "Pending",
      statusAccepted: "Accepted",
      statusCancelled: "Cancelled",
      currencyPrefix: "৳",
      methodBkash: "bKash",
      methodNagad: "Nagad",
      methodRocket: "Rocket",
      Badge: "BD",
      copiedButton: "Copied",
      copySuccess: "নম্বর কপি হয়েছে",
      preset100: "100",
      preset200: "200",
      preset300: "300",
      preset500: "500",
      preset1000: "1000"
    },
    categories: []
  };

  try {
    const parsed = JSON.parse(String(raw || "{}"));
    const fields = {};
    for (const [key, fallback] of Object.entries(defaults.fields)) {
      const value = parsed?.fields?.[key];
      fields[key] = typeof value === "string" ? value.slice(0, 300) : fallback;
    }

    const categories = Array.isArray(parsed?.categories)
      ? parsed.categories
          .filter(c =>
            !(String(c?.title || "").trim() === "নির্দেশনা" && String(c?.text || "").trim() === "এখানে সঠিক তথ্য ব্যাবহার করুন।") &&
            !(String(c?.title || "").trim() === "অতিরিক্ত তথ্য" && String(c?.text || "").trim() === "টাকা জমা করুন উইনিং হন।")
          )
          .slice(0, 12)
          .map((c, i) => ({
            id: "custom-" + i,
            title: String(c?.title || "").slice(0, 80),
            text: String(c?.text || "").slice(0, 300)
          }))
      : defaults.categories;

    return { fields, categories };
  } catch {
    return defaults;
  }
};

const parseWithdrawContent = raw => {
  const defaults = {
    fields: {
      pageTitle: "Withdrawal",
      safetyNote: "শুধু উইথড্র Request। বিকাশ/নগদ/রকেট বাটনগুলো কেবল পদ্ধতি ওয়ালেট নম্বর, টাকা উত্তোলন করুন।",
      methodTitle: "পদ্ধতি নির্বাচন করুন",
      methodBkash: "bKash",
      methodNagad: "Nagad",
      methodRocket: "Rocket",
      Badge: "bKash",
      IdsHint: "টাকা দেখাবে।",
      IdsLabel: "শুধু পরিচিতি:",
      noIds: "এই পদ্ধতিতে কোনো পরিচিতি যোগ করা হয়নি।",
      amountLabel: "টাকার পরিমাণ",
      amountPlaceholder: "কত টাকা উইথড্র করতে চান",
      balanceLabel: "বর্তমান ব্যালেন্স:",
      coinSuffix: "Coin",
      submitButton: "Submit Withdrawal",
      historyTitle: "আমার Withdrawal Requests",
      loadingText: "লোড হচ্ছে…",
      emptyHistory: "এখনো কোনো Request নেই",
      recordTitle: "Withdrawal Record",
      emptyRecord: "কোনো Withdrawal Record নেই",
      backButton: "Member Center",
      chooseMethodError: "বিকাশ, নগদ অথবা রকেট নির্বাচন করুন।",
      amountError: "সঠিক ব্যালেন্স পরিমাণ লিখুন।",
      balanceError: "আপনার ব্যালেন্সে পর্যাপ্ত টাকা নেই।",
      successMessage: "Request জমা হয়েছে। নির্ধারিত কয়েন সঙ্গে সঙ্গে ব্যালেন্স থেকে কেটে Pending থাকবে; Admin বাতিল করলে কয়েন ফেরত আসবে।",
      statusPending: "Pending",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      historyCoinSuffix: "Coin"
    }
  };

  try {
    const parsed = JSON.parse(String(raw || "{}"));
    const fields = {};
    for (const [key, fallback] of Object.entries(defaults.fields)) {
      const value = parsed?.fields?.[key];
      fields[key] = typeof value === "string" ? value.slice(0, 300) : fallback;
    }
    return { fields };
  } catch {
    return defaults;
  }
};

const parseRefIds = (raw, fallback) => {
  try {
    const values = JSON.parse(String(raw || "[]"));
    if (!Array.isArray(values)) return [fallback];
    const clean = [...new Set(
      values
        .map(x => String(x).trim().toUpperCase())
        .filter(x => /^[A-Z0-9_-]{2,32}$/.test(x))
    )].slice(0, 10);
    return clean.length ? clean : [fallback];
  } catch {
    return [fallback];
  }
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" }
  });

const uid = () => crypto.randomUUID();
const rand = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
const enc = new TextEncoder();

/* Cache successful schema setup within each Worker isolate to avoid repeating D1 migrations on every API call. */
const tk777SchemaInitPromises = new Map();
async function ensureSchemaOnce(key, initializer, env) {
  let pending = tk777SchemaInitPromises.get(key);
  if (!pending) {
    pending = Promise.resolve().then(() => initializer(env)).catch(error => {
      tk777SchemaInitPromises.delete(key);
      throw error;
    });
    tk777SchemaInitPromises.set(key, pending);
  }
  return pending;
}

/* COMPATIBILITY LAYER: preserve the legacy integer user IDs and old records. */
async function ensureLegacyCompatibleSchema(env) {
  const info = await env.DB.prepare("PRAGMA table_info(users)").all();
  const columns = new Set((info.results || []).map(row => row.name));
  const additions = [
    ["email", "TEXT"],
    ["password", "TEXT NOT NULL DEFAULT ''"],
    ["password_hash", "TEXT"],
    ["password_salt", "TEXT"],
    ["role", "TEXT NOT NULL DEFAULT 'user'"]
  ];
  for (const [name, definition] of additions) {
    if (!columns.has(name)) {
      await env.DB.prepare("ALTER TABLE users ADD COLUMN " + name + " " + definition).run();
    }
  }
  await env.DB.prepare("UPDATE users SET email=username WHERE email IS NULL OR email=''").run();
  await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)").run();

  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY,value TEXT NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY,name TEXT NOT NULL,image_url TEXT NOT NULL DEFAULT '',sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS games (id TEXT PRIMARY KEY,name TEXT NOT NULL,category_id TEXT,image_url TEXT NOT NULL DEFAULT '',game_type TEXT NOT NULL DEFAULT 'aviator',html_content TEXT NOT NULL DEFAULT '',active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS game_rounds (id TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),game_id TEXT NOT NULL,game_type TEXT NOT NULL,bet_amount INTEGER NOT NULL,multiplier REAL NOT NULL,payout INTEGER NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_rounds_user_created ON game_rounds(user_id,created_at)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS crash_sessions (id TEXT PRIMARY KEY,game_id TEXT NOT NULL,crash_multiplier REAL NOT NULL,start_ms INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'active',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_crash_sessions_game_status ON crash_sessions(game_id,status)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS crash_rounds (id TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),game_id TEXT NOT NULL,session_id TEXT NOT NULL,bet_amount INTEGER NOT NULL,crash_multiplier REAL NOT NULL,start_ms INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'active',cashout_multiplier REAL NOT NULL DEFAULT 0,payout INTEGER NOT NULL DEFAULT 0,settled INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_crash_user_status ON crash_rounds(user_id,status)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS tk_transactions (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),type TEXT NOT NULL,amount REAL NOT NULL,balance_after REAL NOT NULL DEFAULT 0,note TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'completed',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_tk_transactions_user_created ON tk_transactions(user_id,created_at)")
  ]);

  await env.DB.prepare("INSERT OR IGNORE INTO categories(id,name,image_url,sort_order) VALUES('hot','Hot Games','',1),('favorites','Favorites','',2),('slots','Slots','',3),('live','Live','',4),('sports','Sports','',5),('esports','E-sports','',6),('poker','Poker','',7),('fish','Fish','',8),('lottery','Lottery','',9),('mission','Mission','',10),('vip','VIP','',11),('promotion','Promotion','',12)").run();
  await env.DB.prepare("INSERT OR IGNORE INTO games(id,name,category_id,image_url,game_type,sort_order) VALUES('aviator','Aviator','hot','','aviator',1),('super-ace','Super Ace','slots','','superace',2)").run();
  await env.DB.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES('site_name','TK777'),('maintenance','false')").run();

  // Copy legacy transaction rows without changing the original table.
  const txInfo = await env.DB.prepare("PRAGMA table_info(transactions)").all();
  const txColumns = new Set((txInfo.results || []).map(row => row.name));
  if (txColumns.has("status")) {
    await env.DB.prepare("INSERT OR IGNORE INTO tk_transactions(id,user_id,type,amount,balance_after,note,status,created_at) SELECT CAST(t.id AS TEXT),t.user_id,t.type,t.amount,COALESCE(u.balance,0),'Imported legacy transaction',COALESCE(t.status,'completed'),t.created_at FROM transactions t LEFT JOIN users u ON u.id=t.user_id").run();
  } else if (txColumns.has("balance_after") && txColumns.has("note")) {
    await env.DB.prepare("INSERT OR IGNORE INTO tk_transactions(id,user_id,type,amount,balance_after,note,status,created_at) SELECT CAST(t.id AS TEXT),t.user_id,t.type,t.amount,t.balance_after,t.note,'completed',t.created_at FROM transactions t").run();
  }
  const crashInfo = await env.DB.prepare("PRAGMA table_info(crash_rounds)").all();
  const crashColumns = new Set((crashInfo.results || []).map(row => row.name));
  if (!crashColumns.has("session_id")) await env.DB.prepare("ALTER TABLE crash_rounds ADD COLUMN session_id TEXT NOT NULL DEFAULT ''").run();
  if (!crashColumns.has("start_ms")) await env.DB.prepare("ALTER TABLE crash_rounds ADD COLUMN start_ms INTEGER NOT NULL DEFAULT 0").run();
}


/* INTERNAL MESSAGES */
async function ensureInternalMessageSchema(env){await env.DB.prepare("CREATE TABLE IF NOT EXISTS internal_messages (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,title TEXT NOT NULL,body TEXT NOT NULL,type TEXT NOT NULL DEFAULT 'info',source_key TEXT UNIQUE,read_at TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();}
async function createInternalMessage(env,userId,title,body,type="info",sourceKey=null){await ensureSchemaOnce('internal_messages', ensureInternalMessageSchema, env);await env.DB.prepare("INSERT OR IGNORE INTO internal_messages(id,user_id,title,body,type,source_key) VALUES(?,?,?,?,?,?)").bind(uid(),userId,String(title||"বার্তা").slice(0,100),String(body||"").slice(0,500),String(type||"info").slice(0,30),sourceKey).run();}

/* REBATE: 1 paisa per 1 taka wagered; display amounts as demo taka */
async function ensureRebateSchema(env){
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS rebate_accounts (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,pending_paisa INTEGER NOT NULL DEFAULT 0)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS rebate_claims (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,amount_paisa INTEGER NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE TRIGGER IF NOT EXISTS rebate_on_game_round AFTER INSERT ON game_rounds WHEN NEW.bet_amount>0 BEGIN INSERT OR IGNORE INTO rebate_accounts(user_id,pending_paisa) VALUES(NEW.user_id,0); UPDATE rebate_accounts SET pending_paisa=pending_paisa+CAST(ROUND(NEW.bet_amount) AS INTEGER) WHERE user_id=NEW.user_id; END")
  ]);
  await env.DB.prepare("INSERT OR IGNORE INTO rebate_accounts(user_id,pending_paisa) SELECT user_id,CAST(ROUND(COALESCE(SUM(bet_amount),0)) AS INTEGER) FROM game_rounds GROUP BY user_id").run();
}

/* REFERRAL COINS */
async function ensureReferralSchema(env) {
  await ensureSchemaOnce('internal_messages', ensureInternalMessageSchema, env);
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS referral_codes (code TEXT PRIMARY KEY,user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS referrals (referred_user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,referrer_user_id TEXT NOT NULL REFERENCES users(id),reward_paid INTEGER NOT NULL DEFAULT 0,turnover INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS referral_milestone_claims (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,milestone INTEGER NOT NULL,amount INTEGER NOT NULL,claimed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(user_id,milestone))"),
    env.DB.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES('referral_threshold','2000'),('referral_bonus','108')")
  ]);
  try { await env.DB.prepare("ALTER TABLE referrals ADD COLUMN turnover INTEGER NOT NULL DEFAULT 0").run(); } catch (e) {}
  await env.DB.prepare("UPDATE settings SET value='2000' WHERE key='referral_threshold' AND value='200'").run();
  await env.DB.prepare("DROP TRIGGER IF EXISTS referral_reward_on_balance").run();
  await env.DB.prepare("DROP TRIGGER IF EXISTS referral_reward_on_turnover").run();
  await env.DB.prepare(`
    CREATE TRIGGER IF NOT EXISTS referral_reward_on_turnover
    AFTER INSERT ON game_rounds
    WHEN EXISTS (SELECT 1 FROM referrals WHERE referred_user_id=NEW.user_id AND reward_paid=0)
    BEGIN
      UPDATE referrals SET turnover=turnover + MAX(0,NEW.bet_amount)
      WHERE referred_user_id=NEW.user_id AND reward_paid=0;
      UPDATE referrals SET reward_paid=1
      WHERE referred_user_id=NEW.user_id AND reward_paid=0
        AND turnover >= CAST((SELECT value FROM settings WHERE key='referral_threshold') AS INTEGER);
      UPDATE users SET balance=balance + CAST((SELECT value FROM settings WHERE key='referral_bonus') AS INTEGER)
      WHERE id=(SELECT referrer_user_id FROM referrals WHERE referred_user_id=NEW.user_id
        AND reward_paid=1 AND turnover >= CAST((SELECT value FROM settings WHERE key='referral_threshold') AS INTEGER));
      INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note)
      SELECT lower(hex(randomblob(16))),u.id,'referral_bonus',
        CAST((SELECT value FROM settings WHERE key='referral_bonus') AS INTEGER),
        u.balance,'Referral reward: referred player completed game turnover'
      FROM users u WHERE u.id=(SELECT referrer_user_id FROM referrals WHERE referred_user_id=NEW.user_id
        AND reward_paid=1 AND turnover >= CAST((SELECT value FROM settings WHERE key='referral_threshold') AS INTEGER));
      INSERT OR IGNORE INTO internal_messages(id,user_id,title,body,type,source_key)
      SELECT lower(hex(randomblob(16))),NEW.user_id,'রেফারেল সম্পন্ন','আপনার রেফারেল কার্যক্রম সফলভাবে সম্পন্ন হয়েছে।','referral','referred-'||NEW.user_id
      WHERE EXISTS (SELECT 1 FROM referrals WHERE referred_user_id=NEW.user_id AND reward_paid=1);
      INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note)
      SELECT lower(hex(randomblob(16))),NEW.user_id,'referral_qualified',0,0,'Referral qualification: game turnover completed'
      WHERE EXISTS (SELECT 1 FROM referrals WHERE referred_user_id=NEW.user_id AND reward_paid=1);
    END
  `).run();
}
async function makeReferralCode(env,userId) {
  const existing=await env.DB.prepare("SELECT code FROM referral_codes WHERE user_id=?").bind(userId).first();
  if(existing)return existing.code;
  for(let i=0;i<5;i++){
    const code="TK"+uid().replace(/-/g,"").slice(0,8).toUpperCase();
    try{await env.DB.prepare("INSERT INTO referral_codes(code,user_id) VALUES(?,?)").bind(code,userId).run();return code;}catch(e){}
  }
  throw new Error("Referral code তৈরি করা যায়নি");
}


const b64 = b =>
  btoa(String.fromCharCode(...new Uint8Array(b)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

async function hash(s) {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(s));
  return [...new Uint8Array(d)]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
}

async function passHash(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    key,
    256
  );

  return [...new Uint8Array(bits)]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
}

async function currentUser(req, env) {
  const token = (req.headers.get("Authorization") || "")
    .replace(/^Bearer /, "");

  if (!token) return null;

  return await env.DB.prepare(`
    SELECT u.id,u.username,u.email,u.role,u.balance
    FROM sessions s
    JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at>?
  `).bind(await hash(token), Date.now()).first() || null;
}

async function requireAdmin(req, env) {
  const u = await currentUser(req, env);
  return u && u.role === "admin" ? u : null;
}

/* ---------------- CRASH ENGINE ---------------- */

async function finishCrashSession(env, session) {
  if (!session || session.status !== "active") return;

  const current = Math.exp(
    Math.max(0, Date.now() - Number(session.start_ms)) / 12000
  );

  if (current < Number(session.crash_multiplier)) return;

  // Ensure the rebate trigger exists before recording a settled Aviator round.
  await ensureSchemaOnce('rebate', ensureRebateSchema, env);
  await env.DB.batch([
    env.DB.prepare(`
      INSERT OR IGNORE INTO game_rounds
      (id,user_id,game_id,game_type,bet_amount,multiplier,payout)
      SELECT id,user_id,game_id,'aviator',bet_amount,crash_multiplier,0
      FROM crash_rounds
      WHERE session_id=? AND status='active'
    `).bind(session.id),

    env.DB.prepare(`
      UPDATE crash_rounds
      SET status='crashed',settled=1
      WHERE session_id=? AND status='active'
    `).bind(session.id),

    env.DB.prepare(`
      UPDATE crash_sessions
      SET status='crashed'
      WHERE id=? AND status='active'
    `).bind(session.id)
  ]);
}

async function getCrashSession(env, gameId) {
  let s = await env.DB.prepare(`
    SELECT *
    FROM crash_sessions
    WHERE game_id=? AND status='active'
    LIMIT 1
  `).bind(gameId).first();

  if (s) {
    const current = Math.exp(
      Math.max(0, Date.now() - Number(s.start_ms)) / 12000
    );

    // Do not issue another D1 read while the round is still running.
    if (current >= Number(s.crash_multiplier)) {
      await finishCrashSession(env, s);
      s = await env.DB.prepare(`
        SELECT * FROM crash_sessions WHERE id=?
      `).bind(s.id).first();
    }

    if (s && s.status === "active") return s;
  }

  const last = await env.DB.prepare(`
    SELECT *
    FROM crash_sessions
    WHERE game_id=?
    ORDER BY created_at DESC
    LIMIT 1
  `).bind(gameId).first();

  if (last && last.status === "crashed") {
    const crashAt =
      Number(last.start_ms) +
      Math.log(Number(last.crash_multiplier)) * 12000;

    if (Date.now() < crashAt + 2500) return last;
  }

  const previewRow = await env.DB.prepare(`
    SELECT value FROM settings WHERE key='aviator_next_crash_multiplier'
  `).first();
  const previewValue = Number(previewRow?.value);
  const generatedMultiplier =
    Number.isFinite(previewValue) && previewValue >= 1.01 && previewValue <= 1000
      ? Number(previewValue.toFixed(2))
      : Number((1.05 + Math.pow(rand(), 2.2) * 8.95).toFixed(2));

  const fresh = {
    id: uid(),
    game_id: gameId,
    crash_multiplier: generatedMultiplier,
    start_ms: Date.now() + 5000
  };

  try {
    const inserted = await env.DB.prepare(`
      INSERT INTO crash_sessions
      (id,game_id,crash_multiplier,start_ms,status)
      SELECT ?,?,?,?,'active'
      WHERE NOT EXISTS (
        SELECT 1 FROM crash_sessions WHERE game_id=? AND status='active'
      )
    `).bind(
      fresh.id,
      fresh.game_id,
      fresh.crash_multiplier,
      fresh.start_ms,
      gameId
    ).run();

    if (inserted.meta.changes) {
      const nextPreview = Number(
        (1.05 + Math.pow(rand(), 2.2) * 8.95).toFixed(2)
      );
      await env.DB.prepare(`
        INSERT INTO settings(key,value)
        VALUES('aviator_next_crash_multiplier',?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value
      `).bind(String(nextPreview)).run();
    }
  } catch (e) {
    // অন্য অনুরোধ ইতিমধ্যে নতুন রাউন্ড তৈরি করে থাকতে পারে।
  }

  s = await env.DB.prepare(`
    SELECT *
    FROM crash_sessions
    WHERE game_id=? AND status='active'
    LIMIT 1
  `).bind(gameId).first();

  return s || await env.DB.prepare(`
    SELECT *
    FROM crash_sessions
    WHERE game_id=?
    ORDER BY created_at DESC
    LIMIT 1
  `).bind(gameId).first();
}

async function crashState(env, gameId) {
  // getCrashSession already finalizes a round only when its crash point is reached.
  const s = await getCrashSession(env, gameId);

  if (!s) throw new Error("Crash session তৈরি করা যায়নি");

  const now = Date.now();
  const startMs = Number(s.start_ms);
  const elapsed = Math.max(0, now - startMs);

  let phase = s.status;
  let multiplier = Number(s.crash_multiplier);
  let countdownMs = 0;

  if (s.status === "active") {
    if (now < startMs) {
      phase = "countdown";
      multiplier = 1;
      countdownMs = startMs - now;
    } else {
      phase = "active";
      multiplier = Number(Math.exp(elapsed / 12000).toFixed(2));
    }
  }

  const history = await env.DB.prepare(`
    SELECT crash_multiplier,created_at
    FROM crash_sessions
    WHERE game_id=? AND status='crashed'
    ORDER BY created_at DESC
    LIMIT 25
  `).bind(gameId).all();

  return {
    sessionId: s.id,
    status: phase,
    multiplier,
    countdownMs,
    crashMultiplier: Number(s.crash_multiplier),
    startMs,
    serverNow: Date.now(),
    previous: history.results || []
  };
}

/* ---------------- MAIN ROUTES ---------------- */

async function route(req, env) {
  const url = new URL(req.url);
  const p = url.pathname;
  const method = req.method;

  if (method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  if (p.startsWith("/api/") && p !== "/api/health") await ensureSchemaOnce('legacy', ensureLegacyCompatibleSchema, env);

  if (p === "/api/health") {
    await env.DB.prepare("SELECT 1 AS ok").first();
    return json({ ok: true, site: "TK777", database: "connected" });
  }

  /* REGISTER: new accounts use mobile number + password; existing email accounts remain unchanged */

  if (p === "/api/register" && method === "POST") {
    const body = await req.json();
    let phone = String(body.phone || "").trim();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");
    phone = phone.replace(/[\s()-]/g, "");
    if (phone.startsWith("+880")) phone = "0" + phone.slice(4);
    else if (phone.startsWith("880")) phone = "0" + phone.slice(3);
    if (!/^01[3-9]\d{8}$/.test(phone)) return json({ error: "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন" }, 400);
    if (password.length < 6 || password.length > 128) return json({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে" }, 400);
    if (password !== confirmPassword) return json({ error: "পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না" }, 400);
    const salt = uid(), ph = await passHash(password, salt);
    try {
      await ensureSchemaOnce('referral', ensureReferralSchema, env);
      const referralCode = String(body.referralCode || "").trim().toUpperCase();
      let referrer = null;
      if (referralCode) {
        referrer = await env.DB.prepare("SELECT user_id FROM referral_codes WHERE code=?").bind(referralCode).first();
        if (!referrer) return json({ error: "Referral Link সঠিক নয়" }, 400);
      }
      const userInfo = await env.DB.prepare("PRAGMA table_info(users)").all();
      const idColumn = (userInfo.results || []).find(column => column.name === "id");
      let id;
      if (String(idColumn?.type || "").toUpperCase().includes("INT")) {
        const inserted = await env.DB.prepare("INSERT INTO users (username,password,email,password_hash,password_salt,balance,role) VALUES(?,'',?,?,?,0,'user')").bind(phone, phone, ph, salt).run();
        id = Number(inserted.meta?.last_row_id);
      } else {
        id = uid();
        await env.DB.prepare("INSERT INTO users (id,username,password,email,password_hash,password_salt,balance,role) VALUES(?,?,'',?,?,?,0,'user')").bind(id, phone, phone, ph, salt).run();
      }
      if (id === undefined || id === null || id === "" || (typeof id === "number" && (!Number.isSafeInteger(id) || id <= 0))) throw new Error("নতুন User ID পাওয়া যায়নি");
      await makeReferralCode(env,id);
      if(referrer && Number(referrer.user_id)!==id) await env.DB.prepare("INSERT OR IGNORE INTO referrals(referred_user_id,referrer_user_id) VALUES(?,?)").bind(id,referrer.user_id).run();
      return await loginUser(id, env);
    } catch (e) {
      const message = String(e?.message || e || "");
      console.error("TK777 registration failed", { message });
      if (/UNIQUE constraint failed: users\.(username|email)/i.test(message)) {
        return json({ error: "এই মোবাইল নম্বর দিয়ে অ্যাকাউন্ট আগে থেকেই খোলা হয়েছে" }, 409);
      }
      return json({ error: "রেজিস্ট্রেশন সম্পন্ন হয়নি। Database সংযোগ বা প্রয়োজনীয় টেবিল পরীক্ষা করতে হবে।" }, 500);
    }
  }

  if (p === "/api/login" && method === "POST") {
    const body = await req.json();
    let phone = String(body.phone || "").trim();
    const password = body.password;
    phone = phone.replace(/[\s()-]/g, "");
    if (phone.startsWith("+880")) phone = "0" + phone.slice(4);
    else if (phone.startsWith("880")) phone = "0" + phone.slice(3);
    if (!/^01[3-9]\d{8}$/.test(phone)) return json({ error: "সঠিক মোবাইল নম্বর দিন" }, 400);
    const u = await env.DB.prepare("SELECT * FROM users WHERE email=? OR username=?").bind(phone, phone).first();
    if (!u || typeof password !== "string" || password.length > 128) {
      return json({ error: "লগইন তথ্য সঠিক নয়" }, 401);
    }
    const hasModernHash = typeof u.password_hash === "string" && !!u.password_hash && typeof u.password_salt === "string" && !!u.password_salt;
    const validPassword = hasModernHash
      ? await passHash(password, u.password_salt) === u.password_hash
      : String(u.password || "") === password;
    if (!validPassword) return json({ error: "লগইন তথ্য সঠিক নয়" }, 401);
    if (!hasModernHash) {
      const salt = uid();
      const passwordHash = await passHash(password, salt);
      await env.DB.prepare("UPDATE users SET password_hash=?,password_salt=?,password='' WHERE id=?").bind(passwordHash, salt, u.id).run();
    }
    return await loginUser(u.id, env);
  }

  /* ADMIN BOOTSTRAP */

  if (p === "/api/admin/bootstrap" && method === "POST") {
    if (!env.ADMIN_PASSWORD || !env.ADMIN_EMAIL) {
      return json({ error: "ADMIN_EMAIL এবং ADMIN_PASSWORD secrets configure করুন" }, 400);
    }
    const adminEmail = String(env.ADMIN_EMAIL).trim().toLowerCase();
    const { email, password, username } = await req.json();

    if (!adminEmail || String(email || "").trim().toLowerCase() !== adminEmail ||
        password !== env.ADMIN_PASSWORD) {
      return json({ error: "অনুমোদন হয়নি" }, 403);
    }

    // Reuse the existing admin account so its ID, balance and related records remain intact.
    const emailOwner = await env.DB.prepare(
      "SELECT id,role FROM users WHERE lower(email)=? LIMIT 1"
    ).bind(adminEmail).first();

    let u = await env.DB.prepare(
      "SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1"
    ).first();

    if (emailOwner && (!u || String(emailOwner.id) !== String(u.id)) && emailOwner.role !== "admin") {
      return json({ error: "এই Email অন্য একটি User account-এ ব্যবহৃত হচ্ছে। আগে আলাদা Email দিন।" }, 409);
    }

    const salt = uid();
    const ph = await passHash(password, salt);

    if (u) {
      await env.DB.prepare(`
        UPDATE users
        SET email=?,password_hash=?,password_salt=?,password='',role='admin'
        WHERE id=?
      `).bind(adminEmail, ph, salt, u.id).run();
    } else if (emailOwner && emailOwner.role === "admin") {
      u = { id: emailOwner.id };
      await env.DB.prepare(`
        UPDATE users
        SET password_hash=?,password_salt=?,password='',role='admin'
        WHERE id=?
      `).bind(ph, salt, u.id).run();
    } else {
      const userInfo = await env.DB.prepare("PRAGMA table_info(users)").all();
      const idColumn = (userInfo.results || []).find(column => column.name === "id");
      let id;
      if (String(idColumn?.type || "").toUpperCase().includes("INT")) {
        const inserted = await env.DB.prepare(`
          INSERT INTO users
          (username,password,email,password_hash,password_salt,balance,role)
          VALUES(?,'',?,?,?,0,'admin')
        `).bind(username || "tk777admin", adminEmail, ph, salt).run();
        id = Number(inserted.meta?.last_row_id);
      } else {
        id = uid();
        await env.DB.prepare(`
          INSERT INTO users
          (id,username,password,email,password_hash,password_salt,balance,role)
          VALUES(?,?,'',?,?,?,0,'admin')
        `).bind(id, username || "tk777admin", adminEmail, ph, salt).run();
      }
      if (id === undefined || id === null || id === "" || (typeof id === "number" && (!Number.isSafeInteger(id) || id <= 0))) throw new Error("Admin User ID পাওয়া যায়নি");
      u = { id };
    }

    // Revoke previous sessions for this admin after credential rotation.
    await env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(u.id).run();
    return await loginUser(u.id, env);
  }

  /* AUTHENTICATED API */

  if (p.startsWith("/api/")) {
    const user = await currentUser(req, env);
    const admin = () => requireAdmin(req, env);


    if(p==="/api/rebate"&&method==="GET"){
      if(!user)return json({error:"লগইন করুন"},401);
      await ensureSchemaOnce('rebate', ensureRebateSchema, env);
      const row=await env.DB.prepare("SELECT pending_paisa FROM rebate_accounts WHERE user_id=?").bind(user.id).first();
      const sums=await env.DB.prepare("SELECT COALESCE(SUM(amount_paisa),0) AS claimed_paisa FROM rebate_claims WHERE user_id=?").bind(user.id).first();
      const balance=await env.DB.prepare("SELECT balance FROM users WHERE id=?").bind(user.id).first();
      const pending=Number(row?.pending_paisa||0),claimed=Number(sums?.claimed_paisa||0);
      return json({pending:pending/100,earned:(pending+claimed)/100,claimed:claimed/100,balance:Number(balance?.balance||0)});
    }
    if(p==="/api/rebate/claim"&&method==="POST"){
      if(!user)return json({error:"লগইন করুন"},401);
      await ensureSchemaOnce('rebate', ensureRebateSchema, env);
      const claimId=uid();
      const result=await env.DB.batch([
        env.DB.prepare("INSERT INTO rebate_claims(id,user_id,amount_paisa) SELECT ?,user_id,pending_paisa FROM rebate_accounts WHERE user_id=? AND pending_paisa>0").bind(claimId,user.id),
        env.DB.prepare("UPDATE rebate_accounts SET pending_paisa=0 WHERE user_id=? AND EXISTS(SELECT 1 FROM rebate_claims WHERE id=? AND user_id=?)").bind(user.id,claimId,user.id),
        env.DB.prepare("UPDATE users SET balance=balance+(SELECT amount_paisa/100.0 FROM rebate_claims WHERE id=? AND user_id=?) WHERE id=? AND EXISTS(SELECT 1 FROM rebate_claims WHERE id=? AND user_id=?)").bind(claimId,user.id,user.id,claimId,user.id),
        env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) SELECT ?,?, 'rebate_bonus',amount_paisa/100.0,(SELECT balance FROM users WHERE id=?),'Rebate claimed' FROM rebate_claims WHERE id=? AND user_id=?").bind(uid(),user.id,user.id,claimId,user.id)
      ]);
      const claim=await env.DB.prepare("SELECT amount_paisa FROM rebate_claims WHERE id=? AND user_id=?").bind(claimId,user.id).first();
      if(!claim)return json({error:"ক্লেইম করার মতো রিবেট এখনো জমা হয়নি"},400);
      const balance=await env.DB.prepare("SELECT balance FROM users WHERE id=?").bind(user.id).first();
      return json({ok:true,amount:Number(claim.amount_paisa)/100,balance:Number(balance?.balance||0)});
    }
    if(p==="/api/messages"&&method==="GET"){
      if(!user)return json({error:"লগইন করুন"},401);
      await ensureSchemaOnce('internal_messages', ensureInternalMessageSchema, env);
      const tx=await env.DB.prepare("SELECT id,type,amount,note FROM tk_transactions WHERE user_id=? AND type IN ('coin_bonus','referral_bonus','referral_milestone_bonus','admin_adjustment','admin_balance_set','bonus','new_user_bonus','mission_bonus','withdrawal_refund') ORDER BY created_at DESC LIMIT 100").bind(user.id).all();
      for(const t of(tx.results||[])){
        const n=Number(t.amount||0),reason=String(t.note||"");let title="অ্যাকাউন্ট আপডেট",body=reason||"আপনার অ্যাকাউন্টে পরিবর্তন হয়েছে।",type="info";
        if(["referral_bonus","referral_milestone_bonus"].includes(t.type)){title="রেফারেল বোনাস";body=n+" টাকা বোনাস যোগ হয়েছে। "+reason;type="bonus";}
        else if(["coin_bonus","bonus","new_user_bonus","mission_bonus"].includes(t.type)){title="বোনাস পেয়েছেন";body=n+" টাকা বোনাস যোগ হয়েছে। "+reason;type="bonus";}
        else if(["admin_adjustment","admin_balance_set"].includes(t.type)){title="অ্যাডমিন ব্যালেন্স আপডেট";body=(n>=0?"+":"")+n+" টাকা ব্যালেন্স পরিবর্তন হয়েছে। কারণ: "+reason;type="balance";}
        else if(t.type==="withdrawal_refund"){title="উইথড্র রিফান্ড";body=n+" টাকা ব্যালেন্সে ফেরত দেওয়া হয়েছে।";type="balance";}
        await createInternalMessage(env,user.id,title,body,type,"transaction-"+t.id);
      }
      const rows=await env.DB.prepare("SELECT id,title,body,type,created_at,read_at FROM internal_messages WHERE user_id=? ORDER BY created_at DESC LIMIT 100").bind(user.id).all();
      const unread=await env.DB.prepare("SELECT COUNT(*) AS count FROM internal_messages WHERE user_id=? AND read_at IS NULL").bind(user.id).first();
      return json({messages:rows.results||[],unread:Number(unread?.count||0)});
    }
    if(p==="/api/messages/read"&&method==="POST"){
      if(!user)return json({error:"লগইন করুন"},401);
      await ensureSchemaOnce('internal_messages', ensureInternalMessageSchema, env);
      await env.DB.prepare("UPDATE internal_messages SET read_at=CURRENT_TIMESTAMP WHERE user_id=? AND read_at IS NULL").bind(user.id).run();
      return json({ok:true,unread:0});
    }
    if (p === "/api/referral" && method === "GET") {
      if (!user) return json({ error: "লগইন করুন" }, 401);
      await ensureSchemaOnce('referral', ensureReferralSchema, env);
      const code=await makeReferralCode(env,user.id);
      const stats=await env.DB.prepare("SELECT COUNT(*) AS total,SUM(CASE WHEN reward_paid=1 THEN 1 ELSE 0 END) AS qualified FROM referrals WHERE referrer_user_id=?").bind(user.id).first();
      const rewards=await env.DB.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM tk_transactions WHERE user_id=? AND type IN ('referral_bonus','referral_milestone_bonus')").bind(user.id).first();
      const config=await env.DB.prepare("SELECT key,value FROM settings WHERE key IN ('referral_threshold','referral_bonus')").all();
      const values=Object.fromEntries((config.results||[]).map(x=>[x.key,Number(x.value)]));
      const progress=await env.DB.prepare("SELECT COALESCE(SUM(turnover),0) AS turnover FROM referrals WHERE referrer_user_id=?").bind(user.id).first();
      const claimed=await env.DB.prepare("SELECT milestone FROM referral_milestone_claims WHERE user_id=?").bind(user.id).all();
      const claimedSet=new Set((claimed.results||[]).map(x=>Number(x.milestone)));
      const qualified=Number(stats?.qualified||0);
      const milestones=Array.from({length:12},(_,i)=>({milestone:i+1,amount:108+i*200,claimed:claimedSet.has(i+1),available:qualified>=i+1}));
      return json({code,total:Number(stats?.total||0),qualified,earned:Number(rewards?.total||0),turnover:Number(progress?.turnover||0),threshold:values.referral_threshold||2000,bonus:values.referral_bonus||108,milestones});
    }
    if (p === "/api/referral/claim" && method === "POST") {
      if (!user) return json({ error: "লগইন করুন" }, 401);
      await ensureSchemaOnce('referral', ensureReferralSchema, env);
      const body=await req.json(),milestone=Number(body.milestone);
      if(!Number.isInteger(milestone)||milestone<1||milestone>12)return json({error:"সঠিক বোনাস ধাপ নির্বাচন করুন"},400);
      const amount=108+(milestone-1)*200;
      const result=await env.DB.batch([
        env.DB.prepare("INSERT OR IGNORE INTO referral_milestone_claims(user_id,milestone,amount) SELECT ?,?,? WHERE (SELECT COUNT(*) FROM referrals WHERE referrer_user_id=? AND reward_paid=1)>=?").bind(user.id,milestone,amount,user.id,milestone),
        env.DB.prepare("UPDATE users SET balance=balance+? WHERE id=? AND changes()=1").bind(amount,user.id),
        env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) SELECT lower(hex(randomblob(16))),?, 'referral_milestone_bonus', ?, balance, ? FROM users WHERE id=? AND changes()=1").bind(user.id,amount,"Referral milestone "+milestone+" bonus",user.id)
      ]);
      const claimed=await env.DB.prepare("SELECT amount FROM referral_milestone_claims WHERE user_id=? AND milestone=?").bind(user.id,milestone).first();
      if(!claimed)return json({error:"এই বোনাস পাওয়ার জন্য আরও সফল রেফার প্রয়োজন"},400);
      const inserted=Number(result?.[0]?.meta?.changes||0)===1;
      if(inserted) await createInternalMessage(env,user.id,"রেফারেল বোনাস পেয়েছেন",milestone+" জন সফল রেফারের জন্য "+Number(claimed.amount)+" টাকা বোনাস যোগ হয়েছে।","bonus","referral-milestone-"+milestone+"-"+user.id);
      return json({ok:true,claimed:inserted,amount:Number(claimed.amount),message:inserted?"বোনাস সফলভাবে যোগ হয়েছে":"এই বোনাস আগেই ক্লেইম করা হয়েছে"});
    }
    if (p === "/api/admin/referral-settings" && method === "GET") {
      if (!await admin()) return json({error:"Admin access প্রয়োজন"},403);
      await ensureSchemaOnce('referral', ensureReferralSchema, env);
      const rows=await env.DB.prepare("SELECT key,value FROM settings WHERE key IN ('referral_threshold','referral_bonus')").all();
      const values=Object.fromEntries((rows.results||[]).map(x=>[x.key,Number(x.value)]));
      return json({threshold:values.referral_threshold||2000,bonus:values.referral_bonus||108});
    }
    if (p === "/api/admin/referral-settings" && method === "POST") {
      if (!await admin()) return json({error:"Admin access প্রয়োজন"},403);
      await ensureSchemaOnce('referral', ensureReferralSchema, env);
      const body=await req.json(),threshold=Number(body.threshold),bonus=Number(body.bonus);
      if(!Number.isSafeInteger(threshold)||threshold<1||threshold>1000000||!Number.isSafeInteger(bonus)||bonus<1||bonus>1000000)return json({error:"সঠিক পূর্ণসংখ্যার Coin পরিমাণ দিন"},400);
      await env.DB.batch([
        env.DB.prepare("INSERT INTO settings(key,value) VALUES('referral_threshold',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(String(threshold)),
        env.DB.prepare("INSERT INTO settings(key,value) VALUES('referral_bonus',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(String(bonus))
      ]);
      return json({ok:true,threshold,bonus});
    }

    if (p === "/api/demo-deposits" && method === "GET" && user) {
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS demo_deposits (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,method TEXT NOT NULL,amount INTEGER NOT NULL,demo_reference TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
      const rows = await env.DB.prepare("SELECT id,method,amount,demo_reference,status,created_at FROM demo_deposits WHERE user_id=? ORDER BY created_at DESC LIMIT 30").bind(user.id).all();
      return json({ requests: rows.results || [] });
    }

    if (p === "/api/demo-deposits" && method === "POST") {
      if (!user) return json({ error: "লগইন করুন" }, 401);
      const body = await req.json();
      const methodName = String(body.method || "");
      const amount = Number(body.amount);
      const ref = String(body.demo_reference || "");
      if (!["bKash", "Nagad", "Rocket"].includes(methodName) || !Number.isSafeInteger(amount) || amount < 1 || amount > 1000000 || !/^[A-Za-z0-9_-]{3,80}$/.test(ref)) {
        return json({ error: "সঠিক ডিপজিট তথ্য দিন" }, 400);
      }
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS demo_deposits (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,method TEXT NOT NULL,amount INTEGER NOT NULL,demo_reference TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
      await env.DB.prepare("INSERT INTO demo_deposits(id,user_id,method,amount,demo_reference) VALUES(?,?,?,?,?)").bind(uid(), user.id, methodName, amount, ref).run();
      return json({ ok: true });
    }

    if (p === "/api/withdraw-requests" && method === "GET" && user) {
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS demo_withdrawals (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,method TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      try {
        await env.DB.prepare("ALTER TABLE demo_withdrawals ADD COLUMN coin_reserved INTEGER NOT NULL DEFAULT 0").run();
      } catch (e) {}
      try {
        await env.DB.prepare("ALTER TABLE demo_withdrawals ADD COLUMN wallet_number TEXT NOT NULL DEFAULT ''").run();
      } catch (e) {}
      const rows = await env.DB.prepare("SELECT id,method,amount,wallet_number,status,created_at FROM demo_withdrawals WHERE user_id=? ORDER BY created_at DESC LIMIT 30").bind(user.id).all();
      return json({ requests: rows.results || [] });
    }

    if (p === "/api/withdraw-requests" && method === "POST") {
      if (!user) return json({ error: "লগইন করুন" }, 401);
      const body = await req.json();
      const methodName = String(body.method || "").replace(/^Demo\s+/i, "");
      const amount = Number(body.amount);
      await env.DB.prepare("ALTER TABLE users ADD COLUMN wallet_number TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      const savedWallet=await env.DB.prepare("SELECT wallet_number FROM users WHERE id=?").bind(user.id).first();
      const walletNumber=String(savedWallet?.wallet_number||"");
      if(!walletNumber)return json({error:"আগে ওয়ালেট নম্বর একবার সেট করুন"},400);
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_hash TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_salt TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_attempts INTEGER NOT NULL DEFAULT 0").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_locked_until INTEGER NOT NULL DEFAULT 0").run().catch(() => {});
      const passRow=await env.DB.prepare("SELECT withdraw_password_hash,withdraw_password_salt,withdraw_password_attempts,withdraw_password_locked_until FROM users WHERE id=?").bind(user.id).first();
      if(!passRow?.withdraw_password_hash)return json({error:"আগে ৬ সংখ্যার উইথড্র পাসওয়ার্ড সেট করুন"},400);
      if(Number(passRow.withdraw_password_locked_until||0)>Date.now())return json({error:"অনেকবার ভুল পাসওয়ার্ড দেওয়া হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।"},429);
      const withdrawPassword=String(body.withdrawPassword||"");
      if(!/^\d{6}$/.test(withdrawPassword))return json({error:"সঠিক ৬ সংখ্যার উইথড্র পাসওয়ার্ড দিন"},400);
      const candidateHash=await passHash(withdrawPassword,String(passRow.withdraw_password_salt||""));
      if(candidateHash!==String(passRow.withdraw_password_hash)){
        await env.DB.prepare("UPDATE users SET withdraw_password_attempts=withdraw_password_attempts+1,withdraw_password_locked_until=CASE WHEN withdraw_password_attempts+1>=5 THEN ? ELSE withdraw_password_locked_until END WHERE id=?").bind(Date.now()+15*60*1000,user.id).run();
        return json({error:"উইথড্র পাসওয়ার্ড সঠিক নয়।"},401);
      }
      await env.DB.prepare("UPDATE users SET withdraw_password_attempts=0,withdraw_password_locked_until=0 WHERE id=?").bind(user.id).run();
      if (!["bKash", "Nagad", "Rocket"].includes(methodName) || !Number.isSafeInteger(amount) || amount < 1 || amount > 10000000) {
        return json({ error: "সঠিক Withdrawal তথ্য দিন" }, 400);
      }
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS demo_withdrawals (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,method TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      try {
        await env.DB.prepare("ALTER TABLE demo_withdrawals ADD COLUMN coin_reserved INTEGER NOT NULL DEFAULT 0").run();
      } catch (e) {}
      try {
        await env.DB.prepare("ALTER TABLE demo_withdrawals ADD COLUMN wallet_number TEXT NOT NULL DEFAULT ''").run();
      } catch (e) {}
      const requestId = uid();
      const reserved = await env.DB.batch([
        env.DB.prepare("UPDATE users SET balance=balance-? WHERE id=? AND balance>=? AND NOT EXISTS (SELECT 1 FROM demo_withdrawals WHERE user_id=? AND status='pending')").bind(amount, user.id, amount, user.id),
        env.DB.prepare("INSERT INTO demo_withdrawals(id,user_id,method,amount,wallet_number,status,coin_reserved) SELECT ?,?,?,?,?, 'pending',1 WHERE changes()=1").bind(requestId, user.id, methodName, amount, walletNumber),
        env.DB.prepare("SELECT changes() AS inserted")
      ]);
      if (Number(reserved[2]?.results?.[0]?.inserted) !== 1) {
        const pending = await env.DB.prepare("SELECT id FROM demo_withdrawals WHERE user_id=? AND status='pending' LIMIT 1").bind(user.id).first();
        if (pending) return json({ error: "আপনার একটি Withdrawal Request এখনো Pending আছে" }, 409);
        return json({ error: "পর্যাপ্ত কয়েন নেই" }, 400);
      }
      const after = await env.DB.prepare("SELECT balance FROM users WHERE id=?").bind(user.id).first();
      await env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) VALUES(?,?,?,?,?,?)").bind(uid(), user.id, "withdrawal_hold", -amount, after.balance, "Coin reserved on withdrawal request").run();
      return json({ ok: true, balance: after.balance });
    }

    if (p === "/api/coin-requests" && method === "GET" && user) {
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS coin_requests (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      const rows = await env.DB.prepare("SELECT id,amount,status,created_at FROM coin_requests WHERE user_id=? ORDER BY created_at DESC LIMIT 30").bind(user.id).all();
      return json({ requests: rows.results || [] });
    }

    if (p === "/api/coin-requests" && method === "POST") {
      if (!user) return json({ error: "লগইন করুন" }, 401);
      const body = await req.json();
      const amount = Number(body.amount);
      if (![100, 200, 300, 500, 1000].includes(amount)) {
        return json({ error: "সঠিক কয়েন পরিমাণ নির্বাচন করুন" }, 400);
      }
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS coin_requests (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      const pending = await env.DB.prepare("SELECT id FROM coin_requests WHERE user_id=? AND status='pending' LIMIT 1").bind(user.id).first();
      if (pending) return json({ error: "আপনার একটি Request এখনো Pending আছে" }, 409);
      await env.DB.prepare("INSERT INTO coin_requests(id,user_id,amount,status) VALUES(?,?,?,'pending')").bind(uid(), user.id, amount).run();
      return json({ ok: true });
    }


    if (p === "/api/bank-accounts" && method === "GET") {
      if (!user) return json({ error: "লগইন করুন" }, 401);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS bank_accounts (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,slot INTEGER NOT NULL,method TEXT NOT NULL,number TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(user_id,slot))").run();
      const rows=await env.DB.prepare("SELECT method,number,slot FROM bank_accounts WHERE user_id=? ORDER BY slot ASC").bind(user.id).all();
      return json({accounts:rows.results||[]});
    }
    if (p === "/api/bank-accounts" && method === "POST") {
      if (!user) return json({ error: "লগইন করুন" }, 401);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS bank_accounts (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,slot INTEGER NOT NULL,method TEXT NOT NULL,number TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(user_id,slot))").run();
      const body=await req.json(),methodName=String(body.method||""),number=String(body.number||"").replace(/\D/g,"");
      if(!["bKash","Nagad","Rocket"].includes(methodName)||!/^01[3-9]\d{8}$/.test(number))return json({error:"সঠিক পেমেন্ট পদ্ধতি ও ১১ সংখ্যার নম্বর দিন"},400);
      const result=await env.DB.prepare("INSERT INTO bank_accounts(id,user_id,slot,method,number) SELECT ?,?,COALESCE(MAX(slot),0)+1,?,? FROM bank_accounts WHERE user_id=? HAVING COUNT(*)<5").bind(uid(),user.id,methodName,number,user.id).run();
      if(!result.meta?.changes)return json({error:"সর্বোচ্চ ৫টি নম্বর যোগ করা যাবে"},409);
      const rows=await env.DB.prepare("SELECT method,number,slot FROM bank_accounts WHERE user_id=? ORDER BY slot ASC").bind(user.id).all();
      return json({ok:true,accounts:rows.results||[]});
    }

    if (p === "/api/me") {
      return user
        ? json({ user })
        : json({ error: "লগইন করুন" }, 401);
    }
    if (p === "/api/account/profile" && user && method === "GET") {
      for (const [c,d] of [["display_name","TEXT NOT NULL DEFAULT ''"],["gmail","TEXT NOT NULL DEFAULT ''"]]) await env.DB.prepare("ALTER TABLE users ADD COLUMN "+c+" "+d).run().catch(()=>{});
      const profile=await env.DB.prepare("SELECT username,display_name,gmail FROM users WHERE id=?").bind(user.id).first();
      const totals=await env.DB.prepare("SELECT COALESCE(SUM(bet_amount),0) AS turnover FROM game_rounds WHERE user_id=?").bind(user.id).first();
      const turnover=Number(totals?.turnover||0),gmail=String(profile?.gmail||"");
      return json({profile:{phone:profile?.username||"",display_name:profile?.display_name||"",gmail_masked:gmail?"***"+gmail.slice(-3):"",turnover,vip_level:Math.floor(turnover/2000)}});
    }
    if (p === "/api/security/profile" && user && method === "GET") {
      for (const [c,d] of [["display_name","TEXT NOT NULL DEFAULT ''"],["whatsapp_number","TEXT NOT NULL DEFAULT ''"],["facebook_url","TEXT NOT NULL DEFAULT ''"],["gmail","TEXT NOT NULL DEFAULT ''"]]) await env.DB.prepare("ALTER TABLE users ADD COLUMN "+c+" "+d).run().catch(()=>{});
      const profile=await env.DB.prepare("SELECT display_name,whatsapp_number,facebook_url,gmail FROM users WHERE id=?").bind(user.id).first();
      const contactsSaved=!!(profile?.whatsapp_number&&profile?.facebook_url&&profile?.gmail);
      if(contactsSaved)profile.gmail_masked="***"+String(profile.gmail).slice(-3);
      delete profile.gmail;
      return json({profile:profile||{},contactsSaved});
    }
    if (p === "/api/security/profile" && user && method === "POST") {
      for (const [c,d] of [["display_name","TEXT NOT NULL DEFAULT ''"],["whatsapp_number","TEXT NOT NULL DEFAULT ''"],["facebook_url","TEXT NOT NULL DEFAULT ''"],["gmail","TEXT NOT NULL DEFAULT ''"]]) await env.DB.prepare("ALTER TABLE users ADD COLUMN "+c+" "+d).run().catch(()=>{});
      const b=await req.json(),n=String(b.displayName||"").trim().slice(0,60),w=String(b.whatsapp||"").trim(),f=String(b.facebook||"").trim(),g=String(b.gmail||"").trim();
      const old=await env.DB.prepare("SELECT display_name,whatsapp_number,facebook_url,gmail FROM users WHERE id=?").bind(user.id).first();
      if(n&&n.length<2)return json({error:"নাম কমপক্ষে ২ অক্ষরের হতে হবে"},400);
      if(w&&(w.length<8||w.length>20))return json({error:"সঠিক WhatsApp নম্বর দিন"},400);
      if(f&&(!(f.startsWith("https://facebook.com/")||f.startsWith("https://www.facebook.com/")||f.startsWith("https://fb.com/"))||f.length>250))return json({error:"সঠিক Facebook https লিংক দিন"},400);
      if(g&&(!g.toLowerCase().endsWith("@gmail.com")||!g.includes("@")||g.length>254))return json({error:"সঠিক Gmail ঠিকানা দিন"},400);
      if(n&&old?.display_name&&n!==old.display_name)return json({error:"নাম একবার সেভ হলে নিজে পরিবর্তন করা যাবে না"},409);
      if(w||f||g){if(old?.whatsapp_number||old?.facebook_url||old?.gmail)return json({error:"যোগাযোগের তথ্য একবার সেভ হলে আর পরিবর্তন করা যাবে না"},409);if(!w||!f||!g)return json({error:"WhatsApp, Facebook লিংক ও Gmail—তিনটিই পূরণ করুন"},400);await env.DB.prepare("UPDATE users SET whatsapp_number=?,facebook_url=?,gmail=? WHERE id=?").bind(w,f,g,user.id).run();}
      if(n&&!old?.display_name)await env.DB.prepare("UPDATE users SET display_name=? WHERE id=?").bind(n,user.id).run();
      const profile=await env.DB.prepare("SELECT display_name,whatsapp_number,facebook_url FROM users WHERE id=?").bind(user.id).first();const fullGmail=old?.gmail||g;profile.gmail_masked=fullGmail?"***"+String(fullGmail).slice(-3):"";
      return json({ok:true,profile});
    }
    if (p === "/api/security/password" && user && method === "POST") {
      const b=await req.json(),old=String(b.oldPassword||""),next=String(b.newPassword||"");if(!old||next.length<6||next.length>128)return json({error:"পুরোনো পাসওয়ার্ড ও ৬–১২৮ অক্ষরের নতুন পাসওয়ার্ড দিন"},400);
      const row=await env.DB.prepare("SELECT password_hash,password_salt FROM users WHERE id=?").bind(user.id).first();if(!row||await passHash(old,row.password_salt)!==row.password_hash)return json({error:"পুরোনো পাসওয়ার্ড সঠিক নয়"},401);
      const salt=uid(),ph=await passHash(next,salt);await env.DB.prepare("UPDATE users SET password_hash=?,password_salt=? WHERE id=?").bind(ph,salt,user.id).run();
      const t=(req.headers.get("Authorization")||"").replace(/^Bearer /,"");if(t)await env.DB.prepare("DELETE FROM sessions WHERE user_id=? AND token_hash!=?").bind(user.id,await hash(t)).run();return json({ok:true,message:"লগইন পাসওয়ার্ড পরিবর্তন হয়েছে।"});
    }
    if (p === "/api/security/withdraw-password" && user && method === "POST") {
      for (const [c,d] of [["withdraw_password_hash","TEXT NOT NULL DEFAULT ''"],["withdraw_password_salt","TEXT NOT NULL DEFAULT ''"],["withdraw_password_attempts","INTEGER NOT NULL DEFAULT 0"],["withdraw_password_locked_until","INTEGER NOT NULL DEFAULT 0"]]) await env.DB.prepare("ALTER TABLE users ADD COLUMN "+c+" "+d).run().catch(()=>{});
      const b=await req.json(),old=String(b.oldPassword||""),next=String(b.newPassword||"");if(!/^[0-9]{6}$/.test(old)||!/^[0-9]{6}$/.test(next))return json({error:"বর্তমান ও নতুন ৬ সংখ্যার পাসওয়ার্ড দিন"},400);
      const row=await env.DB.prepare("SELECT withdraw_password_hash,withdraw_password_salt,withdraw_password_locked_until FROM users WHERE id=?").bind(user.id).first();if(!row?.withdraw_password_hash)return json({error:"আগে Withdrawal পেজ থেকে একটি উইথড্র পাসওয়ার্ড সেট করুন"},400);
      if(Number(row.withdraw_password_locked_until||0)>Date.now())return json({error:"অনেকবার ভুল হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।"},429);
      if(await passHash(old,String(row.withdraw_password_salt||""))!==String(row.withdraw_password_hash)){await env.DB.prepare("UPDATE users SET withdraw_password_attempts=withdraw_password_attempts+1,withdraw_password_locked_until=CASE WHEN withdraw_password_attempts+1>=5 THEN ? ELSE withdraw_password_locked_until END WHERE id=?").bind(Date.now()+15*60*1000,user.id).run();return json({error:"বর্তমান উইথড্র পাসওয়ার্ড সঠিক নয়"},401);}
      const salt=uid(),ph=await passHash(next,salt);await env.DB.prepare("UPDATE users SET withdraw_password_hash=?,withdraw_password_salt=?,withdraw_password_attempts=0,withdraw_password_locked_until=0 WHERE id=?").bind(ph,salt,user.id).run();return json({ok:true,message:"উইথড্র পাসওয়ার্ড পরিবর্তন হয়েছে।"});
    }

    if (p === "/api/wallet-number" && user && (method === "GET" || method === "POST")) {
      await env.DB.prepare("ALTER TABLE users ADD COLUMN wallet_number TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      if(method === "GET"){
        const row=await env.DB.prepare("SELECT wallet_number FROM users WHERE id=?").bind(user.id).first();
        return json({walletNumber:String(row?.wallet_number||"")});
      }
      const body=await req.json(),walletNumber=String(body.walletNumber||"").trim();
      if(!/^[0-9+ -]{8,20}$/.test(walletNumber))return json({error:"সঠিক ওয়ালেট নম্বর লিখুন"},400);
      const saved=await env.DB.prepare("UPDATE users SET wallet_number=? WHERE id=? AND (wallet_number IS NULL OR wallet_number='')").bind(walletNumber,user.id).run();
      if(!saved.meta?.changes)return json({error:"নম্বর আগে থেকেই সেট করা আছে। পরিবর্তনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।"},409);
      return json({ok:true,walletNumber});
    }
    if (p === "/api/withdraw-password/status" && user && method === "GET") {
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_hash TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_salt TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_attempts INTEGER NOT NULL DEFAULT 0").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_locked_until INTEGER NOT NULL DEFAULT 0").run().catch(() => {});
      const row=await env.DB.prepare("SELECT withdraw_password_hash FROM users WHERE id=?").bind(user.id).first();
      return json({passwordSet:!!row?.withdraw_password_hash});
    }
    if (p === "/api/withdraw-password/set" && user && method === "POST") {
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_hash TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_salt TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_attempts INTEGER NOT NULL DEFAULT 0").run().catch(() => {});
      await env.DB.prepare("ALTER TABLE users ADD COLUMN withdraw_password_locked_until INTEGER NOT NULL DEFAULT 0").run().catch(() => {});
      const body=await req.json(),password=String(body.password||"");
      if(!/^\d{6}$/.test(password))return json({error:"ঠিক ৬ সংখ্যার পাসওয়ার্ড দিন"},400);
      const existing=await env.DB.prepare("SELECT withdraw_password_hash FROM users WHERE id=?").bind(user.id).first();
      if(existing?.withdraw_password_hash)return json({error:"উইথড্র পাসওয়ার্ড আগে থেকেই সেট করা আছে।"},409);
      const salt=uid(),passwordHash=await passHash(password,salt);
      await env.DB.prepare("UPDATE users SET withdraw_password_hash=?,withdraw_password_salt=? WHERE id=? AND (withdraw_password_hash IS NULL OR withdraw_password_hash='')").bind(passwordHash,salt,user.id).run();
      const savedCheck=await env.DB.prepare("SELECT withdraw_password_hash FROM users WHERE id=?").bind(user.id).first();
      if(!savedCheck?.withdraw_password_hash)return json({error:"পাসওয়ার্ড সেভ হয়নি। আবার চেষ্টা করুন।"},500);
      return json({ok:true,passwordSet:true});
    }

    if (p === "/api/logout" && method === "POST") {
      const token = (req.headers.get("Authorization") || "")
        .replace(/^Bearer /, "");

      if (token) {
        await env.DB.prepare(`
          DELETE FROM sessions WHERE token_hash=?
        `).bind(await hash(token)).run();
      }

      return json({ ok: true });
    }

    if (p === "/api/slot-display-images" && method === "GET") {
      const rows = await env.DB.prepare("SELECT key,value FROM settings WHERE key LIKE 'slot_display_image_%' OR key IN ('slot_display_hidden','game_name_overrides')").all();
      const images = {};
      let hiddenIds = [];
      for (const row of (rows.results || [])) {
        if (row.key === "slot_display_hidden") {
          try {
            hiddenIds = JSON.parse(String(row.value || "[]"));
          } catch {
            hiddenIds = [];
          }
          continue;
        }
        const id = String(row.key).replace(/^slot_display_image_/, "");
        const urlVal = String(row.value || "").trim();
        if (/^https:\/\//i.test(urlVal)) images[id] = urlVal;
      }
      let nameOverrides = {};
      const nameRow = (rows.results || []).find(r => r.key === "game_name_overrides");
      try {
        nameOverrides = JSON.parse(String(nameRow?.value || "{}"));
      } catch {
        nameOverrides = {};
      }
      return json({
        images,
        hiddenIds: Array.isArray(hiddenIds) ? hiddenIds.filter(x => typeof x === "string") : [],
        nameOverrides
      });
    }

    if (p === "/api/support-settings" && method === "GET") {
      const rows = await env.DB.prepare(
        "SELECT key,value FROM settings WHERE key IN ('support_telegram_username','support_telegram_image_url','payment_image_bkash','payment_image_nagad','payment_image_rocket','demo_payment_image_bkash','demo_payment_image_nagad','demo_payment_image_rocket','withdraw_button_image_bkash','withdraw_button_image_nagad','withdraw_button_image_rocket','display_number','number_bkash','number_nagad','number_rocket','demo_number_bkash','demo_number_nagad','demo_number_rocket','withdraw_ids_bkash','withdraw_ids_nagad','withdraw_ids_rocket','deposit_content','withdraw_content')"
      ).all();
      const values = Object.fromEntries((rows.results || []).map(r => [r.key, r.value]));
      const image = String(values.support_telegram_image_url || "");
      const validImage = key => /^https:\/\//i.test(String(values[key] || "")) ? String(values[key]) : "";
      const displayNumber = /^01[3-9][0-9]{8}$/.test(String(values.display_number || ""))
        ? String(values.display_number)
        : "01790365006";
      const validNumber = (key, fallback) =>
        /^\d{11}$/.test(String(values[key] || "")) ? String(values[key]) : fallback;

      return json({
        telegram_username: String(values.support_telegram_username || ""),
        telegram_image_url: /^https:\/\//i.test(image) ? image : "",
        display_number: displayNumber,
        numbers: {
          bkash: validNumber("number_bkash", "01700000001"),
          nagad: validNumber("number_nagad", "01800000002"),
          rocket: validNumber("number_rocket", "01900000003")
        },
        demo_numbers: {
          bkash: validNumber("demo_number_bkash", "12345678912"),
          nagad: validNumber("demo_number_nagad", "55555555555"),
          rocket: validNumber("demo_number_rocket", "33333333333")
        },
        payment_images: {
          bkash: validImage("payment_image_bkash"),
          nagad: validImage("payment_image_nagad"),
          rocket: validImage("payment_image_rocket")
        },
        demo_payment_images: {
          bkash: validImage("demo_payment_image_bkash"),
          nagad: validImage("demo_payment_image_nagad"),
          rocket: validImage("demo_payment_image_rocket")
        },
        withdraw_button_images: {
          bkash: validImage("withdraw_button_image_bkash"),
          nagad: validImage("withdraw_button_image_nagad"),
          rocket: validImage("withdraw_button_image_rocket")
        },
        withdraw_ids: {
          bkash: parseRefIds(values.withdraw_ids_bkash, "BKASH-01"),
          nagad: parseRefIds(values.withdraw_ids_nagad, "NAGAD-01"),
          rocket: parseRefIds(values.withdraw_ids_rocket, "ROCKET-01")
        },
        deposit_content: parseDepositContent(values.deposit_content),
        withdraw_content: parseWithdrawContent(values.withdraw_content)
      });
    }

    if (p === "/api/promotion-banners" && method === "GET") {
      const rows = await env.DB.prepare("SELECT key,value FROM settings WHERE key LIKE 'promotion_banner_%'").all();
      const banners = (rows.results || [])
        .filter(r => /^promotion_banner_([1-9]|10)$/.test(String(r.key || "")))
        .sort((a,b) => Number(a.key.split("_").pop()) - Number(b.key.split("_").pop()))
        .map(r => String(r.value || "").trim())
        .filter(v => /^https:\/\//i.test(v))
        .slice(0, 10);
      return json({ banners });
    }

    if (p === "/api/home-banners" && method === "GET") {
      const rows = await env.DB.prepare("SELECT key,value FROM settings WHERE key LIKE 'home_banner_%' ORDER BY key").all();
      const banners = (rows.results || [])
        .map(r => String(r.value || "").trim())
        .filter(v => /^https:\/\//i.test(v))
        .slice(0, 5);
      return json({ banners });
    }

    if (p === "/api/categories" && method === "GET") {
      const rows = await env.DB.prepare(`
        SELECT * FROM categories
        WHERE active=1
        ORDER BY sort_order
      `).all();

      return json({ categories: rows.results });
    }

    if (p === "/api/games" && method === "GET") {
      await env.DB.prepare("UPDATE games SET name='Aviator' WHERE id='aviator' AND name='Aviator Free'").run();      await env.DB.prepare("UPDATE games SET active=0 WHERE id='aviator-2'").run();
      await env.DB.prepare(`
        UPDATE games SET sort_order=3
        WHERE id='super-ace' AND sort_order=2
      `).run();

      const miniGames = [
        ["gold-mines", "Gold Mines", "slots", 4],
        ["plinko", "Plinko", "slots", 5],
        ["classic-dice", "Classic Dice", "hot", 6],
        ["royal-coinflip", "Royal Coinflip", "hot", 7],
        ["european-roulette", "European Roulette", "live", 8],
        ["blackjack-21", "Blackjack 21", "poker", 9],
        ["baccarat", "Baccarat", "live", 10],
        ["diamond-slots", "Diamond Slots", "slots", 11],
        ["fortune-wheel", "Fortune Wheel", "lottery", 12],
        ["royal-keno", "Royal Keno", "lottery", 13],
        ["live-roulette", "Live Roulette", "live", 14],
        ["live-blackjack", "Live Blackjack", "live", 15],
        ["live-baccarat", "Live Baccarat", "live", 16],
        ["evo-crazy-time", "Crazy Time", "live", 17, "evolution-demo"],
        ["evo-funky-time", "Funky Time", "live", 18, "evolution-demo"],
        ["evo-disco-balls", "Disco Balls", "live", 19, "evolution-demo"],
        ["evo-mega-ball", "Mega Ball", "live", 20, "evolution-demo"],
        ["evo-dream-catcher", "Dream Catcher", "live", 21, "evolution-demo"],
        ["evo-lightning-roulette", "Lightning Roulette", "live", 22, "evolution-demo"],
        ["evo-monopoly-live", "MONOPOLY Live", "live", 23, "evolution-demo"],
        ["evo-deal-or-no-deal", "Deal or No Deal Live", "live", 24, "evolution-demo"],
        ["evo-crazy-coin-flip", "Crazy Coin Flip", "live", 25, "evolution-demo"],
        ["evo-xxx-lightning", "XXXtreme Lightning Roulette", "live", 26, "evolution-demo"]
      ];
      for (const [id, name, category, order, gameType] of miniGames) {
        await env.DB.prepare(`
          INSERT OR IGNORE INTO games
          (id,name,category_id,image_url,game_type,sort_order)
          VALUES(?,?,?,'',?,?)
        `).bind(id, name, category, gameType || "minigame", order).run();
      }

      const rows = await env.DB.prepare(`
        SELECT id,name,category_id,image_url,game_type,
               html_content,active,sort_order
        FROM games
        WHERE active=1
        ORDER BY sort_order,id
      `).all();

      const nameRow = await env.DB.prepare("SELECT value FROM settings WHERE key='game_name_overrides'").first();
      let nameOverrides = {};
      try {
        nameOverrides = JSON.parse(String(nameRow?.value || "{}"));
      } catch {
        nameOverrides = {};
      }
      const games = (rows.results || []).map(g => ({
        ...g,
        name: typeof nameOverrides[g.id] === "string" && nameOverrides[g.id].trim()
          ? nameOverrides[g.id].trim().slice(0, 80) : g.name
      }));
      return json({ games });
    }

    if (!user) {
      return json({ error: "লগইন করুন" }, 401);
    }

    /* HISTORY */

    if (p === "/api/history") {
      const rows = await env.DB.prepare(`
        SELECT type,amount,balance_after,note,created_at
        FROM tk_transactions
        WHERE user_id=?
        ORDER BY created_at DESC
        LIMIT 50
      `).bind(user.id).all();

      const rounds = await env.DB.prepare(`
        SELECT game_id,bet_amount,multiplier,payout,created_at
        FROM game_rounds
        WHERE user_id=?
        ORDER BY created_at DESC
        LIMIT 30
      `).bind(user.id).all();

      return json({
        transactions: rows.results,
        rounds: rounds.results
      });
    }

    if (p === "/api/superace-state" && method === "GET") {
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS superace_state (user_id TEXT PRIMARY KEY,free_spins INTEGER NOT NULL DEFAULT 0,bet_amount INTEGER NOT NULL DEFAULT 50,bet_multiplier INTEGER NOT NULL DEFAULT 1)").run();
      const state = await env.DB.prepare("SELECT free_spins,bet_amount,bet_multiplier FROM superace_state WHERE user_id=?").bind(user.id).first();
      return json({freeSpins:Number(state?.free_spins||0),betAmount:Number(state?.bet_amount||50),betMultiplier:Number(state?.bet_multiplier||1)});
    }

    /* SUPER ACE: 5x4 ways game with Golden Card -> persistent Golden Joker cascades */
    if (p === "/api/play" && method === "POST") {
      const body = await req.json();
      const gameId = String(body.gameId || "");
      const game = await env.DB.prepare("SELECT * FROM games WHERE id=? AND active=1").bind(gameId).first();
      if (!game || game.game_type !== "superace") return json({ error: "এই গেমের ধরন সঠিক নয়" }, 404);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS superace_state (user_id TEXT PRIMARY KEY,free_spins INTEGER NOT NULL DEFAULT 0,bet_amount INTEGER NOT NULL DEFAULT 50,bet_multiplier INTEGER NOT NULL DEFAULT 1)").run();
      const saved = await env.DB.prepare("SELECT * FROM superace_state WHERE user_id=?").bind(user.id).first();
      const isFreeSpin = Boolean(body.freeSpin) && Number(saved?.free_spins || 0) > 0;
      const bet = isFreeSpin ? Number(saved.bet_amount) : Number(body.betAmount);
      const betMultiplier = isFreeSpin ? Number(saved.bet_multiplier) : Number(body.betMultiplier || 1);
      if (!Number.isSafeInteger(bet) || bet < 1 || ![1,2,3,5].includes(betMultiplier) || bet * betMultiplier > 1000000) return json({ error: "বেট ১ থেকে ১০,০০,০০০ ক্রেডিটের মধ্যে দিন" }, 400);
      const cards=[{id:"ace"},{id:"king"},{id:"queen"},{id:"jack"},{id:"spade"},{id:"heart"},{id:"diamond"},{id:"club"},{id:"scatter"}];
      // Super Ace standard paytable: payout multiplier by matching reels (3/4/5).
      const cardPaytable={
        ace:{3:0.50,4:1.50,5:2.50},
        king:{3:0.40,4:1.20,5:2.00},
        queen:{3:0.30,4:0.90,5:1.50},
        jack:{3:0.20,4:0.60,5:1.00},
        spade:{3:0.10,4:0.30,5:0.50},
        heart:{3:0.10,4:0.30,5:0.50},
        diamond:{3:0.05,4:0.15,5:0.25},
        club:{3:0.05,4:0.15,5:0.25}
      };
      // Ordinary wild cards never drop. A winning yellow K creates a temporary wild.
      const weights=[.7,.8,.9,1,1.15,1.15,1.15,1.15,.10];
      const pickBaseCard=()=>{const total=weights.reduce((x,y)=>x+y,0);let v=rand()*total;for(let i=0;i<cards.length;i++){v-=weights[i];if(v<=0)return cards[i].id;}return "ace";};
      // All eight distinct golden cards can appear only on the middle three reels (columns 2-4).
      const goldIds={ace:"goldenAce",king:"goldenCard",queen:"goldenQueen",jack:"goldenJack",spade:"goldenSpade",heart:"goldenHeart",diamond:"goldenDiamond",club:"goldenClub"};
      const goldPool=Object.values(goldIds);
      const pickCard=col=>{if(col>=1&&col<=3&&rand()<.13)return goldPool[Math.floor(rand()*goldPool.length)];return pickBaseCard();};
      const findWins=grid=>{
        const groups=[],all=[];
        for(const symbol of cards.filter(c=>c.id!=="scatter")){
          const reels=[];
          for(let col=0;col<5;col++){
            const cells=[];
            for(let row=0;row<4;row++){
              const ix=row*5+col,card=grid[ix];
              const goldenBase=card==="goldenCard"?"king":String(card||"").startsWith("golden")?String(card).slice(6).toLowerCase():null;
              if(card===symbol.id||card==="wild"||goldenBase===symbol.id)cells.push(ix);
            }
            reels.push(cells);
          }
          let ways=1,reelCount=0;
          for(const cells of reels){if(!cells.length)break;ways*=cells.length;reelCount++;}
          if(reelCount>=3){const cells=reels.slice(0,reelCount).flat();groups.push({id:symbol.id,cells,ways,reels:reelCount,rate:symbol.rate});all.push(...cells);}
        }
        return {groups,wins:[...new Set(all)]};
      };
      const stake=bet*betMultiplier,roundId=uid();
      // Target about 30% of paid/free rounds to start with a winning combination.
      // The remaining rounds are deliberately generated without a starting match.
      const allowWin=rand()<0.30;
      const makeBoard=()=>Array.from({length:20},(_,ix)=>pickCard(ix%5));
      let grid=makeBoard();
      for(let attempt=0;attempt<500;attempt++){
        const hasWin=findWins(grid).groups.length>0;
        if(hasWin===allowWin)break;
        grid=makeBoard();
      }
      let cascadeX=1,totalWin=0,cascadeCount=0;
      let scatterCount=grid.filter(x=>x==="scatter").length;
      let scatterTriggered=scatterCount>=3;
      const trackScatters=board=>{const count=board.filter(x=>x==="scatter").length;if(count>scatterCount)scatterCount=count;if(count>=3)scatterTriggered=true;};
      let maxCascadeX=0;
      const frames=[];
      const comboSteps=[1,2,3,5];
      // Two scatters on the first row: send an anticipation animation before any next cards fall.
      if(grid.slice(0,5).filter(x=>x==="scatter").length===2){
        frames.push({type:"anticipation",grid:[...grid],row:1});
      }
      for(let step=0;step<8;step++){
        const found=findWins(grid),hit=new Set(found.wins);
        if(!found.groups.length)break;
        cascadeX=comboSteps[Math.min(cascadeCount,3)]*(isFreeSpin?2:1);
        maxCascadeX=Math.max(maxCascadeX,cascadeX);
        let cascadeWin=0;
        for(const g of found.groups)cascadeWin+=(cardPaytable[g.id]?.[g.reels]||0)*g.ways*stake*cascadeX;
        totalWin+=cascadeWin;
        frames.push({type:"win",grid:[...grid],wins:found.wins,cascadeX,winAmount:cascadeWin,totalWin});
        cascadeCount++;
        const nextCascadeX=comboSteps[Math.min(cascadeCount,3)]*(isFreeSpin?2:1);
        // Only golden cards that are part of a winning group become wild, in their exact cells.
        const goldenCells=[...new Set(found.groups.flatMap(group=>group.cells))].filter(ix=>String(grid[ix]||"").startsWith("golden"));
        const nextAfterGolden=[...grid];
        if(goldenCells.length){
          for(const ix of goldenCells)nextAfterGolden[ix]="wild";
          frames.push({type:"golden",grid:[...nextAfterGolden],cells:goldenCells,cascadeX});
        }
        // Converted wilds remain for the next cascade; when they help form a win,
        // they are included in found.wins and removed with that winning group.
        const removed=found.wins.filter(ix=>!goldenCells.includes(ix));
        frames.push({type:"remove",grid:[...nextAfterGolden],cells:removed,nextCascadeX});
        const removedSet=new Set(removed);
        const compacted=Array(20).fill(null),moved=[],moves=[],refillCells=[];
        // Each reel compacts independently: survivors fall to the bottom; fresh cards enter from above.
        for(let col=0;col<5;col++){
          const survivors=[];
          for(let row=3;row>=0;row--){
            const oldIx=row*5+col;
            if(!removedSet.has(oldIx)){
              const newRow=3-survivors.length,newIx=newRow*5+col;
              survivors.push({id:nextAfterGolden[oldIx],oldIx,newIx});
            }
          }
          const emptyCount=4-survivors.length;
          for(let row=0;row<emptyCount;row++)refillCells.push(row*5+col);
          for(const item of survivors){
            compacted[item.newIx]=item.id;
            if(item.oldIx!==item.newIx){moved.push(item.newIx);moves.push({from:item.oldIx,to:item.newIx});}
          }
        }
        frames.push({type:"drop",grid:[...compacted],cells:moved,moves,nextCascadeX});
        const refilled=[...compacted];
        for(const ix of refillCells)refilled[ix]=pickCard(ix%5);
        grid=refilled;
        trackScatters(grid);
        frames.push({type:"refill",grid:[...grid],cells:refillCells,nextCascadeX});
      }
      const payout=Math.max(0,Math.floor(totalWin)),multiplier=Number((payout/stake).toFixed(2));
      let freeSpins=isFreeSpin?Math.max(0,Number(saved.free_spins)-1):Number(saved?.free_spins||0);
      const freeSpinAward=scatterTriggered?(isFreeSpin?5:10):0;
      freeSpins+=freeSpinAward;
      const requestId=String(body.requestId||"").trim();
      if(!/^[0-9a-f-]{36}$/i.test(requestId))return json({error:"Spin request ID সঠিক নয়"},400);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS superace_requests (user_id TEXT NOT NULL,request_id TEXT NOT NULL,status TEXT NOT NULL,response_json TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(user_id,request_id))").run();
      await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS superace_one_processing_per_user ON superace_requests(user_id) WHERE status='processing'").run();
      const prior=await env.DB.prepare("SELECT status,response_json FROM superace_requests WHERE user_id=? AND request_id=?").bind(user.id,requestId).first();
      if(prior){
        if(prior.status==="completed"&&prior.response_json){let cached;try{cached=JSON.parse(prior.response_json)}catch(_){cached=null;}if(cached)return json(cached);}
        return json({error:"এই Spin-এর ফলাফল প্রক্রিয়াধীন। একই Spin আবার পাঠানো হয়েছে; একটু অপেক্ষা করুন।"},409);
      }
      const lock=await env.DB.prepare("INSERT OR IGNORE INTO superace_requests(user_id,request_id,status) VALUES(?,?,'processing')").bind(user.id,requestId).run();
      if(!lock.meta.changes){
        const same=await env.DB.prepare("SELECT status,response_json FROM superace_requests WHERE user_id=? AND request_id=?").bind(user.id,requestId).first();
        if(same?.status==="completed"&&same.response_json){try{return json(JSON.parse(same.response_json));}catch(_){}}
        return json({error:"আগের Spin এখনো প্রক্রিয়াধীন। একটু অপেক্ষা করুন।"},409);
      }
      try{
        if(!isFreeSpin){
          const debit=await env.DB.prepare("UPDATE users SET balance=balance-? WHERE id=? AND balance>=?").bind(stake,user.id,stake).run();
          if(!debit.meta.changes){
            await env.DB.prepare("DELETE FROM superace_requests WHERE user_id=? AND request_id=?").bind(user.id,requestId).run();
            return json({error:"পর্যাপ্ত ব্যালেন্স নেই"},400);
          }
        }
        await env.DB.prepare("INSERT INTO superace_state(user_id,free_spins,bet_amount,bet_multiplier) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET free_spins=excluded.free_spins,bet_amount=excluded.bet_amount,bet_multiplier=excluded.bet_multiplier").bind(user.id,freeSpins,bet,betMultiplier).run();
        if(payout)await env.DB.prepare("UPDATE users SET balance=balance+? WHERE id=?").bind(payout,user.id).run();
        const bal=await env.DB.prepare("SELECT balance FROM users WHERE id=?").bind(user.id).first(),entries=[];
        await ensureSchemaOnce('rebate', ensureRebateSchema, env);
        if(!isFreeSpin)entries.push(env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) VALUES(?,?,?,?,?,?)").bind(uid(),user.id,"game",-stake,bal.balance-payout,game.name+" বেট"));
        if(payout)entries.push(env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) VALUES(?,?,?,?,?,?)").bind(uid(),user.id,"win",payout,bal.balance,game.name+" জয়"));
        entries.push(env.DB.prepare("INSERT INTO game_rounds(id,user_id,game_id,game_type,bet_amount,multiplier,payout) VALUES(?,?,?,?,?,?,?)").bind(roundId,user.id,gameId,"superace",isFreeSpin?0:stake,multiplier,payout));
        await env.DB.batch(entries);
        const responseData={multiplier,payout,balance:bal.balance,roundId,stake:isFreeSpin?0:stake,cascadeCount,maxCascadeX,frames,finalGrid:grid,freeSpins,freeSpin:isFreeSpin,scatterCount,freeSpinAward};
        await env.DB.prepare("UPDATE superace_requests SET status='completed',response_json=? WHERE user_id=? AND request_id=?").bind(JSON.stringify(responseData),user.id,requestId).run();
        return json(responseData);
      }catch(error){
        if(!isFreeSpin)await env.DB.prepare("UPDATE users SET balance=balance+? WHERE id=?").bind(stake-payout,user.id).run();
        await env.DB.prepare("DELETE FROM superace_requests WHERE user_id=? AND request_id=?").bind(user.id,requestId).run();
        throw error;
      }
    }

    /* MINI GAMES */
    if (p === "/api/mini-play" && method === "POST") {
      const body = await req.json();
      const gameId = String(body.gameId || "");
      const bet = Number(body.betAmount);
      const choice = String(body.choice || "");
      if (!Number.isSafeInteger(bet) || bet < 1 || bet > 1000000) {
        return json({ error: "১ থেকে ১০,০০,০০০ কয়েনের মধ্যে বেট দিন" }, 400);
      }
      const game = await env.DB.prepare(
        "SELECT id,name,game_type FROM games WHERE id=? AND active=1"
      ).bind(gameId).first();
      if (!game || game.game_type !== "minigame") {
        return json({ error: "গেমটি পাওয়া যায়নি" }, 404);
      }

      let multiplier = 0, result = "", detail = "";
      const pick = arr => arr[Math.floor(rand() * arr.length)];
      if (gameId === "gold-mines") {
        const mine = 1 + Math.floor(rand() * 5);
        const selected = Number(choice);
        if (!Number.isInteger(selected) || selected < 1 || selected > 5) return json({ error: "১ থেকে ৫-এর একটি ঘর বাছুন" }, 400);
        multiplier = selected === mine ? 0 : 1.8;
        result = selected === mine ? "💣 মাইন! বেট হারিয়েছেন" : "💎 নিরাপদ ঘর! জয়";
        detail = "আপনার ঘর: " + selected + " · মাইন: " + mine;
      } else if (gameId === "plinko") {
        multiplier = pick([0, 0, 0.5, 0.5, 1, 1, 1.5, 2, 3, 5]);
        result = multiplier > 0 ? "বলটি জিতেছে!" : "বলটি শূন্য ঘরে পড়েছে";
        detail = "মাল্টিপ্লায়ার " + multiplier + "x";
      } else if (gameId === "classic-dice") {
        if (!["high", "low"].includes(choice)) return json({ error: "High অথবা Low বাছুন" }, 400);
        const roll = 1 + Math.floor(rand() * 6);
        multiplier = (choice === "high" ? roll >= 4 : roll <= 3) ? 1.9 : 0;
        result = "ডাইস: " + roll + " · " + (multiplier ? "আপনি জিতেছেন" : "আপনি হেরেছেন");
        detail = choice === "high" ? "High (৪–৬)" : "Low (১–৩)";
      } else if (gameId === "royal-coinflip") {
        if (!["heads", "tails"].includes(choice)) return json({ error: "Heads অথবা Tails বাছুন" }, 400);
        const side = pick(["heads", "tails"]);
        multiplier = choice === side ? 1.9 : 0;
        result = side === "heads" ? "🪙 HEADS" : "🪙 TAILS";
        detail = multiplier ? "সঠিক অনুমান!" : "ভুল অনুমান";
      } else if (gameId === "european-roulette") {
        if (!["red", "black", "green"].includes(choice)) return json({ error: "Roulette-এর রং বাছুন" }, 400);
        const n = Math.floor(rand() * 37);
        const red = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
        const color = n === 0 ? "green" : red.has(n) ? "red" : "black";
        multiplier = choice === color ? (color === "green" ? 14 : 1.9) : 0;
        result = "বল পড়েছে " + n + " · " + color.toUpperCase();
        detail = "আপনার পছন্দ: " + choice.toUpperCase();
      } else if (gameId === "blackjack-21") {
        const total = 4 + Math.floor(rand() * 18);
        multiplier = total >= 18 ? 1.8 : 0;
        result = "আপনার কার্ডের মোট: " + total;
        detail = total >= 18 ? "২১-এর কাছাকাছি! জয়" : "১৮-এর কম · হার";
      } else if (gameId === "baccarat") {
        if (!["player", "banker", "tie"].includes(choice)) return json({ error: "Player, Banker অথবা Tie বাছুন" }, 400);
        const outcome = pick(["player", "banker", "player", "banker", "tie"]);
        multiplier = choice === outcome ? (outcome === "tie" ? 8 : 1.95) : 0;
        result = "ফলাফল: " + outcome.toUpperCase();
        detail = "আপনার পছন্দ: " + choice.toUpperCase();
      } else if (gameId === "diamond-slots") {
        const symbols = ["💎", "7️⃣", "🔔", "🍀", "👑"];
        const reels = [pick(symbols), pick(symbols), pick(symbols)];
        const counts = Object.fromEntries(reels.map(x => [x, (reels.filter(y => y === x).length)]));
        const max = Math.max(...Object.values(counts));
        multiplier = max === 3 ? 5 : max === 2 ? 1.5 : 0;
        result = reels.join("  ");
        detail = max === 3 ? "জ্যাকপট!" : max === 2 ? "দুটি মিলেছে!" : "মিল পাওয়া যায়নি";
      } else if (gameId === "fortune-wheel") {
        multiplier = pick([0, 0, 0.5, 1, 1, 1.5, 2, 3, 5, 10]);
        result = "চাকা থেমেছে " + multiplier + "x-এ";
        detail = multiplier > 0 ? "আপনার পেআউট তৈরি হয়েছে" : "এইবার জয় হয়নি";
      } else if (gameId === "royal-keno") {
        const selected = Number(choice);
        if (!Number.isInteger(selected) || selected < 1 || selected > 10) return json({ error: "১ থেকে ১০-এর মধ্যে একটি নম্বর বাছুন" }, 400);
        const drawn = 1 + Math.floor(rand() * 10);
        multiplier = selected === drawn ? 8 : 0;
        result = "ড্র নম্বর: " + drawn;
        detail = selected === drawn ? "নম্বর মিলেছে!" : "নম্বর মেলেনি";
      } else if (gameId === "live-roulette") {
        if (!["red", "black", "green"].includes(choice)) return json({ error: "রং বাছুন" }, 400);
        const n = Math.floor(rand() * 37);
        const red = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
        const color = n === 0 ? "green" : red.has(n) ? "red" : "black";
        multiplier = choice === color ? (color === "green" ? 14 : 1.9) : 0;
        result = "ডিলারের রুলেট থেমেছে " + n + " · " + color.toUpperCase();
        detail = "লাইভ টেবিল · আপনার পছন্দ " + choice.toUpperCase();
      } else if (gameId === "live-blackjack") {
        const player = 15 + Math.floor(rand() * 7);
        const dealer = 15 + Math.floor(rand() * 7);
        multiplier = player <= 21 && (dealer > 21 || player > dealer) ? 1.9 : player === dealer ? 1 : 0;
        result = "PLAYER " + player + " · DEALER " + dealer;
        detail = "ডিলারের কার্ড খোলা হয়েছে · " + (multiplier === 1.9 ? "আপনি জিতেছেন" : multiplier === 1 ? "টাই" : "ডিলার জিতেছেন");
      } else if (gameId === "live-baccarat") {
        if (!["player", "banker", "tie"].includes(choice)) return json({ error: "Player, Banker অথবা Tie বাছুন" }, 400);
        const outcome = pick(["player", "banker", "player", "banker", "tie"]);
        multiplier = choice === outcome ? (outcome === "tie" ? 8 : 1.95) : 0;
        result = "ডিলারের ফলাফল: " + outcome.toUpperCase();
        detail = "লাইভ টেবিল · আপনার পছন্দ " + choice.toUpperCase();
      } else {
        return json({ error: "এই গেমটি সমর্থিত নয়" }, 400);
      }

      const payout = Math.floor(bet * multiplier);
      const debit = await env.DB.prepare(
        "UPDATE users SET balance=balance-? WHERE id=? AND balance>=?"
      ).bind(bet, user.id, bet).run();
      if (!debit.meta.changes) return json({ error: "পর্যাপ্ত Coin নেই" }, 400);

      try {
        if (payout) await env.DB.prepare(
          "UPDATE users SET balance=balance+? WHERE id=?"
        ).bind(payout, user.id).run();
        const bal = await env.DB.prepare("SELECT balance FROM users WHERE id=?").bind(user.id).first();
        const roundId = uid();
        await ensureSchemaOnce('rebate', ensureRebateSchema, env);
        await env.DB.batch([
          env.DB.prepare("INSERT INTO game_rounds(id,user_id,game_id,game_type,bet_amount,multiplier,payout) VALUES(?,?,?,?,?,?,?)")
            .bind(roundId, user.id, gameId, "minigame", bet, multiplier, payout),
          env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) VALUES(?,?,?,?,?,?)")
            .bind(uid(), user.id, "game", -bet, bal.balance - payout, game.name + " বেট"),
          ...(payout ? [env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) VALUES(?,?,?,?,?,?)")
            .bind(uid(), user.id, "win", payout, bal.balance, game.name + " জয়")] : [])
        ]);
        return json({ ok: true, multiplier, payout, balance: bal.balance, result, detail, roundId });
      } catch (e) {
        await env.DB.prepare("UPDATE users SET balance=balance+? WHERE id=?").bind(bet - payout, user.id).run();
        throw e;
      }
    }

    /* CRASH: GLOBAL STATE */

    if (p === "/api/crash/state" && method === "POST") {
      const { gameId } = await req.json();

      const game = await env.DB.prepare(`
        SELECT id FROM games
        WHERE id=? AND active=1 AND game_type='aviator'
      `).bind(gameId).first();

      if (!game) {
        return json({ error: "Crash গেম পাওয়া যায়নি" }, 404);
      }

      return json(await crashState(env, gameId));
    }

    /* CRASH: PLACE BET */

    if (p === "/api/crash/start" && method === "POST") {
      const { gameId, betAmount } = await req.json();
      const bet = Number(betAmount);

      if (!Number.isSafeInteger(bet) || bet < 1 || bet > 1000000) {
        return json({
          error: "বেট ১ থেকে ১০,০০,০০০ ক্রেডিটের মধ্যে দিন"
        }, 400);
      }

      const session = await env.DB.prepare(`
        SELECT cs.*,g.name AS game_name
        FROM crash_sessions cs
        JOIN games g ON g.id=cs.game_id
        WHERE cs.game_id=? AND cs.status='active'
          AND g.active=1 AND g.game_type='aviator'
        ORDER BY cs.created_at DESC
        LIMIT 1
      `).bind(gameId).first();

      if (!session) {
        return json({ error: "Crash গেম বা রাউন্ড পাওয়া যায়নি" }, 404);
      }
      const now = Date.now();
      if (now >= Number(session.start_ms)) {
        return json({
          error: "বেট করার সময় শেষ, পরের রাউন্ডে চেষ্টা করুন"
        }, 409);
      }

      const current = Math.exp(
        Math.max(0, now - Number(session.start_ms)) / 12000
      );

      if (current >= Number(session.crash_multiplier)) {
        return json({
          error: "রাউন্ড শেষ হয়ে গেছে, পরের রাউন্ডে চেষ্টা করুন"
        }, 409);
      }

      const debit = await env.DB.prepare(`
        UPDATE users SET balance=balance-?
        WHERE id=? AND balance>=?
      `).bind(bet, user.id, bet).run();

      if (!debit.meta.changes) {
        return json({ error: "পর্যাপ্ত ক্রেডিট নেই" }, 400);
      }

      const roundId = uid();

      try {
        const ins = await env.DB.prepare(`
          INSERT INTO crash_rounds
          (id,user_id,game_id,bet_amount,crash_multiplier,
           start_ms,status,session_id)
          SELECT ?,?,?,?,?,?,'active',?
          WHERE EXISTS (
            SELECT 1 FROM crash_sessions
            WHERE id=? AND status='active'
              AND start_ms>? AND crash_multiplier>?
          )
        `).bind(
          roundId, user.id, gameId, bet, session.crash_multiplier,
          session.start_ms, session.id, session.id, Date.now(), current
        ).run();

        if (!ins.meta.changes) {
          throw new Error("বেট করার সময় শেষ, আবার চেষ্টা করুন");
        }

        const bal = await env.DB.prepare(
          "SELECT balance FROM users WHERE id=?"
        ).bind(user.id).first();

        await env.DB.prepare(`
          INSERT INTO tk_transactions
          (id,user_id,type,amount,balance_after,note)
          VALUES(?,?,?,?,?,?)
        `).bind(
          uid(), user.id, "game", -bet, bal.balance, session.game_name + " বেট"
        ).run();

        return json({
          roundId,
          sessionId: session.id,
          balance: bal.balance
        });
      } catch (e) {
        await env.DB.prepare(
          "UPDATE users SET balance=balance+? WHERE id=?"
        ).bind(bet, user.id).run();
        throw e;
      }
    }

    /* CRASH: CANCEL BET DURING COUNTDOWN */
    if (p === "/api/crash/cancel" && method === "POST") {
      const { roundId } = await req.json();
      if (!roundId) return json({ error: "roundId প্রয়োজন" }, 400);

      const round = await env.DB.prepare(`
        SELECT * FROM crash_rounds
        WHERE id=? AND user_id=? AND status='active'
      `).bind(roundId, user.id).first();

      if (!round) return json({ error: "বাতিল করার মতো সক্রিয় বেট নেই" }, 404);

      const session = await env.DB.prepare(`
        SELECT * FROM crash_sessions
        WHERE id=? AND status='active'
      `).bind(round.session_id).first();

      if (!session || Date.now() >= Number(session.start_ms)) {
        return json({ error: "কাউন্টডাউন শেষ, এখন বেট বাতিল করা যাবে না" }, 409);
      }

      const cancelled = await env.DB.prepare(`
        UPDATE crash_rounds SET status='cancelled', payout=0
        WHERE id=? AND user_id=? AND status='active'
          AND EXISTS (
            SELECT 1 FROM crash_sessions
            WHERE id=crash_rounds.session_id AND status='active' AND start_ms>?
          )
      `).bind(roundId, user.id, Date.now()).run();

      if (!cancelled.meta.changes) {
        return json({ error: "কাউন্টডাউন শেষ, বেট বাতিল করা যায়নি" }, 409);
      }

      await env.DB.prepare(`
        UPDATE users SET balance=balance+? WHERE id=?
      `).bind(Number(round.bet_amount), user.id).run();

      const bal = await env.DB.prepare(`
        SELECT balance FROM users WHERE id=?
      `).bind(user.id).first();

      await env.DB.prepare(`
        INSERT INTO tk_transactions
        (id,user_id,type,amount,balance_after,note)
        VALUES(?,?,?,?,?,?)
      `).bind(
        uid(), user.id, "refund", Number(round.bet_amount),
        bal.balance, "Aviator বেট বাতিলের রিফান্ড"
      ).run();

      return json({ ok: true, balance: bal.balance });
    }

    /* CRASH: UPDATE BET STATUS */

    if (p === "/api/crash/tick" && method === "POST") {
      const { roundId, gameId } = await req.json();

      if (!roundId) {
        if (!gameId) {
          return json({ error: "gameId প্রয়োজন" }, 400);
        }

        return json(await crashState(env, gameId));
      }

      const round = await env.DB.prepare(`
        SELECT *
        FROM crash_rounds
        WHERE id=? AND user_id=?
      `).bind(roundId, user.id).first();

      if (!round) {
        return json({ error: "রাউন্ড পাওয়া যায়নি" }, 404);
      }

      // A bet-status check must not rebuild the full global game state.
      if (round.session_id) {
        const session = await env.DB.prepare(
          "SELECT * FROM crash_sessions WHERE id=?"
        ).bind(round.session_id).first();

        if (session && session.status === "active") {
          await finishCrashSession(env, session);
        }
      }

      const latest = await env.DB.prepare(`
        SELECT status,payout,cashout_multiplier
        FROM crash_rounds WHERE id=?
      `).bind(roundId).first();

      const bal = latest.status === "active" ? null : await env.DB.prepare(`
        SELECT balance FROM users WHERE id=?
      `).bind(user.id).first();

      return json({
        betStatus: latest.status,
        payout: latest.payout || 0,
        multiplier: latest.cashout_multiplier || round.crash_multiplier,
        ...(bal ? { balance: bal.balance } : {}),
        roundId
      });
    }

    /* CRASH: CASH OUT */

    if (p === "/api/crash/cashout" && method === "POST") {
      const { roundId } = await req.json();

      const round = await env.DB.prepare(`
        SELECT *
        FROM crash_rounds
        WHERE id=? AND user_id=?
      `).bind(roundId, user.id).first();

      if (!round) {
        return json({ error: "রাউন্ড পাওয়া যায়নি" }, 404);
      }

      const session = round.session_id
        ? await env.DB.prepare(`
            SELECT * FROM crash_sessions WHERE id=?
          `).bind(round.session_id).first()
        : null;

      if (!session || session.status !== "active") {
        if (session) {
          await finishCrashSession(env, session);
        }

        const f = await env.DB.prepare(`
          SELECT * FROM crash_rounds WHERE id=?
        `).bind(roundId).first();

        const b = await env.DB.prepare(`
          SELECT balance FROM users WHERE id=?
        `).bind(user.id).first();

        return json({
          status: f.status,
          multiplier: f.cashout_multiplier || round.crash_multiplier,
          payout: f.payout || 0,
          balance: b.balance
        });
      }

      if (Date.now() < Number(session.start_ms)) {
        return json({
          error: "প্লেন এখনো উড়তে শুরু করেনি"
        }, 409);
      }

      const current = Number(
        Math.exp(
          Math.max(0, Date.now() - Number(session.start_ms)) / 12000
        ).toFixed(2)
      );

      if (current >= Number(session.crash_multiplier)) {
        await finishCrashSession(env, session);

        const f = await env.DB.prepare(`
          SELECT * FROM crash_rounds WHERE id=?
        `).bind(roundId).first();

        const b = await env.DB.prepare(`
          SELECT balance FROM users WHERE id=?
        `).bind(user.id).first();

        return json({
          status: f.status,
          multiplier: session.crash_multiplier,
          payout: 0,
          balance: b.balance
        });
      }

      const payout = Math.round(Number(round.bet_amount) * current * 100) / 100;

      // Ensure the rebate trigger exists before recording a cashed-out Aviator round.
      await ensureSchemaOnce('rebate', ensureRebateSchema, env);
      await env.DB.batch([
        env.DB.prepare(`
          UPDATE crash_rounds
          SET status='cashed_out',
              cashout_multiplier=?,
              payout=?
          WHERE id=?
            AND user_id=?
            AND status='active'
            AND EXISTS (
              SELECT 1 FROM crash_sessions
              WHERE id=? AND status='active'
                AND crash_multiplier>?
            )
        `).bind(
          current, payout, roundId, user.id,
          session.id, current
        ),

        env.DB.prepare(`
          UPDATE users
          SET balance=balance+?
          WHERE id=?
            AND EXISTS (
              SELECT 1 FROM crash_rounds
              WHERE id=? AND status='cashed_out' AND settled=0
            )
        `).bind(payout, user.id, roundId),

        env.DB.prepare(`
          INSERT INTO tk_transactions
          (id,user_id,type,amount,balance_after,note)
          SELECT ?,?,'win',?,balance,?
          FROM users
          WHERE id=?
            AND EXISTS (
              SELECT 1 FROM crash_rounds
              WHERE id=? AND status='cashed_out' AND settled=0
            )
        `).bind(
          uid(), user.id, payout,
          "Crash গেমে Cash Out",
          user.id, roundId
        ),

        env.DB.prepare(`
          INSERT OR IGNORE INTO game_rounds
          (id,user_id,game_id,game_type,bet_amount,multiplier,payout)
          SELECT id,user_id,game_id,'aviator',
                 bet_amount,cashout_multiplier,payout
          FROM crash_rounds
          WHERE id=? AND status='cashed_out' AND settled=0
        `).bind(roundId),

        env.DB.prepare(`
          UPDATE crash_rounds
          SET settled=1
          WHERE id=? AND status='cashed_out' AND settled=0
        `).bind(roundId)
      ]);

      const f = await env.DB.prepare(`
        SELECT * FROM crash_rounds WHERE id=?
      `).bind(roundId).first();

      const b = await env.DB.prepare(`
        SELECT balance FROM users WHERE id=?
      `).bind(user.id).first();

      return json({
        status: f.status,
        multiplier: f.cashout_multiplier || f.crash_multiplier,
        payout: f.payout || 0,
        balance: b.balance
      });
    }

    /* ADMIN AVIATOR ROUND CONTROL */

    if (p === "/api/admin/aviator-control" && method === "GET") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const game = await env.DB.prepare(`
        SELECT id FROM games
        WHERE id='aviator' AND active=1 AND game_type='aviator'
        LIMIT 1
      `).first();

      if (!game) return json({ error: "Aviator game পাওয়া যায়নি" }, 404);

      const state = await crashState(env, game.id);
      const current = await env.DB.prepare(`
        SELECT crash_multiplier,status,start_ms
        FROM crash_sessions WHERE id=?
      `).bind(state.sessionId).first();

      let next = await env.DB.prepare(`
        SELECT value FROM settings WHERE key='aviator_next_crash_multiplier'
      `).first();

      if (!next || !Number.isFinite(Number(next.value)) || Number(next.value) < 1.01 || Number(next.value) > 1000) {
        const value = Number((1.05 + Math.pow(rand(), 2.2) * 8.95).toFixed(2));
        await env.DB.prepare(`
          INSERT INTO settings(key,value)
          VALUES('aviator_next_crash_multiplier',?)
          ON CONFLICT(key) DO UPDATE SET value=excluded.value
        `).bind(String(value)).run();
        next = { value: String(value) };
      }

      return json({
        currentRound: current ? {
          crashMultiplier: Number(current.crash_multiplier),
          status: state.status,
          multiplier: Number(state.multiplier || 1),
          startMs: Number(current.start_ms)
        } : null,
        nextCrashMultiplier: Number(next.value)
      });
    }

    if (p === "/api/admin/aviator-control" && method === "POST") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const { multiplier } = await req.json();
      const value = Number(multiplier);

      if (!Number.isFinite(value) || value < 1.01 || value > 1000) {
        return json({ error: "Multiplier 1.01x থেকে 1000.00x-এর মধ্যে দিন" }, 400);
      }

      const normalized = Number(value.toFixed(2));
      await env.DB.prepare(`
        INSERT INTO settings(key,value)
        VALUES('aviator_next_crash_multiplier',?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value
      `).bind(String(normalized)).run();

      return json({ ok: true, nextCrashMultiplier: normalized });
    }

    /* ADMIN OVERVIEW */

    if (p === "/api/admin/overview") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const [u, g, c, t] = await Promise.all([
        env.DB.prepare("SELECT COUNT(*) n FROM users").first(),
        env.DB.prepare("SELECT COUNT(*) n FROM games").first(),
        env.DB.prepare("SELECT COUNT(*) n FROM categories").first(),
        env.DB.prepare("SELECT COUNT(*) n FROM game_rounds").first()
      ]);

      return json({
        users: u.n,
        games: g.n,
        categories: c.n,
        rounds: t.n
      });
    }

    /* ADMIN USERS */

    if (p === "/api/admin/users") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      await env.DB.prepare("ALTER TABLE users ADD COLUMN wallet_number TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      const q = String(url.searchParams.get("q") || "").trim().slice(0, 40);
      const rows = q
        ? await env.DB.prepare("SELECT id,username,email,balance,role,created_at,wallet_number FROM users WHERE username LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT 100").bind("%" + q + "%", "%" + q + "%").all()
        : await env.DB.prepare("SELECT id,username,email,balance,role,created_at,wallet_number FROM users ORDER BY created_at DESC LIMIT 100").all();
      return json({ users: rows.results || [] });
    }

    if (p.startsWith("/api/admin/users/") && method === "GET") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      const userId = decodeURIComponent(p.slice("/api/admin/users/".length));
      await env.DB.prepare("ALTER TABLE users ADD COLUMN wallet_number TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      for (const [c,d] of [["display_name","TEXT NOT NULL DEFAULT ''"],["whatsapp_number","TEXT NOT NULL DEFAULT ''"],["facebook_url","TEXT NOT NULL DEFAULT ''"],["gmail","TEXT NOT NULL DEFAULT ''"]]) await env.DB.prepare("ALTER TABLE users ADD COLUMN "+c+" "+d).run().catch(()=>{});
      const target = await env.DB.prepare("SELECT id,username,display_name,email,whatsapp_number,facebook_url,gmail,balance,role,created_at,wallet_number FROM users WHERE id=?").bind(userId).first();
      if (!target) return json({ error: "ইউজার পাওয়া যায়নি" }, 404);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS demo_deposits (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,method TEXT NOT NULL,amount INTEGER NOT NULL,demo_reference TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS demo_withdrawals (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,method TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS coin_requests (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      const [transactions, rounds, crashRounds, deposits, withdrawals, coinRequests] = await Promise.all([
        env.DB.prepare("SELECT id,type,amount,balance_after,note,created_at FROM tk_transactions WHERE user_id=? ORDER BY created_at DESC LIMIT 100").bind(userId).all(),
        env.DB.prepare("SELECT id,game_id,game_type,bet_amount,multiplier,payout,created_at FROM game_rounds WHERE user_id=? ORDER BY created_at DESC LIMIT 100").bind(userId).all(),
        env.DB.prepare("SELECT id,game_id,bet_amount,crash_multiplier,status,cashout_multiplier,payout,created_at FROM crash_rounds WHERE user_id=? ORDER BY created_at DESC LIMIT 100").bind(userId).all(),
        env.DB.prepare("SELECT id,method,amount,demo_reference,status,created_at FROM demo_deposits WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(userId).all(),
        env.DB.prepare("SELECT id,method,amount,status,created_at,reviewed_at FROM demo_withdrawals WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(userId).all(),
        env.DB.prepare("SELECT id,amount,status,created_at,reviewed_at FROM coin_requests WHERE user_id=? ORDER BY created_at DESC LIMIT 50").bind(userId).all()
      ]);
      return json({
        user: target,
        documents: {
          transactions: transactions.results || [],
          gameRounds: rounds.results || [],
          crashRounds: crashRounds.results || [],
          demoDeposits: deposits.results || [],
          demoWithdrawals: withdrawals.results || [],
          coinRequests: coinRequests.results || []
        }
      });
    }

    if (p === "/api/admin/user-wallet-number" && method === "POST") {
      if(!await admin())return json({error:"Admin access প্রয়োজন"},403);
      await env.DB.prepare("ALTER TABLE users ADD COLUMN wallet_number TEXT NOT NULL DEFAULT ''").run().catch(() => {});
      const body=await req.json(),userId=String(body.userId||""),walletNumber=String(body.walletNumber||"").trim();
      if(!userId||!/^[0-9+ -]{8,20}$/.test(walletNumber))return json({error:"সঠিক ইউজার ও ওয়ালেট নম্বর দিন"},400);
      const result=await env.DB.prepare("UPDATE users SET wallet_number=? WHERE id=?").bind(walletNumber,userId).run();
      if(!result.meta?.changes)return json({error:"ইউজার পাওয়া যায়নি"},404);
      return json({ok:true,walletNumber});
    }
    if (p === "/api/admin/user-balance-set" && method === "POST") {
      const adminUser = await admin();
      if (!adminUser) return json({ error: "Admin access প্রয়োজন" }, 403);
      const body = await req.json();
      const userId = String(body.userId || "");
      const nextBalance = Number(body.balance);
      if (!userId || !Number.isSafeInteger(nextBalance) || nextBalance < 0 || nextBalance > 1000000000) {
        return json({ error: "০ থেকে ১০০ কোটি পর্যন্ত সঠিক পূর্ণসংখ্যা দিন" }, 400);
      }
      const current = await env.DB.prepare("SELECT balance FROM users WHERE id=?").bind(userId).first();
      if (!current) return json({ error: "ইউজার পাওয়া যায়নি" }, 404);
      const delta = nextBalance - Number(current.balance);
      const updated = await env.DB.prepare("UPDATE users SET balance=? WHERE id=? AND balance=?").bind(nextBalance, userId, current.balance).run();
      if (!updated.meta?.changes) return json({ error: "ব্যালেন্স অন্য অনুরোধে পরিবর্তিত হয়েছে। আবার চেষ্টা করুন।" }, 409);
      const note=String(body.note||"Admin directly set coin balance").slice(0,160),txId=uid();
      await env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) VALUES(?,?,?,?,?,?)").bind(txId,userId,"admin_balance_set",delta,nextBalance,note).run();
      await createInternalMessage(env,userId,"অ্যাডমিন ব্যালেন্স আপডেট",(delta>=0?"+":"")+delta+" টাকা ব্যালেন্স পরিবর্তন হয়েছে। কারণ: "+note,"balance","transaction-"+txId);
      return json({ok:true,balance:nextBalance,previousBalance:Number(current.balance)});
    }

    /* ADMIN BALANCE */

    if (p === "/api/admin/balance" && method === "POST") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const { userId, amount, note } = await req.json();
      const n = Math.floor(Number(amount));

      if (
        !Number.isSafeInteger(n) ||
        n === 0 ||
        Math.abs(n) > 10000000
      ) {
        return json({ error: "সঠিক পরিমাণ দিন" }, 400);
      }

      const res = await env.DB.prepare(`
        UPDATE users
        SET balance=balance+?
        WHERE id=? AND balance+?>=0
      `).bind(n, userId, n).run();

      if (!res.meta.changes) {
        return json({
          error: "ইউজার পাওয়া যায়নি অথবা ব্যালেন্স অপর্যাপ্ত"
        }, 400);
      }

      const u = await env.DB.prepare(`
        SELECT balance FROM users WHERE id=?
      `).bind(userId).first();

      const reason=String(note||"Admin credit adjustment").slice(0,160),txId=uid();
      await env.DB.prepare(`
        INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) VALUES(?,?,?,?,?,?)
      `).bind(txId,userId,"admin_adjustment",n,u.balance,reason).run();
      await createInternalMessage(env,userId,"অ্যাডমিন ব্যালেন্স আপডেট",(n>=0?"+":"")+n+" টাকা ব্যালেন্স পরিবর্তন হয়েছে। কারণ: "+reason,"balance","transaction-"+txId);
      return json({ok:true,balance:u.balance});
    }

    if (p === "/api/admin/user-password-reset" && method === "POST") {
      const adminUser = await admin();
      if (!adminUser) return json({ error: "Admin access প্রয়োজন" }, 403);
      const body = await req.json();
      const userId = String(body.userId || "");
      const newPassword = String(body.newPassword || "");
      if (!userId || newPassword.length < 6 || newPassword.length > 128) {
        return json({ error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ এবং সর্বোচ্চ ১২৮ অক্ষরের হতে হবে" }, 400);
      }
      const target = await env.DB.prepare("SELECT id FROM users WHERE id=? AND role!='admin'").bind(userId).first();
      if (!target) return json({ error: "ইউজার পাওয়া যায়নি অথবা এই অ্যাকাউন্ট রিসেট করা যাবে না" }, 404);
      const salt = uid();
      const passwordHash = await passHash(newPassword, salt);
      const updated = await env.DB.prepare("UPDATE users SET password_hash=?,password_salt=? WHERE id=? AND role!='admin'").bind(passwordHash, salt, userId).run();
      if (!updated.meta?.changes) return json({ error: "পাসওয়ার্ড পরিবর্তন করা যায়নি" }, 500);
      await env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(userId).run();
      return json({ ok: true, message: "পাসওয়ার্ড রিসেট হয়েছে; পুরোনো সব লগইন সেশন বন্ধ করা হয়েছে" });
    }

    /* ADMIN CATEGORIES */

    if (p === "/api/admin/categories" && method === "GET") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const rows = await env.DB.prepare(`
        SELECT * FROM categories ORDER BY sort_order
      `).all();

      return json({ categories: rows.results });
    }

    if (p === "/api/admin/categories" && method === "POST") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const { id, name, image_url, sort_order } = await req.json();

      if (!name) {
        return json({ error: "ক্যাটাগরির নাম দিন" }, 400);
      }

      await env.DB.prepare(`
        INSERT INTO categories(id,name,image_url,sort_order)
        VALUES(?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          image_url=excluded.image_url,
          sort_order=excluded.sort_order,
          active=1
      `).bind(
        id || uid(),
        String(name).slice(0, 80),
        String(image_url || "").slice(0, 1000),
        Number(sort_order) || 0
      ).run();

      return json({ ok: true });
    }

    if (p.startsWith("/api/admin/categories/") && method === "DELETE") {
      if (!await admin()) {        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      await env.DB.prepare(`
        UPDATE categories SET active=0 WHERE id=?
      `).bind(p.split("/").pop()).run();

      return json({ ok: true });
    }

    /* ADMIN GAMES */

    if (p === "/api/admin/games" && method === "GET") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      await env.DB.prepare("UPDATE games SET name='Aviator' WHERE id='aviator' AND name='Aviator Free'").run();
      const rows = await env.DB.prepare(`
        SELECT * FROM games ORDER BY sort_order
      `).all();

      return json({ games: rows.results });
    }

    if (p === "/api/admin/games" && method === "POST") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const {
        id, name, category_id, image_url,
        game_type, html_content, sort_order
      } = await req.json();

      if (!name || !/^[a-z0-9_-]{1,40}$/i.test(String(game_type || ""))) {
        return json({ error: "গেমের নাম ও ধরন দিন" }, 400);
      }

      const html = String(html_content || "");

      if (html.length > 500000) {
        return json({
          error: "HTML ফাইল ৫০০ KB-এর বেশি হতে পারবে না"
        }, 400);
      }

      await env.DB.prepare(`
        INSERT INTO games
        (id,name,category_id,image_url,game_type,html_content,sort_order)
        VALUES(?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          category_id=excluded.category_id,
          image_url=excluded.image_url,
          game_type=excluded.game_type,
          html_content=excluded.html_content,
          sort_order=excluded.sort_order,
          active=1
      `).bind(
        id || uid(),
        String(name).slice(0, 80),
        category_id || null,
        String(image_url || "").slice(0, 1000),
        game_type,
        html,
        Number(sort_order) || 0
      ).run();

      return json({ ok: true });
    }

    if (p === "/api/admin/game-name" && method === "POST") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      const { id, name } = await req.json();
      const gameId = String(id || "").trim();
      const gameName = String(name || "").trim().slice(0, 80);
      if (!gameId || !gameName) return json({ error: "গেমের ID ও নতুন নাম দিন" }, 400);
      const row = await env.DB.prepare("SELECT id FROM games WHERE id=?").bind(gameId).first();
      if (row) {
        await env.DB.prepare("UPDATE games SET name=? WHERE id=?").bind(gameName, gameId).run();
      } else if (gameId.startsWith("slot-display-")) {
        const current = await env.DB.prepare("SELECT value FROM settings WHERE key='game_name_overrides'").first();
        let overrides = {};
        try {
          overrides = JSON.parse(String(current?.value || "{}"));
        } catch {
          overrides = {};
        }
        overrides[gameId] = gameName;
        await env.DB.prepare("INSERT INTO settings(key,value) VALUES('game_name_overrides',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
          .bind(JSON.stringify(overrides).slice(0, 10000)).run();
      } else {
        return json({ error: "গেম পাওয়া যায়নি" }, 404);
      }
      return json({ ok: true, name: gameName });
    }

    if (p.startsWith("/api/admin/games/") && method === "DELETE") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      await env.DB.prepare(`
        UPDATE games SET active=0 WHERE id=?
      `).bind(p.split("/").pop()).run();

      return json({ ok: true });
    }

    if (p === "/api/admin/demo-deposits" && method === "GET") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS demo_deposits (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,method TEXT NOT NULL,amount INTEGER NOT NULL,demo_reference TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
      const rows = await env.DB.prepare("SELECT d.id,d.method,d.amount,d.demo_reference,d.status,d.created_at,u.username,u.email FROM demo_deposits d JOIN users u ON u.id=d.user_id ORDER BY d.created_at DESC LIMIT 200").all();
      return json({ requests: rows.results || [] });
    }

    if (p === "/api/admin/demo-deposits/review" && method === "POST") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      const body = await req.json();
      const status = String(body.status || "");
      if (!["accepted", "cancelled"].includes(status)) return json({ error: "সঠিক সিদ্ধান্ত দিন" }, 400);
      const result = await env.DB.prepare("UPDATE demo_deposits SET status=? WHERE id=? AND status='pending'").bind(status, String(body.id || "")).run();
      if (!result.meta?.changes) return json({ error: "Request পাওয়া যায়নি অথবা আগেই সিদ্ধান্ত নেওয়া হয়েছে" }, 404);
      return json({ ok: true, status });
    }

    if (p.startsWith("/api/admin/demo-deposits/") && method === "DELETE") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      const id = decodeURIComponent(p.split("/").pop());
      await env.DB.prepare("DELETE FROM demo_deposits WHERE id=?").bind(id).run();
      return json({ ok: true });
    }

    if (p === "/api/admin/withdraw-requests" && method === "GET") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS demo_withdrawals (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,method TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      try {
        await env.DB.prepare("ALTER TABLE demo_withdrawals ADD COLUMN coin_reserved INTEGER NOT NULL DEFAULT 0").run();
      } catch (e) {}
      try {
        await env.DB.prepare("ALTER TABLE demo_withdrawals ADD COLUMN wallet_number TEXT NOT NULL DEFAULT ''").run();
      } catch (e) {}
      const rows = await env.DB.prepare("SELECT d.id,d.method,d.amount,d.wallet_number,d.status,d.created_at,u.username,u.email,u.balance FROM demo_withdrawals d JOIN users u ON u.id=d.user_id ORDER BY d.created_at DESC LIMIT 200").all();
      return json({ requests: rows.results || [] });
    }

    if (p === "/api/admin/withdraw-requests/review" && method === "POST") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      const body = await req.json();
      const status = String(body.status || "");
      const id = String(body.id || "");
      if (!["approved", "rejected"].includes(status)) return json({ error: "সঠিক সিদ্ধান্ত দিন" }, 400);
      const request = await env.DB.prepare("SELECT * FROM demo_withdrawals WHERE id=? AND status='pending'").bind(id).first();
      if (!request) return json({ error: "Request পাওয়া যায়নি অথবা আগেই Review হয়েছে" }, 404);
      const updated = await env.DB.prepare("UPDATE demo_withdrawals SET status=?,reviewed_at=CURRENT_TIMESTAMP,reviewed_by=? WHERE id=? AND status='pending'").bind(status, user.id, id).run();
      if (!updated.meta?.changes) return json({ error: "Request ইতিমধ্যে Review হয়েছে" }, 409);
      if(status==="approved")await createInternalMessage(env,request.user_id,"উইথড্র সফল হয়েছে",Number(request.amount)+" টাকা Withdraw Successful.","withdrawal","withdraw-approved-"+request.id);
      if (status === "rejected" && Number(request.coin_reserved) === 1) {
        const refunded = await env.DB.prepare("UPDATE users SET balance=balance+? WHERE id=?").bind(request.amount, request.user_id).run();
        if (!refunded.meta?.changes) return json({ error: "কয়েন ফেরত দেওয়া যায়নি; Admin লগ পরীক্ষা করুন" }, 500);
        const u = await env.DB.prepare("SELECT balance FROM users WHERE id=?").bind(request.user_id).first(),txId=uid();
        await env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) VALUES(?,?,?,?,?,?)").bind(txId,request.user_id,"withdrawal_refund",request.amount,u.balance,"Coin refunded after withdrawal rejection").run();
        await createInternalMessage(env,request.user_id,"উইথড্র রিকোয়েস্ট বাতিল","আপনার "+Number(request.amount)+" টাকা Withdraw Request বাতিল হয়েছে। কয়েন ব্যালেন্সে ফেরত দেওয়া হয়েছে।","withdrawal","withdraw-rejected-"+request.id);
      }
      return json({ok:true,status});
    }

    if (p === "/api/admin/coin-requests" && method === "GET") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS coin_requests (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      const q = String(url.searchParams.get("q") || "").trim();
      const rows = q
        ? await env.DB.prepare("SELECT cr.id,cr.user_id,cr.amount,cr.status,cr.created_at,u.username,u.email FROM coin_requests cr JOIN users u ON u.id=cr.user_id WHERE u.username LIKE ? OR u.email LIKE ? ORDER BY cr.created_at DESC LIMIT 200").bind("%" + q + "%", "%" + q + "%").all()
        : await env.DB.prepare("SELECT cr.id,cr.user_id,cr.amount,cr.status,cr.created_at,u.username,u.email FROM coin_requests cr JOIN users u ON u.id=cr.user_id ORDER BY cr.created_at DESC LIMIT 200").all();
      return json({ requests: rows.results || [] });
    }

    if (p === "/api/admin/coin-requests/review" && method === "POST") {
      if (!await admin()) return json({ error: "Admin access প্রয়োজন" }, 403);
      const body = await req.json();
      const status = String(body.status || "");
      if (!["approved", "rejected"].includes(status)) return json({ error: "সঠিক সিদ্ধান্ত দিন" }, 400);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS coin_requests (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,amount INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,reviewed_at TEXT,reviewed_by TEXT)").run();
      const cr = await env.DB.prepare("SELECT * FROM coin_requests WHERE id=? AND status='pending'").bind(String(body.id || "")).first();
      if (!cr) return json({ error: "Request পাওয়া যায়নি অথবা আগেই Review হয়েছে" }, 404);
      if(status==="approved"){
        const txId=uid();
        await env.DB.batch([
          env.DB.prepare("UPDATE users SET balance=balance+? WHERE id=?").bind(cr.amount,cr.user_id),
          env.DB.prepare("INSERT INTO tk_transactions(id,user_id,type,amount,balance_after,note) SELECT ?,id,'coin_bonus',?,balance,'Admin approved coin request' FROM users WHERE id=?").bind(txId,cr.amount,cr.user_id)
        ]);
        await createInternalMessage(env,cr.user_id,"অ্যাডমিন বোনাস দিয়েছেন",Number(cr.amount)+" টাকা বোনাস যোগ হয়েছে। কারণ: অ্যাডমিন আপনার Coin Request অনুমোদন করেছেন।","bonus","transaction-"+txId);
      }
      await env.DB.prepare("UPDATE coin_requests SET status=?,reviewed_at=CURRENT_TIMESTAMP,reviewed_by=? WHERE id=? AND status='pending'").bind(status,user.id,cr.id).run();
      return json({ok:true});
    }

    /* ADMIN SETTINGS */

    if (p === "/api/admin/settings" && method === "GET") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const rows = await env.DB.prepare(`
        SELECT * FROM settings
      `).all();

      return json({ settings: rows.results });
    }

    if (p === "/api/admin/settings" && method === "POST") {
      if (!await admin()) {
        return json({ error: "Admin access প্রয়োজন" }, 403);
      }

      const { key, value } = await req.json();

      if (key === "display_number" && !/^01[3-9][0-9]{8}$/.test(String(value || ""))) {
        return json({ error: "সঠিক ১১ সংখ্যার নম্বর দিন" }, 400);
      }

      if (key === "withdraw_content") {
        try {
          const parsed = JSON.parse(String(value || "{}"));
          if (!parsed || typeof parsed !== "object" || !parsed.fields || typeof parsed.fields !== "object") throw new Error();
          for (const v of Object.values(parsed.fields)) {
            if (typeof v !== "string" || v.length > 300) throw new Error();
          }
          const required = [
            "pageTitle", "safetyNote", "methodTitle", "methodBkash", "methodNagad", "methodRocket",
            "amountLabel", "amountPlaceholder", "balanceLabel", "coinSuffix", "submitButton",
            "historyTitle", "loadingText", "emptyHistory", "recordTitle", "emptyRecord", "backButton",
            "chooseMethodError", "amountError", "balanceError", "successMessage",
            "statusPending", "statusApproved", "statusRejected", "historyCoinSuffix"
          ];
          if (required.some(k => typeof parsed.fields[k] !== "string")) throw new Error();
        } catch {
          return json({ error: "Withdrawal text data সঠিক নয়।" }, 400);
        }
      }

      if (key === "deposit_content") {
        try {
          const parsed = JSON.parse(String(value || "{}"));
          if (!parsed || typeof parsed !== "object" || !parsed.fields || typeof parsed.fields !== "object" || !Array.isArray(parsed.categories) || parsed.categories.length > 12) throw new Error();
          for (const v of Object.values(parsed.fields)) {
            if (typeof v !== "string" || v.length > 300) throw new Error();
          }
          for (const c of parsed.categories) {
            if (!c || typeof c.title !== "string" || c.title.length > 80 || typeof c.text !== "string" || c.text.length > 300) throw new Error();
          }
          const required = [
            "pageTitle", "numberLabel", "copyButton", "numberNotice", "paymentTitle",
            "amountLabel", "amountPlaceholder", "referenceLabel", "referencePlaceholder", "referenceHint",
            "submitButton", "historyTitle", "loadingText", "backButton", "chooseMethodError",
            "amountError", "referenceError", "successMessage", "emptyHistory",
            "statusPending", "statusAccepted", "statusCancelled", "currencyPrefix",
            "methodBkash", "methodNagad", "methodRocket", "copiedButton", "copySuccess",
            "preset100", "preset200", "preset300", "preset500", "preset1000"
          ];
          if (required.some(k => typeof parsed.fields[k] !== "string")) throw new Error();
        } catch {
          return json({ error: "Deposit text data সঠিক নয়।" }, 400);
        }
      }

      if (["withdraw_ids_bkash", "withdraw_ids_nagad", "withdraw_ids_rocket"].includes(key)) {
        try {
          const ids = JSON.parse(String(value || "[]"));
          if (!Array.isArray(ids) || ids.length > 10 || ids.some(x => !/^[A-Z0-9_-]{2,32}$/.test(String(x))) || new Set(ids).size !== ids.length) {
            throw new Error();
          }
        } catch {
          return json({ error: "সঠিক কোড দিন (সর্বোচ্চ ১০টি)" }, 400);
        }
      }

      if (["number_bkash", "number_nagad", "number_rocket"].includes(key) && !/^\d{11}$/.test(String(value || ""))) {
        return json({ error: "নম্বর অবশ্যই ১১ সংখ্যার হতে হবে" }, 400);
      }

      if (!key || String(key).length > 80) {
        return json({ error: "Key প্রয়োজন" }, 400);
      }

      const maxSettingLength = ["deposit_content", "withdraw_content"].includes(key) ? 16000 : 1000;
      if (String(value).length > maxSettingLength) {
        return json({ error: "Setting text limit অতিক্রম করেছে" }, 400);
      }

      await env.DB.prepare(`
        INSERT INTO settings(key,value)
        VALUES(?,?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value
      `).bind(key, String(value)).run();

      return json({ ok: true });
    }

    return json({ error: "API route পাওয়া যায়নি" }, 404);
  }

  return env.ASSETS.fetch(req);
}

async function loginUser(id, env) {
  const token = b64(crypto.getRandomValues(new Uint8Array(32)));

  await env.DB.prepare(`
    INSERT INTO sessions(token_hash,user_id,expires_at)
    VALUES(?,?,?)
  `).bind(
    await hash(token),
    id,
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).run();

  const user = await env.DB.prepare(`
    SELECT id,username,email,role,balance
    FROM users WHERE id=?
  `).bind(id).first();

  return json({ token, user });
}

export default {
  async fetch(req, env, ctx) {
    try {
      return await route(req, env);
    } catch (err) {
      console.error("TK777 Worker exception", {
        message: err?.message,
        stack: err?.stack,
        path: new URL(req.url).pathname
      });

      return json({
        error: "Worker exception",
        details: String(err?.message || err)
      }, 500);
    }
  }
};