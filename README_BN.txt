TK777 — Cloud-first Virtual Coin Build
=====================================

এই প্যাকেজে আগের TK777 UI/design রেখে Cloudflare D1 API-তে যুক্ত করা ফাইল আছে।

ফাইল:
- index.html                 মূল ইউজার প্যানেল (আগের কালার/লেআউট রাখা হয়েছে)
- aviator.html               Aviator UI; রাউন্ড, বেট, ক্যাশআউট ও ব্যালেন্স সার্ভার-নিয়ন্ত্রিত
- admin.html                 আলাদা অ্যাডমিন প্যানেল; Next Round Crash Multiplier ও Cloud user/request controls
- schema.sql                 বর্তমান D1-এ additive migration
- worker_routes_patch.js     আপনার বর্তমান Worker-এ যোগ করার নতুন API route/helper

গুরুত্বপূর্ণ: Worker সম্পূর্ণ নতুন করে Replace করবেন না।
------------------------------------------------------
আপনার বর্তমানে চালু Worker-এর login/password hashing/session, register, deposit/withdraw এবং admin API কোড অক্ষত রাখুন।

১) Cloudflare D1 (tk777-db) খুলে schema.sql একবার Run করুন। এটি পুরোনো users/sessions/transactions টেবিল Drop করে না।
২) বর্তমানে চালু Worker source-এ worker_routes_patch.js খুলুন।
   - `tickTK777Game` helper function-টি `export default`-এর আগে যোগ করুন।
   - `PUBLIC_GAME_ROUTES` অংশটি fetch handler-এর try{} ব্লকে, `if(p.startsWith('/api/admin/'))`-এর আগে যোগ করুন।
   - `ADMIN_GAME_ROUTES` অংশটি authenticated `/api/admin/` ব্লকে `requireAdmin` সফল হওয়ার পরে যোগ করুন।
৩) Worker Deploy করুন। ADMIN_PASSWORD secret আগের মতোই সেট থাকতে হবে।
৪) index.html, aviator.html, admin.html একই Pages/site folder-এ Upload/Deploy করুন।
৫) প্রথমবারের মতো নতুন user account Register করুন; পুরোনো LocalStorage account/balance সার্ভারে migrate হয় না।

নতুন API endpoints:
- GET  /api/game/state          Public live state; crash target ইউজারদের কাছে প্রকাশ করে না
- GET  /api/game/bets           Logged-in user's bet history
- POST /api/game/bet            Server-side bet + balance debit
- POST /api/game/bet/cancel     Pending bet cancel + refund
- POST /api/game/bet/cashout    Server-side cashout + payout
- GET/POST /api/admin/game      Admin next crash read/set

Next Round Crash:
- Admin প্যানেলে Next Round Crash multiplier সার্ভার থেকে দেখানো হবে।
- রাউন্ড চলাকালে multiplier সেট করলে সেটি পরবর্তী রাউন্ডের জন্য রাখা হবে।
- Waiting অবস্থায় সেট করলে শুরু হতে যাওয়া রাউন্ডে প্রযোজ্য হবে।
- একই D1 game_state ব্যবহার করায় সব ইউজারের জন্য একই রাউন্ড ও crash result থাকবে।
- Public game-state API-তে নির্দিষ্ট crash target পাঠানো হয় না; শুধু চলমান multiplier ও ফলাফলের ইতিহাস যায়।

ভার্চুয়াল কয়েন ও সীমাবদ্ধতা:
- এটি ভার্চুয়াল কয়েন ডেমো; বাস্তব টাকা, বাস্তব bKash/Nagad/USDT পেমেন্ট বা payout নেই।
- Deposit/Withdraw request সার্ভারে pending হিসেবে যায়; অ্যাডমিন approve/reject করে।
- অ্যাডমিন user balance server থেকে সেট করতে পারে।
- Legacy site theme/text/custom HTML game/bonus editor-এর কিছু সেটিং আগের মতো local browser storage-এ থাকতে পারে; এই build-এ সেগুলো সব device-এ cloud-sync করা হয়নি।
- Transaction PIN, profile display-name/password-change ও bonus claims এখনো server-side feature হিসেবে যুক্ত নয়; এগুলোকে secure cloud feature ধরে ব্যবহার করবেন না।

পরীক্ষা:
১) /api/health এ success:true ও database:connected দেখুন।
২) নতুন account register/login করে home balance 0.00 দেখুন।
৩) Admin login করে Cloud Dashboard এবং Next Round Crash দেখুন।
৪) Admin থেকে test multiplier দিন; Aviator page-এ সব browser-এ একই round/multiplier দেখুন।
৫) Bet/cashout করে server balance ও Bet History পরীক্ষা করুন।
৬) Deposit/Withdraw request করে admin থেকে approve/reject পরীক্ষা করুন।

কোনো real-money deposit/payment নির্দেশনা ব্যবহার করবেন না।
