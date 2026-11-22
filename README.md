# TK777 — Free-play arcade demo

An original mobile-first demo based on the broad navigation and visual layout in the two supplied screen recordings. It does not copy third-party game source code or proprietary artwork.

## Included
- Separate user site (`/`) and admin site (`/admin.html`)
- Email/password registration and login
- **Every new account starts with exactly 0 credits**
- Admin account also starts with 0 credits
- Admin can add or subtract free-play credits and view user accounts
- Category and game management, including category/game image URL fields
- Aviator-inspired crash mini-game with server-checked Bet, manual Cash Out, and optional Auto Cash Out target
- Super Ace-inspired simplified card mini-game
- Game/transaction history
- Admin can upload/paste an HTML mini-game (max 500 KB); it runs in a sandboxed iframe
- Cloudflare Workers + D1 database

## Important boundaries
This project is free-play only. Credits have no monetary value. It has no real-money deposits, withdrawals, payment collection, or real-money wagering. Do not present credits as Bangladeshi Taka or imply that they can be redeemed for money. The interface labels the balance as free-play credits.

## Balance and game integrity
- New user records are inserted with a balance of exactly `0`; the database default is also `0`.
- Free-play credits are not money and cannot be deposited, withdrawn, or redeemed.
- Crash Cash Out uses a D1 transactional settlement guard so repeated requests cannot credit the same round twice.

## Deploy on Cloudflare (free-tier compatible)
1. Create a GitHub repository and upload the project files, including `migrations/`.
2. In Cloudflare, create a D1 database named `tk777-db`.
3. Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` in `wrangler.toml` with the D1 database ID.
4. Run the schema once:
   `npx wrangler d1 execute tk777-db --remote --file=./schema.sql`
5. Only if you are upgrading an older deployed database that issued 10,000 signup credits, run this reset migration once:
   `npx wrangler d1 execute tk777-db --remote --file=./migrations/0002_reset_old_demo_balances.sql`
   **Do not run this reset migration again after users begin playing**, because it sets every existing account balance to zero. Skip it for a fresh database.
6. Only if you are upgrading an already-deployed database created before the `settled` column was added, run:
   `npx wrangler d1 execute tk777-db --remote --file=./migrations/0003_crash_settlement_guard.sql`
   Skip this migration for a fresh database created from the updated `schema.sql`.
7. Install/login to Wrangler:
   `npm install -g wrangler`
   `wrangler login`
8. Set the first administrator credentials as Worker secrets:
   `wrangler secret put ADMIN_EMAIL`
   `wrangler secret put ADMIN_PASSWORD`
   Use a unique, strong password. Do not put these values in GitHub.
9. Deploy:
   `wrangler deploy`
10. Open the Worker URL. The user site is `/`; the separate admin login is `/admin.html`. The first admin account is created by entering the exact `ADMIN_EMAIL` and `ADMIN_PASSWORD` secrets on the admin page. The admin account starts at 0 credits.

## Before public use
- Configure Cloudflare rate limiting and Turnstile to reduce automated signups.
- Use a strong unique admin password and keep it private.
- Test registration, login, admin credit adjustment, Crash game, card game, and history using test accounts.
- Review the code and Cloudflare configuration before sharing publicly.
- Custom HTML games are untrusted content. They run with scripts enabled but without same-origin permission in a sandboxed iframe; upload only code you trust.
- This is a demo starter, not a security audit or a guarantee of uninterrupted service.
Cloudflare build test
